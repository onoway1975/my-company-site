import { NextRequest, NextResponse } from 'next/server';

// iTunes プレビュー音源プロキシ
// audio-ssl.itunes.apple.com は Access-Control-Allow-Origin を返さないので
// サーバー側で取得して CORS ヘッダ付きで再配信する
// これにより Web Audio API の createMediaElementSource() に通せるようになる

const ALLOWED_HOSTS = [
  'audio-ssl.itunes.apple.com',
  'a1.phobos.apple.com',
  'a1099.phobos.apple.com',
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('url');

  if (!target) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  // SSRF対策：許可ホスト以外は弾く
  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.some((h) => parsed.hostname.endsWith(h))) {
    return NextResponse.json({ error: 'host not allowed' }, { status: 403 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        // Range要求は素通し（プレビュー音源はシーク非対応だが念のため）
        ...(req.headers.get('range') ? { range: req.headers.get('range')! } : {}),
      },
    });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { error: 'upstream error', status: upstream.status },
        { status: 502 }
      );
    }

    const headers = new Headers();
    headers.set('Content-Type', upstream.headers.get('content-type') ?? 'audio/mp4');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=86400');
    const len = upstream.headers.get('content-length');
    if (len) headers.set('Content-Length', len);
    const range = upstream.headers.get('content-range');
    if (range) headers.set('Content-Range', range);
    headers.set('Accept-Ranges', 'bytes');

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (e) {
    console.error('[itunes-audio] proxy failed', e);
    return NextResponse.json({ error: 'proxy failed' }, { status: 500 });
  }
}
