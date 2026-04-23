"use client";

import { useState, Fragment } from "react";
import {
  TEMPLATES,
  CATEGORIES,
  type CategoryId,
  type Subject,
} from "../data/templates";

/* ── Silhouette SVGs ── */

function DogSilhouette({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <path
        fill="#2C1810"
        d="M12 40c0-8 5-13 11-13 2-6 6-9 11-9 2 0 3 1 4 2l4-4c1-1 3 0 3 2v6c2 1 4 3 5 6 3 1 6 3 6 7 0 3-3 4-5 4-1 5-5 8-10 8l-2 4c0 2-3 2-3 0v-3h-7v3c0 2-3 2-3 0l-1-4c-5-1-8-4-9-9-2-1-4-2-4-4z"
      />
    </svg>
  );
}

function CatSilhouette({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <path
        fill="#2C1810"
        d="M18 14l6 8c2-1 5-2 8-2s6 1 8 2l6-8c1-1 3 0 3 2v10c3 3 5 7 5 12 0 10-8 16-22 16s-22-6-22-16c0-5 2-9 5-12V16c0-2 2-3 3-2zm10 22c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zm8 0c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z"
      />
    </svg>
  );
}

/* ── Landing screen ── */

export default function Landing({
  onPick,
}: {
  onPick: (subject: Subject, templateId: string) => void;
}) {
  const [tab, setTab] = useState<CategoryId>("recommended");

  const templates = TEMPLATES[tab] || [];

  return (
    <div
      style={{
        padding: "56px 20px 32px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Editorial header row */}
      <div className="snap-editorial-row">
        <span>est. 2026</span>
        <span>ciraf inc.</span>
      </div>

      {/* Silhouettes */}
      <div className="snap-silhouettes">
        <DogSilhouette />
        <span className="snap-dot">●</span>
        <CatSilhouette />
      </div>

      {/* Wordmark */}
      <div className="snap-wordmark">
        <div className="snap-wordmark-title">SNAP STUDIO</div>
        <div className="snap-wordmark-line" />
        <div className="snap-wordmark-sub">for your loved ones</div>
      </div>

      {/* Tagline */}
      <div className="snap-tagline-main">
        今日は、どのスタジオで撮ろう？
      </div>

      {/* Section label */}
      <div className="snap-section-label">— choose your studio —</div>

      {/* Category tabs */}
      <div className="snap-category-tabs">
        {CATEGORIES.map((c, i) => (
          <Fragment key={c.id}>
            {i > 0 && <span className="snap-category-sep">·</span>}
            <button
              className={`snap-category-tab${tab === c.id ? " active" : ""}`}
              onClick={() => setTab(c.id)}
            >
              {c.label}
            </button>
          </Fragment>
        ))}
      </div>

      {/* Template grid */}
      <div className="snap-grid">
        {templates.map((t) => (
          <button
            key={t.id}
            className="snap-card"
            onClick={() => onPick("dog", t.id)}
          >
            <div className="snap-card-thumb">
              <img src={t.img} alt="" />
            </div>
            <div className="snap-card-title">{t.title}</div>
            <div className="snap-card-cat">{t.cat}</div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="snap-footer">30 templates · 7 categories</div>
    </div>
  );
}
