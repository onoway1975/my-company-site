"use server";

import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { fal } from "@/app/lib/falClient";
import { VOCATIONS, getImagePath, type Vocation, type Gender } from "./data";

export async function generateTenshowResult(
  vocationId: string,
  gender: Gender,
  nickname: string,
  birthdate: string,
  userImageDataUrl: string
): Promise<{ fusedImageUrl: string; description: string }> {
  const vocation = VOCATIONS.find((v) => v.id === vocationId);
  if (!vocation) throw new Error("天職データが見つかりません");

  const [fusedImageUrl, description] = await Promise.all([
    runFaceSwap(vocation, gender, userImageDataUrl),
    generateDescription(vocation, nickname, birthdate),
  ]);

  return { fusedImageUrl, description };
}

async function runFaceSwap(
  vocation: Vocation,
  gender: Gender,
  userImageDataUrl: string
): Promise<string> {
  const isFemale = gender === "female";

  const GENDER_PREFIX = isFemale
    ? "cinematic photo, Japanese woman, female, "
    : "cinematic photo, Japanese man, male, ";

  const GENDER_FACE_SUFFIX = isFemale
    ? "preserve female facial features exactly, feminine face shape, no beard, no mustache, female appearance"
    : "preserve male facial features exactly, maintain original hair style and color";

  const GENDER_NEGATIVE = isFemale
    ? "male, man, beard, mustache, masculine, male features"
    : "female, woman, feminine features";

  const BASE_NEGATIVE =
    "shower, water, bathroom, nude, nsfw, anime, cartoon, illustration, bad quality, blurry, deformed, ugly, text, watermark, wrong occupation, younger, rejuvenated, beautified, idealized, smooth skin, perfect skin, different person, altered face, changed appearance";

  const NEGATIVE_PROMPT = `${BASE_NEGATIVE}, ${GENDER_NEGATIVE}`;
  const PROMPT = `${GENDER_PREFIX}${vocation.instantidPrompt}, ${GENDER_FACE_SUFFIX}`;

  // 1st: flux-pulid（顔の忠実度が最も高い）
  try {
    console.log(`[tenshoku] trying fal-ai/flux-pulid for ${vocation.id} (${gender})`);
    const result = await fal.subscribe("fal-ai/flux-pulid", {
      input: {
        reference_image_url: userImageDataUrl,
        prompt: PROMPT,
        negative_prompt: NEGATIVE_PROMPT,
        image_size: "square",
        num_inference_steps: 20,
        guidance_scale: 4.0,
        id_weight: 1.0,
        true_cfg: 1.0,
      } as Parameters<typeof fal.subscribe>[1]["input"],
    });
    const url = (result.data as { images: { url: string }[] }).images[0].url;
    console.log(`[tenshoku] flux-pulid done: ${url}`);
    return url;
  } catch (e) {
    console.warn(`[tenshoku] flux-pulid failed (${(e as Error).message}), trying instantid`);
  }

  // 2nd: InstantID
  try {
    console.log(`[tenshoku] trying fal-ai/instantid for ${vocation.id} (${gender})`);
    const result = await fal.subscribe("fal-ai/instantid", {
      input: {
        image_url: userImageDataUrl,
        prompt: PROMPT,
        negative_prompt: NEGATIVE_PROMPT,
        num_inference_steps: 20,
        guidance_scale: 3.5,
        controlnet_conditioning_scale: 0.8,
        image_size: "square",
      },
    });
    const url = (result.data as { image: { url: string } }).image.url;
    console.log(`[tenshoku] instantid done: ${url}`);
    return url;
  } catch (e) {
    console.warn(`[tenshoku] instantid failed (${(e as Error).message}), trying ip-adapter-face-id`);
  }

  // 3rd: ip-adapter-face-id
  try {
    console.log(`[tenshoku] trying fal-ai/ip-adapter-face-id for ${vocation.id} (${gender})`);
    const result = await fal.subscribe("fal-ai/ip-adapter-face-id", {
      input: {
        face_image_url: userImageDataUrl,
        prompt: `${PROMPT}, photorealistic, real person, professional photo, high quality`,
        negative_prompt: NEGATIVE_PROMPT,
        num_inference_steps: 30,
        guidance_scale: 6.0,
        face_strength: 2.5,
        controlnet_conditioning_scale: 1.2,
        image_size: "square",
      } as Parameters<typeof fal.subscribe>[1]["input"],
    });
    const url = (result.data as unknown as { image: { url: string } }).image.url;
    console.log(`[tenshoku] ip-adapter-face-id done: ${url}`);
    return url;
  } catch (e) {
    console.warn(`[tenshoku] ip-adapter-face-id failed (${(e as Error).message}), falling back to face-swap`);
  }

  // 3rd: face-swap（従来方式）
  console.log(`[tenshoku] falling back to fal-ai/face-swap for ${vocation.id}`);
  const imagePath = path.join(process.cwd(), "public", getImagePath(vocation, gender));
  const base64Image = `data:image/jpeg;base64,${fs.readFileSync(imagePath).toString("base64")}`;
  const result = await fal.subscribe("fal-ai/face-swap", {
    input: {
      base_image_url: base64Image,
      swap_image_url: userImageDataUrl,
    },
  });
  const url = (result.data as { image: { url: string } }).image.url;
  console.log(`[tenshoku] face-swap done: ${url}`);
  return url;
}

async function generateDescription(
  vocation: Vocation,
  nickname: string,
  birthdate: string
): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `占い師として、${nickname}さん（生年月日: ${birthdate}）の天職診断結果を書いてください。
天職は「${vocation.name}」です。
・200文字程度（厳守）
・理由や向いている特徴を占い師らしい語り口で
・ポジティブで背中を押す内容
・「${nickname}さん」と名前を呼びかけて始める
・文末は「あなたの天職は${vocation.name}です。」で締める
・JSON・マークダウン不要、テキストのみ`,
      },
    ],
  });

  const content = message.content[0];
  return content.type === "text" ? content.text : `あなたの天職は${vocation.name}です。`;
}
