"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type Message = { role: "user" | "assistant"; content: string };
type Bubble = { text: string; side: "left" | "right"; key: number };

const SUGGESTIONS = ["サービスについて教えて", "実績を見たい", "相談したい"];

const URL_REGEX = /(https?:\/\/[^\s<>"]+)/g;

function renderBubble(text: string) {
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 break-all hover:opacity-70"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function HeroChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [nextSide, setNextSide] = useState<"left" | "right">("left");
  const isComposing = useRef(false);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const trimmed = text.trim();
    const side = nextSide;

    setInput("");
    setLoading(true);

    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          short: true,
        }),
      });
      const data = await res.json();
      const replyText = data.text || "少々お待ちください。";
      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
      setBubble({ text: replyText, side, key: Date.now() });
      setNextSide((s) => (s === "left" ? "right" : "left"));
    } catch {
      setBubble({ text: "エラーが発生しました。", side, key: Date.now() });
    } finally {
      setLoading(false);
    }
  }

  function BubbleArea({ side }: { side: "left" | "right" }) {
    const isNext = nextSide === side;
    const isActive = bubble?.side === side;

    return (
      <div className="relative z-10 flex items-end justify-center mb-2">
        {loading && isNext ? (
          <div
            className="speech-bubble bubble-fade-in relative bg-white rounded-2xl px-4 py-3"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.10))" }}
          >
            <span className="inline-flex gap-1">
              <span className="chat-dot" />
              <span className="chat-dot chat-dot-delay-1" />
              <span className="chat-dot chat-dot-delay-2" />
            </span>
          </div>
        ) : isActive && bubble ? (
          <div
            key={bubble.key}
            className="speech-bubble bubble-fade-in relative bg-white rounded-2xl px-4 py-3 max-w-[200px] md:max-w-[240px]"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.10))" }}
          >
            <p className="text-xs md:text-sm text-ink leading-relaxed whitespace-pre-wrap">
              {renderBubble(bubble.text)}
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Characters */}
      <div className="flex items-end justify-center gap-10 md:gap-20">
        {/* Left: chara-yellow */}
        <div className="flex flex-col items-center">
          <BubbleArea side="left" />
          <div className="chara-yellow relative z-0">
            <Image
              src="/images/chara-yellow.png"
              width={220}
              height={220}
              alt=""
              className="w-[90px] h-[90px] md:w-[150px] md:h-[150px]"
              sizes="(max-width: 768px) 90px, 150px"
              priority
              fetchPriority="high"
            />
          </div>
        </div>

        {/* Right: chara-green */}
        <div className="flex flex-col items-center">
          <BubbleArea side="right" />
          <div className="chara-green md:-translate-y-4 relative z-0">
            <Image
              src="/images/chara-green.png"
              width={200}
              height={200}
              alt=""
              className="w-[80px] h-[80px] md:w-[130px] md:h-[130px]"
              sizes="(max-width: 768px) 80px, 130px"
              priority
              fetchPriority="high"
            />
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="w-full max-w-lg mt-8">
        {/* Suggestion pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={loading}
              data-gtm-click="cta_ai_suggest"
              data-gtm-location="hero"
              data-gtm-label={s}
              className="text-xs text-white bg-ink rounded-full px-4 py-2 hover:opacity-70 transition-opacity duration-200 disabled:opacity-40 tracking-wide"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-3 bg-white border border-border rounded-full px-5 py-3 shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isComposing.current) {
                send(input);
              }
            }}
            onCompositionStart={() => { isComposing.current = true; }}
            onCompositionEnd={() => { isComposing.current = false; }}
            placeholder="シラフについて聞いてみる..."
            className="flex-1 text-sm text-ink placeholder:text-muted focus:outline-none bg-transparent"
            disabled={loading}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            data-gtm-click="cta_ai_chat"
            data-gtm-location="hero"
            className="shrink-0 text-xs font-bold text-white bg-ink rounded-full px-4 py-1.5 disabled:opacity-30 hover:opacity-70 transition-opacity duration-200"
          >
            {loading ? "…" : "送信"}
          </button>
        </div>
      </div>
    </div>
  );
}
