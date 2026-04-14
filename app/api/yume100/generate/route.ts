import Anthropic from "@anthropic-ai/sdk";
import { fal } from "@/app/lib/falClient";
import { NextRequest, NextResponse } from "next/server";
import { getClientIP, checkRateLimit } from "@/app/yume100/lib/rateLimit";

export const maxDuration = 60;

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const limit = await checkRateLimit("yume100:gen", ip, 20);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "本日の画像生成上限に達しました。明日またお試しください。" },
        { status: 429 }
      );
    }

    const { content } = await req.json();
    if (!content || typeof content !== "string" || content.length > 140) {
      return NextResponse.json({ error: "invalid content" }, { status: 400 });
    }

    // Claude Haiku: 日本語 → 英語画像プロンプト変換
    const promptResponse = await claude.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `以下の「こんな未来があったらいいな」という夢のテキストを、画像生成AI用の英語プロンプトに変換してください。
明るく希望に満ちた、美しいイラスト風の画像を生成するためのプロンプトです。
プロンプトのみを出力し、説明は不要です。

夢のテキスト: ${content}`,
        },
      ],
    });

    const imagePrompt =
      promptResponse.content[0]?.type === "text"
        ? promptResponse.content[0].text
        : content;

    // fal.ai で画像生成
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: imagePrompt,
        image_size: "landscape_4_3",
      },
    });

    const imageUrl = (result as { data: { images: { url: string }[] } }).data
      .images[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "画像生成に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ image_url: imageUrl });
  } catch (error) {
    console.error("yume100 generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
