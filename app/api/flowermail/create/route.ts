import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fal } from "@fal-ai/client";
import { supabaseAdmin } from "@/lib/supabase";
import { translateColorToEn } from "@/lib/flowerDict";

export const maxDuration = 60;

const DAILY_LIMIT = 20;

/* ── Upstash Redis REST ── */

async function redisCommand(...args: string[]): Promise<number> {
  const res = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  const data = await res.json();
  return data.result;
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getRateLimitKey(ip: string): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = jst.getUTCFullYear();
  const mm = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(jst.getUTCDate()).padStart(2, "0");
  return `flowermail:${ip}:${yyyy}${mm}${dd}`;
}

async function checkAndIncrementLimit(
  ip: string
): Promise<{ ok: boolean; remaining: number }> {
  const key = getRateLimitKey(ip);
  const count = await redisCommand("INCR", key);
  if (count === 1) {
    await redisCommand("EXPIRE", key, "86400");
  }
  if (count > DAILY_LIMIT) {
    return { ok: false, remaining: 0 };
  }
  return { ok: true, remaining: DAILY_LIMIT - count };
}

/* ── Validation ── */

function isValidInput(body: {
  recipientName?: string;
  description?: string;
  senderName?: string;
}): string | null {
  if (
    !body.recipientName ||
    typeof body.recipientName !== "string" ||
    body.recipientName.trim().length === 0 ||
    body.recipientName.trim().length > 30
  ) {
    return "相手の名前は1〜30字で入力してください";
  }
  if (
    !body.description ||
    typeof body.description !== "string" ||
    body.description.trim().length === 0 ||
    body.description.trim().length > 200
  ) {
    return "相手の特徴は1〜200字で入力してください";
  }
  if (
    body.senderName &&
    typeof body.senderName === "string" &&
    body.senderName.trim().length > 20
  ) {
    return "贈り主の名前は20字以内で入力してください";
  }
  return null;
}

/* ── Claude Prompt ── */

function buildClaudePrompt(
  recipientName: string,
  description: string,
  senderName: string
): string {
  return `あなたは花屋のフローリストで、同時に手紙を書くライターです。
大切な人のためのブーケを束ね、添える手紙を書いてください。

【相手の名前】${recipientName}
【相手の特徴・感謝していること】${description}
【贈り主の名前】${senderName || "匿名"}

相手の雰囲気から、最適な花・色合い・包装・ムードを選びます。
パステルに寄せすぎず、その人らしい色を大胆に選んでかまいません。
例：情熱的な人 → 深紅のピオニーとワインレッドのラナンキュラス、黒いサテンリボン
    穏やかな人 → 白いアネモネとラベンダー、麻紐で素朴に
    明るい人 → オレンジのポピーと黄色のガーベラ、クラフト紙
    耽美な人 → ダークな赤のダリアとチョコレートコスモス、黒いリボン

以下のJSON形式だけを返してください。他のテキストは一切含めないでください。

{
  "bouquet_theme": "ブーケのテーマを15字以内（例: 穏やかな午後の感謝のブーケ）",
  "flowers": [
    {
      "name_ja": "花の日本語名",
      "name_en": "English name",
      "meaning": "花言葉",
      "color": "色の形容"
    }
  ],
  "palette": {
    "primary": "メインカラー名",
    "secondary": "サブカラー",
    "accent": "アクセント",
    "mood": "ムード（例: 穏やかで温かい / 静かで情熱的）"
  },
  "wrapping": {
    "paper": "包装紙の種類（例: クリームのリネン紙 / クラフト紙 / 白いワックスペーパー）",
    "tie": "結び方（例: 麻紐 / 黒いサテンリボン / 白い紐）",
    "description_en": "English description (例: cream-colored linen paper tied with natural jute twine)"
  },
  "message": "150〜200字の手紙。決まり文句を避け、相手の特徴を踏まえた具体的な言葉で。〜です・ます調。"
}

注意：
- 花は3〜5種類に絞る（盛りすぎない）
- 主役の花 + 脇役の花 + グリーン(ユーカリ等) の組み合わせを意識
- 相手の雰囲気が穏やかなら穏やかな色、濃い印象なら濃い色を選んで引き算しない`;
}

/* ── fal.ai Prompt ── */

type ClaudeResult = {
  bouquet_theme: string;
  flowers: { name_ja: string; name_en: string; meaning: string; color: string }[];
  palette: { primary: string; secondary: string; accent: string; mood: string };
  wrapping: { paper: string; tie: string; description_en: string };
  message: string;
};

function buildFalPrompt(result: ClaudeResult): string {
  const flowerList = result.flowers
    .map((f) => `${f.color.replace(/色$/, "")} ${f.name_en}`)
    .join(", ");

  const wrapping = result.wrapping.description_en;
  const primaryTone = translateColorToEn(result.palette.primary);

  return `A hand-tied bouquet of ${flowerList}, wrapped in ${wrapping}, laid at a slight angle on an aged light wooden table, a few fallen petals nearby, a soft linen cloth partially visible, warm afternoon window light from the left, gentle shadows, editorial lifestyle photography, fine art quality, film grain, muted ${primaryTone} tones, slight imperfection, candid and intimate mood, photorealistic, 8k, centered composition with natural asymmetry, no text, no watermark, no signature, no hands visible, no people.`;
}

/* ── JSON Parser ── */

function parseClaudeJSON(rawText: string): ClaudeResult {
  const clean = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(clean);
  } catch {
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Claude response is not valid JSON");
  }
}

/* ── POST ── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate
    const validationError = isValidInput(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const recipientName = body.recipientName.trim();
    const description = body.description.trim();
    const senderName = body.senderName?.trim() || "";

    // Rate limit
    const ip = getClientIP(req);
    const limit = await checkAndIncrementLimit(ip);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "本日の花束作成は上限に達しました。また明日お越しください。" },
        { status: 429 }
      );
    }

    // Step 1: Claude API — ブーケ情報・メッセージ生成
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const claudeResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: buildClaudePrompt(recipientName, description, senderName),
        },
      ],
    });

    const rawText =
      claudeResponse.content[0]?.type === "text"
        ? claudeResponse.content[0].text
        : "";

    if (!rawText) {
      console.error("[flowermail] empty Claude response");
      return NextResponse.json(
        { error: "ブーケの構成に失敗しました。もう一度お試しください。" },
        { status: 500 }
      );
    }

    const bouquetData = parseClaudeJSON(rawText);

    // Step 2: fal.ai — 画像生成
    fal.config({ credentials: process.env.FAL_KEY });

    const falPrompt = buildFalPrompt(bouquetData);
    const falResult = await fal.subscribe("fal-ai/nano-banana-2", {
      input: {
        prompt: falPrompt,
        aspect_ratio: "3:4",
        resolution: "1K",
      },
    });

    const generatedImageUrl = (
      falResult as { data: { images: { url: string }[] } }
    ).data.images[0]?.url;

    if (!generatedImageUrl) {
      console.error("[flowermail] no image in fal result:", falResult);
      return NextResponse.json(
        { error: "ブーケ画像の生成に失敗しました。もう一度お試しください。" },
        { status: 500 }
      );
    }

    // Step 3: 画像を Supabase Storage にアップロード
    const imageResponse = await fetch(generatedImageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const fileId = crypto.randomUUID();
    const filePath = `${fileId}.jpg`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("bouquets")
      .upload(filePath, imageBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("[flowermail] storage upload error:", uploadError);
      return NextResponse.json(
        { error: "画像の保存に失敗しました。もう一度お試しください。" },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("bouquets")
      .getPublicUrl(filePath);
    const storedImageUrl = publicUrlData.publicUrl;

    // Step 4: DB に INSERT
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from("flowermail_messages")
      .insert({
        recipient_name: recipientName,
        sender_name: senderName || null,
        description,
        bouquet_theme: bouquetData.bouquet_theme,
        flowers: bouquetData.flowers,
        palette: bouquetData.palette,
        wrapping: bouquetData.wrapping,
        message: bouquetData.message,
        image_url: storedImageUrl,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("[flowermail] insert error:", insertError);
      return NextResponse.json(
        { error: "データの保存に失敗しました。もう一度お試しください。" },
        { status: 500 }
      );
    }

    const id = insertData.id;

    return NextResponse.json({
      id,
      url: `https://ciraf.jp/flowermail/${id}`,
      imageUrl: storedImageUrl,
      bouquetTheme: bouquetData.bouquet_theme,
      flowers: bouquetData.flowers,
      palette: bouquetData.palette,
      wrapping: bouquetData.wrapping,
      message: bouquetData.message,
      remainingToday: limit.remaining,
    });
  } catch (error) {
    console.error("[flowermail]", error);
    return NextResponse.json(
      { error: "花束の作成に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
