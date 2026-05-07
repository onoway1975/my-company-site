import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Die With Zero? - BILLIONAIRE BILLY",
  description:
    "老後の不安、ぶっ壊します。NISAもiDeCoも知ってるけど尊重しない男 BILLIONAIRE BILLY があなたの貯金観をトレーディングカードで診断。",
  openGraph: {
    title: "Why Die With Zero? - BILLIONAIRE BILLY",
    description:
      "老後の不安、ぶっ壊します。BILLIONAIRE BILLY があなたの貯金観を診断。",
    url: "https://ciraf.jp/whydiewithzero/",
    siteName: "BILLIONAIRE BILLY",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Die With Zero? - BILLIONAIRE BILLY",
    description:
      "老後の不安、ぶっ壊します。BILLIONAIRE BILLY があなたの貯金観を診断。",
  },
  alternates: { canonical: "https://ciraf.jp/whydiewithzero/" },
};

export default function WhyDieWithZeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ isolation: "isolate" }}>
      <style>{`
        /* ── Hide global header / footer ── */
        body > header,
        body > footer,
        #__next > header,
        #__next > footer,
        header.fixed,
        footer {
          display: none !important;
        }
        [data-gtm-click="chat_toggle"],
        [data-gtm-location="chat_widget"] {
          display: none !important;
        }
        main {
          padding-top: 0 !important;
        }

        /* ── Google Fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500&display=swap');

        /* ── LINE Seed JP Bold ── */
        @font-face {
          font-family: 'LINE Seed JP';
          src: url('/fonts/LINESeedJP_OTF_Bd.woff2') format('woff2');
          font-weight: 700;
          font-display: swap;
        }

        /* ── Base ── */
        .dwz-root {
          min-height: 100vh;
          background: #0E1F3A;
          color: #FFFFFF;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ── Container ── */
        .dwz-container {
          max-width: 480px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Typography ── */
        .dwz-heading {
          font-family: 'Cormorant Garamond', serif;
          line-height: 1.15;
        }
        .dwz-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0.5;
        }

        /* ══════════════════════════════
           Landing (FP tool style)
           ══════════════════════════════ */
        .dwz-landing {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 24px;
        }
        .dwz-landing-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          padding: 6px 16px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.6;
          margin-bottom: 48px;
        }
        .dwz-landing-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 34px;
          font-weight: 700;
          letter-spacing: 0.02em;
          line-height: 1.3;
          margin-bottom: 12px;
        }
        .dwz-landing-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-style: italic;
          opacity: 0.6;
          letter-spacing: 0.06em;
          margin-bottom: 48px;
        }
        .dwz-landing-desc {
          font-size: 14px;
          line-height: 2;
          opacity: 0.75;
          margin-bottom: 48px;
        }
        .dwz-landing-stats {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-bottom: 48px;
        }
        .dwz-landing-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .dwz-landing-stat-label {
          font-size: 10px;
          opacity: 0.5;
          letter-spacing: 0.08em;
          margin-top: 4px;
        }
        .dwz-landing-fine {
          font-size: 11px;
          opacity: 0.35;
          margin-top: 20px;
          line-height: 1.8;
        }
        .dwz-landing-powered {
          margin-top: 60px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.3;
        }

        /* ══════════════════════════════
           Buttons
           ══════════════════════════════ */
        .dwz-btn-primary {
          background: #C9A961;
          color: #0E1F3A;
          border: none;
          border-radius: 8px;
          padding: 18px 48px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
        }
        .dwz-btn-primary:hover {
          opacity: 0.9;
        }
        .dwz-btn-primary:active {
          transform: scale(0.98);
        }
        .dwz-btn-primary:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
        }
        .dwz-btn-outline {
          background: transparent;
          color: #FFFFFF;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          padding: 16px 36px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: border-color 0.2s, opacity 0.2s;
        }
        .dwz-btn-outline:hover {
          border-color: rgba(255,255,255,0.6);
        }

        /* ══════════════════════════════
           Form
           ══════════════════════════════ */
        .dwz-form {
          min-height: 100vh;
          padding: 40px 0 80px;
        }
        .dwz-form-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .dwz-form-progress-track {
          width: 100%;
          height: 2px;
          background: rgba(255,255,255,0.1);
          border-radius: 1px;
          margin-bottom: 8px;
        }
        .dwz-form-progress-fill {
          height: 100%;
          background: #C9A961;
          border-radius: 1px;
          transition: width 0.4s ease-out;
        }
        .dwz-form-progress-text {
          font-size: 11px;
          opacity: 0.4;
          letter-spacing: 0.08em;
          text-align: right;
        }
        .dwz-question {
          margin-bottom: 36px;
          padding-bottom: 36px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .dwz-question:last-of-type {
          border-bottom: none;
        }
        .dwz-question-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.4;
          margin-bottom: 8px;
        }
        .dwz-question-title {
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 16px;
        }
        .dwz-question-hint {
          font-size: 12px;
          opacity: 0.4;
          margin-top: 4px;
          font-weight: 300;
        }
        .dwz-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.25);
          color: #FFFFFF;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          padding: 12px 0;
          outline: none;
          transition: border-color 0.3s;
          border-radius: 0;
          -webkit-appearance: none;
        }
        .dwz-input:focus {
          border-bottom-color: #C9A961;
        }
        .dwz-input::placeholder {
          color: rgba(255,255,255,0.25);
        }
        .dwz-input-row {
          display: flex;
          gap: 16px;
        }
        .dwz-input-row .dwz-input {
          flex: 1;
        }
        .dwz-option-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .dwz-option-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 8px;
          color: rgba(255,255,255,0.65);
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          padding: 12px 18px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .dwz-option-btn:hover {
          border-color: rgba(255,255,255,0.4);
          color: #FFFFFF;
        }
        .dwz-option-btn.selected {
          border-color: #C9A961;
          background: rgba(201,169,97,0.12);
          color: #FFFFFF;
        }
        .dwz-option-btn-full {
          width: 100%;
          text-align: left;
        }
        .dwz-form-submit {
          text-align: center;
          margin-top: 48px;
        }
        .dwz-form-error {
          text-align: center;
          color: #E85D5D;
          font-size: 13px;
          margin-bottom: 16px;
        }

        /* ══════════════════════════════
           Calculating
           ══════════════════════════════ */
        .dwz-calc {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dwz-calc-inner {
          text-align: center;
          width: 100%;
          max-width: 320px;
          padding: 0 24px;
        }
        .dwz-calc-pie {
          width: 160px;
          height: 160px;
          margin: 0 auto 36px;
        }
        .dwz-calc-pie svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .dwz-pie-seg {
          transition: stroke-dasharray 0.8s ease;
        }
        .dwz-calc-progress-track {
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .dwz-calc-progress-fill {
          height: 100%;
          background: #C9A961;
          transition: width 0.3s ease-out;
        }
        .dwz-calc-pct {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          letter-spacing: 0.1em;
          opacity: 0.5;
          margin-bottom: 24px;
        }
        .dwz-calc-msg {
          font-size: 13px;
          opacity: 0.6;
          transition: opacity 0.3s;
          min-height: 20px;
        }

        /* ══════════════════════════════
           Reveal
           ══════════════════════════════ */
        .dwz-reveal {
          position: fixed;
          inset: 0;
          background: #0E1F3A;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          z-index: 100;
        }
        .dwz-reveal-wait {
          font-family: 'Cormorant Garamond', serif;
          font-size: 56px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #C9A961;
          animation: dwzRevealText 0.4s ease both;
        }
        .dwz-reveal-sub {
          font-size: 14px;
          opacity: 0;
          margin-top: 16px;
          animation: dwzFadeIn 0.5s ease 0.6s both;
        }

        /* ══════════════════════════════
           Card
           ══════════════════════════════ */
        .dwz-card-screen {
          min-height: 100vh;
          padding: 32px 0 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .dwz-card {
          width: 100%;
          max-width: 340px;
          aspect-ratio: 7 / 10;
          background: #FAF6E8;
          border-radius: 16px;
          padding: 28px 24px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3);
          animation: dwzCardIn 0.6s ease both;
        }
        .dwz-card-border-common {
          border: 2px solid #A8A8A8;
        }
        .dwz-card-border-rare {
          border: 2px solid #C9A961;
        }
        .dwz-card-border-legendary {
          border: 2px solid transparent;
          background-clip: padding-box;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 0 0 2px #E8B4F8;
        }
        .dwz-card-border-mythic {
          border: 2px solid transparent;
          background-clip: padding-box;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 0 0 2px #C9A961;
          animation: dwzCardIn 0.6s ease both, dwzRainbow 3s linear infinite;
        }
        .dwz-card-rarity {
          font-family: 'Cormorant Garamond', serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #A8A8A8;
          margin-bottom: 12px;
        }
        .dwz-card-rarity.rare { color: #C9A961; }
        .dwz-card-rarity.legendary { color: #B87AE8; }
        .dwz-card-rarity.mythic {
          background: linear-gradient(90deg, #FF6B6B, #FFE66D, #4ECDC4, #A78BFA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dwz-card-header {
          text-align: center;
          margin-bottom: 16px;
        }
        .dwz-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #0E1F3A;
        }
        .dwz-card-epithet {
          font-family: 'Cormorant Garamond', serif;
          font-size: 12px;
          font-style: italic;
          letter-spacing: 0.1em;
          color: #8B7355;
          margin-top: 2px;
        }
        .dwz-card-avatar {
          text-align: center;
          margin-bottom: 16px;
        }
        .dwz-card-avatar-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #E8DFD0;
          margin: 0 auto;
          overflow: hidden;
        }
        .dwz-card-avatar-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .dwz-card-speech {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          line-height: 1.85;
          color: #2A2A2A;
          flex: 1;
          overflow-y: auto;
        }
        .dwz-card-closing {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-style: italic;
          letter-spacing: 0.12em;
          color: #8B7355;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(139,115,85,0.2);
        }
        .dwz-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 14px;
        }
        .dwz-card-action {
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #C9A961;
        }
        .dwz-card-tags {
          display: flex;
          gap: 8px;
        }
        .dwz-card-tag {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          color: #8B7355;
          letter-spacing: 0.04em;
        }

        /* Card actions */
        .dwz-card-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 28px;
          width: 100%;
          max-width: 340px;
        }
        .dwz-card-actions button {
          flex: 1;
        }

        /* ══════════════════════════════
           Animations
           ══════════════════════════════ */
        @keyframes dwzFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dwzRevealText {
          0% { opacity: 0; transform: scale(0.6); letter-spacing: 0.3em; }
          100% { opacity: 1; transform: scale(1); letter-spacing: 0.12em; }
        }
        @keyframes dwzShake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-4px); }
          30%, 70% { transform: translateX(4px); }
        }
        @keyframes dwzCardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dwzRainbow {
          0% { box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 0 0 2px #FF6B6B; }
          25% { box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 0 0 2px #FFE66D; }
          50% { box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 0 0 2px #4ECDC4; }
          75% { box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 0 0 2px #A78BFA; }
          100% { box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 0 0 2px #FF6B6B; }
        }
        .dwz-fade-in {
          animation: dwzFadeIn 0.6s ease both;
        }
        .dwz-fade-in-d1 { animation-delay: 0.1s; }
        .dwz-fade-in-d2 { animation-delay: 0.2s; }
        .dwz-fade-in-d3 { animation-delay: 0.3s; }
      `}</style>
      <div className="dwz-root">
        {children}
      </div>
    </div>
  );
}
