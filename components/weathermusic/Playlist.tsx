'use client'

import Image from 'next/image'
import { Track, WeatherType, WEATHER_CONFIG, msToTime } from '@/lib/weathermusic'

interface Props {
  tracks:     Track[]
  currentIdx: number
  loading:    boolean
  weather:    WeatherType
  onSelect:   (i: number) => void
}

export default function Playlist({ tracks, currentIdx, loading, weather, onSelect }: Props) {
  const cfg = WEATHER_CONFIG[weather]

  return (
    <div
      className="mx-3 mt-3 rounded-[22px] px-4 pt-5 pb-3"
      style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)' }}
    >
      {/* header */}
      <div className="mb-4">
        <p className="font-semibold text-[16px] text-white">{cfg.plTitle}</p>
        <p className="text-[12px] text-white/60 mt-0.5">
          {loading ? '読み込み中...' : `天気に合わせて自動生成 · ${tracks.length}曲`}
        </p>
      </div>

      {/* track list */}
      {loading ? (
        <LoadingRows />
      ) : tracks.length === 0 ? (
        <p className="text-center text-sm text-white/50 py-6">取得できませんでした</p>
      ) : (
        <div className="flex flex-col gap-0.5 pb-1">
          {tracks.map((t, i) => (
            <TrackRow
              key={t.id}
              track={t}
              index={i}
              active={i === currentIdx}
              onSelect={() => onSelect(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TrackRow({ track, index, active, onSelect }: {
  track: Track; index: number; active: boolean; onSelect: () => void
}) {
  return (
    <div
      className={`flex items-center gap-3 px-2.5 py-2.5 rounded-[14px] transition-colors ${
        active ? 'bg-white/25' : 'hover:bg-white/15'
      }`}
    >
      {/* num / play indicator */}
      <div className="w-5 text-center flex-shrink-0 cursor-pointer" onClick={onSelect}>
        {active
          ? <svg width="10" height="12" viewBox="0 0 10 12" fill="white"><path d="M1 1l8 5-8 5V1z"/></svg>
          : <span className="text-xs text-white/50">{index + 1}</span>
        }
      </div>

      {/* artwork */}
      <div className="w-11 h-11 rounded-[10px] flex-shrink-0 overflow-hidden bg-white/20 relative cursor-pointer" onClick={onSelect}>
        {track.artwork ? (
          <Image src={track.artwork} alt={track.album} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg">🎵</div>
        )}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onSelect}>
        <p className="text-sm font-medium truncate text-white">
          {track.name}
        </p>
        <p className="text-xs mt-0.5 truncate text-white/60">
          {track.artist}
        </p>
      </div>

      {/* 時間 + Apple Music */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="text-xs text-white/50">
          {msToTime(track.durationMs)}
        </span>
        {track.appleUrl && (
          <a
            href={track.appleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/30 text-white/75 transition-opacity hover:opacity-80 hover:border-white/60"
          >
            <svg width="9" height="10" viewBox="0 0 9 10" fill="currentColor">
              <path d="M8.5 1.2 3.2 2.5v5.3c-.3-.1-.6-.2-1-.2C1.2 7.6.5 8.2.5 8.9s.7 1.1 1.7 1.1S4 9.4 4 8.7V3.9l4-1v3.7c-.3-.1-.6-.2-1-.2-.9 0-1.7.6-1.7 1.3s.7 1.1 1.7 1.1S8.5 8.2 8.5 7.5V1.2z"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide whitespace-nowrap">Apple Music</span>
          </a>
        )}
      </div>
    </div>
  )
}

function LoadingRows() {
  return (
    <div className="flex flex-col gap-2 pb-4 pt-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-2.5 py-2 animate-pulse">
          <div className="w-5 h-3 bg-white/20 rounded" />
          <div className="w-11 h-11 bg-white/20 rounded-[10px]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-white/20 rounded w-3/4" />
            <div className="h-2.5 bg-white/15 rounded w-1/2" />
          </div>
          <div className="w-8 h-2.5 bg-white/20 rounded" />
        </div>
      ))}
    </div>
  )
}
