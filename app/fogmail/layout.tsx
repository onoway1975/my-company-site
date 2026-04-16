import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fog mail",
};

export default function FogmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        @font-face {
          font-family: 'LINE Seed JP';
          src: url('/fonts/LINESeedJP_OTF_Bd.woff2') format('woff2');
          font-weight: 700;
          font-display: swap;
        }
        /* cirafチャットウィジェットを非表示 */
        [data-gtm-click="chat_toggle"],
        [data-gtm-location="chat_widget"] {
          display: none !important;
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          overflow: "hidden",
          fontFamily: "'LINE Seed JP', sans-serif",
        }}
      >
        {children}
      </div>
    </>
  );
}
