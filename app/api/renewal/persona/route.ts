import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { siteData } = await req.json();

    if (!siteData) {
      return NextResponse.json(
        { error: "siteDataが必要です" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      system: `あなたはWebサイトのターゲットペルソナ設計の専門家です。
与えられたサイト情報から、そのサイトのリニューアルを依頼する可能性のある、背景・ニーズの異なる3名のペルソナを具体的に設計してください。
以下のJSON形式のみで返してください。他のテキストは一切含めないこと。
{
  "personas": [
    {
      "id": "persona1",
      "name": "田中 誠",
      "age": 35,
      "job": "スタートアップ経営者",
      "description": "新興企業の代表。低予算で高品質なWebサイトが必要。",
      "needs": ["低コスト", "拡張性", "SEO対応"],
      "concern": "予算が限られているが競合に負けたくない"
    },
    {"id": "persona2", ...},
    {"id": "persona3", ...}
  ]
}
- idは必ず "persona1" / "persona2" / "persona3"
- name は日本人の氏名
- needs は3〜4個のキーワード配列
- description は1〜2文
- concern は1文`,
      messages: [
        {
          role: "user",
          content: `以下のサイト情報に対して、3名のペルソナを生成してください。\n\n${JSON.stringify(siteData, null, 2)}`,
        },
      ],
    });

    const rawText =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const clean = rawText.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(clean);
      return NextResponse.json(parsed);
    } catch {
      console.error("[renewal/persona] JSON parse failed:", clean);
      return NextResponse.json(
        { error: "ペルソナ情報の解析に失敗しました" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[renewal/persona]", error);
    return NextResponse.json(
      { error: "ペルソナ生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
