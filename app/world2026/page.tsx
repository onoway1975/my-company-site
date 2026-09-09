import type { Metadata } from "next";
import MatBoard from "./MatBoard";

export const metadata: Metadata = {
  title: "SJJIF ワールド選手権 2026 ARTA タイムテーブル",
  description:
    "SJJIF World Championship 2026 / World No-Gi Championship 2026 の公開ブラケットから、ARTA所属選手51名・107試合の試合時間・マット・対戦相手を抜き出した非公式タイムテーブル。",
  openGraph: {
    title: "SJJIF ワールド選手権 2026 ARTA タイムテーブル",
    description:
      "ARTA所属選手51名・107試合。試合時間、マット、対戦相手を1ページで。",
    url: "https://ciraf.jp/world2026/",
    type: "website",
    // images: ["/ogp/world2026.png"], // 用意できたら
  },
};

export default function Page() {
  return <MatBoard />;
}
