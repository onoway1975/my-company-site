import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Apple のプレビュー音源（itunes.apple.com / mzstatic.com）だけ許可。
// オープンプロキシ化を防ぐためホストを厳格に制限する。
const ALLOWED_HOST = /(^|\.)itunes\.apple\.com$|(^|\.)mzstatic\.com$/;

// プレビューをそのまま<audio>で再生すると、Apple アセット側のCORSが不安定で
// AnalyserNode がゼロを返す（=キャラが反応しない）ことがある。そこで音源を
// 同一オリジン経由で配信し、解析を確実にする。
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const u = searchParams.get("u") || "";

  let target: URL;
  try {
    target = new URL(u);
  } catch {
    return new NextResponse("bad url", { status: 400 });
  }
  if (target.protocol !== "https:" || !ALLOWED_HOST.test(target.hostname)) {
    return new NextResponse("forbidden host", { status: 403 });
  }

  const range = req.headers.get("range");
  const upstream = await fetch(target.toString(), {
    headers: range ? { range } : {},
  });
  if (!upstream.ok && upstream.status !== 206) {
    return new NextResponse("upstream error", { status: 502 });
  }

  const headers = new Headers();
  headers.set("content-type", upstream.headers.get("content-type") || "audio/mp4");
  const cl = upstream.headers.get("content-length");
  if (cl) headers.set("content-length", cl);
  const cr = upstream.headers.get("content-range");
  if (cr) headers.set("content-range", cr);
  headers.set("accept-ranges", upstream.headers.get("accept-ranges") || "bytes");
  headers.set("cache-control", "public, max-age=86400");

  return new NextResponse(upstream.body, { status: upstream.status, headers });
}
