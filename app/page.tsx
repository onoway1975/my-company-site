import Image from "next/image";
import Link from "next/link";
import { Button } from "./components/Button";
import { ContactSection } from "./components/ContactSection";
import { NoteSection } from "./components/NoteSection";
import { works } from "./data/works";
import { HeroChat } from "./components/HeroChat";
import { BodyPageType } from "./components/BodyPageType";

const services = [
  {
    en: "Planning",
    ja: "企画",
    description:
      "目的達成のための体験・情報構造を企画し、UXの全体像をワイヤーフレーム・導線設計に落とし込みます。",
    note: "UX Planning, Strategy",
  },
  {
    en: "Design",
    ja: "設計",
    description:
      "UIデザイン・ビジュアル設計を通じて、ブランドの一貫性を維持しながら実装を見据えたデザインを作り込みます。",
    note: "Art Direction, UI/UX, Identity",
  },
  {
    en: "Production",
    ja: "制作",
    description:
      "Webサイト・アプリ・映像など、目的に合わせた技術スタックでフロントエンドからバックエンドまで一貫して実装します。",
    note: "Frontend, Systems, Video",
  },
  {
    en: "Operation",
    ja: "運用",
    description:
      "サイト・SNS・映像を一体で運用し、データに基づいた改善で継続的な成果創出を支援します。",
    note: "SEO, Analytics, PDCA",
  },
];

export default function Home() {
  return (
    <>
      <BodyPageType type="top" />
      {/* ── Hero ── */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col px-6 lg:px-12 py-16 md:py-20">
        <div className="flex-1 flex flex-col justify-center gap-10 md:gap-12 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-[clamp(1.75rem,4vw,4.5rem)] font-bold leading-[1.2] tracking-tight text-ink mb-8">
              私たちは、誰よりも、
              <br />
              つくりたい人の味方。
            </h1>
            <p className="text-base text-[#333333] leading-[1.9] max-w-md">
              We are on the side of those who create,
              <br />
              more than anyone else.
            </p>
          </div>

          <HeroChat />
        </div>

      </section>

      {/* ── Works ── */}
      <section className="py-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-surface rounded-[2rem] px-8 md:px-12 py-16 md:py-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 md:mb-12">
            <div>
              <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">Works</p>
              <h2 className="text-2xl md:text-3xl font-bold text-ink">実績</h2>
            </div>
            <Button
              href="/works"
              data-gtm-click="internal_link"
              data-gtm-location="works_section"
              data-gtm-label="view_all"
            >View all</Button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {works.slice(0, 4).map((work) => (
              <Link
                key={work.slug}
                href={`/works/${work.slug}`}
                data-gtm-click="internal_link"
                data-gtm-location="works_section"
                data-gtm-label={work.slug}
                className="group bg-white border border-[#e8e8e8] rounded-[1.25rem] p-5 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className="overflow-hidden rounded-[0.75rem] aspect-[4/3] bg-surface mb-4">
                  {work.thumbnail ? (
                    <Image
                      src={work.thumbnail}
                      alt={work.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover object-center"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <span className="text-[9px] tracking-widest text-muted uppercase">ciraf</span>
                    </div>
                  )}
                </div>
                {/* Text */}
                <p className="text-[0.75rem] tracking-[0.1em] text-[#888888] uppercase mb-1">
                  {work.category.join(" / ")}
                </p>
                <h3 className="text-base font-bold text-ink">{work.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── News / Note ── */}
      <NoteSection />

      {/* ── Mission ── */}
      <section className="py-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] px-8 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-24 items-start">
            <div>
              <p className="text-xs tracking-[0.15em] text-ink uppercase mb-8">
                Mission
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-ink leading-snug">
                ロマンある丸投げには、
                <br />
                &ldquo;シンクラフ&rdquo;に応えたい。
              </h2>
            </div>
            <div className="pt-0 md:pt-12">
              <p className="text-base text-[#333333] leading-[1.9] mb-8">
                アイデアの種を、形にするまで。Web制作・ブランディング・映像制作など、企画・設計・制作・運用のすべてを、つくりたい人の隣で担います。
              </p>
              <p className="text-base text-[#333333] leading-[1.9]">
                From the first spark of an idea to its final form. Web production, branding, video, and beyond — we walk alongside creators through every stage of planning, design, development, and operation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-surface rounded-[2rem] px-8 md:px-12 py-16 md:py-24">
          <div className="flex items-center justify-between mb-16 md:mb-20">
            <div>
              <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
                Service
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-ink">
                サービス
              </h2>
            </div>
            <Button href="/service" className="hidden md:inline-flex">View all</Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, i) => (
              <div
                key={i}
                className="bg-white rounded-[1.25rem] border border-[#e8e8e8] p-8"
              >
                <p className="text-xs tracking-[0.15em] text-ink uppercase mb-3">
                  {service.en}
                </p>
                <h3 className="text-xl font-bold text-ink mb-5">
                  {service.ja}
                </h3>
                <p className="text-sm text-[#333333] leading-[1.9] mb-4">
                  {service.description}
                </p>
                <p className="text-[10px] tracking-[0.1em] text-muted">
                  {service.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 md:hidden">
            <Button href="/service">View all</Button>
          </div>

          {/* Best Team Building */}
          <div className="mt-16 md:mt-20 border-t border-border pt-16 md:pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-24">
              <div>
                <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
                  Best Team Building
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-ink leading-snug">
                  仲間が増えカタチになっていく安心感
                </h3>
              </div>
              <div>
                <p className="text-base text-[#333333] leading-[1.9] mb-8">
                  デジタルクリエイティブ黎明期から20年で培われたプロを知っているプロさらにプロと繋がる好奇心。多種多様なプロフェッショナルの方々とのコネクションを武器にプロジェクト毎にカスタマイズしたベストチームを作ります。
                </p>
                <p className="text-sm text-[#333333] leading-[1.9] mb-8">
                  ロマンある丸投げはもちろん、ご希望のフェーズからもシンクラフにお答えします。
                </p>
                <div>
                  <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
                    Partner
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "マーケティングプランナー",
                      "メディアプランナー",
                      "PRプランナー",
                      "テクニカルディレクター",
                      "アプリケーションエンジニア",
                      "システムエンジニア",
                      "フロントエンジニア",
                      "アートディレクター",
                      "グラフィックデザイナー",
                      "WEBデザイナー",
                      "イラストレーター",
                      "ライター",
                      "編集者",
                      "フィルムディレクター",
                      "ヘアー・メイクアップ",
                      "スタイリスト",
                      "フォトグラファー",
                      "音楽プロデューサー",
                      "キャスティング",
                      "and more...",
                    ].map((partner) => (
                      <span
                        key={partner}
                        className="text-xs text-[#333333] border border-border rounded-full px-3 py-1"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />
    </>
  );
}
