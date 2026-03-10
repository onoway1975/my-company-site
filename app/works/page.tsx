import type { Metadata } from "next";
import { ContactSection } from "../components/ContactSection";
import { WorksGrid } from "./WorksGrid";
import { works } from "../data/works";
import { BodyPageType } from "../components/BodyPageType";

export const metadata: Metadata = {
  title: "Works",
  description:
    "シラフ株式会社の制作実績一覧。ウェブ制作、ブランディング、クリエイティブディレクション、受賞歴など。",
  alternates: {
    canonical: "https://ciraf.jp/works",
  },
  openGraph: {
    type: "website",
    title: "Works | ciraf inc.",
    description:
      "シラフ株式会社の制作実績一覧。ウェブ制作、ブランディング、クリエイティブディレクション、受賞歴など。",
    url: "https://ciraf.jp/works",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function WorksPage() {
  return (
    <>
      <BodyPageType type="works_list" />
      {/* ── Page Header ── */}
      <section className="pt-6 pb-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
          <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">Works</p>
          <h1 className="text-3xl md:text-5xl font-bold text-ink mb-6">実績</h1>
          <p className="text-base text-[#333333] leading-[1.9] max-w-lg">
            これまでに手がけたプロジェクトをご紹介します。
            <br className="hidden md:block" />
            A selection of projects and awards.
          </p>
        </div>
      </section>

      {/* ── Works Grid ── */}
      <section className="py-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-surface rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
          <WorksGrid works={works} />
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />
    </>
  );
}
