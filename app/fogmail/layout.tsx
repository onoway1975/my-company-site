import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fog mail | 息を吹きかけて書いて、10分で消えるメッセージ",
  description:
    "結露した窓ガラスに指でメッセージを書いて送る。受け取った人が開くと同じ窓ガラスにメッセージが浮かび上がる。10分で消える、新しいメッセージ体験。",
  keywords: ["fog mail", "メッセージ", "結露", "窓ガラス", "10分で消える", "ciraf"],
  openGraph: {
    title: "息を吹きかけて書いて、10分で消える。Claudeと1日で作った。| fog mail",
    description:
      "結露した窓ガラスに指でメッセージを書いて送る。受け取った人が開くと同じ窓ガラスにメッセージが浮かび上がる。10分で消える。",
    url: "https://ciraf.jp/fogmail/",
    siteName: "ciraf inc.",
    images: [
      {
        url: "https://ciraf.jp/fogmail/ogp.jpg",
        width: 1280,
        height: 670,
        alt: "fog mail - 結露した窓ガラスに指でメッセージを書いて送る",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "息を吹きかけて書いて、10分で消える。| fog mail",
    description: "結露した窓ガラスに指でメッセージを書いて送る新しい体験。",
    images: ["https://ciraf.jp/fogmail/ogp.jpg"],
  },
};

export default function FogmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ isolation: "isolate" }}>
      <style>{`
        @font-face {
          font-family: 'LINE Seed JP';
          src: url('/fonts/LINESeedJP_OTF_Bd.woff2') format('woff2');
          font-weight: 700;
          font-display: swap;
        }
        body > header,
        body > footer,
        #__next > header,
        #__next > footer,
        header.fixed,
        footer {
          display: none !important;
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
    </div>
  );
}
