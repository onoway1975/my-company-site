export type CategoryId =
  | "recommended"
  | "studio"
  | "jp"
  | "world"
  | "fantasy"
  | "art"
  | "classic";

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
  { id: "world", label: "世界" },
  { id: "fantasy", label: "ファンタジー" },
  { id: "art", label: "アート" },
  { id: "classic", label: "クラシック" },
];

export const TEMPLATES: Record<CategoryId, Template[]> = {
  recommended: [
    { id: "studio_03", title: "春の撮影", cat: "スタジオ", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=70&auto=format" },
    { id: "jp_03", title: "桜満開", cat: "記念日", img: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=70&auto=format" },
    { id: "studio_04", title: "フラワーアーチ", cat: "スタジオ", img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=70&auto=format" },
    { id: "fantasy_01", title: "星空と月明り", cat: "ファンタジー", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=70&auto=format" },
    { id: "jp_01", title: "七五三", cat: "記念日", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=70&auto=format" },
    { id: "world_03", title: "クリスマスツリー", cat: "世界", img: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&q=70&auto=format" },
  ],
  studio: [
    { id: "studio_01", title: "フラワードレッシングルーム", cat: "スタジオ", img: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&q=70&auto=format" },
    { id: "studio_02", title: "パステルバルーン", cat: "スタジオ", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=70&auto=format" },
    { id: "studio_05", title: "シネマティック", cat: "スタジオ", img: "https://images.unsplash.com/photo-1540206395-68808572332f?w=400&q=70&auto=format" },
    { id: "studio_06", title: "レモンガーデン", cat: "スタジオ", img: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=70&auto=format" },
  ],
  jp: [
    { id: "jp_01", title: "七五三", cat: "記念日", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=70&auto=format" },
    { id: "jp_03", title: "桜満開", cat: "記念日", img: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=70&auto=format" },
    { id: "jp_06", title: "夏祭り・浴衣", cat: "記念日", img: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&q=70&auto=format" },
    { id: "jp_08", title: "お正月・初詣", cat: "記念日", img: "https://images.unsplash.com/photo-1528164604427-a81eb708f11f?w=400&q=70&auto=format" },
  ],
  world: [
    { id: "world_01", title: "ハロウィン魔女", cat: "世界", img: "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&q=70&auto=format" },
    { id: "world_03", title: "クリスマスツリー", cat: "世界", img: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&q=70&auto=format" },
    { id: "world_05", title: "イースター", cat: "世界", img: "https://images.unsplash.com/photo-1554672408-730436b60dde?w=400&q=70&auto=format" },
  ],
  fantasy: [
    { id: "fantasy_01", title: "星空と月明り", cat: "ファンタジー", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=70&auto=format" },
    { id: "fantasy_02", title: "魔法の森", cat: "ファンタジー", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=70&auto=format" },
    { id: "fantasy_03", title: "宇宙飛行士", cat: "ファンタジー", img: "https://images.unsplash.com/photo-1446776877081-d173a4858a05?w=400&q=70&auto=format" },
  ],
  art: [
    { id: "art_01", title: "油絵風", cat: "アート", img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=70&auto=format" },
    { id: "art_02", title: "ジブリ風", cat: "アート", img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=70&auto=format" },
    { id: "art_03", title: "水彩画", cat: "アート", img: "https://images.unsplash.com/photo-1460411794035-42aac080490a?w=400&q=70&auto=format" },
  ],
  classic: [
    { id: "classic_01", title: "昭和レトロ縁側", cat: "クラシック", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=70&auto=format" },
    { id: "classic_02", title: "和室床の間", cat: "クラシック", img: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&q=70&auto=format" },
    { id: "classic_03", title: "ヴィンテージ", cat: "クラシック", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=70&auto=format" },
  ],
};

export const TEMPLATE_EN: Record<string, string> = {
  studio_01: "Flower Dressing Room",
  studio_02: "Pastel Balloon",
  studio_03: "Spring Studio",
  studio_04: "Flower Arch",
  studio_05: "Cinematic Portrait",
  studio_06: "Lemon Garden",
  jp_01: "Shichi-Go-San",
  jp_03: "Cherry Blossom",
  jp_06: "Summer Yukata",
  jp_08: "New Year Shrine",
  world_01: "Halloween Witch",
  world_03: "Christmas Tree",
  world_05: "Easter",
  fantasy_01: "Starry Night",
  fantasy_02: "Enchanted Forest",
  fantasy_03: "Astronaut",
  art_01: "Oil Painting",
  art_02: "Ghibli Style",
  art_03: "Watercolor",
  classic_01: "Showa Engawa",
  classic_02: "Tokonoma",
  classic_03: "Vintage Studio",
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
