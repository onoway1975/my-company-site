"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

/* ── Types ── */

type Flower = {
  name_ja: string;
  name_en: string;
  meaning: string;
  color: string;
};

type BouquetData = {
  id: string;
  recipientName: string;
  senderName: string | null;
  bouquetTheme: string;
  flowers: Flower[];
  palette: { primary: string; secondary: string; accent: string; mood: string };
  wrapping: { paper: string; tie: string; description_en: string };
  message: string;
  imageUrl: string;
  createdAt: string;
  expiresAt: string;
  openedAt: string | null;
};

type Phase = "loading" | "arrival" | "blooming" | "complete" | "expired" | "error";

/* ── Component ── */

export default function FlowermailReceivePage() {
  const params = useParams();
  const id = params.id as string;

  const [phase, setPhase] = useState<Phase>("loading");
  const [data, setData] = useState<BouquetData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/flowermail/get?id=${id}`)
      .then(async (res) => {
        const json = await res.json();
        if (res.status === 410) {
          setPhase("expired");
          return;
        }
        if (!res.ok) {
          setErrorMessage(json.error || "花束が見つかりませんでした");
          setPhase("error");
          return;
        }
        setData(json);
        setPhase("arrival");
      })
      .catch(() => {
        setErrorMessage("データの取得に失敗しました");
        setPhase("error");
      });
  }, [id]);

  const handleOpen = useCallback(() => {
    setPhase("blooming");
    setTimeout(() => {
      setPhase("complete");
    }, 4500);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!data) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.open(data.imageUrl, "_blank");
    } else {
      try {
        const res = await fetch(data.imageUrl);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `flowermail-${data.id}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        window.open(data.imageUrl, "_blank");
      }
    }
  }, [data]);

  const getRemainingDays = () => {
    if (!data?.expiresAt) return 0;
    const now = new Date();
    const expires = new Date(data.expiresAt);
    return Math.max(
      0,
      Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );
  };

  /* ── SP header class — dim during bloom ── */
  const spHeaderClass =
    "fm-sp-header" + (phase === "blooming" ? " fm-sp-header--dim" : "");

  /* ── Loading ── */
  if (phase === "loading") {
    return (
      <>
        <header className={spHeaderClass}>
          <h1><em>flower</em> mail</h1>
          <p>大切なあの人に1枚のブーケを、届ける。</p>
        </header>
        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="fm-spinner" />
        </div>
      </>
    );
  }

  /* ── Expired ── */
  if (phase === "expired") {
    return (
      <>
        <header className={spHeaderClass}>
          <h1><em>flower</em> mail</h1>
          <p>大切なあの人に1枚のブーケを、届ける。</p>
        </header>
        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            padding: "40px 24px",
          }}
        >
          <p
            className="fm-heading"
            style={{
              fontSize: "clamp(24px, 6vw, 36px)",
              textAlign: "center",
            }}
          >
            <em>この花束は、静かに枯れました</em>
          </p>
          <p
            className="fm-body-ja"
            style={{ fontSize: 14, color: "#6B6B6B", textAlign: "center" }}
          >
            7日間が過ぎたため、花束は消えました
          </p>
          <div style={{ marginTop: 40 }}>
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
      </>
    );
  }

  /* ── Error ── */
  if (phase === "error") {
    return (
      <>
        <header className={spHeaderClass}>
          <h1><em>flower</em> mail</h1>
          <p>大切なあの人に1枚のブーケを、届ける。</p>
        </header>
        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            padding: "40px 24px",
          }}
        >
          <p
            className="fm-body-ja"
            style={{ fontSize: 16, textAlign: "center" }}
          >
            {errorMessage || "花束が見つかりませんでした"}
          </p>
          <a
            href="/flowermail/"
            className="fm-btn"
            style={{ marginTop: 24 }}
          >
            TOP へ戻る
          </a>
        </div>
      </>
    );
  }

  /* ── Arrival ── */
  if (phase === "arrival" && data) {
    const sender = data.senderName || "誰か";
    return (
      <>
        <header className={spHeaderClass}>
          <h1><em>flower</em> mail</h1>
          <p>大切なあの人に1枚のブーケを、届ける。</p>
        </header>
        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            padding: "40px 24px",
            background: "#F5F3EE",
          }}
        >
          <div className="fm-fade-in" style={{ textAlign: "center" }}>
            <p
              className="fm-body-ja"
              style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 16 }}
            >
              {sender}さんから
            </p>
            <p
              className="fm-heading"
              style={{ fontSize: "clamp(32px, 8vw, 48px)" }}
            >
              <em>花が届いています</em>
            </p>
          </div>
          <button
            className="fm-btn fm-fade-in"
            style={{
              animationDelay: "0.4s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
            onClick={handleOpen}
          >
            花束を開く
          </button>
        </div>
      </>
    );
  }

  /* ── Blooming ── */
  if (phase === "blooming" && data) {
    return (
      <>
        <header className={spHeaderClass}>
          <h1><em>flower</em> mail</h1>
          <p>大切なあの人に1枚のブーケを、届ける。</p>
        </header>
        <div
          className="fm-bloom-bg"
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
          }}
        >
          <img
            src={data.imageUrl}
            alt={`Bouquet for ${data.recipientName}`}
            className="fm-bloom-img"
            style={{
              maxWidth: 560,
              width: "90%",
              display: "block",
            }}
          />
        </div>
      </>
    );
  }

  /* ── Complete ── */
  if (phase === "complete" && data) {
    const sender = data.senderName || "誰か";
    const remainingDays = getRemainingDays();

    return (
      <>
        <header className={spHeaderClass}>
          <h1><em>flower</em> mail</h1>
          <p>大切なあの人に1枚のブーケを、届ける。</p>
        </header>
        <div
          style={{
            padding: "80px 24px 120px",
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          {/* Section label */}
        <div
          className="fm-fade-in"
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "#0A0A0A",
              marginBottom: 8,
            }}
          >
            A bouquet for {data.recipientName}
          </p>
          <p
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontSize: 11,
              color: "#6B6B6B",
            }}
          >
            {data.recipientName}さんへ
          </p>
        </div>

          {/* Bouquet image */}
        <div
          className="fm-fade-in"
          style={{ marginBottom: 64, textAlign: "center", animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}
        >
          <img
            src={data.imageUrl}
            alt={`Bouquet for ${data.recipientName}`}
            style={{
              maxWidth: 560,
              width: "90%",
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
            fontSize: 28,
            color: "#6B6B6B",
            textAlign: "center",
            marginBottom: 64,
            animationDelay: "0.2s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          {data.bouquetTheme}
        </p>

        {/* Message */}
        <div
          className="fm-fade-in"
          style={{
            marginBottom: 48,
            padding: "0 16px",
            animationDelay: "0.4s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <p className="fm-message" style={{ fontSize: 18, color: "#0A0A0A" }}>
            {data.message}
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 16,
              color: "#6B6B6B",
              textAlign: "right",
              marginTop: 32,
            }}
          >
            from {sender}
          </p>
        </div>

        {/* Divider */}
        <div className="fm-divider" style={{ marginBottom: 64 }} />

        {/* Flowers */}
        <div
          className="fm-fade-in"
          style={{
            marginBottom: 64,
            animationDelay: "0.6s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase" as const,
                color: "#0A0A0A",
                marginBottom: 8,
              }}
            >
              The flowers in this bouquet
            </p>
            <p
              style={{
                fontFamily: "'Shippori Mincho', serif",
                fontSize: 11,
                color: "#6B6B6B",
              }}
            >
              この花束の花
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              alignItems: "center",
            }}
          >
            {data.flowers.map((f, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 400,
                    fontSize: 18,
                    color: "#0A0A0A",
                    marginBottom: 4,
                  }}
                >
                  {f.name_en}
                </p>
                <p
                  style={{
                    fontFamily: "'Shippori Mincho', serif",
                    fontSize: 14,
                    color: "#6B6B6B",
                  }}
                >
                  {f.name_ja}
                  <span style={{ margin: "0 8px", color: "#E5E5E5" }}>/</span>
                  {f.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="fm-divider" style={{ marginBottom: 64 }} />

        {/* Remaining days */}
        <div
          className="fm-fade-in"
          style={{
            textAlign: "center",
            marginBottom: 48,
            animationDelay: "0.8s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "#0A0A0A",
              marginBottom: 8,
            }}
          >
            {remainingDays > 0
              ? `Expires in ${remainingDays} days`
              : "This bouquet has expired"}
          </p>
          <p
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontSize: 11,
              color: "#6B6B6B",
            }}
          >
            {remainingDays > 0
              ? `残り ${remainingDays}日`
              : "この花束は期限切れです"}
          </p>
        </div>

        {/* Actions */}
        <div
          className="fm-fade-in"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            marginBottom: 80,
            animationDelay: "0.9s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <button
            className="fm-btn"
            onClick={handleDownload}
            style={{
              width: "100%",
              maxWidth: 280,
              fontSize: 14,
              letterSpacing: "0.1em",
              textTransform: "none" as const,
            }}
          >
            画像を保存
          </button>
          <a
            href="/flowermail/"
            className="fm-btn"
            style={{
              width: "100%",
              maxWidth: 280,
              fontSize: 14,
              letterSpacing: "0.1em",
              textTransform: "none" as const,
            }}
          >
            花束を贈る
          </a>
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
      </>
    );
  }

  return null;
}
