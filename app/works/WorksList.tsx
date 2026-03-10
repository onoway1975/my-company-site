"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Work } from "../data/works";

export function WorksList({ works }: { works: Work[] }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const activeSlugRef = useRef<string | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!previewRef.current) return;
    previewRef.current.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 80}px)`;
  }, []);

  const onEnter = useCallback((slug: string, thumbnail: string | null) => {
    activeSlugRef.current = slug;
    if (!previewRef.current) return;
    const img = previewRef.current.querySelector<HTMLImageElement>("[data-thumb]");
    const placeholder = previewRef.current.querySelector<HTMLSpanElement>("[data-placeholder]");
    if (thumbnail && img) {
      img.src = thumbnail;
      img.style.display = "block";
      if (placeholder) placeholder.style.display = "none";
    } else {
      if (img) img.style.display = "none";
      if (placeholder) placeholder.style.display = "flex";
    }
    previewRef.current.style.opacity = "1";
    previewRef.current.style.pointerEvents = "none";
  }, []);

  const onLeave = useCallback(() => {
    activeSlugRef.current = null;
    if (!previewRef.current) return;
    previewRef.current.style.opacity = "0";
  }, []);

  return (
    <div onMouseMove={onMouseMove}>
      {/* Floating preview */}
      <div
        ref={previewRef}
        className="fixed top-0 left-0 z-50 w-[280px] aspect-video overflow-hidden pointer-events-none opacity-0 transition-opacity duration-200"
        style={{ willChange: "transform" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-thumb
          src=""
          alt=""
          className="w-full h-full object-cover"
          style={{ display: "none" }}
        />
        <span
          data-placeholder
          className="w-full h-full bg-surface flex items-center justify-center text-[9px] tracking-widest text-muted uppercase"
          style={{ display: "flex" }}
        >
          ciraf
        </span>
      </div>

      {/* Works list */}
      <ul className="border-t border-border">
        {works.map((work, i) => (
          <li key={work.slug} className="border-b border-border group">
            <Link
              href={`/works/${work.slug}`}
              className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 py-8 md:py-10 hover:opacity-60 transition-opacity duration-200"
              onMouseEnter={() => onEnter(work.slug, work.thumbnail)}
              onMouseLeave={onLeave}
            >
              <div className="flex items-baseline gap-6 md:gap-10">
                <span className="text-[10px] tracking-[0.2em] text-muted tabular-nums shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] tracking-[0.2em] text-muted uppercase w-20 shrink-0 hidden sm:block">
                  {work.category}
                </span>
                <span className="text-ink text-[0.95rem]">{work.title}</span>
              </div>
              <span className="text-xs text-muted tracking-widest pl-12 sm:pl-0">
                {work.year}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
