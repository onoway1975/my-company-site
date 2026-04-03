'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

const RC = [
  { bg: '#4FC3F7', color: '#01579B' },
  { bg: '#C6F135', color: '#1a3300' },
  { bg: '#FF7043', color: '#4a1000' },
  { bg: '#CE93D8', color: '#4a0072' },
  { bg: '#80CBC4', color: '#004D40' },
  { bg: '#FFD54F', color: '#4a3300' },
  { bg: '#F48FB1', color: '#6a0030' },
  { bg: '#A5D6A7', color: '#1a4a1a' },
]

type P = {
  id: string; nickname: string; content: string; score: number
  rhyme_analysis: { rhyme_groups: { color_index: number; words: string[] }[]; comment: string } | null
  like_count: number; created_at: string
}

function getClientId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('dyb_client_id')
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('dyb_client_id', id) }
  return id
}

function RhymeContent({ content, groups }: { content: string; groups: { color_index: number; words: string[] }[] }) {
  if (!groups?.length) return <span>{content}</span>
  const marks: { s: number; e: number; ci: number }[] = []
  for (const g of groups) {
    for (const w of g.words) {
      let i = 0
      while (true) {
        const f = content.indexOf(w, i)
        if (f === -1) break
        marks.push({ s: f, e: f + w.length, ci: g.color_index })
        i = f + w.length
      }
    }
  }
  marks.sort((a, b) => a.s - b.s)
  const parts: React.ReactNode[] = []
  let cur = 0
  for (const m of marks) {
    if (m.s > cur) parts.push(<span key={cur}>{content.slice(cur, m.s)}</span>)
    const c = RC[m.ci % 8]
    parts.push(<span key={m.s} style={{ background: c.bg, color: c.color, borderRadius: 3, padding: '1px 5px', fontWeight: 700 }}>{content.slice(m.s, m.e)}</span>)
    cur = m.e
  }
  if (cur < content.length) parts.push(<span key={cur}>{content.slice(cur)}</span>)
  return <>{parts}</>
}


// 1文でも複数フレーズに分割するためのヘルパー
function splitPhrases(text: string): string[] {
  // 句読点・改行で分割
  const byPunct = text.split(/[。、\n]/).filter(Boolean)
  if (byPunct.length > 1) return byPunct.slice(0, 3)
  // スペースで分割
  const bySpace = text.split(/[ 　]+/).filter(Boolean)
  if (bySpace.length > 1) return bySpace.slice(0, 3)
  // 句読点もスペースもない長文 → 20文字前後で自然に3分割
  const len = text.length
  if (len <= 15) return [text]
  if (len <= 30) {
    const mid = Math.floor(len / 2)
    return [text.slice(0, mid), text.slice(mid)]
  }
  const third = Math.floor(len / 3)
  return [text.slice(0, third), text.slice(third, third * 2), text.slice(third * 2)]
}
function buildSegs(text: string, groups: { color_index: number; words: string[] }[]) {
  type Seg = { text: string; rhyme?: number }
  let segs: Seg[] = [{ text }]
  for (const group of groups) {
    for (const word of group.words) {
      if (!word) continue
      const next: Seg[] = []
      let found = false
      for (const seg of segs) {
        if (seg.rhyme !== undefined) { next.push(seg); continue }
        const parts = seg.text.split(word)
        if (parts.length > 1) {
          found = true
          parts.forEach((part, i) => {
            if (part) next.push({ text: part })
            if (i < parts.length - 1) next.push({ text: word, rhyme: group.color_index })
          })
        } else {
          next.push(seg)
        }
      }
      if (found) segs = next
    }
  }
  return segs
}

function BarModal({ item, rank, onClose, liked, onLike }: {
  item: P; rank: number; onClose: () => void; liked: boolean; onLike: () => void
}) {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [beat, setBeat] = useState(0)
  const phraseIdxRef = useRef(phraseIdx)
  phraseIdxRef.current = phraseIdx

  const groups = item.rhyme_analysis?.rhyme_groups ?? []
  const phrases = splitPhrases(item.content)
  const maxLen = Math.max(...phrases.map(p => p.length))
  const fontSize = maxLen >= 14 ? 'clamp(22px,3.5vw,48px)' : maxLen >= 10 ? 'clamp(26px,4vw,56px)' : 'clamp(32px,5vw,68px)'

  useEffect(() => {
    setPhraseIdx(0); setBeat(0)
    let n = 0
    const iv = setInterval(() => {
      n++; setBeat(n % 4)
      const next = phraseIdxRef.current + 1
      if (next < phrases.length) setPhraseIdx(next)
      else if (n % 4 === 0) setPhraseIdx(0)
    }, 60000 / 90)
    return () => clearInterval(iv)
  }, [item.id])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const visible = phrases.slice(0, phraseIdx + 1)

  return (
    <div className="mo-ov" onClick={onClose}>
      <div className="mo-in" onClick={e => e.stopPropagation()}>
        <div className="mo-hd">
          <div className="mo-np">— NOW PLAYING —</div>
          <div className="mo-nk">@{item.nickname}</div>
          <button className="mo-x" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="mo-ph">
          {visible.map((ph, i) => (
            <div key={i} className={`mo-p${i === phraseIdx ? ' nw' : ''}`}>
              <span className="mo-pt" style={{ fontSize, display: 'inline' }}>
                {buildSegs(ph, groups).map((seg, j) =>
                  seg.rhyme !== undefined
                    ? <span key={j} className="mo-pr" style={{ background: RC[seg.rhyme % 8].bg, color: RC[seg.rhyme % 8].color, fontSize }}>{seg.text}</span>
                    : <span key={j}>{seg.text}</span>
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="mo-ft">
          <div><div className="mo-sc">{item.score}</div><div className="mo-sl">POINTS</div></div>
          <div className="mo-vd"/>
          <div className="mo-rk">#{rank}</div>
          <button className={`mo-lk${liked ? ' liked' : ''}`} onClick={e => { e.stopPropagation(); onLike() }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? 'rgba(255,100,100,0.9)' : 'none'} stroke={liked ? 'rgba(255,100,100,0.9)' : 'rgba(255,255,255,0.5)'} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <span>{item.like_count + (liked ? 1 : 0)}</span>
          </button>
          <div className="mo-ds">
            {[0,1,2,3].map(i => <div key={i} className={`mo-d${beat === i ? ' act' : ''}`}/>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DYBRankingPage() {
  const [items, setItems] = useState<P[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<'top'|'new'>('top')
  const [search, setSearch] = useState('')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [footerVisible, setFooterVisible] = useState(false)
  const [selected, setSelected] = useState<{ item: P; rank: number } | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/dyb/ranking?sort=${sort}`)
      .then(r => r.json())
      .then(({ data }) => { setItems(data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [sort])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dyb_liked')
      if (saved) setLikedIds(new Set(JSON.parse(saved)))
    } catch {}
  }, [])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const ob = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting), { threshold: 0.01 })
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  const closeModal = useCallback(() => setSelected(null), [])

  const handleLike = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const wasLiked = likedIds.has(id)
    setLikedIds(prev => {
      const next = new Set(prev)
      wasLiked ? next.delete(id) : next.add(id)
      localStorage.setItem('dyb_liked', JSON.stringify([...next]))
      return next
    })
    setItems(prev => prev.map(p => p.id === id ? { ...p, like_count: p.like_count + (wasLiked ? -1 : 1) } : p))
    try {
      await fetch('/api/dyb/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ punchline_id: id, client_id: getClientId() }),
      })
    } catch {}
  }

  const filtered = items.filter(item => !search || item.content.includes(search) || item.nickname.toLowerCase().includes(search.toLowerCase()))

  const CtaBlock = () => (
    <div className="rk-cta">
      <div className="rk-cta-rw">
        <button className="rk-make" onClick={() => window.location.href='/dyb/'}>MAKE YOUR BARS?<span style={{fontSize:20}}>→</span></button>
        <Link href="/dyb/" className="rk-back">← TOP</Link>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,400;1,700&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        .rk-root{font-family:'Noto Sans JP',sans-serif;color:#fff;background:#0a0a0a}
        .rk-wrap{position:relative;background:#0a0a0a;overflow:hidden;padding-bottom:110px}
        .rk-wrap.fv{padding-bottom:0}
        @keyframes g1{0%,100%{transform:translate(0%,0%) scale(1)}33%{transform:translate(20%,-15%) scale(1.1)}66%{transform:translate(-15%,20%) scale(0.9)}}
        @keyframes g2{0%,100%{transform:translate(0%,0%) scale(1)}33%{transform:translate(-25%,15%) scale(1.08)}66%{transform:translate(15%,-20%) scale(1.12)}}
        @keyframes g3{0%,100%{transform:translate(0%,0%) scale(1)}50%{transform:translate(-20%,-20%) scale(0.88)}}
        .grad-bg{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
        .grad-bg::before,.grad-bg::after{content:'';position:absolute;border-radius:50%;filter:blur(80px)}
        .grad-bg::before{width:70%;height:70%;top:10%;left:5%;background:radial-gradient(circle,rgba(20,0,120,0.9) 0%,rgba(60,0,100,0.6) 40%,transparent 70%);animation:g1 8s ease-in-out infinite}
        .grad-bg::after{width:65%;height:65%;top:10%;left:30%;background:radial-gradient(circle,rgba(5,0,140,0.85) 0%,rgba(30,0,110,0.5) 40%,transparent 70%);animation:g2 10s ease-in-out infinite}
        .grad-orb3{position:absolute;width:55%;height:55%;top:20%;right:-5%;border-radius:50%;background:radial-gradient(circle,rgba(30,0,100,0.75) 0%,rgba(15,0,80,0.4) 40%,transparent 70%);filter:blur(80px);animation:g3 12s ease-in-out infinite;pointer-events:none;z-index:0}
        .grad-noise{display:none}
        .rk-bg{position:absolute;inset:-50%;pointer-events:none;z-index:0;opacity:0.05;background-image:url(/dyb/logo.png);background-repeat:repeat;background-size:320px auto;transform:rotate(45deg)}
        .rk-con{position:relative;z-index:1}
        .rk-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.15);position:sticky;top:0;background:rgba(10,10,10,0.95);backdrop-filter:blur(8px);z-index:50}
        @media(min-width:900px){.rk-nav{padding:16px 60px}}
        .rk-nav-lo{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:22px;color:#ffffff;letter-spacing:4px;line-height:1}
        .rk-nav-sub{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-size:9px;color:rgba(255,255,255,0.45);letter-spacing:3px;font-weight:400;margin-top:3px}
        .rk-nav-r{display:flex;align-items:center;gap:28px}
        .rk-nav-lk{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:11px;color:rgba(255,255,255,0.45);text-decoration:none;letter-spacing:2px;transition:color 0.15s}
        .rk-nav-lk:hover,.rk-nav-lk.act{color:#ffffff}
        .rk-body{padding:40px 24px 24px}
        @media(min-width:900px){.rk-body{padding:48px 60px 32px}}
        .rk-top{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:16px}
        .rk-ttl{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:clamp(36px,5vw,64px);color:#ffffff;letter-spacing:4px;line-height:1}
        .rk-cnt{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:2px;font-weight:400;margin-top:6px}
        .rk-ctrl{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .rk-tabs{display:flex;gap:6px}
        .rk-tab{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:10px;padding:6px 12px;border:1px solid rgba(255,255,255,0.3);border-radius:2px;color:rgba(255,255,255,0.4);cursor:pointer;letter-spacing:1px;background:transparent;transition:all 0.15s}
        .rk-tab.act{background:#ffffff;color:#0a0a0a;border-color:#ffffff}
        .rk-srch{padding:9px 14px;width:220px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);border-radius:4px;color:#fff;font-family:'Noto Sans JP',sans-serif;font-size:13px;outline:none;transition:border-color 0.15s}
        .rk-srch:focus{border-color:rgba(255,255,255,0.5)}
        .rk-srch::placeholder{color:rgba(255,255,255,0.22)}
        @keyframes rkFadeIn{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
        .rk-card{border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:18px 20px;margin-bottom:12px;background:rgba(255,255,255,0.03);transition:border-color 0.15s,background 0.15s;cursor:pointer;opacity:0;animation:rkFadeIn 0.4s ease forwards}
        .rk-card:hover{border-color:rgba(255,255,255,0.35);background:rgba(255,255,255,0.04)}
        .rk-card.r1{border-color:rgba(255,255,255,0.4);background:rgba(255,255,255,0.04)}
        .rk-card.r3{border-color:rgba(255,255,255,0.18)}
        .rk-ci{display:grid;grid-template-columns:44px 1fr auto;gap:14px;align-items:start}
        @media(max-width:600px){.rk-ci{grid-template-columns:36px 1fr auto}.rk-sc-big{font-size:18px}.rk-sc-unit{font-size:8px}}
        .rk-rk{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:26px;color:rgba(255,255,255,0.15);line-height:1;padding-top:3px}
        .rk-card.r1 .rk-rk{color:rgba(255,255,255,0.5);font-size:30px}
        .rk-card.r3 .rk-rk{color:rgba(255,255,255,0.25)}
        .rk-cc{font-family:'Noto Sans JP',sans-serif;font-weight:900;font-size:clamp(15px,2vw,19px);color:#fff;line-height:1.7;margin-bottom:8px}
        .rk-cf{display:flex;align-items:center;gap:10px;margin-top:6px}
        .rk-nk{font-family:'Noto Sans JP',sans-serif;font-size:11px;color:rgba(255,255,255,0.3);font-weight:400}
        .rk-lk{display:flex;align-items:center;gap:5px;background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:4px 10px;cursor:pointer;transition:border-color 0.15s,background 0.15s}
        .rk-lk.liked{border-color:rgba(255,100,100,0.6);background:rgba(255,100,100,0.08)}
        .rk-lk:hover{border-color:rgba(255,100,100,0.4)}
        .rk-lk span{font-family:'Noto Sans JP',sans-serif;font-size:10px;color:rgba(255,255,255,0.35);font-weight:400}
        .rk-sc-col{text-align:right;padding-top:2px}
        .rk-sc-big{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:26px;color:#ffffff;line-height:1}
        .rk-sc-unit{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-size:9px;color:rgba(255,255,255,0.5);font-weight:400;display:block;letter-spacing:1px;margin-top:2px}
        .rk-empty{padding:60px 0;text-align:center;font-family:'Barlow Condensed',sans-serif;font-style:italic;font-size:12px;color:rgba(255,255,255,0.2);letter-spacing:3px}
        .rk-cta{background:#0a0a0a}
        .rk-cta-rw{display:flex;justify-content:center;gap:12px;padding:12px 24px 20px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,0.07)}
        @media(min-width:900px){.rk-cta-rw{padding:12px 60px 24px}}
        .rk-make{flex:1;max-width:420px;min-width:180px;padding:15px 24px;background:#ffffff;color:#0a0a0a;border:none;border-radius:4px;font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:15px;letter-spacing:3px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;white-space:nowrap;transition:background 0.15s}
        .rk-make:hover{background:#e0e0e0}
        .rk-back{padding:15px 24px;background:transparent;color:#ffffff;border:1px solid rgba(255,255,255,0.5);border-radius:4px;font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:15px;letter-spacing:3px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:border-color 0.15s,background 0.15s;text-decoration:none;white-space:nowrap}
        .rk-back:hover{border-color:#ffffff;background:rgba(255,255,255,0.06)}
        .rk-cta-fx{position:fixed;bottom:0;left:0;right:0;z-index:100}
        @keyframes moIn{0%{opacity:0}100%{opacity:1}}
        @keyframes moSl{0%{opacity:0;transform:scale(0.96) translateY(12px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        .mo-ov{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;padding:24px;animation:moIn 0.2s ease forwards;backdrop-filter:blur(4px)}
        .mo-in{position:relative;width:100%;max-width:840px;height:520px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.25);border-radius:8px;padding:28px 32px;animation:moSl 0.25s cubic-bezier(.2,.8,.3,1) forwards;overflow:hidden;display:flex;flex-direction:column}
        .mo-hd{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.07);flex-shrink:0;gap:8px}
        .mo-np{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-size:9px;color:rgba(255,255,255,0.6);letter-spacing:3px;font-weight:400;justify-self:start}
        .mo-nk{font-family:'Noto Sans JP',sans-serif;font-size:13px;color:rgba(255,255,255,0.45);font-weight:400;justify-self:center;white-space:nowrap}
        .mo-x{justify-self:end;width:32px;height:32px;border:1px solid rgba(255,255,255,0.15);border-radius:50%;background:transparent;color:rgba(255,255,255,0.5);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color 0.15s,color 0.15s}
        .mo-x:hover{border-color:rgba(255,255,255,0.5);color:#ffffff}
        .mo-ph{flex:1;display:flex;flex-direction:column;justify-content:center;gap:8px;overflow:hidden;padding:12px 0}
        .mo-p{line-height:1.1;flex-shrink:0}
        @keyframes moPhIn{0%{opacity:0;transform:translateY(14px) scale(0.96)}55%{opacity:1;transform:translateY(-3px) scale(1.02)}100%{opacity:1;transform:translateY(0) scale(1)}}
        .mo-p.nw{animation:moPhIn 0.22s cubic-bezier(.2,.8,.3,1) forwards}
        .mo-pt{font-family:'Noto Sans JP',sans-serif;font-weight:400;color:#fff;line-height:1.2;letter-spacing:-0.5px;display:inline}
        .mo-pr{display:inline-block;border-radius:0;padding:0.05em 6px;font-family:'Noto Sans JP',sans-serif;font-weight:400;line-height:1;letter-spacing:-0.5px;vertical-align:baseline}
        .mo-ft{display:flex;align-items:center;gap:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.07);flex-shrink:0}
        .mo-sc{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:clamp(24px,3vw,38px);color:#ffffff;line-height:1}
        .mo-sl{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-size:9px;color:rgba(255,255,255,0.4);letter-spacing:2px;font-weight:400}
        .mo-vd{width:1px;height:28px;background:rgba(255,255,255,0.1);flex-shrink:0}
        .mo-rk{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:14px;color:rgba(255,255,255,0.6);letter-spacing:2px}
        .mo-lk{display:flex;align-items:center;gap:6px;background:transparent;border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:6px 12px;cursor:pointer;transition:border-color 0.15s,background 0.15s}
        .mo-lk.liked{border-color:rgba(255,100,100,0.6);background:rgba(255,100,100,0.08)}
        .mo-lk span{font-family:'Noto Sans JP',sans-serif;font-size:12px;color:rgba(255,255,255,0.5)}
        .mo-ds{display:flex;gap:8px;align-items:center;margin-left:auto}
        .mo-d{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.2);transition:background 0.08s,transform 0.08s}
        .mo-d.act{background:#ffffff;transform:scale(1.5)}
      `}</style>

      <div className="rk-root">
        <div className={`rk-wrap${footerVisible ? ' fv' : ''}`}>
          <div className="grad-bg" aria-hidden><div className="grad-orb3"/></div>
          <div className="grad-noise" aria-hidden/>
          <div className="rk-bg" aria-hidden/>
          <div className="rk-con">
            <nav className="rk-nav">
              <div>
                <img src="/dyb/logo.png" alt="D.Y.B" style={{height:32,width:"auto"}}/>
                
              </div>
              <div className="rk-nav-r">
                <Link href="/dyb/" className="rk-nav-lk">TOP</Link>
                <Link href="/dyb/ranking/" className="rk-nav-lk act">RANKING</Link>
              </div>
            </nav>
            <div className="rk-body">
              <div className="rk-top">
                <div>
                  <div className="rk-ttl">RANKING</div>
                  <div className="rk-cnt">{filtered.length} BARS DROPPED</div>
                </div>
                <div className="rk-ctrl">
                  <div className="rk-tabs">
                    <button className={`rk-tab${sort==='top'?' act':''}`} onClick={() => setSort('top')}>TOP</button>
                    <button className={`rk-tab${sort==='new'?' act':''}`} onClick={() => setSort('new')}>NEW</button>
                  </div>
                  <input className="rk-srch" placeholder="SEARCH BARS..." type="text" value={search} onChange={e => setSearch(e.target.value)}/>
                </div>
              </div>
              {loading ? (
                <div className="rk-empty">LOADING...</div>
              ) : filtered.length === 0 ? (
                <div className="rk-empty">NO BARS YET. BE THE FIRST!</div>
              ) : (
                filtered.map((item, idx) => {
                  const rank = idx + 1
                  const liked = likedIds.has(item.id)
                  return (
                    <div key={item.id} className={`rk-card${rank===1?' r1':rank<=3?' r3':''}`} style={{animationDelay:`${idx * 60}ms`}} onClick={() => setSelected({ item, rank })}>
                      <div className="rk-ci">
                        <div className="rk-rk">{rank}</div>
                        <div>
                          <div className="rk-cc">
                            <RhymeContent content={item.content} groups={item.rhyme_analysis?.rhyme_groups ?? []}/>
                          </div>
                          <div className="rk-cf">
                            <button className={`rk-lk${liked?' liked':''}`} onClick={e => handleLike(item.id, e)}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill={liked?'rgba(255,100,100,0.8)':'none'} stroke={liked?'rgba(255,100,100,0.8)':'rgba(255,255,255,0.4)'} strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                              </svg>
                              <span>{item.like_count}</span>
                            </button>
                            <span className="rk-nk">@{item.nickname}</span>
                          </div>
                        </div>
                        <div className="rk-sc-col">
                          <div className="rk-sc-big">{item.score}</div>
                          <span className="rk-sc-unit">POINTS</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={sentinelRef} style={{height:1}}/>
            </div>
            {footerVisible && <CtaBlock/>}
          </div>
        </div>
        {!footerVisible && <div className="rk-cta-fx"><CtaBlock/></div>}
      </div>

      {selected && (
        <BarModal
          item={selected.item}
          rank={selected.rank}
          onClose={closeModal}
          liked={likedIds.has(selected.item.id)}
          onLike={() => handleLike(selected.item.id)}
        />
      )}
    </>
  )
}
