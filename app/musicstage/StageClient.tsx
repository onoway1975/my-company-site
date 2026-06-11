"use client";

import dynamic from "next/dynamic";

const MusicStage = dynamic(() => import("./MusicStage"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "clamp(520px, 82dvh, 920px)",
        borderRadius: 18,
        background: "#050507",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#5a6b57",
        fontSize: 13,
      }}
    >
      読み込み中…
    </div>
  ),
});

export default function StageClient() {
  return <MusicStage />;
}
