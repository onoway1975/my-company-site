"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SubsidyFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export default function SubsidyForm({ onSubmit, isLoading }: SubsidyFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 10 || isLoading) return;
    onSubmit(text.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label
        htmlFor="subsidy-input"
        className="block text-sm font-medium text-[#1A2B4A] mb-2"
      >
        会社の業種・事業内容・困っていること・これからやりたい事業を、
        わかる範囲で自由に書いてください
      </label>
      <textarea
        id="subsidy-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
        rows={6}
        className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-3 text-base text-[#1A2B4A] placeholder:text-[#9ca3af] focus:border-[#1A2B4A] focus:outline-none focus:ring-1 focus:ring-[#1A2B4A] disabled:opacity-50 resize-y"
        placeholder={`例：東京都で従業員5名の小売店を営んでいます。\n実店舗の売上が減少しており、ECサイトを立ち上げて新規の販路を開拓したいと考えています。\nITツールの導入やウェブサイト制作にかかる費用を補助してもらえる制度を探しています。`}
      />
      <div className="mt-1 text-xs text-[#9ca3af]">
        {text.trim().length < 10
          ? `あと${Math.max(0, 10 - text.trim().length)}文字以上入力してください`
          : `${text.trim().length}文字`}
      </div>
      <button
        type="submit"
        disabled={text.trim().length < 10 || isLoading}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1A2B4A] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#2a3d5c] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Search size={18} />
        補助金を探す
      </button>
    </form>
  );
}
