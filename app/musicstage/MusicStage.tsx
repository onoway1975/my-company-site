"use client";

import { useEffect, useRef, useState } from "react";

const SCRIPTS = [
  "https://unpkg.com/three@0.128.0/build/three.min.js",
  "https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js",
  "/musicstage/chara-model.js",
  "/musicstage/stage.js",
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-cs-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "1") resolve();
      else {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("load failed: " + src)));
      }
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = false; // preserve execution order
    s.dataset.csSrc = src;
    s.addEventListener("load", () => {
      s.dataset.loaded = "1";
      resolve();
    });
    s.addEventListener("error", () => reject(new Error("load failed: " + src)));
    document.head.appendChild(s);
  });
}

type Track = {
  id: number;
  trackName: string;
  artistName: string;
  previewUrl: string;
  artwork: string;
};

declare global {
  interface Window {
    CharaStageApp?: { init: (root: HTMLElement) => void; destroy: () => void };
    CharaStage?: { loadTrack?: (url: string, name: string) => void };
  }
}

export default function MusicStage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch() {
    const term = query.trim();
    if (!term) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/musicstage/search?term=${encodeURIComponent(term)}`);
      if (!r.ok) throw new Error("bad status");
      const data = await r.json();
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch {
      setError("検索に失敗しました");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function pick(track: Track) {
    const proxied = `/api/musicstage/preview?u=${encodeURIComponent(track.previewUrl)}`;
    window.CharaStage?.loadTrack?.(proxied, `${track.trackName} — ${track.artistName}`);
    setSearchOpen(false);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        for (const src of SCRIPTS) await loadScript(src);
        if (cancelled || !rootRef.current || !window.CharaStageApp) return;
        window.CharaStageApp.init(rootRef.current);
      } catch (e) {
        console.error("[MusicStage]", e);
      }
    })();
    return () => {
      cancelled = true;
      window.CharaStageApp?.destroy();
    };
  }, []);

  return (
    <div className="cs-root" ref={rootRef}>
      <div className="cs-canvas" data-canvas />

      <div className="cs-titlechip">
        <div className="cs-dot" />
        <div>
          <b>MUSIC STAGE</b>
        </div>
      </div>

      <div className="cs-hint">
        デモビートを再生するか、曲を探してください
        <br />
        ドラッグで視点 ・ ホイールでズーム
      </div>

      <div className="cs-bar">
        <button className="cs-btn" data-demo type="button">
          <svg className="cs-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l11-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="17" cy="16" r="3" />
          </svg>
          デモビート
        </button>

        <button
          className={"cs-btn" + (searchOpen ? " on" : "")}
          type="button"
          onClick={() => setSearchOpen((v) => !v)}
          aria-expanded={searchOpen}
        >
          <svg className="cs-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          曲を探す
        </button>

        <button className="cs-btn" data-play type="button" style={{ display: "none" }}>
          <svg className="cs-ic" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span data-play-label>再生</span>
        </button>

        <span className="cs-songname" data-song />

        <div className="cs-sep" />
        <span className="cs-sld">
          感度
          <input type="range" data-sens min="0.5" max="2" step="0.05" defaultValue="1" aria-label="感度" />
        </span>
      </div>

      {searchOpen && (
        <div className="cs-search" role="dialog" aria-label="曲を探す">
          <div className="cs-search-row">
            <input
              className="cs-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
              placeholder="曲名・アーティストで検索"
              aria-label="曲名・アーティストで検索"
              autoFocus
            />
            <button className="cs-btn cs-search-go" type="button" onClick={runSearch} disabled={loading}>
              {loading ? "…" : "検索"}
            </button>
          </div>
          <div className="cs-search-list">
            {loading && <div className="cs-search-note">検索中…</div>}
            {!loading && error && <div className="cs-search-note">{error}</div>}
            {!loading && !error && results.length === 0 && (
              <div className="cs-search-note">曲名やアーティスト名で検索してください</div>
            )}
            {!loading &&
              !error &&
              results.map((t) => (
                <button key={t.id} className="cs-search-item" type="button" onClick={() => pick(t)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="cs-search-art" src={t.artwork} alt="" width={40} height={40} loading="lazy" />
                  <span className="cs-search-meta">
                    <span className="cs-search-track">{t.trackName}</span>
                    <span className="cs-search-artist">{t.artistName}</span>
                  </span>
                </button>
              ))}
          </div>
          <div className="cs-search-foot">30秒プレビュー・iTunes Search API</div>
        </div>
      )}

      <div className="cs-toast" data-toast />

      <style jsx>{`
        .cs-root {
          --green: #6cba62;
          --panel: #16181acc;
          --stroke: #ffffff1f;
          position: relative;
          width: 100%;
          height: clamp(520px, 82dvh, 920px);
          border-radius: 18px;
          overflow: hidden;
          background: #050507;
          color: #e8efe6;
          font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", -apple-system, "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
          touch-action: none;
        }
        .cs-canvas {
          position: absolute;
          inset: 0;
        }
        .cs-canvas :global(canvas) {
          display: block;
        }
        .cs-titlechip {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--panel);
          backdrop-filter: blur(10px);
          border: 1px solid var(--stroke);
          border-radius: 14px;
          padding: 9px 14px 9px 10px;
        }
        .cs-dot {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #95d18e, var(--green) 60%, #4d9a46);
        }
        .cs-titlechip b {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #fff;
        }
        .cs-titlechip span {
          font-size: 11px;
          color: #9fb39b;
          margin-left: 6px;
          letter-spacing: 0.08em;
        }
        .cs-hint {
          position: absolute;
          right: 16px;
          top: 16px;
          z-index: 10;
          font-size: 11.5px;
          color: #8d9c8a;
          background: var(--panel);
          backdrop-filter: blur(10px);
          border: 1px solid var(--stroke);
          border-radius: 11px;
          padding: 7px 11px;
          line-height: 1.5;
          text-align: right;
        }
        .cs-bar {
          position: absolute;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--panel);
          backdrop-filter: blur(12px);
          border: 1px solid var(--stroke);
          border-radius: 16px;
          padding: 8px;
          max-width: calc(100% - 24px);
          flex-wrap: wrap;
          justify-content: center;
        }
        .cs-btn {
          appearance: none;
          border: 1px solid transparent;
          cursor: pointer;
          text-decoration: none;
          font: inherit;
          font-size: 13px;
          font-weight: 600;
          color: #dfe8dc;
          background: #ffffff14;
          border-radius: 11px;
          padding: 9px 13px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: background 0.16s ease, transform 0.16s ease;
          white-space: nowrap;
        }
        .cs-btn:hover {
          background: #ffffff22;
        }
        .cs-btn:active {
          transform: translateY(1px);
        }
        .cs-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px #050507, 0 0 0 4px var(--green);
        }
        .cs-btn.on {
          background: var(--green);
          color: #0d1a0b;
          box-shadow: 0 3px 14px rgba(108, 186, 98, 0.4);
        }
        .cs-ic {
          width: 15px;
          height: 15px;
          display: inline-block;
          flex: none;
        }
        .cs-sep {
          width: 1px;
          height: 24px;
          background: var(--stroke);
          margin: 0 3px;
        }
        .cs-sld {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #9fb39b;
          padding: 0 6px;
        }
        .cs-sld input {
          width: 90px;
          accent-color: var(--green);
        }
        .cs-search {
          position: absolute;
          left: 50%;
          bottom: 74px;
          transform: translateX(-50%);
          z-index: 15;
          width: min(420px, calc(100% - 24px));
          background: #14171acc;
          backdrop-filter: blur(14px);
          border: 1px solid var(--stroke);
          border-radius: 16px;
          padding: 10px;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
        }
        .cs-search-row {
          display: flex;
          gap: 7px;
        }
        .cs-search-input {
          flex: 1;
          min-width: 0;
          font: inherit;
          font-size: 13px;
          color: #e8efe6;
          background: #ffffff10;
          border: 1px solid var(--stroke);
          border-radius: 10px;
          padding: 9px 11px;
          outline: none;
        }
        .cs-search-input::placeholder {
          color: #7c8a79;
        }
        .cs-search-input:focus-visible {
          border-color: var(--green);
          box-shadow: 0 0 0 2px rgba(108, 186, 98, 0.35);
        }
        .cs-search-go {
          flex: none;
        }
        .cs-search-go:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .cs-search-list {
          margin-top: 8px;
          max-height: min(46vh, 280px);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .cs-search-note {
          font-size: 12px;
          color: #8d9c8a;
          padding: 14px 6px;
          text-align: center;
        }
        .cs-search-item {
          appearance: none;
          border: 0;
          cursor: pointer;
          background: transparent;
          color: inherit;
          font: inherit;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 8px;
          border-radius: 10px;
          text-align: left;
          transition: background 0.14s ease;
        }
        .cs-search-item:hover,
        .cs-search-item:focus-visible {
          background: #ffffff14;
          outline: none;
        }
        .cs-search-art {
          flex: none;
          width: 40px;
          height: 40px;
          border-radius: 7px;
          object-fit: cover;
          background: #ffffff12;
        }
        .cs-search-meta {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .cs-search-track {
          font-size: 12.5px;
          font-weight: 600;
          color: #e8efe6;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cs-search-artist {
          font-size: 11px;
          color: #9fb39b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cs-search-foot {
          margin-top: 8px;
          font-size: 10px;
          color: #6b7a68;
          text-align: right;
          letter-spacing: 0.04em;
        }
        .cs-songname {
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 500;
          color: #9fb39b;
          font-size: 11.5px;
        }
        .cs-toast {
          position: absolute;
          left: 50%;
          bottom: 84px;
          transform: translateX(-50%) translateY(8px);
          z-index: 20;
          background: #fff;
          color: #101510;
          font-size: 12.5px;
          font-weight: 600;
          padding: 9px 15px;
          border-radius: 11px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s, transform 0.25s;
        }
        .cs-toast.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        @media (max-width: 640px) {
          .cs-hint {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
