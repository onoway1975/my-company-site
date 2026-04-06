'use client'

import { useState } from 'react'
import { Monitor, Sparkles, TrendingUp, MessageCircle, FileText } from 'lucide-react'

// ── Data ─────────────────────────────────────────────────────────────────────

const pains = [
  { text: 'AIって結局、何に使えばいいの？', image: '/ai/problem-01.webp' },
  { text: '外注費を下げたいけど、内製化の進め方がわからない', image: '/ai/problem-02.webp' },
  { text: 'ツールは試してみたけど、業務に定着しなかった', image: '/ai/problem-03.webp' },
  { text: '競合がAIを使い始めた気がして、焦っている', image: '/ai/problem-04.webp' },
]

const works = [
  {
    title: '天職占い',
    url: 'https://ciraf.jp/tenshoku/',
    noteUrl: 'https://note.com/ciraf_inc/n/na664840104e2',
    desc: '写真をアップ→AIが天職を診断・顔合成画像を生成',
    image: '/ai/works-tenshoku.webp',
  },
  {
    title: 'Weather Music',
    url: 'https://ciraf.jp/weathermusic/',
    noteUrl: 'https://note.com/ciraf_inc/n/n2752d0d77637',
    desc: '現在地の天気を取得→AIがプレイリストを自動生成',
    image: '/ai/works-weathermusic.webp',
  },
  {
    title: 'D.Y.B.',
    url: 'https://ciraf.jp/dyb/',
    noteUrl: 'https://note.com/ciraf_inc',
    desc: '日本語パンチラインをAIが採点・韻をハイライト表示',
    image: '/ai/works-dyb.webp',
  },
  {
    title: 'Menu Card',
    url: 'https://ciraf.jp/menucard/',
    noteUrl: 'https://note.com/ciraf_inc/n/ned42f467b9a4',
    desc: 'スプレッドシートがそのままメニューページになる仕組み',
    image: '/ai/works-menucard.webp',
  },
]

const marqueeRow1: { name: string; slug: string | null }[] = [
  { name: 'Claude',        slug: 'anthropic' },
  { name: 'Claude Code',   slug: 'anthropic' },
  { name: 'VS Code',       slug: null },
  { name: 'Next.js',       slug: 'nextdotjs' },
  { name: 'TypeScript',    slug: 'typescript' },
  { name: 'Tailwind CSS',  slug: 'tailwindcss' },
  { name: 'Vercel',        slug: 'vercel' },
  { name: 'GitHub',        slug: 'github' },
]
const marqueeRow2: { name: string; slug: string | null }[] = [
  { name: 'Supabase',        slug: 'supabase' },
  { name: 'Upstash Redis',   slug: 'upstash' },
  { name: 'FAL.ai',          slug: null },
  { name: 'Leonardo AI',     slug: null },
  { name: 'Open-Meteo API',  slug: null },
  { name: 'iTunes Search API', slug: null },
  { name: 'Anthropic API',   slug: 'anthropic' },
  { name: 'Next.js',         slug: 'nextdotjs' },
]

const receiptRows = [
  { plan: '提案用デモサイト',   price: '5万円〜',   desc: '企画提案・コンペ用の実動デモ制作' },
  { plan: 'AIプロモツール',     price: '38万円〜',  desc: '診断・占い・ジェネレーター系' },
  { plan: 'AIメニュー・カタログ', price: '18万円〜', desc: 'スプレッドシートCMS付き' },
  { plan: 'AIチャットボット追加', price: '25万円〜', desc: '既存サイトへの組み込み' },
  { plan: 'フルオーダー',       price: '60万円〜',  desc: 'DB・認証・管理画面つき' },
  { plan: '保守サブスク',       price: '5万円/月',  desc: 'API費用込み・改善対応込み' },
]
const advisoryRows = [
  { plan: 'スポット相談',      price: '2万円／60分', desc: '単発・議事録付き' },
  { plan: '月次アドバイザー',  price: '10万円〜／月',  desc: '月2回Zoom＋Slack' },
  { plan: '社内研修（半日）',  price: '要ご相談',    desc: 'カリキュラム設計込み' },
  { plan: '社内研修（全5回）', price: '要ご相談',    desc: 'Claude Code実習含む' },
]

const faqs = [
  {
    q: 'エンジニアがいなくても依頼できますか？',
    a: 'はい。「こんなものが欲しい」というイメージだけで大丈夫です。企画・要件定義から一緒に進めます。',
  },
  {
    q: '相談だけでも大丈夫ですか？',
    a: '大丈夫です。「自社に合うかわからない」という状態での相談、大歓迎です。まずはスポット相談（60分・2万円）からどうぞ。',
  },
  {
    q: 'どんな業種でも対応できますか？',
    a: 'Web・映像・ブランディング・EC・飲食など、制作物があれば業種は問いません。「AIを使って何かしたい」があれば、一緒に考えます。',
  },
  {
    q: 'AIの知識がゼロでも大丈夫ですか？',
    a: 'むしろそういう方が多いです。「ChatGPTは触ったことがある」程度で十分です。ゼロから一緒に整理します。',
  },
  {
    q: '料金の目安を教えてください。',
    a: '提案用デモサイトは5万円〜、スポット相談は2万円／60分からです。詳細はお気軽にご相談ください。',
  },
]

// ── Shared styles ─────────────────────────────────────────────────────────────

const C = 'max-w-5xl mx-auto px-6 lg:px-12'
const PY = 'py-20 md:py-28'

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className="text-sm tracking-[0.25em] uppercase mb-3"
      style={{ color: light ? 'rgba(244,244,244,0.35)' : '#767676' }}
    >
      {children}
    </p>
  )
}

function PricingTable({
  label,
  rows,
}: {
  label: string
  rows: { plan: string; price: string; desc: string }[]
}) {
  return (
    <div>
      <p className="text-sm tracking-[0.2em] uppercase text-muted mb-4">{label}</p>
      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-base min-w-[520px]">
          <thead>
            <tr className="border-b border-ink">
              <th className="text-left py-3 pr-6 text-base font-bold text-ink w-[38%]">プラン</th>
              <th className="text-left py-3 pr-6 text-base font-bold text-ink w-[26%]">価格</th>
              <th className="text-left py-3 text-base font-bold text-ink">内容</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-surface transition-colors">
                <td className="py-4 pr-6 font-medium text-ink">{row.plan}</td>
                <td className="py-4 pr-6 font-bold text-ink whitespace-nowrap">{row.price}</td>
                <td className="py-4 text-muted">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  return (
    <div className="divide-y divide-border border-t border-border">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            className="w-full flex justify-between items-start text-left py-5 gap-4 group"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            aria-expanded={openIdx === i}
          >
            <span className="text-base font-semibold text-ink leading-relaxed">
              Q. {faq.q}
            </span>
            <span
              className="text-lg shrink-0 mt-0.5 transition-transform duration-200"
              style={{
                color: '#767676',
                transform: openIdx === i ? 'rotate(45deg)' : 'none',
              }}
            >
              +
            </span>
          </button>
          {openIdx === i && (
            <p className="text-base text-muted leading-[2] pb-6 pr-10">
              A. {faq.a}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// グレープレースホルダー（src差し替えで実画像に切り替え可）
function PlaceholderImage({
  src,
  alt,
  label = 'IMAGE',
  className = '',
  style,
}: {
  src: string
  alt: string
  label?: string
  className?: string
  style?: React.CSSProperties
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  return (
    <div
      className={`relative bg-[#D1D5DB] flex items-center justify-center overflow-hidden shrink-0 ${className}`}
      style={style}
    >
      {!error && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      {(!loaded || error) && (
        <span
          className="text-[11px] tracking-[0.2em] font-medium select-none uppercase"
          style={{ color: 'rgba(0,0,0,0.2)' }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

function DarkCtaButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <a
        href="#final-cta"
        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold transition-opacity hover:opacity-80"
        style={{ background: '#F4F4F4', color: '#1A1A1A', borderRadius: 2 }}
      >
        フォームで相談する →
      </a>
      <a
        href="#"
        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold transition-opacity hover:opacity-70"
        style={{ border: '1px solid rgba(244,244,244,0.3)', color: '#F4F4F4', borderRadius: 2 }}
      >
        日程を予約する
      </a>
    </div>
  )
}

function InlineContactForm() {
  const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' })
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const inputStyle: React.CSSProperties = {
    background: '#2a2a2a',
    border: '1px solid #333',
    borderRadius: 8,
    padding: '12px 16px',
    color: '#F4F4F4',
    width: '100%',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', company: '', email: '', message: '' })
        setAgreed(false)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-bold mb-4" style={{ color: '#F4F4F4' }}>
          送信しました。5営業日以内にご連絡します。
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-base text-muted hover:text-white transition-colors"
        >
          もう一度送信する
        </button>
      </div>
    )
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto flex flex-col gap-5"
        style={{ background: '#1a1a1a', borderRadius: 16, padding: '40px' }}
      >
        <div>
          <label className="block text-sm mb-2 font-medium" style={{ color: 'rgba(244,244,244,0.7)' }}>
            お名前 <span style={{ color: '#F5A623' }}>*</span>
          </label>
          <input
            type="text"
            required
            placeholder="山田 太郎"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="text-base placeholder:text-white/30 outline-none focus:border-white/60 transition-colors"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm mb-2 font-medium" style={{ color: 'rgba(244,244,244,0.7)' }}>
            会社名
          </label>
          <input
            type="text"
            placeholder="株式会社○○"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="text-base placeholder:text-white/30 outline-none focus:border-white/60 transition-colors"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm mb-2 font-medium" style={{ color: 'rgba(244,244,244,0.7)' }}>
            メールアドレス <span style={{ color: '#F5A623' }}>*</span>
          </label>
          <input
            type="email"
            required
            placeholder="taro@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="text-base placeholder:text-white/30 outline-none focus:border-white/60 transition-colors"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm mb-2 font-medium" style={{ color: 'rgba(244,244,244,0.7)' }}>
            お問い合わせ内容 <span style={{ color: '#F5A623' }}>*</span>
          </label>
          <textarea
            required
            rows={5}
            placeholder="お問い合わせ内容をご記入ください"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="text-base placeholder:text-white/30 outline-none focus:border-white/60 transition-colors resize-none"
            style={inputStyle}
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer" style={{ color: 'rgba(244,244,244,0.55)' }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 shrink-0"
          />
          <span className="text-sm">個人情報の取り扱いに同意する</span>
        </label>

        <div className="text-center mt-2">
          <button
            type="submit"
            disabled={!agreed || status === 'loading'}
            className="inline-flex items-center justify-center text-base font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#111111', border: '1px solid #444', borderRadius: 9999, padding: '14px 48px' }}
          >
            {status === 'loading' ? '送信中...' : '送信する →'}
          </button>
        </div>

        {status === 'error' && (
          <p className="text-sm text-center" style={{ color: '#E53E3E' }}>
            送信に失敗しました。もう一度お試しください。
          </p>
        )}
      </form>

      <div className="text-center mt-8">
        <a
          href="#"
          className="text-sm transition-colors hover:opacity-80"
          style={{ color: 'rgba(244,244,244,0.4)' }}
        >
          日程を予約する →
        </a>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AiPage() {
  return (
    <>
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .marquee-left {
          animation: marquee-left 30s linear infinite;
          will-change: transform;
        }
        .marquee-right {
          animation: marquee-right 25s linear infinite;
          will-change: transform;
        }
        .marquee-left:hover,
        .marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ────────────────────────────────────────────────────────────────────
          01  Hero
      ──────────────────────────────────────────────────────────────────── */}
      <section
        className="flex flex-col px-6 lg:px-12 pt-8 pb-0 md:pt-12 md:pb-0"
        style={{ background: '#FFFFFF' }}
      >
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-12">
            {/* Left column (text) */}
            <div className="w-full md:w-[45%] shrink-0">
              <SectionLabel>AI Production Support</SectionLabel>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8 mt-2 text-ink">
                <span className="whitespace-nowrap">制作現場でのAI活用、</span><br />
                <span className="whitespace-nowrap">お手伝いします。</span>
              </h1>
              <p className="text-base leading-[2.1] mb-12 max-w-xl text-muted">
                AIは、使う人の経験値で変わります。20年の制作経験を持つプロデューサー・ディレクターが、Web制作・映像・ブランディングの現場でのAI活用を、一緒に考えます。
              </p>
              <div>
                <a
                  href="#final-cta"
                  className="inline-flex items-center gap-2 text-base font-bold transition-colors"
                  style={{ background: '#FFFFFF', color: '#111111', border: '1px solid #111111', borderRadius: 9999, padding: '14px 40px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#111111'; e.currentTarget.style.color = '#FFFFFF' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#111111' }}
                >
                  まず相談してみる →
                </a>
              </div>
            </div>

            {/* Right column (illustration) */}
            <div className="w-full md:w-[55%] flex items-center justify-center overflow-visible h-[300px] md:h-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ai/hero.webp"
                alt="AI活用イラスト"
                className="w-auto h-full max-h-[300px] md:max-h-none md:w-full object-contain mx-auto"
              />
            </div>
          </div>

          {/* ─ Accent band (full width) ─ */}
          <div
            className="text-center mt-4 w-full"
            style={{ background: '#F5F5F5', borderRadius: 16, padding: '48px 32px' }}
          >
            <p className="text-sm mb-4" style={{ color: '#111111' }}>
              企画・提案を仕事にしている方へ
            </p>
            <p className="text-2xl md:text-3xl font-bold mb-8 whitespace-nowrap" style={{ color: '#111111' }}>
              提案用デモサイト、作ります。
            </p>
            <a
              href="#service"
              className="inline-flex items-center gap-2 text-base font-bold transition-colors"
              style={{ background: '#FFFFFF', color: '#111111', border: '1px solid #111111', borderRadius: 9999, padding: '14px 48px' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#111111'; e.currentTarget.style.color = '#FFFFFF' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#111111' }}
            >
              → 詳しくはこちら
            </a>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          02  Pain Points
      ──────────────────────────────────────────────────────────────────── */}
      <section className={`${PY} bg-white`}>
        <div className={C}>
          <SectionLabel>Problem</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-ink leading-snug mb-12">
            AI活用を進めたいけど、<br className="hidden md:block" />
            一歩が踏み出せていませんか？
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {pains.map((pain, i) => (
              <div
                key={i}
                className="bg-white hover:border-ink transition-colors duration-200"
                style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 32 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pain.image}
                  alt={pain.text}
                  className="w-full object-contain object-center mb-4"
                  style={{ height: 280 }}
                />
                <p className="text-sm tracking-[0.2em] text-muted uppercase mb-2 font-medium">
                  0{i + 1}
                </p>
                <p className="text-base font-medium text-ink leading-relaxed">{pain.text}</p>
              </div>
            ))}
          </div>

          <p className="text-lg font-bold text-ink">
            そのモヤモヤ、一緒に整理しましょう。
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          03  Services
      ──────────────────────────────────────────────────────────────────── */}
      <section id="service" className={`${PY} bg-surface scroll-mt-20`}>
        <div className={C}>
          <SectionLabel>Service</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-ink leading-snug mb-12">
            AI制作の外注から、内製化支援まで
          </h2>

          {/* ① Featured (full width) */}
          <div
            id="service-demo"
            className="mb-6"
            style={{ borderRadius: 16, padding: '32px 24px', background: '#FFFFFF' }}
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              {/* Icon + badge */}
              <div className="flex flex-col items-center md:items-start shrink-0">
                <div className="flex items-center justify-center mb-6" style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFF8ED' }}>
                  <Monitor size={48} color="#F5A623" strokeWidth={1.5} />
                </div>
                <span className="text-base font-bold text-ink px-4 py-1.5 border border-ink rounded-full whitespace-nowrap">
                  5万円〜
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm tracking-[0.2em] uppercase mb-2 font-medium" style={{ color: '#F5A623' }}>
                  ★ Main Service
                </p>
                <h3 className="text-xl font-bold text-ink mb-4">
                  提案用デモサイト制作
                </h3>
                <p className="text-base text-[#555555] leading-[2] mb-8">
                  企画・提案を仕事にしている方へ。「こういうものを作ります」と言葉で説明するより、実際に動くデモを見せた方が、クライアントの理解度も採用確度も上がります。企画書に添えるデモサイトを、AIを使って素早く制作します。
                </p>

                <div className="mb-8">
                  <p className="text-sm tracking-[0.2em] uppercase text-muted mb-3 font-medium">
                    こんな用途に
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {[
                      '新規クライアントへのAI搭載サイト提案',
                      'コンペ・ピッチの切り札として',
                      '既存クライアントへの追加提案・アップセル',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-base text-[#555555]">
                        <span className="text-muted mt-px">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <a
                    href="#final-cta"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 text-base font-semibold rounded-full bg-[#111111] text-white hover:opacity-80 transition-opacity"
                  >
                    デモサイトを依頼する →
                  </a>
                  <a
                    href="#works"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 text-base font-semibold rounded-full bg-white text-[#111111] border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
                  >
                    デモサイトを見る →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ②③④ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([
              {
                icon: Sparkles,
                title: 'AI搭載サイト・LP制作',
                body: '「こんなの欲しい」から相談OK。AI搭載のWebツール・プロモページを、要件定義から一緒に作ります。',
                price: null,
              },
              {
                icon: TrendingUp,
                title: '内製化アドバイザリー',
                body: '外注していた制作を、自分たちでできるようにする伴走支援。月2回Zoom＋Slack。',
                price: '10万円〜／月',
              },
              {
                icon: MessageCircle,
                title: 'スポット相談',
                body: '60分・単発。まず話だけ聞きたい方はここから。議事録とアドバイスメモ付き。',
                price: '2万円／60分',
              },
            ] as const).map((s, i) => (
              <div
                key={i}
                className="bg-white flex flex-col items-center text-center"
                style={{ borderRadius: 16, padding: '32px 24px' }}
              >
                <div className="flex items-center justify-center mb-6" style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFF8ED' }}>
                  <s.icon size={48} color="#F5A623" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-ink mb-3">{s.title}</h3>
                {s.price && (
                  <p className="text-base font-bold text-ink mb-3">{s.price}</p>
                )}
                <p className="text-base text-[#555555] leading-[1.9]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          04  Works
      ──────────────────────────────────────────────────────────────────── */}
      <section id="works" className={`${PY} bg-white`}>
        <div className={C}>
          <SectionLabel>Works</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-ink leading-snug mb-3">
            Claude Codeで作った、<br />実際に動いている自社コンテンツ
          </h2>
          <p className="text-base text-muted mb-12">
            以下はすべて、代表の尾上が1人で作った自社コンテンツです。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
            {works.map((w, i) => (
              <div
                key={i}
                className="border border-[#E5E7EB] rounded-sm overflow-hidden flex flex-col"
              >
                {/* Thumbnail 16:9 — links to note */}
                <a href={w.noteUrl} target="_blank" rel="noopener noreferrer" className="relative group cursor-pointer block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.image}
                    alt={w.title}
                    className="w-full aspect-video object-cover"
                    style={{ borderRadius: '8px 8px 0 0' }}
                  />
                  <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-t-lg">
                    <span className="flex items-center gap-2 text-base font-bold text-white">
                      <FileText size={24} color="white" />
                      note記事を読む
                    </span>
                  </div>
                </a>
                {/* Text */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="text-xl font-bold text-ink leading-snug">{w.title}</h3>
                  <p className="text-base text-muted leading-relaxed">{w.desc}</p>
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-base font-bold mt-2 py-3 px-6 border border-[#111111] rounded-full text-[#111111] bg-white cursor-pointer transition-colors duration-200 hover:bg-[#111111] hover:text-white"
                  >
                    サイトを見る →
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-12 mb-12">
            <p className="text-base text-[#333333] leading-[2.1] max-w-2xl">
              シラフ株式会社は、プロデューサーとディレクターの会社です。20年の制作経験で培ったスキルがあるからこそ、AIを道具として使いこなせる。企画の立て方、見せ方の判断、ユーザーへの届け方——そこに経験がなければ、AIはただのツールで終わります。制作経験 × AI活用で、企画から制作まで完遂できる。それがシラフの強みです。
            </p>
          </div>

          <p className="text-sm tracking-[0.2em] uppercase text-muted mb-4 font-medium">
            使用技術
          </p>
        </div>

        {/* Tech badges — full-width 2-row marquee */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden" style={{ gap: 16 }}>
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: 80, background: 'linear-gradient(to right, white, transparent)' }} />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: 80, background: 'linear-gradient(to left, white, transparent)' }} />

          <div className="flex flex-col" style={{ gap: 16 }}>
            {/* Row 1: left → right */}
            <div className="marquee-left flex w-max" style={{ gap: 24 }}>
              {[0, 1, 2].map((setIdx) => (
                <div key={setIdx} className="flex" style={{ gap: 24 }}>
                  {marqueeRow1.map((b) => (
                    <span
                      key={b.name}
                      className="inline-flex items-center justify-center gap-3 text-base font-medium text-ink whitespace-nowrap shrink-0"
                      style={{ width: 180, height: 108, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, padding: '16px 24px' }}
                    >
                      {b.slug && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://cdn.simpleicons.org/${b.slug}/111111`}
                          alt=""
                          width={40}
                          height={40}
                          className="shrink-0"
                        />
                      )}
                      {b.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Row 2: right → left */}
            <div className="marquee-right flex w-max" style={{ gap: 24 }}>
              {[0, 1, 2].map((setIdx) => (
                <div key={setIdx} className="flex" style={{ gap: 24 }}>
                  {marqueeRow2.map((b) => (
                    <span
                      key={b.name}
                      className="inline-flex items-center justify-center gap-3 text-base font-medium text-ink whitespace-nowrap shrink-0"
                      style={{ width: 180, height: 108, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, padding: '16px 24px' }}
                    >
                      {b.slug && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://cdn.simpleicons.org/${b.slug}/111111`}
                          alt=""
                          width={40}
                          height={40}
                          className="shrink-0"
                        />
                      )}
                      {b.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          05  Pricing
      ──────────────────────────────────────────────────────────────────── */}
      <section className={`${PY} bg-surface`}>
        <div className={C}>
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-ink leading-snug mb-12">
            AI制作の外注・アドバイザリー料金
          </h2>

          <div className="flex flex-col gap-12">
            <PricingTable label="受託制作" rows={receiptRows} />
            <PricingTable label="AI活用アドバイザリー" rows={advisoryRows} />
          </div>

          <p className="mt-10 text-base text-muted">
            まずはスポット相談からでも大丈夫です。
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          06  Note
      ──────────────────────────────────────────────────────────────────── */}
      <section className={`${PY} bg-white`}>
        <div className={C}>
          <SectionLabel>Note</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-14">
            {/* Image */}
            <a
              href="https://note.com/ciraf_inc"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 block group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ai/note-thumbnail.webp"
                alt="note記事サムネイル"
                className="w-full md:w-[360px] object-cover"
                style={{ aspectRatio: '16/9', borderRadius: 12 }}
              />
            </a>
            {/* Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-ink leading-snug mb-6">
                制作現場でのAI活用、<br />リアルな記録を公開しています
              </h2>
              <p className="text-base text-muted leading-[2] mb-10">
                失敗も、コストも、使ったプロンプトも。Claude Codeを使った開発の過程をそのままnoteで書いています。「どうやって作ったか」を知りたい方はこちらへ。
              </p>
              <a
                href="https://note.com/ciraf_inc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink text-white text-base tracking-[0.05em] py-3 px-7 hover:bg-white hover:text-ink transition-all duration-200 group"
              >
                AIでWebコンテンツを量産する実験記録
                <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          07  Profile
      ──────────────────────────────────────────────────────────────────── */}
      <section className={`${PY} bg-surface`}>
        <div className={C}>
          <SectionLabel>About</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-14">
            {/* Photo */}
            <div className="shrink-0 flex justify-center md:justify-start">
              <PlaceholderImage
                src="/ai/onoe.webp"
                alt="尾上裕典"
                label="PHOTO"
                style={{ width: 160, height: 160, borderRadius: '50%' }}
              />
            </div>
            {/* Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-ink leading-snug mb-8">
                シラフ株式会社について
              </h2>
              <p className="text-base font-bold text-ink mb-5 leading-relaxed">
                シラフ株式会社 代表取締役<br />
                尾上裕典（おのえひろのり）
              </p>
              <p className="text-base text-[#333333] leading-[2.1] mb-10">
                東京のWeb・映像・ブランディング会社を経営。クライアントワークの傍ら、Claude Codeを使った自社コンテンツを量産中。「AIを導入しましょう」ではなく、「こうやって作りました、一緒にやりましょう」が自分のスタンスです。
              </p>
              <a
                href="https://ciraf.jp/works/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink text-white text-base tracking-[0.05em] py-3 px-7 hover:bg-white hover:text-ink transition-all duration-200 group"
              >
                制作実績はこちら
                <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          08  CTA (mid-page)
      ──────────────────────────────────────────────────────────────────── */}
      <section
        className={`${PY}`}
        style={{ background: '#1A1A1A' }}
      >
        <div className={`${C} text-center`}>
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ color: '#F4F4F4' }}
          >
            まず、話だけでも大丈夫です。
          </h2>
          <p
            className="text-base leading-[2] mb-12 max-w-lg mx-auto"
            style={{ color: 'rgba(244,244,244,0.55)' }}
          >
            「自社に合うかわからない」「何から始めればいいかわからない」<br />
            そういう状態での相談、大歓迎です。
          </p>
          <DarkCtaButtons />
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          09  FAQ
      ──────────────────────────────────────────────────────────────────── */}
      <section className={`${PY} bg-white`}>
        <div className={C}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-ink leading-snug mb-12">
            AI活用支援についてよくある質問
          </h2>
          <FaqAccordion />
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          10  Final CTA
      ──────────────────────────────────────────────────────────────────── */}
      <section
        id="final-cta"
        className={`${PY} scroll-mt-20`}
        style={{ background: '#1A1A1A' }}
      >
        <div className={C}>
          <div className="text-center mb-12">
            <SectionLabel light>Contact</SectionLabel>
            <h2
              className="text-3xl md:text-4xl font-bold mt-2 mb-6"
              style={{ color: '#F4F4F4' }}
            >
              まずは気軽にご相談ください
            </h2>
            <p
              className="text-base leading-[2] max-w-lg mx-auto"
              style={{ color: 'rgba(244,244,244,0.55)' }}
            >
              Web制作のAI活用・内製化支援・AI搭載サイトの受託制作、<br className="hidden sm:block" />
              どんな入口からでも大丈夫です。
            </p>
          </div>

          <InlineContactForm />
        </div>
      </section>
    </>
  )
}
