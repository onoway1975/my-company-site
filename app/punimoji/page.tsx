import Script from "next/script";
import PunimojiClient from "./components/PunimojiClient";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ぷに文字メーカーの利用料金はかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "完全無料でご利用いただけます。会員登録も不要です。",
      },
    },
    {
      "@type": "Question",
      name: "どんな文字が入力できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ひらがな・カタカナ・漢字・英数字・絵文字に対応しています。最大10文字まで入力できます。",
      },
    },
    {
      "@type": "Question",
      name: "生成した画像はどこで使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Instagramストーリーやリール、LINEアイコン、誕生日カード、推し活デコなど、自由にお使いいただけます。商用利用はご遠慮ください。",
      },
    },
    {
      "@type": "Question",
      name: "1日に何回使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1日あたりの回数制限があります。制限はリセットされますので、翌日またお楽しみください。",
      },
    },
    {
      "@type": "Question",
      name: "スタイルは何種類ありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「ぷに」「ネオン」「メタル」「くれよん」の4種類から選べます。それぞれ雰囲気の異なるぷっくり3D文字が生成されます。",
      },
    },
    {
      "@type": "Question",
      name: "うちわ文字やネームボードに使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、推し活のうちわ文字やネームボードの素材として最適です。背景透過PNGで保存できるので、お好みの台紙に組み合わせて使えます。",
      },
    },
    {
      "@type": "Question",
      name: "ひらがな以外も使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ひらがな・カタカナ・漢字・英数字すべてに対応しています。日本語の3D文字を作りたい方に最適です。",
      },
    },
    {
      "@type": "Question",
      name: "インスタストーリーで使う方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "生成した画像をスマホに保存して、Instagramのストーリー作成画面の「スタンプ」→「写真」から選択するだけ。詳しい使い方ガイドも用意しています。",
      },
    },
  ],
};

export default function PunimojiPage() {
  return (
    <>
      <Script
        id="punimoji-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PunimojiClient />
    </>
  );
}
