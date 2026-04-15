"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Step = 1 | 2 | 3;

export default function PostClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/yume100/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }
      setImageUrl(data.image_url);
      setStep(2);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/yume100/dreams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), image_url: imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "投稿に失敗しました");
        return;
      }
      setStep(3);
      setTimeout(() => router.push("/yume100/"), 2000);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFDF7" }}>
      <div className="max-w-lg mx-auto px-6 py-12">
        {/* ステップインジケータ */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-1 rounded-full transition-colors ${
                s <= step ? "bg-[#F5A623]" : "bg-[#e2e2e2]"
              }`}
            />
          ))}
        </div>

        {/* Step 1: テキスト入力 */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-center mb-2 text-[#111]">
              夢を書こう
            </h1>
            <p className="text-sm text-center text-[#767676] mb-8">
              「こんな未来、良いよね！」を140字以内で
            </p>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 140))}
                placeholder="例: 誰もが週3日だけ働いて、残りは好きなことに没頭できる世界"
                rows={5}
                className="w-full rounded-xl border border-[#e2e2e2] bg-white p-4 text-[#111] text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]"
              />
              <span
                className={`absolute bottom-3 right-3 text-xs ${
                  content.length >= 130 ? "text-red-500" : "text-[#767676]"
                }`}
              >
                {content.length}/140
              </span>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
            )}
            <button
              onClick={handleGenerate}
              disabled={!content.trim() || loading}
              className="mt-6 w-full rounded-xl py-3.5 text-white font-bold text-base transition-opacity disabled:opacity-40"
              style={{ backgroundColor: "#F5A623" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  AIが夢を描いています…
                </span>
              ) : (
                "夢を描く"
              )}
            </button>
          </div>
        )}

        {/* Step 2: プレビュー */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-center mb-2 text-[#111]">
              あなたの夢
            </h1>
            <p className="text-sm text-center text-[#767676] mb-6">
              AIが描いた未来のイメージ
            </p>
            <div className="rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image
                src={imageUrl}
                alt="夢のイメージ"
                width={800}
                height={600}
                className="w-full"
              />
            </div>
            <p className="text-[#111] text-base leading-relaxed bg-white rounded-xl p-4 border border-[#e2e2e2]">
              {content}
            </p>
            {error && (
              <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl py-3.5 font-bold text-[#767676] border border-[#e2e2e2] bg-white"
              >
                書き直す
              </button>
              <button
                onClick={handlePost}
                disabled={loading}
                className="flex-1 rounded-xl py-3.5 text-white font-bold transition-opacity disabled:opacity-40"
                style={{ backgroundColor: "#F5A623" }}
              >
                {loading ? "投稿中…" : "投稿する"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 完了 */}
        {step === 3 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">&#x2728;</div>
            <h1 className="text-2xl font-bold text-[#111] mb-2">
              夢を投稿しました！
            </h1>
            <p className="text-sm text-[#767676]">
              タイムラインにリダイレクトします…
            </p>
          </div>
        )}
        {/* タイムラインに戻る */}
        <div className="text-center mt-10">
          <Link
            href="/yume100/"
            className="inline-block rounded-full px-8 py-3.5 font-bold text-base text-[#F5A623] bg-white hover:bg-[#F5A623] hover:text-white transition-colors duration-200"
            style={{ border: "1.5px solid #F5A623" }}
          >
            &larr; タイムラインに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
