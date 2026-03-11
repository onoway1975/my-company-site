"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Work } from "../data/works";

const ITEMS_PER_PAGE = 12;

export function WorksGrid({ works }: { works: Work[] }) {
  const categories = ["All", ...Array.from(new Set(works.flatMap((w) => w.category.map((c) => c.toUpperCase()))))];
  const [active, setActive] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredWorks = active === "All" ? works : works.filter((w) => w.category.map((c) => c.toUpperCase()).includes(active));
  const totalPages = Math.ceil(filteredWorks.length / ITEMS_PER_PAGE);
  const filtered = filteredWorks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActive(cat); setCurrentPage(1); }}
            data-gtm-click="filter"
            data-gtm-location="works_list"
            data-gtm-label={cat.toLowerCase()}
            className={`text-xs tracking-[0.1em] uppercase rounded-full px-4 py-2 border transition-colors duration-200 ${
              active === cat
                ? "bg-ink text-white border-ink"
                : "bg-white text-muted border-border hover:border-ink hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SP: List */}
      <div className="lg:hidden">
        {filtered.map((work, i, arr) => (
          <Link
            key={work.slug}
            href={`/works/${work.slug}`}
            data-gtm-click="internal_link"
            data-gtm-location="works_list"
            data-gtm-label={work.slug}
            className={`group flex items-center gap-4 py-4 hover:opacity-70 transition-opacity duration-200${i < arr.length - 1 ? " border-b border-dashed border-[#e2e2e2]" : ""}`}
          >
            {work.thumbnail ? (
              <Image
                src={work.thumbnail}
                alt={work.title}
                width={56}
                height={56}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
                sizes="56px"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-surface shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] tracking-[0.1em] text-muted uppercase mb-1">
                {work.category.join(" / ")}
              </p>
              <p className="text-sm font-bold text-ink leading-snug">{work.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* PC: Grid */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        {filtered.map((work) => (
          <Link
            key={work.slug}
            href={`/works/${work.slug}`}
            data-gtm-click="internal_link"
            data-gtm-location="works_list"
            data-gtm-label={work.slug}
            className="group bg-white border border-[#e8e8e8] rounded-[1.25rem] p-5 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
          >
            {/* Thumbnail */}
            <div className="overflow-hidden rounded-[0.75rem] aspect-[4/3] bg-surface mb-4">
              {work.thumbnail ? (
                <Image
                  src={work.thumbnail}
                  alt={work.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover object-center"
                  sizes="25vw"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-[9px] tracking-widest text-muted uppercase">ciraf</span>
                </div>
              )}
            </div>
            {/* Text */}
            <p className="text-[0.75rem] tracking-[0.1em] text-[#888888] uppercase mb-1">
              {work.category.join(" / ")}
            </p>
            <h3 className="text-base font-bold text-ink">{work.title}</h3>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="w-9 h-9 rounded-full border border-[#e0e0e0] flex items-center justify-center text-sm disabled:opacity-30 hover:bg-surface transition-colors"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-full text-sm font-bold transition-colors ${
                currentPage === page
                  ? "bg-ink text-white"
                  : "border border-[#e0e0e0] hover:bg-surface"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-9 h-9 rounded-full border border-[#e0e0e0] flex items-center justify-center text-sm disabled:opacity-30 hover:bg-surface transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
