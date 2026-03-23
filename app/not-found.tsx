"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const [count, setCount] = useState(10);
  const router = useRouter();

  useEffect(() => {
    if (count <= 0) {
      router.push("/");
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, router]);

  return (
    <main className="min-h-screen flex flex-col justify-center px-6 lg:px-12">
      <div className="max-w-xl mx-auto w-full">
        {/* Label */}
        <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-10">
          Error
        </p>

        {/* 404 */}
        <h1 className="text-[clamp(6rem,22vw,14rem)] font-bold leading-none text-ink tracking-tight mb-8 tabular-nums">
          404
        </h1>

        {/* Message */}
        <p className="text-lg font-bold text-ink mb-2">
          ページが見つかりませんでした
        </p>
        <p className="text-sm text-muted mb-12">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Countdown */}
        <div className="border-t border-border pt-8 mb-10">
          <p className="text-sm text-muted mb-6">
            <span className="tabular-nums font-bold text-ink">{count}</span>
            &nbsp;秒後にトップページへ自動リダイレクトします
          </p>
          {/* Progress bar */}
          <div className="h-px bg-border w-full relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-ink transition-[width] duration-1000 ease-linear"
              style={{ width: `${(count / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/"
          data-gtm-click-type="link"
          data-gtm-label="back_to_top"
          data-gtm-click-location="404"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink border border-ink px-6 py-3 hover:bg-ink hover:text-white transition-colors duration-200"
        >
          ← トップページへ戻る
        </Link>
      </div>
    </main>
  );
}
