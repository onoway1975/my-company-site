"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ── constants ─────────────────────────────── */
const FOG_DURATION_SEC = 60;
const BRUSH_RADIUS = 14;
const FADE_ALPHA = 0.05;

type Phase = "top" | "draw" | "modal";
type Point = { x: number; y: number };
type Stroke = { points: Point[] };

/* ── PC fallback ───────────────────────────── */
function PCFallback() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
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
            maxWidth: "80%",
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
  const [phase, setPhase] = useState<Phase>("top");
  const [shareUrl, setShareUrl] = useState<string>("https://ciraf.jp/fogmail/");

  const lastPos = useRef<Point | null>(null);
  const dpr = useRef(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mouseDown = useRef(false);

  // stroke recording (normalized [0..1] coordinates)
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);

  /* ── detect PC ──────────────────────────── */
  useEffect(() => {
    const pc = navigator.maxTouchPoints === 0 && window.innerWidth > 768;
    setIsPC(pc);
  }, []);

  /* ── hide root header (chat widget is hidden via CSS in layout.tsx) ── */
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) (header as HTMLElement).style.display = "none";
    return () => {
      const header = document.querySelector("header");
      if (header) (header as HTMLElement).style.display = "";
    };
  }, []);

  /* ── init canvas when entering draw phase ─ */
  useEffect(() => {
    if (isPC !== false) return;
    if (phase === "top") return;
    const fogC = fogCanvasRef.current;
    if (!fogC) return;

    dpr.current = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (fogC.width !== w * dpr.current) {
      fogC.width = w * dpr.current;
      fogC.height = h * dpr.current;
      fogC.style.width = `${w}px`;
      fogC.style.height = `${h}px`;
    }
  }, [isPC, phase]);

  /* ── reset state when returning to top ──── */
  useEffect(() => {
    if (phase !== "top") return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    strokesRef.current = [];
    currentStrokeRef.current = null;
    setShareUrl("https://ciraf.jp/fogmail/");
  }, [phase]);

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

  /* ── getPos (device-pixel space) ───────── */
  function getPos(e: React.TouchEvent | React.MouseEvent): Point {
    const canvas = fogCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const src = "touches" in e && e.touches?.length ? e.touches[0] : (e as React.MouseEvent);
    return {
      x: (src.clientX - rect.left) * (canvas.width / rect.width),
      y: (src.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function recordPoint(pos: Point) {
    if (!currentStrokeRef.current) return;
    const canvas = fogCanvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    currentStrokeRef.current.points.push({
      x: pos.x / canvas.width,
      y: pos.y / canvas.height,
    });
  }

  /* ── 指で霧を消す ──────────────────────── */
  function eraseAt(from: Point, to: Point) {
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
    const pos = getPos(e);
    lastPos.current = pos;
    currentStrokeRef.current = { points: [] };
    recordPoint(pos);
  }
  function onTouchMove(e: React.TouchEvent) {
    e.preventDefault();
    const pos = getPos(e);
    eraseAt(lastPos.current ?? pos, pos);
    lastPos.current = pos;
    recordPoint(pos);
  }
  function onTouchEnd() {
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 1) {
      strokesRef.current.push(currentStrokeRef.current);
    }
    currentStrokeRef.current = null;
    lastPos.current = null;
  }

  /* ── mouse handlers ────────────────────── */
  function onMouseDown(e: React.MouseEvent) {
    mouseDown.current = true;
    const pos = getPos(e);
    lastPos.current = pos;
    currentStrokeRef.current = { points: [] };
    recordPoint(pos);
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!mouseDown.current) return;
    const pos = getPos(e);
    eraseAt(lastPos.current ?? pos, pos);
    lastPos.current = pos;
    recordPoint(pos);
  }
  function onMouseUp() {
    if (mouseDown.current) {
      if (currentStrokeRef.current && currentStrokeRef.current.points.length > 1) {
        strokesRef.current.push(currentStrokeRef.current);
      }
      currentStrokeRef.current = null;
    }
    mouseDown.current = false;
    lastPos.current = null;
  }

  /* ── はーっ: 霧を追加 ──────────────────── */
  function breatheFog() {
    const fogC = fogCanvasRef.current;
    if (!fogC) return;
    const ctx = fogC.getContext("2d");
    if (!ctx) return;

    const W = fogC.width;
    const H = fogC.height;
    const count = 3 + Math.floor(Math.random() * 3);

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
    startTimer();
  }

  /* ── メールアイコン → Supabase保存 → modal ── */
  const handleSend = async () => {
    console.log("[fogmail] handleSend called!!!");
    alert("[fogmail] handleSend called"); // 確認用
    console.log("[fogmail] SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    try {
      const strokes = strokesRef.current;
      console.log("[fogmail] strokes count:", strokes.length);

      const { data, error } = await supabase
        .from("fogmail_messages")
        .insert([{ stroke_data: strokes }])
        .select("id")
        .single();

      console.log("[fogmail] result:", data, error);

      if (error) throw error;

      const shareUrl = `https://ciraf.jp/fogmail/view?id=${data.id}`;
      setShareUrl(shareUrl);
      setPhase("modal");
    } catch (err) {
      console.error("[fogmail] error:", err);
      alert("[fogmail] error: " + JSON.stringify(err));
      setShareUrl("https://ciraf.jp/fogmail/");
      setPhase("modal");
    }
  };

  /* ── states ─────────────────────────────── */
  if (isPC === null) return null;
  if (isPC) return <PCFallback />;

  const mailHref = `mailto:?subject=fog mailからのメッセージ&body=曇ったガラスにメッセージを書きました。%0A10分以内に開いてください。%0A%0A${encodeURIComponent(shareUrl)}`;
  const lineHref = `https://line.me/R/msg/text/?曇ったガラスにメッセージを書きました。%0A10分以内に開いてください。%0A${encodeURIComponent(shareUrl)}`;

  const iconBtnStyle: React.CSSProperties = {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.9)",
    border: "none",
    color: "#1A6B5A",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    padding: 0,
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    fontFamily: "inherit",
  };

  /* ── TOP phase ──────────────────────────── */
  if (phase === "top") {
    return (
      <div
        style={{
          width: "100%",
          height: "100svh",
          backgroundImage: "url('/fogmail/bg_start.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 24px 80px",
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: "13px",
            textAlign: "center",
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            margin: 0,
            marginTop: "100px",
            letterSpacing: "0.05em",
          }}
        >
          曇りガラスに指で送るメッセージ
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: "13px",
              textAlign: "center",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            「はーっ」ボタンを押して<br />
            曇ったガラスに指で<br />
            メッセージを書いてみよう
          </p>
          <button
            onClick={() => setPhase("draw")}
            style={{
              padding: "14px 48px",
              background: "white",
              color: "#1A4A6B",
              fontWeight: "bold",
              fontSize: "16px",
              border: "none",
              borderRadius: "28px",
              cursor: "pointer",
            }}
          >
            始める
          </button>
        </div>
      </div>
    );
  }

  /* ── DRAW & MODAL ───────────────────────── */
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url('/fogmail/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
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

      {/* ↩ 戻る → top */}
      <button
        onClick={() => setPhase("top")}
        aria-label="トップに戻る"
        style={{ ...iconBtnStyle, position: "absolute", top: 20, right: 20 }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 14L4 9l5-5" />
          <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
        </svg>
      </button>

      {/* ✉ メール → 保存 → modal */}
      <button
        onClick={handleSend}
        aria-label="メッセージを送る"
        style={{
          ...iconBtnStyle,
          position: "absolute",
          bottom: 48,
          left: 24,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      </button>

      {/* はーっ */}
      <button
        onClick={breatheFog}
        style={{
          position: "absolute",
          bottom: 48,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          padding: "10px 28px",
          background: "rgba(255,255,255,0.9)",
          color: "#1A4A6B",
          fontWeight: "bold",
          fontSize: "15px",
          border: "none",
          borderRadius: "24px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        はーっ
      </button>

      {/* Modal */}
      {phase === "modal" && (
        <div
          onClick={() => setPhase("draw")}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 30,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 360,
              background: "#1A6B5A",
              borderRadius: 24,
              padding: "44px 28px 36px",
              position: "relative",
              color: "#fff",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            }}
          >
            <button
              onClick={() => setPhase("draw")}
              aria-label="閉じる"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.9)",
                fontSize: 22,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                fontFamily: "inherit",
              }}
            >
              ×
            </button>

            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textAlign: "center",
                marginBottom: 28,
              }}
            >
              メッセージを送る
            </p>

            <a
              href={mailHref}
              style={{
                display: "block",
                width: "80%",
                margin: "0 auto 14px",
                padding: "14px 0",
                borderRadius: 999,
                background: "#fff",
                color: "#1A6B5A",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.24em",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              MAIL
            </a>

            <a
              href={lineHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                width: "80%",
                margin: "0 auto",
                padding: "14px 0",
                borderRadius: 999,
                background: "#06C755",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.24em",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              LINE
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
