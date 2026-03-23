export type Figure = {
  id: string;
  name: string;
  nameEn: string;
  birthday: string; // "MM-DD"
  era: string;
  artStyle: string;
  replicateStyle: string;
  prompt: string;
  tagline: string;
  description: string;
  image_url?: string;
  portraitUrl?: string; // ローカル保存済み肖像画（face-swap の base_image_url に使用）
};

export const figures: Figure[] = [
  {
    id: "sakamoto-ryoma",
    name: "坂本龍馬",
    nameEn: "Sakamoto Ryoma",
    birthday: "01-03",
    era: "1836–1867",
    artStyle: "浮世絵",
    replicateStyle: "Line art",
    prompt: "Late Edo era Japanese samurai portrait, monochrome photography, kimono and hakama, determined expression, photorealistic, 1860s",
    tagline: "幕末の志士",
    description:
      "土佐藩出身の幕末の志士。薩長同盟を成立させ、大政奉還に貢献した日本近代史の立役者。自由と革新を求め、国を変えた海援隊の盟主。",
  },
  {
    id: "natsume-soseki",
    name: "夏目漱石",
    nameEn: "Natsume Soseki",
    birthday: "02-09",
    era: "1867–1916",
    artStyle: "明治油彩",
    replicateStyle: "Oil painting",
    prompt: "Meiji era Japanese novelist portrait, monochrome photography, western suit, intellectual expression, photorealistic, 1900s",
    tagline: "明治の文豪",
    description:
      "『吾輩は猫である』『坊っちゃん』『こころ』など、日本文学史に残る名作を著した明治を代表する小説家。千円札にも肖像が描かれた国民的文人。",
  },
  {
    id: "okamoto-taro",
    name: "岡本太郎",
    nameEn: "Okamoto Taro",
    birthday: "02-26",
    era: "1911–1996",
    artStyle: "前衛アート",
    replicateStyle: "Digital Art",
    prompt: "Showa era Japanese avant-garde artist portrait, bold and intense expression, photorealistic, 1960s",
    tagline: "芸術は爆発だ",
    description:
      "「芸術は爆発だ」の名言で知られる日本の前衛芸術家。大阪万博のシンボル「太陽の塔」を制作し、日本の美術界に革命をもたらした。",
  },
  {
    id: "shibusawa-eiichi",
    name: "渋沢栄一",
    nameEn: "Shibusawa Eiichi",
    birthday: "03-16",
    era: "1840–1931",
    artStyle: "明治銅版画",
    replicateStyle: "Oil painting",
    prompt: "Meiji era Japanese businessman portrait, monochrome photography, traditional kimono, stern expression, photorealistic, 1890s",
    tagline: "近代日本経済の父",
    description:
      "第一国立銀行をはじめ500以上の企業を設立した、近代日本資本主義の礎を築いた実業家。新一万円札の肖像にも選ばれた。",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Shibusawa_Eiichi_1916.jpg/440px-Shibusawa_Eiichi_1916.jpg",
    portraitUrl: "/figures/shibusawa-eiichi.jpg",
  },
  {
    id: "uemura-shoen",
    name: "上村松園",
    nameEn: "Uemura Shoen",
    birthday: "04-23",
    era: "1875–1949",
    artStyle: "日本画",
    replicateStyle: "Watercolor painting",
    prompt: "Meiji era Japanese female painter portrait, elegant traditional kimono, dignified expression, photorealistic, 1910s",
    tagline: "美人画の第一人者",
    description:
      "日本画における美人画の大家として知られる女性画家。女性として初めて文化勲章を受章し、繊細で品格ある作風で多くの傑作を残した。",
  },
  {
    id: "higuchi-ichiyo",
    name: "樋口一葉",
    nameEn: "Higuchi Ichiyo",
    birthday: "05-02",
    era: "1872–1896",
    artStyle: "浮世絵美人画",
    replicateStyle: "Watercolor painting",
    prompt: "Meiji era Japanese female writer portrait, traditional hairstyle, kimono, delicate expression, photorealistic, 1890s",
    tagline: "明治の女流作家",
    description:
      "24歳という若さで生涯を終えながら、『たけくらべ』『にごりえ』など珠玉の名作を残した明治の女流作家。五千円札の肖像で広く知られる。",
  },
  {
    id: "kawabata-yasunari",
    name: "川端康成",
    nameEn: "Kawabata Yasunari",
    birthday: "06-14",
    era: "1899–1972",
    artStyle: "現代洋画",
    replicateStyle: "Oil painting",
    prompt: "Showa era Japanese Nobel Prize writer portrait, monochrome photography, contemplative expression, photorealistic, 1960s",
    tagline: "ノーベル文学賞作家",
    description:
      "『雪国』『伊豆の踊子』で知られ、日本人初のノーベル文学賞を受賞した文豪。日本の美意識を世界に伝えた「日本の美の発見者」。",
  },
  {
    id: "miyazawa-kenji",
    name: "宮沢賢治",
    nameEn: "Miyazawa Kenji",
    birthday: "08-27",
    era: "1896–1933",
    artStyle: "水彩画",
    replicateStyle: "Watercolor painting",
    prompt: "Taisho era Japanese poet portrait, gentle expression, monochrome photography, photorealistic, 1920s",
    tagline: "詩人・童話作家",
    description:
      "『銀河鉄道の夜』『注文の多い料理店』など、宇宙と自然への深い愛を詩と童話で描いた岩手の詩人。農業に生きながら理想郷を求めた心優しき文学者。",
  },
  {
    id: "noguchi-hideyo",
    name: "野口英世",
    nameEn: "Noguchi Hideyo",
    birthday: "11-09",
    era: "1876–1928",
    artStyle: "明治肖像画",
    replicateStyle: "Oil painting",
    prompt: "Meiji era Japanese bacteriologist portrait, monochrome photography, formal attire, serious expression, photorealistic, 1900s",
    tagline: "世界に挑んだ細菌学者",
    description:
      "幼少期の火傷による障害を乗り越え、アメリカでロックフェラー研究所の研究員として黄熱病研究に生涯を捧げた細菌学者。千円札の肖像でも知られる。",
  },
  {
    id: "tsuda-umeko",
    name: "津田梅子",
    nameEn: "Tsuda Umeko",
    birthday: "12-31",
    era: "1864–1929",
    artStyle: "明治洋装画",
    replicateStyle: "Oil painting",
    prompt: "Meiji era Japanese female educator portrait, western dress, determined expression, monochrome photography, photorealistic, 1900s",
    tagline: "女性教育の先駆者",
    description:
      "6歳でアメリカに留学し、帰国後に津田塾大学の前身を創立した女性教育の先駆者。新五千円札の肖像にも選ばれた、日本女性の地位向上に貢献した教育者。",
  },
];

function dayOfYear(month: number, day: number, isLeap: boolean): number {
  const daysInMonth = [0, 31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let d = 0;
  for (let m = 1; m < month; m++) d += daysInMonth[m];
  return d + day;
}

export function getTodayFigure(date: Date = new Date()): Figure {
  const year = date.getFullYear();
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeap ? 366 : 365;
  const todayDoy = dayOfYear(date.getMonth() + 1, date.getDate(), isLeap);

  let minDiff = Infinity;
  let closest = figures[0];

  for (const fig of figures) {
    const [m, d] = fig.birthday.split("-").map(Number);
    const figDoy = dayOfYear(m, d, isLeap);
    const diff = Math.min(Math.abs(figDoy - todayDoy), totalDays - Math.abs(figDoy - todayDoy));
    if (diff < minDiff) {
      minDiff = diff;
      closest = fig;
    }
  }
  return closest;
}

export function isBirthday(fig: Figure, date: Date = new Date()): boolean {
  const [m, d] = fig.birthday.split("-").map(Number);
  return date.getMonth() + 1 === m && date.getDate() === d;
}
