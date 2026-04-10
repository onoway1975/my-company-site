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
    "wearing a standard navy blue job-hunting suit, white shirt, navy tie, Japanese male",
  male_black:
    "wearing a standard black job-hunting suit, white shirt, black tie, Japanese male",
  female_navy:
    "wearing a standard navy blue job-hunting suit jacket, white blouse, Japanese female",
  female_black:
    "wearing a standard black job-hunting suit jacket, white blouse, Japanese female",
};

const EXPRESSION_MAP: Record<string, string> = {
  natural_smile: "gentle natural closed-mouth smile, relaxed soft expression",
  open_smile:
    "big open smile showing teeth, happy warm expression, smiling",
  serious: "neutral serious expression, no smile, professional look",
};

const BACKGROUND_MAP: Record<string, string> = {
  gray: "plain very light gray background #E8E8E8, almost white, very pale gray, soft light background",
};

const ANGLE_MAP: Record<string, string> = {
  front: "facing DIRECTLY forward, head perfectly straight, eyes looking straight into camera, NO head tilt, NO head rotation, NO angled pose, perfectly symmetrical front-facing portrait",
};

const GLASSES_MAP: Record<string, string> = {
  keep: "MUST preserve exact same glasses from input photo, if person wears glasses in input keep identical glasses, do not remove glasses, do not change glasses style",
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
      BACKGROUND_MAP[background] || BACKGROUND_MAP.gray;
    const anglePrompt = ANGLE_MAP[angle] || ANGLE_MAP.front;
    const glassesPrompt = GLASSES_MAP[glasses] || GLASSES_MAP.keep;

    // スーツIDから性別を取得
    const gender = suit.startsWith("female")
      ? "Japanese female"
      : "Japanese male";

    const prompt = `
      vibrant full color photograph, color image, color photo, NOT black and white, NOT monochrome, NOT grayscale, NOT sepia,
      ${backgroundPrompt},
      ${gender}, professional ID photo portrait,
      ${suitPrompt},
      ${expressionPrompt},
      ${anglePrompt},
      ${glassesPrompt},
      close-up headshot, face large in frame,
      soft even front studio lighting,
      CRITICAL: preserve exact same face from input,
      same face shape, same eyes nose mouth, same skin tone,
      same hair color and style,
      photorealistic, sharp focus,
      no text, no watermark
    `.trim();

    // FAL.ai 呼び出し（関数内でconfig）
    fal.config({ credentials: process.env.FAL_KEY });

    console.log("[resumephoto] received:", { suit, expression, glasses });
    console.log("[resumephoto] calling fal-ai/ip-adapter-face-id");
    const result = await fal.subscribe("fal-ai/ip-adapter-face-id", {
      input: {
        face_image_url: imageBase64,
        prompt,
        negative_prompt:
          "black and white, monochrome, grayscale, sepia, desaturated, colorless, cartoon, anime, illustration, watermark, text, deformed, blurry, low quality, nsfw, nude, bad anatomy, extra fingers, ugly, distorted, full body, legs, waist",
        face_strength: 1.8,
        controlnet_conditioning_scale: 1.0,
        num_inference_steps: 30,
        guidance_scale: 5.5,
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
