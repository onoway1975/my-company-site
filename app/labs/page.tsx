import type { Metadata } from "next";
import Image from "next/image";
import { ContactSection } from "../components/ContactSection";
import { Button } from "../components/Button";

export const metadata: Metadata = {
  title: "Labs",
  description:
    "シラフが自分たちで作ったプロダクト。実験と好奇心から生まれたツールたち。",
  alternates: {
    canonical: "https://ciraf.jp/labs/",
  },
  openGraph: {
    url: "https://ciraf.jp/labs/",
  },
};

const products = [
  {
    label: "FLOWER MAIL",
    title: "flower mail",
    image: "/flowermail/ogp.jpg",
    url: "/flowermail/",
    lead: "相手の名前と、どんな人か・感謝していること・雰囲気を入力するだけで、AIがその人だけのブーケを束ねて1枚の画像にして贈れる。言葉にしにくい気持ちを、花の言葉に変えてくれるデジタルフラワーギフト。",
    features: [
      "相手のイメージや雰囲気をテキストで入力",
      "AIがその人だけのブーケを生成",
      "画像として保存・シェア可能",
      "贈り主の名前を添えて送れる",
    ],
    tags: ["Next.js", "FAL.ai", "Claude API"],
  },
  {
    label: "FOG MAIL",
    title: "fog mail",
    image: "/fogmail/ogp.jpg",
    url: "/fogmail/",
    lead: "結露した窓ガラスに息を吹きかけ、指でメッセージを書いてURLで送る。受け取った相手が開くと、同じ窓に文字が再現される。メッセージは10分で消える。スマートフォン専用のデジタル手紙。",
    features: [
      "結露した窓に指でメッセージを書ける",
      "固有URLを発行してLINE・メールで送れる",
      "受け取った相手の画面に同じ文字が再現される",
      "10分後に自動で消える、一度きりの体験",
    ],
    tags: ["Next.js", "Supabase", "Canvas API"],
  },
  {
    label: "TENSHOKU",
    title: "天職占い",
    image: "/tenshoku/ogp.jpg",
    url: "/tenshoku/",
    lead: "自撮り写真をアップロードするだけで、AIが天職を診断してその職業シーンに顔を合成した画像を生成。医師・起業家・デザイナーなど12職種から、あなたの天職を判定する。",
    features: [
      "生年月日・性別・5問の質問で天職を診断",
      "自分の顔が天職シーンに合成された画像を生成",
      "結果画像をダウンロード・保存",
      "1日50回限定",
    ],
    tags: ["Next.js", "FAL.ai", "Claude API", "Upstash Redis"],
  },
  {
    label: "WEATHER MUSIC",
    title: "Weather Music",
    image: "/weathermusic/ogp.jpg",
    url: "/weathermusic/",
    lead: "現在地の天気を自動取得して、その空気感に合ったプレイリストをAIが自動生成。晴れの日・雨の日・嵐の日、それぞれの天気に合う音楽を30秒プレビューで試聴し、Apple Musicで全曲聴ける。",
    features: [
      "GPSで現在地の天気をリアルタイム取得",
      "天気に合ったプレイリストを自動生成",
      "30秒プレビューでその場で試聴",
      "Apple Musicへのリンクで全曲視聴",
    ],
    tags: ["Next.js", "Open-Meteo API", "iTunes Search API"],
  },
  {
    label: "DROP YOUR BARS",
    title: "Drop Your Bars",
    image: "/dyb/ogp.jpg",
    url: "/dyb/",
    lead: "日本語のパンチライン（100字以内）を投稿すると、Claude APIが韻を分析してスコアを算出。踏んでいる韻がカラーハイライトで可視化され、ランキングで他の投稿者と競い合える。ヒップホップ文化に着想を得た言葉遊びSNS。",
    features: [
      "100字以内のパンチラインを投稿",
      "韻の場所をカラーで自動ハイライト表示",
      "韻の数・文字数からスコアを算出",
      "リアルタイムランキングで競争",
    ],
    tags: ["Next.js", "Claude API", "Supabase"],
  },
  {
    label: "MENU CARD",
    title: "Menu Card",
    image: "/menucard/ogp.jpg",
    url: "/menucard/",
    lead: "GoogleスプレッドシートをCMSとして使うメニューページ。APIキー不要。スプレッドシートのURLを貼り付けるだけで自分のデータに切り替わる。飲食店・ショップのメニュー管理を、エンジニアなしで実現。",
    features: [
      "Googleスプレッドシートをそのままデータソースに使用",
      "URLを変えるだけで誰でも自分のメニューに切り替え可能",
      "カテゴリ・商品名・価格・説明・画像URLを管理",
      "APIキー・サーバー設定不要",
    ],
    tags: ["Next.js", "Google Sheets CSV"],
  },
  {
    label: "PUNIMOJI",
    title: "ぷに文字メーカー",
    image: "/punimoji/ogp.png",
    url: "/punimoji/",
    lead: "好きな言葉（1〜5文字）を入力すると、AIがぷっくり3Dバルーン文字の透過PNGを生成。ひらがな・カタカナ・漢字・アルファベットに対応。インスタストーリーにそのまま貼れるサイズで書き出せる。",
    features: [
      "ひらがな・カタカナ・漢字・アルファベットに対応",
      "ぷに／ぷるぷる／キャンディ／メタリック／バブルガムの5スタイル",
      "背景透過のPNG形式で出力",
      "インスタストーリー・LINE・Discordにそのまま使える",
    ],
    tags: ["Next.js", "FAL.ai", "Nano Banana 2", "Upstash Redis"],
  },
];

export default function LabsPage() {
  return (
    <>
      {/* ── Page Header ── */}
      <section className="pt-6 pb-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
          <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
            Labs
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-ink mb-6">
            Labs
          </h1>
          <p className="text-base text-[#333333] leading-[1.9] max-w-lg">
            シラフが自分たちで作ったプロダクト。
            <br className="hidden md:block" />
            実験と好奇心から生まれたツールたち。
          </p>
        </div>
      </section>

      {/* ── Products ── */}
      {products.map((product, i) => (
        <section key={i} className="py-3 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto bg-surface rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-24">
              {/* Left */}
              <div>
                <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
                  {product.label}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">
                  {product.title}
                </h2>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-[#e8e8e8]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right */}
              <div>
                {/* Lead */}
                <p className="text-base text-[#333333] leading-[1.9] mb-12">
                  {product.lead}
                </p>

                {/* Features */}
                <div className="mb-10">
                  <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
                    できること
                  </p>
                  <ul className="space-y-3">
                    {product.features.map((item, j) => (
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

                {/* Tags + CTA */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-[#333333] border border-border rounded-full px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button href={product.url} external>サイトを見る</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Contact ── */}
      <ContactSection />
    </>
  );
}
