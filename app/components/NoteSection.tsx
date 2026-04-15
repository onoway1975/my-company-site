import Image from "next/image";
import { Button } from "./Button";

// ── Types ─────────────────────────────────────────────────────────────────────

type NoteCard = {
  title: string;
  url: string;
  date: string;
  eyecatch: string;
  excerpt: string;
};

type NoteListItem = {
  title: string;
  url: string;
  date: string;
};

type FetchResult =
  | { mode: "cards"; articles: NoteCard[] }
  | { mode: "list"; articles: NoteListItem[] }
  | { mode: "empty" };

// ── RSS fallback parser ───────────────────────────────────────────────────────

function parseRSS(xml: string): NoteListItem[] {
  const items: NoteListItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 4) {
    const item = match[1];

    const title =
      item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]?.trim() ??
      item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ??
      "";

    const url =
      item.match(/<link>\s*(https?:\/\/[^\s<]+)\s*<\/link>/)?.[1] ??
      item.match(/<guid[^>]*>\s*(https?:\/\/[^\s<]+)\s*<\/guid>/)?.[1] ??
      "#";

    const pubDate =
      item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? "";
    const date = pubDate
      ? new Date(pubDate).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";

    items.push({ title, url, date });
  }

  return items;
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchNoteData(): Promise<FetchResult> {
  // Primary: note.com API v2 → card grid
  try {
    const res = await fetch(
      "https://note.com/api/v2/creators/ciraf_inc/contents?kind=note&page=1",
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const json = await res.json();
      const contents: Array<{
        name?: string;
        body?: string;
        publishAt?: string;
        eyecatch?: string;
        noteUrl?: string;
      }> = json?.data?.contents ?? [];

      if (contents.length > 0) {
        const articles: NoteCard[] = contents.slice(0, 6).map((item) => {
          const excerpt = (item.body ?? "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 50);
          return {
            title: item.name ?? "",
            url: item.noteUrl ?? "#",
            date: item.publishAt
              ? new Date(item.publishAt).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "",
            eyecatch: item.eyecatch ?? "",
            excerpt: excerpt ? excerpt + "..." : "",
          };
        });
        return { mode: "cards", articles };
      }
    }
  } catch {
    // fall through to RSS fallback
  }

  // Fallback: RSS → text list
  try {
    const res = await fetch("https://note.com/ciraf_inc/rss", {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const xml = await res.text();
      const articles = parseRSS(xml);
      if (articles.length > 0) return { mode: "list", articles };
    }
  } catch {
    // both failed
  }

  return { mode: "empty" };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CardGrid({ articles }: { articles: NoteCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {articles.map((article, i) => (
        <a
          key={i}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          data-gtm-click="external_link"
          data-gtm-location="note_section"
          data-gtm-label="note_article_card"
          className="group flex flex-col gap-3"
        >
          {/* Thumbnail */}
          <div className="overflow-hidden rounded-lg aspect-video bg-surface">
            {article.eyecatch ? (
              <Image
                src={article.eyecatch}
                alt={article.title}
                width={640}
                height={360}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading={i < 3 ? "eager" : "lazy"}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#eeeeee]">
                <span className="text-[9px] tracking-widest text-muted uppercase">note</span>
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-1.5">
            {article.date && (
              <p className="text-[0.7rem] text-[#aaaaaa]">{article.date}</p>
            )}
            <p className="text-sm font-semibold text-ink leading-[1.6] line-clamp-2 group-hover:underline underline-offset-2 transition-all">
              {article.title}
            </p>
            {article.excerpt && (
              <p className="line-clamp-2 text-[#888]" style={{ fontSize: 12, marginTop: 6 }}>
                {article.excerpt}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}

function TextList({ articles }: { articles: NoteListItem[] }) {
  return (
    <ul>
      {articles.map((article, i) => (
        <li
          key={i}
          className={
            i < articles.length - 1
              ? "border-b border-dashed border-[#e2e2e2]"
              : ""
          }
        >
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            data-gtm-click="external_link"
            data-gtm-location="note_section"
            data-gtm-label="note_article"
            className="flex items-center gap-4 py-5 group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[0.75rem] text-[#888]">{article.date}</span>
                <span className="text-[0.85rem] font-bold text-ink">note</span>
              </div>
              <p className="text-[0.9rem] text-ink leading-[1.6] line-clamp-2 group-hover:underline underline-offset-2 transition-all">
                {article.title}
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function NoteSection() {
  const result = await fetchNoteData();
  if (result.mode === "empty") return null;

  return (
    <section className="py-3 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto bg-surface rounded-[2rem] px-8 md:px-12 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row lg:gap-16">

          {/* ── Left column ── */}
          <div className="lg:w-1/4 shrink-0 mb-8 lg:mb-0">
            <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
              Latest
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">
              NEWS / note
            </h2>
            <Button
              href="https://note.com/ciraf_inc"
              external
              data-gtm-click="external_link"
              data-gtm-location="note_section"
              data-gtm-label="note_view_all"
            >
              View all
            </Button>
          </div>

          {/* ── Right column ── */}
          <div className="flex-1 min-w-0">
            {result.mode === "cards" ? (
              <CardGrid articles={result.articles} />
            ) : (
              <TextList articles={result.articles} />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
