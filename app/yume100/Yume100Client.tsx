"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const CARD_COLORS = [
  "#FFF5E6",
  "#E8F5E9",
  "#E3F2FD",
  "#FDE8F0",
  "#F3E5F5",
  "#FFF8E1",
];

type Dream = {
  id: string;
  content: string;
  image_url: string;
  finger_count: number;
  proposal_text: string | null;
  proposal_generated_at: string | null;
  created_at: string;
};

function getClientId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("yume100_client_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("yume100_client_id", id);
  }
  return id;
}

function DreamCard({
  dream,
  index,
  clientId,
}: {
  dream: Dream;
  index: number;
  clientId: string;
}) {
  const [count, setCount] = useState(dream.finger_count);
  const [tapped, setTapped] = useState(false);
  const [hearts, setHearts] = useState<string[]>([]);
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const achieved = count >= 100;

  const handleFinger = async () => {
    if (tapped || achieved) return;
    setTapped(true);

    // ハートアニメ追加
    const heartId = crypto.randomUUID();
    setHearts((prev) => [...prev, heartId]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h !== heartId));
    }, 1000);

    try {
      const res = await fetch("/api/yume100/finger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream_id: dream.id, client_id: clientId }),
      });
      const data = await res.json();
      if (res.ok || res.status === 409) {
        if (data.finger_count != null) setCount(data.finger_count);
      } else {
        setTapped(false);
      }
    } catch {
      setTapped(false);
    }
  };

  const progress = Math.min((count / 100) * 100, 100);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: color }}
    >
      <div className="relative">
        <Image
          src={dream.image_url}
          alt={dream.content}
          width={400}
          height={300}
          className="w-full"
        />
        {achieved && (
          <div className="absolute top-2 right-2 bg-[#F5A623] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            達成!
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-[#111] leading-relaxed mb-3">
          {dream.content}
        </p>

        {/* プログレスバー */}
        <div className="h-1.5 bg-white/60 rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: "#F5A623",
            }}
          />
        </div>
        {/* SP: 2段 / PC: 横一列 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
          <span className="text-xs text-[#767676]">
            {count}/100
          </span>

          {/* この指止まれボタン */}
          <div className="relative flex items-center justify-end gap-2">
            {!achieved && <span className="text-[#999]" style={{ fontSize: 11 }}>いいな！と思ったら</span>}
            {hearts.map((hid) => (
              <span
                key={hid}
                className="yume100-heart-float absolute -top-2 left-1/2 -translate-x-1/2 text-lg pointer-events-none"
              >
                ❤️
              </span>
            ))}
            <button
              onClick={handleFinger}
              disabled={tapped || achieved}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                achieved
                  ? "bg-[#F5A623] text-white cursor-default"
                  : tapped
                    ? "bg-[#F5A623]/20 text-[#F5A623]"
                    : "bg-white text-[#111] hover:bg-[#F5A623] hover:text-white active:scale-95"
              }`}
            >
              {achieved ? "🎉 達成!" : "☝️ この指止まれ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MasonryGrid({ dreams, clientId }: { dreams: Dream[]; clientId: string }) {
  const [cols, setCols] = useState(2);

  useEffect(() => {
    function updateCols() {
      setCols(window.innerWidth >= 1280 ? 3 : 2);
    }
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  // 左から順にカラムに振り分け
  const columns: Dream[][] = Array.from({ length: cols }, () => []);
  dreams.forEach((dream, i) => {
    columns[i % cols].push(dream);
  });

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {columns.map((colDreams, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-4">
          {colDreams.map((dream, i) => (
            <DreamCard
              key={dream.id}
              dream={dream}
              index={colIdx + i * cols}
              clientId={clientId}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Yume100Client() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const clientId = useRef("");
  const observerRef = useRef<HTMLDivElement>(null);
  const heroBtnRef = useRef<HTMLAnchorElement>(null);
  const archiveBtnRef = useRef<HTMLDivElement>(null);
  const [showFixedCta, setShowFixedCta] = useState(false);

  const fetchDreams = useCallback(async (cursor?: string) => {
    const url = cursor
      ? `/api/yume100/dreams?cursor=${encodeURIComponent(cursor)}`
      : "/api/yume100/dreams";
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }, []);

  useEffect(() => {
    clientId.current = getClientId();
    fetchDreams().then((data) => {
      setDreams(data.dreams || []);
      setNextCursor(data.nextCursor);
      setLoading(false);
    });
  }, [fetchDreams]);

  // Infinite scroll
  useEffect(() => {
    if (!observerRef.current || !nextCursor) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loadingMore) {
          setLoadingMore(true);
          fetchDreams(nextCursor).then((data) => {
            setDreams((prev) => [...prev, ...(data.dreams || [])]);
            setNextCursor(data.nextCursor);
            setLoadingMore(false);
          });
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [nextCursor, loadingMore, fetchDreams]);

  // Fixed CTA visibility
  useEffect(() => {
    let heroVisible = true;
    let archiveVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === heroBtnRef.current) heroVisible = entry.isIntersecting;
          if (entry.target === archiveBtnRef.current) archiveVisible = entry.isIntersecting;
        }
        setShowFixedCta(!heroVisible && !archiveVisible);
      },
      { threshold: 0 }
    );

    if (heroBtnRef.current) observer.observe(heroBtnRef.current);
    if (archiveBtnRef.current) observer.observe(archiveBtnRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFDF7" }}>
      {/* ヒーロー */}
      <header className="text-center pt-16 pb-10 px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/yume100/logo.png"
          alt="夢100"
          className="h-40 w-auto mx-auto"
        />
        <p className="text-2xl md:text-3xl font-bold text-[#111] mt-3">
          こんな未来、良いよね！
        </p>
        <p className="text-lg md:text-xl font-bold text-[#111] mt-1">
          ゆめハンドレッド
        </p>
        <p className="text-base md:text-lg text-[#767676] mt-2 mb-8">
          あなたの言葉がAI画像になる。100人の指が止まったら、<br />未来への提案書になります。
        </p>
        <Link
          ref={heroBtnRef}
          href="/yume100/post/"
          className="inline-block rounded-full px-8 py-3.5 text-white font-bold text-base transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: "#F5A623" }}
        >
          夢を書く
        </Link>
      </header>

      {/* タイムライン */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin inline-block w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full" />
          </div>
        ) : dreams.length === 0 ? (
          <p className="text-center text-[#767676] py-20">
            まだ夢がありません。最初の夢を書いてみましょう！
          </p>
        ) : (
          <MasonryGrid dreams={dreams} clientId={clientId.current} />
        )}

        {/* Infinite scroll sentinel */}
        <div ref={observerRef} className="h-10" />
        {loadingMore && (
          <div className="text-center py-4">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-[#F5A623] border-t-transparent rounded-full" />
          </div>
        )}

        {/* アーカイブリンク */}
        <div ref={archiveBtnRef} className="text-center mt-8">
          <Link
            href="/yume100/archive/"
            className="inline-block rounded-full px-8 py-3.5 font-bold text-base text-[#F5A623] bg-white hover:bg-[#F5A623] hover:text-white transition-colors duration-200"
            style={{ border: "1.5px solid #F5A623" }}
          >
            達成された夢のアーカイブを見る
          </Link>
        </div>
      </main>

      {/* 固定CTA */}
      <Link
        href="/yume100/post/"
        className="fixed rounded-full px-8 py-3.5 text-white font-bold text-base transition-opacity duration-300 hover:scale-105 active:scale-95"
        style={{
          backgroundColor: "#F5A623",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          opacity: showFixedCta ? 1 : 0,
          pointerEvents: showFixedCta ? "auto" : "none",
        }}
      >
        夢を書く
      </Link>
    </div>
  );
}
