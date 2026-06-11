import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600;

type ITunesResult = {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
  trackViewUrl?: string;
  artworkUrl100?: string;
};

// ブラウザから itunes.apple.com を直接 fetch すると CORS で弾かれるため、
// サーバー側（Route Handler）でプロキシする。APIキー不要。
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const term = (searchParams.get("term") || "").trim();
  if (!term) return NextResponse.json({ results: [] });

  const api =
    "https://itunes.apple.com/search?" +
    new URLSearchParams({
      term,
      media: "music",
      entity: "song",
      limit: "15",
      country: "JP",
    }).toString();

  try {
    const r = await fetch(api, { next: { revalidate: 3600 } });
    if (!r.ok) return NextResponse.json({ results: [] }, { status: 502 });
    const data = (await r.json()) as { results?: ITunesResult[] };
    const results = (data.results || [])
      .filter((x) => x.previewUrl)
      .map((x) => ({
        id: x.trackId,
        trackName: x.trackName,
        artistName: x.artistName,
        previewUrl: x.previewUrl,
        trackViewUrl: x.trackViewUrl, // Apple Music リンク（将来アフィリエイト付与可）
        artwork: (x.artworkUrl100 || "").replace("100x100bb", "200x200bb"),
      }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] }, { status: 502 });
  }
}
