"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Work } from "../data/works";

export function WorksGrid({ works }: { works: Work[] }) {
  const categories = ["All", ...Array.from(new Set(works.flatMap((w) => w.category.map((c) => c.toUpperCase()))))];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? works : works.filter((w) => w.category.map((c) => c.toUpperCase()).includes(active));

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
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

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
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
    </div>
  );
}
