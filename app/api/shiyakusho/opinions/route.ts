import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category");

    let query = supabaseAdmin
      .from("opinions")
      .select("id, nickname, municipality, content, category, reply, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (category && category !== "すべて") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Opinions fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch opinions" }, { status: 500 });
    }

    return NextResponse.json({ opinions: data ?? [] });
  } catch (error) {
    console.error("Opinions API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
