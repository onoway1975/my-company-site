import { NextResponse } from 'next/server'

const QUERIES = [
  'hip hop rap',
  'trap rap',
  'boom bap rap',
  'west coast rap',
  'east coast hip hop',
  'rap freestyle',
]

export async function GET() {
  try {
    const q = QUERIES[Math.floor(Math.random() * QUERIES.length)]
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=50`
    const res = await fetch(url, { next: { revalidate: 0 } })
    const data = await res.json()

    const tracks = (data.results ?? []).filter(
      (t: { previewUrl?: string }) => t.previewUrl
    )
    if (!tracks.length) {
      return NextResponse.json({ error: 'no tracks' }, { status: 404 })
    }

    const track = tracks[Math.floor(Math.random() * tracks.length)]
    return NextResponse.json({
      previewUrl: track.previewUrl,
      trackName: track.trackName,
      artistName: track.artistName,
    })
  } catch {
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 })
  }
}
