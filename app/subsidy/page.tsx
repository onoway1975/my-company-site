import type { Metadata } from "next";
import SubsidyClient from "./SubsidyClient";

const TITLE = "補助金マッチ | あなたの事業に合う補助金を探す";
const DESCRIPTION =
  "自社の業種・事業内容・困りごとを入力するだけ。Jグランツ（デジタル庁）の公募中補助金からAIが候補をマッチングして提示します。無料・ログイン不要。";
const URL = "https://ciraf.jp/subsidy/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: URL,
  },
};

export default function SubsidyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "補助金マッチ",
            description: DESCRIPTION,
            url: URL,
            applicationCategory: "BusinessApplication",
            operatingSystem: "All",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "JPY",
            },
          }),
        }}
      />
      <SubsidyClient />
    </>
  );
}
