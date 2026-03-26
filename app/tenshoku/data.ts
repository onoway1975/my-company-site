export type Vocation = {
  id: string;
  name: string;
  imageFile: string; // filename only, used as /tenshoku/{gender}/{imageFile}
  instantidPrompt: string;
};

export type Gender = "male" | "female" | "other";

const FACE_SUFFIX = "CRITICAL REQUIREMENT: The generated person must look exactly like the person in the input image. Preserve ALL of the following with 100% accuracy: Exact age appearance (do not make younger or older), Exact face shape and contour, Exact eye shape size and position, Exact nose shape, Exact mouth and lip shape, Exact skin tone and texture, Exact hair color style and length, Any distinctive facial features (wrinkles, marks etc). This is an absolute non-negotiable requirement. Do NOT beautify, rejuvenate or idealize the face. Render the person as they actually look. no text, no watermark, no letters";

export const VOCATIONS: Vocation[] = [
  {
    id: "ishi",
    name: "医師",
    imageFile: "doctor.jpg",
    instantidPrompt: `cinematic photo, Japanese person in white doctor coat, hospital corridor, stethoscope around neck, holding medical chart, soft natural lighting through window, warm confident expression, professional medical atmosphere, photorealistic, 8k, ${FACE_SUFFIX}`,
  },
  {
    id: "kigyoka",
    name: "起業家",
    imageFile: "entrepreneur.jpg",
    instantidPrompt: `cinematic photo, Japanese person in smart casual outfit, standing in modern glass office, city night view background, confident posture, ambient light reflecting on face, professional business atmosphere, photorealistic, 8k, ${FACE_SUFFIX}`,
  },
  {
    id: "engineer",
    name: "エンジニア",
    imageFile: "engineer.jpg",
    instantidPrompt: `cinematic photo, Japanese person sitting at desk with multiple monitors, dark tech office, blue monitor light reflecting on face, focused expression, programming code on screen, modern tech atmosphere, photorealistic, 8k, ${FACE_SUFFIX}`,
  },
  {
    id: "designer",
    name: "デザイナー",
    imageFile: "designer.jpg",
    instantidPrompt: `cinematic photo, Japanese person in creative studio, colorful mood board background, holding tablet and sketchbook, natural light from window, creative artistic atmosphere, photorealistic, 8k, ${FACE_SUFFIX}`,
  },
  {
    id: "hoikushi",
    name: "保育士",
    imageFile: "nursery.jpg",
    instantidPrompt: `cinematic photo, Japanese person as nursery teacher, colorful kindergarten classroom, kneeling to children's eye level, warm caring smile, soft afternoon light, warm nurturing atmosphere, photorealistic, 8k, ${FACE_SUFFIX}`,
  },
  {
    id: "sports-trainer",
    name: "スポーツトレーナー",
    imageFile: "trainer.jpg",
    instantidPrompt: `cinematic photo, Japanese person as sports trainer in professional gym, athletic wear, energetic dynamic pose, gym lighting highlighting physique, passionate energetic atmosphere, photorealistic, 8k, ${FACE_SUFFIX}`,
  },
  {
    id: "shokunin",
    name: "職人・工芸家",
    imageFile: "craftsman.jpg",
    instantidPrompt: `cinematic photo, Japanese person as craftsman in traditional workshop, surrounded by wood chips and tools, work lamp light on hands, focused proud expression, traditional craftsmanship atmosphere, photorealistic, 8k, ${FACE_SUFFIX}`,
  },
  {
    id: "kenkyusha",
    name: "研究者",
    imageFile: "researcher.jpg",
    instantidPrompt: `cinematic photo, Japanese person as researcher in modern laboratory, white coat, looking into microscope, fluorescent lab lighting, scientific equipment background, intellectual focused atmosphere, photorealistic, 8k, ${FACE_SUFFIX}`,
  },
  {
    id: "noka",
    name: "農家",
    imageFile: "farmer.jpg",
    instantidPrompt: `cinematic photo, Japanese person as farmer standing in vast green field, golden sunset light, strong expression facing the earth, crops swaying in wind, wide sky background, connection to nature atmosphere, photorealistic, 8k, ${FACE_SUFFIX}`,
  },
  {
    id: "bookenka",
    name: "冒険家・探検家",
    imageFile: "explorer.jpg",
    instantidPrompt: `cinematic photo, Japanese person as explorer standing in mountains or jungle, adventure gear, looking into the distance, wind and natural light on face, adventurous free spirit atmosphere, photorealistic, 8k, ${FACE_SUFFIX}`,
  },
  {
    id: "biyoshi",
    name: "美容師",
    imageFile: "hairdresser.jpg",
    instantidPrompt: `cinematic photo, Japanese person as hairdresser in stylish modern salon, holding scissors, standing in front of mirror, elegant salon lighting, professional confident expression, beauty and craft atmosphere, photorealistic, 8k, ${FACE_SUFFIX}`,
  },
  {
    id: "game-creator",
    name: "ゲームクリエイター",
    imageFile: "game-creator.jpg",
    instantidPrompt: `cinematic photo, Japanese person as game developer, multiple RGB gaming monitors, casual hoodie, immersed in creative work, colorful monitor glow, modern gaming studio atmosphere, photorealistic, 8k, ${FACE_SUFFIX}`,
  },
];

// Q1: 人 / モノ  Q2: 屋内 / 屋外  Q3: 自分 / チーム  Q4: 手 / 頭  Q5: 安定 / チャレンジ
const VOCATION_MAP: Record<string, string> = {
  "人-屋内-チーム-頭-安定": "ishi",
  "人-屋内-チーム-頭-チャレンジ": "kigyoka",
  "人-屋内-自分-頭-安定": "engineer",
  "人-屋内-自分-頭-チャレンジ": "designer",
  "人-屋外-チーム-体-安定": "hoikushi",
  "人-屋外-チーム-体-チャレンジ": "sports-trainer",
  "モノ-屋内-自分-手-安定": "shokunin",
  "モノ-屋内-自分-頭-チャレンジ": "kenkyusha",
  "モノ-屋外-自分-体-安定": "noka",
  "モノ-屋外-チーム-体-チャレンジ": "bookenka",
  "人-屋内-自分-手-チャレンジ": "biyoshi",
  "モノ-屋内-チーム-頭-チャレンジ": "game-creator",
};

export type Answers = {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
};

export function resolveVocation(answers: Answers): Vocation {
  const key = `${answers.q1}-${answers.q2}-${answers.q3}-${answers.q4}-${answers.q5}`;
  const id = VOCATION_MAP[key] ?? VOCATIONS[Math.floor(Math.random() * VOCATIONS.length)].id;
  return VOCATIONS.find((v) => v.id === id)!;
}

export function getImagePath(vocation: Vocation, gender: Gender): string {
  const folder = gender === "other" ? "male" : gender;
  return `/tenshoku/${folder}/${vocation.imageFile}`;
}
