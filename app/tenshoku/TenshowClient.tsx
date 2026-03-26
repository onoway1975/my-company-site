"use client";

import { useState, useRef, useEffect } from "react";
import { resolveVocation, type Vocation, type Answers, type Gender } from "./data";
import { generateTenshowResult } from "./actions";

type Step = "form" | "loading" | "result";

// ── Questions / Options ─────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    key: "q1" as const,
    label: "人と関わる仕事と、モノ・データと向き合う仕事、どちらが好き？",
    options: [
      { value: "人", label: "人と関わる", icon: "🤝" },
      { value: "モノ", label: "モノ・データ", icon: "💻" },
    ],
  },
  {
    key: "q2" as const,
    label: "働く場所はどちらが好き？",
    options: [
      { value: "屋内", label: "屋内", icon: "🏢" },
      { value: "屋外", label: "屋外", icon: "🌿" },
    ],
  },
  {
    key: "q3" as const,
    label: "仕事のスタイルは？",
    options: [
      { value: "自分", label: "自分のペースで", icon: "🎯" },
      { value: "チーム", label: "チームで動く", icon: "👥" },
    ],
  },
  {
    key: "q4" as const,
    label: "得意なのはどっち？",
    options: [
      { value: "手", label: "手や体を動かす", icon: "🙌" },
      { value: "頭", label: "頭で考える", icon: "💡" },
    ],
  },
  {
    key: "q5" as const,
    label: "仕事に求めるものは？",
    options: [
      { value: "安定", label: "安定・安心", icon: "🏠" },
      { value: "チャレンジ", label: "チャレンジ・変化", icon: "🚀" },
    ],
  },
];

const YEARS = Array.from({ length: 80 }, (_, i) => 2010 - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const GENDER_OPTIONS: { value: Gender; label: string; icon: string }[] = [
  { value: "male", label: "男性", icon: "♂" },
  { value: "female", label: "女性", icon: "♀" },
  { value: "other", label: "その他", icon: "✦" },
];

// ── Utility ──────────────────────────────────────────────────────────────────────

function resizeToDataUrl(file: File, maxPx = 768): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxPx || height > maxPx) {
          if (width >= height) { height = Math.round((height * maxPx) / width); width = maxPx; }
          else { width = Math.round((width * maxPx) / height); height = maxPx; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ── Fake progress bar ────────────────────────────────────────────────────────────

function FakeProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(t); return p; }
        return p + (90 - p) * 0.03; // eased increment
      });
    }, 400);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ width: "200px", height: "3px", background: "rgba(255,255,255,0.2)", borderRadius: "2px" }}>
      <div style={{
        height: "100%", borderRadius: "2px",
        background: "linear-gradient(90deg, #d4af37, #f5d67a)",
        width: `${progress}%`,
        transition: "width 0.4s ease",
      }} />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────────

export default function TenshowClient() {
  const [step, setStep] = useState<Step>("form");
  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [vocation, setVocation] = useState<Vocation | null>(null);
  const [fusedImageUrl, setFusedImageUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const answersComplete = answers.q1 && answers.q2 && answers.q3 && answers.q4 && answers.q5;
  const formComplete = nickname.trim() && birthYear && birthMonth && birthDay && gender && photo && answersComplete;

  const filledCount = [
    nickname.trim(), birthYear, birthMonth, birthDay, gender, photo,
    answers.q1, answers.q2, answers.q3, answers.q4, answers.q5,
  ].filter(Boolean).length;

  const handlePhoto = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setPhoto(await resizeToDataUrl(file));
  };

  const handleSubmit = async () => {
    if (!formComplete || !gender) return;
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const birthdate = `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`;
    const resolved = resolveVocation(answers as Answers);
    setVocation(resolved);
    setStep("loading");
    try {
      const { fusedImageUrl: fused, description: desc } = await generateTenshowResult(
        resolved.id, gender, nickname, birthdate, photo!
      );
      setFusedImageUrl(fused);
      setDescription(desc);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
      setStep("form");
    }
  };

  const handleReset = () => {
    setStep("form");
    setNickname(""); setBirthYear(""); setBirthMonth(""); setBirthDay("");
    setGender(""); setPhoto(null); setAnswers({});
    setVocation(null); setFusedImageUrl(null); setDescription(""); setError(null);
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (step === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)" }}>
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>✨</div>
          <p style={{ color: "white", fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
            あなたの天職を分析中...
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "32px" }}>
            約30〜60秒かかります
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <FakeProgressBar />
          </div>
        </div>
      </div>
    );
  }

  // ── Result ───────────────────────────────────────────────────────────────────
  if (step === "result" && vocation) {
    return (
      <ResultStep
        nickname={nickname}
        vocation={vocation}
        fusedImageUrl={fusedImageUrl}
        description={description}
        onReset={handleReset}
      />
    );
  }

  // ── Form step ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Fixed progress bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: "white", borderBottom: "1px solid #eee", padding: "8px 16px",
      }}>
        <div style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>
          入力状況 {filledCount}/11
        </div>
        <div style={{ height: "4px", backgroundColor: "#eee", borderRadius: "2px" }}>
          <div style={{
            height: "100%", width: `${(filledCount / 11) * 100}%`,
            background: "linear-gradient(90deg, #8b5cf6, #1a0a2e)",
            borderRadius: "2px", transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Hero */}
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)" }}>
        {/* Text */}
        <div style={{ textAlign: "center", padding: "80px 24px 80px" }}>
          <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.5em", color: "#d4af37", marginBottom: "16px" }}>
            TENSHOKU
          </p>
          <h1 style={{ color: "white", fontWeight: 700, lineHeight: 1.2, marginBottom: "16px", fontSize: "clamp(2rem, 8vw, 3rem)" }}>
            これがホントの<br />天職占い
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.8, marginBottom: "40px", maxWidth: "28rem", margin: "0 auto 40px" }}>
            5つの質問に答えて、あなたの天職を占います。<br />
            AIがあなたの写真をその職業の姿に合成します。
          </p>
          <button
            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="tenshoku-scroll-arrow"
            style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.5)", cursor: "pointer", background: "none", border: "none" }}
            aria-label="診断スタート"
          >
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em" }}>診断スタート</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form */}
      <div ref={formRef} className="bg-[#f7f7f7] pb-24">
        <div className="max-w-lg mx-auto px-5 space-y-4" style={{ paddingTop: "60px" }}>

          <FormCard step="01" title="基本情報">
            <div className="mb-5">
              <label className="block text-xs text-muted mb-2">ニックネーム</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
                placeholder="例：たろう"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-ink transition-colors bg-white" />
            </div>
            <div className="mb-5">
              <label className="block text-xs text-muted mb-2">生年月日</label>
              <div className="flex gap-2">
                <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)}
                  className="flex-1 border border-border rounded-xl px-3 py-3 text-sm text-ink focus:outline-none focus:border-ink transition-colors bg-white">
                  <option value="">年</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}年</option>)}
                </select>
                <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}
                  className="flex-1 border border-border rounded-xl px-3 py-3 text-sm text-ink focus:outline-none focus:border-ink transition-colors bg-white">
                  <option value="">月</option>
                  {MONTHS.map((m) => <option key={m} value={m}>{m}月</option>)}
                </select>
                <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)}
                  className="flex-1 border border-border rounded-xl px-3 py-3 text-sm text-ink focus:outline-none focus:border-ink transition-colors bg-white">
                  <option value="">日</option>
                  {DAYS.map((d) => <option key={d} value={d}>{d}日</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted mb-2">性別</label>
              <div className="grid grid-cols-3 gap-2">
                {GENDER_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setGender(opt.value)}
                    className={["py-3 text-sm rounded-xl border transition-all font-medium",
                      gender === opt.value ? "border-transparent bg-[#1a0a2e] text-white" : "border-border text-ink hover:border-[#1a0a2e] bg-white",
                    ].join(" ")}>
                    <span className="mr-1">{opt.icon}</span>{opt.label}
                  </button>
                ))}
              </div>
            </div>
          </FormCard>

          <FormCard step="02" title="あなたの写真">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault(); setIsDragging(false);
                const file = e.dataTransfer.files?.[0]; if (file) handlePhoto(file);
              }}
              className={["w-full h-44 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden",
                isDragging ? "border-[#8b5cf6] bg-[#8b5cf6]/5"
                  : photo ? "border-border" : "border-border hover:border-[#1a0a2e] bg-[#fafafa]",
              ].join(" ")}>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="uploaded" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted select-none">
                  <UploadIcon />
                  <p className="text-xs text-center leading-relaxed">クリックまたはドラッグで<br />写真をアップロード</p>
                  <p className="text-[10px] text-muted/40">JPG / PNG / WEBP</p>
                </div>
              )}
            </div>
            {photo && (
              <button onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs text-muted hover:text-ink transition-colors">
                写真を変更する
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhoto(f); }} />
          </FormCard>

          {QUESTIONS.map((q, i) => (
            <FormCard key={q.key} step={`Q${i + 1}`} title={q.label}>
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt) => (
                  <button key={opt.value} type="button"
                    onClick={() => setAnswers({ ...answers, [q.key]: opt.value })}
                    className={["py-4 px-3 text-sm rounded-xl border-2 transition-all flex flex-col items-center gap-1.5",
                      answers[q.key] === opt.value
                        ? "border-transparent bg-[#1a0a2e] text-white shadow-md"
                        : "border-border text-ink hover:border-[#1a0a2e]/40 bg-white",
                    ].join(" ")}>
                    <span className="text-xl">{opt.icon}</span>
                    <span className="font-medium text-xs leading-tight text-center">{opt.label}</span>
                  </button>
                ))}
              </div>
            </FormCard>
          ))}

          {error && <p className="text-xs text-red-600 text-center py-2">{error}</p>}

          <button onClick={handleSubmit} disabled={!formComplete}
            className={["w-full py-5 rounded-2xl text-sm font-bold tracking-widest transition-all",
              formComplete ? "text-white shadow-lg hover:shadow-xl hover:scale-[1.01] cursor-pointer" : "bg-border text-muted cursor-not-allowed",
            ].join(" ")}
            style={formComplete ? { background: "linear-gradient(135deg, #1a0a2e 0%, #4c1d95 50%, #1a0a2e 100%)" } : {}}>
            ✦ 天職を診断する
          </button>

          <p className="text-center text-[10px] text-muted/50 pb-4">
            アップロードした写真はサーバーに保存されません
          </p>
        </div>
      </div>
    </div>
  );
}

// ── FormCard ──────────────────────────────────────────────────────────────────────

function FormCard({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-5">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-[10px] font-bold tracking-wider shrink-0"
              style={{ background: "linear-gradient(135deg, #1a0a2e, #4c1d95)" }}>
          {step}
        </span>
        <p className="text-sm font-bold text-ink leading-snug">{title}</p>
      </div>
      {children}
    </div>
  );
}

// ── Result ────────────────────────────────────────────────────────────────────────

type ResultProps = {
  nickname: string;
  vocation: Vocation;
  fusedImageUrl: string | null;
  description: string;
  onReset: () => void;
};

function ResultStep({ nickname, vocation, fusedImageUrl, description, onReset }: ResultProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const shareText = `${nickname}さんの天職は「${vocation.name}」でした！\nこれがホントの天職占い`;
  const shareUrl = "https://ciraf.jp/tenshoku/";
  const tweetIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = "tenshoku_result.png";
      link.href = dataUrl;
      link.click();
    } catch {
      // silent fail
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current || !fusedImageUrl) { window.open(tweetIntentUrl, "_blank"); return; }
    setSharing(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      if (navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "tenshoku-result.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text: shareText, url: shareUrl });
          return;
        }
      }
      const a = document.createElement("a");
      a.href = dataUrl; a.download = "tenshoku-result.png"; a.click();
      setTimeout(() => window.open(tweetIntentUrl, "_blank"), 300);
    } catch {
      window.open(tweetIntentUrl, "_blank");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "64px 24px" }}>
        <div>
          <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.5em", color: "#d4af37", marginBottom: "12px" }}>RESULT</p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "4px" }}>{nickname}さんの天職は…</p>
          <h2 style={{ color: "white", fontSize: "2.5rem", fontWeight: 700 }}>{vocation.name}</h2>
        </div>
      </div>

      <div className="bg-[#f7f7f7] pb-24">
        <div className="max-w-lg mx-auto px-5 pt-8 space-y-4">
          <div ref={cardRef} style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: "16px", overflow: "hidden", background: "white" }}>
            {fusedImageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fusedImageUrl} alt={`${nickname}さんの天職：${vocation.name}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.72))",
                  padding: "48px 24px 28px", color: "white",
                }}>
                  <p style={{ fontSize: "14px", margin: "0 0 4px", opacity: 0.85, fontWeight: 400 }}>あなたの天職は</p>
                  <p style={{ fontSize: "40px", margin: 0, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{vocation.name}</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted text-sm">画像を生成中...</div>
            )}
          </div>

          {description && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
              <p className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase mb-3">占い結果</p>
              <p className="text-sm text-ink leading-[2]">{description}</p>
            </div>
          )}

          <button onClick={handleShare} disabled={sharing}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-60 cursor-pointer">
            {sharing ? <><SpinnerIcon />画像を生成中…</> : <><XIcon />Xに投稿する</>}
          </button>

          <button onClick={handleDownload} disabled={downloading}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-2 border-border text-sm font-bold text-ink hover:border-[#1a0a2e] transition-colors bg-white shadow-sm disabled:opacity-60 cursor-pointer">
            {downloading ? <><SpinnerIcon />画像を生成中…</> : <>⬇ 画像をダウンロード</>}
          </button>

          <button onClick={onReset}
            className="w-full py-4 rounded-2xl border-2 border-border text-sm text-muted hover:border-[#1a0a2e] hover:text-ink transition-colors bg-white">
            もう一度診断する
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────────

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted/40">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.856L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
