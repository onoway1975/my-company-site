import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
  return `renewal:${ip}:${yyyy}${mm}${dd}`;
}

async function checkAndIncrementLimit(
  ip: string
): Promise<{ ok: boolean; remaining: number }> {
  const key = getRateLimitKey(ip);
  const count = await redisCommand("INCR", key);
  if (count === 1) {
    await redisCommand("EXPIRE", key, "86400");
  }
  if (count > 20) {
    return { ok: false, remaining: 0 };
  }
  return { ok: true, remaining: 20 - count };
}

/* ── POST ── */

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URLを入力してください" },
        { status: 400 }
      );
    }

    // レート制限
    const ip = getClientIP(req);
    let remaining = 20;
    try {
      const limit = await checkAndIncrementLimit(ip);
      remaining = limit.remaining;
      if (!limit.ok) {
        return NextResponse.json(
          {
            error: "本日の利用回数上限（20回）に達しました。明日またお試しください。",
            remaining: 0,
          },
          { status: 429 }
        );
      }
    } catch {
      // Redis接続失敗時はスキップ
    }

    // HTMLを取得
    let html = "";
    let fetchFailed = false;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; CirafBot/1.0; +https://ciraf.jp)",
        },
      });
      clearTimeout(timeout);
      const text = await res.text();
      html = text.slice(0, 3000);
    } catch {
      fetchFailed = true;
    }

    // Claude APIで分析
    const domain = new URL(url).hostname;
    const userContent = fetchFailed
      ? `以下のドメインのWebサイトを推定分析してください。HTMLは取得できませんでした。\nドメイン: ${domain}\nURL: ${url}`
      : `以下のWebサイトのHTMLを分析してください。\nURL: ${url}\n\nHTML:\n${html}`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: `あなたはWebサイト分析の専門家です。与えられた情報から以下のJSON形式で分析結果を返してください。他のテキストは一切含めないこと。
{
  "siteName": "サイト名",
  "industry": "業種",
  "description": "サービス概要（2〜3文）",
  "techStack": ["推定技術1", "推定技術2"],
  "pageStructure": "ページ構成の概要",
  "seoStatus": "SEO状況の概要",
  "speedEstimate": 45,
  "designTone": ["デザイン傾向タグ1", "デザイン傾向タグ2"]
}
speedEstimateは0〜100の数値で推定してください。`,
      messages: [{ role: "user", content: userContent }],
    });

    const rawText =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const clean = rawText.replace(/```json|```/g, "").trim();
    const siteData = JSON.parse(clean);

    return NextResponse.json({ siteData, remaining });
  } catch (error) {
    console.error("[renewal/analyze]", error);
    return NextResponse.json(
      { error: "分析中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
