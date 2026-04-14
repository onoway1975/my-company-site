import Link from "next/link";

export const metadata = {
  title: "月次レポート | リモート市役所",
};

export default function ArchivePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF8" }}>
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-4xl mb-6">📊</p>
        <h1 className="text-xl font-bold text-ink mb-3">
          月次レポート
        </h1>
        <p className="text-muted text-sm leading-relaxed mb-8">
          市民の皆さまからいただいた声をまとめたレポートは
          <br />
          現在準備中です。もうしばらくお待ちください。
        </p>
        <Link
          href="/shiyakusho"
          className="inline-block text-sm font-medium px-6 py-3 rounded-full border border-ink text-ink hover:bg-ink hover:text-white transition-colors"
        >
          市役所トップに戻る
        </Link>
      </div>
    </div>
  );
}
