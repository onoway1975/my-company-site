import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { stroke_data } = await req.json();
    const { data, error } = await supabaseAdmin
      .from("fogmail_messages")
      .insert([{ stroke_data }])
      .select("id")
      .single();
    if (error) throw error;
    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("[fogmail api]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
