import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ぷに文字メーカー | 好きな言葉をぷっくり3D文字に",
  description:
    "Gemini 3.1 Flash Image（Nano Banana 2）搭載。ひらがな・カタカナ・漢字OK。インスタストーリー素材として使えるぷっくり3D文字を無料で生成。",
  openGraph: {
    title: "ぷに文字メーカー",
    description: "好きな言葉をぷっくり3D文字に",
    images: ["/punimoji/ogp.png"],
    url: "https://ciraf.jp/punimoji/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ぷに文字メーカー",
    description: "好きな言葉をぷっくり3D文字に",
    images: ["/punimoji/ogp.png"],
  },
};

export default function PunimojiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        @font-face {
          font-family: 'LINE Seed JP';
          src: url('/fonts/LINESeedJP_OTF_Rg.woff2') format('woff2');
          font-weight: 400;
          font-display: swap;
        }
        @font-face {
          font-family: 'LINE Seed JP';
          src: url('/fonts/LINESeedJP_OTF_Bd.woff2') format('woff2');
          font-weight: 700;
          font-display: swap;
        }

        .bg-sunburst {
          background: radial-gradient(circle at center, #FFFFFF 0%, #FFD9E3 70%, #FFB8D0 100%);
          position: relative;
          font-family: 'LINE Seed JP', sans-serif;
        }
        .bg-sunburst::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-conic-gradient(
            from 0deg at 50% 30%,
            rgba(255, 217, 227, 0.6) 0deg 10deg,
            transparent 10deg 20deg
          );
          pointer-events: none;
          z-index: 0;
        }

        .btn-puni {
          background: linear-gradient(180deg, #FF5AA0 0%, #FF3B8E 100%);
          border: none;
          border-radius: 9999px;
          padding: 18px 36px;
          color: white;
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 0.05em;
          font-family: 'LINE Seed JP', sans-serif;
          box-shadow:
            inset 0 2px 4px rgba(255, 255, 255, 0.6),
            inset 0 -4px 8px rgba(0, 0, 0, 0.12),
            0 4px 12px rgba(255, 59, 142, 0.4),
            0 8px 20px rgba(255, 59, 142, 0.2);
          transition: transform 0.15s, box-shadow 0.15s;
          cursor: pointer;
        }
        .btn-puni:hover {
          transform: translateY(-2px);
        }
        .btn-puni:active {
          transform: translateY(2px);
          box-shadow:
            inset 0 2px 4px rgba(255, 255, 255, 0.4),
            inset 0 -2px 4px rgba(0, 0, 0, 0.1),
            0 2px 6px rgba(255, 59, 142, 0.4);
        }
        .btn-puni:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .input-puni {
          background: white;
          border: 3px solid #FFD9E3;
          border-radius: 9999px;
          padding: 18px 28px;
          font-size: 22px;
          font-weight: 700;
          color: #2D1B3D;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
          font-family: 'LINE Seed JP', sans-serif;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input-puni:focus {
          border-color: #FF3B8E;
          outline: none;
          box-shadow: 0 0 0 4px rgba(255, 59, 142, 0.2);
        }
        .input-puni::placeholder {
          color: #FFB8D0;
          font-weight: 500;
        }

        .card-puni {
          background: white;
          border-radius: 32px;
          padding: 28px 24px;
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 0.8),
            0 4px 16px rgba(255, 59, 142, 0.12),
            0 12px 32px rgba(255, 59, 142, 0.06);
        }

        .style-chip {
          flex: 1;
          aspect-ratio: 1;
          max-width: 72px;
          border-radius: 20px;
          background: white;
          border: 3px solid #FFD9E3;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #8B7A9A;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'LINE Seed JP', sans-serif;
          padding: 0;
        }
        .style-chip.active {
          border-color: #FF3B8E;
          background: linear-gradient(180deg, #FFFFFF 0%, #FFE4EF 100%);
          color: #FF3B8E;
          box-shadow:
            inset 0 2px 4px rgba(255, 255, 255, 0.8),
            0 4px 12px rgba(255, 59, 142, 0.25);
        }
        .style-chip .emoji {
          font-size: 24px;
        }

        @keyframes puniFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes puniFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {children}
    </>
  );
}
