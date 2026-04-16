import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type Persona = {
  id: string;
  name: string;
  age: number;
  job: string;
  description: string;
  needs?: string[];
  concern?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { messages, persona, siteData } = (await req.json()) as {
      messages: { role: string; content: string }[];
      persona: Persona;
      siteData: unknown;
    };

    if (!persona || !persona.name) {
      return NextResponse.json(
        { error: "persona情報が必要です" },
        { status: 400 }
      );
    }

    const systemPrompt = `あなたは${persona.name}（${persona.age}歳・${persona.job}）です。
${persona.description}
${persona.needs ? `あなたの主なニーズ: ${persona.needs.join("、")}` : ""}
${persona.concern ? `あなたの悩み: ${persona.concern}` : ""}

以下のWebサイトのリニューアルについて、このペルソナの立場でリアルな悩み・要望・懸念を話してください。
専門用語は使わず、このペルソナらしい言葉で答えてください。
口調は自然で親しみやすく、100〜200字程度で回答してください。

参考サイト情報:
${JSON.stringify(siteData, null, 2)}`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const reply =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "申し訳ありません、回答の生成に失敗しました。";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[renewal/persona-chat]", error);
    return NextResponse.json(
      { error: "ペルソナチャット応答の生成に失敗しました" },
      { status: 500 }
    );
  }
}
