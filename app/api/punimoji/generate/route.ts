import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import {
  detectScriptType,
  STYLE_PROMPTS,
  VALID_STYLE_IDS,
  type StyleId,
} from "@/lib/punimoji-prompt";

fal.config({ credentials: process.env.FAL_KEY });

export const maxDuration = 60;

const DAILY_LIMIT = 50;

/* ── Upstash Redis REST ── */

async function redisCommand(...args: string[]): Promise<number> {
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

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getRateLimitKey(ip: string): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = jst.getUTCFullYear();
  const mm = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(jst.getUTCDate()).padStart(2, "0");
  return `punimoji:ratelimit:${ip}:${yyyy}${mm}${dd}`;
}

function getJSTResetAt(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const tomorrow = new Date(
    Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate() + 1)
  );
  // JST midnight = UTC 15:00 previous day
  const resetUtc = new Date(tomorrow.getTime() - 9 * 60 * 60 * 1000);
  return resetUtc.toISOString().replace("Z", "+09:00").replace(/\.\d+/, "");
}

async function checkAndIncrementLimit(
  ip: string
): Promise<{ ok: boolean; remaining: number }> {
  const key = getRateLimitKey(ip);
  const count = await redisCommand("INCR", key);
  if (count === 1) {
    await redisCommand("EXPIRE", key, "86400");
  }
  if (count > DAILY_LIMIT) {
    return { ok: false, remaining: 0 };
  }
  return { ok: true, remaining: DAILY_LIMIT - count };
}

/* ── Validation ── */

const EMOJI_REGEX =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}]/u;

function isValidWord(word: string): boolean {
  if (!word || typeof word !== "string") return false;
  const trimmed = word.trim();
  if (trimmed.length < 1 || trimmed.length > 5) return false;
  if (EMOJI_REGEX.test(trimmed)) return false;
  return true;
}

/* ── POST ── */

export async function POST(req: NextRequest) {
  try {
    const { word, style } = await req.json();

    // Validate
    if (!isValidWord(word)) {
      return NextResponse.json(
        {
          error:
            "ひらがな・カタカナ・漢字・英数字の1〜5文字で入力してください",
        },
        { status: 400 }
      );
    }
    if (!style || !VALID_STYLE_IDS.includes(style as StyleId)) {
      return NextResponse.json(
        { error: "スタイルを選択してください" },
        { status: 400 }
      );
    }

    // Rate limit
    const ip = getClientIP(req);
    const limit = await checkAndIncrementLimit(ip);
    if (!limit.ok) {
      return NextResponse.json(
        {
          error: "今日のぷに上限に達しました。また明日！",
          resetAt: getJSTResetAt(),
        },
        { status: 429 }
      );
    }

    // Generate prompt
    const scriptType = detectScriptType(word.trim());
    const prompt = STYLE_PROMPTS[style as StyleId](word.trim(), scriptType);

    // Call fal.ai
    const result = await fal.subscribe("fal-ai/nano-banana-2", {
      input: {
        prompt,
        aspect_ratio: "1:1",
        resolution: "1K",
      },
    });

    const imageUrl = (result as { data: { images: { url: string }[] } }).data
      .images[0]?.url;

    if (!imageUrl) {
      console.error("[punimoji] no image in result:", result);
      return NextResponse.json(
        { error: "ぷに生成に失敗しました。もう一度お試しください" },
        { status: 500 }
      );
    }

    // Step B: birefnet で背景透過
    let finalUrl = imageUrl;
    try {
      const bgResult = await fal.subscribe("fal-ai/birefnet", {
        input: {
          image_url: imageUrl,
        },
      });
      const transparentUrl = (
        bgResult as { data: { image: { url: string } } }
      ).data.image?.url;
      if (transparentUrl) {
        finalUrl = transparentUrl;
      } else {
        console.warn("[punimoji] birefnet returned no image, using original");
      }
    } catch (bgErr) {
      console.warn("[punimoji] birefnet failed, using original:", bgErr);
    }

    return NextResponse.json({
      imageUrl: finalUrl,
      remainingToday: limit.remaining,
    });
  } catch (error) {
    console.error("[punimoji]", error);
    return NextResponse.json(
      { error: "ぷに生成に失敗しました。もう一度お試しください" },
      { status: 500 }
    );
  }
}
