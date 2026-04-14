"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PREFECTURES, CITIES } from "../_components/municipalities";

type Opinion = {
  id: string;
  nickname: string;
  municipality: string;
  content: string;
  category: string;
  reply: string | null;
  created_at: string;
};

const CATEGORIES = ["すべて", "交通", "子育て", "観光", "道路", "その他"] as const;

const SELECT_STYLE =
  "border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-[#1B2A4A] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M3%205l3%203%203-3%22%20stroke%3D%22%23767676%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center] pr-8";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export default function BoardPage() {
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("すべて");
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);

  const cities = prefecture ? CITIES[prefecture] ?? [] : [];

  function handlePrefectureChange(val: string) {
    setPrefecture(val);
    setCity("");
  }

  useEffect(() => {
    async function fetchOpinions() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "すべて") {
          params.set("category", activeCategory);
        }
        if (city && prefecture) {
          params.set("municipality", `${prefecture}${city}`);
        } else if (prefecture) {
          params.set("prefecture", prefecture);
        }
        const res = await fetch(`/api/shiyakusho/board?${params.toString()}`);
        const data = await res.json();
        setOpinions(data.opinions ?? []);
      } catch {
        setOpinions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOpinions();
  }, [activeCategory, prefecture, city]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF8" }}>
      {/* Header */}
      <div className="border-b border-[#E8E8E8]" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl md:text-2xl font-bold text-ink">
              {city ? `${city}の声` : prefecture ? `${prefecture}の声` : "市民の声"} 掲示板
            </h1>
            <Link
              href="/shiyakusho"
              className="text-xs text-muted hover:text-ink transition-colors"
            >
              市役所トップへ
            </Link>
          </div>
          <p className="text-sm text-muted">
            {city || prefecture
              ? `${city || prefecture}から届いた声をまとめています`
              : "みなさんから届いた声をまとめています"}
          </p>
        </div>
      </div>

      {/* Area filter */}
      <div className="border-b border-[#E8E8E8]" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <select
              value={prefecture}
              onChange={(e) => handlePrefectureChange(e.target.value)}
              className={`flex-1 min-w-0 ${SELECT_STYLE}`}
              style={{ backgroundColor: "#FAFAF8" }}
            >
              <option value="">すべての都道府県</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!prefecture}
              className={`flex-1 min-w-0 disabled:opacity-50 ${SELECT_STYLE}`}
              style={{ backgroundColor: "#FAFAF8" }}
            >
              <option value="">すべての市区町村</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="border-b border-[#E8E8E8]" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "text-white"
                    : "text-muted hover:text-ink"
                }`}
                style={{
                  backgroundColor: activeCategory === cat ? "#1B2A4A" : "#F0F0EE",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opinion cards */}
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="flex items-center justify-center gap-1 mb-3">
              <span className="chat-dot" />
              <span className="chat-dot chat-dot-delay-1" />
              <span className="chat-dot chat-dot-delay-2" />
            </div>
            <p className="text-sm text-muted">読み込み中...</p>
          </div>
        ) : opinions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-sm text-muted">まだ意見がありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {opinions.map((op) => (
              <div
                key={op.id}
                className="rounded-2xl p-5 md:p-6"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E8E8" }}
              >
                {/* Meta */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium text-white"
                    style={{ backgroundColor: "#1B2A4A" }}
                  >
                    {op.category}
                  </span>
                  <span className="text-[11px] text-muted ml-auto">
                    {formatDate(op.created_at)}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-3">
                  <p className="text-xs text-muted mb-1">
                    {op.nickname}さん
                    <span className="ml-1.5 text-[10px] text-muted/70">{op.municipality}</span>
                  </p>
                  <p className="text-sm text-ink leading-relaxed">
                    {op.content}
                  </p>
                </div>

                {/* Mayor reply */}
                {op.reply && (
                  <div
                    className="rounded-xl px-4 py-3 mt-3"
                    style={{ backgroundColor: "#F3F4F6" }}
                  >
                    <p className="text-[11px] text-muted mb-1">💬 市長からの返答</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#1B2A4A" }}>
                      {op.reply}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
