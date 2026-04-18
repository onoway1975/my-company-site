"use client";

import { STYLES, type StyleId } from "@/lib/punimoji-prompt";

export default function StyleSelector({
  selected,
  onSelect,
  exclude,
}: {
  selected: StyleId;
  onSelect: (id: StyleId) => void;
  exclude?: StyleId;
}) {
  const items = exclude ? STYLES.filter((s) => s.id !== exclude) : STYLES;

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        justifyContent: "center",
      }}
    >
      {items.map((s) => (
        <button
          key={s.id}
          className={`style-chip${s.id === selected ? " active" : ""}`}
          onClick={() => onSelect(s.id)}
        >
          <span className="emoji">{s.emoji}</span>
          <span>{s.name}</span>
        </button>
      ))}
    </div>
  );
}
