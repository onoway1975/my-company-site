"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── constants ─────────────────────────────── */
const FOG_COLOR = "rgba(148, 168, 196, 0.85)";
const FOG_REFILL_ALPHA = 0.003;
const BREATH_ALPHA = 0.35;
const BREATH_STEPS = 8;

/* ── Night Cityscape SVG ───────────────────── */
function NightCityscape() {
  return (
    <svg
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0e1a" />
          <stop offset="40%" stopColor="#121830" />
          <stop offset="70%" stopColor="#1a2040" />
          <stop offset="100%" stopColor="#252a3a" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="95%" r="60%">
          <stop offset="0%" stopColor="rgba(255,200,120,0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="390" height="844" fill="url(#sky)" />
      <rect width="390" height="844" fill="url(#glow)" />

      {/* Stars */}
      {[
        [40, 60], [120, 30], [200, 80], [300, 50], [350, 100],
        [80, 150], [250, 130], [170, 45], [60, 200], [320, 180],
        [150, 220], [280, 250], [100, 280], [220, 300], [50, 340],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={0.8 + (i % 3) * 0.4} fill="rgba(255,255,255,0.5)" />
      ))}

      {/* Buildings - far back layer */}
      <rect x="0" y="580" width="45" height="264" fill="#0d1020" />
      <rect x="50" y="540" width="55" height="304" fill="#10142a" />
      <rect x="110" y="600" width="35" height="244" fill="#0e1225" />
      <rect x="150" y="520" width="60" height="324" fill="#111630" />
      <rect x="215" y="560" width="40" height="284" fill="#0f1328" />
      <rect x="260" y="500" width="50" height="344" fill="#12162e" />
      <rect x="315" y="570" width="35" height="274" fill="#0d1022" />
      <rect x="355" y="530" width="35" height="314" fill="#10142a" />

      {/* Buildings - front layer */}
      <rect x="20" y="620" width="50" height="224" fill="#0a0d18" />
      <rect x="80" y="580" width="65" height="264" fill="#0c1020" />
      <rect x="155" y="640" width="40" height="204" fill="#0b0f1c" />
      <rect x="200" y="560" width="55" height="284" fill="#0d1122" />
      <rect x="265" y="610" width="45" height="234" fill="#0a0e1a" />
      <rect x="320" y="580" width="70" height="264" fill="#0c1020" />

      {/* Windows */}
      {[
        [30, 640], [30, 665], [30, 690], [50, 640], [50, 665],
        [95, 600], [95, 625], [95, 650], [95, 675], [120, 600], [120, 650],
        [170, 660], [170, 685], [170, 710],
        [215, 580], [215, 610], [215, 640], [235, 580], [235, 640],
        [275, 630], [275, 660], [295, 630],
        [340, 600], [340, 630], [340, 660], [360, 600], [360, 660], [375, 630],
      ].map(([x, y], i) => (
        <rect
          key={`w${i}`}
          x={x}
          y={y}
          width={8}
          height={12}
          rx={1}
          fill={i % 3 === 0 ? "rgba(255,220,140,0.6)" : "rgba(180,200,255,0.3)"}
        />
      ))}

      {/* Street glow at bottom */}
      <rect x="0" y="820" width="390" height="24" fill="rgba(255,180,80,0.05)" />
      <line x1="0" y1="840" x2="390" y2="840" stroke="rgba(255,200,120,0.08)" strokeWidth="4" />
    </svg>
  );
}

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPC, setIsPC] = useState<boolean | null>(null);
  const [fogLevel, setFogLevel] = useState(0); // 0 = no fog, 1 = full fog
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const rafId = useRef<number>(0);
  const dpr = useRef(1);

  /* ── detect PC ──────────────────────────── */
  useEffect(() => {
    const pc = navigator.maxTouchPoints === 0 && window.innerWidth > 768;
    setIsPC(pc);
  }, []);

  /* ── canvas helpers ─────────────────────── */
  const getCtx = useCallback(() => {
    return canvasRef.current?.getContext("2d") ?? null;
  }, []);

  const drawFog = useCallback(
    (ctx: CanvasRenderingContext2D, alpha: number) => {
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = FOG_COLOR.replace("0.85", String(alpha));
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    },
    []
  );

  const drawDroplets = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const w = ctx.canvas.width;
      const h = ctx.canvas.height;
      ctx.save();
      ctx.globalCompositeOperation = "source-over";

      // Small round droplets
      for (let i = 0; i < 120; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = 1 + Math.random() * 3;
        ctx.beginPath();
        ctx.arc(x, y, r * dpr.current, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 215, 230, ${0.15 + Math.random() * 0.25})`;
        ctx.fill();
      }

      // Drip streaks
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * w;
        const y0 = Math.random() * h * 0.5;
        const len = 40 + Math.random() * 120;
        ctx.beginPath();
        ctx.moveTo(x, y0);
        // Slightly wavy drip path
        const steps = 8;
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const dx = (Math.random() - 0.5) * 4 * dpr.current;
          ctx.lineTo(x + dx, y0 + len * t * dpr.current);
        }
        ctx.strokeStyle = `rgba(180, 200, 220, ${0.1 + Math.random() * 0.15})`;
        ctx.lineWidth = (1 + Math.random() * 2) * dpr.current;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      ctx.restore();
    },
    []
  );

  /* ── init canvas ────────────────────────── */
  useEffect(() => {
    if (isPC !== false) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    dpr.current = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr.current;
    canvas.height = h * dpr.current;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // No initial fog — user breathes first
    setFogLevel(0);
  }, [isPC]);

  /* ── auto refill loop ──────────────────── */
  useEffect(() => {
    if (isPC !== false) return;

    let lastTime = 0;

    function refillLoop(time: number) {
      const ctx = getCtx();
      if (ctx && fogLevel > 0) {
        // Only refill every ~50ms to be gentle
        if (time - lastTime > 50) {
          drawFog(ctx, FOG_REFILL_ALPHA);
          lastTime = time;
        }
      }
      rafId.current = requestAnimationFrame(refillLoop);
    }

    rafId.current = requestAnimationFrame(refillLoop);
    return () => cancelAnimationFrame(rafId.current);
  }, [isPC, fogLevel, getCtx, drawFog]);

  /* ── unified getPos ─────────────────────── */
  function getPos(e: React.TouchEvent | React.MouseEvent): { x: number; y: number } {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const src = "touches" in e && e.touches?.length ? e.touches[0] : (e as React.MouseEvent);
    return {
      x: (src.clientX - rect.left) * (canvas.width / rect.width),
      y: (src.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function fogErase(ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 8 * dpr.current;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  /* ── touch handlers ────────────────────── */
  function onTouchStart(e: React.TouchEvent) {
    e.preventDefault();
    const pos = getPos(e);
    lastPos.current = pos;
  }

  function onTouchMove(e: React.TouchEvent) {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);
    fogErase(ctx, lastPos.current ?? pos, pos);
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
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);
    fogErase(ctx, lastPos.current ?? pos, pos);
    lastPos.current = pos;
  }

  function onMouseUp() {
    mouseDown.current = false;
    lastPos.current = null;
  }

  /* ── breathe (はーっ) ──────────────────── */
  function breatheFog() {
    const ctx = getCtx();
    if (!ctx) return;

    let step = 0;
    function applyStep() {
      if (step >= BREATH_STEPS) return;
      drawFog(ctx!, BREATH_ALPHA / BREATH_STEPS);
      step++;
      requestAnimationFrame(applyStep);
    }
    applyStep();
    drawDroplets(ctx);
    setFogLevel(1);
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
        }}
      >
        {/* Background cityscape */}
        <NightCityscape />

        {/* Fog canvas */}
        <canvas
          ref={canvasRef}
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
            cursor: "crosshair",
          }}
        />

        {/* Breath button */}
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

        {/* Hint text - only show when no fog */}
        {fogLevel === 0 && (
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
