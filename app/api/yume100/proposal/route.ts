import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const PROPOSAL_PROMPT = (content: string) =>
  `以下は100人が良いなと思った未来の夢です。
この夢を1枚の宣言文として仕上げてください。
・タイトル（20文字以内）
・本文（150文字以内）：なぜこの未来が大切か、どんな社会を目指しているかを力強く書く
JSON形式のみ返す：{ "title": "...", "body": "..." }
夢のテキスト：${content}`;

export { PROPOSAL_PROMPT };

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { dream_id } = await req.json();
    if (!dream_id) {
      return NextResponse.json({ error: "invalid input" }, { status: 400 });
    }

    const { data: dream, error: fetchError } = await supabaseAdmin
      .from("dreams")
      .select("*")
      .eq("id", dream_id)
      .single();

    if (fetchError || !dream) {
      return NextResponse.json({ error: "dream not found" }, { status: 404 });
    }

    if (dream.finger_count < 100) {
      return NextResponse.json(
        { error: "まだ100人に達していません" },
        { status: 400 }
      );
    }

    if (dream.proposal_generated_at) {
      return NextResponse.json({ proposal_text: dream.proposal_text });
    }

    const response = await claude.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [
        { role: "user", content: PROPOSAL_PROMPT(dream.content) },
      ],
    });

    const proposalText =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    const { error: updateError } = await supabaseAdmin
      .from("dreams")
      .update({
        proposal_text: proposalText,
        proposal_generated_at: new Date().toISOString(),
      })
      .eq("id", dream_id);

    if (updateError) {
      console.error("proposal update error:", updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ proposal_text: proposalText });
  } catch (error) {
    console.error("proposal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
