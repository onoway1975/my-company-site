"use client";

import { useState, useCallback } from "react";
import { TEMPLATES, findTemplate, type Subject } from "../data/templates";

export default function Result({
  subject,
  initialTemplate,
  onBack,
  onReset,
}: {
  subject: Subject;
  initialTemplate: string | null;
  onBack: () => void;
  onReset: () => void;
}) {
  const [saved, setSaved] = useState(false);

  const selectedTpl = findTemplate(initialTemplate || "jp_03");
  const previewImg = selectedTpl?.img || "";

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }, []);

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
      onClick: () => {},
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
      onClick: () => {},
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
            {previewImg && (
              <img
                key={previewImg}
                src={previewImg}
                alt="preview"
                className="snap-fade-in"
              />
            )}
            {/* Caption overlay */}
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
          </div>
        </div>
      </div>

      {/* Save & Share */}
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
    </div>
  );
}
