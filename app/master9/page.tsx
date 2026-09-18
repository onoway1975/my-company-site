import type { Metadata } from "next";
import MatBoard from "./MatBoard";

export const metadata: Metadata = {
  title: "第9回全日本マスター柔術オープン ARTA タイムテーブル",
  description:
    "2026年9月20日（日）横浜武道館。JBJJF第9回全日本マスター柔術オープントーナメントのトーナメント表から、ARTA所属30名・31試合の集合時間・マット・対戦相手を抜き出した一覧。",
  openGraph: {
    title: "第9回全日本マスター柔術オープン ARTA タイムテーブル",
    description:
      "ARTA所属30名・31試合。集合時間、マット、対戦相手を1ページで。",
    url: "https://ciraf.jp/master9/",
    type: "website",
    // images: ["/ogp/master9.png"],
  },
};

export default function Page() {
  return <MatBoard />;
}
