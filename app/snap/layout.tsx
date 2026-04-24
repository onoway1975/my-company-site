import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SNAP STUDIO | AIフォトスタジオ",
  description:
    "ペットやこどもの写真をアップするだけで、AIがプロのスタジオ写真に仕上げます。30種類以上のテンプレートから選んで、世界にひとつの1枚を。",
  keywords: [
    "AI写真",
    "フォトスタジオ",
    "ペット写真",
    "犬",
    "猫",
    "こども",
    "SNAP STUDIO",
    "シラフ",
  ],
  authors: [{ name: "シラフ株式会社", url: "https://ciraf.jp" }],
  openGraph: {
    title: "SNAP STUDIO | AIフォトスタジオ",
    description:
      "ペットやこどもの写真を、プロのスタジオ写真風に。30種類以上のテンプレートから選べるAIフォトスタジオ。",
    url: "https://ciraf.jp/snap/",
    siteName: "SNAP STUDIO",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SNAP STUDIO | AIフォトスタジオ",
    description:
      "ペットやこどもの写真を、プロのスタジオ写真風に。",
  },
  alternates: { canonical: "https://ciraf.jp/snap/" },
};

export default function SnapLayout({
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
        main {
          padding-top: 0 !important;
        }

        /* ── Google Fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500&family=Noto+Serif+JP:wght@400;500&display=swap');

        /* ── Outer shell (PC beige background) ── */
        .snap-shell {
          min-height: 100vh;
          background: #E8D9C4;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        @media (min-width: 640px) {
          .snap-shell {
            align-items: center;
            padding: 24px 0;
          }
        }

        /* ── Base ── */
        .snap-root {
          width: 100%;
          min-height: 100vh;
          background: #F4A896;
          color: #2C1810;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        @media (min-width: 640px) {
          .snap-root {
            max-width: 390px;
            min-height: 844px;
            border-radius: 40px;
            box-shadow: 0 8px 40px rgba(44, 24, 16, 0.18), 0 0 0 1px rgba(44, 24, 16, 0.06);
            overflow: hidden;
          }
        }

        /* ── Serif / Sans helpers ── */
        .snap-serif {
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
        }

        /* ── Landing: editorial header row ── */
        .snap-editorial-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          opacity: 0.85;
          margin-bottom: 28px;
        }

        /* ── Landing: logo mark ── */
        .snap-silhouettes {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }

        /* ── Landing: wordmark ── */
        .snap-wordmark {
          text-align: center;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          color: #2C1810;
          margin-bottom: 28px;
          line-height: 1;
        }
        .snap-wordmark-title {
          font-size: 30px;
          letter-spacing: 0.10em;
          font-weight: 500;
        }
        .snap-wordmark-line {
          width: 110px;
          height: 1px;
          background: #2C1810;
          margin: 12px auto 8px;
        }
        .snap-wordmark-sub {
          font-size: 10px;
          letter-spacing: 0.20em;
          font-style: italic;
        }

        /* ── Wordmark small (header) ── */
        .snap-wordmark-sm {
          text-align: center;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          font-size: 18px;
          letter-spacing: 0.12em;
          font-weight: 500;
          color: #2C1810;
          line-height: 1;
        }

        /* ── Landing: tagline ── */
        .snap-tagline-main {
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          font-size: 20px;
          text-align: center;
          line-height: 1.5;
          margin-bottom: 24px;
          font-style: italic;
        }

        /* ── Section label ── */
        .snap-section-label {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          text-align: center;
          opacity: 0.7;
          margin-bottom: 14px;
        }

        /* ── Category tabs ── */
        .snap-category-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 18px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .snap-category-tabs::-webkit-scrollbar {
          display: none;
        }
        .snap-category-sep {
          display: flex;
          align-items: center;
          color: #2C1810;
          opacity: 0.35;
          font-size: 10px;
          padding: 0 2px;
        }
        .snap-category-tab {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          font-size: 14px;
          letter-spacing: 0.04em;
          color: #2C1810;
          opacity: 0.5;
          padding: 6px 8px;
          border-bottom: 1px solid transparent;
          white-space: nowrap;
          font-weight: 400;
          transition: all 0.15s;
        }
        .snap-category-tab.active {
          opacity: 1;
          border-bottom-color: #2C1810;
          font-style: italic;
          font-weight: 500;
        }

        /* ── Template grid (always 2 columns) ── */
        .snap-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        /* ── Template card ── */
        .snap-card {
          background: #F5EDE0;
          border-radius: 14px;
          padding: 8px;
          border: none;
          cursor: pointer;
          text-align: left;
          box-shadow: 0 4px 12px rgba(44, 24, 16, 0.10);
          transition: transform 0.15s ease;
        }
        .snap-card:active {
          transform: scale(0.98);
        }
        .snap-card-thumb {
          width: 100%;
          aspect-ratio: 3 / 4;
          border-radius: 8px;
          overflow: hidden;
          background: #EFE4D4;
          margin-bottom: 8px;
        }
        .snap-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: sepia(0.22) saturate(0.85) contrast(0.95);
          display: block;
        }
        .snap-card-title {
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #2C1810;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 2px;
        }
        .snap-card-cat {
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          color: #A88B78;
          margin-top: 2px;
          font-style: italic;
          padding: 0 2px 4px;
        }

        /* ── Footer ── */
        .snap-footer {
          margin-top: auto;
          padding-top: 12px;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          text-align: center;
          opacity: 0.6;
        }

        /* ── Header bar (Upload / Result) ── */
        .snap-header-bar {
          display: flex;
          align-items: center;
          margin-bottom: 32px;
        }
        .snap-back-btn {
          background: none;
          border: none;
          color: #2C1810;
          font-size: 20px;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          cursor: pointer;
          padding: 0;
          width: 28px;
        }
        .snap-header-spacer {
          width: 28px;
        }

        /* ── Selected studio badge ── */
        .snap-selected-label {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          color: #6B4E3D;
          margin-bottom: 6px;
        }
        .snap-selected-title {
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          font-size: 22px;
          font-style: italic;
          letter-spacing: 0.04em;
          color: #2C1810;
        }
        .snap-selected-en {
          opacity: 0.5;
          font-size: 14px;
          font-style: normal;
        }

        /* ── Upload card ── */
        .snap-upload-card {
          background: #F5EDE0;
          border-radius: 24px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(44, 24, 16, 0.10);
        }
        .snap-upload-frame {
          border: 1px dashed #D8C4A8;
          border-radius: 16px;
          background: #EFE4D4;
          aspect-ratio: 4 / 5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 14px;
          overflow: hidden;
          position: relative;
        }
        .snap-upload-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: sepia(0.15) saturate(0.9);
        }
        .snap-upload-label {
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          font-size: 18px;
          letter-spacing: 0.02em;
          color: #2C1810;
        }
        .snap-upload-hint {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          color: #A88B78;
        }

        /* ── Choose button (outline) ── */
        .snap-choose-btn {
          margin-top: 18px;
          width: 100%;
          background: transparent;
          border: 1px solid #2C1810;
          border-radius: 14px;
          padding: 14px 16px;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          font-size: 15px;
          letter-spacing: 0.10em;
          color: #2C1810;
          cursor: pointer;
        }

        /* ── File row (after upload) ── */
        .snap-file-row {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .snap-file-dot {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #2C1810;
          flex-shrink: 0;
        }
        .snap-file-name {
          font-size: 12px;
          font-family: 'Inter', sans-serif;
          color: #6B4E3D;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .snap-file-change {
          background: none;
          border: none;
          font-size: 11px;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          letter-spacing: 0.10em;
          color: #6B4E3D;
          text-transform: uppercase;
          cursor: pointer;
          flex-shrink: 0;
        }

        /* ── Tips ── */
        .snap-tips {
          font-size: 11px;
          font-family: 'Inter', sans-serif;
          color: #2C1810;
          opacity: 0.75;
          line-height: 1.7;
          padding: 0 6px;
          margin-bottom: 20px;
        }
        .snap-tips-label {
          font-size: 10px;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          margin-bottom: 8px;
          opacity: 0.9;
        }

        /* ── CTA button ── */
        .snap-cta {
          width: 100%;
          border: 1px solid #2C1810;
          border-radius: 16px;
          padding: 18px 16px;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          font-size: 16px;
          letter-spacing: 0.16em;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: auto;
        }
        .snap-cta.enabled {
          background: #2C1810;
          color: #F5EDE0;
          opacity: 1;
        }
        .snap-cta.disabled {
          background: transparent;
          color: #2C1810;
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* ── Result: preview card ── */
        .snap-preview-card {
          background: #F5EDE0;
          border-radius: 20px;
          padding: 14px;
          box-shadow: 0 8px 24px rgba(44, 24, 16, 0.12);
        }
        .snap-preview-inner {
          border-radius: 10px;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          background: #EFE4D4;
          position: relative;
        }
        .snap-preview-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: sepia(0.18) saturate(0.92) contrast(0.95);
          display: block;
        }

        /* ── Result: caption overlay ── */
        .snap-caption {
          position: absolute;
          bottom: 10px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          color: #F5EDE0;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        }
        .snap-caption-label {
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          opacity: 0.9;
        }
        .snap-caption-title {
          font-size: 18px;
          font-style: italic;
          margin-top: 2px;
          letter-spacing: 0.02em;
        }
        .snap-caption-no {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.85;
        }

        /* ── Result: save & share ── */
        .snap-actions-row {
          display: flex;
          justify-content: center;
          gap: 28px;
          margin-bottom: 22px;
        }
        .snap-circle-btn {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #2C1810;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(44, 24, 16, 0.20);
          transition: transform 0.15s ease;
        }
        .snap-circle-btn:active {
          transform: scale(0.94);
        }
        .snap-circle-label {
          font-size: 11px;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          letter-spacing: 0.08em;
          color: #2C1810;
        }
        .snap-circle-sub {
          font-size: 8px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          color: #A88B78;
          font-style: italic;
          margin-top: -4px;
        }

        /* ── Result: divider ── */
        .snap-result-divider {
          height: 1px;
          background: #2C1810;
          opacity: 0.15;
          margin: 4px 40px 18px;
        }

        /* ── Result: retry link ── */
        .snap-retry-link {
          display: block;
          margin: 0 auto;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          font-size: 13px;
          font-style: italic;
          letter-spacing: 0.04em;
          color: #2C1810;
          opacity: 0.75;
          padding: 6px 12px;
          border-bottom: 1px solid #2C1810;
        }
        .snap-retry-link:hover {
          opacity: 1;
        }

        /* ── Tone adjust button ── */
        .snap-tone-btn {
          background: none;
          border: none;
          cursor: pointer;
          width: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Loading state ── */
        .snap-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
        }
        .snap-loading-title {
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          font-size: 22px;
          font-style: italic;
          letter-spacing: 0.06em;
          color: #2C1810;
        }
        .snap-loading-sub {
          font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;
          font-size: 12px;
          letter-spacing: 0.16em;
          color: #A88B78;
          margin-top: 8px;
        }
        .snap-loading-dots {
          display: flex;
          gap: 6px;
          margin-top: 20px;
        }
        .snap-loading-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2C1810;
          opacity: 0.4;
          animation: snapDotPulse 1.2s ease-in-out infinite;
        }
        .snap-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .snap-loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes snapDotPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.1); }
        }

        /* ── Animations ── */
        @keyframes snapFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .snap-fade-in {
          animation: snapFadeIn 0.4s ease;
        }
      `}</style>
      <div className="snap-shell">
        <div className="snap-root">
          {children}
        </div>
      </div>
    </div>
  );
}
