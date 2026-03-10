import type { Metadata } from "next";
import { ContactSection } from "../components/ContactSection";
import { BodyPageType } from "../components/BodyPageType";

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
      <BodyPageType type="contact" />
      {/* ── Page Header ── */}
      <section className="pt-6 pb-3 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
          <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
            Contact
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-ink mb-6">
            お問い合わせ
          </h1>
          <p className="text-base text-[#333333] leading-[1.9] max-w-lg">
            サービスに関するご質問・ご相談・お見積りのご依頼は、
            <br className="hidden md:block" />
            下記フォームよりお気軽にお問い合わせください。
            <br />
            <span className="text-sm text-[#333333] mt-2 inline-block">
              Please use the form below for any inquiries.
            </span>
          </p>
        </div>
      </section>

      {/* ── Contact Form (main) ── */}
      <ContactSection />

      {/* ── FAQ ── */}
      <section className="py-3 pb-6 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] px-8 md:px-12 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-24">
            <div>
              <p className="text-xs tracking-[0.15em] text-ink uppercase mb-4">
                FAQ
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-ink">
                よくあるご質問
              </h2>
            </div>
            <div>
              <dl>
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border-b border-dashed border-[#e2e2e2] py-7"
                  >
                    <dt className="font-bold text-ink text-[0.95rem] mb-3">
                      {faq.q}
                    </dt>
                    <dd className="text-sm text-[#333333] leading-relaxed">
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
