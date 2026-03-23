"use server";

import Replicate from "replicate";
import { fal } from "@fal-ai/client";
import { figures } from "@/app/data/figures";

fal.config({ credentials: process.env.FAL_KEY });

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function runWithRetry(
  model: `${string}/${string}`,
  input: Record<string, unknown>,
  retries = 3
): Promise<unknown> {
  for (let i = 0; i < retries; i++) {
    try {
      return await replicate.run(model, { input });
    } catch (err) {
      const is429 =
        err instanceof Error &&
        (err.message.includes("429") || err.message.toLowerCase().includes("rate limit"));
      if (is429 && i < retries - 1) {
        console.log(`[replicate] 429 rate limit, retrying in 6s... (attempt ${i + 1}/${retries})`);
        await wait(6000);
        continue;
      }
      throw err;
    }
  }
}


export async function generatePortrait(
  figureId: string
): Promise<{ output: string[] }> {
  const figure = figures.find((f) => f.id === figureId);
  if (!figure) throw new Error("偉人データが見つかりません");

  const output = await runWithRetry("black-forest-labs/flux-1.1-pro", {
    prompt: figure.prompt,
    width: 768,
    height: 768,
    num_outputs: 1,
  });

  console.log("[generatePortrait] raw output:", output);
  console.log("[generatePortrait] output type:", typeof output);
  console.log("[generatePortrait] is array:", Array.isArray(output));

  const raw = Array.isArray(output) ? output[0] : output;
  // SDK が URL オブジェクトを返す場合があるため文字列化
  const imageUrl = raw instanceof URL ? raw.toString() : String(raw);
  console.log("[generatePortrait] imageUrl (string):", imageUrl);

  return { output: [imageUrl] };
}

// Step 1: flux-1.1-pro で偉人スタイル画像を生成
export async function generateStyleImage(
  figureId: string
): Promise<{ styleImageUrl: string }> {
  const figure = figures.find((f) => f.id === figureId);
  if (!figure) throw new Error("偉人データが見つかりません");

  const t0 = Date.now();
  console.log(`[step1] START flux-1.1-pro | figure=${figureId} | ${new Date().toISOString()}`);
  console.log(`[step1] prompt: "${figure.prompt}"`);

  const output = await runWithRetry("black-forest-labs/flux-1.1-pro", {
    prompt: figure.prompt,
    width: 768,
    height: 768,
    num_outputs: 1,
  });

  const raw = Array.isArray(output) ? output[0] : output;
  const styleImageUrl = raw instanceof URL ? raw.toString() : String(raw);
  console.log(`[step1] DONE | ${Date.now() - t0}ms | url=${styleImageUrl}`);

  return { styleImageUrl };
}

// FAL.ai 接続テスト (rembg: 無料モデルで疎通確認)
export async function testFalConnection(): Promise<{ ok: boolean; url?: string; error?: string }> {
  fal.config({ credentials: process.env.FAL_KEY });
  console.log(`[fal-test] FAL_KEY=${process.env.FAL_KEY ? "set (" + process.env.FAL_KEY.slice(0, 8) + "...)" : "NOT SET"}`);
  try {
    const result = await fal.subscribe("fal-ai/imageutils/rembg", {
      input: {
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/240px-PNG_transparency_demonstration_1.png",
      },
    });
    const url = (result.data as { image: { url: string } }).image.url;
    console.log(`[fal-test] SUCCESS url=${url}`);
    return { ok: true, url };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[fal-test] ERROR: ${msg}`);
    return { ok: false, error: msg };
  }
}

// Step 2: ユーザー顔を偉人スタイル画像に合成 (FAL.ai face-swap)
export async function swapFaces(
  styleImageUrl: string,
  userImageDataUrl: string
): Promise<{ output: string[] }> {
  fal.config({ credentials: process.env.FAL_KEY });
  const t0 = Date.now();
  console.log(`[step2] START fal-ai/face-swap | ${new Date().toISOString()}`);
  console.log(`[step2] base_image_url=${styleImageUrl}`);
  console.log(`[step2] swap_image_url length=${userImageDataUrl.length}`);

  const result = await fal.subscribe("fal-ai/face-swap", {
    input: {
      base_image_url: styleImageUrl,
      swap_image_url: userImageDataUrl,
    },
  });

  const fusedImageUrl = (result.data as { image: { url: string } }).image.url;
  console.log(`[step2] DONE | ${Date.now() - t0}ms | url=${fusedImageUrl}`);

  return { output: [fusedImageUrl] };
}
