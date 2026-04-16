import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type ChatMsg = { role: string; content: string };

const EXPERT_META: Record<string, { name: string; role: string }> = {
  producer: { name: "田中 誠一", role: "Webプロデューサー" },
  director: { name: "鈴木 彩", role: "Webディレクター" },
  planner: { name: "山本 健太", role: "プランナー/マーケター" },
  designer: { name: "中村 あかり", role: "UI/UXデザイナー" },
  coder: { name: "佐藤 拓也", role: "マークアップエンジニア" },
  engineer: { name: "伊藤 大輔", role: "Webエンジニア" },
};

export async function POST(req: NextRequest) {
  try {
    const { expertId, messages } = (await req.json()) as {
      expertId: string;
      messages: ChatMsg[];
    };

    if (!expertId || !messages || messages.length === 0) {
      return NextResponse.json({ summary: [] });
    }

    const meta = EXPERT_META[expertId] || { name: "専門家", role: "" };
    const convo = messages
      .map((m) => `${m.role === "user" ? "質問者" : meta.name}: ${m.content}`)
      .join("\n");

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: `以下の${meta.role}「${meta.name}」との会話履歴から、リニューアル施策に反映すべきポイントを3点に要約してください。
JSON形式のみで返してください: {"summary":["ポイント1","ポイント2","ポイント3"]}
他のテキストは一切含めないこと。`,
      messages: [
        {
          role: "user",
          content: `会話履歴:\n${convo}`,
        },
      ],
    });

    const raw =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const clean = raw.replace(/```json|```/g, "").trim();
    try {
      const parsed = JSON.parse(clean);
      return NextResponse.json({
        summary: Array.isArray(parsed.summary) ? parsed.summary : [],
      });
    } catch {
      return NextResponse.json({ summary: [] });
    }
  } catch (error) {
    console.error("[renewal/chat-summary]", error);
    return NextResponse.json(
      { error: "会話要約の生成に失敗しました", summary: [] },
      { status: 500 }
    );
  }
}
