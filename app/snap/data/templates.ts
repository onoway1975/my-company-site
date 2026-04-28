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
    { id: "studio_purple", title: "パープルムード", cat: "スタジオ", img: "https://source.unsplash.com/cuEpo721ACY/400x500" },
    { id: "studio_tropical", title: "トロピカルディスコ", cat: "スタジオ", img: "https://source.unsplash.com/diJjXZ9FkPU/400x500" },
    { id: "studio_neon", title: "ネオンガーデン", cat: "スタジオ", img: "https://source.unsplash.com/bmMdi59CojQ/400x500" },
    { id: "studio_artwall", title: "アートウォール", cat: "スタジオ", img: "https://source.unsplash.com/kPUmXLLtRvY/400x500" },
  ],
  studio: [
    { id: "studio_pinksalon", title: "ピンクサロン", cat: "スタジオ", img: "https://source.unsplash.com/E-H4_DaE0K0/400x500" },
    { id: "studio_minimal", title: "ロンドン", cat: "スタジオ", img: "https://source.unsplash.com/8F785OuG9cI/400x500" },
    { id: "studio_powderblue", title: "パウダーブルー", cat: "スタジオ", img: "https://source.unsplash.com/3Om4DHcaAc0/400x500" },
    { id: "studio_midcentury", title: "ミッドセンチュリー", cat: "スタジオ", img: "https://source.unsplash.com/CYtyRoMqBHg/400x500" },
  ],
  jp: [
    { id: "event_xmasmodern", title: "モダンクリスマス", cat: "記念日", img: "https://source.unsplash.com/JZwQSpvUdgc/400x500" },
    { id: "event_xmasclassic", title: "クラシッククリスマス", cat: "記念日", img: "https://source.unsplash.com/gf8LEsXe2i4/400x500" },
    { id: "event_valentine", title: "バレンタイン", cat: "記念日", img: "https://source.unsplash.com/90xmBr9S-Hc/400x500" },
    { id: "event_birthday", title: "バースデー", cat: "記念日", img: "https://source.unsplash.com/uRduydIdpLk/400x500" },
  ],
};

export const TEMPLATE_EN: Record<string, string> = {
  studio_purple: "Purple Mood",
  studio_tropical: "Tropical Disco",
  studio_neon: "Neon Garden",
  studio_artwall: "Art Wall",
  studio_pinksalon: "Pink Salon",
  studio_minimal: "London",
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
