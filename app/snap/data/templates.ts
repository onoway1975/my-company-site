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
    { id: "studio_purple", title: "パープルムード", cat: "スタジオ", img: "/snap/templates/studio_purple.webp" },
    { id: "studio_tropical", title: "トロピカルディスコ", cat: "スタジオ", img: "/snap/templates/studio_tropical.webp" },
    { id: "studio_neon", title: "ネオンガーデン", cat: "スタジオ", img: "/snap/templates/studio_neon.webp" },
    { id: "studio_artwall", title: "アートウォール", cat: "スタジオ", img: "/snap/templates/studio_artwall.webp" },
  ],
  studio: [
    { id: "studio_pinksalon", title: "ピンクサロン", cat: "スタジオ", img: "/snap/templates/studio_pinksalon.webp" },
    { id: "studio_minimal", title: "ロンドン", cat: "スタジオ", img: "/snap/templates/studio_minimal.webp" },
    { id: "studio_powderblue", title: "パウダーブルー", cat: "スタジオ", img: "/snap/templates/studio_powderblue.webp" },
    { id: "studio_midcentury", title: "ミッドセンチュリー", cat: "スタジオ", img: "/snap/templates/studio_midcentury.webp" },
  ],
  jp: [
    { id: "event_xmasmodern", title: "モダンクリスマス", cat: "記念日", img: "/snap/templates/event_xmasmodern.webp" },
    { id: "event_xmasclassic", title: "クラシッククリスマス", cat: "記念日", img: "/snap/templates/event_xmasclassic.webp" },
    { id: "event_valentine", title: "バレンタイン", cat: "記念日", img: "/snap/templates/event_valentine.webp" },
    { id: "event_birthday", title: "バースデー", cat: "記念日", img: "/snap/templates/event_birthday.webp" },
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
