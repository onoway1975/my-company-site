"use client";

import { useState } from "react";
import { STYLES, type StyleId } from "@/lib/punimoji-prompt";

export default function ResultView({
  word,
  style,
  imageUrl,
  onClose,
  onRegenerate,
}: {
  word: string;
  style: StyleId;
  imageUrl: string;
  onClose: () => void;
  onRegenerate: (newStyle: StyleId) => void;
}) {
  const [showSaveHint, setShowSaveHint] = useState(false);
  const otherStyles = STYLES.filter((s) => s.id !== style);

  const handleSave = () => {
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isMobile) {
      window.open(imageUrl, "_blank");
      setShowSaveHint(true);
    } else {
      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = `punimoji-${word}.png`;
      a.click();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(255,245,247,0.97)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 20px 60px",
        animation: "puniFadeIn 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: 16,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: 14,
            fontWeight: 700,
            color: "#FF3B8E",
            cursor: "pointer",
            padding: "8px 0",
            fontFamily: "'LINE Seed JP', sans-serif",
          }}
        >
          &larr; もう一度
        </button>
      </div>

      {/* Image */}
      <div
        className="card-puni"
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <img
          src={imageUrl}
          alt={`ぷに文字: ${word}`}
          style={{
            width: "100%",
            borderRadius: 24,
            display: "block",
          }}
        />
      </div>

      {/* Word label */}
      <p
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#2D1B3D",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        「{word}」
      </p>

      {/* Save button */}
      <button
        className="btn-puni"
        onClick={handleSave}
        style={{ width: "100%", maxWidth: 320, marginBottom: 12 }}
      >
        📥 画像を保存
      </button>

      {showSaveHint && (
        <p
          style={{
            fontSize: 12,
            color: "#8B7A9A",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          画像を長押しして「写真に保存」してください
        </p>
      )}

      {/* How-to link */}
      <a
        href="/punimoji/how-to/"
        style={{
          display: "block",
          width: "100%",
          maxWidth: 320,
          padding: "14px 0",
          borderRadius: 9999,
          border: "2px solid #FFD9E3",
          background: "white",
          color: "#FF3B8E",
          fontSize: 14,
          fontWeight: 700,
          textAlign: "center",
          textDecoration: "none",
          marginBottom: 32,
        }}
      >
        📷 ストーリーで使う方法
      </a>

      {/* Other styles */}
      <div style={{ width: "100%", maxWidth: 400 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#8B7A9A",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          このワードで別スタイル
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {otherStyles.map((s) => (
            <button
              key={s.id}
              className="style-chip"
              onClick={() => onRegenerate(s.id)}
            >
              <span className="emoji">{s.emoji}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
