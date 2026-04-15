"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── constants ─────────────────────────────── */
const FOG_DURATION_SEC = 60;
const FOG_MAX_ALPHA = 0.85;
const BRUSH_RADIUS = 14;

/* ── PC fallback ───────────────────────────── */
function PCFallback() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        fontFamily: "'LINE Seed JP', sans-serif",
        marginTop: "-64px",
      }}
    >
      <p style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 12 }}>
        スマホ専用コンテンツです
      </p>
      <p style={{ fontSize: 14, color: "#767676", marginBottom: 24, textAlign: "center", lineHeight: 1.8 }}>
        QRコードまたはURLを<br />スマホで開いてください
      </p>
      {url && (
        <p
          style={{
            fontSize: 12,
            color: "#999",
            background: "#f7f7f7",
            padding: "8px 16px",
            borderRadius: 8,
            wordBreak: "break-all",
          }}
        >
          {url}
        </p>
      )}
    </div>
  );
}

/* ── Main Component ────────────────────────── */
export default function FogmailPage() {
  // fogCanvas: 霧を表示する (毎フレーム描き直す)
  const fogCanvasRef = useRef<HTMLCanvasElement>(null);
  // drawCanvas: 消した軌跡を保持する (destination-out マスク)
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isPC, setIsPC] = useState<boolean | null>(null);
  // "idle" = 霧なし・ボタン表示, "fogged" = 霧あり・描画中
  const [phase, setPhase] = useState<"idle" | "fogged">("idle");
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const dpr = useRef(1);
  const fogAmount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── detect PC ──────────────────────────── */
  useEffect(() => {
    const pc = navigator.maxTouchPoints === 0 && window.innerWidth > 768;
    setIsPC(pc);
  }, []);

  /* ── init canvases ─────────────────────── */
  useEffect(() => {
    if (isPC !== false) return;
    const fogC = fogCanvasRef.current;
    const drawC = drawCanvasRef.current;
    if (!fogC || !drawC) return;

    dpr.current = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (const c of [fogC, drawC]) {
      c.width = w * dpr.current;
      c.height = h * dpr.current;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
    }

    // drawCanvas を白で塗りつぶし (destination-out のマスクとして使う)
    const dCtx = drawC.getContext("2d");
    if (dCtx) {
      dCtx.fillStyle = "white";
      dCtx.fillRect(0, 0, drawC.width, drawC.height);
    }
  }, [isPC]);

  /* ── renderFog: fogCanvas を描き直す ────── */
  const renderFog = useCallback(() => {
    const fogC = fogCanvasRef.current;
    const drawC = drawCanvasRef.current;
    if (!fogC || !drawC) return;
    const ctx = fogC.getContext("2d");
    if (!ctx) return;

    const W = fogC.width;
    const H = fogC.height;
    const alpha = fogAmount.current;

    // 全面クリア
    ctx.clearRect(0, 0, W, H);

    if (alpha <= 0) return;

    // 霧を全面描画
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(148, 168, 196, ${alpha})`;
    ctx.fillRect(0, 0, W, H);

    // drawCanvas の消し軌跡をマスクとして適用
    // drawCanvas は白ベースで、消した部分が透明になっている
    // destination-in で drawCanvas と交差させる → 消した部分の霧が消える
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(drawC, 0, 0);
    ctx.restore();
  }, []);

  /* ── タイマー: 霧をじわじわ晴らす ──────── */
  useEffect(() => {
    if (phase !== "fogged") return;

    const alphaStep = FOG_MAX_ALPHA / FOG_DURATION_SEC;

    timerRef.current = setInterval(() => {
      fogAmount.current -= alphaStep;
      if (fogAmount.current <= 0) {
        fogAmount.current = 0;
        if (timerRef.current) clearInterval(timerRef.current);
        // drawCanvas リセット
        const drawC = drawCanvasRef.current;
        if (drawC) {
          const dCtx = drawC.getContext("2d");
          if (dCtx) {
            dCtx.clearRect(0, 0, drawC.width, drawC.height);
            dCtx.fillStyle = "white";
            dCtx.fillRect(0, 0, drawC.width, drawC.height);
          }
        }
        setPhase("idle");
      }
      renderFog();
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, renderFog]);

  /* ── getPos ────────────────────────────── */
  function getPos(e: React.TouchEvent | React.MouseEvent): { x: number; y: number } {
    const canvas = drawCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const src = "touches" in e && e.touches?.length ? e.touches[0] : (e as React.MouseEvent);
    return {
      x: (src.clientX - rect.left) * (canvas.width / rect.width),
      y: (src.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  /* ── drawCanvas に消し軌跡を描く ────────── */
  function eraseAt(from: { x: number; y: number }, to: { x: number; y: number }) {
    const drawC = drawCanvasRef.current;
    if (!drawC) return;
    const ctx = drawC.getContext("2d");
    if (!ctx) return;

    const r = BRUSH_RADIUS * dpr.current;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const step = 2 * dpr.current;
    const steps = Math.max(1, Math.ceil(dist / step));

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = from.x + dx * t;
      const y = from.y + dy * t;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(0.5, "rgba(0,0,0,0.5)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // fogCanvas を再描画
    renderFog();
  }

  /* ── touch handlers ────────────────────── */
  function onTouchStart(e: React.TouchEvent) {
    e.preventDefault();
    if (phase !== "fogged") return;
    lastPos.current = getPos(e);
  }

  function onTouchMove(e: React.TouchEvent) {
    e.preventDefault();
    if (phase !== "fogged") return;
    const pos = getPos(e);
    eraseAt(lastPos.current ?? pos, pos);
    lastPos.current = pos;
  }

  function onTouchEnd() {
    lastPos.current = null;
  }

  /* ── mouse handlers (for devtools) ──────── */
  const mouseDown = useRef(false);

  function onMouseDown(e: React.MouseEvent) {
    if (phase !== "fogged") return;
    mouseDown.current = true;
    lastPos.current = getPos(e);
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!mouseDown.current || phase !== "fogged") return;
    const pos = getPos(e);
    eraseAt(lastPos.current ?? pos, pos);
    lastPos.current = pos;
  }

  function onMouseUp() {
    mouseDown.current = false;
    lastPos.current = null;
  }

  /* ── breathe (はーっ) ──────────────────── */
  function breatheFog() {
    // 既存タイマーをクリア
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    fogAmount.current = FOG_MAX_ALPHA;

    // drawCanvas リセット (白で塗りつぶし)
    const drawC = drawCanvasRef.current;
    if (drawC) {
      const dCtx = drawC.getContext("2d");
      if (dCtx) {
        dCtx.clearRect(0, 0, drawC.width, drawC.height);
        dCtx.fillStyle = "white";
        dCtx.fillRect(0, 0, drawC.width, drawC.height);
      }
    }

    renderFog();
    setPhase("fogged");
  }

  /* ── loading / PC states ────────────────── */
  if (isPC === null) return null;
  if (isPC) return <PCFallback />;

  const showButton = phase === "idle";

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'LINE Seed JP';
          src: url('/fonts/LINESeedJP_OTF_Bd.woff2') format('woff2');
          font-weight: 700;
          font-display: swap;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          overflow: "hidden",
          fontFamily: "'LINE Seed JP', sans-serif",
          zIndex: 50,
          backgroundImage: "url('/fogmail/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >

        {/* Fog canvas (表示用) */}
        <canvas
          ref={fogCanvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />

        {/* Draw canvas (軌跡保持・タッチ受付) */}
        <canvas
          ref={drawCanvasRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
            cursor: phase === "fogged" ? "crosshair" : "default",
            opacity: 0,
          }}
        />

        {/* Breath button - only in idle phase */}
        {showButton && (
          <button
            onClick={breatheFog}
            style={{
              position: "absolute",
              bottom: 48,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 999,
              padding: "14px 36px",
              color: "rgba(255,255,255,0.85)",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "'LINE Seed JP', sans-serif",
              letterSpacing: "0.15em",
              cursor: "pointer",
              zIndex: 10,
              transition: "all 0.3s ease",
            }}
          >
            はーっ
          </button>
        )}

        {/* Hint text - only in idle phase */}
        {showButton && (
          <p
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "rgba(255,255,255,0.4)",
              fontSize: 13,
              textAlign: "center",
              lineHeight: 2,
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            下の「はーっ」ボタンで
            <br />
            ガラスを曇らせてから
            <br />
            指で文字を書いてみよう
          </p>
        )}
      </div>
    </>
  );
}
