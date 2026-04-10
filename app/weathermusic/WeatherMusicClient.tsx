'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import WeatherHero   from '@/components/weathermusic/WeatherHero'
import Player        from '@/components/weathermusic/Player'
import Playlist      from '@/components/weathermusic/Playlist'
const SettingsSheet = dynamic(() => import('@/components/weathermusic/SettingsSheet'), { ssr: false })
const AboutSheet    = dynamic(() => import('@/components/weathermusic/AboutSheet'),    { ssr: false })
import { Track, UserSettings, DEFAULT_SETTINGS, WEATHER_CONFIG, CITIES, WeatherType } from '@/lib/weathermusic'

const STORAGE_KEY = 'weathermusic_settings'

export default function WeatherMusicClient() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return DEFAULT_SETTINGS
  })
  const [tracks,       setTracks]       = useState<Track[]>([])
  const [currentIdx,   setCurrentIdx]   = useState(0)
  const [autoPlay,     setAutoPlay]     = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [aboutOpen,    setAboutOpen]    = useState(false)
  const [temp,         setTemp]         = useState<number | null>(null)
  const [description,  setDescription]  = useState('')

  // save settings to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)) } catch {}
  }, [settings])

  // 都市が変わったら天気を自動取得
  useEffect(() => {
    const cityData = Object.values(CITIES).flat().find(c => c.label === settings.city)
    if (!cityData) return
    fetchWeather(cityData.lat, cityData.lon)
  }, [settings.city])

  async function fetchWeather(lat: number, lon: number) {
    setWeatherLoading(true)
    try {
      const res  = await fetch(`/api/weathermusic/weather?lat=${lat}&lon=${lon}`)
      const data = await res.json()
      if (data.weatherType) {
        setSettings(s => ({ ...s, weather: data.weatherType as WeatherType }))
        if (typeof data.temp === 'number') setTemp(data.temp)
        if (data.description) setDescription(data.description)
      }
    } catch {
      // 取得失敗時は現状維持
    } finally {
      setWeatherLoading(false)
    }
  }

  // fetch tracks when weather or mood changes
  useEffect(() => {
    fetchTracks(settings.weather, settings.mood)
  }, [settings.weather, settings.mood])

  async function fetchTracks(weather: string, mood: string) {
    setLoading(true)
    setTracks([])
    setCurrentIdx(0)
    try {
      const res  = await fetch(`/api/weathermusic/tracks?weather=${weather}&mood=${mood}`)
      const data = await res.json()
      setTracks(data.tracks ?? [])
    } catch {
      setTracks([])
    } finally {
      setLoading(false)
    }
  }

  const handlePrev = useCallback(() => {
    setAutoPlay(true)
    setCurrentIdx(i => (i - 1 + tracks.length) % tracks.length)
  }, [tracks.length])

  const handleNext = useCallback(() => {
    setAutoPlay(true)
    setCurrentIdx(i => (i + 1) % tracks.length)
  }, [tracks.length])

  const handleSelect = useCallback((i: number) => {
    setAutoPlay(true)
    setCurrentIdx(i)
  }, [])

  return (
    <>
      {/* About overlay */}
      <AboutSheet
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />

      {/* Settings overlay */}
      <SettingsSheet
        open={settingsOpen}
        settings={settings}
        onChange={s => setSettings(s)}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Page */}
      <div
        className="min-h-screen transition-all duration-500 relative overflow-hidden -mt-16 pt-16 wm-gradient"
        style={{ background: WEATHER_CONFIG[settings.weather].sky }}
      >
        {/* 全画面雨レイヤー */}
        {WEATHER_CONFIG[settings.weather].rain && <FullRainLayer />}

        {/* Nav — 全幅 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 max-w-lg mx-auto">
          <span className="text-[15px] tracking-[.14em] text-white drop-shadow-sm font-bold uppercase">
            WEATHER MUSIC
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAboutOpen(true)}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-wide transition-colors"
            >
              about
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 bg-white text-[#1A1814] rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-wide transition-opacity hover:opacity-90"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="6.5" cy="6.5" r="2.3" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M6.5 1v1.2M6.5 10.8V12M1 6.5h1.2M10.8 6.5H12M2.6 2.6l.85.85M9.55 9.55l.85.85M9.55 2.6l-.85.85M3.45 9.55l-.85.85"
                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              設定
            </button>
          </div>
        </div>

        {/* コンテンツ — 中央寄せ */}
        <div className="w-full max-w-lg mx-auto flex flex-col pb-10">

          {/* Weather hero */}
          <WeatherHero weather={settings.weather} city={settings.city} temp={temp} description={description} loading={weatherLoading} />

          {/* Player */}
          <Player
            track={tracks[currentIdx] ?? null}
            weather={settings.weather}
            autoPlay={autoPlay}
            onPrev={handlePrev}
            onNext={handleNext}
            onPlayingChange={p => { if (!p) setAutoPlay(false) }}
          />

          {/* Playlist */}
          <Playlist
            tracks={tracks}
            currentIdx={currentIdx}
            loading={loading}
            weather={settings.weather}
            onSelect={handleSelect}
          />

        </div>
      </div>

      {/* Rain animation keyframes */}
      <style>{`
        @keyframes wm-fall {
          0%   { transform: translateY(-40px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: .6; }
          100% { transform: translateY(105vh); opacity: 0; }
        }
      `}</style>
    </>
  )
}

function FullRainLayer() {
  const [drops, setDrops] = useState<{ left: number; dur: number; delay: number; h: number }[]>([])

  useEffect(() => {
    setDrops(Array.from({ length: 60 }, () => ({
      left:  Math.random() * 105 - 2,
      dur:   0.7 + Math.random() * 1.0,
      delay: Math.random() * 2.5,
      h:     30 + Math.random() * 60,
    })))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {drops.map((d, i) => (
        <div
          key={i}
          className="absolute w-[1.5px] rounded-sm"
          style={{
            left:       `${d.left}%`,
            height:     `${d.h}px`,
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,.35))',
            animation:  `wm-fall ${d.dur}s linear ${-d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
