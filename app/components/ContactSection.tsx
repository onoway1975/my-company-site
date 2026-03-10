"use client";

import { useState } from "react";
import { sendContactEmail } from "../actions/contact";

type FormData = {
  name: string;
  company: string;
  email: string;
  message: string;
};

type Status = "idle" | "loading" | "success" | "error";

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [agreed, setAgreed] = useState(false);

  function update(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const result = await sendContactEmail(formData);
    if (result.success) {
      setStatus("success");
      setFormData({ name: "", company: "", email: "", message: "" });
    } else {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full border border-white/30 bg-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/70 transition-colors duration-200";
  const labelClass =
    "block text-xs tracking-[0.15em] text-white/70 uppercase mb-2";

  return (
    <section className="py-3 px-4 lg:px-6 pb-6">
      <div className="max-w-7xl mx-auto bg-[#111111] rounded-[2rem] px-8 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: heading */}
          <div>
            <p className="text-xs tracking-[0.15em] text-white/60 uppercase mb-6">
              Contact
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-6">
              お問い合わせ
            </h2>
            <p className="text-base text-white/85 leading-[1.9] mb-3">
              Web制作・ブランディング・映像制作のご相談は、シラフ株式会社へ。
              <br className="hidden lg:block" />
              企画から運用まで一気通貫でサポートします。お気軽にお問い合わせください。
            </p>
            <p className="text-base text-white/85 leading-[1.9]">
              For inquiries about web design, branding, and video production, contact ciraf inc.
              <br />
              We&apos;ll respond within 3 business days.
            </p>
          </div>

          {/* Right: form */}
          <div>
            {status === "success" ? (
              <div className="bg-white/10 rounded-[1.25rem] p-8">
                <p className="text-white mb-2">お問い合わせを承りました。</p>
                <p className="text-sm text-white/50 leading-relaxed">
                  担当者より3営業日以内にご連絡いたします。
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-xs tracking-widest text-white/40 underline underline-offset-4 hover:text-white transition-colors duration-200"
                >
                  別のお問い合わせをする
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      お名前 <span className="text-white/50">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={inputClass}
                      placeholder="山田 太郎"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>会社名</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => update("company", e.target.value)}
                      className={inputClass}
                      placeholder="株式会社○○"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    メールアドレス <span className="text-white/50">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass}
                    placeholder="taro@example.com"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    お問い合わせ内容 <span className="text-white/50">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="お問い合わせ内容をご記入ください"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-400">
                    送信に失敗しました。しばらく時間をおいてから再度お試しください。
                  </p>
                )}

                {/* Privacy consent */}
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <span className="relative flex-shrink-0 w-5 h-5">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        data-gtm-click="privacy_agree"
                        data-gtm-location="contact_form"
                        className="peer appearance-none w-5 h-5 rounded border border-white/40 bg-white/10 checked:bg-white checked:border-white transition-colors duration-200 cursor-pointer"
                      />
                      <svg
                        className="pointer-events-none absolute inset-0 w-5 h-5 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M4 10l4 4 8-8"
                          stroke="#111111"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[0.85rem] text-white/85">
                      個人情報の取り扱いに同意する
                    </span>
                  </label>
                  <p className="text-[0.8rem] text-white/50 pl-8">
                    個人情報の取り扱いについては、以下URLをご参照ください。
                    <br />
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline underline-offset-2 hover:text-white/70 transition-colors duration-200"
                    >
                      https://ciraf.jp/privacy/
                    </a>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || !agreed}
                  data-gtm-click="cta_contact_submit"
                  data-gtm-location="contact_form"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-ink border border-white text-[0.8rem] tracking-[0.1em] py-3 px-7 hover:bg-white/80 transition-all duration-[250ms] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "送信中..." : "送信する →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
