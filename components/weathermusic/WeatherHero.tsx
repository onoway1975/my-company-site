'use client'

import { WeatherType } from '@/lib/weathermusic'

interface Props {
  weather:      WeatherType
  city:         string
  temp:         number | null
  description:  string
  loading?:     boolean
}

export default function WeatherHero({ weather, city, temp, description, loading = false }: Props) {
  return (
    <div className="relative w-full overflow-hidden px-6 pt-6 pb-8">
      <div className="relative z-10 flex flex-col items-center text-center gap-1">

        {/* Weather icon */}
        <div className="w-[56px] h-[46px]">
          <WeatherIcon type={weather} />
        </div>

        {/* Weather description */}
        <p className="text-white/70 text-[11px] font-semibold tracking-[.16em] uppercase">
          {description || weather.replace('_', ' ')}
        </p>

        {/* Temperature — hero */}
        <p className="text-white text-[7rem] md:text-[9rem] font-bold leading-none tracking-tight -my-2">
          {temp !== null ? `${temp}°` : '—'}
        </p>

        {/* City + loading */}
        <div className="flex items-center gap-1.5 mt-1">
          <p className="text-white/60 text-[11px] font-semibold tracking-[.14em] uppercase">
            {city}
          </p>
          {loading && <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />}
        </div>

      </div>
    </div>
  )
}

function WeatherIcon({ type }: { type: WeatherType }) {
  const s = { width: '100%', height: '100%' }

  if (type === 'rainy') return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={s}>
      <ellipse cx="70" cy="36" rx="26" ry="21" fill="white"/>
      <ellipse cx="50" cy="44" rx="23" ry="18" fill="white"/>
      <ellipse cx="88" cy="45" rx="18" ry="14" fill="white"/>
      <line x1="44" y1="62" x2="39" y2="76" stroke="rgba(255,255,255,.75)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="57" y1="64" x2="52" y2="78" stroke="rgba(255,255,255,.75)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="70" y1="62" x2="65" y2="76" stroke="rgba(255,255,255,.65)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="82" y1="64" x2="77" y2="78" stroke="rgba(255,255,255,.5)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
  if (type === 'sunny_clear') return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={s}>
      <circle cx="60" cy="45" r="20" fill="white"/>
      <line x1="60" y1="14" x2="60" y2="6"   stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="60" y1="84" x2="60" y2="76"  stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="29" y1="45" x2="21" y2="45"  stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="99" y1="45" x2="91" y2="45"  stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="38" y1="23" x2="32" y2="17"  stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="88" y1="73" x2="82" y2="67"  stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="82" y1="23" x2="88" y2="17"  stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="32" y1="73" x2="38" y2="67"  stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
  if (type === 'sunny_partly') return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={s}>
      <circle cx="42" cy="38" r="16" fill="white"/>
      <line x1="42" y1="16" x2="42" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="42" y1="66" x2="42" y2="60" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="18" y1="38" x2="12" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="66" y1="38" x2="60" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="78" cy="52" rx="22" ry="17" fill="white"/>
      <ellipse cx="96" cy="54" rx="16" ry="13" fill="white"/>
      <ellipse cx="62" cy="57" rx="18" ry="14" fill="white"/>
    </svg>
  )
  if (type === 'cloudy') return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={s}>
      <ellipse cx="65" cy="32" rx="28" ry="21" fill="white"/>
      <ellipse cx="43" cy="45" rx="24" ry="19" fill="white"/>
      <ellipse cx="86" cy="43" rx="20" ry="16" fill="white"/>
      <ellipse cx="58" cy="54" rx="32" ry="14" fill="white"/>
    </svg>
  )
  if (type === 'snowy') return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={s}>
      <ellipse cx="65" cy="33" rx="26" ry="20" fill="white"/>
      <ellipse cx="45" cy="43" rx="22" ry="17" fill="white"/>
      <ellipse cx="84" cy="42" rx="18" ry="14" fill="white"/>
      <line x1="38" y1="64" x2="38" y2="76" stroke="rgba(255,255,255,.8)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="70" x2="44" y2="70" stroke="rgba(255,255,255,.8)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="57" y1="67" x2="57" y2="79" stroke="rgba(255,255,255,.8)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="51" y1="73" x2="63" y2="73" stroke="rgba(255,255,255,.8)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="76" y1="63" x2="76" y2="75" stroke="rgba(255,255,255,.8)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="70" y1="69" x2="82" y2="69" stroke="rgba(255,255,255,.8)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
  // stormy
  return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={s}>
      <ellipse cx="60" cy="30" rx="30" ry="21" fill="rgba(255,255,255,.55)"/>
      <ellipse cx="40" cy="42" rx="24" ry="18" fill="rgba(255,255,255,.65)"/>
      <ellipse cx="82" cy="40" rx="22" ry="17" fill="rgba(255,255,255,.55)"/>
      <path d="M62 48 L53 64 L61 64 L50 82" stroke="#FFE34D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
