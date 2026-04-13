'use client'

import { Poppins } from 'next/font/google'

const font = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-main',
})

// ── 1. Hero (Dark + Right Image) ────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{ background: '#1A1A1A', padding: '64px 48px' }}>
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left: Text */}
        <div className="flex flex-col gap-6">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#888' }}>
            Brand &amp; Growth Partner
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold leading-tight"
            style={{ color: '#FFFFFF' }}
          >
            ブランドを、
            <br />
            もっと強くする。
          </h1>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: '#CCCCCC' }}>
            戦略設計からWeb・映像制作まで、一気通貫で伴走。
            <br className="hidden md:block" />
            ビジネスの成長を、クリエイティブの力で加速させます。
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <a
              href="#contact"
              className="inline-block text-sm font-semibold transition-opacity hover:opacity-80"
              style={{
                border: '1px solid #FFFFFF',
                color: '#FFFFFF',
                background: 'transparent',
                padding: '12px 32px',
                borderRadius: 2,
              }}
            >
              お問い合わせ
            </a>
            <a
              href="#works"
              className="inline-block text-sm font-semibold transition-opacity hover:opacity-80"
              style={{
                border: '1px solid #555',
                color: '#CCCCCC',
                background: 'transparent',
                padding: '12px 32px',
                borderRadius: 2,
              }}
            >
              実績を見る →
            </a>
          </div>
        </div>
        {/* Right: Image */}
        <div
          className="w-full aspect-[4/3] rounded-md overflow-hidden"
          style={{ background: '#2A2A2A' }}
        >
          <div className="w-full h-full flex items-center justify-center" style={{ color: '#555' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 2. Photo Gallery (3 Images) ──────────────────────────────────────────
function PhotoGallerySection() {
  return (
    <section style={{ background: '#FFFFFF', padding: '64px 48px' }}>
      <div className="mx-auto max-w-6xl flex flex-col gap-8">
        <div>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#888' }}>
            Gallery
          </p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1A1A1A' }}>
            フォトギャラリー
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="w-full aspect-[3/2] rounded-md overflow-hidden flex items-center justify-center"
              style={{ background: '#F0F0F0' }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#BBBBBB" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 3. Image + Text (Image Left) ────────────────────────────────────────
function ImageTextLeftSection() {
  return (
    <section style={{ background: '#FFFFFF', padding: '64px 48px' }}>
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left: Sticky Image */}
        <div className="md:sticky md:top-24">
          <div
            className="w-full aspect-[4/3] rounded-md overflow-hidden flex items-center justify-center"
            style={{ background: '#F0F0F0' }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#BBBBBB" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        </div>
        {/* Right: Text */}
        <div className="flex flex-col gap-5">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#888' }}>
            Service 01
          </p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1A1A1A' }}>
            Web制作・運用
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
            コーポレートサイト、LP、EC、メディアなど目的に合わせた設計と制作を行います。
            公開後の運用・改善も一貫して対応。成果につながるWebをつくります。
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
            デザインだけでなく、SEO・アクセシビリティ・パフォーマンスまで考慮。
            ビジネスゴールに直結するWeb体験を提供します。
          </p>
          <a
            href="#contact"
            className="inline-block text-sm font-semibold mt-2 transition-opacity hover:opacity-70 self-start"
            style={{
              border: '1px solid #1A1A1A',
              color: '#1A1A1A',
              background: 'transparent',
              padding: '12px 32px',
              borderRadius: 2,
            }}
          >
            詳しく見る →
          </a>
        </div>
      </div>
    </section>
  )
}

// ── 4. Image + Text (Image Right) ───────────────────────────────────────
function ImageTextRightSection() {
  return (
    <section style={{ background: '#FFFFFF', padding: '64px 48px' }}>
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left: Text */}
        <div className="flex flex-col gap-5 order-2 md:order-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#888' }}>
            Service 02
          </p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1A1A1A' }}>
            映像・動画制作
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
            ブランドムービー、プロモーション映像、SNS動画など、
            企画から撮影・編集まで一貫して制作します。
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
            伝えたいメッセージを映像で表現し、
            ターゲットの心を動かすクリエイティブをお届けします。
          </p>
          <a
            href="#contact"
            className="inline-block text-sm font-semibold mt-2 transition-opacity hover:opacity-70 self-start"
            style={{
              border: '1px solid #1A1A1A',
              color: '#1A1A1A',
              background: 'transparent',
              padding: '12px 32px',
              borderRadius: 2,
            }}
          >
            詳しく見る →
          </a>
        </div>
        {/* Right: Sticky Image */}
        <div className="md:sticky md:top-24 order-1 md:order-2">
          <div
            className="w-full aspect-[4/3] rounded-md overflow-hidden flex items-center justify-center"
            style={{ background: '#F0F0F0' }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#BBBBBB" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 5. Full Width Image ──────────────────────────────────────────────────
function FullWidthImageSection() {
  return (
    <section style={{ background: '#F4F4F4', padding: '64px 48px' }}>
      <div className="mx-auto max-w-6xl">
        <div
          className="w-full rounded-md overflow-hidden flex items-center justify-center"
          style={{ background: '#E8E8E8', aspectRatio: '16/9' }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#BBBBBB" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      </div>
    </section>
  )
}

// ── 6. Video Embed ───────────────────────────────────────────────────────
function VideoSection() {
  return (
    <section style={{ background: '#1A1A1A', padding: '64px 48px' }}>
      <div className="mx-auto max-w-6xl flex flex-col gap-8">
        <div>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#888' }}>
            Movie
          </p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#FFFFFF' }}>
            制作事例ムービー
          </h2>
        </div>
        <div
          className="relative w-full rounded-md overflow-hidden"
          style={{ aspectRatio: '16/9', background: '#000' }}
        >
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
          />
        </div>
      </div>
    </section>
  )
}

// ── 7. Stats / Numbers ───────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { number: '150+', label: 'プロジェクト実績' },
    { number: '98%', label: 'クライアント満足度' },
    { number: '12', label: '年の実績' },
    { number: '40+', label: '業種対応' },
  ]

  return (
    <section style={{ background: '#F4F4F4', padding: '64px 48px' }}>
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        <div>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#888' }}>
            Results
          </p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1A1A1A' }}>
            実績・数値
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center gap-2 rounded-md"
              style={{ background: '#FFFFFF', padding: '32px 16px' }}
            >
              <span
                className="text-4xl md:text-5xl font-bold"
                style={{ color: '#1A1A1A', lineHeight: 1.1 }}
              >
                {s.number}
              </span>
              <span className="text-xs" style={{ color: '#888' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 8. Bar Chart (CSS only) ──────────────────────────────────────────────
function BarChartSection() {
  const data = [
    { label: 'Web制作', value: 85 },
    { label: 'ブランディング', value: 72 },
    { label: '映像制作', value: 68 },
    { label: 'UI/UX', value: 90 },
    { label: 'マーケティング', value: 60 },
  ]
  const maxVal = Math.max(...data.map(d => d.value))

  return (
    <section style={{ background: '#FFFFFF', padding: '64px 48px' }}>
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        <div>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#888' }}>
            Strength
          </p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1A1A1A' }}>
            対応領域
          </h2>
        </div>
        <div className="flex items-end justify-between gap-4 md:gap-8" style={{ height: 280 }}>
          {data.map(d => {
            const pct = (d.value / maxVal) * 100
            return (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
                  {d.value}%
                </span>
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${pct}%`,
                    background: '#1A1A1A',
                    minHeight: 4,
                  }}
                />
                <span
                  className="text-[10px] md:text-xs text-center whitespace-nowrap"
                  style={{ color: '#888' }}
                >
                  {d.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── 9. Comparison Table ──────────────────────────────────────────────────
function ComparisonTableSection() {
  const rows = [
    { feature: '戦略設計', us: true, a: false, b: false },
    { feature: 'Web制作', us: true, a: true, b: false },
    { feature: '映像制作', us: true, a: false, b: true },
    { feature: '運用サポート', us: true, a: true, b: false },
    { feature: 'ワンストップ対応', us: true, a: false, b: false },
  ]

  return (
    <section style={{ background: '#FFFFFF', padding: '64px 48px' }}>
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        <div>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#888' }}>
            Comparison
          </p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1A1A1A' }}>
            他社との比較
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #1A1A1A' }}>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: '#1A1A1A' }}>
                  機能
                </th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: '#FFFFFF', background: '#1A1A1A', borderRadius: '4px 4px 0 0' }}>
                  シラフ
                </th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: '#888' }}>
                  A社
                </th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: '#888' }}>
                  B社
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.feature} style={{ borderBottom: i < rows.length - 1 ? '1px solid #E8E8E8' : 'none' }}>
                  <td className="py-3 px-4" style={{ color: '#1A1A1A' }}>
                    {row.feature}
                  </td>
                  <td className="text-center py-3 px-4 font-bold" style={{ color: '#1A1A1A', background: '#F4F4F4' }}>
                    {row.us ? '✓' : '—'}
                  </td>
                  <td className="text-center py-3 px-4" style={{ color: row.a ? '#1A1A1A' : '#CCCCCC' }}>
                    {row.a ? '✓' : '×'}
                  </td>
                  <td className="text-center py-3 px-4" style={{ color: row.b ? '#1A1A1A' : '#CCCCCC' }}>
                    {row.b ? '✓' : '×'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ── 10. Footer ───────────────────────────────────────────────────────────
function LpFooterSection() {
  return (
    <section style={{ background: '#1A1A1A', padding: '64px 48px' }}>
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo + description */}
          <div className="flex flex-col gap-4">
            <span className="text-lg font-bold tracking-wider" style={{ color: '#FFFFFF' }}>
              ciraf inc.
            </span>
            <p className="text-xs leading-relaxed" style={{ color: '#888' }}>
              シラフ株式会社
              <br />
              東京都渋谷区神宮前3-25-18
              <br />
              THE SHARE 205
            </p>
          </div>
          {/* Nav links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#888' }}>
              Menu
            </span>
            {['トップ', 'サービス', '実績', 'シラフについて', 'お問い合わせ'].map(link => (
              <a
                key={link}
                href="#"
                className="text-sm transition-opacity hover:opacity-70"
                style={{ color: '#CCCCCC' }}
              >
                {link}
              </a>
            ))}
          </div>
          {/* SNS links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#888' }}>
              Social
            </span>
            {[
              { name: 'note', href: 'https://note.com/ciraf' },
              { name: 'X (Twitter)', href: '#' },
              { name: 'Instagram', href: '#' },
            ].map(s => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-opacity hover:opacity-70"
                style={{ color: '#CCCCCC' }}
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: 24 }}>
          <p className="text-xs" style={{ color: '#555' }}>
            © {new Date().getFullYear()} ciraf inc. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function Lp0412Page() {
  return (
    <div className={font.variable} style={{ fontFamily: 'var(--font-main), sans-serif' }}>
      <HeroSection />
      <PhotoGallerySection />
      <ImageTextLeftSection />
      <ImageTextRightSection />
      <FullWidthImageSection />
      <VideoSection />
      <StatsSection />
      <BarChartSection />
      <ComparisonTableSection />
      <LpFooterSection />
    </div>
  )
}
