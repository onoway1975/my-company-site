'use client'

import { useState, useRef, useEffect } from 'react'
import { Zap, Shield, Star, ChevronLeft, ChevronRight, Check, Award, Users, Clock, MapPin } from 'lucide-react'

// ── Animation Hooks & Components ───────────────────────────────────────────

function useIO(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/** fade-in-up: opacity:0 + translateY:20px → opacity:1 + translateY:0 */
function FadeInUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useIO()
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/** slide-in-left: opacity:0 + translateX:-40px → opacity:1 + translateX:0 */
function SlideInLeft({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useIO()
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateX(-40px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/** counter-up: setInterval でカウントアップ（easeOut cubic） */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        obs.disconnect()
        const dur = 1500
        const t0 = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1)
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
          if (p < 1) requestAnimationFrame(tick)
          else setCount(target)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  { Icon: Zap,    title: '高速な実装力',   desc: '企画から納品まで最短3週間。スピードと品質を両立した開発体制で、スムーズなリリースを実現します。' },
  { Icon: Shield, title: '安心のサポート', desc: '制作後も継続してサポート。問い合わせには原則24時間以内に対応し、長期的な伴走体制を整えています。' },
  { Icon: Star,   title: '高い顧客満足度', desc: '導入後の継続率98%。多くのクライアントに「また頼みたい」と選ばれ続けています。' },
]

const galleryItems = ['Work 01', 'Work 02', 'Work 03', 'Work 04', 'Work 05', 'Work 06']

const circleFeatures = [
  { Icon: Award, title: '受賞歴多数',   desc: 'グッドデザイン賞など多数の賞を受賞。品質の高さを業界が認める実績があります。' },
  { Icon: Users, title: '専門チーム',   desc: 'デザイン・開発・映像のプロが一体となってプロジェクトを推進します。' },
  { Icon: Clock, title: '納期厳守',     desc: 'プロジェクト管理を徹底し、スケジュール通りの納品を実現します。' },
]

const articles = [
  { title: 'Webサイトリニューアルで問い合わせ数が3倍に増加した事例', date: '2024.12.01', category: 'ケーススタディ' },
  { title: '映像制作で採用応募者が2倍になった中小企業の取り組み', date: '2024.11.15', category: 'ニュース' },
  { title: '2025年に押さえておきたいWebデザインのトレンド10選', date: '2024.11.01', category: 'コラム' },
]

const stats = [
  { target: 1200, suffix: '+', label: '導入実績' },
  { target: 98,   suffix: '%', label: '顧客満足度' },
  { target: 48,   suffix: 'h', label: '最短対応' },
  { target: 10,   suffix: '年', label: '業界経験' },
]

const plans = [
  {
    name: 'ライト',
    price: '¥150,000〜',
    desc: '小規模LP・コーポレートサイト向け',
    perks: ['5ページまで', 'レスポンシブ対応', '納品後1ヶ月サポート'],
    recommended: false,
  },
  {
    name: 'スタンダード',
    price: '¥350,000〜',
    desc: 'ブランディングを重視する中規模サイト向け',
    perks: ['15ページまで', 'CMS実装', '映像制作1本含む', '納品後3ヶ月サポート'],
    recommended: true,
  },
  {
    name: 'エンタープライズ',
    price: 'お見積り',
    desc: '大規模・要件の複雑なプロジェクト向け',
    perks: ['ページ数無制限', 'システム連携対応', '映像制作複数本', '専任担当者'],
    recommended: false,
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LpSecondPage() {
  const galleryRef = useRef<HTMLDivElement>(null)
  const scrollGallery = (dir: 'left' | 'right') =>
    galleryRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })

  return (
    <>
      {/* btn-hover-slide: ::before scaleX(0)→scaleX(1) */}
      <style>{`
        .btn-slide {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .btn-slide::before {
          content: '';
          position: absolute;
          inset: 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
          z-index: 0;
        }
        .btn-slide > span {
          position: relative;
          z-index: 1;
          transition: color 0.4s ease;
        }
        /* dark variant (white bg → dark fill) */
        .btn-slide-dark::before { background: #1A1A1A; }
        .btn-slide-dark:hover::before { transform: scaleX(1); }
        .btn-slide-dark:hover > span { color: #FFFFFF; }
        /* light variant (dark bg → light fill) */
        .btn-slide-light::before { background: #F4F4F4; }
        .btn-slide-light:hover::before { transform: scaleX(1); }
        .btn-slide-light:hover > span { color: #1A1A1A; }
      `}</style>

      {/* ── 1. Hero Dark Split ────────────────────────────────────────────── */}
      <section
        className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row"
        style={{ background: '#1A1A1A' }}
      >
        {/* Left: text */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-20 md:py-0 gap-8">
          <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(244,244,244,0.3)' }}>
            ciraf inc.
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold leading-snug"
            style={{ color: '#F4F4F4', maxWidth: 440 }}
          >
            デザインと技術で、<br />ビジネスを動かす。
          </h1>
          <p className="text-sm leading-loose max-w-sm" style={{ color: 'rgba(244,244,244,0.5)' }}>
            Webサイト・映像・ブランディングを通じてクライアントの
            ビジネス成長を一貫してサポートします。
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Primary: solid white */}
            <button
              className="px-8 py-3 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: '#F4F4F4', color: '#1A1A1A', borderRadius: 2 }}
            >
              無料でご相談
            </button>
            {/* Secondary: outline + btn-slide-light */}
            <button
              className="btn-slide btn-slide-light px-8 py-3 text-sm font-medium"
              style={{ border: '1px solid rgba(244,244,244,0.3)', color: '#F4F4F4', borderRadius: 2 }}
            >
              <span>実績を見る</span>
            </button>
          </div>
        </div>

        {/* Right: image placeholder */}
        <div
          className="flex-1 flex items-center justify-center"
          style={{ background: '#2C2C2C', minHeight: 320 }}
        >
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(244,244,244,0.18)' }}>
            Hero Image
          </p>
        </div>
      </section>

      {/* ── 2. Features (3-col) ──────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <FadeInUp>
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Features</p>
              <h2 className="text-2xl md:text-3xl font-bold text-ink">選ばれる3つの理由</h2>
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map(({ Icon, title, desc }, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <div
                  className="p-8 flex flex-col gap-5 h-full"
                  style={{ border: '1px solid #E2E2E2', borderRadius: 4 }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center"
                    style={{ background: '#F7F7F7', borderRadius: '50%' }}
                  >
                    <Icon size={18} color="#111111" />
                  </div>
                  <h3 className="text-sm font-bold text-ink">{title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Gallery Slider ────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 bg-surface">
        <div className="max-w-5xl mx-auto">
          <FadeInUp>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Gallery</p>
                <h2 className="text-2xl md:text-3xl font-bold text-ink">制作実績</h2>
              </div>
              <div className="flex gap-2">
                {(['left', 'right'] as const).map(dir => (
                  <button
                    key={dir}
                    onClick={() => scrollGallery(dir)}
                    className="w-10 h-10 flex items-center justify-center"
                    style={{ border: '1px solid #E2E2E2', borderRadius: 2, background: '#FFFFFF' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#1A1A1A')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E2E2')}
                    aria-label={dir === 'left' ? '前へ' : '次へ'}
                  >
                    {dir === 'left' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </FadeInUp>

          <div
            ref={galleryRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {galleryItems.map((label, i) => (
              <div
                key={i}
                className="shrink-0 flex items-center justify-center"
                style={{ width: 280, aspectRatio: '4/3', background: '#E8E8E8', borderRadius: 4, scrollSnapAlign: 'start' }}
              >
                <p className="text-xs tracking-widest uppercase" style={{ color: '#C0C0C0' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Mission Split ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-0">
            {/* Left: big h2 */}
            <SlideInLeft>
              <div style={{ flex: '0 0 40%' }}>
                <h2 className="text-3xl md:text-4xl font-bold text-ink leading-snug">
                  デザインで、<br />世界を変える。
                </h2>
              </div>
            </SlideInLeft>

            {/* Divider */}
            <div className="hidden md:block mx-12 self-stretch" style={{ width: 1, background: '#E2E2E2' }} />

            {/* Right: paragraphs */}
            <FadeInUp delay={0.1}>
              <div style={{ flex: '0 0 55%' }} className="flex flex-col gap-5">
                <p className="text-sm text-muted leading-loose">
                  私たちシラフ株式会社は、Webサイト・映像・ブランディングを通じて、
                  クライアントのビジネス成長を一貫してサポートするクリエイティブカンパニーです。
                </p>
                <p className="text-sm text-muted leading-loose">
                  「デザインの力で人と企業をつなぐ」というビジョンのもと、
                  機能性と美しさを両立したデジタル体験を設計します。
                </p>
                <p className="text-sm text-muted leading-loose">
                  創業以来1,200社以上の企業をサポートし、
                  各業界のリーディングカンパニーから信頼を得てきました。
                </p>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* ── 5. Circle Features (3-col) ───────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 bg-surface">
        <div className="max-w-5xl mx-auto">
          <FadeInUp>
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Why Us</p>
              <h2 className="text-2xl md:text-3xl font-bold text-ink">私たちが選ばれる理由</h2>
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {circleFeatures.map(({ Icon, title, desc }, i) => (
              <FadeInUp key={i} delay={i * 0.12}>
                <div className="flex flex-col items-center text-center gap-5">
                  <div
                    className="flex items-center justify-center"
                    style={{ width: 72, height: 72, borderRadius: '50%', background: '#1A1A1A' }}
                  >
                    <Icon size={28} color="#FFFFFF" />
                  </div>
                  <h3 className="text-sm font-bold text-ink">{title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Blog / News ───────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <FadeInUp>
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">News &amp; Blog</p>
              <h2 className="text-2xl md:text-3xl font-bold text-ink">ブログ・ニュース</h2>
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((a, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <article className="flex flex-col gap-4 group cursor-pointer">
                  <div
                    className="w-full aspect-video flex items-center justify-center"
                    style={{ background: '#F0F0F0', borderRadius: 4 }}
                  >
                    <span className="text-[10px] tracking-widest uppercase" style={{ color: '#C8C8C8' }}>Image</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] px-2 py-0.5"
                      style={{ background: '#F0F0F0', borderRadius: 2, color: '#767676' }}
                    >
                      {a.category}
                    </span>
                    <span className="text-[10px]" style={{ color: '#AAAAAA' }}>{a.date}</span>
                  </div>
                  <p className="text-sm font-medium text-ink leading-snug group-hover:underline">{a.title}</p>
                </article>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Stats / Numbers ───────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 bg-surface">
        <div className="max-w-4xl mx-auto">
          <FadeInUp>
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Results</p>
              <h2 className="text-2xl md:text-3xl font-bold text-ink">実績・数値</h2>
            </div>
          </FadeInUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4">
            {stats.map(({ target, suffix, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <span className="text-4xl md:text-5xl font-bold text-ink">
                  <Counter target={target} suffix={suffix} />
                </span>
                <span className="text-xs text-muted tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Pricing Plans ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <FadeInUp>
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Pricing</p>
              <h2 className="text-2xl md:text-3xl font-bold text-ink">料金プラン</h2>
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <div
                  className="relative flex flex-col gap-6 p-8 h-full"
                  style={{
                    border: plan.recommended ? '2px solid #1A1A1A' : '1px solid #E2E2E2',
                    borderRadius: 4,
                    background: plan.recommended ? '#FAFAFA' : '#FFFFFF',
                  }}
                >
                  {plan.recommended && (
                    <span
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-bold tracking-wider whitespace-nowrap"
                      style={{ background: '#1A1A1A', color: '#FFFFFF', borderRadius: 99 }}
                    >
                      おすすめ
                    </span>
                  )}

                  <div>
                    <p className="text-xs text-muted tracking-wider mb-2">{plan.name}</p>
                    <p className="text-2xl font-bold text-ink">{plan.price}</p>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">{plan.desc}</p>

                  <ul className="flex flex-col gap-3 flex-1">
                    {plan.perks.map((p, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-ink">
                        <Check size={12} color="#1A1A1A" className="shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>

                  {/* btn-slide-dark: border outline → fills #1A1A1A on hover */}
                  <button
                    className="btn-slide btn-slide-dark w-full py-3 text-sm font-medium"
                    style={{ border: '1px solid #1A1A1A', borderRadius: 2, color: '#1A1A1A', background: 'transparent' }}
                  >
                    <span>お問い合わせ</span>
                  </button>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Google Maps ───────────────────────────────────────────────── */}
      <section style={{ background: '#F7F7F7' }}>
        <div className="px-6 lg:px-12 py-16 text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Access</p>
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-4">アクセス</h2>
          <p className="text-sm text-muted flex items-center justify-center gap-1.5">
            <MapPin size={13} />
            〒150-0001 東京都渋谷区神宮前3-25-18 205 THE SHARE
          </p>
        </div>
        <div className="w-full" style={{ height: 420 }}>
          <iframe
            src="https://maps.google.com/maps?q=東京都渋谷区神宮前3-25-18&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="アクセスマップ"
          />
        </div>
      </section>
    </>
  )
}
