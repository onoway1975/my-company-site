'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'

// ── Types ──────────────────────────────────────────────────────────
interface MenuItem {
  category: string
  name:     string
  nameEn:   string
  price:    string
  description: string
  imageUrl: string
}

// ── Helpers ────────────────────────────────────────────────────────
function parseCSV(text: string): string[][] {
  return text.trim().split('\n').map(line => {
    const fields: string[] = []
    let cur = '', inQ = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++ }
        else inQ = !inQ
      } else if (c === ',' && !inQ) {
        fields.push(cur.trim()); cur = ''
      } else {
        cur += c
      }
    }
    fields.push(cur.trim())
    return fields
  })
}

// ── Image with Fallback ────────────────────────────────────────────
function MenuImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f3f3f2]">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          {/* fork */}
          <line x1="11" y1="7"  x2="11" y2="29" stroke="#c8c8c4" strokeWidth="1.6" strokeLinecap="round"/>
          <line x1="9"  y1="7"  x2="9"  y2="13" stroke="#c8c8c4" strokeWidth="1.6" strokeLinecap="round"/>
          <line x1="13" y1="7"  x2="13" y2="13" stroke="#c8c8c4" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M9 13 Q11 15 13 13" stroke="#c8c8c4" strokeWidth="1.6" fill="none"/>
          {/* knife */}
          <line x1="25" y1="15" x2="25" y2="29" stroke="#c8c8c4" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M25 7 C27 9 27 13 25 15" stroke="#c8c8c4" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

function rowsToItems(rows: string[][]): MenuItem[] {
  return rows
    .slice(1)
    .filter(r => r[1])
    .map(r => ({
      category:    (r[0] || '').toUpperCase(),
      name:        r[1] || '',
      nameEn:      '',
      price:       r[2] || '',
      description: r[3] || '',
      imageUrl:    r[4] || '',
    }))
}

function toCSVUrl(input: string): string | null {
  const s = input.trim()
  if (s.includes('/export?format=csv') || s.includes('/pub?output=csv')) return s
  const m = s.match(/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)
  if (!m) return null
  return `https://docs.google.com/spreadsheets/d/${m[1]}/export?format=csv`
}

// ── Constants ──────────────────────────────────────────────────────
const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/17clSnUQUQrAFKQofN8aWSdvm2PQh1FibnFpD7wzV9H4/export?format=csv'

async function fetchSheet(csvUrl: string): Promise<MenuItem[]> {
  const res = await fetch(`/api/menucard?url=${encodeURIComponent(csvUrl)}`)
  if (!res.ok) throw new Error('スプレッドシートの取得に失敗しました。公開設定を確認してください。')
  const text = await res.text()
  const parsed = rowsToItems(parseCSV(text))
  if (!parsed.length) throw new Error('データが見つかりません。列構成（カテゴリ/商品名/価格/説明/画像URL）を確認してください。')
  return parsed
}

// ── Component ──────────────────────────────────────────────────────
export default function MenuCardClient() {
  const [items,          setItems]          = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [sheetUrl,       setSheetUrl]       = useState('')
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState('')
  const [isCustom,       setIsCustom]       = useState(false)

  // デフォルトスプレッドシートをマウント時に自動取得
  useEffect(() => {
    fetchSheet(DEFAULT_SHEET_URL)
      .then(parsed => setItems(parsed))
      .catch(() => setError('スプレッドシートの取得に失敗しました。'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const cats = [...new Set(items.map(i => i.category))].filter(Boolean)
    return ['ALL', ...cats]
  }, [items])

  const filtered = useMemo(() =>
    activeCategory === 'ALL' ? items : items.filter(i => i.category === activeCategory),
    [items, activeCategory]
  )

  const handleLoad = useCallback(async () => {
    if (!sheetUrl.trim()) return
    const csvUrl = toCSVUrl(sheetUrl)
    if (!csvUrl) {
      setError('有効なGoogleスプレッドシートのURLを入力してください。')
      return
    }
    setLoading(true)
    setError('')
    try {
      const parsed = await fetchSheet(csvUrl)
      setItems(parsed)
      setIsCustom(true)
      setActiveCategory('ALL')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'データの取得に失敗しました。')
    } finally {
      setLoading(false)
    }
  }, [sheetUrl])

  const handleReset = useCallback(async () => {
    setIsCustom(false)
    setActiveCategory('ALL')
    setSheetUrl('')
    setError('')
    setLoading(true)
    try {
      const parsed = await fetchSheet(DEFAULT_SHEET_URL)
      setItems(parsed)
    } catch {
      setError('スプレッドシートの取得に失敗しました。')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* ── Page Header ───────────────────────────────────────── */}
      <div className="text-center px-6 pt-12 pb-10 sm:pt-16 sm:pb-14">
        <p className="text-[10px] tracking-[0.3em] text-[#767676] uppercase mb-5">
          Demo — Spreadsheet Menu
        </p>
        <h1
          className="text-[52px] sm:text-[72px] text-[#111111] leading-none"
          style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif", fontWeight: 700 }}
        >
          CIRAF CAFÉ
        </h1>
        <p className="mt-4 text-[13px] text-[#767676] tracking-[0.12em]">
          ランチ・ドリンク・スイーツ
        </p>
        <p className="mt-1.5 text-[11px] text-[#767676] tracking-[0.18em] uppercase">
          Harajuku, Tokyo&nbsp;&nbsp;·&nbsp;&nbsp;11:00 – 18:00
        </p>
        {isCustom && (
          <button
            onClick={handleReset}
            className="mt-5 text-[11px] text-[#767676] underline underline-offset-4 hover:text-[#111111] transition-colors tracking-wide"
          >
            ← デモに戻す
          </button>
        )}
      </div>

      {/* ── Category Tabs ─────────────────────────────────────── */}
      <div className="border-t border-[#e2e2e2]">
        <div className="max-w-2xl mx-auto px-4">
          <div
            className="flex overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-4 text-[11px] tracking-[0.22em] uppercase whitespace-nowrap transition-colors border-b-[1.5px] ${
                  activeCategory === cat
                    ? 'text-[#111111] font-semibold border-[#111111]'
                    : 'text-[#767676] font-normal border-transparent hover:text-[#333333]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Menu Grid ─────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
        {loading ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-14">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square w-full bg-[#f0f0ef]" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 bg-[#f0f0ef] rounded-sm w-3/4" />
                  <div className="h-2.5 bg-[#f0f0ef] rounded-sm w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-[#767676] py-16">メニューがありません</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-14">
            {filtered.map((item, i) => (
              <div key={i}>
                {/* Square Image */}
                <div className="aspect-square w-full overflow-hidden bg-[#f3f3f2]">
                  <MenuImage src={item.imageUrl} alt={item.name} />
                </div>

                {/* Info */}
                <div className="mt-3 sm:mt-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[13px] sm:text-[15px] font-bold text-[#111111] leading-snug">
                      {item.name}
                    </p>
                    <p className="text-[13px] sm:text-[15px] font-semibold text-[#111111] shrink-0 tabular-nums">
                      {item.price}
                    </p>
                  </div>
                  {item.nameEn && (
                    <p className="text-[10px] text-[#767676] tracking-[0.14em] uppercase mt-0.5">
                      {item.nameEn}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-[11px] sm:text-[12px] text-[#767676] mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Try Your Own Spreadsheet ──────────────────────────── */}
      <div className="border-t border-[#e2e2e2] mt-4">
        <div className="max-w-2xl mx-auto px-4 py-14 sm:py-20">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#767676] mb-4">
            Try with your data
          </p>
          <h2
            className="text-[26px] sm:text-[32px] text-[#111111] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontWeight: 600 }}
          >
            自分のスプレッドシートで試す
          </h2>
          <p className="text-[12px] text-[#767676] leading-relaxed mb-1">
            スプレッドシートの列構成：
            <span className="text-[#111111] font-medium">カテゴリ / 商品名 / 価格 / 説明 / 画像URL</span>
          </p>
          <p className="text-[11px] text-[#767676] mb-7">
            ※ 共有設定を「リンクを知っている全員が閲覧可能」に設定してください
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="https://docs.google.com/spreadsheets/d/…"
              className="flex-1 px-4 py-3 text-[13px] border border-[#e2e2e2] bg-white text-[#111111] placeholder:text-[#b0b0b0] focus:outline-none focus:border-[#111111] transition-colors"
              value={sheetUrl}
              onChange={e => setSheetUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoad()}
            />
            <button
              onClick={handleLoad}
              disabled={loading || !sheetUrl.trim()}
              className="px-7 py-3 text-[13px] font-semibold bg-[#111111] text-white hover:bg-[#333333] transition-colors disabled:opacity-40 shrink-0"
            >
              {loading ? '読み込み中…' : '読み込む'}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-[12px] text-red-600">{error}</p>
          )}
        </div>
      </div>

    </div>
  )
}
