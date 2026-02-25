import type { Metadata } from "next";
import { ContactSection } from "../components/ContactSection";

export const metadata: Metadata = {
  title: "シラフについて",
  description:
    "シラフ株式会社について。私たちは、誰よりも、つくりたい人の味方です。",
};

const values = [
  {
    en: "Clarity",
    ja: "明確さ",
    description:
      "「シラフ」という名前には、素面（しらふ）——清醒で、澄んだ目で物事を見る——という意味が込められています。流行に流されず、本質を見つめ、本当に必要なものを一緒につくります。",
  },
  {
    en: "Craft",
    ja: "丁寧さ",
    description:
      "速さより、確かさを。一つひとつの仕事に向き合い、細部まで丁寧に仕上げることを大切にしています。小さなディテールが、全体の印象を変えると信じています。",
  },
  {
    en: "Partnership",
    ja: "伴走",
    description:
      "つくる人の隣に立ちます。制作者として関わるだけでなく、プロジェクトの成功を自分ごととして捉え、長期的な視点でご一緒します。",
  },
];

const awards = [
  {
    title: "CSS Design Awards SPECIAL KUDOS",
    sub: "Best UI Design、Best UX Design、Best Innovation",
  },
  {
    title: "CSS Design Awards SPECIAL KUDOS",
    sub: "Best UI Design、Best UX Design、Best Innovation",
  },
  { title: "Awwwards Honorable Mentions" },
  { title: "Wommy Awards Introduction Award シルバー" },
  { title: "Spike Asia Music部門入賞" },
  { title: "AD Stars 入賞（2部門）" },
  { title: "第8回キッズデザイン賞受賞" },
  { title: "AD Stars 2014 入賞" },
  { title: "AD Stars 2013 インタラクティブ部門入賞" },
  { title: "第66回広告電通賞インターネット優秀賞" },
  { title: "AD Stars 2013 ブロンズ" },
  { title: "AWWWards Site of the day" },
  { title: "AD Stars 2011 インタラクティブ部門入賞" },
  { title: "FWA Site of the day 2010/8/1受賞" },
  { title: "第5回企業ウェブグランプリ 地球環境とエコロジー部門優秀賞" },
  {
    title: "第4回企業ウェブグランプリ 社会貢献・メセナ部門グランプリ / RIAC特別賞",
  },
];

type InfoItem =
  | { label: string; value: string; items?: never }
  | { label: string; items: string[]; value?: never };

const info: InfoItem[] = [
  { label: "社名", value: "シラフ株式会社" },
  { label: "代表者", value: "尾上裕典" },
  { label: "資本金", value: "500万円" },
  {
    label: "事業内容",
    items: [
      "インターネットプロモーション、インタラクティブコンテンツの企画・制作・運営",
      "WEBサイトの企画・制作・運営",
      "マーケティング戦略の立案・実施",
      "TV・CM他、映像の企画・制作",
      "前各号に付帯する一切の業務",
    ],
  },
  {
    label: "所在地",
    value: "〒150-0001 東京都渋谷区神宮前3-25-18 205 THE SHARE",
  },
  { label: "電話", value: "03-4540-7546" },
  { label: "ファックス", value: "03-6671-3158" },
  {
    label: "主な取引先",
    value:
      "株式会社東急エージェンシー、花王株式会社、株式会社電通、株式会社電通パブリックリレーションズ、株式会社LIFULL、富士通エフ・オー・エム株式会社、伊藤忠インタラクティブ株式会社、株式会社デジタルガレージ、株式会社カカクコム、猿田彦珈琲株式会社、株式会社外為どっとコム、カゼプロ株式会社、電通アイソバー株式会社、E-グラフィックスコミュニケーションズ株式会社、エヌ・ティ・ティレゾナント株式会社、ネットイヤーグループ株式会社、株式会社ユニコン・アド、株式会社レインボージャパン、株式会社インタースペース、株式会社ヒューブリック、株式会社ネットワークインフォメーションセンター、灸PLUS、サカイデンタルクリニック（順不同）",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Page Header ── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-6">
            About
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-ink mb-8">
            シラフについて
          </h1>
          <p className="text-muted max-w-lg leading-relaxed text-sm">
            私たちは、誰よりも、つくりたい人の味方。
            <br />
            We are on the side of those who create, more than anyone else.
          </p>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-16 md:mb-20">
            Philosophy
          </p>
          <div className="max-w-2xl">
            {/* 冒頭タグライン */}
            <h2 className="text-2xl md:text-3xl font-light text-ink leading-relaxed mb-16">
              私たちは、誰よりも、
              <br />
              つくりたい人の味方。
            </h2>

            {/* 問い */}
            <p className="text-ink text-[0.95rem] leading-[2.2] mb-10">
              つくりたいものはある。
              <br />
              ただ、つくり方はわからない。
            </p>

            {/* 転換 */}
            <p className="text-xl md:text-2xl font-light text-ink leading-relaxed mb-12">
              じゃあ、つくり方からつくればいい。
            </p>

            {/* 変容 */}
            <p className="text-ink text-[0.95rem] leading-[2.2] mb-10">
              ハラハラする制約は、
              <br />
              見方と味方次第で、
              <br />
              ワクワクするプロジェクトに変わる。
            </p>

            {/* 約束 */}
            <p className="text-ink text-[0.95rem] leading-[2.2] mb-12">
              cirafは、デジタルを軸とした
              <br />
              プロデュースとディレクションの技術を通じて、
              <br />
              未知なるプロジェクトでさえも、
              <br />
              安心のプロセスマネジメント・
              <br />
              高度なクオリティ・
              <br />
              想像を上回る完成を約束します。
            </p>

            {/* 招待 */}
            <p className="text-ink text-[0.95rem] leading-[2.2] mb-16">
              ロマンある丸投げには、
              <br />
              &ldquo;シンクラフ&rdquo;に応えたい。
            </p>

            {/* 結びのタグライン */}
            <p className="text-2xl md:text-3xl font-light text-ink leading-relaxed">
              私たちは、誰よりも、
              <br />
              つくりたい人の味方。
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-16 md:mb-20">
            Our Values
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-border">
            {values.map((value, i) => (
              <div
                key={i}
                className={`py-10 ${i > 0 ? "md:pl-10" : ""} ${
                  i < values.length - 1
                    ? "border-b md:border-b-0 md:border-r border-border md:pr-10"
                    : ""
                }`}
              >
                <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-3">
                  {value.en}
                </p>
                <h3 className="text-xl font-light text-ink mb-5">
                  {value.ja}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards ── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-24">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-8">
              Awards
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-ink">
              受賞歴
            </h2>
          </div>
          <div>
            <ul className="border-t border-border">
              {awards.map((award, i) => (
                <li key={i} className="border-b border-border py-5">
                  <p className="text-ink text-[0.95rem]">{award.title}</p>
                  {award.sub && (
                    <p className="text-xs text-muted mt-1.5">{award.sub}</p>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted mt-5">※前職歴含む</p>
          </div>
        </div>
      </section>

      {/* ── Company Info ── */}
      <section className="py-24 md:py-36 px-6 lg:px-12 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-24">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-8">
              Company
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-ink">
              会社情報
            </h2>
          </div>
          <div>
            <dl className="border-t border-border">
              {info.map((item, i) => (
                <div
                  key={i}
                  className="border-b border-border py-5 grid grid-cols-[140px_1fr] gap-4"
                >
                  <dt className="text-xs text-muted pt-0.5">{item.label}</dt>
                  <dd className="text-sm text-ink">
                    {item.items ? (
                      <ol className="space-y-1.5">
                        {item.items.map((line, j) => (
                          <li key={j} className="flex gap-2 leading-relaxed">
                            <span className="text-muted shrink-0">{j + 1}.</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />
    </>
  );
}
