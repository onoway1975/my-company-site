import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SWIPE BID — 入札案件をスワイプで探す",
  description:
    "官公庁の入札案件をスワイプで効率チェック。Web制作・動画・デザイン・ライティングの案件をAIマッチング。",
};

export default function SwipeBidLayout({
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700;800&display=swap');

        /* ── Outer shell (PC background) ── */
        .sb-shell {
          min-height: 100vh;
          min-height: 100dvh;
          background: #E8EDF5;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        @media (min-width: 640px) {
          .sb-shell {
            align-items: center;
            padding: 24px 0;
          }
        }

        /* ── App root (phone frame) ── */
        .sb-root {
          width: 100%;
          height: 100vh;
          height: 100dvh;
          background: #F4F6FB;
          font-family: 'Inter', 'Noto Sans JP', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .sb-root {
            max-width: 430px;
            height: 844px;
            border-radius: 40px;
            box-shadow:
              0 8px 40px rgba(11, 29, 58, 0.18),
              0 0 0 1px rgba(11, 29, 58, 0.06);
          }
        }

        /* ── Scrollbar hide ── */
        .sb-scroll::-webkit-scrollbar { display: none; }
        .sb-scroll { scrollbar-width: none; }

        /* ── Animations ── */
        @keyframes sb-fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sb-slideup {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      <div className="sb-shell">
        <div className="sb-root">
          {children}
        </div>
      </div>
    </div>
  );
}
