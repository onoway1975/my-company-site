import type { Metadata } from "next";
import StageClient from "./StageClient";

export const metadata: Metadata = {
  title: "MUSIC STAGE | ciraf",
  description:
    "音楽に合わせて踊る3Dキャラクターステージ。デモビートを再生するか、iTunesから曲を探して反応を楽しめます。",
  openGraph: {
    title: "MUSIC STAGE | ciraf",
    description: "音楽に合わせて踊る3Dキャラクターステージ。",
  },
};

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "28px 16px 48px",
      }}
    >
      <header style={{ margin: "8px 2px 18px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "0.02em" }}>
          MUSIC STAGE
        </h1>
        <p style={{ fontSize: 13.5, color: "#6b7568", margin: "8px 0 0", lineHeight: 1.7 }}>
          音楽に合わせて踊る3Dキャラクター。デモビートを再生するか、iTunesから曲を探してください。
          ビートで弾み、強い音で「ビビッ」と変形し、音量に応じて仲間が増えていきます。
        </p>
      </header>

      <StageClient />
    </main>
  );
}
