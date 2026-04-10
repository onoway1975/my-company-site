import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DeferredWidgets } from "./components/DeferredWidgets";

export const metadata: Metadata = {
  metadataBase: new URL("https://ciraf.jp"),
  title: {
    default: "東京のWeb・映像制作 シラフ株式会社 | ブランドを、もっと強くする",
    template: "%s | シラフ株式会社",
  },
  description:
    "Webサイト・映像・ブランディングで、あなたのビジネスを前に進めます。東京・シラフ株式会社。ロマンある丸投げOK。まず実績をご覧ください。",
  alternates: {
    canonical: "https://ciraf.jp",
  },
  openGraph: {
    type: "website",
    siteName: "シラフ株式会社",
    locale: "ja_JP",
    title: "東京のWeb・映像制作 シラフ株式会社 | ブランドを、もっと強くする",
    description:
      "Webサイト・映像・ブランディングで、あなたのビジネスを前に進めます。東京・シラフ株式会社。ロマンある丸投げOK。まず実績をご覧ください。",
    url: "https://ciraf.jp",
    images: [
      {
        url: "https://ciraf.jp/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "シラフ株式会社 | ciraf inc.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://ciraf.jp/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "gMgVvhWfHbKRLBEZMjoX4sKNS8YSPfFrsUUBGS0DmSE",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ciraf.jp/#website",
      url: "https://ciraf.jp/",
      name: "シラフ株式会社",
      alternateName: "ciraf inc.",
      description:
        "シラフ株式会社（ciraf inc.）は、東京のWeb制作・ブランディング・映像制作会社です。クライアントのビジネス成長を実行力とホスピタリティで支えます。",
    },
    {
      "@type": "Organization",
      "@id": "https://ciraf.jp/#organization",
      name: "シラフ株式会社",
      alternateName: "ciraf inc.",
      url: "https://ciraf.jp/",
      logo: {
        "@type": "ImageObject",
        url: "https://ciraf.jp/icon.png",
        width: 512,
        height: 512,
      },
      image: "https://ciraf.jp/og-image.jpg",
      address: {
        "@type": "PostalAddress",
        streetAddress: "神宮前3-25-18 205 THE SHARE",
        addressLocality: "渋谷区",
        addressRegion: "東京都",
        postalCode: "150-0001",
        addressCountry: "JP",
      },
      telephone: "03-4540-7546",
      sameAs: ["https://note.com/ciraf"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={bebas.variable}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        <DeferredWidgets />
      </body>
    </html>
  );
}
