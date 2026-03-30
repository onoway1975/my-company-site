'use client'

import { useEffect, useRef } from 'react'
import {
  MoodType,
  MOOD_OPTIONS, CITIES,
  UserSettings,
} from '@/lib/weathermusic'

interface Props {
  open:     boolean
  settings: UserSettings
  onChange: (s: UserSettings) => void
  onClose:  () => void
}

export default function SettingsSheet({ open, settings, onChange, onClose }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function set(patch: Partial<UserSettings>) {
    onChange({ ...settings, ...patch })
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ background: 'rgba(26,24,20,.55)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={sheetRef}
        className={`bg-[#F0EDE8] rounded-t-[28px] w-full max-w-[430px] px-5 pt-5 pb-14 max-h-[88vh] overflow-y-auto transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-8'}`}
      >
        {/* handle */}
        <div className="w-9 h-1 bg-black/15 rounded-full mx-auto mb-6" />

        <h2 className="text-[24px] font-bold tracking-wide mb-6 text-[#1A1814]">設定</h2>

        {/* 場所 */}
        <Section label="場所">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={settings.country}
              onChange={e => {
                const country = e.target.value
                const city    = CITIES[country]?.[0]?.label ?? ''
                set({ country, city })
              }}
              className="px-3.5 py-3 rounded-[14px] border border-black/10 bg-white text-sm text-[#1A1814] appearance-none outline-none focus:border-[#1A1814] cursor-pointer"
            >
              {Object.keys(CITIES).map(c => (
                <option key={c} value={c}>{
                  { JP: '🇯🇵 日本', US: '🇺🇸 アメリカ', GB: '🇬🇧 イギリス', FR: '🇫🇷 フランス', AU: '🇦🇺 オーストラリア' }[c]
                }</option>
              ))}
            </select>
            <select
              value={settings.city}
              onChange={e => set({ city: e.target.value })}
              className="px-3.5 py-3 rounded-[14px] border border-black/10 bg-white text-sm text-[#1A1814] appearance-none outline-none focus:border-[#1A1814] cursor-pointer"
            >
              {(CITIES[settings.country] ?? []).map(c => (
                <option key={c.label} value={c.label}>{c.label}</option>
              ))}
            </select>
          </div>
        </Section>

        {/* ムード */}
        <Section label="今の気分（複数選択可）">
          <div className="flex flex-wrap gap-1.5">
            {MOOD_OPTIONS.map(m => (
              <Chip
                key={m.value}
                active={settings.mood === m.value}
                onClick={() => set({ mood: settings.mood === m.value ? '' : m.value })}
              >
                <MoodChipIcon type={m.value} />
                {m.label}
              </Chip>
            ))}
          </div>
        </Section>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-[16px] bg-[#1A1814] text-[#F0EDE8] text-[15px] font-semibold mt-1 active:opacity-80 transition-opacity"
        >
          保存して閉じる ✓
        </button>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-semibold tracking-[.14em] uppercase text-[#7A7874] mb-2.5">{label}</p>
      {children}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium border transition-all duration-150 active:scale-95 ${
        active
          ? 'bg-[#1A1814] text-white border-[#1A1814]'
          : 'bg-transparent text-[#1A1814] border-black/10 hover:border-[#1A1814]'
      }`}
    >
      {children}
    </button>
  )
}

function MoodChipIcon({ type }: { type: MoodType }) {
  const s = 'w-3.5 h-3.5'
  if (type === 'relax') return (
    <svg className={s} viewBox="0 0 20 20" fill="none">
      <path d="M10 18C5.5 18 2 14.5 2 10S5.5 2 10 2s8 3.5 8 8-3.5 8-8 8z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M7 13c.8 1.2 2 1.8 3 1.8s2.2-.6 3-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="7.5" cy="9" r="1.2" fill="currentColor"/>
      <circle cx="12.5" cy="9" r="1.2" fill="currentColor"/>
    </svg>
  )
  if (type === 'energy') return (
    <svg className={s} viewBox="0 0 20 20" fill="none">
      <path d="M10 2L8 9H2l5 3.5-2 6.5 5-3.5 5 3.5-2-6.5 5-3.5H12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
  if (type === 'sentimental') return (
    <svg className={s} viewBox="0 0 20 20" fill="none">
      <path d="M10 17C6 17 2.5 13.5 2.5 10c0-2 1-3.8 2.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M10 17c4 0 7.5-3.5 7.5-7 0-2-1-3.8-2.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="10" y1="3" x2="10" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="10" cy="14.5" r="1.2" fill="currentColor"/>
    </svg>
  )
  if (type === 'focus') return (
    <svg className={s} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="10" y1="6" x2="10" y2="10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="10" y1="10.5" x2="13" y2="13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
  if (type === 'night') return (
    <svg className={s} viewBox="0 0 20 20" fill="none">
      <path d="M10 3C6 3 3 5.7 3 9c0 2 1 3.8 2.7 5l-.7 3 3-1.5c.6.2 1.3.3 2 .3 4 0 7-2.7 7-6s-3-6.8-7-6.8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
  // clear
  return (
    <svg className={s} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="4" fill="currentColor"/>
      <line x1="10" y1="1" x2="10" y2="3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="10" y1="16.5" x2="10" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="1" y1="10" x2="3.5" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="16.5" y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
