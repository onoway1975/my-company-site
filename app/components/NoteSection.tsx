import { Button } from "./Button";

type NoteItem = {
  title: string;
  url: string;
  date: string;
  thumbnail: string | null;
};

function parseRSS(xml: string): NoteItem[] {
  const items: NoteItem[] = [];
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

    // note.com は <media:thumbnail> タグでサムネイルURLを提供する
    const thumbnail =
      item.match(/<media:thumbnail>\s*(https?:\/\/[^\s<]+)\s*<\/media:thumbnail>/)?.[1] ??
      item.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1] ??
      null;

    items.push({ title, url, date, thumbnail });
  }

  return items;
}

async function fetchNoteArticles(): Promise<NoteItem[]> {
  try {
    const res = await fetch("https://note.com/ciraf_inc/rss", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSS(xml);
  } catch {
    return [];
  }
}

export async function NoteSection() {
  const articles = await fetchNoteArticles();
  if (articles.length === 0) return null;

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

          {/* ── Right column: article list ── */}
          <div className="flex-1 min-w-0">
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
                    data-gtm-label={article.title}
                    className="flex items-center gap-4 py-5 group"
                  >
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[0.75rem] text-[#888]">
                          {article.date}
                        </span>
                        <span className="text-[0.85rem] font-bold text-ink">
                          note
                        </span>
                      </div>
                      <p className="text-[0.9rem] text-ink leading-[1.6] line-clamp-2 group-hover:underline underline-offset-2 transition-all">
                        {article.title}
                      </p>
                    </div>

                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
