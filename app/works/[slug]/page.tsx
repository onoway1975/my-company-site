import { works } from "@/app/data/works";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ContactSection } from "@/app/components/ContactSection";
import { BodyPageType } from "@/app/components/BodyPageType";
import { ClientVideo } from "@/app/components/ClientVideo";

import type { Work } from "@/app/data/works";

function WorkInfo({ work }: { work: Work }) {
  return (
    <>
      <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-gray-900 leading-[1.2] tracking-tight mb-10">
        {work.title}
      </h1>

      <div className="border-t border-gray-100">
        {work.client && (
          <div className="pt-8 border-b border-gray-100 pb-8">
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">Client</p>
            <p className="text-base text-gray-900">{work.client}</p>
          </div>
        )}
        {work.year && (
          <div className="pt-8 border-b border-gray-100 pb-8">
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">Year</p>
            <p className="text-base text-gray-900">{work.year}</p>
          </div>
        )}
        {work.category.length > 0 && (
          <div className="pt-8 border-b border-gray-100 pb-8">
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Scope</p>
            <div className="flex flex-wrap gap-2">
              {work.category.map((s) => (
                <span key={s} className="text-xs text-gray-600 border border-gray-300 rounded-full px-3 py-1">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {work.url && (
          <div className="pt-8 border-b border-gray-100 pb-8">
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">URL</p>
            <a
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              data-gtm-click="external_link"
              data-gtm-location="works_detail"
              data-gtm-label={work.slug}
              className="text-sm text-gray-900 underline underline-offset-4 hover:text-gray-500 transition-colors break-all"
            >
              {work.url}
            </a>
          </div>
        )}
        {work.description && (
          <div className="pt-8 pb-8">
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Overview</p>
            <p className="text-sm text-gray-700 leading-relaxed">{work.description}</p>
          </div>
        )}
        {work.credit && (
          <div className="pt-8 pb-8">
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Credit</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{work.credit}</p>
          </div>
        )}
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = works.find((w) => w.slug === slug);
  if (!work) return {};
  return { title: `${work.title} | ciraf inc.` };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = works.find((w) => w.slug === slug);
  if (!work) notFound();

  const otherWorks = works.filter((w) => w.slug !== slug).slice(0, 5);

  return (
    <main>
      <BodyPageType type="works_detail" />
      {/* ← Back */}
      <div className="px-6 lg:px-16 pt-8">
        <Link
          href="/works"
          data-gtm-click="internal_link"
          data-gtm-location="works_detail"
          data-gtm-label="back_to_works"
          className="inline-flex items-center gap-2 text-[0.8rem] tracking-[0.1em] text-gray-400 hover:text-gray-900 transition-colors"
        >
          ← Works
        </Link>
      </div>

      {work.video ? (
        /* ── video あり: 左sticky電話フレーム / 右info ── */
        <div className="flex flex-col lg:flex-row min-h-screen bg-white">
          {/* Left: Sticky phone video */}
          <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center py-16 lg:py-0 lg:sticky lg:top-0 lg:h-screen">
            <div className="relative" style={{ width: "280px" }}>
              <div className="relative bg-[#1a1a1a] rounded-[3rem] p-[3px] shadow-2xl">
                <ClientVideo videoSrc={work.video!} />
                <div className="absolute -right-[3px] top-32 w-[3px] h-14 bg-[#333] rounded-r-sm" />
                <div className="absolute -left-[3px] top-24 w-[3px] h-8 bg-[#333] rounded-l-sm" />
                <div className="absolute -left-[3px] top-36 w-[3px] h-8 bg-[#333] rounded-l-sm" />
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-1/2 px-8 lg:px-16 py-16 lg:py-24 bg-white">
            <WorkInfo work={work} />
          </div>
        </div>
      ) : (
        /* ── images あり: 左info / 右画像ギャラリー ── */
        <div className="flex flex-col lg:flex-row bg-white">
          {/* Left: Info (sticky) */}
          <div className="w-full lg:w-1/2 px-8 lg:px-16 py-16 lg:py-24 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            <WorkInfo work={work} />
          </div>

          {/* Right: Image gallery */}
          <div className="w-full lg:w-1/2 px-8 lg:px-16 py-16 lg:py-24 bg-gray-50 flex flex-col gap-6">
            {(work.images ?? (work.thumbnail ? [work.thumbnail] : [])).map((src, i) => (
              <div key={i} className="relative w-full overflow-hidden rounded-[1.25rem]">
                <Image
                  src={src}
                  alt={`${work.title} ${i + 1}`}
                  width={1200}
                  height={900}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Works */}
      <div className="bg-white px-6 lg:px-16 pt-16 md:pt-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.15em] text-gray-400 uppercase mb-8">
            Other Works
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {otherWorks.map((w) => (
              <Link key={w.slug} href={`/works/${w.slug}`} className="group flex-shrink-0 w-48 md:w-64">
                <div className="relative overflow-hidden rounded-[0.75rem] aspect-[4/3] bg-slate-100 mb-3">
                  {w.thumbnail && (
                    <Image
                      src={w.thumbnail}
                      alt={w.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="text-[0.75rem] tracking-[0.1em] text-gray-400 uppercase mb-1">
                  {w.category.join(" / ")}
                </p>
                <p className="text-sm font-bold text-gray-900 group-hover:text-gray-500 transition-colors">
                  {w.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ContactSection />
    </main>
  );
}
