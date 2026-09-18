import type { Metadata } from "next";
import MatBoard from "./MatBoard";

export const metadata: Metadata = {
  title: "ブルテリア柔術チャンピオンシップ2026 ARTA タイムテーブル",
  description:
    "2026年9月19日（土）横浜武道館。JBJJFブルテリア柔術チャンピオンシップ2026のトーナメント表から、ARTA所属18名・20試合の集合時間・マット・対戦相手・勝ち上がりを抜き出した一覧。",
  openGraph: {
    title: "ブルテリア柔術チャンピオンシップ2026 ARTA タイムテーブル",
    description: "ARTA所属18名・20試合。集合時間、マット、対戦相手、勝ち上がりを1ページで。",
    url: "https://ciraf.jp/bt2026/",
    type: "website",
  },
};

export default function Page() {
  return <MatBoard />;
}
