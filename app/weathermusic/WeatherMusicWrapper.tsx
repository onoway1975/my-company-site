'use client'

import dynamic from 'next/dynamic'

const WeatherMusicClient = dynamic(
  () => import('./WeatherMusicClient'),
  { ssr: false }
)

export default function WeatherMusicWrapper() {
  return <WeatherMusicClient />
}
