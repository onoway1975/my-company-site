export type StyleId = "puni" | "jelly" | "candy" | "metallic" | "bubblegum";

export const STYLES: { id: StyleId; name: string; emoji: string }[] = [
  { id: "puni", name: "ぷに", emoji: "🩷" },
  { id: "jelly", name: "ぷるぷる", emoji: "🫧" },
  { id: "candy", name: "キャンディ", emoji: "🍭" },
  { id: "metallic", name: "メタリック", emoji: "🪩" },
  { id: "bubblegum", name: "バブルガム", emoji: "🌈" },
];

export const VALID_STYLE_IDS = STYLES.map((s) => s.id);

export function detectScriptType(word: string): string {
  if (/^[A-Za-z0-9!?\s]+$/.test(word)) return "English alphabet text";
  if (/^[ァ-ヴー]+$/.test(word)) return "Japanese katakana text";
  if (/[\u4e00-\u9faf]/.test(word)) return "Japanese text";
  return "Japanese hiragana text";
}

export const STYLE_PROMPTS: Record<
  StyleId,
  (word: string, scriptType: string) => string
> = {
  puni: (word, scriptType) =>
    `A glossy 3D inflated balloon letter design of the ${scriptType} "${word}", exactly as written without translation or transliteration, puffy vinyl material, hot pink gradient from #FF3B8E to #FF7AB5, rounded bubbly shape, soft specular highlights, Y2K aesthetic, centered on pure white background, photorealistic 3D render, square composition, no additional text, no watermark`,

  jelly: (word, scriptType) =>
    `A 3D translucent jelly letter design of the ${scriptType} "${word}", exactly as written without translation, wobbly gummy material, soft pastel pink tint, glossy wet surface with caustic light refraction, centered on pure white background, photorealistic 3D render, square composition, no additional text, no watermark`,

  candy: (word, scriptType) =>
    `A 3D candy cane letter design of the ${scriptType} "${word}", exactly as written without translation, red and white diagonal stripe pattern, glossy sugar coating, rounded cylindrical cross-section, centered on pure white background, photorealistic 3D render, square composition, no additional text, no watermark`,

  metallic: (word, scriptType) =>
    `A 3D chrome metallic letter design of the ${scriptType} "${word}", exactly as written without translation, mirror-polished silver surface, inflated balloon shape, Y2K aesthetic, reflective with environment reflections, centered on pure white background, photorealistic 3D render, square composition, no additional text, no watermark`,

  bubblegum: (word, scriptType) =>
    `A 3D pastel multicolor balloon letter design of the ${scriptType} "${word}", exactly as written without translation, each letter in different pastel color (lavender, mint, peach, sky blue), puffy inflated shape, soft glossy surface, centered on pure white background, photorealistic 3D render, square composition, no additional text, no watermark`,
};
