import Link from "next/link";
import { ContactSection } from "./components/ContactSection";

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

const works = [
  {
    category: "Award",
    title: "Good Design Award 2024",
    year: "2024",
  },
  {
    category: "Web",
    title: "株式会社○○ コーポレートサイト",
    year: "2024",
  },
  {
    category: "Branding",
    title: "○○ブランドリニューアル",
    year: "2023",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-between px-6 lg:px-12 py-16 md:py-20 border-b border-border">
        <div className="max-w-7xl mx-auto w-full">
          <p className="text-[10px] tracking-[0.3em] text-muted uppercase">
            ciraf inc.
          </p>
        </div>

        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-[clamp(2.2rem,5.5vw,5rem)] font-light leading-[1.2] tracking-tight text-ink mb-8">
            私たちは、誰よりも、
            <br />
            つくりたい人の味方。
          </h1>
          <p className="text-sm md:text-base text-muted max-w-md leading-relaxed">
            We are on the side of those who create,
            <br />
            more than anyone else.
          </p>
        </div>

        <div className="max-w-7xl mx-auto w-full flex justify-between items-end">
          <Link
            href="/about"
            className="text-xs tracking-[0.2em] text-muted uppercase hover:text-ink transition-colors duration-200"
          >
            Learn more
          </Link>
          <span className="text-[10px] tracking-widest text-muted uppercase">
            Scroll
          </span>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-24 items-start">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-8">
              Our Mission
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-ink leading-relaxed">
              つくることを、
              <br />
              もっと自由に。
            </h2>
          </div>
          <div className="pt-0 md:pt-12">
            <p className="text-ink leading-[2] mb-8 text-[0.95rem]">
              シラフ株式会社は、クリエイターとその作品を支えるための会社です。ウェブ、ブランディング、コンサルティングを通じて、つくりたい人のビジョンを形にするお手伝いをしています。
            </p>
            <p className="text-sm text-muted leading-[2]">
              ciraf inc. supports creators and their work through web, branding,
              and consulting. We help turn the visions of those who want to
              create into reality.
            </p>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-16 md:mb-20">
            <div>
              <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-4">
                Service
              </p>
              <h2 className="text-2xl md:text-3xl font-light text-ink">
                サービス
              </h2>
            </div>
            <Link
              href="/service"
              className="text-xs tracking-[0.15em] text-muted uppercase hover:text-ink transition-colors duration-200 hidden md:block"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-border">
            {services.map((service, i) => (
              <div
                key={i}
                className="border-b border-r border-border p-8"
              >
                <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-3">
                  {service.en}
                </p>
                <h3 className="text-lg font-light text-ink mb-5">
                  {service.ja}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  {service.description}
                </p>
                <p className="text-[10px] tracking-[0.1em] text-muted">
                  {service.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 md:hidden">
            <Link
              href="/service"
              className="text-xs tracking-[0.15em] text-muted uppercase hover:text-ink transition-colors duration-200"
            >
              View all &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Works ── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-16 md:mb-20">
            <div>
              <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-4">
                Works
              </p>
              <h2 className="text-2xl md:text-3xl font-light text-ink">
                実績・受賞歴
              </h2>
            </div>
            <Link
              href="/works"
              className="text-xs tracking-[0.15em] text-muted uppercase hover:text-ink transition-colors duration-200 hidden md:block"
            >
              View all &rarr;
            </Link>
          </div>

          <ul className="border-t border-border">
            {works.map((work, i) => (
              <li
                key={i}
                className="border-b border-border py-7 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4"
              >
                <div className="flex items-baseline gap-8">
                  <p className="text-[10px] tracking-[0.2em] text-muted uppercase w-20 shrink-0">
                    {work.category}
                  </p>
                  <p className="text-ink text-[0.95rem]">{work.title}</p>
                </div>
                <p className="text-xs text-muted tracking-widest pl-28 sm:pl-0">
                  {work.year}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 md:hidden">
            <Link
              href="/works"
              className="text-xs tracking-[0.15em] text-muted uppercase hover:text-ink transition-colors duration-200"
            >
              View all &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />
    </>
  );
}
