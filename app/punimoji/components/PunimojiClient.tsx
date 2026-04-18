"use client";

import { useEffect, useState, useCallback } from "react";
import { type StyleId } from "@/lib/punimoji-prompt";
import StyleSelector from "./StyleSelector";
import WordInput from "./WordInput";
import ResultView from "./ResultView";
import History, { type HistoryItem } from "./History";

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
        setIsGenerating(false);
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
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Title image */}
          <img
            src="/punimoji/title.png"
            alt="ぷに文字"
            style={{
              width: "80%",
              maxWidth: 320,
              marginBottom: 4,
            }}
          />

          <h1
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#2D1B3D",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            メーカー
          </h1>

          <p
            style={{
              fontSize: 14,
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
          <p
            style={{
              fontSize: 13,
              color: "#8B7A9A",
            }}
          >
            10秒くらい待ってね
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
