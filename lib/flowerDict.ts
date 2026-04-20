/** 花名・色名の日英辞書（Claude の name_en フォールバック用） */

export const FLOWER_DICT: Record<string, string> = {
  ラナンキュラス: "ranunculus",
  ポピー: "poppy",
  アネモネ: "anemone",
  ダリア: "dahlia",
  チューリップ: "tulip",
  バラ: "garden rose",
  シャクヤク: "peony",
  ピオニー: "peony",
  コスモス: "cosmos",
  チョコレートコスモス: "chocolate cosmos",
  アジサイ: "hydrangea",
  スイートピー: "sweet pea",
  ユリ: "lily",
  ストック: "stock flower",
  ユーカリ: "eucalyptus",
  スモークツリー: "smoke tree",
  カスミソウ: "baby's breath",
  ガーベラ: "gerbera",
  ひまわり: "sunflower",
  マーガレット: "marguerite",
  ラベンダー: "lavender",
  シルバーリーフ: "silver-dollar leaves",
};

export const COLOR_DICT: Record<string, string> = {
  朱色: "vermillion",
  深紅: "deep red",
  ワインレッド: "wine red",
  バーガンディ: "burgundy",
  ピンク: "pink",
  淡いピンク: "pale pink",
  ローズピンク: "rose pink",
  オレンジ: "orange",
  ピーチ: "peach",
  黄色: "yellow",
  白: "white",
  クリーム: "cream",
  紫: "purple",
  ラベンダー: "lavender",
  黒: "deep black",
  ダーク: "dark",
};

/** 日本語の色名を英語に変換（辞書にない場合はそのまま返す） */
export function translateColorToEn(colorJa: string): string {
  return COLOR_DICT[colorJa] ?? colorJa;
}
