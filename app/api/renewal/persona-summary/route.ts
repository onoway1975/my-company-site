import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type Persona = {
  id: string;
  name: string;
  age: number;
  job: string;
};

type ChatMsg = { role: string; content: string };

async function summarizePersonaChat(
  persona: Persona,
  history: ChatMsg[]
): Promise<string[]> {
  if (!history || history.length === 0) return [];
  try {
    const convo = history
      .map((m) => `${m.role === "user" ? "質問者" : persona.name}: ${m.content}`)
      .join("\n");
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: `以下のペルソナとの会話履歴から、リニューアルに反映すべき要望・懸念を3点に要約してください。
JSON形式のみで返してください: {"summary":["要望1","要望2","要望3"]}`,
      messages: [
        {
          role: "user",
          content: `ペルソナ: ${persona.name}（${persona.age}歳・${persona.job}）\n\n会話履歴:\n${convo}`,
        },
      ],
    });
    const raw =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Array.isArray(parsed.summary) ? parsed.summary : [];
  } catch (e) {
    console.warn("[renewal/persona-summary] summarize failed", e);
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const { personas, personaChatHistory } = (await req.json()) as {
      personas?: Persona[];
      personaChatHistory?: Record<string, ChatMsg[]>;
    };

    if (!personas || personas.length === 0) {
      return NextResponse.json({ summaries: {} });
    }

    const entries = await Promise.all(
      personas.map(async (p) => {
        const history = personaChatHistory?.[p.id] || [];
        const summary = await summarizePersonaChat(p, history);
        return [p.id, summary] as const;
      })
    );

    const summaries = Object.fromEntries(entries);
    return NextResponse.json({ summaries });
  } catch (error) {
    console.error("[renewal/persona-summary]", error);
    return NextResponse.json(
      { error: "ペルソナ要約の生成に失敗しました" },
      { status: 500 }
    );
  }
}
