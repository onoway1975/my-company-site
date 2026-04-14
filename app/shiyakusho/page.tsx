"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MayorAvatar from "./_components/MayorAvatar";
import { PREFECTURES, CITIES } from "./_components/municipalities";

export default function ShiyakushoPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");

  const cities = prefecture ? CITIES[prefecture] ?? [] : [];
  const canSubmit = nickname.trim() && prefecture && city;

  function handlePrefectureChange(val: string) {
    setPrefecture(val);
    setCity("");
  }

  function handleEnter() {
    if (!canSubmit) return;
    const name = nickname.trim();
    const municipality = `${prefecture}${city}`;
    localStorage.setItem("shiyakusho_name", name);
    localStorage.setItem("shiyakusho_city", municipality);
    const params = new URLSearchParams({ name, city: municipality });
    router.push(`/shiyakusho/room?${params.toString()}`);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAFAF8" }}>
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <MayorAvatar className="w-40 md:w-52 mb-8" />

        <h1 className="text-2xl md:text-3xl font-bold text-ink text-center mb-2">
          リモート市役所
        </h1>
        <p className="text-muted text-sm md:text-base text-center mb-10">
          市長は今日も在室中です。お気軽にお声がけください。
        </p>

        {/* Form Card */}
        <div
          className="w-full max-w-md rounded-2xl p-6 md:p-8 shadow-sm"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E8E8" }}
        >
          {/* Nickname */}
          <label className="block mb-4">
            <span className="text-xs font-medium text-muted tracking-wide uppercase block mb-1.5">
              ニックネーム
            </span>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="例: さくら"
              maxLength={20}
              className="w-full border border-[#E0E0E0] rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#1B2A4A] transition-colors"
              style={{ backgroundColor: "#FAFAF8" }}
            />
          </label>

          {/* Prefecture */}
          <label className="block mb-4">
            <span className="text-xs font-medium text-muted tracking-wide uppercase block mb-1.5">
              都道府県
            </span>
            <select
              value={prefecture}
              onChange={(e) => handlePrefectureChange(e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-[#1B2A4A] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M3%205l3%203%203-3%22%20stroke%3D%22%23767676%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]"
              style={{ backgroundColor: "#FAFAF8" }}
            >
              <option value="">選択してください</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>

          {/* City */}
          <label className="block mb-6">
            <span className="text-xs font-medium text-muted tracking-wide uppercase block mb-1.5">
              市区町村
            </span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!prefecture}
              className="w-full border border-[#E0E0E0] rounded-lg px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-[#1B2A4A] transition-colors disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M3%205l3%203%203-3%22%20stroke%3D%22%23767676%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]"
              style={{ backgroundColor: "#FAFAF8" }}
            >
              <option value="">選択してください</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          {/* Submit */}
          <button
            onClick={handleEnter}
            disabled={!canSubmit}
            className="w-full py-3 rounded-full text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#1B2A4A" }}
          >
            市長室に入る
          </button>
        </div>

        <p className="text-[11px] text-muted mt-6 text-center leading-relaxed">
          ※ これは架空の市長とのチャット体験です。
          <br />
          入力した内容はサービス改善のため保存されます。
        </p>
      </div>
    </div>
  );
}
