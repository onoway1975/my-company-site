import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TOUCH LAB | 指で触れる、見えない法則。| ciraf inc.",
  description:
    "数学や科学にひそむ法則を、指で触りながら出会えるWeb実験室。",
  alternates: {
    canonical: "https://ciraf.jp/touchlab/",
  },
  openGraph: {
    title: "TOUCH LAB | 指で触れる、見えない法則。",
    description:
      "数学や科学にひそむ法則を、指で触りながら出会えるWeb実験室。",
    url: "https://ciraf.jp/touchlab/",
    siteName: "ciraf inc.",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://ciraf.jp/touchlab/og-hub.jpg",
        width: 1280,
        height: 670,
        alt: "TOUCH LAB",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TOUCH LAB | 指で触れる、見えない法則。",
    description:
      "数学や科学にひそむ法則を、指で触りながら出会えるWeb実験室。",
  },
};

const works = [
  {
    no: "01",
    name: "STRIPES",
    subtitle: "しまうまの模様はどうしてできるの？",
    href: "/touchlab/stripes",
    status: "live" as const,
  },
  {
    no: "02",
    name: "FLOCK",
    subtitle: "鳥はどうして同じ向きに飛ぶの？",
    href: "/touchlab/flock",
    status: "live" as const,
  },
  {
    no: "03",
    name: "WAVES",
    subtitle: "音のかたちを見てみよう",
    href: null,
    status: "soon" as const,
  },
  {
    no: "04",
    name: "TREE",
    subtitle: "自分だけの木を育てよう",
    href: null,
    status: "soon" as const,
  },
  {
    no: "05",
    name: "LIFE",
    subtitle: "細胞は生きている",
    href: null,
    status: "soon" as const,
  },
  {
    no: "06",
    name: "TILE",
    subtitle: "不思議な床のはなし",
    href: null,
    status: "soon" as const,
  },
];

function WorkCard({
  work,
}: {
  work: (typeof works)[number];
}) {
  const isLive = work.status === "live";

  const card = (
    <div
      className={`border rounded-lg overflow-hidden transition-colors duration-200 ${
        isLive
          ? "border-[#E5E5E5] hover:border-[#1A1A1A] cursor-pointer"
          : "border-[#E5E5E5] opacity-45 cursor-default"
      }`}
    >
      {/* Preview area */}
      <div className="h-[240px] bg-[#F5F5F5] flex items-center justify-center">
        {!isLive && (
          <span className="text-xs tracking-[0.15em] text-[#AAAAAA] uppercase">
            Coming Soon
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-5 py-4">
        <p className="text-xs tracking-[0.12em] text-[#888888] mb-1">
          {work.no}
        </p>
        <h3 className="text-base font-bold text-[#1A1A1A] tracking-[0.06em] mb-1">
          {work.name}
        </h3>
        <p className="text-sm text-[#888888] leading-relaxed">
          {work.subtitle}
        </p>
      </div>
    </div>
  );

  if (isLive && work.href) {
    return <Link href={work.href}>{card}</Link>;
  }

  return card;
}

export default function TouchLabPage() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      {/* ── Hero ── */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-6 text-center">
        <h1
          className="text-5xl md:text-7xl font-bold tracking-[0.12em] mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          TOUCH LAB
        </h1>
        <p
          className="text-lg md:text-xl tracking-[0.08em] text-[#1A1A1A] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          指で触れる、見えない法則。
        </p>
        <p className="text-sm text-[#888888] leading-relaxed">
          6歳の子どもから大人まで、誰もが実験者になれるWeb実験室です。
        </p>
      </section>

      {/* ── Works Grid ── */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {works.map((work) => (
              <WorkCard key={work.no} work={work} />
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="px-6 pb-32 md:pb-40">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.2em] text-[#888888] uppercase mb-6">
            About
          </p>
          <div className="text-base text-[#1A1A1A] leading-[2] space-y-4">
            <p>
              TOUCH
              LABは、数学や科学にひそむ"見えない法則"を、指で触りながら出会える実験室です。
            </p>
            <p>
              クリアもスコアも正解もありません。指で動かして、出てくる模様や動きを眺めて、また動かす。
              それだけで、世界がちょっとだけ違って見えてきます。
            </p>
            <p>6歳の子どもから大人まで、誰もが実験者になれます。</p>
            <p>ずっと触っていてください。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
