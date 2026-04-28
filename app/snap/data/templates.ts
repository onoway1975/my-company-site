export type CategoryId =
  | "recommended"
  | "studio"
  | "jp";

export type Subject = "dog" | "cat" | "child";

export interface Category {
  id: CategoryId;
  label: string;
}

export interface Template {
  id: string;
  title: string;
  cat: string;
  img: string;
}

export const CATEGORIES: Category[] = [
  { id: "recommended", label: "おすすめ" },
  { id: "studio", label: "スタジオ" },
  { id: "jp", label: "記念日" },
];

export const TEMPLATES: Record<CategoryId, Template[]> = {
  recommended: [
    { id: "studio_purple", title: "パープルムード", cat: "スタジオ", img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=70&auto=format" },
    { id: "studio_tropical", title: "トロピカルディスコ", cat: "スタジオ", img: "https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=400&q=70&auto=format" },
    { id: "studio_neon", title: "ネオンガーデン", cat: "スタジオ", img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=70&auto=format" },
    { id: "studio_artwall", title: "アートウォール", cat: "スタジオ", img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400&q=70&auto=format" },
  ],
  studio: [
    { id: "studio_pinksalon", title: "ピンクサロン", cat: "スタジオ", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=70&auto=format" },
    { id: "studio_minimal", title: "ピュアホワイト", cat: "スタジオ", img: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=400&q=70&auto=format" },
    { id: "studio_powderblue", title: "パウダーブルー", cat: "スタジオ", img: "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=400&q=70&auto=format" },
    { id: "studio_midcentury", title: "ミッドセンチュリー", cat: "スタジオ", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=70&auto=format" },
  ],
  jp: [
    { id: "event_xmasmodern", title: "モダンクリスマス", cat: "記念日", img: "https://images.unsplash.com/photo-1543589923-bbc7b8eb4c10?w=400&q=70&auto=format" },
    { id: "event_xmasclassic", title: "クラシッククリスマス", cat: "記念日", img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=70&auto=format" },
    { id: "event_valentine", title: "バレンタイン", cat: "記念日", img: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=70&auto=format" },
    { id: "event_birthday", title: "バースデー", cat: "記念日", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=70&auto=format" },
  ],
};

export const TEMPLATE_EN: Record<string, string> = {
  studio_purple: "Purple Mood",
  studio_tropical: "Tropical Disco",
  studio_neon: "Neon Garden",
  studio_artwall: "Art Wall",
  studio_pinksalon: "Pink Salon",
  studio_minimal: "Pure White",
  studio_powderblue: "Powder Blue",
  studio_midcentury: "Mid-Century",
  event_xmasmodern: "Modern Christmas",
  event_xmasclassic: "Classic Christmas",
  event_valentine: "Valentine",
  event_birthday: "Birthday",
};

export const SUBJECT_PREVIEWS: Record<Subject, string> = {
  dog: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=75&auto=format",
  cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=75&auto=format",
  child: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&q=75&auto=format",
};

export function findTemplate(id: string): Template | null {
  for (const list of Object.values(TEMPLATES)) {
    const t = list.find((x) => x.id === id);
    if (t) return t;
  }
  return null;
}
