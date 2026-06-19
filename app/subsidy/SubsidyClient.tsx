"use client";

import { useState } from "react";
import type { MatchResult } from "@/types/subsidy";
import SubsidyForm from "@/components/subsidy/SubsidyForm";
import SubsidyCard from "@/components/subsidy/SubsidyCard";
import LoadingState from "@/components/subsidy/LoadingState";

type Status = "idle" | "loading" | "results" | "error";

export default function SubsidyClient() {
  const [status, setStatus] = useState<Status>("idle");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (text: string) => {
    setStatus("loading");
    setMatches([]);
    setErrorMessage("");

    try {
      const res = await fetch("/api/subsidy/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "エラーが発生しました。");
        setStatus("error");
        return;
      }

      setMatches(data.matches ?? []);
      setStatus("results");
    } catch {
      setErrorMessage("通信エラーが発生しました。しばらくしてから再度お試しください。");
      setStatus("error");
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-[#1A2B4A] sm:text-3xl">
          補助金マッチ
        </h1>
        <p className="mt-2 text-sm text-[#555]">
          事業内容を入力するだけで、公募中の補助金候補をAIが提示します
        </p>
        <p className="mt-1 text-xs text-[#9ca3af]">
          Jグランツ（デジタル庁）掲載の公募中補助金が対象です
        </p>
      </div>

      <SubsidyForm onSubmit={handleSubmit} isLoading={status === "loading"} />

      {status === "loading" && <LoadingState />}

      {status === "error" && (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {status === "results" && matches.length === 0 && (
        <div className="mt-8 rounded-lg border border-[#e2e2e2] bg-[#f7f7f7] px-4 py-6 text-center text-sm text-[#555]">
          <p className="font-medium">
            Jグランツ掲載分では候補が見つかりませんでした。
          </p>
          <p className="mt-1 text-xs text-[#9ca3af]">
            キーワードを変えて再入力してみてください。
          </p>
        </div>
      )}

      {status === "results" && matches.length > 0 && (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-[#555]">
            {matches.length}件の候補が見つかりました
          </p>
          {matches.map((m) => (
            <SubsidyCard key={m.subsidy_id} match={m} />
          ))}
        </div>
      )}

      {/* 常設フッター免責表記 */}
      <footer className="mt-12 border-t border-[#e2e2e2] pt-6 pb-8">
        <p className="text-xs leading-relaxed text-[#9ca3af]">
          本サイトはJグランツ掲載分からの参考提示です。受給を保証するものではありません。
          Jグランツに全ての補助金が掲載されているわけではありません。
          詳細は公式・お近くの商工会議所・税理士／行政書士へご相談ください。
        </p>
      </footer>
    </main>
  );
}
