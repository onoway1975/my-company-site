"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import QuestionForm from "./QuestionForm";

/* ── Types ── */

export type Rarity = "COMMON" | "RARE" | "LEGENDARY" | "MYTHIC";

export interface BillyFormData {
  name: string;
  age: string;
  gender: string;
  assets_range: string;
  target_savings: string;
  investment_status: string;
  hobbies: string;
  last_luxury: string;
  anxiety: string;
}

export interface BillyResult {
  speech: string;
  closing: string;
  action_name: string;
  suggested_amount: number;
  status_tags: string[];
}

type Screen = "landing" | "form" | "calculating" | "reveal" | "card";

/* ── Constants ── */

const CALC_MESSAGES = [
  "基本情報を分析しています...",
  "資産データを評価しています...",
  "老後必要資金を算出しています...",
  "投資リターンをシミュレーション中...",
  "最終レポートを生成しています...",
];

function pickRarity(): Rarity {
  const r = Math.random() * 100;
  if (r < 5) return "MYTHIC";
  if (r < 20) return "LEGENDARY";
  if (r < 50) return "RARE";
  return "COMMON";
}

/* ── Main Component ── */

export default function WhyDieWithZeroPage() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [formData, setFormData] = useState<BillyFormData | null>(null);
  const [result, setResult] = useState<BillyResult | null>(null);
  const [rarity, setRarity] = useState<Rarity>("COMMON");
  const [error, setError] = useState<string | null>(null);

  // Calculating animation state
  const [calcProgress, setCalcProgress] = useState(0);
  const [calcMsgIdx, setCalcMsgIdx] = useState(0);

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screen]);

  // Calculating progress animation
  useEffect(() => {
    if (screen !== "calculating") {
      setCalcProgress(0);
      setCalcMsgIdx(0);
      return;
    }
    const progressTimer = setInterval(() => {
      setCalcProgress((p) => {
        const inc = Math.random() * 6 + 2;
        return Math.min(p + inc, 95);
      });
    }, 250);
    const msgTimer = setInterval(() => {
      setCalcMsgIdx((m) => (m + 1) % CALC_MESSAGES.length);
    }, 1800);
    return () => {
      clearInterval(progressTimer);
      clearInterval(msgTimer);
    };
  }, [screen]);

  const handleStart = useCallback(() => {
    setScreen("form");
  }, []);

  const handleSubmit = useCallback(async (data: BillyFormData) => {
    setFormData(data);
    const r = pickRarity();
    setRarity(r);
    setError(null);
    setScreen("calculating");

    const minWait = new Promise<void>((res) => setTimeout(res, 5000));

    try {
      const [apiRes] = await Promise.all([
        fetch("/api/whydiewithzero/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, rarity: r }),
        }),
        minWait,
      ]);
      const json = await apiRes.json();
      if (!apiRes.ok) throw new Error(json.error || "生成に失敗しました");
      setResult(json);
      setScreen("reveal");
      setTimeout(() => setScreen("card"), 2800);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "エラーが発生しました"
      );
      setScreen("form");
    }
  }, []);

  const handleReset = useCallback(() => {
    setFormData(null);
    setResult(null);
    setError(null);
    setRarity("COMMON");
    setScreen("landing");
  }, []);

  const handleSave = useCallback(async () => {
    // TODO: html-to-image で #billy-card を画像化して保存
    const el = document.getElementById("billy-card");
    if (!el) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    try {
      const { toJpeg } = await import("html-to-image");
      const dataUrl = await toJpeg(el, { quality: 0.95, pixelRatio: 2 });
      if (isMobile) {
        const w = window.open("about:blank", "_blank");
        if (w) {
          w.document.write(
            `<html><head><meta name="viewport" content="width=device-width"><title>BILLIONAIRE BILLY</title></head>` +
              `<body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0E1F3A">` +
              `<img src="${dataUrl}" style="max-width:100%;height:auto" /></body></html>`
          );
        }
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `billy_${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch {
      // fallback: ignore
    }
  }, []);

  /* ── Screens ── */

  switch (screen) {
    case "landing":
      return (
        <div className="dwz-landing">
          <div className="dwz-landing-badge">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1" />
              <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            retirement fund simulator
          </div>

          <h1 className="dwz-landing-title">
            老後資金
            <br />
            シミュレーション
          </h1>
          <p className="dwz-landing-sub">
            Your Retirement Fund Simulator
          </p>

          <div
            style={{
              width: 60,
              height: 1,
              background: "rgba(255,255,255,0.15)",
              margin: "0 auto 48px",
            }}
          />

          <p className="dwz-landing-desc">
            8つの質問に答えるだけで、
            <br />
            あなたに最適な老後の資金計画を
            <br />
            AIが無料で診断します。
          </p>

          <div className="dwz-landing-stats">
            <div>
              <div className="dwz-landing-stat-num">28,492</div>
              <div className="dwz-landing-stat-label">累計診断数</div>
            </div>
            <div>
              <div className="dwz-landing-stat-num">4.2</div>
              <div className="dwz-landing-stat-label">満足度</div>
            </div>
          </div>

          <button className="dwz-btn-primary" onClick={handleStart}>
            無料で診断する
          </button>

          <div className="dwz-landing-fine">
            ※ 所要時間 約2分
            <br />※ 個人情報は保存されません
          </div>

          <div className="dwz-landing-powered">
            powered by certified financial planner
          </div>
        </div>
      );

    case "form":
      return (
        <QuestionForm onSubmit={handleSubmit} error={error} />
      );

    case "calculating": {
      // Pie chart segments (circumference = 2π×40 ≈ 251.3)
      const C = 251.3;
      const segs = [
        { pct: 0.45, color: "#C9A961" },
        { pct: 0.25, color: "#4A7B9D" },
        { pct: 0.18, color: "#2D5F85" },
        { pct: 0.12, color: "#1A3A5C" },
      ];
      let offset = 0;

      return (
        <div className="dwz-calc">
          <div className="dwz-calc-inner">
            <div className="dwz-label" style={{ marginBottom: 30 }}>
              analyzing your data
            </div>

            <div className="dwz-calc-pie">
              <svg viewBox="0 0 100 100">
                {segs.map((s, i) => {
                  const dash = C * s.pct * (calcProgress / 100);
                  const gap = C - dash;
                  const o = offset;
                  offset += C * s.pct;
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={s.color}
                      strokeWidth="18"
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset={-o}
                      className="dwz-pie-seg"
                    />
                  );
                })}
              </svg>
            </div>

            <div className="dwz-calc-progress-track">
              <div
                className="dwz-calc-progress-fill"
                style={{ width: `${Math.round(calcProgress)}%` }}
              />
            </div>
            <div className="dwz-calc-pct">
              {Math.round(calcProgress)}%
            </div>
            <div className="dwz-calc-msg">
              {CALC_MESSAGES[calcMsgIdx]}
            </div>
          </div>
        </div>
      );
    }

    case "reveal":
      return (
        <div className="dwz-reveal" style={{ animation: "dwzShake 0.6s ease" }}>
          <div className="dwz-reveal-wait">WAIT.</div>
          <div className="dwz-reveal-sub">
            その診断結果、本当に必要か？
          </div>
        </div>
      );

    case "card":
      return (
        <div className="dwz-card-screen">
          <div className="dwz-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              id="billy-card"
              className={`dwz-card dwz-card-border-${rarity.toLowerCase()}`}
            >
              {/* Rarity */}
              <div className={`dwz-card-rarity ${rarity.toLowerCase()}`}>
                {rarity}
              </div>

              {/* Header */}
              <div className="dwz-card-header">
                <div className="dwz-card-name">BILLIONAIRE BILLY</div>
                <div className="dwz-card-epithet">&ldquo;Today-is-All&rdquo;</div>
              </div>

              {/* Avatar */}
              <div className="dwz-card-avatar">
                <div className="dwz-card-avatar-circle">
                  {/* billy.png will go here */}
                </div>
              </div>

              {/* Speech */}
              <div className="dwz-card-speech">
                {result?.speech || "..."}
              </div>

              {/* Closing */}
              <div className="dwz-card-closing">
                {result?.closing || ""}
              </div>

              {/* Footer: action + tags */}
              <div className="dwz-card-footer">
                <div className="dwz-card-action">
                  {result?.action_name || ""}
                </div>
                <div className="dwz-card-tags">
                  {result?.status_tags?.map((tag) => (
                    <span key={tag} className="dwz-card-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="dwz-card-actions">
              <button className="dwz-btn-primary" onClick={handleSave}>
                保存する
              </button>
              <button className="dwz-btn-outline" onClick={handleReset}>
                もう一度
              </button>
            </div>
          </div>
        </div>
      );
  }
}
