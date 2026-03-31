import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'url param required' }, { status: 400 })
  }
  if (!url.startsWith('https://docs.google.com/spreadsheets/')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }
  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(`Upstream ${res.status}`)
    const text = await res.text()
    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 502 })
  }
}
