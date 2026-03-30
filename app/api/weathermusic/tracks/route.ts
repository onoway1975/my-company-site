import { NextRequest, NextResponse } from 'next/server'

const WEATHER_KEYWORDS: Record<string, string[]> = {
  sunny_clear:  ['sunny day happy', 'feel good summer', 'upbeat morning'],
  sunny_partly: ['feel good chill', 'afternoon acoustic', 'breezy pop'],
  cloudy:       ['mellow indie', 'lo-fi chill', 'cloudy day'],
  rainy:        ['rainy day jazz', 'piano rain', 'melancholy ballad'],
  snowy:        ['winter snow piano', 'calm acoustic snow', 'quiet winter'],
  stormy:       ['dramatic cinematic', 'dark ambient intense', 'storm classical'],
}

const MOOD_KEYWORDS: Record<string, string> = {
  relax:       'chill ambient',
  energy:      'upbeat energetic',
  sentimental: 'emotional ballad',
  focus:       'focus instrumental',
  night:       'late night',
  clear:       'morning fresh',
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const weatherType = searchParams.get('weather') ?? 'rainy'
  const mood        = searchParams.get('mood') ?? ''

  const keywords = WEATHER_KEYWORDS[weatherType] ?? WEATHER_KEYWORDS.rainy
  const base     = keywords[Math.floor(Math.random() * keywords.length)]
  const moodKw   = mood && MOOD_KEYWORDS[mood] ? ` ${MOOD_KEYWORDS[mood]}` : ''
  const query    = `${base}${moodKw}`

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=10&country=JP`
    const res  = await fetch(url, { next: { revalidate: 86400 } }) // 24h cache
    const data = await res.json()

    const tracks = (data.results ?? [])
      .filter((t: any) => t.previewUrl)
      .slice(0, 8)
      .map((t: any) => ({
        id:         t.trackId,
        name:       t.trackName,
        artist:     t.artistName,
        album:      t.collectionName,
        artwork:    t.artworkUrl100?.replace('100x100bb', '300x300bb') ?? null,
        previewUrl: t.previewUrl,
        appleUrl:   t.trackViewUrl,
        durationMs: t.trackTimeMillis ?? 0,
      }))

    return NextResponse.json({ tracks, query })
  } catch (e) {
    return NextResponse.json({ tracks: [], query, error: 'fetch failed' }, { status: 500 })
  }
}
