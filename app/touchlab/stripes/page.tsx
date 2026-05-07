"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import StripesCanvas, { PATTERNS, type PatternName } from "./StripesCanvas";

/* ── Metadata is handled via generateMetadata in layout or head ── */

const patternKeys = Object.keys(PATTERNS) as PatternName[];

export default function StripesPage() {
  const [pattern, setPattern] = useState<PatternName>("04");
  const [showHelp, setShowHelp] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const resetRef = useRef<(() => void) | null>(null);
  const saveRef = useRef<(() => void) | null>(null);

  // Auto-dismiss overlay after 3s
  useEffect(() => {
    const t = setTimeout(() => setShowOverlay(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // Dismiss overlay on first touch
  const dismissOverlay = useCallback(() => setShowOverlay(false), []);

  return (
    <div className="fixed top-16 left-0 right-0 bottom-0 flex flex-col bg-white text-[#1A1A1A]">
      {/* ── Mini Header (48px) ── */}
      <header
        className="shrink-0 flex items-center justify-between px-4 z-10 border-b border-[#E5E5E5]"
        style={{ height: 48, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      >
        <Link
          href="/touchlab"
          className="text-[13px] font-medium text-[#1A1A1A] hover:opacity-60 transition-opacity"
        >
          &larr; TOUCH LAB
        </Link>
        <button
          onClick={() => setShowHelp(true)}
          className="w-8 h-8 rounded-full border border-[#1A1A1A] bg-white flex items-center justify-center text-sm font-semibold text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
          aria-label="ヘルプ"
        >
          ?
        </button>
      </header>

      {/* ── Canvas Area ── */}
      <div className="relative flex-1 min-h-0" onPointerDown={dismissOverlay}>
        <StripesCanvas
          pattern={pattern}
          onResetRef={resetRef}
          onSaveRef={saveRef}
        />

        {/* Initial overlay */}
        {showOverlay && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            style={{
              animation: "stripesOverlayFade 3s ease-in-out forwards",
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 text-center shadow-sm max-w-[280px]">
              <p className="text-base font-bold tracking-[0.04em] mb-2">
                指で、ぽとっ。
              </p>
              <p className="text-sm text-[#888888] leading-relaxed">
                画面に絵の具を落としてみて。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom UI Bar ── */}
      <div
        className="shrink-0 bg-white/90 backdrop-blur-sm border-t border-[#E5E5E5] z-20"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="px-4 py-3">
          {/* Pattern buttons */}
          <div className="flex gap-2 mb-3">
            {patternKeys.map((key) => (
              <button
                key={key}
                onClick={() => setPattern(key)}
                className={`w-11 h-11 rounded-full text-sm font-medium tracking-[0.04em] transition-colors ${
                  pattern === key
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-white text-[#1A1A1A] border border-[#1A1A1A]"
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => resetRef.current?.()}
              className="flex-1 h-11 rounded-full border border-[#E5E5E5] text-sm tracking-[0.06em] text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
            >
              やりなおす
            </button>
            <button
              onClick={() => saveRef.current?.()}
              className="flex-1 h-11 rounded-full bg-[#1A1A1A] text-white text-sm tracking-[0.06em] hover:bg-[#333] transition-colors"
            >
              ほぞん
            </button>
          </div>
        </div>
      </div>

      {/* ── Help Modal ── */}
      {showHelp && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 100, background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white w-[80%] max-w-[400px] shadow-lg"
            style={{ zIndex: 101, borderRadius: 16, padding: "32px 24px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[20px] font-semibold mb-5">
              これ、���んの模様？
            </h2>
            <div className="text-sm text-[#333] space-y-4" style={{ lineHeight: 1.7 }}>
              <p>
                世界には、ふしぎな模様が��くさんあるよね。
              </p>
              <div className="space-y-1 pl-1">
                <p>&#x1F993; シマウマ</p>
                <p>&#x1F406; ヒョウ</p>
                <p>&#x1F992; キリン</p>
                <p>&#x1FAB8; サンゴ</p>
                <p>&#x1F41F; ねったいぎょ</p>
                <p>&#x270B; きみの指紋</p>
              </div>
              <p>
                ぜんぶ、おなじ&ldquo;化学反応&rdquo;から生まれているんだ。
              </p>
              <p>
                70���前、<br />
                イギリスの天才数学者 アラン・チューリングが<br />
                この数式を見��けた。
              </p>
              <p>
                世界の&ldquo;もよう&rdquo;は、<br />
                たった一つのルールでできている。
              </p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full bg-[#1A1A1A] text-white text-sm font-medium rounded-lg hover:bg-[#333] transition-colors"
              style={{ padding: 12 }}
            >
              とじる
            </button>
          </div>
        </div>
      )}

      {/* ── Keyframe for overlay fade ── */}
      <style>{`
        @keyframes stripesOverlayFade {
          0%, 60% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
