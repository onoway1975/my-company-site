import type { Metadata } from "next";
import { ContactSection } from "../components/ContactSection";
import { BodyPageType } from "../components/BodyPageType";

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
      '「シラフ」という名前は、"シンク"＋"ラフ"から生まれました。広告・制作の現場で心身をすり減らす人が多かった時代、本来つくる側は笑顔で、楽しく、ワクワクしながら考えるべきだと思いました。酔わずに、冷静に、でもワクワクしながら考える——そんな姿勢を込めた名前です。',
  },
  {
    en: "Craft",
    ja: "丁寧さ",
    description:
      "速さは、愛。丁寧さも、愛。期待を超えるスピードで動きながら、細部まで手を抜かない。小さなディテールが、全体の印象を変えると信じています。",
  },
  {
    en: "Partnership",
    ja: "伴走",
    description:
      "つくる人の隣に、ホスピタリティと共に立ちます。制作者として関わるだけでなく、プロジェクトの成功を自分ごととして捉え、レスポンスの速さと細部への丁寧さを大切にしながら、長期的な視点でご一緒します。",
  },
];

const awards = [
  { title: "FWA Site of the day" },
  { title: "AWWWards Site of the day" },
  { title: "Awwwards Honorable Mentions" },
  {
    title: "CSS Design Awards SPECIAL KUDOS",
    sub: "Best UI Design、Best UX Design、Best Innovation",
  },
  { title: "Wommy Awards Introduction Award シルバー" },
  { title: "Spike Asia Music部門入賞" },
  { title: "AD Stars 2015 入賞（2部門）" },
  { title: "AD Stars 2014 入賞" },
  { title: "AD Stars 2013 インタラクティブ部門入賞" },
  { title: "AD Stars 2013 ブロンズ" },
  { title: "AD Stars 2011 インタラクティブ部門入賞" },
  { title: "第8回キッズデザイン賞受賞" },
  { title: "第66回広告電通賞インターネット優秀賞" },
  { title: "第5回企業ウェブグランプリ 地球環境とエコロジー部門優秀賞" },
  { title: "第4回企業ウェブグランプリ 社会貢献・メセナ部門グランプリ / RIAC特別賞" },
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
      "株式会社東急エージェンシー、株式会社マッキャン・ワールドグループ ホールディングス、株式会社コネル、株式会社越境、花王株式会社、株式会社電通、株式会社電通パブリックリレーションズ、株式会社LIFULL、富士通エフ・オー・エム株式会社、伊藤忠インタラクティブ株式会社、株式会社デジタルガレージ、株式会社カカクコム、猿田彦珈琲株式会社、株式会社外為どっとコム、カゼプロ株式会社、電通アイソバー株式会社、E-グラフィックスコミュニケーションズ株式会社、エヌ・ティ・ティレゾナント株式会社、ネットイヤーグループ株式会社、株式会社ユニコン・アド、株式会社レインボージャパン、株式会社インタースペース、株式会社ヒューブリック、株式会社ネットワークインフォメーションセンター、灸PLUS、サカイデンタルクリニック（順不同）",
  },
];

export default function AboutPage() {
  return (
    <>
      <BodyPageType type="about" />
      {/* ── Page Header ── */}
      <section className="pt-6 pb-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
          <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
            About
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-ink mb-6">
            シラフについて
          </h1>
          <p className="text-base text-[#333333] leading-[1.9] max-w-lg">
            私たちは、誰よりも、つくりたい人の味方。
            <br />
            We are on the side of those who create, more than anyone else.
          </p>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="py-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-surface rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
          <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
            Philosophy
          </p>
          <div className="max-w-2xl">
            {/* 冒頭タグライン */}
            <h2 className="text-2xl md:text-3xl font-bold text-ink leading-relaxed mb-12">
              私たちは、誰よりも、
              <br />
              つくりたい人の味方。
            </h2>

            {/* 問い */}
            <p className="text-base text-[#333333] leading-[2.2] mb-10">
              つくりたいものはある。
              <br />
              ただ、つくり方はわからない。
            </p>

            {/* 転換 */}
            <p className="text-xl md:text-2xl font-bold text-ink leading-relaxed mb-12">
              じゃあ、つくり方からつくればいい。
            </p>

            {/* 変容 */}
            <p className="text-base text-[#333333] leading-[2.2] mb-10">
              ハラハラする制約は、
              <br />
              見方と味方次第で、
              <br />
              ワクワクするプロジェクトに変わる。
            </p>

            {/* 約束 */}
            <p className="text-base text-[#333333] leading-[2.2] mb-12">
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
            <p className="text-base text-[#333333] leading-[2.2] mb-16">
              ロマンある丸投げには、
              <br />
              &ldquo;シンクラフ&rdquo;に応えたい。
            </p>

            {/* 結びのタグライン */}
            <p className="text-2xl md:text-3xl font-bold text-ink leading-relaxed">
              私たちは、誰よりも、
              <br />
              つくりたい人の味方。
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-surface rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
          <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
            Our Values
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-10">
            私たちの価値観
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-white rounded-[1.25rem] border border-[#e8e8e8] p-8"
              >
                <p className="text-xs tracking-[0.15em] text-ink uppercase mb-3">
                  {value.en}
                </p>
                <h3 className="text-xl font-bold text-ink mb-5">
                  {value.ja}
                </h3>
                <p className="text-sm text-[#333333] leading-[1.9]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards ── */}
      <section className="py-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-24">
            <div>
              <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
                Awards
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-ink">
                受賞歴
              </h2>
            </div>
            <div>
              <ul>
                {awards.map((award, i) => (
                  <li
                    key={i}
                    className="border-b border-dashed border-[#e2e2e2] py-5"
                  >
                    <p className="text-ink text-[0.95rem]">{award.title}</p>
                    {award.sub && (
                      <p className="text-xs text-muted mt-1">{award.sub}</p>
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted mt-5">※前職歴含む</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Company Info ── */}
      <section className="py-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-24">
            <div>
              <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
                Company
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-ink">
                会社情報
              </h2>
            </div>
            <div>
              <dl>
                {info.map((item, i) => (
                  <div
                    key={i}
                    className="border-b border-dashed border-[#e2e2e2] py-5 grid grid-cols-[140px_1fr] gap-4"
                  >
                    <dt className="text-xs text-muted pt-0.5">{item.label}</dt>
                    <dd className="text-sm text-[#333333] leading-relaxed">
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
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />
    </>
  );
}
