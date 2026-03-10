import type { Metadata } from "next";
import { BodyPageType } from "../components/BodyPageType";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "シラフ株式会社のプライバシーポリシーページです。",
};

const sections = [
  {
    title: "個人情報の取り扱いについて",
    content: `シラフ株式会社（以下「当社」）は、お客様の個人情報保護の重要性を認識し、個人情報の保護に関する法律（個人情報保護法）およびその他関連法令を遵守します。本プライバシーポリシーは、当社が運営するウェブサイト https://ciraf.jp（以下「本サイト」）における個人情報の取り扱いについて説明するものです。`,
  },
  {
    title: "個人情報の収集・利用目的",
    content: `当社は、以下の目的のために個人情報を収集・利用します。

・お問い合わせへの対応および回答
・サービスの提供・改善
・ご提案・ご案内の送付
・法令に基づく対応

収集した個人情報は、上記目的の範囲内でのみ利用し、目的外の利用はいたしません。`,
  },
  {
    title: "個人情報の第三者提供",
    content: `当社は、以下の場合を除き、収集した個人情報を第三者に提供することはありません。

・ご本人の同意がある場合
・法令に基づく開示が必要な場合
・人の生命・身体・財産の保護のために必要な場合`,
  },
  {
    title: "個人情報の管理",
    content: `当社は、個人情報の正確性を保ち、不正アクセス・紛失・改ざん・漏洩などを防ぐために、適切な安全管理措置を講じます。個人情報の取り扱いを外部に委託する場合は、適切な監督を行います。`,
  },
  {
    title: "お問い合わせフォームについて",
    content: `本サイトのお問い合わせフォームでは、お名前・会社名・メールアドレス・お問い合わせ内容を収集しています。これらの情報はお問い合わせへの対応のみに使用し、第三者への提供は行いません。`,
  },
  {
    title: "Googleアナリティクスの利用について",
    content: `本サイトでは、アクセス解析のためにGoogleアナリティクスを使用しています。Googleアナリティクスはデータの収集のためにCookieを使用します。このデータは匿名で収集されており、個人を特定するものではありません。

この機能はCookieを無効にすることで収集を拒否することができます。詳しくはGoogleのプライバシーポリシーをご確認ください。`,
  },
  {
    title: "免責事項",
    content: `本サイトに掲載されている情報の正確性には万全を期しておりますが、当社は利用者が本サイトの情報を用いて行う一切の行為について責任を負いません。また、本サイトからリンクされた外部サイトの内容についても、当社は責任を負いかねます。`,
  },
  {
    title: "プライバシーポリシーの変更",
    content: `当社は、法令の改正やサービス内容の変更に伴い、本プライバシーポリシーを予告なく変更することがあります。変更後のプライバシーポリシーは、本サイトに掲載した時点から効力を生じるものとします。`,
  },
  {
    title: "お問い合わせ先",
    content: `個人情報に関するお問い合わせは、下記までご連絡ください。

シラフ株式会社
〒150-0001 東京都渋谷区神宮前3-25-18 205 THE SHARE
TEL：03-4540-7546
お問い合わせフォーム：https://ciraf.jp/contact/`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <BodyPageType type="privacy" />
      <section className="px-6 lg:px-12 py-24 md:py-32">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
          Privacy Policy
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-4">
          プライバシーポリシー
        </h1>
        <p className="text-sm text-muted mb-16">制定日：2024年1月1日</p>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, i) => (
            <div key={i} className="border-t border-border pt-10">
              <p className="text-[0.7rem] tracking-[0.15em] text-[#888888] uppercase mb-4">
                {i + 1}. {section.title}
              </p>
              <p className="text-base text-[#333333] leading-[1.9] whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
