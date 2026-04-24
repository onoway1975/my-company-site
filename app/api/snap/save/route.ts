import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl が必要です" },
        { status: 400 }
      );
    }

    // FAL.ai の画像URLから画像データを取得
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("画像の取得に失敗しました");
    }
    const buffer = await imageResponse.arrayBuffer();

    // UUID でファイル名を生成
    const uuid = crypto.randomUUID();
    const filePath = `tmp/${uuid}.jpg`;

    // Supabase Storage にアップロード
    const { error: uploadError } = await supabaseAdmin.storage
      .from("snap-studio")
      .upload(filePath, buffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("[snap] storage upload error:", uploadError);
      throw uploadError;
    }

    // 公開URLを取得
    const { data: urlData } = supabaseAdmin.storage
      .from("snap-studio")
      .getPublicUrl(filePath);

    return NextResponse.json({ publicUrl: urlData.publicUrl });
  } catch (error) {
    console.error("[snap] save error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "不明なエラー" },
      { status: 500 }
    );
  }
}
