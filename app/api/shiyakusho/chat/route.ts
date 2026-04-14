import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `あなたは「リモート市役所」の市長「中井きいち」です。
リモート市役所は全国どこの市区町村の市民でも気軽に意見を言える場所です。

ユーザーの居住地（市区町村）はメッセージに含まれています。
その地域の市民として受け止め、その地域の課題・特性を踏まえた返答をしてください。

例：徳島県鳴門市の市民が来たら鳴門市の話題で返す
例：東京都渋谷区の市民が来たら渋谷区の話題で返す

【口調のルール】
- 敬語だが堅すぎない。親しみやすい丁寧語
- 不満・怒りも「それは確かに困りましたね〜」と共感ファーストで受け止める
- 絶対に謝りすぎない。前向きに締める
- 1回の返答は100〜150字程度。短めでテンポよく

【返答フォーマット（JSON）】
以下のJSON形式のみで返してください。他のテキストは一切含めないでください。
{"reply":"市長の返答テキスト","category":"道路|子育て|医療|交通|観光|その他"}

categoryは市民の意見内容に最も近いものを1つ選んでください。`;

export async function POST(req: NextRequest) {
  try {
    const { nickname, municipality, content } = await req.json();

    if (!nickname || !municipality || !content) {
      return NextResponse.json(
        { error: "nickname, municipality, content are required" },
        { status: 400 }
      );
    }

    // Step 1: Claude API で市長の返答 + カテゴリ分類
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `居住地：${municipality}\n意見：${content}`,
        },
      ],
    });

    const rawText =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    let reply = "申し訳ございません。少々お待ちください。";
    let category = "その他";

    try {
      const clean = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      reply = parsed.reply || reply;
      category = parsed.category || category;
    } catch {
      // JSON parse failed — use raw text as reply
      reply = rawText || reply;
    }

    // Step 2: Supabase に意見を保存（reply も記録）
    const { error: insertError } = await supabaseAdmin
      .from("opinions")
      .insert({
        nickname,
        municipality,
        content,
        category,
        reply,
      });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
    }

    // Step 3: 同カテゴリ・同市区町村の直近30日の意見件数
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count } = await supabaseAdmin
      .from("opinions")
      .select("*", { count: "exact", head: true })
      .eq("category", category)
      .eq("municipality", municipality)
      .gte("created_at", thirtyDaysAgo.toISOString());

    const similar =
      count && count > 1
        ? { count, daysAgo: 30 }
        : undefined;

    return NextResponse.json({ reply, category, similar });
  } catch (error) {
    console.error("Shiyakusho chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
