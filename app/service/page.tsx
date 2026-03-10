import type { Metadata } from "next";
import Image from "next/image";
import { ContactSection } from "../components/ContactSection";
import { BodyPageType } from "../components/BodyPageType";

export const metadata: Metadata = {
  title: "サービス",
  description:
    "シラフ株式会社のサービス。企画・設計・制作・運用の4フェーズで、つくりたい人のビジョンを形にします。",
};

const services = [
  {
    index: "01",
    en: "Planning",
    ja: "企画",
    lead: "体験と構造の骨格を設計するフェーズ。",
    description:
      "目的達成のために必要な体験・情報構造を企画し、UXの全体像を描きます。\nワイヤーフレーム、トーン、導線設計を通じて、設計に落とし込みます。",
    scope: [
      "ブランド設計・コンセプト開発（ブランディング）",
      "UXプランニング・情報設計",
      "コンテンツ構成・ストーリーボード設計",
      "デザインガイドライン策定",
    ],
    consultations: [
      "ブランドやサービスの世界観を整理したい",
      "UX改善の方向性を相談したい",
      "新規事業・プロダクトの初期設計を支援してほしい",
    ],
  },
  {
    index: "02",
    en: "Design",
    ja: "設計",
    lead: "情報とデザインを融合し、体験を具体化するフェーズ。",
    description:
      "UIデザイン、情報設計、ビジュアル設計を通じて、\n実装を見据えたデザインを作り込みます。ブランドの一貫性を維持しながら、使いやすさを追求します。",
    scope: [
      "アートディレクション",
      "CI/VI開発（ロゴ・ビジュアルアイデンティティ）",
      "UI/UXデザイン",
      "グラフィックデザイン / キービジュアル設計",
      "コンテンツプロダクション設計（撮影・キャスティング・モーション設計）",
    ],
    consultations: [
      "ブランドのトーンを体験に落とし込みたい",
      "サービスUIを再設計したい",
      "複数メディアで統一感を出したい",
    ],
  },
  {
    index: "03",
    en: "Production",
    ja: "制作",
    lead: "デザインを機能として実装し、プロダクトを形にするフェーズ。",
    description:
      "Webサイト、アプリ、システムなど、目的に合わせた技術スタックで実装します。\nフロントエンドからバックエンドまで一気通貫で対応可能です。",
    scope: [
      "フロントエンド開発（Next.js / TypeScript）",
      "システム・アプリ開発",
      "CMS導入・開発",
      "ECサイト構築・運営支援",
      "映像制作 / モーショングラフィックス / 撮影ディレクション（動画制作）",
      "グラフィック制作・印刷物デザイン",
    ],
    consultations: [
      "デザインを高い再現度で実装したい",
      "Webと動画を連動させたキャンペーンを行いたい",
      "ビジュアル・UI・演出を一貫した世界観で作りたい",
    ],
  },
  {
    index: "04",
    en: "Operation",
    ja: "運用",
    lead: "公開後の改善・拡張を通して、成果を高め続けるフェーズ。",
    description:
      "サイト・アプリ・映像・SNSを一体で運用し、データに基づいた改善を行います。\n制作して終わりではなく、継続的な成果創出を支援します。",
    scope: [
      "コンテンツ更新・SEO対策",
      "SNS運用・動画リメイク / ショート動画最適化",
      "GA4/GSC分析・ABテスト設計",
      "改善PDCA・EC運用・CRM連携",
    ],
    consultations: [
      "公開後の効果を数値で見たい",
      "継続的な改善を伴走してほしい",
      "SNS・動画も含めた運用をまとめて相談したい",
    ],
  },
];

export default function ServicePage() {
  return (
    <>
      <BodyPageType type="service" />
      {/* ── Page Header ── */}
      <section className="pt-6 pb-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
          <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
            Service
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-ink mb-6">
            サービス
          </h1>
          <p className="text-base text-[#333333] leading-[1.9] max-w-lg">
            企画・設計・制作・運用の4フェーズで、
            <br className="hidden md:block" />
            つくりたい人のビジョンを形にするお手伝いをします。
          </p>
        </div>
      </section>

      {/* ── Service Detail ── */}
      {services.map((service, i) => (
        <section key={i} className="py-3 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto bg-surface rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-24">
              {/* Left */}
              <div>
                <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
                  {service.index} — {service.en}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6">
                  {service.ja}
                </h2>
                <p className="text-sm text-[#333333] leading-relaxed">
                  {service.lead}
                </p>
              </div>

              {/* Right */}
              <div>
                {/* Description */}
                <p className="text-base text-[#333333] leading-[1.9] mb-12 whitespace-pre-line">
                  {service.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  {/* Scope */}
                  <div>
                    <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
                      主なサービス項目
                    </p>
                    <ul className="space-y-3">
                      {service.scope.map((item, j) => (
                        <li
                          key={j}
                          className="text-sm text-[#333333] leading-relaxed flex items-baseline gap-2"
                        >
                          <span className="shrink-0 text-muted">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Consultations */}
                  <div>
                    <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
                      よくある相談
                    </p>
                    <ul className="space-y-3">
                      {service.consultations.map((item, j) => (
                        <li
                          key={j}
                          className="text-sm text-[#333333] leading-relaxed flex items-baseline gap-2"
                        >
                          <span className="shrink-0 text-muted">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Best Team Building ── */}
      <section className="py-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
          {/* Header */}
          <div className="mb-12 md:mb-16">
            <p className="text-xs tracking-[0.15em] text-ink uppercase mb-5">
              Best Team Building
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink leading-snug mb-6">
              仲間が増えカタチになっていく安心感
            </h2>
            <p className="text-base text-[#333333] leading-[1.9] max-w-2xl">
              デジタルクリエイティブ黎明期から20年で培われたプロを知っているプロさらにプロと繋がる好奇心。多種多様なプロフェッショナルの方々とのコネクションを武器にプロジェクト毎にカスタマイズしたベストチームを作ります。
            </p>
          </div>

          {/* Diagram image */}
          <div className="flex justify-center mb-12 md:mb-16">
            <Image
              src="/images/team-diagram.png"
              alt="Best Team Building diagram"
              width={600}
              height={400}
              className="w-full max-w-[600px] h-auto"
            />
          </div>

          {/* Sub text */}
          <p className="text-sm text-[#333333] leading-[1.9] mb-10 md:mb-12">
            ロマンある丸投げはもちろん、ご希望のフェーズからもシンクラフにお答えします。
          </p>

          {/* Partner list */}
          <div>
            <p className="text-xs tracking-[0.15em] text-ink uppercase mb-5">
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
      </section>

      {/* ── Contact ── */}
      <ContactSection />
    </>
  );
}
