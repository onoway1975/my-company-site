export type WeatherType = 'sunny_clear' | 'sunny_partly' | 'cloudy' | 'rainy' | 'snowy' | 'stormy'
export type MoodType    = 'relax' | 'energy' | 'sentimental' | 'focus' | 'night' | 'clear' | ''

export interface Track {
  id:         number
  name:       string
  artist:     string
  album:      string
  artwork:    string | null
  previewUrl: string
  appleUrl:   string
  durationMs: number
}

export interface WeatherConfig {
  sky:      string
  player:   string
  rain:     boolean
  temp:     string
  tag:      string
  plTitle:  string
  icon:     string   // SVG string
  textMode: 'light' | 'dark'
}

export interface UserSettings {
  city:    string
  country: string
  mood:    MoodType
  weather: WeatherType  // demo override
}

export const DEFAULT_SETTINGS: UserSettings = {
  city:    'SHIBUYA, TOKYO',
  country: 'JP',
  mood:    '',
  weather: 'rainy',
}

export const WEATHER_CONFIG: Record<WeatherType, WeatherConfig> = {
  rainy: {
    sky:    'linear-gradient(to bottom, #6B93B8 0%, #8BAFC8 40%, #B8CCDA 100%)',
    player: '#5A89B0', rain: true, textMode: 'light',
    temp: '16°/9°', tag: '雨の日 · RAINY MIX', plTitle: '雨の日プレイリスト',
    icon: `<svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="display:block">
      <ellipse cx="70" cy="36" rx="26" ry="21" fill="white"/>
      <ellipse cx="50" cy="44" rx="23" ry="18" fill="white"/>
      <ellipse cx="88" cy="45" rx="18" ry="14" fill="white"/>
      <line x1="44" y1="62" x2="39" y2="76" stroke="rgba(255,255,255,.7)" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="57" y1="64" x2="52" y2="78" stroke="rgba(255,255,255,.7)" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="70" y1="62" x2="65" y2="76" stroke="rgba(255,255,255,.65)" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="82" y1="64" x2="77" y2="78" stroke="rgba(255,255,255,.5)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },
  sunny_clear: {
    sky:    'linear-gradient(to bottom, #87CEEB 0%, #FDB97D 60%, #F97040 100%)',
    player: '#E07840', rain: false, textMode: 'light',
    temp: '25°/14°', tag: '晴れ · SUNNY MIX', plTitle: '晴れの日プレイリスト',
    icon: `<svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="display:block">
      <circle cx="60" cy="45" r="20" fill="white"/>
      <line x1="60" y1="14" x2="60" y2="6" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <line x1="60" y1="84" x2="60" y2="76" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <line x1="29" y1="45" x2="21" y2="45" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <line x1="99" y1="45" x2="91" y2="45" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <line x1="38" y1="23" x2="32" y2="17" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <line x1="88" y1="73" x2="82" y2="67" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <line x1="82" y1="23" x2="88" y2="17" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <line x1="32" y1="73" x2="38" y2="67" stroke="white" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  sunny_partly: {
    sky:    'linear-gradient(to bottom, #A8C8E8 0%, #F5D9A0 55%, #F0BC70 100%)',
    player: '#D4A828', rain: false, textMode: 'light',
    temp: '22°/13°', tag: '晴れ時々曇り · PARTLY MIX', plTitle: '穏やかな午後のプレイリスト',
    icon: `<svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="display:block">
      <circle cx="42" cy="38" r="16" fill="white"/>
      <line x1="42" y1="16" x2="42" y2="10" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="42" y1="66" x2="42" y2="60" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="18" y1="38" x2="12" y2="38" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="66" y1="38" x2="60" y2="38" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="78" cy="52" rx="22" ry="17" fill="white"/>
      <ellipse cx="96" cy="54" rx="16" ry="13" fill="white"/>
      <ellipse cx="62" cy="57" rx="18" ry="14" fill="white"/>
    </svg>`,
  },
  cloudy: {
    sky:    'linear-gradient(to bottom, #8E9EAE 0%, #B8C4CC 50%, #D4D8DC 100%)',
    player: '#7A8E9C', rain: false, textMode: 'dark',
    temp: '18°/12°', tag: '曇り · CLOUDY MIX', plTitle: '曇り空のプレイリスト',
    icon: `<svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="display:block">
      <ellipse cx="65" cy="32" rx="28" ry="21" fill="white"/>
      <ellipse cx="43" cy="45" rx="24" ry="19" fill="white"/>
      <ellipse cx="86" cy="43" rx="20" ry="16" fill="white"/>
      <ellipse cx="58" cy="54" rx="32" ry="14" fill="white"/>
    </svg>`,
  },
  snowy: {
    sky:    'linear-gradient(to bottom, #C8DCF0 0%, #E0EAF4 50%, #F0F4F8 100%)',
    player: '#7AAAC8', rain: false, textMode: 'dark',
    temp: '2°/-4°', tag: '雪 · SNOW MIX', plTitle: '雪の日プレイリスト',
    icon: `<svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="display:block">
      <ellipse cx="65" cy="33" rx="26" ry="20" fill="white"/>
      <ellipse cx="45" cy="43" rx="22" ry="17" fill="white"/>
      <ellipse cx="84" cy="42" rx="18" ry="14" fill="white"/>
      <line x1="38" y1="64" x2="38" y2="76" stroke="rgba(255,255,255,.8)" stroke-width="2" stroke-linecap="round"/>
      <line x1="32" y1="70" x2="44" y2="70" stroke="rgba(255,255,255,.8)" stroke-width="2" stroke-linecap="round"/>
      <line x1="57" y1="67" x2="57" y2="79" stroke="rgba(255,255,255,.8)" stroke-width="2" stroke-linecap="round"/>
      <line x1="51" y1="73" x2="63" y2="73" stroke="rgba(255,255,255,.8)" stroke-width="2" stroke-linecap="round"/>
      <line x1="76" y1="63" x2="76" y2="75" stroke="rgba(255,255,255,.8)" stroke-width="2" stroke-linecap="round"/>
      <line x1="70" y1="69" x2="82" y2="69" stroke="rgba(255,255,255,.8)" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  stormy: {
    sky:    'linear-gradient(to bottom, #1A1830 0%, #2E2C52 45%, #4A3860 100%)',
    player: '#2A2645', rain: true, textMode: 'light',
    temp: '12°/6°', tag: '嵐 · STORM MIX', plTitle: '嵐の夜プレイリスト',
    icon: `<svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="display:block">
      <ellipse cx="60" cy="30" rx="30" ry="21" fill="rgba(255,255,255,.5)"/>
      <ellipse cx="40" cy="42" rx="24" ry="18" fill="rgba(255,255,255,.6)"/>
      <ellipse cx="82" cy="40" rx="22" ry="17" fill="rgba(255,255,255,.5)"/>
      <path d="M62 48 L53 64 L61 64 L50 82" stroke="#FFE34D" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
}

export const MOOD_OPTIONS: { value: MoodType; label: string }[] = [
  { value: 'relax',       label: 'リラックス'     },
  { value: 'sentimental', label: 'センチメンタル'  },
  { value: 'energy',      label: 'エネルギッシュ'  },
  { value: 'focus',       label: '集中'           },
  { value: 'night',       label: '夜っぽい'        },
  { value: 'clear',       label: 'スッキリ'        },
]

export const CITIES: Record<string, { label: string; lat: number; lon: number }[]> = {
  JP: [
    { label: 'SHIBUYA, TOKYO', lat: 35.6580, lon: 139.7016 },
    { label: 'OSAKA',          lat: 34.6937, lon: 135.5022 },
    { label: 'KYOTO',          lat: 35.0116, lon: 135.7681 },
    { label: 'FUKUOKA',        lat: 33.5904, lon: 130.4017 },
    { label: 'SAPPORO',        lat: 43.0618, lon: 141.3545 },
  ],
  US: [
    { label: 'NEW YORK',       lat: 40.7128, lon: -74.0060 },
    { label: 'LOS ANGELES',    lat: 34.0522, lon: -118.2437 },
    { label: 'CHICAGO',        lat: 41.8781, lon: -87.6298 },
  ],
  GB: [
    { label: 'LONDON',         lat: 51.5074, lon: -0.1278 },
    { label: 'MANCHESTER',     lat: 53.4808, lon: -2.2426 },
  ],
  FR: [
    { label: 'PARIS',          lat: 48.8566, lon: 2.3522 },
    { label: 'LYON',           lat: 45.7640, lon: 4.8357 },
  ],
  AU: [
    { label: 'SYDNEY',         lat: -33.8688, lon: 151.2093 },
    { label: 'MELBOURNE',      lat: -37.8136, lon: 144.9631 },
  ],
}

export function msToTime(ms: number): string {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function secToTime(s: number): string {
  s = Math.floor(s)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
