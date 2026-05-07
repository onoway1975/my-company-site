import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "STRIPES — しまうまの模様はどうしてできるの？ | TOUCH LAB | ciraf inc.",
  description:
    "指で絵の具を落として、しまうまやヒョウの模様を作ってみよう。反応拡散シミュレーションで遊べるWeb実験。",
  alternates: {
    canonical: "https://ciraf.jp/touchlab/stripes/",
  },
  openGraph: {
    title: "STRIPES — しまうまの模様はどうしてできるの？",
    description:
      "指で絵の具を落として、しまうまやヒョウの模様を作ってみよう。反応拡散シミュレーションで遊べるWeb実験。",
    url: "https://ciraf.jp/touchlab/stripes/",
    siteName: "ciraf inc.",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://ciraf.jp/touchlab/stripes/og.jpg",
        width: 1280,
        height: 670,
        alt: "STRIPES — TOUCH LAB",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STRIPES — しまうまの模様はどうしてできるの？",
    description:
      "指で絵の具を落として、しまうまやヒョウの模様を作ってみよう。",
  },
};

export default function StripesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
