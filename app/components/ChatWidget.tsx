"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "サービスについて教えて",
  "実績を見たい",
  "相談したい",
];

const GREETING: Message = {
  role: "assistant",
  content:
    "こんにちは！シラフ株式会社の案内AIです。\nサービスや実績などについてお気軽にお聞きください。",
};

const URL_REGEX = /(https?:\/\/[^\s<>"]+)/g;

function renderContent(text: string) {
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

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 12C3 7.02944 7.02944 3 12 3C15.3019 3 18.1885 4.77018 19.748 7.42857M21 12C21 16.9706 16.9706 21 12 21C8.69807 21 5.81148 19.2298 4.25203 16.5714" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 3L20 8L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 21L4 16L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isComposing = useRef(false);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([GREETING]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  function handleReset() {
    setMessages([GREETING]);
    setInput("");
  }

  async function send(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text || "申し訳ありません、エラーが発生しました。" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "申し訳ありません、通信エラーが発生しました。" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !isComposing.current) {
      e.preventDefault();
      send(input);
    }
  }

  const showSuggestions = messages.length <= 1 && !loading;

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-4 md:right-6 z-50 w-80 flex flex-col bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.14)] overflow-hidden"
          style={{ maxHeight: "min(560px, calc(100dvh - 120px))" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-ink">
            <div>
              <p className="text-xs tracking-[0.15em] text-white/60 uppercase">ciraf inc.</p>
              <p className="text-sm font-bold text-white mt-0.5">AI アシスタント</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                aria-label="会話をリセット"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <ResetIcon />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="チャットを閉じる"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-ink text-white rounded-br-sm"
                      : "bg-surface text-ink rounded-bl-sm"
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface text-ink px-4 py-3 rounded-2xl rounded-bl-sm">
                  <span className="inline-flex gap-1">
                    <span className="chat-dot" />
                    <span className="chat-dot chat-dot-delay-1" />
                    <span className="chat-dot chat-dot-delay-2" />
                  </span>
                </div>
              </div>
            )}

            {/* Suggestion buttons */}
            {showSuggestions && (
              <div className="flex flex-col gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-xs text-muted border border-border rounded-xl px-3 py-2 hover:border-ink hover:text-ink transition-colors duration-200 bg-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border bg-white">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => { isComposing.current = true; }}
                onCompositionEnd={() => { isComposing.current = false; }}
                placeholder="メッセージを入力..."
                className="flex-1 resize-none bg-surface rounded-xl px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink transition-all duration-200 max-h-28 overflow-y-auto"
                style={{ minHeight: "40px" }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                aria-label="送信"
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center disabled:opacity-30 hover:opacity-80 transition-opacity duration-200"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "チャットを閉じる" : "AIアシスタントに聞く"}
        className="fixed bottom-4 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-ink text-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-transform duration-200"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </>
  );
}
