import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getClientIP, checkRateLimit } from "@/app/yume100/lib/rateLimit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = 30;

    let query = supabaseAdmin
      .from("dreams")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (cursor) {
      query = query.lt("created_at", cursor);
    }

    const { data, error } = await query;

    if (error) {
      console.error("dreams GET error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const nextCursor =
      data && data.length === limit
        ? data[data.length - 1].created_at
        : null;

    return NextResponse.json({ dreams: data, nextCursor });
  } catch (error) {
    console.error("dreams GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const limit = await checkRateLimit("yume100:post", ip, 5);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "本日の投稿上限に達しました。明日またお試しください。" },
        { status: 429 }
      );
    }

    const { content, image_url } = await req.json();

    if (
      !content ||
      typeof content !== "string" ||
      content.length > 140 ||
      !image_url ||
      typeof image_url !== "string"
    ) {
      return NextResponse.json({ error: "invalid input" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("dreams")
      .insert({ content, image_url })
      .select()
      .single();

    if (error) {
      console.error("dreams POST error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ dream: data }, { status: 201 });
  } catch (error) {
    console.error("dreams POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
