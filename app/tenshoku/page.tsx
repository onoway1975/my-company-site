import type { Metadata } from "next";
import TenshowClient from "./TenshowClient";

export const maxDuration = 120;

export const metadata: Metadata = {
  title: "これがホントの天職占い | ciraf",
  description: "5つの質問に答えるだけ。AIがあなたの天職を診断し、その姿に写真を合成します。",
  robots: "noindex, nofollow",
};

export default function TenshowPage() {
  return (
    <main className="min-h-screen">
      <TenshowClient />
    </main>
  );
}
