import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "証明写真メーカー｜写真1枚でAIが証明写真を自動生成 | ciraf inc.",
  description:
    "普段の写真をアップするだけでAIがスーツ・表情・背景を整えて証明写真に仕上げます。就活・転職・免許証など用途に合わせて背景色も選べる。A4シール用紙用PDFダウンロード機能付き。無料で試せる。",
  keywords: [
    "証明写真",
    "証明写真メーカー",
    "証明写真作成",
    "AI証明写真",
    "履歴書写真",
    "就活写真",
    "証明写真アプリ",
    "証明写真自動生成",
  ],
  openGraph: {
    title: "証明写真メーカー｜写真1枚でAIが証明写真を自動生成",
    description:
      "普段の写真をアップするだけでAIがスーツ・表情・背景を整えて証明写真に仕上げます。就活・転職・免許証など用途に合わせて背景色も選べる。",
    url: "https://ciraf.jp/resumephoto/",
    images: [
      {
        url: "https://ciraf.jp/resumephoto/hero.webp",
        width: 1280,
        height: 670,
        alt: "証明写真メーカー - 写真1枚でAIが証明写真を自動生成",
      },
    ],
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "証明写真メーカー｜写真1枚でAIが証明写真を自動生成",
    description:
      "普段の写真をアップするだけでAIがスーツ・表情・背景を整えて証明写真に仕上げます。",
    images: ["https://ciraf.jp/resumephoto/hero.webp"],
  },
  alternates: {
    canonical: "https://ciraf.jp/resumephoto/",
  },
};

export default function ResumePhotoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
