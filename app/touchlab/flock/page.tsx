"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import FlockCanvas, { type InteractionMode } from "./FlockCanvas";

const MODES: { key: InteractionMode; label: string }[] = [
  { key: "attract", label: "01" },
  { key: "repel", label: "02" },
];

export default function FlockPage() {
  const [mode, setMode] = useState<InteractionMode>("attract");
  const [showHelp, setShowHelp] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const resetRef = useRef<(() => void) | null>(null);
  const saveRef = useRef<(() => void) | null>(null);

  // Auto-dismiss overlay after 3s
  useEffect(() => {
    const t = setTimeout(() => setShowOverlay(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const dismissOverlay = useCallback(() => setShowOverlay(false), []);

  return (
    <div className="fixed top-16 left-0 right-0 bottom-0 flex flex-col bg-white text-[#1A1A1A]">
      {/* ── Mini Header (48px) ── */}
      <header
        className="shrink-0 flex items-center justify-between px-4 z-10 border-b border-[#E5E5E5]"
        style={{
          height: 48,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
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
        <FlockCanvas mode={mode} onResetRef={resetRef} onSaveRef={saveRef} />

        {/* Initial overlay */}
        {showOverlay && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            style={{ animation: "flockOverlayFade 3s ease-in-out forwards" }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 text-center shadow-sm max-w-[280px]">
              <p className="text-base font-bold tracking-[0.04em] mb-2">
                ぽん、と触ってみて。
              </p>
              <p className="text-sm text-[#888888] leading-relaxed">
                鳥たちが集まってくるよ。
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
          {/* Mode buttons */}
          <div className="flex gap-2 mb-3">
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`w-11 h-11 rounded-full text-sm font-medium tracking-[0.04em] transition-colors ${
                  mode === m.key
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-white text-[#1A1A1A] border border-[#1A1A1A]"
                }`}
              >
                {m.label}
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
              鳥はどうして同じ向きに飛ぶの？
            </h2>
            <div className="text-sm text-[#333] space-y-4" style={{ lineHeight: 1.7 }}>
              <p>
                リーダーがいるわけじゃない。<br />
                作戦会議もしていない。<br />
                それなのに、鳥は群れになる。
              </p>
              <p>
                実はね、たった3つのルールだけで<br />
                こうやって群れになるんだ。
              </p>
              <div className="space-y-1 pl-1">
                <p>1. ぶつからないように離れる</p>
                <p>2. 仲間と同じ向きに飛ぶ</p>
                <p>3. 仲間のまんなかに近づく</p>
              </div>
              <p>これだけ。</p>
              <p>
                魚も、虫も、ドローンも、<br />
                おなじルールで群れになっている。
              </p>
              <p>
                カナダの研究者クレイグ・レイノルズが<br />
                40年前に見つけたしくみだよ。
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
        @keyframes flockOverlayFade {
          0%, 60% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
