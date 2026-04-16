import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const EXPERTS: Record<
  string,
  { name: string; role: string; systemPrompt: string }
> = {
  producer: {
    name: "田中 誠一",
    role: "Webプロデューサー",
    systemPrompt:
      "あなたはWebプロデューサーです。予算管理・ROI・リニューアルの方向性・ステークホルダー管理の観点から、このサイトの問題点3点とリニューアルへの提言3点をJSON形式で返してください。",
  },
  director: {
    name: "鈴木 彩",
    role: "Webディレクター",
    systemPrompt:
      "あなたはWebディレクターです。スケジュール・品質管理・コスト・運用体制の観点から、このサイトの問題点3点とリニューアルへの提言3点をJSON形式で返してください。",
  },
  planner: {
    name: "山本 健太",
    role: "プランナー/マーケター",
    systemPrompt:
      "あなたはWebプランナー/マーケターです。目的設定・SEO・ユーザー行動分析・競合分析・ペルソナの観点から、このサイトの問題点3点とリニューアルへの提言3点をJSON形式で返してください。",
  },
  designer: {
    name: "中村 あかり",
    role: "UI/UXデザイナー",
    systemPrompt:
      "あなたはUI/UXデザイナーです。ビジュアルデザイン・操作性・情報設計・アクセシビリティの観点から、このサイトの問題点3点とリニューアルへの提言3点をJSON形式で返してください。",
  },
  coder: {
    name: "佐藤 拓也",
    role: "マークアップエンジニア",
    systemPrompt:
      "あなたはマークアップエンジニアです。HTML構造・表示速度・アクセシビリティ・コーディング品質の観点から、このサイトの問題点3点とリニューアルへの提言3点をJSON形式で返してください。",
  },
  engineer: {
    name: "伊藤 大輔",
    role: "Webエンジニア",
    systemPrompt:
      "あなたはWebエンジニアです。CMS・サーバー・セキュリティ・システム構成の観点から、このサイトの問題点3点とリニューアルへの提言3点をJSON形式で返してください。",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { url, siteData, expertId } = await req.json();

    const expert = EXPERTS[expertId];
    if (!expert) {
      return NextResponse.json(
        { error: "不明な専門家IDです" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: `${expert.systemPrompt}
以下のJSON形式のみで返してください。他のテキストは一切含めないこと。
{"issues":["問題点1","問題点2","問題点3"],"recommendations":["提言1","提言2","提言3"]}`,
      messages: [
        {
          role: "user",
          content: `以下のサイト情報を分析してください。\n\nURL: ${url}\n\nサイト分析結果:\n${JSON.stringify(siteData, null, 2)}`,
        },
      ],
    });

    const rawText =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const clean = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[renewal/expert]", error);
    return NextResponse.json(
      { error: "専門家分析中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
