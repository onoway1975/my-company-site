"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const BRUSH_RADIUS = 14;

type Point = { x: number; y: number };
type Stroke = { points: Point[] };
// 保存形式: Stroke[] （従来の {strokes: Point[][]} 形式も後方互換でサポート）
type StrokeData = Stroke[] | { strokes?: Point[][] | Stroke[] };

type ViewState = "loading" | "ready" | "expired" | "notfound";

function normalizeStrokes(raw: unknown): Stroke[] {
  if (!raw) return [];
  // 新形式: Stroke[]
  if (Array.isArray(raw)) {
    return raw
      .map((s: unknown): Stroke | null => {
        if (s && typeof s === "object" && "points" in s && Array.isArray((s as Stroke).points)) {
          return { points: (s as Stroke).points };
        }
        if (Array.isArray(s)) {
          // 古い Point[] 形式
          return { points: s as Point[] };
        }
        return null;
      })
      .filter((s): s is Stroke => s !== null);
  }
  // 旧形式: { strokes: Point[][] } または { strokes: Stroke[] }
  if (typeof raw === "object" && raw !== null && "strokes" in raw) {
    return normalizeStrokes((raw as { strokes: unknown }).strokes);
  }
  return [];
}

function ViewInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<ViewState>("loading");
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  /* ── fetch message ─────────────────────── */
  useEffect(() => {
    if (!id) {
      setState("notfound");
      return;
    }
    (async () => {
      try {
        const { data, error } = await supabase
          .from("fogmail_messages")
          .select("stroke_data, expires_at")
          .eq("id", id)
          .maybeSingle();

        console.log("[fogmail/view] fetch result:", { data, error });

        if (error || !data) {
          setState("notfound");
          return;
        }
        // TODO: テスト後に期限チェックを復活させる
        // if (data.expires_at && new Date(data.expires_at) < new Date()) {
        //   setState("expired");
        //   return;
        // }
        const normalized = normalizeStrokes(data.stroke_data as StrokeData);
        console.log(
          "[fogmail/view] strokes:",
          normalized.length,
          "points:",
          normalized.reduce((n, s) => n + s.points.length, 0)
        );
        setStrokes(normalized);
        setState("ready");
      } catch (e) {
        console.error("[fogmail/view]", e);
        setState("notfound");
      }
    })();
  }, [id]);

  /* ── render strokes onto fog canvas ─────── */
  useEffect(() => {
    if (state !== "ready") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // apply heavy fog
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    for (let pass = 0; pass < 4; pass++) {
      const count = 5 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        const r = W * (0.3 + Math.random() * 0.2);
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, "rgba(148,168,196,0.45)");
        grd.addColorStop(1, "rgba(148,168,196,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }
    }
    ctx.restore();

    // animate stroke erasure
    if (strokes.length === 0) return;

    const BRUSH = BRUSH_RADIUS * dpr;
    let strokeIdx = 0;
    let pointIdx = 0;
    let rafId = 0;
    let canceled = false;

    function eraseSegment(from: Point, to: Point) {
      if (!ctx) return;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const step = 2 * dpr;
      const steps = Math.max(1, Math.ceil(dist / step));
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = from.x + dx * t;
        const y = from.y + dy * t;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, BRUSH);
        grad.addColorStop(0, "rgba(0,0,0,1)");
        grad.addColorStop(0.5, "rgba(0,0,0,0.5)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, BRUSH, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function step() {
      if (canceled) return;
      const POINTS_PER_FRAME = 3;
      for (let k = 0; k < POINTS_PER_FRAME; k++) {
        if (strokeIdx >= strokes.length) return;
        const points = strokes[strokeIdx].points;
        if (pointIdx >= points.length - 1) {
          strokeIdx++;
          pointIdx = 0;
          continue;
        }
        const from = { x: points[pointIdx].x * W, y: points[pointIdx].y * H };
        const to = { x: points[pointIdx + 1].x * W, y: points[pointIdx + 1].y * H };
        eraseSegment(from, to);
        pointIdx++;
      }
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);

    return () => {
      canceled = true;
      cancelAnimationFrame(rafId);
    };
  }, [state, strokes]);

  /* ── states ───────────────────────────── */
  if (state === "loading") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#767676",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.15em",
        }}
      >
        読み込み中...
      </div>
    );
  }

  if (state === "expired") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/fogmail/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(148,168,196,0.55)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        />
        <p
          style={{
            position: "relative",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.2em",
            marginBottom: 40,
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          このメッセージは消えました
        </p>
        <a
          href="/fogmail/"
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 999,
            padding: "14px 36px",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textDecoration: "none",
          }}
        >
          fog mailでメッセージを送る
        </a>
      </div>
    );
  }

  if (state === "notfound") {
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
          padding: "40px 24px",
        }}
      >
        <p
          style={{
            color: "#111",
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          メッセージが見つかりません
        </p>
        <a
          href="/fogmail/"
          style={{
            background: "#1A6B5A",
            borderRadius: 999,
            padding: "14px 36px",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textDecoration: "none",
          }}
        >
          fog mailでメッセージを送る
        </a>
      </div>
    );
  }

  /* ── ready: render fog canvas with message ── */
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
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          touchAction: "none",
        }}
      />
      <a
        href="/fogmail/"
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.9)",
          borderRadius: 999,
          padding: "14px 32px",
          color: "#1A6B5A",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textDecoration: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          zIndex: 10,
          whiteSpace: "nowrap",
        }}
      >
        fog mailでメッセージを送る
      </a>
    </div>
  );
}

export default function FogmailViewPage() {
  return (
    <Suspense fallback={null}>
      <ViewInner />
    </Suspense>
  );
}
