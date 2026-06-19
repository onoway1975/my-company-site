"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "入力内容を分析しています...",
  "公募中の補助金を検索しています...",
  "マッチング判定をしています...",
];

export default function LoadingState() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1A2B4A] border-t-transparent" />
      <p className="text-sm text-[#555]">{STEPS[step]}</p>
    </div>
  );
}
