'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Zap, Shield, Star, Plus, Minus } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

const slides = [
  {
    title: 'ビジネスを次の\nステージへ',
    sub: 'Webサイト・映像・ブランディングで事業成長を一貫してサポートします。',
    cta: '無料で相談する',
  },
  {
    title: 'スピードと品質を\n両立する',
    sub: '最短3週間での納品体制。チームが企画から納品まで一貫して担当します。',
    cta: '実績を見る',
  },
  {
    title: '継続率98%の\n信頼と実績',
    sub: '1,200社以上の導入実績。多くのクライアントに選ばれ続ける理由があります。',
    cta: 'サービスを知る',
  },
]

const articles = [
  {
    title: 'Webサイトリニューアルで問い合わせ数が3倍に増加した事例',
    date: '2024.12.01',
    category: 'ケーススタディ',
  },
  {
    title: '採用動画制作で応募者数が2倍になった中小企業の取り組み',
    date: '2024.11.15',
    category: 'ニュース',
  },
  {
    title: '2025年に押さえておきたいWebデザインのトレンド10選',
    date: '2024.11.01',
    category: 'コラム',
  },
]

const services = [
  {
    label: 'Web',
    title: 'Webサイト制作',
    desc: 'コーポレートサイトからLPまで、目的に合わせた高品質なサイトを制作します。',
    tag: '#WordPress #Next.js #Figma',
  },
  {
    label: 'Video',
    title: '映像制作',
    desc: '企業紹介・採用・SNS向けなど、あらゆる映像コンテンツを企画から制作します。',
    tag: '#撮影 #編集 #モーション',
  },
  {
    label: 'Brand',
    title: 'ブランディング',
    desc: 'ロゴ・VI設計からコンセプト立案まで、ブランドの核となる体験を設計します。',
    tag: '#VI #ロゴ #コンセプト',
  },
  {
    label: 'SNS',
    title: 'SNS運用',
    desc: 'Instagram・X・noteを活用した継続的な情報発信と集客を支援します。',
    tag: '#Instagram #X #note',
  },
]

const steps = [
  { n: 1, title: 'お問い合わせ', desc: 'フォームまたはお電話でお気軽にご連絡ください。' },
  { n: 2, title: 'ヒアリング', desc: '課題・目標・スケジュールを詳しくお伺いします。' },
  { n: 3, title: '提案・見積', desc: 'ご要件をもとに最適なご提案と見積もりをご提示します。' },
  { n: 4, title: '制作・開発', desc: '承認後、制作をスタート。進捗を随時ご報告します。' },
  { n: 5, title: '納品・運用', desc: '検証・修正を経て納品。その後の運用もサポートします。' },
]

const features = [
  {
    Icon: Zap,
    title: '高速な実装力',
    desc: '企画から納品まで最短3週間。スピードと品質を両立した開発体制で、スムーズなリリースを実現します。',
  },
  {
    Icon: Shield,
    title: '安心のサポート',
    desc: '制作後も継続してサポート。問い合わせには原則24時間以内に対応し、長期的な伴走体制を整えています。',
  },
  {
    Icon: Star,
    title: '高い顧客満足度',
    desc: '導入後の継続率98%。多くのクライアントに「また頼みたい」と選ばれ続けています。',
  },
]

const logos = [
  'Company A', 'Company B', 'Company C', 'Company D',
  'Company E', 'Company F', 'Company G', 'Company H',
]

const faqs = [
  {
    q: '制作期間はどのくらいかかりますか？',
    a: 'ご要件によりますが、Webサイトは最短3週間〜、映像制作は2〜4週間程度が目安です。詳しくはヒアリング時にお伝えします。',
  },
  {
    q: '料金はどのくらいですか？',
    a: 'プロジェクトの規模・内容によって異なります。まずはお気軽にご相談ください。お見積もりは無料です。',
  },
  {
    q: '途中で仕様変更はできますか？',
    a: 'ある程度の変更は対応可能ですが、大幅な変更は別途お見積もりとなる場合があります。制作開始前の仕様確認を大切にしています。',
  },
  {
    q: '納品後のサポートはありますか？',
    a: 'はい、納品後も継続的にサポートいたします。保守・運用プランもご用意していますので、ご相談ください。',
  },
  {
    q: '分割払いは可能ですか？',
    a: '基本的には着手金50%・納品時50%の2回払いをお願いしています。状況に応じてご相談ください。',
  },
  {
    q: '遠方でも依頼できますか？',
    a: 'はい、オンラインでの打ち合わせが可能ですので、全国どこからでもご依頼いただけます。',
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LpSample001Page() {
  const [slide, setSlide] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const prev = () => setSlide(s => (s - 1 + slides.length) % slides.length)
  const next = () => setSlide(s => (s + 1) % slides.length)

  return (
    <>
      {/* ── 1. Hero Slider ────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ background: '#1A1A1A' }}
      >
        <div className="max-w-2xl w-full flex flex-col items-center gap-6">
          <h1
            className="text-4xl md:text-6xl font-bold leading-snug whitespace-pre-line"
            style={{ color: '#F4F4F4' }}
          >
            {slides[slide].title}
          </h1>
          <p
            className="text-sm md:text-base leading-loose max-w-md"
            style={{ color: 'rgba(244,244,244,0.5)' }}
          >
            {slides[slide].sub}
          </p>
          <button
            className="px-8 py-3 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: '#F4F4F4', color: '#1A1A1A', borderRadius: 2 }}
          >
            {slides[slide].cta}
          </button>
        </div>

        {/* Prev arrow */}
        <button
          onClick={prev}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 transition-opacity hover:opacity-60"
          style={{ border: '1px solid rgba(244,244,244,0.2)', borderRadius: '50%', color: '#F4F4F4' }}
          aria-label="前へ"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Next arrow */}
        <button
          onClick={next}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 transition-opacity hover:opacity-60"
          style={{ border: '1px solid rgba(244,244,244,0.2)', borderRadius: '50%', color: '#F4F4F4' }}
          aria-label="次へ"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 flex gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="w-2 h-2 rounded-full transition-opacity"
              style={{ background: i === slide ? '#F4F4F4' : 'rgba(244,244,244,0.25)' }}
              aria-label={`スライド${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── 2. Blog / News ───────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">News &amp; Blog</p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">ブログ・ニュース</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((a, i) => (
              <article key={i} className="flex flex-col gap-4 group cursor-pointer">
                {/* Thumbnail */}
                <div
                  className="w-full aspect-video flex items-center justify-center"
                  style={{ background: '#F0F0F0', borderRadius: 4 }}
                >
                  <span className="text-[10px] tracking-widest uppercase" style={{ color: '#C8C8C8' }}>Image</span>
                </div>
                {/* Meta */}
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] px-2 py-0.5"
                    style={{ background: '#F0F0F0', borderRadius: 2, color: '#767676' }}
                  >
                    {a.category}
                  </span>
                  <span className="text-[10px]" style={{ color: '#AAAAAA' }}>{a.date}</span>
                </div>
                {/* Title */}
                <p className="text-sm font-medium text-ink leading-snug group-hover:underline">{a.title}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Services (labeled 4-col) ──────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Services</p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">サービス</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 p-6"
                style={{ background: '#FFFFFF', border: '1px solid #E2E2E2', borderRadius: 4 }}
              >
                <span
                  className="text-[9px] tracking-[0.3em] uppercase font-bold"
                  style={{ color: '#AAAAAA' }}
                >
                  {s.label}
                </span>
                <h3 className="text-sm font-bold text-ink">{s.title}</h3>
                <p className="text-xs text-muted leading-relaxed flex-1">{s.desc}</p>
                <span className="text-[10px]" style={{ color: '#AAAAAA' }}>{s.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Steps (5 steps) ───────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Process</p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">導入の流れ</h2>
          </div>

          {/* Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {steps.slice(0, 3).map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div
                  className="w-10 h-10 flex items-center justify-center text-sm font-bold mb-5 shrink-0"
                  style={{ border: '1.5px solid #1A1A1A', borderRadius: '50%', color: '#1A1A1A' }}
                >
                  {n}
                </div>
                <h3 className="text-sm font-bold text-ink mb-2">{title}</h3>
                <p className="text-xs text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden md:flex justify-center mb-10">
            <div className="w-px h-8" style={{ background: '#E2E2E2' }} />
          </div>

          {/* Bottom 2 centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:max-w-xl md:mx-auto">
            {steps.slice(3).map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div
                  className="w-10 h-10 flex items-center justify-center text-sm font-bold mb-5 shrink-0"
                  style={{ border: '1.5px solid #1A1A1A', borderRadius: '50%', color: '#1A1A1A' }}
                >
                  {n}
                </div>
                <h3 className="text-sm font-bold text-ink mb-2">{title}</h3>
                <p className="text-xs text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Features (3-col) ──────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 bg-surface">
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
                style={{ background: '#FFFFFF', border: '1px solid #E2E2E2', borderRadius: 4 }}
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

      {/* ── 6. Logos ─────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Clients</p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">ご利用企業</h2>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {logos.map((name, i) => (
              <div
                key={i}
                className="aspect-square flex items-center justify-center"
                style={{ background: '#F7F7F7', borderRadius: 4, filter: 'grayscale(1)' }}
              >
                <span
                  className="text-[8px] tracking-wider uppercase text-center leading-tight px-1"
                  style={{ color: '#C0C0C0' }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">よくある質問</h2>
          </div>

          <div style={{ border: '1px solid #E2E2E2', borderRadius: 4, overflow: 'hidden' }}>
            {faqs.map(({ q, a }, i) => (
              <div
                key={i}
                style={{ borderBottom: i < faqs.length - 1 ? '1px solid #E2E2E2' : 'none' }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 text-left py-5 px-6 transition-colors"
                  style={{ background: '#FFFFFF' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F7F7F7')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
                >
                  <span className="text-sm font-medium text-ink leading-snug">{q}</span>
                  <span className="shrink-0 text-muted">
                    {openFaq === i ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5" style={{ background: '#FFFFFF' }}>
                    <p className="text-sm text-muted leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Contact ───────────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 lg:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">Contact</p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">お問い合わせ</h2>
          </div>

          <form className="flex flex-col gap-5" onSubmit={e => e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted">お名前</label>
              <input
                type="text"
                placeholder="山田 太郎"
                className="w-full px-4 py-3 text-sm text-ink focus:outline-none"
                style={{ border: '1px solid #E2E2E2', borderRadius: 2 }}
                onFocus={e => (e.currentTarget.style.borderColor = '#1A1A1A')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E2E2E2')}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted">メールアドレス</label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 text-sm text-ink focus:outline-none"
                style={{ border: '1px solid #E2E2E2', borderRadius: 2 }}
                onFocus={e => (e.currentTarget.style.borderColor = '#1A1A1A')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E2E2E2')}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted">メッセージ</label>
              <textarea
                rows={5}
                placeholder="お問い合わせ内容をご記入ください"
                className="w-full px-4 py-3 text-sm text-ink focus:outline-none resize-none"
                style={{ border: '1px solid #E2E2E2', borderRadius: 2 }}
                onFocus={e => (e.currentTarget.style.borderColor = '#1A1A1A')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E2E2E2')}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: '#1A1A1A', color: '#FFFFFF', borderRadius: 2 }}
            >
              送信する
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
