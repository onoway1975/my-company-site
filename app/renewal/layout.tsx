import { StepProvider } from "./StepContext";

export default function RenewalLayout({
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
        @font-face {
          font-family: 'LINE Seed EN';
          src: url('/fonts/LINESeedSans_W_Rg.woff2') format('woff2');
          font-weight: 400;
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
          display: "flex",
          flexDirection: "column",
          background: "#F2EFE8",
          fontFamily: "'LINE Seed JP', 'LINE Seed EN', sans-serif",
        }}
      >
        <StepProvider>{children}</StepProvider>
      </div>
    </>
  );
}
