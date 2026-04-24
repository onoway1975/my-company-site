"use client";

import { useState, Fragment } from "react";
import {
  TEMPLATES,
  CATEGORIES,
  type CategoryId,
  type Subject,
} from "../data/templates";
import LogoMark from "./LogoMark";

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

      {/* Logo */}
      <div className="snap-silhouettes">
        <LogoMark />
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
      <div className="snap-footer">12 templates · 3 categories</div>
    </div>
  );
}
