import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "flower mail | その人のための一枚のブーケを、届ける。",
  description:
    "大切な人の雰囲気をAIが読み取り、その人だけのブーケ画像を生成。固有URLでメール・LINEに送れる、7日間限定の花束ギフト。",
  openGraph: {
    title: "flower mail",
    description: "その人のための一枚のブーケを、届ける。",
    url: "https://ciraf.jp/flowermail/",
    siteName: "ciraf inc.",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "flower mail",
    description: "その人のための一枚のブーケを、届ける。",
  },
};

export default function FlowermailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ isolation: "isolate" }}>
      <style>{`
        /* ── Hide global header / footer / chat widget ── */
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
        /* Reset main padding from root layout header offset */
        main {
          padding-top: 0 !important;
        }

        /* ── Google Fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500&family=Shippori+Mincho:wght@400;500&display=swap');

        /* ── Base ── */
        .fm-root {
          min-height: 100vh;
          background: #FFFFFF;
          color: #0A0A0A;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ── Typography ── */
        .fm-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          letter-spacing: 0.02em;
          line-height: 1.1;
        }
        .fm-heading em, .fm-heading i {
          font-style: italic;
          font-weight: 300;
        }
        .fm-label {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6B6B6B;
        }
        .fm-body-ja {
          font-family: 'Shippori Mincho', serif;
          font-weight: 400;
          line-height: 2;
        }
        .fm-message {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 400;
          line-height: 2;
        }

        /* ── Input: underline only ── */
        .fm-input {
          width: 100%;
          border: none;
          border-bottom: 1px solid #0A0A0A;
          background: transparent;
          padding: 12px 0;
          font-family: 'Shippori Mincho', serif;
          font-size: 16px;
          font-weight: 400;
          color: #0A0A0A;
          outline: none;
          transition: border-color 0.3s;
          border-radius: 0;
          -webkit-appearance: none;
        }
        .fm-input:focus {
          border-bottom-color: #0A0A0A;
        }
        .fm-input::placeholder {
          color: #6B6B6B;
          font-style: italic;
        }
        .fm-textarea {
          width: 100%;
          border: none;
          border-bottom: 1px solid #0A0A0A;
          background: transparent;
          padding: 12px 0;
          font-family: 'Shippori Mincho', serif;
          font-size: 16px;
          font-weight: 400;
          color: #0A0A0A;
          outline: none;
          resize: none;
          transition: border-color 0.3s;
          line-height: 1.8;
          border-radius: 0;
          -webkit-appearance: none;
        }
        .fm-textarea:focus {
          border-bottom-color: #0A0A0A;
        }
        .fm-textarea::placeholder {
          color: #6B6B6B;
          font-style: italic;
        }

        /* ── Button: border only + uppercase ── */
        .fm-btn {
          display: inline-block;
          border: 1.5px solid #0A0A0A;
          background: transparent;
          color: #0A0A0A;
          font-family: 'Shippori Mincho', serif;
          font-weight: 400;
          font-size: 14px;
          letter-spacing: 0.1em;
          padding: 20px 64px;
          cursor: pointer;
          transition: background 0.3s, color 0.3s;
          text-decoration: none;
          text-align: center;
        }
        .fm-btn:hover {
          background: #0A0A0A;
          color: #FFFFFF;
        }
        .fm-btn:disabled {
          border-color: #E5E5E5;
          color: #E5E5E5;
          cursor: not-allowed;
        }
        .fm-btn:disabled:hover {
          background: transparent;
          color: #E5E5E5;
        }
        .fm-btn-ghost {
          display: inline-block;
          border: 1.5px solid #E5E5E5;
          background: transparent;
          color: #6B6B6B;
          font-family: 'Shippori Mincho', serif;
          font-weight: 400;
          font-size: 14px;
          letter-spacing: 0.1em;
          padding: 18px 56px;
          cursor: pointer;
          transition: border-color 0.3s, color 0.3s;
          text-decoration: none;
          text-align: center;
        }
        .fm-btn-ghost:hover {
          border-color: #0A0A0A;
          color: #0A0A0A;
        }

        /* ── Progress bar ── */
        .fm-progress-track {
          width: 200px;
          height: 1px;
          background: #E5E5E5;
          position: relative;
        }
        .fm-progress-fill {
          position: absolute;
          top: -1px;
          left: 0;
          height: 3px;
          background: #0A0A0A;
          transition: width 0.4s ease-out;
        }

        /* ── Divider ── */
        .fm-divider {
          width: 60px;
          height: 1px;
          background: #E5E5E5;
          margin: 0 auto;
        }

        /* ── Fade animations ── */
        @keyframes fmFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fmFadeInSlow {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fm-fade-in {
          animation: fmFadeIn 0.8s ease forwards;
        }
        .fm-fade-in-slow {
          animation: fmFadeInSlow 1.2s ease forwards;
        }

        /* ── Spinner ── */
        .fm-spinner {
          width: 24px;
          height: 24px;
          border: 1px solid #E5E5E5;
          border-top-color: #0A0A0A;
          border-radius: 50%;
          animation: fmSpin 0.8s linear infinite;
        }
        @keyframes fmSpin {
          to { transform: rotate(360deg); }
        }

        /* ── Bloom animation ── */
        @keyframes fmBloomBg {
          from { background-color: #F5F3EE; }
          to   { background-color: #FFFFFF; }
        }
        @keyframes fmBloomImg {
          from {
            transform: scale(0.4);
            opacity: 0.3;
            filter: blur(30px);
          }
          to {
            transform: scale(1);
            opacity: 1;
            filter: blur(0px);
          }
        }
        .fm-bloom-bg {
          animation: fmBloomBg 1s ease forwards;
        }
        .fm-bloom-img {
          animation: fmBloomImg 4s ease forwards;
        }

        /* ── SP text header (mobile only) ── */
        .fm-sp-header {
          display: block;
          text-align: center;
          padding: 48px 24px;
          border-bottom: 1px solid #E5E5E5;
        }
        .fm-sp-header h1 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 34px;
          letter-spacing: 0.02em;
          line-height: 1.1;
          color: #0A0A0A;
          margin-bottom: 12px;
        }
        .fm-sp-header h1 em {
          font-style: italic;
          font-weight: 300;
        }
        .fm-sp-header p {
          font-family: 'Shippori Mincho', serif;
          font-size: 13px;
          font-weight: 400;
          color: #6B6B6B;
        }
        .fm-sp-header.fm-sp-header--dim {
          opacity: 0.3;
          transition: opacity 0.6s ease;
        }
        /* ── SP KV image (mobile form phase only) ── */
        .fm-sp-kv {
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
        }
        .fm-sp-kv img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (min-width: 1024px) {
          .fm-sp-header,
          .fm-sp-kv {
            display: none;
          }
        }

        /* ── Split layout ── */
        .fm-split {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .fm-kv {
          display: none;
        }
        .fm-kv img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .fm-content {
          flex: 1;
          padding: 64px 24px 120px;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 1024px) {
          .fm-split {
            flex-direction: row;
          }
          .fm-kv {
            display: block;
            position: fixed;
            left: 0;
            top: 0;
            width: 50vw;
            height: 100vh;
            background: #FFFFFF;
          }
          .fm-kv img {
            object-fit: contain;
            object-position: left center;
          }
          .fm-content {
            margin-left: 50vw;
            width: 50vw;
            min-height: 100vh;
            padding: 120px 40px;
            box-sizing: border-box;
            align-items: center;
            justify-content: flex-start;
          }
          .fm-inner {
            width: 100%;
            max-width: 440px;
          }
        }
      `}</style>
      <div className="fm-root">
        {children}
      </div>
    </div>
  );
}
