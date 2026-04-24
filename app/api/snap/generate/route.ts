import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { buildFullPrompt } from "@/app/snap/lib/prompts";

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
  return `snap:ratelimit:${ip}:${yyyy}${mm}${dd}`;
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

/* ── POST ── */

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const templateId = formData.get("templateId") as string;

    if (!imageFile || !templateId) {
      return NextResponse.json(
        { error: "image と templateId が必要です" },
        { status: 400 }
      );
    }

    // Rate limit
    const ip = getClientIP(req);
    const limit = await checkAndIncrementLimit(ip);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "本日の生成上限に達しました。また明日お試しください。" },
        { status: 429 }
      );
    }

    // File → Data URI
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUri = `data:${imageFile.type};base64,${base64}`;

    const prompt = buildFullPrompt(templateId);

    // Call FAL.ai Kontext
    const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
      input: {
        prompt,
        image_url: dataUri,
        guidance_scale: 4.5,
        safety_tolerance: "2",
      },
      logs: false,
    });

    const imageUrl = (
      result as { data: { images: { url: string }[] } }
    ).data?.images?.[0]?.url;

    if (!imageUrl) {
      console.error("[snap] no image in result:", result);
      return NextResponse.json(
        { error: "画像生成に失敗しました。もう一度お試しください。" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageUrl,
      remainingToday: limit.remaining,
    });
  } catch (error) {
    console.error("[snap] generate error:", error);
    return NextResponse.json(
      { error: "画像生成に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
