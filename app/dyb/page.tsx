'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

const RHYME_COLORS = [
  { bg: '#4FC3F7', color: '#01579B' },
  { bg: '#C6F135', color: '#1a3300' },
  { bg: '#FF7043', color: '#4a1000' },
  { bg: '#CE93D8', color: '#4a0072' },
  { bg: '#80CBC4', color: '#004D40' },
  { bg: '#FFD54F', color: '#4a3300' },
  { bg: '#F48FB1', color: '#6a0030' },
  { bg: '#A5D6A7', color: '#1a4a1a' },
]

type Punchline = {
  id: string
  nickname: string
  content: string
  score: number
  rhyme_analysis: {
    rhyme_groups: { color_index: number; words: string[] }[]
    comment: string
  } | null
  like_count: number
  created_at: string
}

type Segment = { text: string; rhyme?: number }
type Phrase = { segments: Segment[] }

type DisplayBar = {
  phrases: Phrase[]
  score: number
  nick: string
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
function buildSegments(text: string, groups: { color_index: number; words: string[] }[]): Segment[] {
  let segs: Segment[] = [{ text }]
  for (const group of groups) {
    for (const word of group.words) {
      if (!word) continue
      const next: Segment[] = []
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

function buildDisplayBar(p: Punchline): DisplayBar {
  const groups = p.rhyme_analysis?.rhyme_groups ?? []
  const rawLines = splitPhrases(p.content)
  const phrases: Phrase[] = rawLines.map(line => ({ segments: buildSegments(line, groups) }))
  return { phrases, score: p.score, nick: p.nickname }
}

function PostModal({ onClose }: { onClose: () => void }) {
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ analysis: { comment: string; total_score: number }; data: Punchline } | null>(null)
  const [ngWords, setNgWords] = useState<string[]>([])

  useEffect(() => {
    fetch('/dyb/ng_words.json')
      .then(r => r.json())
      .then(setNgWords)
      .catch(() => {})
  }, [])

  const NG_WHITELIST = [
    // 薬物系（ラップ頻出）
    '大麻', '麻薬', 'マリファナ', 'ガンジャ', 'weed', 'herb', 'blunt', 'smoke',
    // 一般的な日本語罵倒・スラング（表現として使われる）
    'クソ', 'くそ', 'shit', 'damn', 'hell', 'ass', 'bastard', 'bitch',
    // ラップ用語・スラング
    'kill', 'murder', 'beef', 'diss', 'fuck', 'fucker', 'fucking',
    'nigga', 'gangsta', 'hustle', 'grind', 'trap', 'plug',
    // 日本語スラング
    'ヤバい', 'やばい', 'やばい', 'ヤバ', 'ぶっ殺', 'ぶち殺', 'ぶっ飛ばす',
    // その他ラップ頻出
    'sex', 'sexy', 'drug', 'drugs', 'money', 'cash', 'gun', 'gang',
    'ビッチ', 'クズ', 'カス', 'バカ', '馬鹿', 'アホ',
  ]

  const checkNgWords = (text: string): string | null => {
    // ひらがな→カタカナ変換
    const toKatakana = (str: string) =>
      str.replace(/[\u3041-\u3096]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60))
    const lower = text.toLowerCase()
    const kata = toKatakana(lower)
    for (const w of ngWords) {
      const wLower = w.toLowerCase()
      const wKata = toKatakana(wLower)
      // ホワイトリストにある単語はスキップ
      if (NG_WHITELIST.some(wl => wl.toLowerCase() === wLower)) continue
      if (lower.includes(wLower) || kata.includes(wKata) || lower.includes(wKata) || kata.includes(wLower)) return w
    }
    return null
  }

  const handleSubmit = async () => {
    if (!nickname.trim() || !content.trim()) { setError('ニックネームとパンチラインを入力してください'); return }
    const ngHit = checkNgWords(content.trim())
    if (ngHit) { setError('不適切な表現が含まれています。内容を変更してください。'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/dyb/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim(), content: content.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました')
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-box" onClick={e => e.stopPropagation()}>
        {!result ? (
          <>
            <div className="pm-hd">
              <div className="pm-ttl">DROP YOUR BARS</div>
              <button className="pm-x" onClick={onClose}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="pm-bd">
              <div className="pm-fld">
                <label className="pm-lbl">NICKNAME</label>
                <input className="pm-inp" type="text" placeholder="YOUR NAME" value={nickname} onChange={e => setNickname(e.target.value)} maxLength={20}/>
              </div>
              <div className="pm-fld">
                <label className="pm-lbl" style={{display:'flex',justifyContent:'space-between'}}>
                  BARS<span style={{color:'rgba(255,255,255,0.3)'}}>{content.length}/100</span>
                </label>
                <textarea className="pm-ta" placeholder="パンチラインを入力（100文字以内）" value={content} onChange={e => setContent(e.target.value)} maxLength={100} rows={4}/>
              </div>
              {error && <div className="pm-err">{error}</div>}
            </div>
            <div className="pm-ft">
              <button className="pm-sub" onClick={handleSubmit} disabled={loading}>
                {loading ? <span className="pm-ld"><span className="pm-sp"/>ANALYZING...</span> : 'DROP IT →'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="pm-hd">
              <div className="pm-ttl">RESULT</div>
              <button className="pm-x" onClick={onClose}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="pm-res">
              <div className="pm-sc">{result.analysis.total_score}</div>
              <div className="pm-sc-u">POINTS</div>
              <div className="pm-cmt">{result.analysis.comment}</div>
              <div className="pm-bars">{result.data.content}</div>
            </div>
            <div className="pm-ft" style={{gap:10}}>
              <Link href="/dyb/ranking/" className="pm-sub" onClick={onClose}>RANKING を見る →</Link>
              <button className="pm-ag" onClick={() => setResult(null)}>もう一度</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function DYBPage() {
  const BPM = 90
  const msPerBeat = 60000 / BPM
  const [bars, setBars] = useState<DisplayBar[]>([])
  const [barIdx, setBarIdx] = useState(0)
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [beat, setBeat] = useState(0)
  const [muted, setMuted] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [pageHeight, setPageHeight] = useState('100vh')
  const barIdxRef = useRef(barIdx)
  const phraseIdxRef = useRef(phraseIdx)
  const barsRef = useRef(bars)
  const navRef = useRef<HTMLElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  barIdxRef.current = barIdx
  phraseIdxRef.current = phraseIdx
  barsRef.current = bars

  useEffect(() => {
    fetch('/api/dyb/ranking?sort=top')
      .then(r => r.json())
      .then(({ data }) => { if (data?.length > 0) setBars(data.map(buildDisplayBar)) })
      .catch(console.error)
  }, [])

  useEffect(() => {
    const calc = () => {
      const nav = navRef.current
      if (!nav) return
      const { top, height } = nav.getBoundingClientRect()
      setPageHeight(`${window.innerHeight - top - height}px`)
    }
    calc()
    window.addEventListener('resize', calc)
    window.addEventListener('scroll', calc)
    return () => { window.removeEventListener('resize', calc); window.removeEventListener('scroll', calc) }
  }, [])

  useEffect(() => {
    let n = 0
    const iv = setInterval(() => {
      n++
      setBeat(n % 4)
      const bs = barsRef.current
      if (!bs.length) return
      const bar = bs[barIdxRef.current % bs.length]
      const next = phraseIdxRef.current + 1
      if (next >= bar.phrases.length) {
        if (n % 4 === 0) { setBarIdx(b => b + 1); setPhraseIdx(0) }
      } else {
        setPhraseIdx(next)
      }
    }, msPerBeat)
    return () => clearInterval(iv)
  }, [])

  // BGM
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/dyb/bgm')
        if (!res.ok) return
        const { previewUrl } = await res.json()
        if (cancelled || !previewUrl) return
        const audio = new Audio(previewUrl)
        audio.loop = true
        audio.volume = 0.35
        audioRef.current = audio
        if (!muted) audio.play().catch(() => {})
      } catch {}
    }
    load()
    return () => {
      cancelled = true
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // ミュート連動
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
  }, [muted])

  const closeModal = useCallback(() => setShowModal(false), [])
  const cur = bars.length > 0 ? bars[barIdx % bars.length] : null
  const visible = cur ? cur.phrases.slice(0, phraseIdx + 1) : []

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,400;1,700&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        .dr{font-family:'Noto Sans JP',sans-serif;background:#0a0a0a;color:#fff}
        .dn{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.15);position:sticky;top:0;background:rgba(10,10,10,0.95);backdrop-filter:blur(8px);z-index:50}
        @media(min-width:900px){.dn{padding:16px 60px}}
        .dn-lo{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:22px;color:#ffffff;letter-spacing:4px;line-height:1}
        .dn-sub{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-size:9px;color:rgba(255,255,255,0.45);letter-spacing:3px;font-weight:400;margin-top:3px}
        .dn-r{display:flex;align-items:center;gap:28px}
        .dn-lk{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:11px;color:rgba(255,255,255,0.45);text-decoration:none;letter-spacing:2px;transition:color 0.15s}
        .dn-lk:hover,.dn-lk.act{color:#ffffff}
        .dn-mt{width:32px;height:32px;border:1px solid rgba(255,255,255,0.3);border-radius:50%;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .dp{display:flex;flex-direction:column;background:#0a0a0a;position:relative;overflow:hidden}
        @keyframes g1{0%,100%{transform:translate(0%,0%) scale(1)}33%{transform:translate(20%,-15%) scale(1.1)}66%{transform:translate(-15%,20%) scale(0.9)}}
        @keyframes g2{0%,100%{transform:translate(0%,0%) scale(1)}33%{transform:translate(-25%,15%) scale(1.08)}66%{transform:translate(15%,-20%) scale(1.12)}}
        @keyframes g3{0%,100%{transform:translate(0%,0%) scale(1)}50%{transform:translate(-20%,-20%) scale(0.88)}}
        .grad-bg{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
        .grad-bg::before,.grad-bg::after{content:'';position:absolute;border-radius:50%;filter:blur(80px)}
        .grad-bg::before{width:70%;height:70%;top:10%;left:5%;background:radial-gradient(circle,rgba(20,0,120,0.9) 0%,rgba(60,0,100,0.6) 40%,transparent 70%);animation:g1 8s ease-in-out infinite}
        .grad-bg::after{width:65%;height:65%;top:10%;left:30%;background:radial-gradient(circle,rgba(5,0,140,0.85) 0%,rgba(30,0,110,0.5) 40%,transparent 70%);animation:g2 10s ease-in-out infinite}
        .grad-orb3{position:absolute;width:55%;height:55%;top:20%;right:-5%;border-radius:50%;background:radial-gradient(circle,rgba(30,0,100,0.75) 0%,rgba(15,0,80,0.4) 40%,transparent 70%);filter:blur(80px);animation:g3 12s ease-in-out infinite;pointer-events:none;z-index:0}
        .grad-noise{display:none}
        .dbg{position:absolute;inset:-50%;pointer-events:none;z-index:0;opacity:0.05;background-image:url(/dyb/logo.png);background-repeat:repeat;background-size:320px auto;transform:rotate(45deg)}
        .dh{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;padding:0 24px;overflow:hidden;min-height:0}
        @media(min-width:900px){.dh{padding:0 60px}}
        .dh-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.07);flex-shrink:0}
        .dh-np{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-size:9px;color:rgba(255,255,255,0.6);letter-spacing:3px;font-weight:400}
        .dh-nk{font-family:'Noto Sans JP',sans-serif;font-size:12px;color:rgba(255,255,255,0.35);font-weight:400}
        .dh-ph{flex:1;display:flex;flex-direction:column;justify-content:center;gap:6px;overflow:hidden;min-height:0;padding:12px 0}
        @keyframes phIn{0%{opacity:0;transform:translateY(14px) scale(0.96)}55%{opacity:1;transform:translateY(-3px) scale(1.02)}100%{opacity:1;transform:translateY(0) scale(1)}}
        .dh-p{line-height:1.1;flex-shrink:0}
        .dh-p.nw{animation:phIn 0.22s cubic-bezier(.2,.8,.3,1) forwards}
        .dh-pt{font-family:'Noto Sans JP',sans-serif;font-weight:400;font-size:clamp(22px,min(6.75vw,9.9vh),108px);color:#fff;line-height:1.2;letter-spacing:-0.5px;display:inline}
        .dh-pr{display:inline-block;border-radius:0;padding:0.05em 6px;font-family:'Noto Sans JP',sans-serif;font-weight:400;font-size:clamp(22px,min(6.75vw,9.9vh),108px);line-height:1;letter-spacing:-0.5px;vertical-align:baseline}
        .dh-ld{position:relative;z-index:1;flex:1;display:flex;align-items:center;justify-content:center}
        .dh-lt{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:4px;animation:pls 1.5s ease-in-out infinite}
        @keyframes pls{0%,100%{opacity:0.4}50%{opacity:1}}
        .dc{position:relative;z-index:1;flex-shrink:0;background:#0a0a0a}
        .dc-mt{display:flex;align-items:center;gap:16px;padding:10px 24px 0;border-top:1px solid rgba(255,255,255,0.07)}
        @media(min-width:900px){.dc-mt{padding:10px 60px 0;gap:20px}}
        .dc-sc{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:clamp(20px,2.5vw,36px);color:#ffffff;line-height:1}
        .dc-sl{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-size:9px;color:rgba(255,255,255,0.4);letter-spacing:2px;font-weight:400}
        .dc-vd{width:1px;height:28px;background:rgba(255,255,255,0.1);flex-shrink:0}
        .dc-nk{font-family:'Noto Sans JP',sans-serif;font-size:12px;color:rgba(255,255,255,0.35);font-weight:400}
        .dc-ds{display:flex;gap:7px;align-items:center;margin-left:auto}
        .dc-d{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.2);transition:background 0.08s,transform 0.08s}
        .dc-d.act{background:#ffffff;transform:scale(1.5)}
        .dc-rw{display:flex;justify-content:center;gap:12px;padding:10px 24px 20px;flex-wrap:wrap}
        @media(min-width:900px){.dc-rw{padding:10px 60px 24px}}
        .dc-mb{flex:1;max-width:420px;min-width:180px;padding:14px 24px;background:#ffffff;color:#0a0a0a;border:none;border-radius:4px;font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:15px;letter-spacing:3px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;transition:transform 0.1s,background 0.1s;white-space:nowrap}
        .dc-mb:hover{background:#e0e0e0}
        @media(max-width:480px){.dc-mb{font-size:12px;letter-spacing:1px;padding:12px 16px;gap:8px}.dc-rb{font-size:12px;letter-spacing:1px;padding:12px 16px;gap:8px}}
        .dc-rb{flex:1;max-width:260px;min-width:130px;padding:14px 24px;background:transparent;color:#ffffff;border:1px solid rgba(255,255,255,0.5);border-radius:4px;font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:15px;letter-spacing:3px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;transition:border-color 0.15s,background 0.15s;text-decoration:none;white-space:nowrap}
        .dc-rb:hover{border-color:#ffffff;background:rgba(255,255,255,0.06)}
        @keyframes pmIn{0%{opacity:0}100%{opacity:1}}
        @keyframes pmSl{0%{opacity:0;transform:scale(0.96) translateY(12px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        .pm-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;padding:24px;animation:pmIn 0.2s ease forwards;backdrop-filter:blur(4px)}
        .pm-box{width:100%;max-width:560px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.25);border-radius:8px;animation:pmSl 0.25s cubic-bezier(.2,.8,.3,1) forwards;overflow:hidden}
        .pm-hd{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,0.07)}
        .pm-ttl{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:13px;color:#ffffff;letter-spacing:3px}
        .pm-x{width:32px;height:32px;border:1px solid rgba(255,255,255,0.15);border-radius:50%;background:transparent;color:rgba(255,255,255,0.5);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color 0.15s,color 0.15s}
        .pm-x:hover{border-color:rgba(255,255,255,0.5);color:#ffffff}
        .pm-bd{padding:20px 24px;display:flex;flex-direction:column;gap:16px}
        .pm-fld{display:flex;flex-direction:column;gap:6px}
        .pm-lbl{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-size:9px;color:rgba(255,255,255,0.6);letter-spacing:3px;font-weight:400}
        .pm-inp,.pm-ta{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);border-radius:4px;color:#fff;font-family:'Noto Sans JP',sans-serif;font-size:15px;padding:12px 14px;outline:none;transition:border-color 0.15s;resize:none;width:100%}
        .pm-inp:focus,.pm-ta:focus{border-color:rgba(255,255,255,0.5)}
        .pm-inp::placeholder,.pm-ta::placeholder{color:rgba(255,255,255,0.2)}
        .pm-err{font-family:'Noto Sans JP',sans-serif;font-size:12px;color:#FF7043}
        .pm-ft{padding:0 24px 24px;display:flex;gap:10px;flex-wrap:wrap}
        .pm-sub{flex:1;padding:16px 24px;background:#ffffff;color:#0a0a0a;border:none;border-radius:4px;font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:15px;letter-spacing:3px;cursor:pointer;transition:background 0.15s;text-decoration:none;display:flex;align-items:center;justify-content:center}
        .pm-sub:hover:not(:disabled){background:#e0e0e0}
        .pm-sub:disabled{opacity:0.6;cursor:not-allowed}
        .pm-ld{display:flex;align-items:center;gap:10px}
        @keyframes sp{to{transform:rotate(360deg)}}
        .pm-sp{width:16px;height:16px;border:2px solid rgba(0,0,0,0.2);border-top-color:#0a0a0a;border-radius:50%;animation:sp 0.7s linear infinite}
        .pm-ag{padding:16px 20px;background:transparent;color:rgba(255,255,255,0.4);border:1px solid rgba(255,255,255,0.15);border-radius:4px;font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:14px;letter-spacing:2px;cursor:pointer;transition:border-color 0.15s}
        .pm-ag:hover{border-color:rgba(255,255,255,0.4);color:rgba(255,255,255,0.7)}
        .pm-res{padding:32px 24px 20px;text-align:center}
        .pm-sc{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-weight:700;font-size:80px;color:#ffffff;line-height:1}
        .pm-sc-u{font-family:'Barlow Condensed',sans-serif;font-style:italic;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:3px;margin-top:4px}
        .pm-cmt{font-family:'Noto Sans JP',sans-serif;font-size:14px;color:rgba(255,255,255,0.7);margin-top:16px}
        .pm-bars{font-family:'Noto Sans JP',sans-serif;font-weight:700;font-size:18px;color:#fff;margin-top:12px;line-height:1.5}
      `}</style>

      <div className="dr">
        <nav className="dn" ref={navRef}>
          <div>
            <img src="/dyb/logo.png" alt="D.Y.B" style={{height:32,width:"auto"}}/>
            
          </div>
          <div className="dn-r">
            <Link href="/dyb/" className="dn-lk act">TOP</Link>
            <Link href="/dyb/ranking/" className="dn-lk">RANKING</Link>
            <button className="dn-mt" onClick={() => setMuted(m => !m)} style={{opacity:muted?0.5:1}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                {!muted
                  ? <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
                  : <><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></>}
              </svg>
            </button>
          </div>
        </nav>

        <div className="dp" style={{height:pageHeight}}>
          <div className="grad-bg" aria-hidden><div className="grad-orb3"/></div>
          <div className="grad-noise" aria-hidden/>
          <div className="dbg" aria-hidden/>

          <div className="dh" style={{position:"relative"}}>
            <img src="/dyb/parental_advisory.png" alt="Parental Advisory Explicit Content" style={{position:"absolute",bottom:20,right:20,width:100,opacity:0.85,zIndex:10,pointerEvents:"none"}}/>
            <div className="dh-hd">
              <div className="dh-np">— NOW PLAYING —</div>
              <div className="dh-nk">@{cur?.nick ?? '---'}</div>
            </div>
            <div className="dh-ph">
              {bars.length === 0
                ? <div className="dh-ld"><span className="dh-lt">LOADING BARS...</span></div>
                : visible.map((ph, i) => (
                  <div key={`${barIdx}-${i}`} className={`dh-p${i===phraseIdx?' nw':''}`}>
                    <span className="dh-pt" style={{display:'inline'}}>
                      {ph.segments.map((seg, j) =>
                        seg.rhyme !== undefined
                          ? <span key={j} className="dh-pr" style={{background:RHYME_COLORS[seg.rhyme%8].bg,color:RHYME_COLORS[seg.rhyme%8].color}}>{seg.text}</span>
                          : <span key={j}>{seg.text}</span>
                      )}
                    </span>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="dc">
            <div className="dc-mt">
              <div>
                <div className="dc-sc">{cur?.score ?? '--'}</div>
                <div className="dc-sl">POINTS</div>
              </div>
              <div className="dc-vd"/>
              <div className="dc-nk">@{cur?.nick ?? '---'}</div>
              <div className="dc-ds">
                {[0,1,2,3].map(i => <div key={i} className={`dc-d${beat===i?' act':''}`}/>)}
              </div>
            </div>
            <div className="dc-rw">
              <button className="dc-mb" onClick={() => setShowModal(true)}>
                MAKE YOUR BARS?<span style={{fontSize:20}}>→</span>
              </button>
              <Link href="/dyb/ranking/" className="dc-rb">
                RANKING<span style={{fontSize:20}}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showModal && <PostModal onClose={closeModal}/>}
    </>
  )
}
