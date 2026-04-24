"use client";

import { useState, useCallback } from "react";
import { findTemplate, type Subject } from "../data/templates";

export default function Result({
  subject,
  initialTemplate,
  isGenerating,
  generatedImageUrl,
  publicShareUrl,
  error,
  onBack,
  onReset,
}: {
  subject: Subject;
  initialTemplate: string | null;
  isGenerating: boolean;
  generatedImageUrl: string | null;
  publicShareUrl: string | null;
  error: string | null;
  onBack: () => void;
  onReset: () => void;
}) {
  const [saved, setSaved] = useState(false);

  const selectedTpl = findTemplate(initialTemplate || "jp_03");
  const shareReady = !!publicShareUrl;

  const handleSave = useCallback(() => {
    const url = publicShareUrl || generatedImageUrl;
    if (!url) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.open(url, "_blank");
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = `snapstudio_${Date.now()}.jpg`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }, [generatedImageUrl, publicShareUrl]);

  const handleLineShare = useCallback(() => {
    if (!publicShareUrl) {
      alert("画像の準備中です。もう少しお待ちください");
      return;
    }
    const message = `SNAP STUDIO で撮影しました\n${publicShareUrl}\n\n#SNAPSTUDIO #ciraf`;
    window.location.href = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
  }, [publicShareUrl]);

  const handleMailShare = useCallback(() => {
    if (!publicShareUrl) {
      alert("画像の準備中です。もう少しお待ちください");
      return;
    }
    const mailSubject = "SNAP STUDIOで撮影しました";
    const body = `SNAP STUDIO で撮影した写真を送ります\n\n${publicShareUrl}\n\nciraf inc. https://ciraf.jp/snap/`;
    window.location.href = `mailto:?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
  }, [publicShareUrl]);

  const actions = [
    {
      key: "save",
      label: "保存",
      en: "save",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="#F5EDE0"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 2H5a2 2 0 00-2 2v14l7-4 7 4V4a2 2 0 00-2-2z" />
        </svg>
      ),
      onClick: handleSave,
      needsShare: false,
    },
    {
      key: "line",
      label: "LINE",
      en: "line",
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 3c-5 0-9 3.2-9 7.2 0 3.6 3.3 6.6 7.8 7.1.3 0 .7.3.6.7l-.3 1.6c-.1.3.2.6.5.4 1.2-.6 6.4-3.8 8.1-6.6.6-1 1.3-2 1.3-3.2 0-4-4-7.2-9-7.2z"
            stroke="#F5EDE0"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path
            d="M7 8.5v4M7 12.5h2M11 8.5v4M11 8.5l2.5 4V8.5M15.5 8.5h1.5M15.5 10.5h1.5M15.5 12.5h1.5M15.5 8.5v4"
            stroke="#F5EDE0"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      ),
      onClick: handleLineShare,
      needsShare: true,
    },
    {
      key: "mail",
      label: "メール",
      en: "mail",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="#F5EDE0"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="16" height="12" rx="1.5" />
          <path d="M2 6l8 5 8-5" />
        </svg>
      ),
      onClick: handleMailShare,
      needsShare: true,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        paddingTop: 56,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 20px", marginBottom: 20 }}>
        <button className="snap-back-btn" onClick={onBack}>
          ‹
        </button>
        <div style={{ flex: 1 }}>
          <div className="snap-wordmark-sm">SNAP STUDIO</div>
        </div>
        <button className="snap-tone-btn" aria-label="tone adjust">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="#2C1810" strokeWidth="1" />
            <path d="M9 1v16" stroke="#2C1810" strokeWidth="1" />
            <path d="M9 1a8 8 0 010 16" fill="#2C1810" />
          </svg>
        </button>
      </div>

      {/* Preview */}
      <div style={{ padding: "0 20px", marginBottom: 22 }}>
        <div className="snap-preview-card">
          <div className="snap-preview-inner">
            {/* Loading */}
            {isGenerating && (
              <div className="snap-loading">
                <div className="snap-loading-title">撮影中...</div>
                <div className="snap-loading-sub">お待ちください</div>
                <div className="snap-loading-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {/* Error */}
            {!isGenerating && error && (
              <div className="snap-loading">
                <div className="snap-loading-title">エラー</div>
                <div className="snap-loading-sub">{error}</div>
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                  <button className="snap-retry-link" onClick={onBack}>
                    もう一度 ›
                  </button>
                  <button className="snap-retry-link" onClick={onReset}>
                    他のスタジオを試す ›
                  </button>
                </div>
              </div>
            )}

            {/* Generated image */}
            {!isGenerating && !error && generatedImageUrl && (
              <>
                <img
                  key={generatedImageUrl}
                  src={generatedImageUrl}
                  alt="generated"
                  className="snap-fade-in"
                />
                {/* Caption overlay */}
                <div className="snap-caption">
                  <div>
                    <div className="snap-caption-label">— snap studio —</div>
                    <div className="snap-caption-title">
                      {selectedTpl?.title || "未選択"}
                    </div>
                  </div>
                  <div className="snap-caption-no">
                    no. {selectedTpl?.id.replace("_", " / ") || "—"}
                  </div>
                </div>
              </>
            )}

            {/* Fallback: no generation yet, no error */}
            {!isGenerating && !error && !generatedImageUrl && selectedTpl?.img && (
              <>
                <img
                  src={selectedTpl.img}
                  alt="preview"
                  className="snap-fade-in"
                />
                <div className="snap-caption">
                  <div>
                    <div className="snap-caption-label">— preview —</div>
                    <div className="snap-caption-title">
                      {selectedTpl?.title || "未選択"}
                    </div>
                  </div>
                  <div className="snap-caption-no">
                    no. {selectedTpl?.id.replace("_", " / ") || "—"}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Save & Share — only show when generated */}
      {!isGenerating && !error && generatedImageUrl && (
        <div style={{ padding: "0 20px", marginTop: "auto", paddingBottom: 28 }}>
          <div className="snap-section-label" style={{ marginBottom: 22 }}>
            — save & share —
          </div>

          <div className="snap-actions-row">
            {actions.map((btn) => (
              <div
                key={btn.key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  opacity: btn.needsShare && !shareReady ? 0.45 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                <button className="snap-circle-btn" onClick={btn.onClick}>
                  {btn.icon}
                </button>
                <div className="snap-circle-label">
                  {btn.key === "save" && saved ? "SAVED" : btn.label}
                </div>
                <div className="snap-circle-sub">{btn.en}</div>
              </div>
            ))}
          </div>

          <div className="snap-result-divider" />

          <button className="snap-retry-link" onClick={onReset}>
            他のスタジオで撮ってみる ›
          </button>
        </div>
      )}
    </div>
  );
}
