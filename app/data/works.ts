export type Work = {
  slug: string;
  category: string[];
  title: string;
  client?: string;
  year?: string;
  description: string;
  thumbnail: string | null;
  video: string | null;
  url?: string;
  credit?: string;
  images?: string[];
};

export const works: Work[] = [
  {
    slug: "coffee-bunko",
    title: "飲む文庫本　珈琲文庫",
    client: "越境",
    year: "2024",
    category: ["WEB", "BRANDING"],
    description: "珈琲文庫のWEBサイトを制作しました。コーヒーが注がれた文庫本です。コーヒースリーブを外すと、裏側には原稿用紙一枚分の私小説が綴られています。",
    thumbnail: "/images/works/coffee_bunko/c_t.png",
    video: "/videos/works/work-07.mp4",
    url: "https://ekkyoinc.jp/coffeebunko/",
  },
  {
    slug: "dondabada",
    category: ["WEB", "MUSIC"],
    title: "裏通りのドンダバダ",
    client: "ヤッホーブルーイング",
    year: "2024",
    description:
      "ヤッホーブルーイングの新ブランド「裏通りのドンダバダ」のWebサイト制作を担当。ブランドの世界観を表現するビジュアルデザインと、インタラクティブな体験を両立したフロントエンド実装を行いました。",
    thumbnail: "/images/works/dondabada.png",
    video: "/videos/works/work-01.mp4",
    url: "https://yohobrewing.com/dondabada/",
  },
  {
    slug: "better-co-being-journal",
    category: ["WEB", "BRANDING", "GENERATOR"],
    title: "大阪・関西万博 better co-being journal",
    year: "2025",
    description:
      "撮影した写真とテキストを組み合わせ、Better Co-Beingオリジナルの「Journal」を作成できるコンテンツを制作しました。",
    thumbnail: "/images/works/better.png",
    video: "/videos/works/work-02.mp4",
  },
  {
    slug: "accesstrade",
    category: ["WEB", "BRANDING"],
    title: "アクセストレード",
    client: "株式会社インタースペース",
    year: "2024",
    description:
      "ACCESSTRADEの新しいロゴとロゴの考え方を紹介するスペシャルサイトです。",
    thumbnail: "/images/works/access.png",
    video: "/videos/works/work-03.mp4",
  },
  {
    slug: "rirekisho",
    title: "ある商人の履歴書／伊藤忠の履歴書",
    client: "伊藤忠商事株式会社",
    category: ["WEB", "BRANDING"],
    year: "2025",
    description:
      "伊藤忠商事の6月の新聞広告「ある商人の履歴書」「伊藤忠の履歴書」特設サイトを制作しました。",
    thumbnail: "/images/works/rirekisho.png",
    video: "/videos/works/work-06.mp4",
    url: "https://www.itochu.co.jp/ja/rirekisho/",
  },
  {
    slug: "hydration",
    title: "ハイドレ サーモス",
    client: "THERMOS",
    category: ["WEB", "CAMPAIGN"],
    year: "2025",
    description:
      "いつでも、どこでも、好きな時に好きな場所で、お気に入りのボトルとドリンクで、自分らしく健康的に水分を摂る。好きで楽しむハイドレーション、サーモス ハイドレのWEBサイトを制作しました。",
    thumbnail: "/images/works/hydration.png",
    video: "/videos/works/work-05.mp4",
    url: "https://www.thermos.jp/hydration/",
  },
  {
    slug: "customwatchbeatmaker",
    title: "Seiko 5 Sports CUSTOM WATCH BEATMAKER",
    client: "Seiko",
    category: ["WEB", "GLOBAL", "CAMPAIGN", "GENERATOR"],
    year: "",
    description:
      "SEIKO グローバルデジタルキャンペーン「CUSTOM WATCH BEATMAKER」のWEBサイトを制作しました。世界初の腕時計のデザインと音楽を融合させたサイトです。キャンペーンサイトでは、お好きなパーツをセレクトすることでオリジナルのカスタマイズ＜セイコー 5スポーツ＞を作ることができます。あなたが作成したカスタマイズモデルは、8名のアーティストが制作したオリジナルトラックと共に１つのスタイルとして完成します。Watch Listのページでは、世界中で作られるオリジナルのカスタマイズモデルの中からお気に入りのモデルを投票する機能がついており、最も票を集めた人気カスタマイズモデルは実際に商品化されました。",
    thumbnail: "/images/works/customwatchbeatmaker/se_t.png",
    images: [
      "/images/works/customwatchbeatmaker/se001.jpg",
      "/images/works/customwatchbeatmaker/se002.jpg",
      "/images/works/customwatchbeatmaker/se003.jpg",
      "/images/works/customwatchbeatmaker/se005.jpg",
      "/images/works/customwatchbeatmaker/se006.jpg",
    ],
    video: null,
  },
  {
    slug: "kao",
    title: "顔採用 | 東急エージェンシー新卒スペシャルサイト",
    client: "東急エージェンシー",
    category: ["WEB", "GENERATOR", "RECRUIT", "SYSTEM"],
    year: "",
    description:
      "東急エージェンシーの新卒採用スペシャルサイト「顔採用」を制作しました。WEBカメラで自分の顔を撮影すると、その場で顔を解析します。そこから独自の計算式によって、顔を5タイプに分類し結果が見れる仕組みです。",
    thumbnail: "/images/works/kao_t.png",
    images: [
      "/images/works/kao.jpg",
      "/images/works/kao_02.jpg",
    ],
    video: null,
  },
  {
    slug: "seirogan",
    category: ["WEB", "CAMPAIGN", "MUSIC"],
    title: "SEIROGAN UTILITY RECORDS",
    client: "大幸薬品株式会社",
    year: "2024",
    description:
      "世界初製薬会社による期間限定の音楽レーベル「SEIROGAN UTILITY RECORDS」のWEBサイト、EVISBEATSとMICHEL☆PUNCH「ポジティブになる音楽」、やけのはら「緊張をほぐす音楽」、Kan Sano「集中する音楽」の制作をさせていただきました。",
    thumbnail: "/images/works/seirogan.png",
    video: "/videos/works/work-04.mp4",
  },
];

export function getWork(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}
