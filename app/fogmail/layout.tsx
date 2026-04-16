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
        #hubspot-messages-iframe-container,
        .hs-shadow-container,
        [id*="hubspot"],
        [class*="hubspot"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
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
