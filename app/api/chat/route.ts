import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const COMPANY_INFO = `会社名：シラフ株式会社 / ciraf inc.
タグライン：私たちは、誰よりも、つくりたい人の味方。
所在地：東京都渋谷区神宮前3-25-18 205 THE SHARE
サービス：企画・設計・制作・運用の4フェーズでデジタルクリエイティブを支援
実績：CSS Design Awards、Awwwards、FWA等受賞多数
お問い合わせ：https://ciraf.jp/contact/
代表：尾上裕典`;

const SYSTEM_PROMPT = `あなたはシラフ株式会社（ciraf inc.）の案内AIです。
以下の情報をもとに、日本語で丁寧・簡潔に答えてください。

${COMPANY_INFO}

回答は簡潔に、3〜5文程度にまとめてください。
相談・お問い合わせの案内をする場合は、お問い合わせフォーム（https://ciraf.jp/contact/）のみ案内してください。電話番号は記載しないでください。
実績・制作事例を見たいと言われた場合はWorksページ（https://ciraf.jp/works/）を案内してください。`;

const SYSTEM_PROMPT_SHORT = `あなたはシラフ株式会社（ciraf inc.）の案内AIです。
以下の情報をもとに、日本語で丁寧・簡潔に答えてください。

${COMPANY_INFO}

必ず2〜3文以内の非常に短い返答にしてください。電話番号は記載しないでください。
相談・問い合わせに誘導する場合はお問い合わせフォームのURL（https://ciraf.jp/contact/）を記載してください。
実績・制作事例を見たいと言われた場合はWorksページ（https://ciraf.jp/works/）を案内してください。`;

export async function POST(req: NextRequest) {
  try {
    const { messages, short } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages is required" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: short ? 150 : 512,
      system: short ? SYSTEM_PROMPT_SHORT : SYSTEM_PROMPT,
      messages,
    });

    const text =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
