'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { Track, WeatherType, WEATHER_CONFIG, secToTime } from '@/lib/weathermusic'

interface Props {
  track:           Track | null
  weather:         WeatherType
  autoPlay:        boolean        // 次曲・プレイリスト選択時に自動再生するか
  onPrev:          () => void
  onNext:          () => void
  onPlayingChange: (p: boolean) => void
}

export default function Player({ track, weather, autoPlay, onPrev, onNext, onPlayingChange }: Props) {
  const cfg        = WEATHER_CONFIG[weather]
  const audioRef   = useRef<HTMLAudioElement>(null)
  const volBarRef  = useRef<HTMLDivElement>(null)
  const dragging   = useRef(false)

  const [playing,  setPlaying]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [elapsed,  setElapsed]  = useState('0:00')
  const [fav,      setFav]      = useState(false)
  const [artErr,   setArtErr]   = useState(false)
  const [volume,   setVolume]   = useState(80)

  // track変更時：リセットして必要なら自動再生
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.src = ''
    setProgress(0)
    setElapsed('0:00')
    setArtErr(false)

    if (track && autoPlay) {
      audio.src    = track.previewUrl
      audio.volume = volume / 100
      audio.play()
        .then(() => { setPlaying(true); onPlayingChange(true) })
        .catch(() => { setPlaying(false); onPlayingChange(false) })
    } else {
      setPlaying(false)
      onPlayingChange(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.id])

  // timeupdate / ended
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime   = () => {
      setProgress((audio.currentTime / 30) * 100)
      setElapsed(secToTime(audio.currentTime))
    }
    const onEnded  = () => {
      setPlaying(false)
      onPlayingChange(false)
      onNext()
    }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended',      onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended',      onEnded)
    }
  }, [onNext, onPlayingChange])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio || !track) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      onPlayingChange(false)
    } else {
      if (!audio.src || audio.src === window.location.href) {
        audio.src    = track.previewUrl
        audio.volume = volume / 100
      }
      audio.play()
        .then(() => { setPlaying(true); onPlayingChange(true) })
        .catch(() => {})
    }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio || !track) return
    const rect = e.currentTarget.getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * 30
  }

  // ── volume drag ────────────────────────────────────────────
  const applyVolume = useCallback((clientX: number) => {
    const bar = volBarRef.current
    if (!bar) return
    const rect    = bar.getBoundingClientRect()
    const clamped = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)))
    setVolume(clamped)
    if (audioRef.current) audioRef.current.volume = clamped / 100
  }, [])

  const onVolMouseDown = (e: React.MouseEvent) => {
    dragging.current = true
    applyVolume(e.clientX)
    const onMove = (ev: MouseEvent) => { if (dragging.current) applyVolume(ev.clientX) }
    const onUp   = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
  }

  const onVolTouchStart = (e: React.TouchEvent) => {
    dragging.current = true
    applyVolume(e.touches[0].clientX)
    const onMove = (ev: TouchEvent) => { if (dragging.current) applyVolume(ev.touches[0].clientX) }
    const onEnd  = () => { dragging.current = false; window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd) }
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend',  onEnd)
  }

  function toggleMute() {
    const v = volume === 0 ? 80 : 0
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v / 100
  }

  return (
    <div
      className="mx-3 mt-3 rounded-[22px] p-5 pb-[22px] transition-all duration-500 backdrop-blur-xl bg-white/10 border border-white/15"
    >
      <p className="text-white/60 text-[10px] font-semibold tracking-[.18em] uppercase mb-3.5">
        Now Playing
      </p>

      {/* art + meta */}
      <div className="flex gap-3.5 items-start">
        <div className="w-[72px] h-[72px] rounded-xl flex-shrink-0 overflow-hidden bg-white/20 relative">
          {track?.artwork && !artErr ? (
            <Image src={track.artwork} alt={track.album} fill className="object-cover" onError={() => setArtErr(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🎵</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-[18px] tracking-wide leading-tight truncate">
            {track?.name ?? '—'}
          </p>
          <p className="text-white/80 text-[13px] mt-0.5 truncate">{track?.artist ?? '—'}</p>
          <p className="text-white/50 text-[12px] uppercase tracking-widest mt-1.5">{cfg.tag}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="inline-block bg-white/15 rounded-full px-2.5 py-0.5 text-white/75 text-[10px] tracking-wide">
              ▶ 30秒プレビュー
            </span>
            {track?.appleUrl && (
              <a
                href={track.appleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 text-[10px] hover:text-white/70 transition-colors"
              >
                Apple Music ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* progress */}
      <div className="mt-4">
        <div className="h-[3px] bg-white/20 rounded-full relative cursor-pointer" onClick={seek}>
          <div className="absolute top-0 left-0 h-full bg-white rounded-full pointer-events-none" style={{ width: `${progress}%` }}>
            <span className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] bg-white rounded-full shadow-md" />
          </div>
        </div>
        <div className="flex justify-between mt-1.5 text-[11px] text-white/50">
          <span>{elapsed}</span><span>0:30</span>
        </div>
      </div>

      {/* controls */}
      <div className="flex items-center gap-2 mt-3.5">
        <button onClick={onPrev} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 transition flex items-center justify-center active:scale-90">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M3 3h1.5v10H3V3zm2.5 5L13 13V3L5.5 8z"/></svg>
        </button>
        <button onClick={togglePlay} className="w-[52px] h-[52px] rounded-full bg-white/25 hover:bg-white/35 transition flex items-center justify-center active:scale-90">
          {playing
            ? <svg width="20" height="20" viewBox="0 0 20 20" fill="white"><rect x="4" y="3" width="4" height="14" rx="1.5"/><rect x="12" y="3" width="4" height="14" rx="1.5"/></svg>
            : <svg width="20" height="20" viewBox="0 0 20 20" fill="white"><path d="M6 4l11 6-11 6V4z"/></svg>
          }
        </button>
        <button onClick={onNext} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 transition flex items-center justify-center active:scale-90">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M11.5 3H13v10h-1.5V3zm-8 0L11 8 3.5 13V3z"/></svg>
        </button>
        <button
          onClick={() => setFav(f => !f)}
          className={`w-10 h-10 rounded-full transition flex items-center justify-center active:scale-90 ml-auto ${fav ? 'bg-red-400/30' : 'bg-white/15 hover:bg-white/25'}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill={fav ? '#ff4a4a' : 'none'}>
            <path d="M8 13.5S2 9.8 2 5.8C2 4.2 3.3 3 5 3c1 0 2 .6 3 1.8C9 3.6 10 3 11 3c1.7 0 3 1.2 3 2.8 0 4-6 7.7-6 7.7z"
              stroke={fav ? '#ff4a4a' : 'white'} strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* volume */}
      <div className="flex items-center gap-2.5 mt-3.5">
        <button onClick={toggleMute} className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
          {volume === 0
            ? <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 7h3l4-4v14l-4-4H3V7z" fill="white"/><line x1="14" y1="7" x2="18" y2="13" stroke="white" strokeWidth="1.6" strokeLinecap="round"/><line x1="18" y1="7" x2="14" y2="13" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
            : volume < 50
            ? <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 7h3l4-4v14l-4-4H3V7z" fill="white"/><path d="M13 8.5a3 3 0 010 3" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
            : <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 7h3l4-4v14l-4-4H3V7z" fill="white"/><path d="M13 7a5 5 0 010 6M15.5 5a8 8 0 010 10" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
          }
        </button>
        <div
          ref={volBarRef}
          className="relative flex-1 h-[14px] flex items-center cursor-pointer select-none"
          onMouseDown={onVolMouseDown}
          onTouchStart={onVolTouchStart}
        >
          <div className="absolute inset-x-0 h-[3px] bg-white/20 rounded-full">
            <div className="absolute top-0 left-0 h-full bg-white rounded-full" style={{ width: `${volume}%` }}>
              <span className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] bg-white rounded-full shadow-md block" />
            </div>
          </div>
        </div>
        <span className="text-white/50 text-[11px] w-7 text-right flex-shrink-0">{volume}</span>
      </div>

      <audio ref={audioRef} preload="none" />
    </div>
  )
}
