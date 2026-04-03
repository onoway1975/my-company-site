'use client'

import { useRef, useEffect, useState } from 'react'
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import { Zap, Shield, Star, Mail } from 'lucide-react'

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-main',
})

// ── Animation wrapper components ─────────────────────────────────────────────

function FadeInUp({ children, delay = 0, className }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return <div ref={ref} className={className}>{children}</div>
}

function SlideInRight({ children, delay = 0, className }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateX(40px)'
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateX(0)'
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return <div ref={ref} className={className}>{children}</div>
}

// ── CountUp ──────────────────────────────────────────────────────────────────

function CountUp({
  end,
  suffix = '',
  decimals = 0,
  duration = 2000,
}: {
  end: number
  suffix?: string
  decimals?: number
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const steps = 60
          const stepDuration = duration / steps
          const increment = end / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(current)
            }
          }, stepDuration)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  const display =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString()

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  )
}

// ── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    Icon: Zap,
    title: '高速な実装力',
    desc: '企画から納品まで最短3週間。スピードと品質を両立した開発体制でスムーズなリリースを実現します。',
  },
  {
    Icon: Shield,
    title: '安心のサポート',
    desc: '制作後も継続してサポート。お問い合わせには原則24時間以内に対応し、長期的な伴走体制を整えています。',
  },
  {
    Icon: Star,
    title: '高い顧客満足度',
    desc: '導入後の継続率98%。多くのクライアントに「また頼みたい」と選ばれ続けています。',
  },
]

const members = [
  { name: '山田 太郎', role: 'CEO / 代表取締役' },
  { name: '鈴木 花子', role: 'CTO / 技術責任者' },
  { name: '佐藤 次郎', role: 'Design Lead' },
  { name: '田中 美咲', role: 'Marketing' },
]

const stats = [
  { end: 1200, suffix: '+',  decimals: 0, label: '導入実績' },
  { end: 98,   suffix: '%',  decimals: 0, label: '顧客満足度' },
  { end: 4.8,  suffix: '',   decimals: 1, label: 'サービス評価' },
  { end: 10,   suffix: '年', decimals: 0, label: '業界経験' },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Lp0403Page() {
  return (
    <div className={zenKaku.variable} style={{ fontFamily: 'var(--font-main), sans-serif' }}>

      {/* ── 1. Hero ────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ background: '#1A1A1A', paddingTop: 64, paddingBottom: 64 }}
      >
        <FadeInUp className="flex flex-col items-center gap-8 max-w-3xl">
          <p
            className="text-[11px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(244,244,244,0.35)' }}
          >
            Landing Page · 2026
          </p>
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight"
            style={{ color: '#F4F4F4', lineHeight: 1.25 }}
          >
            あなたのビジネスを、
            <br className="hidden md:block" />
            次のステージへ。
          </h1>
          <p
            className="text-sm md:text-base leading-loose max-w-lg"
            style={{ color: 'rgba(244,244,244,0.5)' }}
          >
            Webサイト・映像・ブランディングを通じて、
            <br className="hidden md:block" />
            クライアントのビジネス成長を一貫してサポートします。
          </p>
        </FadeInUp>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span
            className="text-[9px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(244,244,244,0.2)' }}
          >
            Scroll
          </span>
          <div className="w-px h-8" style={{ background: 'rgba(244,244,244,0.15)' }} />
        </div>
      </section>

      {/* ── 2. Features ────────────────────────────────────────────────────── */}
      <section
        className="px-6 lg:px-12"
        style={{ background: '#FFFFFF', paddingTop: 64, paddingBottom: 64 }}
      >
        <div className="max-w-5xl mx-auto">
          <FadeInUp className="text-center mb-14">
            <p
              className="text-[10px] tracking-[0.25em] uppercase mb-3"
              style={{ color: '#BBBBBB' }}
            >
              Features
            </p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1A1A1A' }}>
              選ばれる3つの理由
            </h2>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map(({ Icon, title, desc }, i) => (
              <FadeInUp key={i} delay={i * 100}>
                <div
                  className="p-8 flex flex-col gap-4 h-full"
                  style={{ border: '1px solid #E2E2E2', borderRadius: 4 }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{ background: '#F7F7F7', borderRadius: '50%' }}
                  >
                    <Icon size={18} color="#1A1A1A" />
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>{desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button
              className="px-8 py-3 text-sm font-medium transition-opacity hover:opacity-60"
              style={{
                border: '1px solid #1A1A1A',
                color: '#1A1A1A',
                background: 'transparent',
                borderRadius: 2,
                cursor: 'pointer',
              }}
            >
              詳しく見る →
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. Team ────────────────────────────────────────────────────────── */}
      <section
        className="px-6 lg:px-12"
        style={{
          background: '#FFFFFF',
          paddingTop: 64,
          paddingBottom: 64,
          borderTop: '1px solid #E2E2E2',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <FadeInUp className="text-center mb-14">
            <p
              className="text-[10px] tracking-[0.25em] uppercase mb-3"
              style={{ color: '#BBBBBB' }}
            >
              Team
            </p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1A1A1A' }}>
              チームメンバー
            </h2>
          </FadeInUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {members.map((m, i) => (
              <SlideInRight key={i} delay={i * 80}>
                <div className="flex flex-col items-center gap-3 text-center">
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      background: '#EBEBEB',
                      borderRadius: 4,
                    }}
                  />
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{m.name}</p>
                    <p className="text-xs mt-1" style={{ color: '#888888' }}>{m.role}</p>
                  </div>
                  <div className="flex gap-3">
                    <a href="#" className="text-xs transition-opacity hover:opacity-60" style={{ color: '#BBBBBB' }}>X</a>
                    <a href="#" className="text-xs transition-opacity hover:opacity-60" style={{ color: '#BBBBBB' }}>Ins</a>
                  </div>
                </div>
              </SlideInRight>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button
              className="px-8 py-3 text-sm font-medium transition-opacity hover:opacity-60"
              style={{
                border: '1px solid #1A1A1A',
                color: '#1A1A1A',
                background: 'transparent',
                borderRadius: 2,
                cursor: 'pointer',
              }}
            >
              メンバー紹介を見る →
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. Stats ───────────────────────────────────────────────────────── */}
      <section
        className="px-6 lg:px-12"
        style={{ background: '#F4F4F4', paddingTop: 64, paddingBottom: 64 }}
      >
        <div className="max-w-4xl mx-auto">
          <FadeInUp className="text-center mb-14">
            <p
              className="text-[10px] tracking-[0.25em] uppercase mb-3"
              style={{ color: '#BBBBBB' }}
            >
              Numbers
            </p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1A1A1A' }}>
              実績・数値
            </h2>
          </FadeInUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4 text-center">
            {stats.map(({ end, suffix, decimals, label }, i) => (
              <FadeInUp key={i} delay={i * 80}>
                <p className="text-4xl md:text-5xl font-bold" style={{ color: '#1A1A1A', lineHeight: 1 }}>
                  <CountUp end={end} suffix={suffix} decimals={decimals} />
                </p>
                <p className="text-xs mt-3 tracking-wider" style={{ color: '#888888' }}>{label}</p>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Newsletter ──────────────────────────────────────────────────── */}
      <section
        className="px-6 lg:px-12"
        style={{ background: '#FFFFFF', paddingTop: 64, paddingBottom: 64 }}
      >
        <div className="max-w-xl mx-auto text-center">
          <FadeInUp>
            <p
              className="text-[10px] tracking-[0.25em] uppercase mb-3"
              style={{ color: '#BBBBBB' }}
            >
              Newsletter
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
              最新情報を受け取る
            </h2>
            <p className="text-sm leading-loose mb-8" style={{ color: '#888888' }}>
              週1回のニュースレターで最新情報をお届けします。
            </p>
            <form
              className="flex gap-3"
              onSubmit={e => e.preventDefault()}
            >
              <label className="flex items-center flex-1 gap-2 px-4" style={{ border: '1px solid #E2E2E2', borderRadius: 2 }}>
                <Mail size={14} color="#BBBBBB" className="shrink-0" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 py-3 text-sm outline-none bg-transparent"
                  style={{ color: '#1A1A1A' }}
                />
              </label>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium whitespace-nowrap transition-opacity hover:opacity-80"
                style={{
                  background: '#1A1A1A',
                  color: '#F4F4F4',
                  border: 'none',
                  borderRadius: 2,
                  cursor: 'pointer',
                }}
              >
                登録する
              </button>
            </form>
            <p className="text-xs mt-4" style={{ color: '#BBBBBB' }}>
              いつでも解除できます。プライバシーポリシーに同意の上ご登録ください。
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* ── 6. Footer ──────────────────────────────────────────────────────── */}
      <footer
        className="px-6 lg:px-12"
        style={{ background: '#1A1A1A', paddingTop: 64, paddingBottom: 64 }}
      >
        <div className="max-w-5xl mx-auto">
          <div
            className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-10"
            style={{ borderBottom: '1px solid rgba(244,244,244,0.08)' }}
          >
            {/* Logo */}
            <div>
              <p className="text-base font-bold tracking-widest" style={{ color: '#F4F4F4' }}>
                Company Name
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(244,244,244,0.25)' }}>
                company inc.
              </p>
            </div>

            {/* Nav */}
            <nav className="flex flex-wrap gap-6">
              {['サービス', '実績', '会社概要', 'お問い合わせ'].map(label => (
                <a
                  key={label}
                  href="#"
                  className="text-xs transition-opacity hover:opacity-70"
                  style={{ color: 'rgba(244,244,244,0.45)' }}
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* SNS */}
            <div className="flex gap-5">
              {['note', 'Instagram', 'X'].map(sn => (
                <a
                  key={sn}
                  href="#"
                  className="text-xs transition-opacity hover:opacity-70"
                  style={{ color: 'rgba(244,244,244,0.35)' }}
                >
                  {sn}
                </a>
              ))}
            </div>
          </div>

          <p
            className="mt-8 text-xs text-center"
            style={{ color: 'rgba(244,244,244,0.18)' }}
          >
            © {new Date().getFullYear()} Company Name Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
