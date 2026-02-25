"use client";

import { useState } from "react";

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

  function update(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      // TODO: Connect to email service (e.g. Resend, SendGrid)
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("success");
      setFormData({ name: "", company: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full border border-border bg-transparent px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors duration-200";
  const labelClass =
    "block text-[10px] tracking-[0.15em] text-muted uppercase mb-2";

  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: heading */}
          <div>
            <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-6">
              Contact
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-ink leading-snug mb-6">
              お問い合わせ
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              サービスに関するご質問・ご相談は、
              <br className="hidden lg:block" />
              お気軽にご連絡ください。
            </p>
            <p className="text-xs text-muted leading-relaxed">
              We welcome your inquiries about our services.
              <br />
              We will respond within 3 business days.
            </p>
          </div>

          {/* Right: form */}
          <div>
            {status === "success" ? (
              <div className="border border-border p-8">
                <p className="text-ink mb-2">お問い合わせを承りました。</p>
                <p className="text-sm text-muted leading-relaxed">
                  担当者より3営業日以内にご連絡いたします。
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-xs tracking-widest text-muted underline underline-offset-4 hover:text-ink transition-colors duration-200"
                >
                  別のお問い合わせをする
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      お名前 <span className="text-ink">*</span>
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
                    メールアドレス <span className="text-ink">*</span>
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
                    お問い合わせ内容 <span className="text-ink">*</span>
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
                  <p className="text-xs text-red-600">
                    送信に失敗しました。しばらく時間をおいてから再度お試しください。
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-3 bg-ink text-white text-xs tracking-[0.2em] uppercase px-8 py-4 hover:opacity-75 transition-opacity duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "送信中..." : "送信する"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
