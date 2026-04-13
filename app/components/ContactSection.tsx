"use client";

import { useRef, useState } from "react";

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
  const nameRef = useRef<HTMLInputElement>(null);

  function update(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", company: "", email: "", message: "" });
      } else {
        setStatus("error");
        nameRef.current?.focus();
      }
    } catch {
      setStatus("error");
      nameRef.current?.focus();
    }
  }

  const inputClass =
    "w-full border border-[#d8d8d8] bg-[#fff] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#aaa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/20 focus-visible:border-[#1a1a1a]/40 transition-colors duration-200";
  const labelClass =
    "block text-xs tracking-[0.15em] text-[#555] uppercase mb-2";

  return (
    <section className="py-3 px-4 lg:px-6 pb-6">
      <div className="max-w-7xl mx-auto bg-[#f4f4f4] rounded-[2rem] px-8 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: heading */}
          <div>
            <p className="text-xs tracking-[0.15em] text-[#555] uppercase mb-6">
              Contact
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] leading-snug mb-3">
              お問い合わせ
            </h2>
            <p className="text-[13px] text-[#999] mb-6">
              まず話だけしたい方は、右下のチャットからどうぞ。
            </p>
            <p className="text-base text-[#333] leading-[1.9] mb-3">
              Web制作・ブランディング・映像制作のご相談は、シラフ株式会社へ。
              <br className="hidden lg:block" />
              企画から運用まで一気通貫でサポートします。お気軽にお問い合わせください。
            </p>
            <p className="text-base text-[#333] leading-[1.9]">
              For inquiries about web design, branding, and video production, contact ciraf inc.
              <br />
              We&apos;ll respond within 5 business days.
            </p>
          </div>

          {/* Right: form */}
          <div>
            {status === "success" ? (
              <div className="bg-white rounded-[1.25rem] p-8 border border-[#d8d8d8]">
                <p className="text-[#1a1a1a] leading-relaxed">
                  お問い合わせを受け付けました。5営業日以内にご連絡いたします。
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-xs tracking-widest text-[#999] underline underline-offset-4 hover:text-[#1a1a1a] transition-colors duration-200"
                >
                  別のお問い合わせをする
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      お名前 <span className="text-[#aaa]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      ref={nameRef}
                      value={formData.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={inputClass}
                      placeholder="山田 太郎"
                      aria-describedby={status === "error" ? "contact-error" : undefined}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-company" className={labelClass}>会社名（任意）</label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={formData.company}
                      onChange={(e) => update("company", e.target.value)}
                      className={inputClass}
                      placeholder="株式会社○○"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    メールアドレス <span className="text-[#aaa]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass}
                    placeholder="taro@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    お問い合わせ内容 <span className="text-[#aaa]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="お問い合わせ内容をご記入ください"
                  />
                </div>

                {status === "error" && (
                  <p id="contact-error" className="text-xs text-red-500" role="alert">
                    送信に失敗しました。内容をご確認の上、再度お試しください。
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
                        className="peer appearance-none w-5 h-5 rounded border border-[#d8d8d8] bg-white checked:bg-[#1a1a1a] checked:border-[#1a1a1a] focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/30 transition-colors duration-200 cursor-pointer"
                      />
                      <svg
                        className="pointer-events-none absolute inset-0 w-5 h-5 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M4 10l4 4 8-8"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[0.85rem] text-[#555]">
                      個人情報の取り扱いに同意する
                    </span>
                  </label>
                  <p className="text-[0.75rem] text-[#999] pl-8">
                    個人情報の取り扱いについては、以下URLをご参照ください。
                    <br />
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#aaa] underline underline-offset-2 hover:text-[#555] transition-colors duration-200"
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
                  data-gtm-label="contact_submit"
                  className="w-full rounded-full bg-[#1a1a1a] text-white text-[0.8rem] font-medium tracking-[0.1em] py-3 px-7 hover:opacity-85 transition-opacity duration-[250ms] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "送信中\u2026" : "送信する →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
