import type { Metadata } from "next";
import PostClient from "./PostClient";

export const metadata: Metadata = {
  title: "夢を書く | ゆめハンドレッド",
  description:
    "こんな未来、良いよね！を140文字で書いてください。AIがあなたの言葉を画像にします。",
};

export default function YumePostPage() {
  return <PostClient />;
}
