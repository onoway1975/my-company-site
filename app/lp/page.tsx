'use client'

import { Zap, Shield, Star, ArrowRight, MapPin } from 'lucide-react'

// ── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    Icon:  Zap,
    title: '高速な実装力',
    desc:  '企画から納品まで最短3週間。スピードと品質を両立した開発体制で、スムーズなリリースを実現します。',
  },
  {
    Icon:  Shield,
    title: '安心のサポート',
    desc:  '制作後も継続してサポート。問い合わせには原則24時間以内に対応し、長期的な伴走体制を整えています。',
  },
  {
    Icon:  Star,
    title: '高い顧客満足度',
    desc:  '導入後の継続率98%。多くのクライアントに「また頼みたい」と選ばれ続けています。',
  },
]

const stats = [
  { num: '1,200+', label: '導入実績' },
  { num: '98%',    label: '顧客満足度' },
  { num: '4.8',    label: 'サービス評価' },
  { num: '10年',   label: '業界経験' },
]

const steps = [
  { n: 1, title: 'お問い合わせ', desc: 'フォームまたはお電話でお気軽にご連絡ください。' },
  { n: 2, title: 'ヒアリング',   desc: '課題・目標・スケジュールを詳しくお伺いします。' },
  { n: 3, title: '提案・制作',   desc: 'ご要件をもとに最適なご提案と制作を行います。' },
  { n: 4, title: '納品・運用',   desc: '検証・修正を経て納品。その後の運用もサポートします。' },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LpPage() {
  return (
    <>
      {/* ── 1. Hero（中央寄せ） ────────────────────────────────────────── */}
      <section
        className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-6 gap-8"
        style={{ background: '#1A1A1A' }}
      >
        <p
          className="text-[10px] tracking-[0.25em] uppercase"
          style={{ color: 'rgba(244,244,244,0.35)' }}
        >
          Landing Page
        </p>

        <h1
          className="text-4xl md:text-6xl font-bold leading-snug max-w-2xl"
          style={{ color: '#F4F4F4' }}
        >
          あなたのビジネスを、
          <br className="hidden md:block" />
          次のステージへ
        </h1>

        <p
          className="text-sm md:text-base leading-loose max-w-md"
          style={{ color: 'rgba(244,244,244,0.45)' }}
        >
          Webサイト・映像・ブランディングを通じて
          <br className="hidden md:block" />
          クライアントのビジネス成長を一貫してサポートします。
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="flex items-center justify-center gap-2 px-8 py-3 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: '#F4F4F4', color: '#1A1A1A', borderRadius: 2 }}
          >
            無料でご相談 <ArrowRight size={14} />
          </button>
          <button
            className="flex items-center justify-center gap-2 px-8 py-3 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ border: '1px solid rgba(244,244,244,0.25)', color: '#F4F4F4', borderRadius: 2 }}
          >
            実績を見る
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(244,244,244,0.2)' }}>Scroll</span>
          <div className="w-px h-8" style={{ background: 'rgba(244,244,244,0.15)' }} />
        </div>
      </section>

      {/* ── 2. 特徴紹介（3カラム） ────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Features</p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">選ばれる3つの理由</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map(({ Icon, title, desc }, i) => (
              <div
                key={i}
                className="p-8 flex flex-col gap-5"
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
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. フル幅画像 ──────────────────────────────────────────────── */}
      <div
        className="w-full flex items-center justify-center"
        style={{ aspectRatio: '16/9', background: '#2C2C2C' }}
      >
        <p
          className="text-xs tracking-[0.25em] uppercase"
          style={{ color: 'rgba(244,244,244,0.18)' }}
        >
          Full Width Image
        </p>
      </div>

      {/* ── 4. 実績・数値 ────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Results</p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">実績・数値</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4">
            {stats.map(({ num, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <span className="text-4xl md:text-5xl font-bold text-ink">{num}</span>
                <span className="text-xs text-muted tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. 導入ステップ ───────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Process</p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">導入の流れ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} className="relative flex flex-col items-center text-center md:px-4">
                {/* 横矢印（デスクトップ） */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-5 h-px"
                    style={{
                      left: 'calc(50% + 22px)',
                      right: '-8px',
                      background: '#E2E2E2',
                    }}
                  />
                )}

                {/* 番号丸 */}
                <div
                  className="w-10 h-10 flex items-center justify-center text-sm font-bold mb-6 shrink-0 relative z-10"
                  style={{ border: '1.5px solid #1A1A1A', borderRadius: '50%', color: '#1A1A1A', background: '#FFFFFF' }}
                >
                  {n}
                </div>

                <h3 className="text-sm font-bold text-ink mb-2">{title}</h3>
                <p className="text-xs text-muted leading-relaxed">{desc}</p>

                {/* 縦矢印（モバイル） */}
                {i < steps.length - 1 && (
                  <div className="md:hidden my-7 flex flex-col items-center gap-1">
                    <div className="w-px h-6" style={{ background: '#E2E2E2' }} />
                    <ArrowRight size={11} className="rotate-90 text-muted" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Googleマップ ───────────────────────────────────────────── */}
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

      {/* ── 7. LP フッター ─────────────────────────────────────────────── */}
      <footer className="py-16 px-6 lg:px-12" style={{ background: '#1A1A1A' }}>
        <div className="max-w-5xl mx-auto">
          {/* 上段 */}
          <div
            className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-10"
            style={{ borderBottom: '1px solid rgba(244,244,244,0.08)' }}
          >
            {/* ロゴ */}
            <div>
              <p className="text-base font-bold tracking-widest" style={{ color: '#F4F4F4' }}>
                シラフ株式会社
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(244,244,244,0.25)' }}>
                ciraf inc.
              </p>
            </div>

            {/* ナビ */}
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

          {/* コピーライト */}
          <p
            className="mt-8 text-xs text-center"
            style={{ color: 'rgba(244,244,244,0.18)' }}
          >
            © {new Date().getFullYear()} シラフ株式会社 / ciraf inc. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
