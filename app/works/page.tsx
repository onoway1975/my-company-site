import type { Metadata } from "next";
import { ContactSection } from "../components/ContactSection";

export const metadata: Metadata = {
  title: "実績・受賞歴",
  description:
    "シラフ株式会社の実績・受賞歴。ウェブ制作、ブランディング、受賞歴など。",
};

type Work = {
  category: string;
  title: string;
  titleEn?: string;
  client?: string;
  year: string;
  description?: string;
  tags?: string[];
};

const works: Work[] = [
  {
    category: "Award",
    title: "グッドデザイン賞 2024",
    titleEn: "Good Design Award 2024",
    year: "2024",
    description:
      "ウェブサイトのデザインと情報設計において、グッドデザイン賞を受賞。",
    tags: ["Award", "Web"],
  },
  {
    category: "Web",
    title: "株式会社○○ コーポレートサイトリニューアル",
    titleEn: "○○ Corporation — Corporate Website Renewal",
    client: "株式会社○○",
    year: "2024",
    description:
      "情報設計の見直しから始まり、ビジュアルデザイン・フロントエンド開発まで一貫して担当。ブランドの新たな表情を提案しました。",
    tags: ["Web", "Design", "Development"],
  },
  {
    category: "Branding",
    title: "○○スタジオ ブランドアイデンティティ構築",
    titleEn: "○○ Studio — Brand Identity",
    client: "○○スタジオ",
    year: "2024",
    description:
      "新規スタジオのロゴ、カラーシステム、タイポグラフィ選定、ブランドガイドライン策定を担当。",
    tags: ["Branding", "Identity"],
  },
  {
    category: "Web",
    title: "○○ギャラリー ウェブサイト制作",
    titleEn: "○○ Gallery — Website",
    client: "○○ギャラリー",
    year: "2023",
    description:
      "アートギャラリーのウェブサイト。展覧会情報とアーカイブを中心とした情報設計で、作品が引き立つシンプルな設計を実現。",
    tags: ["Web", "Design"],
  },
  {
    category: "Consulting",
    title: "○○プロジェクト クリエイティブディレクション",
    titleEn: "○○ Project — Creative Direction",
    client: "—",
    year: "2023",
    description:
      "新サービス立ち上げに際するクリエイティブ全般のディレクション。コンセプト策定から制作会社選定・進行管理まで担当。",
    tags: ["Consulting", "Direction"],
  },
  {
    category: "Branding",
    title: "○○ブランド リニューアル",
    titleEn: "○○ Brand — Renewal",
    client: "○○株式会社",
    year: "2023",
    description:
      "老舗ブランドのアイデンティティリニューアル。歴史を尊重しながら、現代的な表現へとアップデートしました。",
    tags: ["Branding", "Identity"],
  },
];

export default function WorksPage() {
  return (
    <>
      {/* ── Page Header ── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-6">
            Works
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-ink mb-8">
            実績・受賞歴
          </h1>
          <p className="text-muted max-w-lg leading-relaxed text-sm">
            これまでに手がけたプロジェクト、受賞歴をご紹介します。
            <br className="hidden md:block" />
            A selection of projects and awards.
          </p>
        </div>
      </section>

      {/* ── Works List ── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 border-b border-border">
        <div className="max-w-7xl mx-auto">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[120px_1fr_80px] gap-8 pb-4 border-b border-border mb-0">
            <p className="text-[10px] tracking-[0.2em] text-muted uppercase">
              Category
            </p>
            <p className="text-[10px] tracking-[0.2em] text-muted uppercase">
              Title
            </p>
            <p className="text-[10px] tracking-[0.2em] text-muted uppercase text-right">
              Year
            </p>
          </div>

          {/* Works */}
          <ul>
            {works.map((work, i) => (
              <li
                key={i}
                className="border-b border-border py-10 group"
              >
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_80px] gap-4 md:gap-8">
                  {/* Category */}
                  <p className="text-[10px] tracking-[0.2em] text-muted uppercase pt-1">
                    {work.category}
                  </p>

                  {/* Content */}
                  <div>
                    <h2 className="text-ink text-[0.95rem] mb-1">
                      {work.title}
                    </h2>
                    {work.titleEn && (
                      <p className="text-xs text-muted mb-4">{work.titleEn}</p>
                    )}
                    {work.description && (
                      <p className="text-sm text-muted leading-relaxed max-w-2xl">
                        {work.description}
                      </p>
                    )}
                    {work.tags && (
                      <div className="flex flex-wrap gap-2 mt-5">
                        {work.tags.map((tag, j) => (
                          <span
                            key={j}
                            className="text-[9px] tracking-[0.15em] uppercase border border-border text-muted px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Year */}
                  <p className="text-xs text-muted tracking-widest md:text-right">
                    {work.year}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />
    </>
  );
}
