"use client";

import { useState, useEffect, useCallback } from "react";

/* ── Types ── */

type Flower = {
  name_ja: string;
  name_en: string;
  meaning: string;
  color: string;
};

type BouquetResult = {
  id: string;
  url: string;
  imageUrl: string;
  bouquetTheme: string;
  flowers: Flower[];
  palette: { primary: string; secondary: string; accent: string; mood: string };
  wrapping: { paper: string; tie: string; description_en: string };
  message: string;
  remainingToday: number;
};

type Phase = "form" | "loading" | "preview" | "share";

/* ── Loading texts ── */

const LOADING_STEPS = [
  "finding {name}'s colors",
  "choosing the flowers",
  "writing a letter",
  "tying the bouquet",
  "adding final touches",
];

/* ── Component ── */

export default function FlowermailPage() {
  const [phase, setPhase] = useState<Phase>("form");

  // Form state
  const [recipientName, setRecipientName] = useState("");
  const [description, setDescription] = useState("");
  const [senderName, setSenderName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Loading state
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  // Result state
  const [result, setResult] = useState<BouquetResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Hide header/footer via DOM
  useEffect(() => {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    if (header) header.style.setProperty("display", "none", "important");
    if (footer) footer.style.setProperty("display", "none", "important");
    return () => {
      if (header) header.style.removeProperty("display");
      if (footer) footer.style.removeProperty("display");
    };
  }, []);

  // Scroll to top only when entering preview or share (not loading)
  useEffect(() => {
    if (phase === "preview" || phase === "share") {
      window.scrollTo({ top: 0 });
    }
  }, [phase]);

  const handleSubmit = useCallback(async () => {
    if (!recipientName.trim() || !description.trim()) return;
    setError(null);
    setPhase("loading");
    setProgress(0);
    setLoadingStep(0);

    // Progress simulation
    const startTime = Date.now();
    const expectedDuration = 35000;
    const stepInterval = expectedDuration / 5;

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let p: number;
      if (elapsed < expectedDuration * 0.9) {
        p = (elapsed / expectedDuration) * 90;
      } else {
        const extra = elapsed - expectedDuration * 0.9;
        p = 90 + Math.min(9, extra / 3000);
      }
      setProgress(Math.min(99, p));
      setLoadingStep(Math.min(4, Math.floor(elapsed / stepInterval)));
    }, 100);

    try {
      const res = await fetch("/api/flowermail/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: recipientName.trim(),
          senderName: senderName.trim() || undefined,
          description: description.trim(),
        }),
      });
      const data = await res.json();
      clearInterval(progressTimer);

      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        setPhase("form");
        return;
      }

      setProgress(100);
      setLoadingStep(4);
      await new Promise((r) => setTimeout(r, 600));
      setResult(data);
      setPhase("preview");
    } catch {
      clearInterval(progressTimer);
      setError("花束の作成に失敗しました。もう一度お試しください。");
      setPhase("form");
    }
  }, [recipientName, description, senderName]);

  const handleCopyUrl = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = result.url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const handleEmail = useCallback(() => {
    if (!result) return;
    const name = senderName.trim() || "誰か";
    const subject = encodeURIComponent(`${name}から花束が届いています`);
    const body = encodeURIComponent(
      `${recipientName}へ\n\n${name}から花束が届いています。\n` +
        `こちらのURLから受け取ってください：\n${result.url}\n\n` +
        `7日間で消えてしまうので、早めに開いてくださいね。`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [result, senderName, recipientName]);

  const handleLine = useCallback(() => {
    if (!result) return;
    const name = senderName.trim() || "誰か";
    const text = encodeURIComponent(
      `${name}から花束が届いています\n${result.url}`
    );
    window.location.href = `https://line.me/R/msg/text/?${text}`;
  }, [result, senderName]);

  const handleStartOver = () => {
    setPhase("form");
    setRecipientName("");
    setDescription("");
    setSenderName("");
    setResult(null);
    setError(null);
    setCopied(false);
  };

  /* ── Render content by phase ── */

  const renderContent = () => {
    /* ── Loading is rendered as overlay in main render ── */

    /* ── Preview ── */
    if (phase === "preview" && result) {
      return (
        <div>
          {/* Section label */}
          <p
            className="fm-label fm-fade-in"
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            A bouquet for {recipientName.trim()}
          </p>

          {/* Bouquet image */}
          <div
            className="fm-fade-in"
            style={{
              marginBottom: 48,
              animationDelay: "0.2s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <img
              src={result.imageUrl}
              alt={`Bouquet for ${recipientName}`}
              style={{
                width: "100%",
                maxWidth: 480,
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>

          {/* Theme */}
          <p
            className="fm-fade-in"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 18,
              color: "#6B6B6B",
              textAlign: "center",
              marginBottom: 80,
              animationDelay: "0.4s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            {result.bouquetTheme}
          </p>

          {/* Divider */}
          <div className="fm-divider" style={{ marginBottom: 80 }} />

          {/* Message */}
          <div
            className="fm-fade-in"
            style={{
              marginBottom: 80,
              padding: "0 16px",
              animationDelay: "0.6s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <p
              className="fm-message"
              style={{ fontSize: 18, color: "#0A0A0A" }}
            >
              {result.message}
            </p>
            {senderName.trim() && (
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: 14,
                  color: "#6B6B6B",
                  textAlign: "right",
                  marginTop: 32,
                }}
              >
                from {senderName.trim()}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="fm-divider" style={{ marginBottom: 80 }} />

          {/* Flowers list */}
          <div
            className="fm-fade-in"
            style={{
              marginBottom: 120,
              animationDelay: "0.8s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <p
              className="fm-label"
              style={{ textAlign: "center", marginBottom: 40 }}
            >
              Flowers
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                alignItems: "center",
              }}
            >
              {result.flowers.map((f, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 400,
                      fontSize: 16,
                      color: "#0A0A0A",
                      marginBottom: 4,
                    }}
                  >
                    {f.name_en}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Shippori Mincho', serif",
                      fontSize: 12,
                      color: "#6B6B6B",
                    }}
                  >
                    {f.name_ja}
                    <span style={{ margin: "0 8px", color: "#E5E5E5" }}>
                      /
                    </span>
                    {f.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div style={{ textAlign: "center" }}>
            <button
              className="fm-btn"
              onClick={() => setPhase("share")}
            >
              Send this bouquet
            </button>
          </div>
        </div>
      );
    }

    /* ── Share ── */
    if (phase === "share" && result) {
      return (
        <div>
          <p
            className="fm-fade-in"
            style={{
              textAlign: "center",
              marginBottom: 80,
              fontFamily: "'Shippori Mincho', serif",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "0.15em",
              color: "#6B6B6B",
            }}
          >
            この花束を贈る
          </p>

          {/* URL display */}
          <div
            className="fm-fade-in"
            style={{
              textAlign: "center",
              marginBottom: 64,
              animationDelay: "0.2s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 14,
                color: "#6B6B6B",
                wordBreak: "break-all",
                lineHeight: 1.8,
              }}
            >
              {result.url}
            </p>
          </div>

          {/* Buttons */}
          <div
            className="fm-fade-in"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginBottom: 80,
              animationDelay: "0.4s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <button className="fm-btn" onClick={handleCopyUrl}>
              {copied ? "Copied" : "Copy URL"}
            </button>
            <button className="fm-btn" onClick={handleEmail}>
              Email
            </button>
            <button className="fm-btn" onClick={handleLine}>
              LINE
            </button>
          </div>

          {/* Expires */}
          <p
            className="fm-fade-in"
            style={{
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "#E5E5E5",
              marginBottom: 80,
              animationDelay: "0.6s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            Expires in 7 days
          </p>

          {/* Divider */}
          <div className="fm-divider" style={{ marginBottom: 80 }} />

          {/* Start over */}
          <div style={{ textAlign: "center" }}>
            <button className="fm-btn-ghost" onClick={handleStartOver}>
              Start over
            </button>
          </div>
        </div>
      );
    }

    /* ── Form (default, also shown during loading) ── */
    return (
      <div>
        {/* Section label */}
        <p
          className="fm-label"
          style={{ marginBottom: 64, color: "#0A0A0A" }}
        >
          Send a bouquet
        </p>

        {/* Form fields */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ position: "relative", marginBottom: 48 }}>
            <input
              className="fm-input"
              type="text"
              placeholder="相手の名前"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value.slice(0, 30))}
            />
            <span
              style={{
                position: "absolute",
                right: 0,
                bottom: 14,
                fontSize: 11,
                color: "#6B6B6B",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
              }}
            >
              {recipientName.length}/30
            </span>
          </div>

          <div style={{ position: "relative", marginBottom: 48 }}>
            <textarea
              className="fm-textarea"
              placeholder="どんな人か、感謝していること、雰囲気"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
            />
            <span
              style={{
                position: "absolute",
                right: 0,
                bottom: 14,
                fontSize: 11,
                color: "#6B6B6B",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
              }}
            >
              {description.length}/200
            </span>
          </div>

          <div style={{ position: "relative", marginBottom: 48 }}>
            <input
              className="fm-input"
              type="text"
              placeholder="あなたの名前（任意）"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value.slice(0, 20))}
            />
            <span
              style={{
                position: "absolute",
                right: 0,
                bottom: 14,
                fontSize: 11,
                color: "#6B6B6B",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
              }}
            >
              {senderName.length}/20
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p
            style={{
              fontSize: 13,
              color: "#0A0A0A",
              textAlign: "center",
              marginBottom: 24,
              fontFamily: "'Shippori Mincho', serif",
            }}
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <button
            className="fm-btn"
            onClick={handleSubmit}
            disabled={!recipientName.trim() || !description.trim()}
          >
            ブーケを作る
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "#6B6B6B",
            }}
          >
            ciraf inc.
          </p>
        </div>
      </div>
    );
  };

  /* ── Main render ── */
  const displayName = recipientName.trim().replace(/さん$/, "");

  return (
    <div className="fm-split">
      {/* SP text header — mobile only */}
      <header className="fm-sp-header">
        <h1><em>flower</em> mail</h1>
        <p>大切なあの人に1枚のブーケを、届ける。</p>
      </header>

      {/* KV image — PC only */}
      <div className="fm-kv">
        <img
          src="/flowermail/kv.jpg"
          alt="flower mail"
        />
      </div>

      {/* Content panel */}
      <div className="fm-content">
        <div className="fm-inner">
          {renderContent()}
        </div>
      </div>

      {/* Loading overlay — fixed, no scroll change */}
      {phase === "loading" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(255, 255, 255, 0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
          }}
        >
          <div className="fm-progress-track">
            <div
              className="fm-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 16,
              color: "#6B6B6B",
              letterSpacing: "0.04em",
            }}
          >
            {LOADING_STEPS[loadingStep].replace("{name}", displayName)}
          </p>
        </div>
      )}
    </div>
  );
}
