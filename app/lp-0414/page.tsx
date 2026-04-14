"use client";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

/* ─────────────────────────────────────────────
   1. ヒーロー（極大テキスト）
───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      className="min-h-screen flex flex-col justify-center bg-white"
      style={{ padding: "120px 40px" }}
    >
      <p className="text-xs tracking-[0.2em] text-[#999] uppercase mb-6 md:mb-8">
        Brand &times; Technology
      </p>
      <h1
        className="font-bold text-[#1A1A1A] leading-[1.05] tracking-tight"
        style={{ fontSize: "clamp(48px, 7vw, 120px)" }}
      >
        ブランドを、
        <br />
        もっと強くする。
      </h1>
      <p className="mt-8 md:mt-12 text-base md:text-lg text-[#555] leading-relaxed max-w-xl">
        戦略から実装まで。Web・映像・ブランディングを
        <br className="hidden md:block" />
        一気通貫でサポートします。
      </p>
    </section>
  );
}

/* ─────────────────────────────────────────────
   2. 画像＋テキスト（画像左）
───────────────────────────────────────────── */
function ImageTextLeftSection() {
  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* 画像 */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-[#E8E8E8] rounded-2xl aspect-[4/3] flex items-center justify-center">
            <span className="text-sm text-[#999]">IMAGE</span>
          </div>
        </div>

        {/* テキスト */}
        <div className="flex flex-col justify-center py-4 lg:py-12">
          <p className="text-xs tracking-[0.2em] text-[#999] uppercase mb-4">
            Service 01
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-snug mb-6">
            Webサイト制作
          </h2>
          <p className="text-sm md:text-base text-[#555] leading-[1.9] mb-8">
            デザインだけで終わらない、ビジネス成果に直結するWebサイトを制作します。
            戦略設計からUI/UXデザイン、実装・運用まで一貫して対応。
            お客様のブランド価値を最大化するWebサイトを、ワンストップでお届けします。
          </p>
          <div>
            <a
              href="/contact/"
              className="inline-block border border-[#1A1A1A] text-[#1A1A1A] text-sm tracking-[0.08em] px-8 py-3 rounded-full hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300"
            >
              詳しく見る →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. 画像＋テキスト（画像右）
───────────────────────────────────────────── */
function ImageTextRightSection() {
  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* テキスト */}
        <div className="flex flex-col justify-center py-4 lg:py-12 order-2 lg:order-1">
          <p className="text-xs tracking-[0.2em] text-[#999] uppercase mb-4">
            Service 02
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-snug mb-6">
            ブランディング・映像制作
          </h2>
          <p className="text-sm md:text-base text-[#555] leading-[1.9] mb-8">
            ロゴ・VI設計からブランドガイドライン策定、プロモーション映像まで。
            一貫したブランド体験をつくることで、顧客との信頼関係を構築します。
            「伝わる」だけでなく「選ばれる」ブランドへ。
          </p>
          <div>
            <a
              href="/contact/"
              className="inline-block border border-[#1A1A1A] text-[#1A1A1A] text-sm tracking-[0.08em] px-8 py-3 rounded-full hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300"
            >
              詳しく見る →
            </a>
          </div>
        </div>

        {/* 画像 */}
        <div className="lg:sticky lg:top-24 order-1 lg:order-2">
          <div className="bg-[#E8E8E8] rounded-2xl aspect-[4/3] flex items-center justify-center">
            <span className="text-sm text-[#999]">IMAGE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. 動画埋め込み
───────────────────────────────────────────── */
function VideoSection() {
  return (
    <section className="bg-[#1A1A1A] py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.2em] text-white/50 uppercase mb-4">
          Showreel
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-10">
          私たちの仕事
        </h2>
        <div className="rounded-2xl overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Showreel"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video"
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. 実績・数値
───────────────────────────────────────────── */
const stats = [
  { value: "150+", label: "累計プロジェクト数" },
  { value: "98%", label: "クライアント満足度" },
  { value: "12", label: "年の実績" },
  { value: "30+", label: "業界カバー数" },
];

function StatsSection() {
  return (
    <section className="bg-[#F4F4F4] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.2em] text-[#999] uppercase mb-4">
          Track Record
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-snug mb-12">
          数字で見る実績
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-8 text-center"
            >
              <p
                className={`${poppins.className} text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-3`}
              >
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-[#777]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. 料金プラン
───────────────────────────────────────────── */
const plans = [
  {
    name: "Light",
    price: "¥500,000〜",
    description: "小規模サイト・LP制作に最適",
    features: [
      "トップ＋下層5P以内",
      "レスポンシブ対応",
      "基本SEO設定",
      "納品後1ヶ月サポート",
    ],
    recommended: false,
  },
  {
    name: "Standard",
    price: "¥1,200,000〜",
    description: "コーポレートサイト・本格リニューアルに",
    features: [
      "トップ＋下層10P以内",
      "CMS導入",
      "アクセス解析設定",
      "ブランドガイドライン",
      "納品後3ヶ月サポート",
    ],
    recommended: true,
  },
  {
    name: "Premium",
    price: "¥2,500,000〜",
    description: "大規模サイト・ブランディング込みのフルパッケージ",
    features: [
      "ページ数無制限",
      "映像制作含む",
      "ブランド戦略策定",
      "運用コンサル",
      "納品後6ヶ月サポート",
    ],
    recommended: false,
  },
];

function PricingSection() {
  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.2em] text-[#999] uppercase mb-4">
          Pricing
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-snug mb-12">
          料金プラン
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col ${
                plan.recommended
                  ? "border-2 border-[#1A1A1A] relative"
                  : "border border-[#E2E2E2]"
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[10px] tracking-[0.15em] uppercase font-bold px-4 py-1 rounded-full">
                  Recommended
                </span>
              )}
              <p
                className={`${poppins.className} text-lg font-semibold text-[#1A1A1A] mb-1`}
              >
                {plan.name}
              </p>
              <p
                className={`${poppins.className} text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2`}
              >
                {plan.price}
              </p>
              <p className="text-xs text-[#777] mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-[#555]"
                  >
                    <span className="text-[#1A1A1A] mt-0.5">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/contact/"
                className={`block text-center text-sm tracking-[0.08em] px-6 py-3 rounded-full transition-colors duration-300 ${
                  plan.recommended
                    ? "bg-[#1A1A1A] text-white hover:opacity-85"
                    : "border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
                }`}
              >
                お問い合わせ →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   7. フッター
───────────────────────────────────────────── */
function LPFooter() {
  return (
    <footer className="bg-[#1A1A1A] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* ロゴ・概要 */}
          <div>
            <p
              className={`${poppins.className} text-xl font-bold text-white mb-3`}
            >
              ciraf inc.
            </p>
            <p className="text-sm text-white/50 leading-relaxed">
              シラフ株式会社
              <br />
              東京都渋谷区神宮前3-25-18
              <br />
              THE SHARE 205
            </p>
          </div>

          {/* ナビリンク */}
          <div>
            <p className="text-xs tracking-[0.15em] text-white/40 uppercase mb-4">
              Menu
            </p>
            <ul className="space-y-2">
              {[
                { label: "サービス", href: "/service/" },
                { label: "実績", href: "/works/" },
                { label: "会社概要", href: "/about/" },
                { label: "お問い合わせ", href: "/contact/" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* SNS */}
          <div>
            <p className="text-xs tracking-[0.15em] text-white/40 uppercase mb-4">
              Social
            </p>
            <ul className="space-y-2">
              {[
                { label: "Note", href: "https://note.com/ciraf" },
                {
                  label: "Instagram",
                  href: "https://instagram.com/ciraf_inc",
                },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p
            className={`${poppins.className} text-xs text-white/30 tracking-wider`}
          >
            &copy; 2025 ciraf inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function LP0414Page() {
  return (
    <div className={poppins.variable}>
      <HeroSection />
      <ImageTextLeftSection />
      <ImageTextRightSection />
      <VideoSection />
      <StatsSection />
      <PricingSection />
      <LPFooter />
    </div>
  );
}
