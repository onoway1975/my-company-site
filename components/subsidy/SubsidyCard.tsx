"use client";

import { CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import type { MatchResult } from "@/types/subsidy";

function scoreBadge(score: number) {
  const bg = score >= 80 ? "bg-[#16a34a]" : score >= 60 ? "bg-[#65a30d]" : "bg-[#ca8a04]";
  return (
    <span className={`inline-flex items-center rounded-full ${bg} px-2.5 py-0.5 text-xs font-semibold text-white`}>
      マッチ度 {score}
    </span>
  );
}

function formatAmount(amount: number | null) {
  if (amount == null) return "---";
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}億円`;
  if (amount >= 10_000) return `${(amount / 10_000).toLocaleString()}万円`;
  return `${amount.toLocaleString()}円`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "---";
  try {
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return dateStr;
  }
}

export default function SubsidyCard({ match }: { match: MatchResult }) {
  return (
    <div className="rounded-xl border border-[#e2e2e2] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <h3 className="text-lg font-bold text-[#1A2B4A] leading-snug flex-1 min-w-0">
          {match.title}
        </h3>
        {scoreBadge(match.match_score)}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#555] mb-4">
        <span>上限額: <strong className="text-[#1A2B4A]">{formatAmount(match.subsidy_max_limit)}</strong></span>
        <span>締切: <strong className="text-[#1A2B4A]">{formatDate(match.acceptance_end_datetime)}</strong></span>
      </div>

      {match.reasons.length > 0 && (
        <ul className="space-y-1 mb-3">
          {match.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#333]">
              <CheckCircle size={16} className="mt-0.5 shrink-0 text-[#16a34a]" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}

      {match.cautions.length > 0 && (
        <ul className="space-y-1 mb-3">
          {match.cautions.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#777]">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#ca8a04]" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <a
          href={match.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A2B4A] px-4 py-2 text-sm font-medium text-[#1A2B4A] transition-colors hover:bg-[#1A2B4A] hover:text-white"
        >
          公式ページで確認
          <ExternalLink size={14} />
        </a>
      </div>

      <p className="mt-3 text-xs text-[#9ca3af]">
        ※ 最終的な要件・締切は必ず公式でご確認ください
      </p>
    </div>
  );
}
