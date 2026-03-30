import { NextRequest, NextResponse } from 'next/server'
import { WeatherType } from '@/lib/weathermusic'

function codeToWeatherType(code: number): WeatherType {
  if (code === 0)              return 'sunny_clear'
  if (code <= 2)               return 'sunny_partly'
  if (code <= 48)              return 'cloudy'
  if (code >= 71 && code <= 77) return 'snowy'
  if (code >= 95)              return 'stormy'
  if (code >= 51 && code <= 82) return 'rainy'
  return 'cloudy'
}

function codeToDescription(code: number): string {
  if (code === 0)   return '快晴'
  if (code <= 2)    return '晴れ時々曇り'
  if (code <= 48)   return '曇り'
  if (code <= 67)   return '雨'
  if (code <= 77)   return '雪'
  if (code <= 82)   return 'にわか雨'
  return '嵐・雷雨'
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon required' }, { status: 400 })
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast`
      + `?latitude=${lat}&longitude=${lon}`
      + `&current=temperature_2m,weathercode,precipitation,windspeed_10m`
      + `&timezone=auto`

    const res  = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()
    const code = data.current.weathercode

    return NextResponse.json({
      weatherType:  codeToWeatherType(code),
      description:  codeToDescription(code),
      temp:         Math.round(data.current.temperature_2m),
      precipitation: data.current.precipitation,
      windspeed:    data.current.windspeed_10m,
      code,
    })
  } catch {
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 })
  }
}
