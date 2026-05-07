import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FLOCK | 鳥はどうして同じ向きに飛ぶの？ | TOUCH LAB | ciraf inc.",
  description:
    "たった3つのルールで群れができる。指でエサを置くと200羽の鳥が寄ってきます。",
  alternates: {
    canonical: "https://ciraf.jp/touchlab/flock/",
  },
  openGraph: {
    title: "FLOCK | 鳥はどうして同じ向きに飛ぶの？",
    description:
      "たった3つのルールで群れができる。指でエサを置くと200羽の鳥が寄ってきます。",
    url: "https://ciraf.jp/touchlab/flock/",
    siteName: "ciraf inc.",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://ciraf.jp/touchlab/flock/og.jpg",
        width: 1280,
        height: 670,
        alt: "FLOCK — TOUCH LAB",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FLOCK | 鳥はどうして同じ向きに飛ぶの？",
    description:
      "たった3つのルールで群れができる。指でエサを置くと200羽の鳥が寄ってきます。",
  },
};

export default function FlockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
