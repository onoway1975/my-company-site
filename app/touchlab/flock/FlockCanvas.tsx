"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import {
  Boid,
  createFlock,
  DEFAULT_CONFIG,
  NUM_CHARACTERS,
  type Vec2,
  type BoidConfig,
} from "./boids";

export type InteractionMode = "attract" | "repel";

interface Props {
  mode: InteractionMode;
  onResetRef: React.MutableRefObject<(() => void) | null>;
  onSaveRef: React.MutableRefObject<(() => void) | null>;
}

/* ── Color variants for SVG characters ── */

type ColorSet = {
  normal: HTMLImageElement[];
  food: HTMLImageElement[];
  enemy: HTMLImageElement[];
};

const COLOR_MAP = {
  normal: "#1A1A1A",
  food: "#FF8C42",
  enemy: "#CC2200",
} as const;

async function loadCharactersWithColors(): Promise<ColorSet> {
  const result: ColorSet = { normal: [], food: [], enemy: [] };
  const colorEntries = Object.entries(COLOR_MAP) as [keyof ColorSet, string][];

  // Fetch all SVG sources in parallel
  const fetches: Promise<string>[] = [];
  for (let i = 1; i <= NUM_CHARACTERS; i++) {
    const num = String(i).padStart(3, "0");
    fetches.push(
      fetch(`/touchlab/characters/char_${num}.svg`)
        .then((r) => r.text())
        .catch(() => ""),
    );
  }
  const svgTexts = await Promise.all(fetches);

  // Generate colored image variants
  const imgPromises: Promise<void>[] = [];

  for (let ci = 0; ci < svgTexts.length; ci++) {
    const svgText = svgTexts[ci];
    if (!svgText) {
      // Fallback: push empty images
      for (const [colorName] of colorEntries) {
        result[colorName].push(new Image());
      }
      continue;
    }

    for (const [colorName, colorValue] of colorEntries) {
      const coloredSvg = svgText.replace(/currentColor/g, colorValue);
      const blob = new Blob([coloredSvg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.src = url;
      result[colorName].push(img);

      imgPromises.push(
        new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
      );
    }
  }

  await Promise.all(imgPromises);
  return result;
}

/* ── Component ── */

export default function FlockCanvas({ mode, onResetRef, onSaveRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boidsRef = useRef<Boid[]>([]);
  const configRef = useRef<BoidConfig>(DEFAULT_CONFIG);
  const modeRef = useRef<InteractionMode>(mode);
  modeRef.current = mode;
  const pointerRef = useRef<Vec2 | null>(null);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const charsRef = useRef<ColorSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  // Initialize
  useEffect(() => {
    const canvas = canvasRef.current!;
    const config = { ...DEFAULT_CONFIG };
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      config.numBoids = 120;
    }
    configRef.current = config;

    // Canvas sizing: 1:1 (no dpr scaling) for perf with many images
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height);
      sizeRef.current = { w: rect.width, h: rect.height };
    };
    resize();

    const charSize = isMobile ? 24 : 32;

    const ctx = canvas.getContext("2d")!;

    // Load characters then start
    loadCharactersWithColors().then((chars) => {
      charsRef.current = chars;
      const { w, h } = sizeRef.current;
      boidsRef.current = createFlock(config.numBoids, w, h, config);

      setLoading(false);
      // Trigger fade-in
      requestAnimationFrame(() => setFadeIn(true));

      const step = () => {
        const boids = boidsRef.current;
        const cfg = configRef.current;
        const { w: cw, h: ch } = sizeRef.current;
        const pointer = pointerRef.current;
        const currentMode = modeRef.current;
        const now = Date.now();

        const attractor = currentMode === "attract" ? pointer : null;
        const repeller = currentMode === "repel" ? pointer : null;

        const attractorRangeSq = cfg.attractorRange * cfg.attractorRange;
        const repellerRangeSq = cfg.repellerRange * cfg.repellerRange;

        // Update all boids
        for (let i = 0; i < boids.length; i++) {
          boids[i].update(boids, attractor, repeller, cfg, cw, ch);
        }

        // Clear
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw attractor/repeller indicator
        if (pointer) {
          if (currentMode === "attract") {
            const t = now * 0.004;
            const r = 8 + Math.sin(t) * 3;
            ctx.beginPath();
            ctx.arc(pointer.x, pointer.y, r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 217, 61, 0.5)";
            ctx.fill();
          } else {
            ctx.strokeStyle = "#CC2200";
            ctx.lineWidth = 2.5;
            ctx.lineCap = "round";
            const s = 8;
            ctx.beginPath();
            ctx.moveTo(pointer.x - s, pointer.y - s);
            ctx.lineTo(pointer.x + s, pointer.y + s);
            ctx.moveTo(pointer.x + s, pointer.y - s);
            ctx.lineTo(pointer.x - s, pointer.y + s);
            ctx.stroke();
          }
        }

        // Draw boids as character images
        for (let i = 0; i < boids.length; i++) {
          const b = boids[i];
          const px = b.position.x;
          const py = b.position.y;

          // Skip off-screen
          if (px < -charSize || px > cw + charSize) continue;
          if (py < -charSize || py > ch + charSize) continue;

          // Check if in attractor/repeller range
          let inFood = false;
          let inEnemy = false;
          if (attractor) {
            const dx = attractor.x - px;
            const dy = attractor.y - py;
            if (dx * dx + dy * dy < attractorRangeSq) inFood = true;
          }
          if (repeller) {
            const dx = repeller.x - px;
            const dy = repeller.y - py;
            if (dx * dx + dy * dy < repellerRangeSq) inEnemy = true;
          }

          // Fade colorPhase
          const target = inFood || inEnemy ? 1 : 0;
          b.colorPhase += (target - b.colorPhase) * 0.1;

          // Pick image
          let img: HTMLImageElement;
          if (b.colorPhase < 0.5) {
            img = chars.normal[b.charIndex];
          } else if (inEnemy) {
            img = chars.enemy[b.charIndex];
          } else {
            img = chars.food[b.charIndex];
          }
          if (!img || !img.complete) continue;

          const angle = Math.atan2(b.velocity.y, b.velocity.x);
          const sz = charSize * b.sizeMul;
          const half = sz / 2;

          // Wobble for liveliness
          const wobble = Math.sin(now * 0.005 + i) * 1.5;

          ctx.save();
          ctx.translate(px, py + wobble);
          ctx.rotate(angle);
          ctx.globalAlpha = 0.35 + b.colorPhase * 0.65;
          ctx.drawImage(img, -half, -half, sz, sz);
          ctx.restore();
        }

        rafRef.current = requestAnimationFrame(step);
      };

      rafRef.current = requestAnimationFrame(step);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Pointer handlers
  const getCanvasPos = useCallback(
    (clientX: number, clientY: number): Vec2 => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      pointerRef.current = getCanvasPos(e.clientX, e.clientY);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [getCanvasPos],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.pressure > 0) {
        pointerRef.current = getCanvasPos(e.clientX, e.clientY);
      }
    },
    [getCanvasPos],
  );

  const handlePointerUp = useCallback(() => {
    pointerRef.current = null;
  }, []);

  // Reset
  onResetRef.current = useCallback(() => {
    const { w, h } = sizeRef.current;
    const cfg = configRef.current;
    boidsRef.current = createFlock(cfg.numBoids, w, h, cfg);
  }, []);

  // Save
  onSaveRef.current = useCallback(() => {
    const canvas = canvasRef.current;
    const chars = charsRef.current;
    if (!canvas || !chars) return;

    const boids = boidsRef.current;
    const cw = sizeRef.current.w;
    const ch = sizeRef.current.h;
    const ctx = canvas.getContext("2d")!;
    const charSize = window.innerWidth < 768 ? 24 : 32;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < boids.length; i++) {
      const b = boids[i];
      const img = chars.normal[b.charIndex];
      if (!img || !img.complete) continue;

      const angle = Math.atan2(b.velocity.y, b.velocity.x);
      const sz = charSize * b.sizeMul;
      const half = sz / 2;

      ctx.save();
      ctx.translate(b.position.x, b.position.y);
      ctx.rotate(angle);
      ctx.globalAlpha = 1;
      ctx.drawImage(img, -half, -half, sz, sz);
      ctx.restore();
    }

    // Ensure off-screen boids don't affect, just capture what's visible
    void cw;
    void ch;

    const dataUrl = canvas.toDataURL("image/png");
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.open(dataUrl, "_blank");
    } else {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `flock_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, []);

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
          <p className="text-sm text-[#888888] tracking-[0.04em]">
            キャラを呼んでいるよ...
          </p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full transition-opacity duration-1000"
        style={{ touchAction: "none", opacity: fadeIn ? 1 : 0 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </>
  );
}
