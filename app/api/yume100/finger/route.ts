import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

async function ensureProposal(dream_id: string) {
  const { data: dream } = await supabaseAdmin
    .from("dreams")
    .select("content, proposal_generated_at")
    .eq("id", dream_id)
    .single();

  if (!dream || dream.proposal_generated_at) return;

  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `以下は100人が良いなと思った未来の夢です。
この夢を1枚の宣言文として仕上げてください。
・タイトル（20文字以内）
・本文（150文字以内）：なぜこの未来が大切か、どんな社会を目指しているかを力強く書く
JSON形式のみ返す：{ "title": "...", "body": "..." }
夢のテキスト：${dream.content}`;

  const response = await claude.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const proposalText =
    response.content[0]?.type === "text" ? response.content[0].text : "";

  await supabaseAdmin
    .from("dreams")
    .update({
      proposal_text: proposalText,
      proposal_generated_at: new Date().toISOString(),
    })
    .eq("id", dream_id);
}

export async function POST(req: NextRequest) {
  try {
    const { dream_id, client_id } = await req.json();

    if (!dream_id || !client_id) {
      return NextResponse.json({ error: "invalid input" }, { status: 400 });
    }

    // 達成済みチェック
    const { data: dream } = await supabaseAdmin
      .from("dreams")
      .select("finger_count, proposal_generated_at")
      .eq("id", dream_id)
      .single();

    if (dream && dream.finger_count >= 100) {
      // proposal 未生成なら生成
      if (!dream.proposal_generated_at) {
        ensureProposal(dream_id).catch((err) =>
          console.error("proposal error:", err)
        );
      }
      return NextResponse.json(
        { error: "この夢はすでに達成されています", finger_count: dream.finger_count },
        { status: 409 }
      );
    }

    // unique 制約で重複防止
    const { error: insertError } = await supabaseAdmin
      .from("fingers")
      .insert({ dream_id, client_id });

    if (insertError) {
      if (insertError.code === "23505") {
        // 重複時でも fingers 実数で同期して返す
        const { count } = await supabaseAdmin
          .from("fingers")
          .select("*", { count: "exact", head: true })
          .eq("dream_id", dream_id);
        const synced = count ?? 0;
        await supabaseAdmin
          .from("dreams")
          .update({ finger_count: synced })
          .eq("id", dream_id);
        return NextResponse.json(
          { error: "すでに「この指止まれ」済みです", finger_count: synced },
          { status: 409 }
        );
      }
      console.error("finger insert error:", insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    // fingers テーブルの実レコード数で finger_count を同期
    const { count, error: countError } = await supabaseAdmin
      .from("fingers")
      .select("*", { count: "exact", head: true })
      .eq("dream_id", dream_id);

    if (countError) {
      console.error("finger count error:", countError);
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const newCount = count ?? 0;
    const { error: updateError } = await supabaseAdmin
      .from("dreams")
      .update({ finger_count: newCount })
      .eq("id", dream_id);

    if (updateError) {
      console.error("finger update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 100 達成で宣言書生成
    if (newCount >= 100) {
      ensureProposal(dream_id).catch((err) =>
        console.error("proposal error:", err)
      );
    }

    return NextResponse.json({ finger_count: newCount });
  } catch (error) {
    console.error("finger POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
