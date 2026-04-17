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
        /* ── Button micro-interactions ── */
        .btn-primary {
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s, color 0.15s, opacity 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(13, 27, 42, 0.25);
        }
        .btn-primary:active:not(:disabled) {
          transform: translateY(0px);
          box-shadow: none;
        }
        .btn-secondary {
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s, color 0.15s, opacity 0.2s;
        }
        .btn-secondary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(232, 130, 26, 0.35);
        }
        .btn-secondary:active:not(:disabled) {
          transform: translateY(0px);
          box-shadow: none;
        }
        .btn-outline {
          transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;
        }
        .btn-outline:hover {
          transform: translateY(-2px);
          background: #1A1A1A !important;
          color: #ffffff !important;
        }
        .btn-outline:active {
          transform: translateY(0px);
        }
        .btn-text {
          transition: color 0.15s ease, letter-spacing 0.15s ease;
        }
        .btn-text:hover {
          color: #1A1A1A;
          letter-spacing: 0.03em;
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
