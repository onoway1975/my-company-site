import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ChatWidget } from "./components/ChatWidget";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://ciraf.jp"),
  title: {
    default: "シラフ株式会社 | Webデザイン・映像・デジタルクリエイティブ 東京",
    template: "%s | シラフ株式会社",
  },
  description:
    "シラフ株式会社（ciraf inc.）は、東京のWeb制作・ブランディング・映像制作会社です。クライアントのビジネス成長を実行力とホスピタリティで支えます。",
  alternates: {
    canonical: "https://ciraf.jp",
  },
  openGraph: {
    type: "website",
    siteName: "シラフ株式会社",
    locale: "ja_JP",
    title: "シラフ株式会社 | Webデザイン・映像・デジタルクリエイティブ 東京",
    description:
      "シラフ株式会社（ciraf inc.）は、東京のWeb制作・ブランディング・映像制作会社です。クライアントのビジネス成長を実行力とホスピタリティで支えます。",
    url: "https://ciraf.jp",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans">
        {/* Google Tag Manager */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-N85P87G');`,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N85P87G"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager */}
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
        <ChatWidget />
        <SpeedInsights />
      </body>
    </html>
  );
}
