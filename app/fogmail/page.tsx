"use client";

import { useEffect, useRef, useState } from "react";

/* ── constants ─────────────────────────────── */
const FOG_DURATION_SEC = 60;
const BRUSH_RADIUS = 14;
const FADE_ALPHA = 0.05; // 毎秒 destination-out する alpha (60秒で約95%消える)

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
  const fogCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isPC, setIsPC] = useState<boolean | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const dpr = useRef(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── detect PC ──────────────────────────── */
  useEffect(() => {
    const pc = navigator.maxTouchPoints === 0 && window.innerWidth > 768;
    setIsPC(pc);
  }, []);

  /* ── init canvas ────────────────────────── */
  useEffect(() => {
    if (isPC !== false) return;
    const fogC = fogCanvasRef.current;
    if (!fogC) return;

    dpr.current = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    fogC.width = w * dpr.current;
    fogC.height = h * dpr.current;
    fogC.style.width = `${w}px`;
    fogC.style.height = `${h}px`;
  }, [isPC]);

  /* ── タイマー: 霧をじわじわ晴らす ──────── */
  function startTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    let ticks = 0;

    timerRef.current = setInterval(() => {
      ticks++;
      const fogC = fogCanvasRef.current;
      if (!fogC) return;
      const ctx = fogC.getContext("2d");
      if (!ctx) return;

      // 毎秒、全ピクセルのalphaを少しずつ減らす
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${FADE_ALPHA})`;
      ctx.fillRect(0, 0, fogC.width, fogC.height);
      ctx.restore();

      if (ticks >= FOG_DURATION_SEC) {
        ctx.clearRect(0, 0, fogC.width, fogC.height);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 1000);
  }

  /* ── getPos ────────────────────────────── */
  function getPos(e: React.TouchEvent | React.MouseEvent): { x: number; y: number } {
    const canvas = fogCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const src = "touches" in e && e.touches?.length ? e.touches[0] : (e as React.MouseEvent);
    return {
      x: (src.clientX - rect.left) * (canvas.width / rect.width),
      y: (src.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  /* ── fogCanvas の霧を指で消す ────────────── */
  function eraseAt(from: { x: number; y: number }, to: { x: number; y: number }) {
    const fogC = fogCanvasRef.current;
    if (!fogC) return;
    const ctx = fogC.getContext("2d");
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
  }

  /* ── touch handlers ────────────────────── */
  function onTouchStart(e: React.TouchEvent) {
    e.preventDefault();
    lastPos.current = getPos(e);
  }

  function onTouchMove(e: React.TouchEvent) {
    e.preventDefault();
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
    mouseDown.current = true;
    lastPos.current = getPos(e);
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!mouseDown.current) return;
    const pos = getPos(e);
    eraseAt(lastPos.current ?? pos, pos);
    lastPos.current = pos;
  }

  function onMouseUp() {
    mouseDown.current = false;
    lastPos.current = null;
  }

  /* ── breathe (はーっ): 霧を重ねて追加 ──── */
  function breatheFog() {
    const fogC = fogCanvasRef.current;
    if (!fogC) return;
    const ctx = fogC.getContext("2d");
    if (!ctx) return;

    const W = fogC.width;
    const H = fogC.height;
    const count = 3 + Math.floor(Math.random() * 3); // 3〜5個

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    for (let i = 0; i < count; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = W * (0.3 + Math.random() * 0.2);
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, "rgba(148,168,196,0.28)");
      grd.addColorStop(1, "rgba(148,168,196,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();

    // タイマーリセット (最後のボタン押下から1分)
    startTimer();
  }

  /* ── loading / PC states ────────────────── */
  if (isPC === null) return null;
  if (isPC) return <PCFallback />;

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

        {/* Fog canvas (霧の描画 + タッチ受付) */}
        <canvas
          ref={fogCanvasRef}
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
          }}
        />

        {/* Breath button - always visible */}
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
      </div>
    </>
  );
}
