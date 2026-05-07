'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// ═══════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════

type Genre = 'web' | 'video' | 'writing' | 'design' | 'sns' | 'other'
type Tab = 'swipe' | 'saved' | 'settings'

interface ApiBidItem {
  id: string
  title: string
  org: string
  pref: string
  deadline: string
  daysLeft: number
  budget: string
  type: string
  genre: Genre
  url: string
}

interface BidItem extends ApiBidItem {
  match: number
  budgetNum: number
  format: string
  tags: string[]
  budgetDisplay: string
}

interface IconProps {
  size?: number
  sw?: number
  fill?: string
  stroke?: string
  style?: React.CSSProperties
}

// ═══════════════════════════════════════════════════════════════════
// Genre configuration
// ═══════════════════════════════════════════════════════════════════

const GENRES: Record<string, {
  label: string; short: string
  gradient: string; solid: string; soft: string; textOnSoft: string
  pattern: string
}> = {
  web: {
    label: 'Web制作', short: 'Web',
    gradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 45%, #60A5FA 100%)',
    solid: '#2563EB', soft: '#EFF4FF', textOnSoft: '#1E3A8A', pattern: 'grid',
  },
  video: {
    label: '動画制作', short: '動画',
    gradient: 'linear-gradient(135deg, #3B1F7A 0%, #6D28D9 45%, #A78BFA 100%)',
    solid: '#6D28D9', soft: '#F3EFFF', textOnSoft: '#3B1F7A', pattern: 'waves',
  },
  design: {
    label: 'デザイン', short: 'デザイン',
    gradient: 'linear-gradient(135deg, #9A3412 0%, #EA580C 45%, #FDBA74 100%)',
    solid: '#EA580C', soft: '#FFF2E8', textOnSoft: '#9A3412', pattern: 'dots',
  },
  writing: {
    label: 'ライティング', short: 'ライティング',
    gradient: 'linear-gradient(135deg, #064E3B 0%, #059669 45%, #6EE7B7 100%)',
    solid: '#059669', soft: '#E8F7F1', textOnSoft: '#064E3B', pattern: 'lines',
  },
  sns: {
    label: 'SNS・広告', short: 'SNS',
    gradient: 'linear-gradient(135deg, #831843 0%, #DB2777 45%, #F9A8D4 100%)',
    solid: '#DB2777', soft: '#FFF0F7', textOnSoft: '#831843', pattern: 'dots',
  },
  other: {
    label: 'その他', short: 'その他',
    gradient: 'linear-gradient(135deg, #1E293B 0%, #475569 45%, #94A3B8 100%)',
    solid: '#475569', soft: '#F1F5F9', textOnSoft: '#1E293B', pattern: 'grid',
  },
}

function getGenre(g: string) {
  return GENRES[g] || GENRES.other
}

// ═══════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════

const LS_SAVED = 'swipebid_saved'
const LS_TAB = 'swipebid_tab'
const LS_PREFS = 'swipebid_prefs'

const MONO = "'JetBrains Mono', monospace"

function parseBudgetNum(budget: string): number {
  const n = parseInt(budget.replace(/[^0-9]/g, ''))
  return isNaN(n) ? 0 : n
}

function deriveMatch(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  return 60 + Math.abs(hash % 36)
}

function deriveTags(title: string, genre: string): string[] {
  const tags: string[] = []
  const kwMap: [string, string][] = [
    ['WordPress', 'WordPress'], ['ホームページ', 'HP制作'], ['リニューアル', 'リニューアル'],
    ['アクセシビリティ', 'A11y'], ['アプリ', 'アプリ'], ['動画', '動画'],
    ['映像', '映像'], ['撮影', '撮影'], ['ドローン', 'ドローン'],
    ['デザイン', 'デザイン'], ['ロゴ', 'ロゴ'], ['パンフ', 'パンフ'],
    ['ポスター', 'ポスター'], ['広報', '広報'], ['執筆', '執筆'],
    ['編集', '編集'], ['SNS', 'SNS'], ['広告', '広告'],
    ['システム', 'システム'], ['UI', 'UI/UX'], ['多言語', '多言語'],
    ['企画', '企画'], ['調査', '調査'],
  ]
  for (const [kw, tag] of kwMap) {
    if (title.includes(kw) && !tags.includes(tag)) tags.push(tag)
    if (tags.length >= 3) break
  }
  if (tags.length === 0) {
    const fallback: Record<string, string[]> = {
      web: ['Web制作'], video: ['映像制作'], design: ['デザイン'],
      writing: ['ライティング'], sns: ['SNS運用'], other: ['業務委託'],
    }
    tags.push(...(fallback[genre] || ['業務委託']))
  }
  return tags
}

function enrichBid(item: ApiBidItem): BidItem {
  const budgetNum = parseBudgetNum(item.budget)
  return {
    ...item,
    match: deriveMatch(item.id),
    budgetNum,
    budgetDisplay: budgetNum > 0 ? `¥${budgetNum.toLocaleString()}` : '未定',
    format: item.type || '一般競争入札',
    tags: deriveTags(item.title, item.genre),
  }
}

// ═══════════════════════════════════════════════════════════════════
// SVG Icons (stroke-based, 24×24 viewBox)
// ═══════════════════════════════════════════════════════════════════

function SvgIcon({ d, size = 20, sw = 1.8, fill = 'none', stroke = 'currentColor', style }: IconProps & { d: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
  )
}

function IconClose(p: IconProps) { return <SvgIcon {...p} d="M6 6 L18 18 M18 6 L6 18" /> }
function IconHeart(p: IconProps) {
  return <SvgIcon {...p} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
}
function IconOpen(p: IconProps) {
  return <SvgIcon {...p} d={<><path d="M7 17 L17 7" /><path d="M8 7 L17 7 L17 16" /></>} />
}
function IconUndo(p: IconProps) {
  return <SvgIcon {...p} d={<><path d="M3 7 L9 7 L9 13" /><path d="M20 17 a8 8 0 0 0 -8 -8 a8 8 0 0 0 -7.7 6" /></>} />
}
function IconSwipe(p: IconProps) {
  return <SvgIcon {...p} d={<><rect x="6" y="3" width="12" height="18" rx="2.5" /><path d="M10 9 L14 12 L10 15" /></>} />
}
function IconBookmark(p: IconProps) { return <SvgIcon {...p} d="M6 4 L18 4 L18 21 L12 17 L6 21 Z" /> }
function IconCog(p: IconProps) {
  return <SvgIcon {...p} d={<><circle cx="12" cy="12" r="3" /><path d="M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12 M4.9 4.9 L7 7 M17 17 L19.1 19.1 M4.9 19.1 L7 17 M17 7 L19.1 4.9" /></>} />
}
function IconFilter(p: IconProps) { return <SvgIcon {...p} d="M3 5 L21 5 L14 13 L14 20 L10 18 L10 13 Z" /> }
function IconCal(p: IconProps) {
  return <SvgIcon {...p} d={<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10 L21 10 M8 3 L8 7 M16 3 L16 7" /></>} />
}
function IconYen(p: IconProps) {
  return <SvgIcon {...p} d={<><path d="M6 5 L12 13 L18 5" /><path d="M7 13 L17 13 M7 17 L17 17" /><path d="M12 13 L12 21" /></>} />
}
function IconPin(p: IconProps) {
  return <SvgIcon {...p} d={<><path d="M12 22 S4 14.5 4 10 a8 8 0 0 1 16 0 c0 4.5 -8 12 -8 12 z" /><circle cx="12" cy="10" r="2.6" /></>} />
}
function IconDoc(p: IconProps) {
  return <SvgIcon {...p} d={<><path d="M7 3 L15 3 L19 7 L19 21 L7 21 Z" /><path d="M15 3 L15 7 L19 7" /><path d="M10 12 L16 12 M10 16 L14 16" /></>} />
}
function IconSearch(p: IconProps) {
  return <SvgIcon {...p} d={<><circle cx="11" cy="11" r="7" /><path d="M16 16 L21 21" /></>} />
}
function IconSpark(p: IconProps) {
  return <SvgIcon {...p} d={<><path d="M12 3 L13.6 9.8 L20.4 11.4 L13.6 13 L12 19.8 L10.4 13 L3.6 11.4 L10.4 9.8 Z" /></>} />
}

// ═══════════════════════════════════════════════════════════════════
// GenrePattern — decorative SVG in gradient band
// ═══════════════════════════════════════════════════════════════════

function GenrePattern({ kind, uid }: { kind: string; uid: string }) {
  const base: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' }
  if (kind === 'grid') {
    const id = `pg-${uid}`
    return (
      <svg style={{ ...base, opacity: 0.18 }}>
        <defs>
          <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0 L0 0 L0 28" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    )
  }
  if (kind === 'waves') {
    return (
      <svg style={{ ...base, opacity: 0.22 }} preserveAspectRatio="none" viewBox="0 0 400 200">
        <path d="M0 120 Q 50 90 100 120 T 200 120 T 300 120 T 400 120 V200 H0 Z" fill="white" opacity="0.35" />
        <path d="M0 150 Q 50 130 100 150 T 200 150 T 300 150 T 400 150 V200 H0 Z" fill="white" opacity="0.2" />
      </svg>
    )
  }
  if (kind === 'dots') {
    const id = `pd-${uid}`
    return (
      <svg style={{ ...base, opacity: 0.28 }}>
        <defs>
          <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.6" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    )
  }
  if (kind === 'lines') {
    const id = `pl-${uid}`
    return (
      <svg style={{ ...base, opacity: 0.22 }}>
        <defs>
          <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
            <line x1="0" y1="7" x2="14" y2="7" stroke="white" strokeWidth="1.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    )
  }
  return null
}

// ═══════════════════════════════════════════════════════════════════
// Card sub-components
// ═══════════════════════════════════════════════════════════════════

function DaysLeftChip({ days }: { days: number }) {
  const urgent = days <= 14
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 26, padding: '0 10px', borderRadius: 999,
      background: urgent ? 'rgba(255, 90, 90, 0.95)' : 'rgba(255,255,255,0.22)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.35)',
      color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
      fontFamily: MONO,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: '#fff' }} />
      残り {days}日
    </div>
  )
}

function Field({ icon: Ico, label, value, mono }: {
  icon: (p: IconProps) => React.ReactNode; label: string; value: string; mono?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 26, height: 26, borderRadius: 7,
        background: '#F1F4FB', color: '#0B1D3A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Ico size={14} sw={2} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 10, color: '#7A8699', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
        <div style={{
          fontSize: 13.5, color: '#0B1D3A', fontWeight: 600,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          fontFamily: mono ? MONO : 'inherit',
          marginTop: 1,
        }}>{value}</div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// BidCard — Tinder-like swipe card
// ═══════════════════════════════════════════════════════════════════

function BidCard({ bid, isTop, stackIndex, kept }: {
  bid: BidItem; isTop: boolean; stackIndex: number; kept?: boolean
}) {
  const g = getGenre(bid.genre)
  const scale = 1 - stackIndex * 0.04
  const ty = stackIndex * 10

  return (
    <div
      {...(isTop ? { 'data-top-card': '' } : {})}
      style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        width: '100%', height: '100%',
        transform: isTop
          ? 'translate(0px, 0px) rotate(0deg)'
          : `translateY(${ty}px) scale(${scale})`,
        transformOrigin: '50% 100%',
        transition: isTop ? 'none' : 'transform 300ms ease',
        willChange: 'transform',
        zIndex: 10 - stackIndex,
        pointerEvents: isTop ? 'auto' : 'none',
      }}>
      <div style={{
        width: '100%', height: '100%',
        background: '#fff', borderRadius: 22, overflow: 'hidden',
        boxShadow: isTop
          ? '0 18px 40px -12px rgba(11,29,58,0.25), 0 4px 12px rgba(11,29,58,0.08)'
          : '0 8px 20px -6px rgba(11,29,58,0.18)',
        display: 'flex', flexDirection: 'column',
        border: '1px solid rgba(11,29,58,0.06)',
      }}>
        {/* ── TOP 1/3 — gradient band ── */}
        <div style={{
          flex: '0 0 34%', background: g.gradient,
          position: 'relative', overflow: 'hidden', color: '#fff',
        }}>
          <GenrePattern kind={g.pattern} uid={bid.id} />

          {/* genre tag */}
          <div style={{
            position: 'absolute', left: 16, top: 16,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 28, padding: '0 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.95)',
            color: g.textOnSoft, fontSize: 12, fontWeight: 700, letterSpacing: 0.4,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: g.solid }} />
            {g.label}
          </div>

          {/* days left + kept badge */}
          <div style={{ position: 'absolute', right: 16, top: 16, display: 'flex', gap: 6, alignItems: 'center' }}>
            {kept && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                height: 26, padding: '0 10px', borderRadius: 999,
                background: 'rgba(255,255,255,0.95)',
                color: '#2563EB', fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12 L10 17 L19 7" />
                </svg>
                キープ済み
              </div>
            )}
            <DaysLeftChip days={bid.daysLeft} />
          </div>

          {/* match score + budget */}
          <div style={{
            position: 'absolute', left: 16, right: 16, bottom: 14,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 1.2, opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', fontFamily: MONO }}>MATCH</div>
              <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, letterSpacing: -0.5, fontFamily: MONO }}>
                {bid.match}<span style={{ fontSize: 14, fontWeight: 600, opacity: 0.8 }}>%</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, letterSpacing: 1.2, opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', fontFamily: MONO }}>予算上限</div>
              <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.1, fontFamily: MONO, marginTop: 2 }}>
                {bid.budgetDisplay}
              </div>
            </div>
          </div>

          {/* KEEP stamp */}
          <div data-keep-stamp="" style={{
            position: 'absolute', top: 20, left: 20, transform: 'rotate(-12deg)',
            opacity: 0,
            border: '3px solid #2563EB', color: '#2563EB',
            padding: '4px 12px', borderRadius: 8,
            fontWeight: 800, fontSize: 22, letterSpacing: 2,
            background: 'rgba(255,255,255,0.92)',
          }}>KEEP</div>

          {/* SKIP stamp */}
          <div data-skip-stamp="" style={{
            position: 'absolute', top: 20, right: 20, transform: 'rotate(12deg)',
            opacity: 0,
            border: '3px solid #EF4444', color: '#EF4444',
            padding: '4px 12px', borderRadius: 8,
            fontWeight: 800, fontSize: 22, letterSpacing: 2,
            background: 'rgba(255,255,255,0.92)',
          }}>SKIP</div>
        </div>

        {/* ── BOTTOM 2/3 — details ── */}
        <div style={{
          flex: '1 1 auto', padding: '16px 18px 18px',
          display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0,
        }}>
          <div>
            <div style={{
              fontSize: 11, color: '#7A8699', fontWeight: 600, letterSpacing: 0.4,
              marginBottom: 4, textTransform: 'uppercase', fontFamily: MONO,
            }}>
              CASE {bid.id.toUpperCase().slice(0, 8)}
            </div>
            <h2 style={{
              margin: 0, fontSize: 17, lineHeight: 1.35, fontWeight: 700,
              color: '#0B1D3A', letterSpacing: -0.2,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {bid.title}
            </h2>
            <div style={{ fontSize: 12.5, color: '#4A5770', fontWeight: 500, marginTop: 6 }}>
              {bid.org}
            </div>
          </div>

          <div style={{ height: 1, background: '#EEF1F7' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, rowGap: 12 }}>
            <Field icon={IconCal} label="締切" value={bid.deadline.replace(/-/g, '/')} mono />
            <Field icon={IconYen} label="予算" value={bid.budgetDisplay} mono />
            <Field icon={IconPin} label="都道府県" value={bid.pref || '全国'} />
            <Field icon={IconDoc} label="入札形式" value={bid.format} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto', paddingTop: 4 }}>
            {bid.tags.map((t, i) => (
              <span key={i} style={{
                fontSize: 11, fontWeight: 600,
                padding: '4px 9px', borderRadius: 6,
                background: g.soft, color: g.textOnSoft,
              }}>#{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Layout components
// ═══════════════════════════════════════════════════════════════════

function TopBar({ title, right, left }: {
  title: string; right?: React.ReactNode; left?: React.ReactNode
}) {
  return (
    <div style={{
      padding: '16px 18px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#fff', borderBottom: '1px solid #EEF1F7',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {left}
        <div>
          <div style={{ fontSize: 10, color: '#7A8699', fontWeight: 700, letterSpacing: 2, fontFamily: MONO }}>SWIPE BID</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#0B1D3A', letterSpacing: -0.3, marginTop: -2 }}>{title}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>{right}</div>
    </div>
  )
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: 38, height: 38, borderRadius: 11,
      background: '#F4F6FB', color: '#0B1D3A',
      border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 180ms',
    }}>{children}</button>
  )
}

function GenreChips({ active, onPick }: { active: string; onPick: (g: string) => void }) {
  const items = [
    { key: 'all', label: 'すべて', solid: '#0B1D3A' },
    ...Object.entries(GENRES).map(([k, v]) => ({ key: k, label: v.short, solid: v.solid })),
  ]
  return (
    <div className="sb-scroll" style={{
      display: 'flex', gap: 8, padding: '12px 18px 10px', overflowX: 'auto',
      background: '#fff', flexShrink: 0,
    }}>
      {items.map(it => {
        const on = active === it.key
        return (
          <button key={it.key} onClick={() => onPick(it.key)} style={{
            flexShrink: 0,
            height: 34, padding: '0 14px', borderRadius: 999,
            border: on ? 'none' : '1px solid #E3E7F0',
            background: on ? it.solid : '#fff',
            color: on ? '#fff' : '#0B1D3A',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {it.key !== 'all' && <span style={{ width: 8, height: 8, borderRadius: 999, background: on ? '#fff' : it.solid }} />}
            {it.label}
          </button>
        )
      })}
    </div>
  )
}

function SwipeActionBtn({ kind, onClick, disabled, big }: {
  kind: 'skip' | 'keep' | 'open'; onClick: () => void; disabled: boolean; big?: boolean
}) {
  const cfg = {
    skip: { bg: '#fff', ring: '#FFD7D7', color: '#EF4444', icon: IconClose, sz: big ? 72 : 58 },
    keep: { bg: '#2563EB', ring: '#2563EB', color: '#fff', icon: IconHeart, sz: big ? 72 : 58 },
    open: { bg: '#fff', ring: '#E3E7F0', color: '#0B1D3A', icon: IconOpen, sz: big ? 72 : 58 },
  }[kind]
  const Ico = cfg.icon
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: cfg.sz, height: cfg.sz, borderRadius: 999,
      background: cfg.bg, color: cfg.color,
      border: kind === 'keep' ? 'none' : `1.5px solid ${cfg.ring}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      boxShadow: kind === 'keep'
        ? '0 8px 20px -4px rgba(37,99,235,0.45), 0 2px 4px rgba(37,99,235,0.2)'
        : '0 4px 12px -4px rgba(11,29,58,0.15)',
      transition: 'transform 120ms',
    }}
    onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.94)' }}
    onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      <Ico size={big ? 30 : 24} sw={2.4} />
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Saved screen
// ═══════════════════════════════════════════════════════════════════

function SavedRow({ bid, onOpen, onRemove }: {
  bid: BidItem; onOpen: () => void; onRemove: () => void
}) {
  const g = getGenre(bid.genre)
  const urgent = bid.daysLeft <= 14
  return (
    <div onClick={onOpen} style={{
      display: 'flex', gap: 12,
      background: '#fff', borderRadius: 14,
      padding: 12, marginBottom: 10,
      border: '1px solid #EEF1F7', cursor: 'pointer',
    }}>
      <div style={{
        width: 52, flexShrink: 0, borderRadius: 10,
        background: g.gradient,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: '#fff', padding: 6,
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, opacity: 0.9, fontFamily: MONO }}>残</div>
        <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1, fontFamily: MONO }}>{bid.daysLeft}</div>
        <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.9 }}>日</div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
            background: g.soft, color: g.textOnSoft, letterSpacing: 0.3,
          }}>{g.label}</span>
          {urgent && <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
            background: '#FFECEC', color: '#C81E1E',
          }}>締切間近</span>}
        </div>
        <div style={{
          fontSize: 13.5, fontWeight: 700, color: '#0B1D3A', lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{bid.title}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 11, color: '#4A5770', fontWeight: 500 }}>
          <span>{bid.pref || '全国'}</span>
          <span style={{ color: '#D7DCE6' }}>·</span>
          <span style={{ fontFamily: MONO }}>{bid.budgetDisplay}</span>
        </div>
      </div>

      <button onClick={(e) => { e.stopPropagation(); onRemove() }} style={{
        alignSelf: 'flex-start',
        width: 28, height: 28, borderRadius: 8,
        background: 'transparent', border: 'none',
        color: '#94A0B4', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><IconClose size={16} sw={2} /></button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Settings helpers
// ═══════════════════════════════════════════════════════════════════

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{
      width: 44, height: 26, borderRadius: 999,
      background: on ? '#2563EB' : '#D7DCE6',
      border: 'none', cursor: 'pointer', padding: 0,
      position: 'relative', transition: 'background 180ms', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 20, height: 20, borderRadius: 999, background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)', transition: 'left 180ms',
      }} />
    </button>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, letterSpacing: 1.4, color: '#7A8699',
      fontWeight: 700, textTransform: 'uppercase', margin: '18px 4px 8px',
      fontFamily: MONO,
    }}>{children}</div>
  )
}

function SettingsRow({ label, sub, children }: {
  label: string; sub?: string; children?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1D3A' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: '#7A8699', marginTop: 2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════
// Detail sheet
// ═══════════════════════════════════════════════════════════════════

function Stat({ label, value, sub, urgent }: {
  label: string; value: string; sub?: string; urgent?: boolean
}) {
  return (
    <div style={{ background: '#F7F9FD', borderRadius: 12, padding: 12, border: '1px solid #EEF1F7' }}>
      <div style={{ fontSize: 10, color: '#7A8699', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', fontFamily: MONO }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: '#0B1D3A', marginTop: 3, fontFamily: MONO, letterSpacing: -0.3 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: urgent ? '#C81E1E' : '#7A8699', fontWeight: 600, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function Timeline({ days }: { days: number }) {
  const steps = [
    { label: '公示', state: 'done' as const },
    { label: '質問受付締切', state: 'done' as const },
    { label: '提案書締切', state: 'active' as const },
    { label: '審査', state: 'todo' as const },
    { label: '契約', state: 'todo' as const },
  ]
  return (
    <div style={{ padding: '4px 4px' }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < steps.length - 1 ? 14 : 0, position: 'relative' }}>
          {i < steps.length - 1 && (
            <div style={{
              position: 'absolute', left: 8, top: 18, bottom: 0, width: 2,
              background: s.state === 'done' ? '#2563EB' : '#E3E7F0',
            }} />
          )}
          <div style={{
            width: 18, height: 18, borderRadius: 999, flexShrink: 0,
            border: s.state === 'todo' ? '2px solid #D7DCE6' : '2px solid #2563EB',
            background: s.state === 'done' ? '#2563EB' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: s.state === 'active' ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none',
          }}>
            {s.state === 'active' && <div style={{ width: 8, height: 8, borderRadius: 999, background: '#2563EB' }} />}
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: s.state === 'active' ? 700 : 600, color: s.state === 'todo' ? '#94A0B4' : '#0B1D3A' }}>{s.label}</div>
            {s.state === 'active' && <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 600, marginTop: 2 }}>あと {days}日</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

function DetailSheet({ bid, onClose, onKeep, isKept }: {
  bid: BidItem; onClose: () => void; onKeep: () => void; isKept: boolean
}) {
  const g = getGenre(bid.genre)
  const H3: React.CSSProperties = {
    fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase',
    color: '#7A8699', fontWeight: 700, margin: '22px 0 10px', fontFamily: MONO,
  }
  const P: React.CSSProperties = { fontSize: 13.5, lineHeight: 1.7, color: '#2C3A55', margin: 0 }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(11, 29, 58, 0.4)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'sb-fadein 220ms',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', height: '92%',
        background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        animation: 'sb-slideup 320ms cubic-bezier(.2,.8,.2,1)',
        position: 'relative',
      }}>
        {/* ── Header — gradient band (min 160px) ── */}
        <div style={{
          background: g.gradient, color: '#fff',
          padding: '12px 18px 20px',
          minHeight: 160,
          position: 'relative', flexShrink: 0,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.5)' }} />
          </div>

          {/* Close button */}
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 14,
            width: 32, height: 32, borderRadius: 999,
            background: 'rgba(255,255,255,0.22)', border: 'none',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}><IconClose size={16} sw={2.4} /></button>

          {/* Genre tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            alignSelf: 'flex-start',
            height: 26, padding: '0 11px', borderRadius: 999,
            background: 'rgba(255,255,255,0.95)', color: g.textOnSoft,
            fontSize: 11, fontWeight: 700, marginBottom: 12,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: g.solid }} />
            {g.label} · {bid.format}
          </div>

          {/* Spacer to push eyebrow + title to bottom */}
          <div style={{ flex: 1 }} />

          {/* CASE ID · org (eyebrow) */}
          <div style={{
            fontSize: 10, letterSpacing: 1.2, opacity: 0.85,
            fontFamily: MONO, fontWeight: 600,
          }}>
            CASE {bid.id.toUpperCase().slice(0, 8)} · {bid.org}
          </div>

          {/* Title */}
          <h2 style={{
            margin: '6px 0 0', fontSize: 19, fontWeight: 700,
            lineHeight: 1.4, letterSpacing: -0.2,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>{bid.title}</h2>
        </div>

        {/* ── Scrollable body ── */}
        <div className="sb-scroll" style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 100px' }}>
          {/* Stat grid 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Stat label="締切" value={bid.deadline.replace(/-/g, '/')} sub={`残り ${bid.daysLeft}日`} urgent={bid.daysLeft <= 14} />
            <Stat label="予算上限" value={bid.budgetDisplay} sub="税抜" />
            <Stat label="実施都道府県" value={bid.pref || '全国'} />
            <Stat label="マッチ率" value={`${bid.match}%`} sub="プロフィール比" />
          </div>

          {/* 業務概要 */}
          <h3 style={H3}>業務概要</h3>
          <p style={P}>{bid.title}</p>

          {/* スキルタグ */}
          <h3 style={H3}>求められるスキル</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {bid.tags.map((t, i) => (
              <span key={i} style={{
                fontSize: 12, fontWeight: 600,
                padding: '6px 11px', borderRadius: 8,
                background: g.soft, color: g.textOnSoft,
              }}>#{t}</span>
            ))}
          </div>

          {/* スケジュール */}
          <h3 style={H3}>スケジュール</h3>
          <Timeline days={bid.daysLeft} />
        </div>

        {/* ── Sticky CTA (fixed at bottom) ── */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: '14px 16px 20px',
          background: 'linear-gradient(to top, #fff 60%, rgba(255,255,255,0))',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {bid.url && (
            <button onClick={() => window.open(bid.url, '_blank')} style={{
              width: '100%', height: 48, borderRadius: 14,
              background: '#fff', color: '#0B1D3A',
              border: '1.5px solid #0B1D3A',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>官公需サイトで見る ↗</button>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{
              flex: '0 0 auto', height: 52, padding: '0 18px', borderRadius: 14,
              background: '#F4F6FB', color: '#0B1D3A',
              border: '1px solid #E3E7F0', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}>戻る</button>
            <button onClick={() => { onKeep(); onClose() }} style={{
              flex: 1, height: 52, borderRadius: 14,
              background: isKept ? '#0B1D3A' : '#2563EB',
              color: '#fff', border: 'none',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 8px 20px -4px rgba(37,99,235,0.45)',
            }}>
              <IconHeart size={18} fill={isKept ? '#fff' : 'none'} />
              {isKept ? 'キープ済み' : 'キープして応募準備'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Bottom navigation
// ═══════════════════════════════════════════════════════════════════

function BottomNav({ tab, setTab, savedCount }: {
  tab: Tab; setTab: (t: Tab) => void; savedCount: number
}) {
  const items: { key: Tab; label: string; Icon: (p: IconProps) => React.ReactNode; badge?: number }[] = [
    { key: 'swipe', label: 'Swipe', Icon: IconSwipe },
    { key: 'saved', label: 'Saved', Icon: IconBookmark, badge: savedCount },
    { key: 'settings', label: 'Settings', Icon: IconCog },
  ]
  return (
    <div style={{
      display: 'flex', background: '#fff',
      borderTop: '1px solid #EEF1F7',
      padding: '6px 8px 20px', flexShrink: 0,
    }}>
      {items.map(it => {
        const on = tab === it.key
        const Ico = it.Icon
        return (
          <button key={it.key} onClick={() => setTab(it.key)} style={{
            flex: 1, background: 'transparent', border: 'none',
            padding: '8px 0 6px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: on ? '#2563EB' : '#94A0B4', position: 'relative',
          }}>
            <div style={{ position: 'relative' }}>
              <Ico size={22} sw={on ? 2.2 : 1.8} />
              {(it.badge ?? 0) > 0 && (
                <div style={{
                  position: 'absolute', top: -5, right: -10,
                  minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999,
                  background: '#2563EB', color: '#fff',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #fff', fontFamily: MONO,
                }}>{it.badge}</div>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>{it.label}</span>
            {on && <div style={{
              position: 'absolute', bottom: 0, width: 18, height: 3, borderRadius: 2, background: '#2563EB',
            }} />}
          </button>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════════════

export default function SwipeBidClient() {
  // ── State ──
  const [tab, setTab] = useState<Tab>('swipe')
  const [cards, setCards] = useState<BidItem[]>([])
  const [index, setIndex] = useState(0)
  const [liked, setLiked] = useState<BidItem[]>([])
  const [genreFilter, setGenreFilter] = useState('all')
  const [openBid, setOpenBid] = useState<BidItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [prefs, setPrefs] = useState({
    genres: { web: true, video: true, design: true, writing: true, sns: true, other: true } as Record<string, boolean>,
    budgetMin: 100, budgetMax: 1500,
    notifyDaily: true, notifyDeadline: true, highMatchOnly: false,
  })

  const animRef = useRef(false)
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const dragRef = useRef({ x: 0, y: 0, rot: 0 })
  const draggingRef = useRef(false)
  const rafIdRef = useRef(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const commitFnRef = useRef<(dir: number) => void>(() => {})

  // ── Derived ──
  const deck = useMemo(() => {
    let d = cards.filter(c => prefs.genres[c.genre] !== false)
    if (genreFilter !== 'all') d = d.filter(c => c.genre === genreFilter)
    return d
  }, [cards, prefs.genres, genreFilter])

  const visible = deck.length > 0
    ? Array.from({ length: Math.min(3, deck.length) }, (_, i) => deck[(index + i) % deck.length])
    : []
  const total = deck.length

  // ── localStorage load ──
  useEffect(() => {
    try {
      const sv = localStorage.getItem(LS_SAVED)
      const t = localStorage.getItem(LS_TAB)
      const p = localStorage.getItem(LS_PREFS)
      if (sv) setLiked(JSON.parse(sv))
      if (t) setTab(JSON.parse(t) as Tab)
      if (p) setPrefs(prev => ({ ...prev, ...JSON.parse(p) }))
    } catch { /* ignore */ }
  }, [])

  // ── localStorage save ──
  useEffect(() => { localStorage.setItem(LS_SAVED, JSON.stringify(liked)) }, [liked])
  useEffect(() => { localStorage.setItem(LS_TAB, JSON.stringify(tab)) }, [tab])
  useEffect(() => { localStorage.setItem(LS_PREFS, JSON.stringify(prefs)) }, [prefs])

  // ── Fetch ──
  const fetchCards = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const keywords = 'ホームページ Web 動画 デザイン SNS パンフレット 広報'
      const res = await fetch(`/api/swipebid?keywords=${encodeURIComponent(keywords)}`)
      if (!res.ok) throw new Error(`エラー ${res.status}`)
      const data = await res.json()
      if ('error' in data) throw new Error(data.error)
      setCards((data as ApiBidItem[]).map(enrichBid))
      setIndex(0)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'データ取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCards() }, [fetchCards])

  // ── Reset index on filter change ──
  useEffect(() => {
    setIndex(0)
    dragRef.current = { x: 0, y: 0, rot: 0 }
  }, [genreFilter])

  // ── Swipe commit (direct DOM, no React re-render during animation) ──
  commitFnRef.current = (dir: number) => {
    if (animRef.current || deck.length === 0) return
    animRef.current = true
    draggingRef.current = false
    const card = stageRef.current?.querySelector<HTMLElement>('[data-top-card]')
    const keepStamp = card?.querySelector<HTMLElement>('[data-keep-stamp]')
    const skipStamp = card?.querySelector<HTMLElement>('[data-skip-stamp]')
    if (card) {
      card.style.transition = 'transform 280ms cubic-bezier(.2,.8,.2,1)'
      card.style.transform = `translate(${dir * 500}px, 0px) rotate(${dir * 20}deg)`
      if (keepStamp) keepStamp.style.opacity = dir > 0 ? '1' : '0'
      if (skipStamp) skipStamp.style.opacity = dir < 0 ? '1' : '0'
    }
    setTimeout(() => {
      if (dir > 0) {
        const bid = deck[index % deck.length]
        if (bid) setLiked(prev => prev.find(b => b.id === bid.id) ? prev : [bid, ...prev])
      }
      dragRef.current = { x: 0, y: 0, rot: 0 }
      setIndex(i => i + 1)
      animRef.current = false
    }, 280)
  }

  // ── Direct DOM transform helper (called via rAF) ──
  function applyTransform() {
    const d = dragRef.current
    const card = stageRef.current?.querySelector<HTMLElement>('[data-top-card]')
    if (!card) return
    card.style.transition = 'none'
    card.style.transform = `translate(${d.x}px, ${d.y}px) rotate(${d.rot}deg)`
    const keepStamp = card.querySelector<HTMLElement>('[data-keep-stamp]')
    const skipStamp = card.querySelector<HTMLElement>('[data-skip-stamp]')
    if (keepStamp) keepStamp.style.opacity = String(Math.min(1, Math.max(0, (d.x - 30) / 80)))
    if (skipStamp) skipStamp.style.opacity = String(Math.min(1, Math.max(0, (-d.x - 30) / 80)))
  }

  function resetPosition() {
    dragRef.current = { x: 0, y: 0, rot: 0 }
    const card = stageRef.current?.querySelector<HTMLElement>('[data-top-card]')
    if (!card) return
    card.style.transition = 'transform 400ms cubic-bezier(.2,.8,.2,1)'
    card.style.transform = 'translate(0px, 0px) rotate(0deg)'
    const keepStamp = card.querySelector<HTMLElement>('[data-keep-stamp]')
    const skipStamp = card.querySelector<HTMLElement>('[data-skip-stamp]')
    if (keepStamp) { keepStamp.style.transition = 'opacity 200ms'; keepStamp.style.opacity = '0' }
    if (skipStamp) { skipStamp.style.transition = 'opacity 200ms'; skipStamp.style.opacity = '0' }
  }

  // ── Pointer events via native addEventListener with passive: true ──
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || tab !== 'swipe') return

    let pointerId: number | null = null

    function onDown(e: PointerEvent) {
      if (animRef.current) return
      startRef.current = { x: e.clientX, y: e.clientY }
      draggingRef.current = true
      pointerId = e.pointerId
      stage!.setPointerCapture(e.pointerId)
    }

    function onMove(e: PointerEvent) {
      if (!startRef.current || !draggingRef.current) return
      const dx = e.clientX - startRef.current.x
      const dy = e.clientY - startRef.current.y
      dragRef.current = { x: dx, y: dy * 0.3, rot: dx / 18 }
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = requestAnimationFrame(applyTransform)
    }

    function onUp() {
      if (!startRef.current) return
      startRef.current = null
      draggingRef.current = false
      pointerId = null
      cancelAnimationFrame(rafIdRef.current)
      const d = dragRef.current
      if (d.x > 110) commitFnRef.current(1)
      else if (d.x < -110) commitFnRef.current(-1)
      else resetPosition()
    }

    stage.addEventListener('pointerdown', onDown, { passive: true })
    stage.addEventListener('pointermove', onMove, { passive: true })
    stage.addEventListener('pointerup', onUp, { passive: true })
    stage.addEventListener('pointercancel', onUp, { passive: true })

    return () => {
      cancelAnimationFrame(rafIdRef.current)
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
    }
  }, [tab])

  // ── Saved actions ──
  function removeSaved(id: string) {
    setLiked(prev => prev.filter(b => b.id !== id))
  }

  function keepBid(bid: BidItem) {
    setLiked(prev => prev.find(b => b.id === bid.id) ? prev : [bid, ...prev])
  }

  function isKept(id: string) {
    return !!liked.find(b => b.id === id)
  }

  // ── Loading skeleton ──
  const LoadingSkeleton = (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#fff', borderRadius: 22, overflow: 'hidden',
      border: '1px solid rgba(11,29,58,0.06)',
    }}>
      <div style={{ height: '34%', background: '#E3E7F0' }} />
      <div style={{ padding: '18px' }}>
        <div style={{ height: 12, background: '#EEF1F7', borderRadius: 4, width: '40%', marginBottom: 10 }} />
        <div style={{ height: 16, background: '#EEF1F7', borderRadius: 4, width: '85%', marginBottom: 6 }} />
        <div style={{ height: 12, background: '#EEF1F7', borderRadius: 4, width: '50%', marginBottom: 20 }} />
        <div style={{ height: 1, background: '#EEF1F7', marginBottom: 16 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 36, background: '#EEF1F7', borderRadius: 6 }} />
          ))}
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Main content area ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>

        {/* ════ SWIPE SCREEN ════ */}
        {tab === 'swipe' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F4F6FB' }}>
            <TopBar title="案件を探す" />
            <GenreChips active={genreFilter} onPick={setGenreFilter} />

            {/* Progress bar */}
            {!loading && !error && deck.length > 0 && (
              <div style={{ padding: '0 18px 10px', background: '#fff', borderBottom: '1px solid #EEF1F7', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontFamily: MONO, color: '#7A8699', fontWeight: 600, letterSpacing: 0.5 }}>
                    {String((index % total) + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 700 }}>
                    ♡ {liked.length}
                  </span>
                </div>
                <div style={{ height: 3, background: '#EEF1F7', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: total > 0 ? `${(((index % total) + 1) / total) * 100}%` : '0%',
                    background: 'linear-gradient(90deg, #2563EB, #60A5FA)',
                    transition: 'width 300ms',
                  }} />
                </div>
              </div>
            )}

            {/* Card stage */}
            <div style={{ flex: 1, position: 'relative', padding: '16px 18px 8px', minHeight: 0 }}>
              <div
                ref={stageRef}
                style={{
                  position: 'relative', width: '100%', height: '100%',
                  touchAction: 'none', userSelect: 'none',
                }}
              >
                {loading ? LoadingSkeleton
                  : error ? (
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 12,
                    }}>
                      <p style={{ fontSize: 13, color: '#7A8699' }}>{error}</p>
                      <button onClick={fetchCards} style={{
                        height: 40, padding: '0 20px', borderRadius: 999,
                        background: '#2563EB', color: '#fff', border: 'none',
                        fontWeight: 600, fontSize: 13, cursor: 'pointer',
                      }}>再読み込み</button>
                    </div>
                  )
                  : visible.map((bid, i) => (
                    <BidCard
                      key={`${bid.id}-${Math.floor(index / deck.length)}-${i}`}
                      bid={bid}
                      isTop={i === 0}
                      stackIndex={i}
                      kept={isKept(bid.id)}
                    />
                  ))
                }
              </div>
            </div>

            {/* Action buttons */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 18, padding: '14px 18px 18px', background: '#F4F6FB', flexShrink: 0,
            }}>
              <SwipeActionBtn kind="skip" onClick={() => commitFnRef.current(-1)} disabled={loading || deck.length === 0} />
              <SwipeActionBtn kind="keep" onClick={() => commitFnRef.current(1)} disabled={loading || deck.length === 0} big />
              <SwipeActionBtn kind="open" onClick={() => {
                const bid = deck.length > 0 ? deck[index % deck.length] : null
                if (bid) setOpenBid(bid)
              }} disabled={loading || deck.length === 0} />
            </div>
          </div>
        )}

        {/* ════ SAVED SCREEN ════ */}
        {tab === 'saved' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F4F6FB' }}>
            <TopBar
              title="キープ一覧"
              right={<IconBtn><IconSearch size={18} /></IconBtn>}
            />
            <div style={{ padding: '14px 18px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 12, color: '#4A5770', fontWeight: 500 }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: '#0B1D3A', fontSize: 14 }}>{liked.length}</span> 件の気になる案件
              </div>
              <div style={{ fontSize: 11, color: '#7A8699', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                締切が近い順 <span style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>›</span>
              </div>
            </div>

            <div className="sb-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 14px 14px' }}>
              {liked.length === 0 ? (
                <div style={{ marginTop: 80, textAlign: 'center', color: '#7A8699', fontSize: 13 }}>
                  <div style={{
                    width: 56, height: 56, margin: '0 auto 12px',
                    borderRadius: 16, background: '#EEF1F7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><IconBookmark size={24} sw={1.6} /></div>
                  まだキープした案件はありません。<br />スワイプで気になる案件を集めましょう。
                </div>
              ) : (
                liked.map(bid => (
                  <SavedRow
                    key={bid.id}
                    bid={bid}
                    onOpen={() => setOpenBid(bid)}
                    onRemove={() => removeSaved(bid.id)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* ════ SETTINGS SCREEN ════ */}
        {tab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F4F6FB' }}>
            <TopBar title="設定" />
            <div className="sb-scroll" style={{ flex: 1, overflowY: 'auto', padding: '14px 18px 14px' }}>

              {/* Genre toggles */}
              <SectionTitle>関心ジャンル</SectionTitle>
              <div style={{ background: '#fff', borderRadius: 14, padding: 14, border: '1px solid #EEF1F7' }}>
                {Object.entries(GENRES).map(([k, g], i, arr) => {
                  const on = prefs.genres[k] !== false
                  return (
                    <div key={k} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid #F1F4FB' : 'none',
                    }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: g.gradient }} />
                      <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#0B1D3A' }}>{g.label}</div>
                      <Toggle on={on} onToggle={() => setPrefs(p => ({
                        ...p, genres: { ...p.genres, [k]: !on },
                      }))} />
                    </div>
                  )
                })}
              </div>

              {/* Budget range (visual) */}
              <SectionTitle>予算レンジ（万円）</SectionTitle>
              <div style={{ background: '#fff', borderRadius: 14, padding: 16, border: '1px solid #EEF1F7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: '#7A8699', fontWeight: 600 }}>最低</span>
                  <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: '#0B1D3A' }}>
                    ¥{prefs.budgetMin}万 — ¥{prefs.budgetMax}万
                  </span>
                </div>
                <div style={{ position: 'relative', height: 6, background: '#EEF1F7', borderRadius: 3 }}>
                  <div style={{
                    position: 'absolute', height: '100%',
                    left: `${prefs.budgetMin / 20}%`,
                    right: `${100 - prefs.budgetMax / 20}%`,
                    background: 'linear-gradient(90deg, #2563EB, #60A5FA)', borderRadius: 3,
                  }} />
                  <div style={{
                    position: 'absolute', top: -6, width: 18, height: 18, borderRadius: 999,
                    background: '#fff', border: '2px solid #2563EB',
                    left: `calc(${prefs.budgetMin / 20}% - 9px)`,
                    boxShadow: '0 2px 6px rgba(37,99,235,0.3)',
                  }} />
                  <div style={{
                    position: 'absolute', top: -6, width: 18, height: 18, borderRadius: 999,
                    background: '#fff', border: '2px solid #2563EB',
                    left: `calc(${prefs.budgetMax / 20}% - 9px)`,
                    boxShadow: '0 2px 6px rgba(37,99,235,0.3)',
                  }} />
                </div>
              </div>

              {/* Notifications */}
              <SectionTitle>通知</SectionTitle>
              <div style={{ background: '#fff', borderRadius: 14, padding: 14, border: '1px solid #EEF1F7' }}>
                <SettingsRow label="新着案件アラート" sub="毎朝9:00に要約を配信">
                  <Toggle on={prefs.notifyDaily} onToggle={() => setPrefs(p => ({ ...p, notifyDaily: !p.notifyDaily }))} />
                </SettingsRow>
                <div style={{ height: 1, background: '#F1F4FB' }} />
                <SettingsRow label="締切リマインダー" sub="締切3日前・当日に通知">
                  <Toggle on={prefs.notifyDeadline} onToggle={() => setPrefs(p => ({ ...p, notifyDeadline: !p.notifyDeadline }))} />
                </SettingsRow>
                <div style={{ height: 1, background: '#F1F4FB' }} />
                <SettingsRow label="マッチ率90%以上のみ" sub="高スコア案件のみ表示">
                  <Toggle on={prefs.highMatchOnly} onToggle={() => setPrefs(p => ({ ...p, highMatchOnly: !p.highMatchOnly }))} />
                </SettingsRow>
              </div>

              <div style={{
                textAlign: 'center', padding: '22px 0 4px',
                fontFamily: MONO, fontSize: 10, color: '#94A0B4', letterSpacing: 1,
              }}>SWIPE BID · v1.2.0</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Navigation ── */}
      <BottomNav tab={tab} setTab={setTab} savedCount={liked.length} />

      {/* ── Detail Sheet overlay ── */}
      {openBid && (
        <DetailSheet
          bid={openBid}
          onClose={() => setOpenBid(null)}
          onKeep={() => keepBid(openBid)}
          isKept={isKept(openBid.id)}
        />
      )}
    </div>
  )
}
