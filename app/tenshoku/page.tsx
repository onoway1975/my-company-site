import type { Metadata } from "next";
import TenshowClient from "./TenshowClient";

export const maxDuration = 120;

export const metadata: Metadata = {
  title: "これがホントの天職占い | AIが天職を診断して画像を生成",
  description:
    "写真をアップロードして5問に答えるだけ。AIがあなたの天職を診断し、その職業シーンに自分の顔を合成した画像を生成します。医師・エンジニア・デザイナーなど12種類の天職から診断。",
  keywords: [
    "天職占い",
    "AI占い",
    "天職診断",
    "AI画像生成",
    "顔合成",
    "職業診断",
    "キャリア診断",
  ],
  openGraph: {
    title: "これがホントの天職占い | AIが天職を診断して画像を生成",
    description:
      "写真をアップロードして5問に答えるだけ。AIがあなたの天職を診断し、その職業シーンに自分の顔を合成した画像を生成します。",
    url: "https://ciraf.jp/tenshoku/",
    siteName: "ciraf | シラフ株式会社",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://ciraf.jp/tenshoku-ogp.jpg",
        width: 1200,
        height: 630,
        alt: "これがホントの天職占い",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "これがホントの天職占い | AIが天職を診断して画像を生成",
    description:
      "写真をアップロードして5問に答えるだけ。AIがあなたの天職を診断し画像を生成します。",
    images: ["https://ciraf.jp/tenshoku-ogp.jpg"],
  },
  alternates: {
    canonical: "https://ciraf.jp/tenshoku/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "これがホントの天職占い",
  description:
    "AIがあなたの天職を診断し、その職業シーンに自分の顔を合成した画像を生成するWebサービス",
  url: "https://ciraf.jp/tenshoku/",
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  creator: {
    "@type": "Organization",
    name: "シラフ株式会社",
    url: "https://ciraf.jp",
  },
};

export default function TenshowPage() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TenshowClient />
    </main>
  );
}
