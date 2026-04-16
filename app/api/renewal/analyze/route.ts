import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* ── helpers ── */

function normalizeUrl(raw: string): string {
  let u = raw.trim();
  if (!/^https?:\/\//i.test(u)) {
    u = "https://" + u;
  }
  // URL として有効か検証（不正なら例外）
  new URL(u);
  return u;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    // URL正規化後なので通常到達しないが念のため
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

/* ── POST ── */

export async function POST(req: NextRequest) {
  try {
    const { url: rawUrl } = await req.json();

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "URLを入力してください" },
        { status: 400 }
      );
    }

    // URL正規化
    let url: string;
    try {
      url = normalizeUrl(rawUrl);
    } catch {
      return NextResponse.json(
        { error: "有効なURLを入力してください" },
        { status: 400 }
      );
    }

    // HTMLを取得
    const domain = extractDomain(url);
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
        redirect: "follow",
      });
      clearTimeout(timeout);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const text = await res.text();
      html = text.slice(0, 3000);
    } catch (e) {
      console.warn("[renewal/analyze] fetch failed:", domain, e);
      fetchFailed = true;
    }

    // Claude APIで分析
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

    let siteData;
    try {
      siteData = JSON.parse(clean);
    } catch {
      console.error("[renewal/analyze] JSON parse failed:", clean);
      return NextResponse.json(
        { error: "分析結果の解析に失敗しました。もう一度お試しください。" },
        { status: 500 }
      );
    }

    return NextResponse.json({ siteData });
  } catch (error) {
    console.error("[renewal/analyze]", error);
    return NextResponse.json(
      { error: "分析中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
