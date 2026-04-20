"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { type StyleId } from "@/lib/punimoji-prompt";
import StyleSelector from "./StyleSelector";
import WordInput from "./WordInput";
import ResultView from "./ResultView";
import History, { type HistoryItem } from "./History";

const EXPECTED_DURATION = 60000; // 60秒

const STORAGE_KEY = "punimoji_history";
const MAX_HISTORY = 20;

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)));
}

export default function PunimojiClient() {
  const [word, setWord] = useState("");
  const [style, setStyle] = useState<StyleId>("puni");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Result state
  const [resultWord, setResultWord] = useState("");
  const [resultStyle, setResultStyle] = useState<StyleId>("puni");
  const [resultImageUrl, setResultImageUrl] = useState("");
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleGenerate = useCallback(
    async (overrideWord?: string, overrideStyle?: StyleId) => {
      const w = overrideWord ?? word;
      const s = overrideStyle ?? style;
      if (!w.trim()) return;

      setIsGenerating(true);
      setError(null);
      setProgress(0);

      // プログレスバー開始
      const startTime = Date.now();
      progressRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        let p: number;
        if (elapsed < EXPECTED_DURATION * 0.9) {
          p = (elapsed / EXPECTED_DURATION) * 90;
        } else {
          const extra = elapsed - EXPECTED_DURATION * 0.9;
          p = 90 + Math.min(9, extra / 3000);
        }
        setProgress(Math.min(99, p));
      }, 100);

      try {
        const res = await fetch("/api/punimoji/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word: w.trim(), style: s }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "エラーが発生しました");
          setIsGenerating(false);
          return;
        }

        if (data.remainingToday !== undefined) {
          setRemaining(data.remainingToday);
        }

        // 100%にしてから少し待って結果表示
        setProgress(100);
        await new Promise((r) => setTimeout(r, 300));

        // Show result
        setResultWord(w.trim());
        setResultStyle(s);
        setResultImageUrl(data.imageUrl);
        setShowResult(true);

        // Save to history
        const item: HistoryItem = {
          id: crypto.randomUUID(),
          word: w.trim(),
          style: s,
          imageUrl: data.imageUrl,
          createdAt: new Date().toISOString(),
        };
        const updated = [item, ...history].slice(0, MAX_HISTORY);
        setHistory(updated);
        saveHistory(updated);
      } catch {
        setError("ぷに生成に失敗しました。もう一度お試しください");
      } finally {
        if (progressRef.current) clearInterval(progressRef.current);
        setIsGenerating(false);
        setProgress(0);
      }
    },
    [word, style, history]
  );

  const handleRegenerate = (newStyle: StyleId) => {
    setShowResult(false);
    handleGenerate(resultWord, newStyle);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setResultWord(item.word);
    setResultStyle(item.style);
    setResultImageUrl(item.imageUrl);
    setShowResult(true);
  };

  return (
    <>
      <div
        className="bg-sunburst"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px 80px",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 720, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Title image */}
          <img
            src="/punimoji/title.png"
            alt="ぷに文字メーカー"
            className="puni-title-img"
            style={{
              width: "92%",
              maxWidth: 720,
              marginTop: 40,
            }}
          />

          <p
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "#8B7A9A",
              marginBottom: 32,
              textAlign: "center",
            }}
          >
            好きな言葉をぷっくり文字に
          </p>

          {/* Word input */}
          <div style={{ marginBottom: 24, width: "100%", display: "flex", justifyContent: "center" }}>
            <WordInput word={word} onChange={setWord} />
          </div>

          {/* Style selector */}
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#8B7A9A",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            スタイル
          </p>
          <div style={{ marginBottom: 28, width: "100%" }}>
            <StyleSelector selected={style} onSelect={setStyle} />
          </div>

          {/* Generate button */}
          <button
            className="btn-puni"
            onClick={() => handleGenerate()}
            disabled={!word.trim() || isGenerating}
            style={{ width: "100%", maxWidth: 280, marginBottom: 12 }}
          >
            つくる ✨
          </button>

          {/* How-to link */}
          <a
            href="/punimoji/how-to/"
            style={{
              display: "block",
              width: "100%",
              maxWidth: 280,
              padding: "14px 0",
              borderRadius: 9999,
              border: "2px solid #FFD9E3",
              background: "white",
              color: "#FF3B8E",
              fontSize: 14,
              fontWeight: 700,
              textAlign: "center",
              textDecoration: "none",
              marginBottom: 24,
            }}
          >
            📷 ストーリーで使う方法
          </a>

          {/* Error */}
          {error && (
            <p
              style={{
                fontSize: 13,
                color: "#E91E7A",
                textAlign: "center",
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              {error}
            </p>
          )}

          {/* Remaining */}
          {remaining !== null && (
            <p
              style={{
                fontSize: 12,
                color: "#8B7A9A",
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              今日あと {remaining} 回
            </p>
          )}

          {/* Divider */}
          {history.length > 0 && (
            <div
              style={{
                width: "100%",
                height: 1,
                background: "#FFD9E3",
                marginBottom: 24,
              }}
            />
          )}

          {/* History */}
          <History items={history} onSelect={handleHistorySelect} />
        </div>
      </div>

      {/* Loading overlay */}
      {isGenerating && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(255,59,142,0.15)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 40,
              animation: "puniFloat 1.2s ease-in-out infinite",
              display: "flex",
              gap: 8,
            }}
          >
            <span style={{ animationDelay: "0s", animation: "puniFloat 1.2s ease-in-out infinite" }}>🫧</span>
            <span style={{ animationDelay: "0.2s", animation: "puniFloat 1.2s ease-in-out 0.2s infinite" }}>🫧</span>
            <span style={{ animationDelay: "0.4s", animation: "puniFloat 1.2s ease-in-out 0.4s infinite" }}>🫧</span>
          </div>
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#2D1B3D",
            }}
          >
            ぷっくり作成中...
          </p>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#8B7A9A",
            }}
          >
            ぷっくりするまで1分くらい待ってね 🫧
          </p>
        </div>
      )}

      {/* Result view */}
      {showResult && resultImageUrl && (
        <ResultView
          word={resultWord}
          style={resultStyle}
          imageUrl={resultImageUrl}
          onClose={() => setShowResult(false)}
          onRegenerate={handleRegenerate}
        />
      )}
    </>
  );
}
