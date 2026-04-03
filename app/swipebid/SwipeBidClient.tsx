'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────
type Genre = 'web' | 'video' | 'writing' | 'design' | 'sns' | 'other'
type Tab   = 'swipe' | 'saved' | 'settings'

interface BidItem {
  id:       string
  title:    string
  org:      string
  pref:     string
  deadline: string
  daysLeft: number
  budget:   string
  type:     string
  genre:    Genre
  url:      string
}

interface Settings {
  keywords:  string[]
  genres:    Genre[]
  minBudget: string
  pref:      string
}

// ── Constants ──────────────────────────────────────────────────────
const GENRE_STYLES: Record<Genre, { bg: string; label: string }> = {
  web:     { bg: 'linear-gradient(130deg,#1E3A8A,#2563EB,#38BDF8)', label: '🌐 Web制作' },
  video:   { bg: 'linear-gradient(130deg,#1A1A2E,#7C3AED,#F472B6)', label: '🎬 動画制作' },
  writing: { bg: 'linear-gradient(130deg,#064E3B,#059669,#6EE7B7)', label: '✏️ ライティング' },
  design:  { bg: 'linear-gradient(130deg,#7C2D12,#EA580C,#FCD34D)', label: '🎨 デザイン' },
  sns:     { bg: 'linear-gradient(130deg,#831843,#DB2777,#F9A8D4)', label: '📱 SNS・広告' },
  other:   { bg: 'linear-gradient(130deg,#1E293B,#475569,#94A3B8)', label: '📋 その他' },
}

const GENRE_LABELS: Record<Genre, string> = {
  web:     'Web・システム制作',
  video:   '動画・映像制作',
  writing: 'ライティング・広報',
  design:  'デザイン・印刷物',
  sns:     'SNS・広告運用',
  other:   'その他',
}

const BUDGET_OPTIONS = [
  { label: '指定なし', value: '' },
  { label: '50万円〜',  value: '500000' },
  { label: '100万円〜', value: '1000000' },
  { label: '300万円〜', value: '3000000' },
]

const PREFS = [
  '全国', '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
]

const DEFAULT_SETTINGS: Settings = {
  keywords:  ['ホームページ', 'Web', '動画', 'デザイン', 'SNS', 'パンフレット', '広報'],
  genres:    ['web', 'video', 'writing', 'design', 'sns', 'other'],
  minBudget: '',
  pref:      '',
}

const LS_SETTINGS = 'swipebid_settings'
const LS_SAVED    = 'swipebid_saved'

// ── Helpers ────────────────────────────────────────────────────────
function fmtDeadline(d: string) {
  return d ? d.replace(/-/g, '/') : '—'
}

function fmtBudget(b: string) {
  const n = parseInt(b.replace(/[^0-9]/g, ''))
  if (isNaN(n) || n === 0) return ''
  if (n >= 100000000) return `${(n / 100000000).toFixed(0)}億円`
  if (n >= 10000)     return `${(n / 10000).toFixed(0)}万円`
  return `${n.toLocaleString()}円`
}

// ── Sub-components ─────────────────────────────────────────────────
function Tag({ color, children }: { color: 'blue' | 'green' | 'gray'; children: React.ReactNode }) {
  const cls = {
    blue:  'bg-[#EFF6FF] text-[#1D4ED8]',
    green: 'bg-[#F0FDF4] text-[#15803D]',
    gray:  'bg-[#F1F5F9] text-[#64748B]',
  }[color]
  return (
    <span className={`inline-block text-[11px] font-medium rounded-full px-2.5 py-1 ${cls}`}>
      {children}
    </span>
  )
}

function ActionBtn({
  color, large, onClick, children,
}: {
  color: 'red' | 'blue' | 'gray'; large?: boolean; onClick: () => void; children: React.ReactNode
}) {
  const size = large ? 'w-16 h-16 text-[26px]' : 'w-12 h-12 text-xl'
  const bg   = { red: '#FEE2E2', blue: '#2563EB', gray: '#F1F5F9' }[color]
  const col  = { red: '#EF4444', blue: 'white',   gray: '#94A3B8' }[color]
  return (
    <button
      onClick={onClick}
      className={`${size} rounded-full flex items-center justify-center font-bold shadow-md transition-transform active:scale-90`}
      style={{ background: bg, color: col }}
    >
      {children}
    </button>
  )
}

// ── Main Component ─────────────────────────────────────────────────
export default function SwipeBidClient() {
  const [cards,     setCards]     = useState<BidItem[]>([])
  const [idx,       setIdx]       = useState(0)
  const [saved,     setSaved]     = useState<BidItem[]>([])
  const [tab,       setTab]       = useState<Tab>('swipe')
  const [settings,  setSettings]  = useState<Settings>(DEFAULT_SETTINGS)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [dragX,     setDragX]     = useState(0)
  const [dragging,  setDragging]  = useState(false)
  const [animating, setAnimating] = useState(false)
  const [kwInput,   setKwInput]   = useState('')

  const startXRef = useRef(0)

  // ── localStorage ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const s  = localStorage.getItem(LS_SETTINGS)
      const sv = localStorage.getItem(LS_SAVED)
      if (s)  setSettings(JSON.parse(s))
      if (sv) setSaved(JSON.parse(sv))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_SETTINGS, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem(LS_SAVED, JSON.stringify(saved))
  }, [saved])

  // ── Fetch ────────────────────────────────────────────────────────
  const fetchCards = useCallback(async (cfg: Settings) => {
    setLoading(true)
    setError(null)
    setIdx(0)
    setDragX(0)
    try {
      const params = new URLSearchParams({
        keywords: cfg.keywords.join(' '),
        pref:     cfg.pref,
      })
      const res = await fetch(`/api/swipebid?${params}`)
      if (!res.ok) throw new Error(`エラー ${res.status}`)
      const data: BidItem[] | { error: string } = await res.json()
      console.log('[swipebid] client received:', JSON.stringify(data).slice(0, 500))
      if ('error' in data) throw new Error(data.error)

      const filtered = (data as BidItem[]).filter(item => {
        if (!cfg.genres.includes(item.genre)) return false
        if (cfg.minBudget) {
          const n = parseInt(item.budget.replace(/[^0-9]/g, ''))
          if (!isNaN(n) && n > 0 && n < parseInt(cfg.minBudget)) return false
        }
        return true
      })
      setCards(filtered)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'データ取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCards(DEFAULT_SETTINGS) }, [fetchCards])

  // ── Actions ──────────────────────────────────────────────────────
  const handleLike = useCallback(() => {
    if (animating || !cards[idx]) return
    const card = cards[idx]
    setAnimating(true)
    setDragX(700)
    setTimeout(() => {
      setSaved(prev => prev.find(s => s.id === card.id) ? prev : [...prev, card])
      setIdx(i => i + 1)
      setDragX(0)
      setAnimating(false)
    }, 350)
  }, [animating, cards, idx])

  const handleSkip = useCallback(() => {
    if (animating || !cards[idx]) return
    setAnimating(true)
    setDragX(-700)
    setTimeout(() => {
      setIdx(i => i + 1)
      setDragX(0)
      setAnimating(false)
    }, 350)
  }, [animating, cards, idx])

  function handleOpen() {
    const url = cards[idx]?.url
    if (url) window.open(url, '_blank', 'noopener')
  }

  function removeSaved(id: string) {
    setSaved(prev => prev.filter(s => s.id !== id))
  }

  function handleSearch() {
    fetchCards(settings)
    setTab('swipe')
  }

  // ── Drag (Pointer Events) ────────────────────────────────────────
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (animating) return
    startXRef.current = e.clientX
    setDragging(true)
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return
    setDragX(e.clientX - startXRef.current)
  }

  function onPointerUp() {
    if (!dragging) return
    setDragging(false)
    if      (dragX >  80) handleLike()
    else if (dragX < -80) handleSkip()
    else                  setDragX(0)
  }

  // ── Settings helpers ─────────────────────────────────────────────
  function addKeyword() {
    const kw = kwInput.trim()
    if (!kw || settings.keywords.includes(kw)) { setKwInput(''); return }
    setSettings(s => ({ ...s, keywords: [...s.keywords, kw] }))
    setKwInput('')
  }

  function removeKeyword(kw: string) {
    setSettings(s => ({ ...s, keywords: s.keywords.filter(k => k !== kw) }))
  }

  function toggleGenre(g: Genre) {
    setSettings(s => ({
      ...s,
      genres: s.genres.includes(g) ? s.genres.filter(x => x !== g) : [...s.genres, g],
    }))
  }

  // ── Derived ──────────────────────────────────────────────────────
  const card      = cards[idx]
  const rotate    = dragX * 0.05
  const keepAlpha = Math.min(1, Math.max(0, (dragX - 30) / 60))
  const skipAlpha = Math.min(1, Math.max(0, (-dragX - 30) / 60))
  const remaining = Math.max(0, cards.length - idx)

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="flex justify-center bg-[#F0F4FB] min-h-screen">
      <div className="relative w-full flex flex-col bg-[#F0F4FB]" style={{ maxWidth: 430 }}>

        {/* ── Header ────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-5 py-3"
          style={{ background: '#0B1D3A' }}
        >
          <span
            className="text-white text-xl tracking-[0.15em] font-bold"
            style={{ fontFamily: "var(--font-bebas, 'Arial Black', sans-serif)" }}
          >
            SWIPE BID
          </span>
          {tab === 'swipe' && !loading && (
            <span className="text-white/50 text-xs">{remaining} 件</span>
          )}
        </header>

        {/* ── Swipe ─────────────────────────────────────────────── */}
        {tab === 'swipe' && (
          <div className="flex-1 flex flex-col items-center px-4 pt-8 pb-28">
            {loading ? (
              <div
                className="w-full rounded-[20px] bg-white shadow-xl overflow-hidden animate-pulse"
                style={{ maxWidth: 360, height: 310 }}
              >
                <div className="h-[103px] bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ) : error ? (
              <div className="text-center mt-16 px-4">
                <p className="text-[#0B1D3A]/60 text-sm mb-5">{error}</p>
                <button
                  onClick={() => fetchCards(settings)}
                  className="px-6 py-2.5 rounded-full text-white text-sm font-semibold"
                  style={{ background: '#2563EB' }}
                >
                  再読み込み
                </button>
              </div>
            ) : !card ? (
              <div className="text-center mt-16 px-4">
                <p className="text-4xl mb-4">🎉</p>
                <p className="text-[#0B1D3A] font-bold mb-2">すべて確認しました</p>
                <p className="text-[#0B1D3A]/50 text-sm mb-6">設定を変えて再検索してみましょう</p>
                <button
                  onClick={() => setTab('settings')}
                  className="px-6 py-2.5 rounded-full text-white text-sm font-semibold"
                  style={{ background: '#2563EB' }}
                >
                  設定を変更
                </button>
              </div>
            ) : (
              <>
                {/* Card */}
                <div
                  className="w-full rounded-[20px] bg-white shadow-xl overflow-hidden cursor-grab active:cursor-grabbing select-none relative"
                  style={{
                    maxWidth: 360,
                    height: 310,
                    transform: `translateX(${dragX}px) rotate(${rotate}deg)`,
                    transition: dragging || animating ? 'none' : 'transform 0.35s cubic-bezier(.23,1,.32,1)',
                  }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  {/* KEEP stamp */}
                  <div
                    className="absolute top-5 left-5 z-10 border-[3px] border-[#2563EB] text-[#2563EB] rounded-lg px-2.5 py-1 font-black text-xl tracking-widest pointer-events-none"
                    style={{ opacity: keepAlpha, transform: 'rotate(-18deg)' }}
                  >
                    KEEP
                  </div>

                  {/* SKIP stamp */}
                  <div
                    className="absolute top-5 right-5 z-10 border-[3px] border-red-500 text-red-500 rounded-lg px-2.5 py-1 font-black text-xl tracking-widest pointer-events-none"
                    style={{ opacity: skipAlpha, transform: 'rotate(18deg)' }}
                  >
                    SKIP
                  </div>

                  {/* Genre color band (top 1/3) */}
                  <div
                    className="flex items-end px-4 pb-3 flex-shrink-0"
                    style={{ background: GENRE_STYLES[card.genre].bg, height: '33%' }}
                  >
                    <span className="text-white text-xs font-semibold bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                      {GENRE_STYLES[card.genre].label}
                    </span>
                  </div>

                  {/* Info (bottom 2/3) */}
                  <div className="px-4 pt-3 pb-4 flex flex-col gap-1" style={{ height: '67%' }}>
                    <p className="text-[#0B1D3A] font-bold text-[14px] leading-snug line-clamp-2">
                      {card.title}
                    </p>
                    <p className="text-[#0B1D3A]/60 text-[12px] truncate">{card.org}</p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      <Tag color="blue">
                        📅 {fmtDeadline(card.deadline)}
                        {card.daysLeft >= 0 && `（残${card.daysLeft}日）`}
                      </Tag>
                      {fmtBudget(card.budget) && (
                        <Tag color="green">💴 {fmtBudget(card.budget)}</Tag>
                      )}
                      {card.pref && <Tag color="gray">📍 {card.pref}</Tag>}
                      {card.type && <Tag color="gray">{card.type}</Tag>}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-6 mt-8">
                  <ActionBtn color="red"  onClick={handleSkip}>✕</ActionBtn>
                  <ActionBtn color="blue" large onClick={handleLike}>♡</ActionBtn>
                  <ActionBtn color="gray" onClick={handleOpen}>↗</ActionBtn>
                </div>

                {/* Progress dots */}
                <div className="flex gap-1.5 mt-6 items-center">
                  {cards.slice(idx, idx + Math.min(remaining, 10)).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-full transition-all"
                      style={{
                        width:      i === 0 ? 20 : 6,
                        height:     6,
                        background: i === 0 ? '#2563EB' : '#CBD5E1',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Saved ─────────────────────────────────────────────── */}
        {tab === 'saved' && (
          <div className="flex-1 px-4 pt-6 pb-28">
            <p className="text-[#0B1D3A] font-bold text-base mb-4">
              保存済み{' '}
              <span className="text-[#2563EB]">{saved.length}</span>
            </p>
            {saved.length === 0 ? (
              <p className="text-center text-[#0B1D3A]/40 text-sm mt-16">
                まだ保存した案件がありません
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {saved.map(item => (
                  <div key={item.id} className="bg-white rounded-[16px] p-4 shadow-sm relative">
                    <button
                      onClick={() => removeSaved(item.id)}
                      className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-400 text-lg leading-none transition-colors"
                    >
                      ×
                    </button>
                    <div
                      className="inline-block text-white text-[10px] font-semibold rounded-full px-2.5 py-1 mb-2"
                      style={{ background: GENRE_STYLES[item.genre].bg }}
                    >
                      {GENRE_STYLES[item.genre].label}
                    </div>
                    <p className="text-[#0B1D3A] font-bold text-[14px] leading-snug pr-6 mb-1.5">
                      {item.title}
                    </p>
                    <p className="text-[#0B1D3A]/60 text-[12px] mb-2.5">{item.org}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <Tag color="blue">
                        📅 {fmtDeadline(item.deadline)}
                        {item.daysLeft >= 0 && `（残${item.daysLeft}日）`}
                      </Tag>
                      {fmtBudget(item.budget) && (
                        <Tag color="green">💴 {fmtBudget(item.budget)}</Tag>
                      )}
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2.5 inline-block text-[#2563EB] text-[12px] underline"
                      >
                        詳細を見る ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Settings ──────────────────────────────────────────── */}
        {tab === 'settings' && (
          <div className="flex-1 px-4 pt-6 pb-28 space-y-7">

            {/* Keywords */}
            <section>
              <h3 className="text-[#0B1D3A] font-bold text-[14px] mb-3">🔍 キーワード</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {settings.keywords.map(kw => (
                  <span
                    key={kw}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-white text-[12px] font-medium"
                    style={{ background: '#2563EB' }}
                  >
                    {kw}
                    <button
                      onClick={() => removeKeyword(kw)}
                      className="opacity-60 hover:opacity-100 ml-0.5 leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 text-[13px] border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:border-[#2563EB] transition-colors"
                  placeholder="キーワードを追加"
                  value={kwInput}
                  onChange={e => setKwInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addKeyword()}
                />
                <button
                  onClick={addKeyword}
                  className="px-4 py-2 rounded-lg text-white text-[13px] font-semibold"
                  style={{ background: '#2563EB' }}
                >
                  追加
                </button>
              </div>
            </section>

            {/* Genre */}
            <section>
              <h3 className="text-[#0B1D3A] font-bold text-[14px] mb-3">🎯 ジャンル</h3>
              <div className="space-y-3">
                {(Object.entries(GENRE_LABELS) as [Genre, string][]).map(([g, label]) => {
                  const on = settings.genres.includes(g)
                  return (
                    <div key={g} className="flex items-center justify-between">
                      <span className="text-[#0B1D3A] text-[13px]">{label}</span>
                      <button
                        onClick={() => toggleGenre(g)}
                        className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                        style={{ background: on ? '#2563EB' : '#CBD5E1' }}
                      >
                        <span
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                          style={{ left: on ? 'calc(100% - 20px)' : 4 }}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Budget */}
            <section>
              <h3 className="text-[#0B1D3A] font-bold text-[14px] mb-3">💴 予算下限</h3>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map(opt => {
                  const active = settings.minBudget === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSettings(s => ({ ...s, minBudget: opt.value }))}
                      className="px-4 py-2 rounded-full text-[13px] font-medium border transition-colors"
                      style={{
                        background:  active ? '#0B1D3A' : 'white',
                        color:       active ? 'white' : '#0B1D3A',
                        borderColor: active ? '#0B1D3A' : '#E2E8F0',
                      }}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Prefecture */}
            <section>
              <h3 className="text-[#0B1D3A] font-bold text-[14px] mb-3">📍 都道府県</h3>
              <select
                className="w-full px-3 py-2.5 text-[13px] border border-[#E2E8F0] rounded-lg bg-white text-[#0B1D3A] focus:outline-none focus:border-[#2563EB] transition-colors"
                value={settings.pref}
                onChange={e => setSettings(s => ({ ...s, pref: e.target.value }))}
              >
                {PREFS.map(p => (
                  <option key={p} value={p === '全国' ? '' : p}>{p}</option>
                ))}
              </select>
            </section>

            {/* Search */}
            <button
              onClick={handleSearch}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[15px] transition-opacity hover:opacity-90 active:opacity-80"
              style={{ background: 'linear-gradient(135deg,#0B1D3A,#2563EB)' }}
            >
              この条件で検索
            </button>
          </div>
        )}

        {/* ── Bottom Nav ────────────────────────────────────────── */}
        <nav
          className="fixed bottom-0 flex items-stretch border-t border-[#E2E8F0] bg-white z-20"
          style={{ width: '100%', maxWidth: 430 }}
        >
          {([
            { id: 'swipe',    icon: '🃏', label: 'Swipe' },
            { id: 'saved',    icon: '🔖', label: saved.length > 0 ? `Saved (${saved.length})` : 'Saved' },
            { id: 'settings', icon: '⚙️', label: 'Settings' },
          ] as const).map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors"
              style={{ color: tab === id ? '#2563EB' : '#94A3B8' }}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          ))}
        </nav>

      </div>
    </div>
  )
}
