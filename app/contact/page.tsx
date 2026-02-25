import type { Metadata } from "next";
import { ContactSection } from "../components/ContactSection";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "シラフ株式会社へのお問い合わせ。サービスに関するご質問・ご相談はこちらからお気軽にどうぞ。",
};

const faqs = [
  {
    q: "どのような案件を受け付けていますか？",
    a: "ウェブ制作・ブランディング・コンサルティングに関するご依頼を承っています。規模の大小を問わず、まずはご相談ください。",
  },
  {
    q: "対応エリアはどこですか？",
    a: "全国対応しています。基本的にはオンラインでのやり取りを中心に進めますが、必要に応じて対面でのミーティングも可能です。",
  },
  {
    q: "予算感を教えてください。",
    a: "プロジェクトの規模・内容によって異なります。まずはご要件をお聞かせください。お見積りは無料です。",
  },
  {
    q: "納期はどのくらいですか？",
    a: "プロジェクトの内容により異なりますが、ウェブ制作であれば2〜4ヶ月程度が目安です。お急ぎの場合はご相談ください。",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Page Header ── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-6">
            Contact
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-ink mb-8">
            お問い合わせ
          </h1>
          <p className="text-muted max-w-lg leading-relaxed text-sm">
            サービスに関するご質問・ご相談・お見積りのご依頼は、
            <br className="hidden md:block" />
            下記フォームよりお気軽にお問い合わせください。
            <br />
            <span className="text-xs mt-2 inline-block">
              Please use the form below for any inquiries.
            </span>
          </p>
        </div>
      </section>

      {/* ── Contact Form (main) ── */}
      <ContactSection />

      {/* ── FAQ ── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-24">
            <div>
              <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-8">
                FAQ
              </p>
              <h2 className="text-2xl md:text-3xl font-light text-ink">
                よくある
                <br />
                ご質問
              </h2>
            </div>
            <div>
              <dl className="border-t border-border">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border-b border-border py-7"
                  >
                    <dt className="text-ink text-[0.95rem] mb-3">{faq.q}</dt>
                    <dd className="text-sm text-muted leading-relaxed">
                      {faq.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
