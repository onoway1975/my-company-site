import type { Metadata } from "next";
import Yume100Client from "./Yume100Client";

export const metadata: Metadata = {
  title: "ゆめハンドレッド | こんな未来、良いよね！",
  description:
    "あなたの言葉がAI画像になる。100人の指が止まったら、未来への提案書になります。あなたが思い描く未来を140文字で投稿してください。",
  openGraph: {
    title: "ゆめハンドレッド | こんな未来、良いよね！",
    description:
      "あなたの言葉がAI画像になる。100人の指が止まったら、未来への提案書になります。",
    url: "https://ciraf.jp/yume100/",
    images: [{ url: "https://ciraf.jp/yume100/ogp.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ゆめハンドレッド | こんな未来、良いよね！",
    description:
      "あなたの言葉がAI画像になる。100人の指が止まったら、未来への提案書になります。",
    images: ["https://ciraf.jp/yume100/ogp.jpg"],
  },
};

export default function Yume100Page() {
  return <Yume100Client />;
}
