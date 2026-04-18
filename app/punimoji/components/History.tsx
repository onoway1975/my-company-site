"use client";

import { STYLES, type StyleId } from "@/lib/punimoji-prompt";

export type HistoryItem = {
  id: string;
  word: string;
  style: StyleId;
  imageUrl: string;
  createdAt: string;
};

export default function History({
  items,
  onSelect,
}: {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <p
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#2D1B3D",
          marginBottom: 12,
        }}
      >
        つくったもの
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
        }}
      >
        {items.map((item) => {
          const styleDef = STYLES.find((s) => s.id === item.style);
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              style={{
                background: "white",
                borderRadius: 16,
                overflow: "hidden",
                border: "2px solid #FFD9E3",
                padding: 0,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.word}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div style={{ padding: "6px 4px" }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#2D1B3D",
                    margin: 0,
                  }}
                >
                  {item.word}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "#8B7A9A",
                    margin: 0,
                  }}
                >
                  {styleDef?.emoji} {styleDef?.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
