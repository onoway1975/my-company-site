import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category");
    const prefecture = req.nextUrl.searchParams.get("prefecture");
    const municipality = req.nextUrl.searchParams.get("municipality");

    let query = supabaseAdmin
      .from("opinions")
      .select("id, nickname, municipality, content, category, reply, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (category && category !== "すべて") {
      query = query.eq("category", category);
    }

    if (municipality) {
      // 市区町村が指定されていれば完全一致（例: "神奈川県横浜市"）
      query = query.eq("municipality", municipality);
    } else if (prefecture) {
      // 都道府県のみなら前方一致（例: "神奈川県%"）
      query = query.like("municipality", `${prefecture}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Board fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch opinions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ opinions: data ?? [] });
  } catch (error) {
    console.error("Board API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
