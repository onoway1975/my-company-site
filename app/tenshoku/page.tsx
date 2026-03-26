import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import TenshowClient from "./TenshowClient";

export const maxDuration = 120;

function getTenshowImages(): string[] {
  const base = path.join(process.cwd(), "public", "tenshoku");
  const images: string[] = [];
  for (const gender of ["male", "female"]) {
    const dir = path.join(base, gender);
    try {
      const files = fs.readdirSync(dir).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
      for (const file of files) {
        images.push(`/tenshoku/${gender}/${file}`);
      }
    } catch {
      // ディレクトリが未作成の場合はスキップ
    }
  }
  return images;
}

export const metadata: Metadata = {
  title: "これがホントの天職占い | ciraf",
  description: "5つの質問に答えるだけ。AIがあなたの天職を診断し、その姿に写真を合成します。",
  robots: "noindex, nofollow",
};

export default function TenshowPage() {
  const images = getTenshowImages();

  return (
    <main className="min-h-screen">
      <TenshowClient images={images} />
    </main>
  );
}
