import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { figures, getTodayFigure, isBirthday } from "@/app/data/figures";
import DemoClient from "./DemoClient";

export const maxDuration = 120;

export const metadata: Metadata = {
  title: "偉人AI肖像画ジェネレーター | ciraf",
  description:
    "今日にゆかりの偉人スタイルで、あなたの顔をAIが肖像画に変換します。",
};

export default function DemoPage() {
  if (process.env.NODE_ENV === "production") { notFound(); }

  const today = new Date();
  const figure = getTodayFigure(today);
  const birthday = isBirthday(figure, today);

  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateStr = `${mm}.${dd}`;

  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <p className="text-[10px] tracking-[0.2em] text-muted uppercase">
            偉人AI肖像画ジェネレーター
          </p>
          <div className="flex items-center gap-3">
            {birthday && (
              <span className="text-[10px] tracking-[0.2em] text-[#BF3315] uppercase">
                Birthday
              </span>
            )}
            <span className="text-sm tabular-nums text-muted">{dateStr}</span>
          </div>
        </div>
      </div>

      {/* Decorative accent bar */}
      <div className="h-0.5 bg-[#BF3315]" />

      <DemoClient figure={figure} />

      {/* All figures list */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-8">
            All Figures
          </p>
          <AllFiguresList currentId={figure.id} />
        </div>
      </div>

      {/* Footer note */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <p className="text-xs text-muted/60 leading-relaxed">
            このツールは Replicate の face-to-many モデルを使用しています。
            生成画像はデモ目的のみです。アップロードした写真はサーバーに保存されません。
            <br />
            <code className="font-mono text-[10px]">REPLICATE_API_TOKEN</code>{" "}
            を <code className="font-mono text-[10px]">.env.local</code>{" "}
            に設定してご利用ください。
          </p>
        </div>
      </div>
    </main>
  );
}

function AllFiguresList({ currentId }: { currentId: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-px border border-border bg-border">
      {figures.map((fig) => (
        <div
          key={fig.id}
          className={[
            "bg-white px-4 py-5 transition-colors",
            fig.id === currentId ? "bg-surface" : "",
          ].join(" ")}
        >
          <p className="text-[10px] text-muted mb-1 tabular-nums tracking-wider">
            {fig.birthday.replace("-", "/")}
          </p>
          <p
            className={[
              "text-sm font-medium",
              fig.id === currentId ? "text-[#BF3315]" : "text-ink",
            ].join(" ")}
          >
            {fig.name}
          </p>
          <p className="text-[10px] text-muted mt-1">{fig.tagline}</p>
        </div>
      ))}
    </div>
  );
}
