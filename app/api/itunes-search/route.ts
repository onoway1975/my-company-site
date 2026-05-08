import { NextRequest, NextResponse } from 'next/server';

// iTunes Search API プロキシ
// ブラウザから直接叩くと CORS でエラーになるため、サーバー経由で取得する
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term');
  const limit = searchParams.get('limit') ?? '20';

  if (!term) {
    return NextResponse.json({ error: 'term is required' }, { status: 400 });
  }

  const url = `https://itunes.apple.com/search`
    + `?term=${encodeURIComponent(term)}`
    + `&entity=song`
    + `&limit=${limit}`
    + `&country=JP`;

  try {
    const res = await fetch(url, {
      // 30分間 CDN キャッシュ
      next: { revalidate: 1800 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: 'iTunes API error', status: res.status },
        { status: 502 }
      );
    }
    const data = await res.json();

    // 必要な項目だけに絞って返す（ペイロード削減）
    type ITunesResult = {
      trackId: number;
      trackName: string;
      artistName: string;
      collectionName: string;
      previewUrl: string;
      artworkUrl100: string;
      trackTimeMillis: number;
      trackViewUrl: string;
    };

    const slim = (data.results as ITunesResult[])
      .filter((r) => r.previewUrl)
      .map((r) => ({
        trackId: r.trackId,
        trackName: r.trackName,
        artistName: r.artistName,
        collectionName: r.collectionName,
        previewUrl: r.previewUrl,
        artworkUrl: r.artworkUrl100?.replace('100x100', '300x300'),
        durationMs: r.trackTimeMillis,
        trackViewUrl: r.trackViewUrl,
      }));

    return NextResponse.json({ results: slim });
  } catch (e) {
    console.error('[itunes-search] fetch failed', e);
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 });
  }
}
