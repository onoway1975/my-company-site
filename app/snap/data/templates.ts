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
    { id: "studio_purple", title: "パープルムード", cat: "スタジオ", img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=500&fit=crop&q=80" },
    { id: "studio_tropical", title: "トロピカルディスコ", cat: "スタジオ", img: "https://images.unsplash.com/photo-1602500347523-50a826006d59?w=400&h=500&fit=crop&q=80" },
    { id: "studio_neon", title: "ネオンガーデン", cat: "スタジオ", img: "https://images.unsplash.com/photo-1499914485622-a88fac536970?w=400&h=500&fit=crop&q=80" },
    { id: "studio_artwall", title: "アートウォール", cat: "スタジオ", img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop&q=80" },
  ],
  studio: [
    { id: "studio_pinksalon", title: "ピンクサロン", cat: "スタジオ", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=500&fit=crop&q=80" },
    { id: "studio_minimal", title: "ピュアホワイト", cat: "スタジオ", img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=500&fit=crop&q=80" },
    { id: "studio_powderblue", title: "パウダーブルー", cat: "スタジオ", img: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=500&fit=crop&q=80" },
    { id: "studio_midcentury", title: "ミッドセンチュリー", cat: "スタジオ", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=500&fit=crop&q=80" },
  ],
  jp: [
    { id: "event_xmasmodern", title: "モダンクリスマス", cat: "記念日", img: "https://images.unsplash.com/photo-1543589923-bbc7b8eb4c10?w=400&h=500&fit=crop&q=80" },
    { id: "event_xmasclassic", title: "クラシッククリスマス", cat: "記念日", img: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=500&fit=crop&q=80" },
    { id: "event_valentine", title: "バレンタイン", cat: "記念日", img: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=500&fit=crop&q=80" },
    { id: "event_birthday", title: "バースデー", cat: "記念日", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=500&fit=crop&q=80" },
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
