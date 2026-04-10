import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

/* ── Upstash Redis REST ── */

async function redisCommand(
  ...args: string[]
): Promise<number> {
  const res = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  const data = await res.json();
  return data.result;
}

/* ── プロンプトマッピング ── */

const SUIT_MAP: Record<string, string> = {
  male_navy:
    "wearing a formal navy blue business suit, white dress shirt, dark tie, male, the suit must be clearly visible, proper business attire",
  male_black:
    "wearing a formal black business suit, white dress shirt, black tie, male, the suit must be clearly visible, proper business attire",
  female_navy:
    "wearing a formal navy blue business suit jacket, female, the suit must be clearly visible, proper business attire",
  female_black:
    "wearing a formal black business suit jacket, female, the suit must be clearly visible, proper business attire",
};

const EXPRESSION_MAP: Record<string, string> = {
  natural_smile: "gentle natural closed-mouth smile, relaxed expression",
  open_smile: "slight open smile showing teeth, warm expression",
  serious: "neutral serious expression, confident look",
};

const BACKGROUND_MAP: Record<string, string> = {
  white: "pure white background, NOT gray, NOT dark",
  gray: "plain light gray background",
  blue: "plain light blue background",
};

const ANGLE_MAP: Record<string, string> = {
  front: "facing directly forward",
  slight: "slightly angled to the left, three-quarter view",
};

const GLASSES_MAP: Record<string, string> = {
  none: "absolutely no glasses, remove any glasses",
  black: "wearing black-framed glasses",
  thin: "wearing thin metal-framed glasses",
};

/* ── IP取得 ── */

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/* ── 日付キー（JST） ── */

function getRateLimitKey(ip: string): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = jst.getUTCFullYear();
  const mm = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(jst.getUTCDate()).padStart(2, "0");
  return `resumephoto:${ip}:${yyyy}${mm}${dd}`;
}

/* ── レート制限（INCR + EXPIRE） ── */

async function checkAndIncrementLimit(ip: string): Promise<{
  ok: boolean;
  remaining: number;
}> {
  const key = getRateLimitKey(ip);
  const count = await redisCommand("INCR", key);
  // 初回のみ TTL をセット（翌日リセット）
  if (count === 1) {
    await redisCommand("EXPIRE", key, "86400");
  }
  // 101回目以降を拒否（1日100回まで）
  if (count > 100) {
    return { ok: false, remaining: 0 };
  }
  return { ok: true, remaining: 100 - count };
}

/* ── POST ── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, suit, glasses, expression, background, angle } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "画像が必要です" }, { status: 400 });
    }

    // レート制限
    const ip = getClientIP(req);
    const limit = await checkAndIncrementLimit(ip);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "LIMIT_REACHED", remaining: 0 },
        { status: 429 }
      );
    }

    // プロンプト構築
    const suitPrompt = SUIT_MAP[suit] || SUIT_MAP.male_navy;
    const expressionPrompt =
      EXPRESSION_MAP[expression] || EXPRESSION_MAP.natural_smile;
    const backgroundPrompt =
      BACKGROUND_MAP[background] || BACKGROUND_MAP.white;
    const anglePrompt = ANGLE_MAP[angle] || ANGLE_MAP.front;
    const glassesPrompt = GLASSES_MAP[glasses] || GLASSES_MAP.none;

    const prompt = `
      professional Japanese ID photo portrait,
      ${suitPrompt},
      ${expressionPrompt},
      ${backgroundPrompt},
      ${anglePrompt},
      ${glassesPrompt},
      full color photograph, color photo, vibrant colors,
      facing directly toward camera, head straight,
      soft even studio lighting from front,
      no shadows under eyes, clean skin, natural skin tone,
      CRITICAL: preserve exact same face as input,
      same face shape, same eyes nose mouth jawline,
      same hair color and style,
      do not change face structure,
      do not add glasses unless specified,
      photorealistic, sharp focus,
      no text, no watermark
    `.trim();

    // FAL.ai 呼び出し（関数内でconfig）
    fal.config({ credentials: process.env.FAL_KEY });

    console.log("[resumephoto] calling fal-ai/ip-adapter-face-id");
    const result = await fal.subscribe("fal-ai/ip-adapter-face-id", {
      input: {
        face_image_url: imageBase64,
        prompt,
        negative_prompt:
          "cartoon, anime, illustration, watermark, text, deformed, blurry, low quality, nsfw, nude, bad anatomy, extra fingers, ugly, distorted, full body, legs, waist",
        face_strength: 2.0,
        controlnet_conditioning_scale: 1.0,
        num_inference_steps: 30,
        guidance_scale: 5.0,
        image_size: "portrait_4_3",
      } as Parameters<typeof fal.subscribe>[1]["input"],
    });

    const url = (result.data as unknown as { image: { url: string } }).image
      .url;
    console.log("[resumephoto] done:", url);

    return NextResponse.json({
      imageUrl: url,
      remaining: limit.remaining,
    });
  } catch (e) {
    console.error("[resumephoto] error:", e);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
