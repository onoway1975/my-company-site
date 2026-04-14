"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import MayorAvatar from "../_components/MayorAvatar";

type Message = {
  role: "mayor" | "user";
  text: string;
  similar?: { count: number; daysAgo: number };
};

function ChatRoom() {
  const params = useSearchParams();
  const router = useRouter();

  // URL params 優先、なければ localStorage から復元
  const nickname =
    params.get("name") ||
    (typeof window !== "undefined" ? localStorage.getItem("shiyakusho_name") : null) ||
    "";
  const municipality =
    params.get("city") ||
    (typeof window !== "undefined" ? localStorage.getItem("shiyakusho_city") : null) ||
    "";

  // 両方とも空ならトップへリダイレクト
  useEffect(() => {
    if (!nickname || !municipality) {
      router.replace("/shiyakusho");
    }
  }, [nickname, municipality, router]);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "mayor",
      text: `${nickname}さん、ようこそ市長室へ。よく来てくれました。\n今日はどんなお困りごとがありますか？何でもお気軽にどうぞ。`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const content = input.trim();
    if (!content || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: content }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/shiyakusho/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, municipality, content }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "mayor",
            text: data.reply,
            similar: data.similar,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "mayor", text: "申し訳ございません。少々お時間をいただけますか。" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "mayor", text: "通信エラーが発生しました。もう一度お試しください。" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FAFAF8" }}>
      {/* Left — Mayor avatar (PC only) */}
      <div className="hidden md:flex md:w-72 lg:w-80 flex-col items-center justify-center border-r border-[#E8E8E8] p-8">
        <MayorAvatar className="w-44 mb-6" />
        <p className="text-sm font-bold text-ink">中井 きいち</p>
        <p className="text-xs text-muted mt-1">鎌倉市 市長</p>
      </div>

      {/* Right — Chat area */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b border-[#E8E8E8]"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#1B2A4A" }}>
            市
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink">中井市長の部屋</p>
            <p className="text-[11px] text-muted truncate">{municipality} / {nickname}さん</p>
          </div>
          <Link
            href="/shiyakusho/board"
            className="text-xs text-muted hover:text-ink transition-colors"
          >
            掲示板を見る
          </Link>
          <Link
            href="/shiyakusho"
            className="text-xs text-muted hover:text-ink transition-colors"
          >
            退室
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 space-y-4">
          {messages.map((msg, i) => (
            <div key={i}>
              <div
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "mayor"
                      ? "text-white rounded-tl-sm"
                      : "text-ink border border-[#E0E0E0] rounded-tr-sm"
                  }`}
                  style={{
                    backgroundColor:
                      msg.role === "mayor" ? "#1B2A4A" : "#FFFFFF",
                  }}
                >
                  {msg.text}
                </div>
              </div>
              {msg.similar && (
                <div className="mt-2 ml-1">
                  <div
                    className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: "#EEF2FF", color: "#4B5EAA" }}
                  >
                    <span>📋</span>
                    <span>
                      同じ地域から同様の意見が直近{msg.similar.daysAgo}日間で
                      <strong>{msg.similar.count}件</strong>届いています
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1"
                style={{ backgroundColor: "#1B2A4A" }}
              >
                <span className="chat-dot" style={{ backgroundColor: "#FFFFFF" }} />
                <span className="chat-dot chat-dot-delay-1" style={{ backgroundColor: "#FFFFFF" }} />
                <span className="chat-dot chat-dot-delay-2" style={{ backgroundColor: "#FFFFFF" }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area — fixed bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 md:left-72 lg:left-80 z-10 border-t border-[#E8E8E8] px-4 py-3"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="市長に意見を伝える..."
              rows={1}
              className="flex-1 resize-none border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#1B2A4A] transition-colors"
              style={{ backgroundColor: "#FAFAF8", maxHeight: "120px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#1B2A4A" }}
              aria-label="送信"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAFAF8" }}>
          <p className="text-sm text-muted">読み込み中...</p>
        </div>
      }
    >
      <ChatRoom />
    </Suspense>
  );
}
