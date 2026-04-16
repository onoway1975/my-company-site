import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "no id" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("fogmail_messages")
    .select("stroke_data, expires_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (new Date(data.expires_at) < new Date())
    return NextResponse.json({ error: "expired" }, { status: 410 });

  return NextResponse.json({ stroke_data: data.stroke_data });
}
