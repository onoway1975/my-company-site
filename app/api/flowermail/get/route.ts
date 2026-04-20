import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id パラメータが必要です" },
        { status: 400 }
      );
    }

    // UUID形式チェック
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "無効なIDです" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("flowermail_messages")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "花束が見つかりませんでした" },
        { status: 404 }
      );
    }

    // 有効期限チェック
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "この花束の公開期間は終了しました" },
        { status: 410 }
      );
    }

    // 初回取得時に opened_at を更新
    if (!data.opened_at) {
      await supabaseAdmin
        .from("flowermail_messages")
        .update({ opened_at: new Date().toISOString() })
        .eq("id", id);
    }

    return NextResponse.json({
      id: data.id,
      recipientName: data.recipient_name,
      senderName: data.sender_name,
      bouquetTheme: data.bouquet_theme,
      flowers: data.flowers,
      palette: data.palette,
      wrapping: data.wrapping,
      message: data.message,
      imageUrl: data.image_url,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      openedAt: data.opened_at,
    });
  } catch (error) {
    console.error("[flowermail/get]", error);
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500 }
    );
  }
}
