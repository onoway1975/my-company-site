/**
 * 天職占い用 元画像一括生成スクリプト
 *
 * Usage:
 *   npx tsx scripts/generate-tenshow-images.ts
 *
 * 事前準備:
 *   rm -rf public/tenshow/male public/tenshow/female
 */

import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";

// ── .env.local を手動ロード ────────────────────────────────────────────────
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
    if (m) {
      const [, key, val] = m;
      if (!process.env[key]) process.env[key] = val.replace(/^["']|["']$/g, "");
    }
  }
}

if (!process.env.FAL_KEY) {
  console.error("Error: FAL_KEY が設定されていません");
  process.exit(1);
}
fal.config({ credentials: process.env.FAL_KEY });

// ── 職種定義 ──────────────────────────────────────────────────────────────────

const genders = ["male", "female"] as const;

const vocations = [
  {
    id: "doctor",
    promptMale:   "Japanese male doctor in white coat, stethoscope around neck, hospital corridor background, professional portrait, friendly smile, photorealistic, high quality, sharp focus on face",
    promptFemale: "Japanese female doctor in white coat, stethoscope around neck, hospital corridor background, professional portrait, friendly smile, photorealistic, high quality, sharp focus on face",
  },
  {
    id: "entrepreneur",
    promptMale:   "Japanese male entrepreneur in smart casual outfit, standing in modern open office, confident expression, arms crossed, photorealistic, high quality, sharp focus on face",
    promptFemale: "Japanese female entrepreneur in smart casual outfit, standing in modern open office, confident expression, arms crossed, photorealistic, high quality, sharp focus on face",
  },
  {
    id: "engineer",
    promptMale:   "Japanese male software engineer in casual clothes, sitting at desk with laptop and monitors, modern tech office, focused expression, photorealistic, high quality, sharp focus on face",
    promptFemale: "Japanese female software engineer in casual clothes, sitting at desk with laptop and monitors, modern tech office, focused expression, photorealistic, high quality, sharp focus on face",
  },
  {
    id: "designer",
    promptMale:   "Japanese male graphic designer in stylish outfit, creative studio with design work visible in background, holding tablet, photorealistic, high quality, sharp focus on face",
    promptFemale: "Japanese female graphic designer in stylish outfit, creative studio with design work visible in background, holding tablet, photorealistic, high quality, sharp focus on face",
  },
  {
    id: "nursery",
    promptMale:   "Japanese male nursery school teacher in casual colorful clothes, kindergarten classroom background with toys, warm genuine smile, photorealistic, high quality, sharp focus on face",
    promptFemale: "Japanese female nursery school teacher in casual colorful clothes, kindergarten classroom background with toys, warm genuine smile, photorealistic, high quality, sharp focus on face",
  },
  {
    id: "trainer",
    promptMale:   "Japanese male personal trainer in athletic wear, gym equipment background, energetic confident pose, photorealistic, high quality, sharp focus on face",
    promptFemale: "Japanese female personal trainer in athletic wear, gym equipment background, energetic confident pose, photorealistic, high quality, sharp focus on face",
  },
  {
    id: "craftsman",
    promptMale:   "Japanese male traditional craftsman in work apron, wooden workshop background with handmade crafts visible, skilled artisan expression, photorealistic, high quality, sharp focus on face",
    promptFemale: "Japanese female traditional craftsman in work apron, wooden workshop background with handmade crafts visible, skilled artisan expression, photorealistic, high quality, sharp focus on face",
  },
  {
    id: "researcher",
    promptMale:   "Japanese male scientist researcher in white lab coat, laboratory background with equipment and test tubes, intellectual expression, photorealistic, high quality, sharp focus on face",
    promptFemale: "Japanese female scientist researcher in white lab coat, laboratory background with equipment and test tubes, intellectual expression, photorealistic, high quality, sharp focus on face",
  },
  {
    id: "farmer",
    promptMale:   "Japanese male farmer in work clothes and hat, lush green rice paddy field background, natural sunlight, warm smile, photorealistic, high quality, sharp focus on face",
    promptFemale: "Japanese female farmer in work clothes and hat, lush green rice paddy field background, natural sunlight, warm smile, photorealistic, high quality, sharp focus on face",
  },
  {
    id: "explorer",
    promptMale:   "Japanese male explorer in outdoor adventure gear and jacket, jungle or mountain background, adventurous expression, photorealistic, high quality, sharp focus on face",
    promptFemale: "Japanese female explorer in outdoor adventure gear and jacket, jungle or mountain background, adventurous expression, photorealistic, high quality, sharp focus on face",
  },
  {
    id: "hairdresser",
    promptMale:   "Japanese male hairdresser in stylish black outfit, holding scissors, hair salon background with mirrors, professional smile, photorealistic, high quality, sharp focus on face",
    promptFemale: "Japanese female hairdresser in stylish black outfit, holding scissors, hair salon background with mirrors, professional smile, photorealistic, high quality, sharp focus on face",
  },
  {
    id: "game-creator",
    promptMale:   "Japanese male game developer in casual clothes, sitting in front of multiple monitors displaying game graphics, gaming setup, focused expression, photorealistic, high quality, sharp focus on face",
    promptFemale: "Japanese female game developer in casual clothes, sitting in front of multiple monitors displaying game graphics, gaming setup, focused expression, photorealistic, high quality, sharp focus on face",
  },
];

// ── メイン ────────────────────────────────────────────────────────────────────

async function main() {
  // 出力ディレクトリ作成
  for (const gender of genders) {
    const dir = path.join(process.cwd(), "public", "tenshow", gender);
    fs.mkdirSync(dir, { recursive: true });
  }

  const total = genders.length * vocations.length;
  let count = 0;

  console.log(`\n天職占い画像生成開始 — 合計 ${total} 枚\n`);

  for (const gender of genders) {
    for (const vocation of vocations) {
      count++;
      const prompt = gender === "male" ? vocation.promptMale : vocation.promptFemale;
      const outPath = path.join(process.cwd(), "public", "tenshow", gender, `${vocation.id}.jpg`);

      console.log(`[${count}/${total}] 生成中: ${gender}/${vocation.id}`);
      console.log(`         prompt: ${prompt.slice(0, 80)}...`);

      try {
        const result = await fal.subscribe("fal-ai/flux/dev", {
          input: {
            prompt,
            image_size: "portrait_4_3",
            num_inference_steps: 28,
            guidance_scale: 3.5,
            num_images: 1,
            enable_safety_checker: true,
          },
        });

        const imageUrl = (result.data as { images: { url: string }[] }).images[0].url;

        const res = await fetch(imageUrl);
        if (!res.ok) throw new Error(`download failed: ${res.status}`);
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(outPath, buffer);

        console.log(`         ✓ 保存: public/tenshow/${gender}/${vocation.id}.jpg\n`);
      } catch (e) {
        console.error(`         ✗ エラー: ${e instanceof Error ? e.message : e}\n`);
      }
    }
  }

  console.log("─".repeat(50));
  console.log(`完了 — public/tenshow/ を確認してください`);
}

main().catch((e) => {
  console.error("予期しないエラー:", e);
  process.exit(1);
});
