"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useStep } from "./StepContext";

/* ── Types ─────────────────────────────────── */

type ExpertId =
  | "producer"
  | "director"
  | "planner"
  | "designer"
  | "coder"
  | "engineer";

type SiteData = {
  siteName: string;
  industry: string;
  description: string;
  techStack: string[];
  pageStructure: string;
  seoStatus: string;
  speedEstimate: number;
  designTone: string[];
};

type ExpertReport = {
  issues: string[];
  recommendations: string[];
};

type PersonaId = "persona1" | "persona2" | "persona3";

type Persona = {
  id: PersonaId;
  name: string;
  age: number;
  job: string;
  description: string;
  needs: string[];
  concern: string;
};

type ChatBubble = {
  sender: "advisor" | "user" | ExpertId | PersonaId;
  content: string;
};

/* ── Constants ─────────────────────────────── */

const EXPERTS: Record<
  ExpertId,
  {
    name: string;
    role: string;
    avatar: string;
    color: string;
    textColor: string;
  }
> = {
  producer: {
    name: "田中 誠一",
    role: "Webプロデューサー",
    avatar: "田",
    color: "#E6F1FB",
    textColor: "#185FA5",
  },
  director: {
    name: "鈴木 彩",
    role: "Webディレクター",
    avatar: "鈴",
    color: "#EAF3DE",
    textColor: "#3B6D11",
  },
  planner: {
    name: "山本 健太",
    role: "プランナー/マーケター",
    avatar: "山",
    color: "#FAEEDA",
    textColor: "#854F0B",
  },
  designer: {
    name: "中村 あかり",
    role: "UI/UXデザイナー",
    avatar: "中",
    color: "#FBEAF0",
    textColor: "#993556",
  },
  coder: {
    name: "佐藤 拓也",
    role: "マークアップエンジニア",
    avatar: "佐",
    color: "#F1EFE8",
    textColor: "#444441",
  },
  engineer: {
    name: "伊藤 大輔",
    role: "Webエンジニア",
    avatar: "伊",
    color: "#E1F5EE",
    textColor: "#0F6E56",
  },
};

const EXPERT_IDS: ExpertId[] = [
  "producer",
  "director",
  "planner",
  "designer",
  "coder",
  "engineer",
];

const PERSONA_COLORS: Record<PersonaId, { bg: string; text: string }> = {
  persona1: { bg: "#E6F1FB", text: "#185FA5" },
  persona2: { bg: "#EAF3DE", text: "#3B6D11" },
  persona3: { bg: "#FAEEDA", text: "#854F0B" },
};

const S = {
  bg: "#F2EFE8",
  card: "#FFFFFF",
  border: "#E0DBD0",
  main: "#1A1A1A",
  sub: "#888888",
  accent: "#0D1B2A",
  brand: "#E8821A",
};

/* ── Sub-components ────────────────────────── */

function Avatar({
  letter,
  bg,
  color,
  size = 32,
}: {
  letter: string;
  bg: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}

function ExpertAvatar({ id, size = 32 }: { id: ExpertId; size?: number }) {
  const e = EXPERTS[id];
  return <Avatar letter={e.avatar} bg={e.color} color={e.textColor} size={size} />;
}

function AdvisorAvatar({ size = 32 }: { size?: number }) {
  return <Avatar letter="A" bg={S.brand} color="#fff" size={size} />;
}

function SectionTitle({ ja, en }: { ja: string; en: string }) {
  return (
    <h2 style={{ fontSize: 22, fontWeight: 700, color: S.main, margin: 0 }}>
      {ja}
      <span
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 400,
          color: S.brand,
          marginTop: 2,
          letterSpacing: "0.05em",
        }}
      >
        {en}
      </span>
    </h2>
  );
}

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: S.card,
        borderRadius: 16,
        padding: 32,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

type BtnVariant = "primary" | "secondary" | "outline" | "text";
type BtnSize = "sm" | "md" | "lg";

const BTN_COLORS: Record<
  BtnVariant,
  { bg: string; color: string; border: string; hoverBg?: string; hoverColor?: string }
> = {
  primary: {
    bg: "#0D1B2A",
    color: "#fff",
    border: "#0D1B2A",
    hoverBg: "#1F2F42",
  },
  secondary: {
    bg: "#E8821A",
    color: "#fff",
    border: "#E8821A",
    hoverBg: "#D47410",
  },
  outline: {
    bg: "transparent",
    color: "#1A1A1A",
    border: "#1A1A1A",
    hoverBg: "#1A1A1A",
    hoverColor: "#fff",
  },
  text: {
    bg: "transparent",
    color: "#888",
    border: "transparent",
    hoverColor: "#1A1A1A",
  },
};

const BTN_SIZES: Record<BtnSize, { padding: string; fontSize: number }> = {
  sm: { padding: "8px 20px", fontSize: 13 },
  md: { padding: "12px 28px", fontSize: 14 },
  lg: { padding: "14px 28px", fontSize: 15 },
};

function PillButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth,
  disabled,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  size?: BtnSize;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const c = BTN_COLORS[variant];
  const s = BTN_SIZES[size];
  const isText = variant === "text";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (c.hoverBg) e.currentTarget.style.background = c.hoverBg;
        if (c.hoverColor) e.currentTarget.style.color = c.hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = c.bg;
        e.currentTarget.style.color = c.color;
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: s.padding,
        borderRadius: 99,
        border: isText ? "none" : `1.5px solid ${c.border}`,
        background: c.bg,
        color: c.color,
        fontWeight: 500,
        fontSize: s.fontSize,
        letterSpacing: "0.02em",
        width: fullWidth ? "100%" : undefined,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "background 0.15s, color 0.15s, opacity 0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function PageSpeedGauge({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const offset = circ * (1 - pct);
  const color = score >= 70 ? "#22C55E" : score >= 40 ? "#E8821A" : "#EF4444";
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#EEE" strokeWidth="7" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <text
          x="44"
          y="44"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="18"
          fontWeight="700"
          fill={color}
        >
          {score}
        </text>
      </svg>
      <p style={{ fontSize: 10, color: S.sub, marginTop: 2 }}>
        PageSpeed推定
      </p>
    </div>
  );
}

function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: S.sub,
            animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

/* ── Main Component ────────────────────────── */

export default function RenewalPage() {
  const { step, setStep, setOnReset } = useStep();
  const [url, setUrl] = useState("");
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [expertReports, setExpertReports] = useState<
    Record<string, ExpertReport | null>
  >({});
  const [loadingExperts, setLoadingExperts] = useState(false);
  const [retryingExperts, setRetryingExperts] = useState<Record<string, boolean>>({});
  const [selectedExpert, setSelectedExpert] = useState<ExpertId>("producer");
  const [selectedChatExpert, setSelectedChatExpert] = useState<ExpertId | null>(
    null
  );
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [pptxGenerating, setPptxGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  // Chat
  const [bubbles, setBubbles] = useState<ChatBubble[]>([
    {
      sender: "advisor",
      content:
        "こんにちは！Renewal Advisorです。\nリニューアルしたいWebサイトのURLを入力してください。",
    },
  ]);
  const [involvedExperts, setInvolvedExperts] = useState<ExpertId[]>([]);
  // Per-expert chat history
  const [expertChatHistory, setExpertChatHistory] = useState<
    Record<string, { role: string; content: string }[]>
  >({});
  const [expertChatSummaries, setExpertChatSummaries] = useState<
    Record<string, string[]>
  >({});

  // Persona state
  const [personas, setPersonas] = useState<Persona[] | null>(null);
  const [loadingPersonas, setLoadingPersonas] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaId | null>(null);
  const [personaChatHistory, setPersonaChatHistory] = useState<
    Record<string, { role: string; content: string }[]>
  >({});
  const [personaSummaries, setPersonaSummaries] = useState<
    Record<string, string[]>
  >({});
  const [loadingSummaries, setLoadingSummaries] = useState(false);

  // Register resetAll for header button
  useEffect(() => {
    setOnReset(() => () => {
      setUrl("");
      setSiteData(null);
      setAnalyzing(false);
      setExpertReports({});
      setLoadingExperts(false);
      setRetryingExperts({});
      setSelectedExpert("producer");
      setSelectedChatExpert(null);
      setChatInput("");
      setChatLoading(false);
      setActiveSlide(0);
      setPptxGenerating(false);
      setError(null);
      setRemaining(null);
      setBubbles([
        {
          sender: "advisor",
          content:
            "こんにちは！Renewal Advisorです。\nリニューアルしたいWebサイトのURLを入力してください。",
        },
      ]);
      setInvolvedExperts([]);
      setExpertChatHistory({});
      setExpertChatSummaries({});
      setPersonas(null);
      setLoadingPersonas(false);
      setSelectedPersona(null);
      setPersonaChatHistory({});
      setPersonaSummaries({});
      setLoadingSummaries(false);
    });
  }, [setOnReset]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const expertPanelRef = useRef<HTMLDivElement>(null);

  const scrollChat = useCallback(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  useEffect(() => {
    scrollChat();
  }, [bubbles, scrollChat]);

  // Scroll behavior on step change
  useEffect(() => {
    if (step === 3) {
      // STEP3は専門家パネルまでスクロール
      setTimeout(
        () =>
          expertPanelRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100
      );
    } else {
      // それ以外は上にスクロール
      leftRef.current?.scrollTo({ top: 0 });
    }
  }, [step]);

  function addBubble(sender: ChatBubble["sender"], content: string) {
    setBubbles((prev) => [...prev, { sender, content }]);
  }

  /* ── STEP 1 → 2: 分析 ─────────────────── */

  async function handleAnalyze() {
    if (!url.trim()) return;
    addBubble("user", url.trim());
    addBubble("advisor", "分析を開始します...");
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/renewal/analyze/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (data.remaining !== undefined) setRemaining(data.remaining);
      if (!res.ok) {
        setError(data.error || "分析に失敗しました");
        addBubble("advisor", data.error || "分析に失敗しました。URLを確認して再度お試しください。");
        return;
      }
      setSiteData(data.siteData);
      addBubble(
        "advisor",
        `「${data.siteData.siteName}」の分析が完了しました！\n左のパネルで結果を確認してください。`
      );
      setStep(2);
    } catch {
      setError("通信エラーが発生しました");
      addBubble("advisor", "通信エラーが発生しました。再度お試しください。");
    } finally {
      setAnalyzing(false);
    }
  }

  /* ── STEP 2 → 3: 専門家分析 ───────────── */

  async function fetchExpertReport(
    expertId: ExpertId,
    slim: unknown
  ): Promise<ExpertReport | null> {
    try {
      const r = await fetch("/api/renewal/expert/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, siteData: slim, expertId }),
      });
      const data = await r.json();
      if (!r.ok) return null;
      if (data && Array.isArray(data.issues) && Array.isArray(data.recommendations)) {
        return data as ExpertReport;
      }
      return null;
    } catch {
      return null;
    }
  }

  async function handleStartExperts() {
    addBubble("advisor", "6名の専門家がそれぞれの視点で分析しています...");
    setLoadingExperts(true);
    setStep(3);
    setInvolvedExperts([...EXPERT_IDS]);

    // siteDataをAPIに渡す前に必要項目だけに絞る（トークン超過対策）
    const slimSiteData: Record<string, unknown> = {
      siteName: siteData?.siteName,
      industry: siteData?.industry,
      description: siteData?.description,
      techStack: siteData?.techStack,
      seoStatus: siteData?.seoStatus,
      designTone: siteData?.designTone,
      pageStructure: siteData?.pageStructure?.slice(0, 100),
    };

    // Phase 1: 200msずつずらして並列リクエスト
    const initial = await Promise.allSettled(
      EXPERT_IDS.map(
        (id, i) =>
          new Promise<ExpertReport | null>((resolve) => {
            setTimeout(() => {
              fetchExpertReport(id, slimSiteData).then(resolve);
            }, i * 200);
          })
      )
    );

    const reports: Record<string, ExpertReport | null> = {};
    const failedIds: ExpertId[] = [];
    initial.forEach((r, i) => {
      const id = EXPERT_IDS[i];
      if (r.status === "fulfilled" && r.value) {
        reports[id] = r.value;
      } else {
        reports[id] = null;
        failedIds.push(id);
      }
    });
    setExpertReports({ ...reports });

    // Phase 2: 失敗した専門家を500ms後に1回だけリトライ
    if (failedIds.length > 0) {
      const retryMap: Record<string, boolean> = {};
      failedIds.forEach((id) => (retryMap[id] = true));
      setRetryingExperts(retryMap);

      await new Promise((res) => setTimeout(res, 500));

      const retryResults = await Promise.allSettled(
        failedIds.map((id) => fetchExpertReport(id, slimSiteData))
      );
      retryResults.forEach((r, i) => {
        const id = failedIds[i];
        if (r.status === "fulfilled" && r.value) {
          reports[id] = r.value;
        }
      });
      setExpertReports({ ...reports });
      setRetryingExperts({});
    }

    setLoadingExperts(false);
    addBubble(
      "advisor",
      "全員の分析が完了しました。左のパネルで各専門家のレポートを確認できます。"
    );
  }

  /* ── STEP 4: チャット送信 ──────────────── */

  function goToChat() {
    setSelectedChatExpert(selectedExpert);
    addBubble(
      "advisor",
      `${EXPERTS[selectedExpert].name}（${EXPERTS[selectedExpert].role}）とのチャットを開始します。右のチャット欄から自由に質問してください。`
    );
  }

  async function fetchPersonas() {
    if (!siteData || personas) return;
    setLoadingPersonas(true);
    try {
      const res = await fetch("/api/renewal/persona/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteData }),
      });
      const data = await res.json();
      if (data.personas && Array.isArray(data.personas)) {
        setPersonas(data.personas);
      } else {
        addBubble("advisor", "ペルソナの生成に失敗しました。");
      }
    } catch {
      addBubble("advisor", "ペルソナの生成中に通信エラーが発生しました。");
    } finally {
      setLoadingPersonas(false);
    }
  }

  function goToPersona() {
    addBubble("advisor", "ペルソナ設定に進みます");
    setStep(4);
    fetchPersonas();
  }

  function selectPersona(p: Persona) {
    setSelectedPersona(p.id);
    addBubble(
      "advisor",
      `${p.name}さん（${p.age}歳・${p.job}）との会話を始めます。自由に質問してください。`
    );
  }

  async function handlePersonaChatSend() {
    if (!chatInput.trim() || chatLoading || !selectedPersona || !personas) return;
    const persona = personas.find((p) => p.id === selectedPersona);
    if (!persona) return;
    const text = chatInput.trim();
    addBubble("user", text);
    setChatInput("");
    setChatLoading(true);

    const history = personaChatHistory[selectedPersona] || [];
    const nextHistory = [...history, { role: "user", content: text }];

    try {
      const res = await fetch("/api/renewal/persona-chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory,
          persona,
          siteData,
        }),
      });
      const data = await res.json();
      const reply = data.reply || "回答の生成に失敗しました";
      nextHistory.push({ role: "assistant", content: reply });
      setPersonaChatHistory((prev) => ({
        ...prev,
        [selectedPersona]: nextHistory,
      }));
      addBubble(selectedPersona, reply);
    } catch {
      addBubble(selectedPersona, "通信エラーが発生しました。");
    } finally {
      setChatLoading(false);
    }
  }

  function goToProposalFromPersona() {
    addBubble(
      "advisor",
      "ペルソナとの会話内容を分析レポートに反映しました。分析レポートの作成に進みましょう。"
    );
    handleGenerateProposal();
  }

  async function handleChatSend() {
    // ペルソナモードならペルソナチャットAPIへ
    if (step === 4 && selectedPersona) {
      return handlePersonaChatSend();
    }
    // STEP3で専門家チャットがアクティブなときのみ送信可
    if (step !== 3 || !selectedChatExpert) return;
    if (!chatInput.trim() || chatLoading) return;

    const chatExpertId = selectedChatExpert;
    const text = chatInput.trim();
    addBubble("user", text);
    setChatInput("");
    setChatLoading(true);

    const history = expertChatHistory[chatExpertId] || [];
    const nextHistory = [...history, { role: "user", content: text }];

    try {
      const res = await fetch("/api/renewal/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory,
          expertId: chatExpertId,
          siteData,
        }),
      });
      const data = await res.json();
      const reply = data.reply || "回答の生成に失敗しました";
      nextHistory.push({ role: "assistant", content: reply });
      setExpertChatHistory((prev) => ({
        ...prev,
        [chatExpertId]: nextHistory,
      }));
      addBubble(chatExpertId, reply);
    } catch {
      addBubble(chatExpertId, "通信エラーが発生しました。");
    } finally {
      setChatLoading(false);
    }
  }

  /* ── STEP 5: 分析レポート生成 ────────────────── */

  async function handleGenerateProposal() {
    addBubble("advisor", "分析レポートを生成しています...");
    setStep(5);

    const hasPersonaChat =
      personas &&
      personas.some((p) => (personaChatHistory[p.id] || []).length > 0);
    const expertsWithChat = EXPERT_IDS.filter(
      (id) => (expertChatHistory[id] || []).length > 0
    );
    const hasExpertChat = expertsWithChat.length > 0;

    if (!hasPersonaChat && !hasExpertChat) {
      addBubble(
        "advisor",
        "分析レポートが完成しました！左のパネルでプレビューを確認できます。"
      );
      return;
    }

    setLoadingSummaries(true);
    try {
      const tasks: Promise<void>[] = [];

      if (hasPersonaChat) {
        tasks.push(
          fetch("/api/renewal/persona-summary/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ personas, personaChatHistory }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.summaries) setPersonaSummaries(data.summaries);
            })
            .catch(() => {})
        );
      }

      if (hasExpertChat) {
        const expertSummaryResults = await Promise.allSettled(
          expertsWithChat.map((id) =>
            fetch("/api/renewal/chat-summary/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                expertId: id,
                messages: expertChatHistory[id],
              }),
            })
              .then((r) => r.json())
              .then((data) => ({
                id,
                summary: Array.isArray(data.summary) ? data.summary : [],
              }))
          )
        );
        const summaries: Record<string, string[]> = {};
        expertSummaryResults.forEach((r, i) => {
          if (r.status === "fulfilled") {
            summaries[expertsWithChat[i]] = r.value.summary;
          }
        });
        setExpertChatSummaries(summaries);
      }

      await Promise.all(tasks);
    } finally {
      setLoadingSummaries(false);
    }

    addBubble(
      "advisor",
      "分析レポートが完成しました！左のパネルでプレビューを確認できます。"
    );
  }

  /* ── PPTX DL ───────────────────────────── */

  async function handleDownloadPptx() {
    setPptxGenerating(true);
    addBubble("advisor", "PowerPointファイルを生成しています...");
    try {
      const res = await fetch("/api/renewal/pptx/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteData: { ...siteData, url },
          expertReports,
          personas: personas || [],
          personaChatHistory,
          expertChatHistory,
        }),
      });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "renewal-report.pptx";
      a.click();
      URL.revokeObjectURL(blobUrl);
      addBubble("advisor", "ダウンロードが開始されました！");
    } catch {
      addBubble("advisor", "PPTX生成に失敗しました。");
    } finally {
      setPptxGenerating(false);
    }
  }

  /* ── Quick Replies ─────────────────────── */

  function getQuickReplies(): { label: string; action: () => void }[] {
    if (step === 2 && siteData && !analyzing) {
      return [];
    }
    if (step === 3 && !loadingExperts && Object.keys(expertReports).length > 0) {
      return [];
    }
    return [];
  }

  const quickReplies = getQuickReplies();
  const isInputActive =
    step === 4 || (step === 3 && selectedChatExpert !== null);

  /* ── Render helpers ────────────────────── */

  function renderBubble(b: ChatBubble, i: number) {
    const isUser = b.sender === "user";
    const isAdvisor = b.sender === "advisor";
    const isPersona =
      b.sender === "persona1" ||
      b.sender === "persona2" ||
      b.sender === "persona3";
    const expertId =
      !isUser && !isAdvisor && !isPersona ? (b.sender as ExpertId) : null;

    const personaAvatar = () => {
      if (!isPersona || !personas) return null;
      const p = personas.find((x) => x.id === b.sender);
      if (!p) return null;
      const c = PERSONA_COLORS[b.sender as PersonaId];
      return (
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: c.bg,
            color: c.text,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {p.name.charAt(0)}
        </span>
      );
    };

    return (
      <div
        key={i}
        style={{
          display: "flex",
          justifyContent: isUser ? "flex-end" : "flex-start",
          gap: 8,
          animation: "slideUp 0.2s ease",
        }}
      >
        {!isUser &&
          (isAdvisor ? (
            <AdvisorAvatar size={28} />
          ) : isPersona ? (
            personaAvatar()
          ) : (
            <ExpertAvatar id={expertId!} size={28} />
          ))}
        {isUser ? (
          <p
            style={{
              fontSize: 13,
              color: S.main,
              lineHeight: 1.7,
              margin: 0,
              maxWidth: "75%",
              textAlign: "right",
            }}
          >
            {b.content}
          </p>
        ) : (
          <div
            style={{
              maxWidth: "80%",
              padding: "10px 14px",
              borderRadius: 12,
              background: S.card,
              border: `1px solid ${S.border}`,
              fontSize: 13,
              color: S.main,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {b.content}
          </div>
        )}
      </div>
    );
  }

  /* ── Render ────────────────────────────── */

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>

      <div style={{ display: "flex", height: "100%" }}>
        {/* ── LEFT PANEL ── */}
        <div
          ref={leftRef}
          style={{
            flex: 1,
            overflowY: "auto",
            background: S.bg,
          }}
        >
          <div style={{ padding: 24 }}>
            {/* ── STEP 1: URL入力 ── */}
            {step === 1 && (
              <div
                style={{
                  maxWidth: 560,
                  margin: "60px auto 0",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <Card>
                  <SectionTitle ja="リニューアル分析" en="site analysis" />
                  <p
                    style={{
                      fontSize: 13,
                      color: S.sub,
                      marginTop: 8,
                      marginBottom: 28,
                    }}
                  >
                    リニューアルしたいWebサイトのURLを入力してください
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                      placeholder="https://example.com"
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        border: `1px solid ${S.border}`,
                        borderRadius: 10,
                        fontSize: 14,
                        color: S.main,
                        outline: "none",
                        background: "#FAFAF8",
                      }}
                    />
                    <PillButton
                      onClick={handleAnalyze}
                      disabled={!url.trim() || analyzing}
                    >
                      {analyzing ? "分析中..." : "分析開始"}
                    </PillButton>
                  </div>
                  {remaining !== null && (
                    <p style={{ fontSize: 11, color: S.sub, marginTop: 12 }}>
                      本日の残り利用回数: {remaining}回
                    </p>
                  )}
                </Card>
              </div>
            )}

            {/* ── STEP 2: Research（STEP3でも継続表示） ── */}
            {(step === 2 || step === 3) && siteData && (
              <div
                style={{
                  maxWidth: 720,
                  margin: "0 auto",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <Card>
                  <SectionTitle ja="サイト分析結果" en="research" />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 160px",
                      gap: 24,
                      marginTop: 24,
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: S.main,
                          margin: "0 0 4px",
                        }}
                      >
                        {siteData.siteName}
                      </h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: S.brand,
                          fontWeight: 600,
                          margin: "0 0 16px",
                        }}
                      >
                        {siteData.industry}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#555",
                          lineHeight: 1.7,
                          marginBottom: 20,
                        }}
                      >
                        {siteData.description}
                      </p>

                      <Label>技術スタック</Label>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          marginBottom: 20,
                        }}
                      >
                        {siteData.techStack.map((t, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: 11,
                              padding: "3px 10px",
                              borderRadius: 99,
                              background: "#F0EDE6",
                              color: "#555",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <Label>ページ構成</Label>
                      <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                        {siteData.pageStructure}
                      </p>

                      <div style={{ marginTop: 20 }}>
                        <Label>SEO状況</Label>
                        <p
                          style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}
                        >
                          {siteData.seoStatus}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                      }}
                    >
                      <div
                        style={{
                          background: "#FAFAF8",
                          borderRadius: 12,
                          padding: 16,
                          textAlign: "center",
                        }}
                      >
                        <PageSpeedGauge score={siteData.speedEstimate} />
                      </div>
                      <div style={{ background: "#FAFAF8", borderRadius: 12, padding: 12 }}>
                        <Label>デザイン傾向</Label>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4,
                          }}
                        >
                          {siteData.designTone.map((t, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: 10,
                                padding: "2px 8px",
                                borderRadius: 4,
                                background: "#E8E4DC",
                                color: "#555",
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                {step === 2 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 24,
                    }}
                  >
                    <PillButton
                      onClick={handleStartExperts}
                      variant="primary"
                      size="lg"
                      style={{ padding: "14px 40px" }}
                    >
                      専門家分析を見る →
                    </PillButton>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: 専門家分析（STEP2カードの下に追加表示） ── */}
            {step === 3 && (
              <div
                ref={expertPanelRef}
                style={{
                  maxWidth: 720,
                  margin: "24px auto 0",
                  animation: "fadeIn 0.3s ease",
                }}
              >
              <Card style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ display: "flex", minHeight: 500 }}>
                  {/* Expert sidebar */}
                  <div
                    style={{
                      width: 180,
                      background: "#FAFAF8",
                      borderRight: `1px solid ${S.border}`,
                      padding: "16px 0",
                      flexShrink: 0,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        color: S.sub,
                        letterSpacing: "0.15em",
                        padding: "4px 16px 8px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      メンバー
                    </p>
                    {EXPERT_IDS.map((id) => {
                      const e = EXPERTS[id];
                      const active = id === selectedExpert;
                      const loaded = !!expertReports[id];
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedExpert(id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            width: "100%",
                            padding: "10px 16px",
                            border: "none",
                            background: active ? S.card : "transparent",
                            borderLeft: active
                              ? `3px solid ${S.brand}`
                              : "3px solid transparent",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <ExpertAvatar id={id} size={26} />
                          <div style={{ minWidth: 0 }}>
                            <p
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: S.main,
                                margin: 0,
                              }}
                            >
                              {e.name}
                            </p>
                            <p
                              style={{
                                fontSize: 10,
                                color: S.sub,
                                margin: 0,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {e.role}
                            </p>
                          </div>
                          {(loadingExperts && !loaded) || retryingExperts[id] ? (
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: retryingExperts[id] ? "#E8821A" : S.brand,
                                marginLeft: "auto",
                                animation: "dotBounce 1.2s ease-in-out infinite",
                              }}
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {/* Report panel */}
                  <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
                    {(() => {
                      const e = EXPERTS[selectedExpert];
                      const report = expertReports[selectedExpert];
                      return (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              marginBottom: 20,
                            }}
                          >
                            <ExpertAvatar id={selectedExpert} size={40} />
                            <div>
                              <h3
                                style={{
                                  fontSize: 17,
                                  fontWeight: 700,
                                  color: S.main,
                                  margin: 0,
                                }}
                              >
                                {e.name}
                              </h3>
                              <p style={{ fontSize: 12, color: S.sub, margin: 0 }}>
                                {e.role}
                              </p>
                            </div>
                          </div>

                          {(loadingExperts && !report) || retryingExperts[selectedExpert] ? (
                            <div
                              style={{
                                textAlign: "center",
                                padding: 48,
                                color: S.sub,
                                fontSize: 13,
                              }}
                            >
                              <LoadingDots />
                              <p style={{ marginTop: 12 }}>
                                {retryingExperts[selectedExpert] ? "再分析中..." : "分析中..."}
                              </p>
                            </div>
                          ) : report ? (
                            <>
                              <div
                                style={{
                                  background: "#FAFAF8",
                                  borderRadius: 12,
                                  padding: 20,
                                  marginBottom: 20,
                                }}
                              >
                                <h4
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: S.main,
                                    marginBottom: 12,
                                  }}
                                >
                                  現状の問題点
                                </h4>
                                <ol
                                  style={{
                                    margin: 0,
                                    paddingLeft: 18,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                  }}
                                >
                                  {report.issues.map((issue, i) => (
                                    <li
                                      key={i}
                                      style={{
                                        fontSize: 13,
                                        color: "#555",
                                        lineHeight: 1.7,
                                      }}
                                    >
                                      {issue}
                                    </li>
                                  ))}
                                </ol>
                              </div>

                              <h4
                                style={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: S.main,
                                  marginBottom: 10,
                                }}
                              >
                                リニューアルへの提言
                              </h4>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "repeat(auto-fit, minmax(200px, 1fr))",
                                  gap: 10,
                                }}
                              >
                                {report.recommendations.map((rec, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      background: "#FAFAF8",
                                      borderRadius: 12,
                                      padding: 16,
                                      borderTop: `3px solid ${e.textColor}`,
                                    }}
                                  >
                                    <p
                                      style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: e.textColor,
                                        marginBottom: 4,
                                      }}
                                    >
                                      提言 {i + 1}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: 12,
                                        color: "#555",
                                        lineHeight: 1.7,
                                        margin: 0,
                                      }}
                                    >
                                      {rec}
                                    </p>
                                  </div>
                                ))}
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  width: "100%",
                                  marginTop: 24,
                                }}
                              >
                                <PillButton
                                  onClick={goToChat}
                                  variant="primary"
                                  size="lg"
                                  style={{ flex: 1 }}
                                >
                                  このプロに相談する →
                                </PillButton>
                                <PillButton
                                  onClick={goToPersona}
                                  variant="secondary"
                                  size="lg"
                                  style={{ flex: 1 }}
                                >
                                  ペルソナ設定へ →
                                </PillButton>
                              </div>
                            </>
                          ) : (
                            <div
                              style={{
                                textAlign: "center",
                                padding: 48,
                                color: "#C53030",
                                background: "#FFF5F5",
                                borderRadius: 12,
                                fontSize: 13,
                              }}
                            >
                              分析に失敗しました
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </Card>
              </div>
            )}

            {/* ── STEP 4: ペルソナ設定 ── */}
            {step === 4 && (
              <div
                style={{
                  maxWidth: 960,
                  margin: "0 auto",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <SectionTitle ja="ペルソナ設定" en="persona" />
                <p
                  style={{
                    fontSize: 13,
                    color: S.sub,
                    margin: "8px 0 20px",
                  }}
                >
                  サイトの特徴から生成された3名のペルソナです。気になる人物を選んで会話し、リニューアルへの要望を引き出してください。
                </p>

                {loadingPersonas && (
                  <Card>
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: S.sub,
                        fontSize: 13,
                      }}
                    >
                      <LoadingDots />
                      <p style={{ marginTop: 12 }}>ペルソナを生成中...</p>
                    </div>
                  </Card>
                )}

                {!loadingPersonas && personas && (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 16,
                      }}
                    >
                      {personas.map((p) => {
                        const c = PERSONA_COLORS[p.id];
                        const active = selectedPersona === p.id;
                        return (
                          <div
                            key={p.id}
                            style={{
                              background: S.card,
                              border: active
                                ? `2px solid ${S.brand}`
                                : `1px solid ${S.border}`,
                              borderRadius: 12,
                              padding: 20,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <div
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                background: c.bg,
                                color: c.text,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 24,
                                fontWeight: 700,
                                marginBottom: 12,
                              }}
                            >
                              {p.name.charAt(0)}
                            </div>
                            <h3
                              style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: S.main,
                                margin: "0 0 2px",
                              }}
                            >
                              {p.name}
                            </h3>
                            <p
                              style={{
                                fontSize: 12,
                                color: S.sub,
                                margin: "0 0 2px",
                              }}
                            >
                              {p.age}歳
                            </p>
                            <p
                              style={{
                                fontSize: 12,
                                color: c.text,
                                fontWeight: 600,
                                margin: "0 0 12px",
                              }}
                            >
                              {p.job}
                            </p>
                            <p
                              style={{
                                fontSize: 12,
                                color: "#555",
                                lineHeight: 1.7,
                                margin: "0 0 12px",
                              }}
                            >
                              {p.description}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 4,
                                marginBottom: 10,
                              }}
                            >
                              {p.needs.map((n, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: 10,
                                    padding: "2px 8px",
                                    borderRadius: 99,
                                    background: c.bg,
                                    color: c.text,
                                    fontWeight: 600,
                                  }}
                                >
                                  {n}
                                </span>
                              ))}
                            </div>
                            {p.concern && (
                              <p
                                style={{
                                  fontSize: 11,
                                  color: "#777",
                                  lineHeight: 1.6,
                                  margin: "0 0 16px",
                                  fontStyle: "italic",
                                }}
                              >
                                「{p.concern}」
                              </p>
                            )}
                            <PillButton
                              onClick={() => selectPersona(p)}
                              variant={active ? "secondary" : "primary"}
                              size="sm"
                              fullWidth
                              style={{ marginTop: "auto" }}
                            >
                              {active ? "会話中 ✓" : "このペルソナに相談する"}
                            </PillButton>
                          </div>
                        );
                      })}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 12,
                        marginTop: 24,
                      }}
                    >
                      <PillButton
                        onClick={goToProposalFromPersona}
                        variant="secondary"
                        size="lg"
                        style={{ padding: "14px 40px" }}
                      >
                        分析レポートを作成する →
                      </PillButton>
                      <PillButton
                        onClick={() => setStep(3)}
                        variant="outline"
                        size="md"
                      >
                        ← 専門家分析に戻る
                      </PillButton>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── STEP 5: 分析レポートプレビュー ── */}
            {step === 5 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <SectionTitle ja="分析レポートプレビュー" en="report preview" />
                </div>

                {/* Slide tabs */}
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    overflowX: "auto",
                    marginBottom: 16,
                    paddingBottom: 4,
                  }}
                >
                  {[
                    "表紙",
                    "現状分析",
                    ...EXPERT_IDS.map((id) => EXPERTS[id].name),
                    "ペルソナ",
                    "専門家との会話",
                    "まとめ",
                  ].map((label, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 6,
                        border: `1px solid ${i === activeSlide ? S.brand : S.border}`,
                        background: i === activeSlide ? S.brand : S.card,
                        color: i === activeSlide ? "#fff" : S.sub,
                        fontSize: 11,
                        fontWeight: i === activeSlide ? 700 : 400,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Slide preview */}
                <Card
                  style={{
                    minHeight: 440,
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent:
                      activeSlide === 0 || activeSlide === 10
                        ? "center"
                        : "flex-start",
                    alignItems:
                      activeSlide === 0 || activeSlide === 10
                        ? "center"
                        : "stretch",
                    background:
                      activeSlide === 0 || activeSlide === 10
                        ? S.accent
                        : S.card,
                    overflow: "hidden",
                  }}
                >
                  {activeSlide === 0 && (
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          fontSize: 32,
                          fontWeight: 700,
                          color: "#fff",
                          marginBottom: 8,
                        }}
                      >
                        {siteData?.siteName}
                      </p>
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: S.brand,
                          marginBottom: 20,
                        }}
                      >
                        リニューアル分析レポート
                      </p>
                      <p style={{ fontSize: 13, color: "#BBB" }}>
                        {siteData?.industry} |{" "}
                        {new Date().toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                  )}

                  {activeSlide === 1 && siteData && (
                    <div>
                      <h4
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: S.main,
                          marginBottom: 16,
                        }}
                      >
                        サイト現状分析
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 170px",
                          gap: 20,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                          }}
                        >
                          <div>
                            <p
                              style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: S.main,
                                margin: "0 0 2px",
                              }}
                            >
                              {siteData.siteName}
                            </p>
                            <p
                              style={{
                                fontSize: 11,
                                color: S.brand,
                                fontWeight: 600,
                                margin: 0,
                              }}
                            >
                              {siteData.industry}
                            </p>
                            <p
                              style={{
                                fontSize: 11,
                                color: S.sub,
                                margin: "2px 0 0",
                                wordBreak: "break-all",
                              }}
                            >
                              {url}
                            </p>
                          </div>

                          <p
                            style={{
                              fontSize: 12,
                              color: "#555",
                              lineHeight: 1.7,
                              margin: 0,
                            }}
                          >
                            {siteData.description}
                          </p>

                          <div>
                            <Label>技術スタック</Label>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 4,
                              }}
                            >
                              {siteData.techStack.map((t, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: 10,
                                    padding: "2px 8px",
                                    borderRadius: 99,
                                    background: "#F0EDE6",
                                    color: "#555",
                                  }}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label>ページ構成</Label>
                            <p
                              style={{
                                fontSize: 11,
                                color: "#555",
                                lineHeight: 1.7,
                                margin: 0,
                              }}
                            >
                              {siteData.pageStructure}
                            </p>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              background: "#FAFAF8",
                              borderRadius: 10,
                              padding: 12,
                              textAlign: "center",
                            }}
                          >
                            <PageSpeedGauge
                              score={siteData.speedEstimate}
                            />
                          </div>

                          <div
                            style={{
                              background: "#FAFAF8",
                              borderRadius: 10,
                              padding: 10,
                            }}
                          >
                            <Label>デザイン傾向</Label>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 4,
                              }}
                            >
                              {siteData.designTone.map((t, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: 10,
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                    background: "#E8E4DC",
                                    color: "#555",
                                  }}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div
                            style={{
                              background: "#FAFAF8",
                              borderRadius: 10,
                              padding: 10,
                            }}
                          >
                            <Label>SEO状況</Label>
                            <p
                              style={{
                                fontSize: 10,
                                color: "#555",
                                lineHeight: 1.6,
                                margin: 0,
                              }}
                            >
                              {siteData.seoStatus}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSlide >= 2 && activeSlide <= 7 && (() => {
                    const eid = EXPERT_IDS[activeSlide - 2];
                    const meta = EXPERTS[eid];
                    const report = expertReports[eid];
                    return (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 20,
                            paddingBottom: 12,
                            borderBottom: `2px solid ${meta.textColor}`,
                          }}
                        >
                          <ExpertAvatar id={eid} size={36} />
                          <span
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: meta.textColor,
                            }}
                          >
                            {meta.name}
                          </span>
                          <span style={{ fontSize: 13, color: S.sub }}>
                            {meta.role}
                          </span>
                        </div>
                        {report ? (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 24,
                            }}
                          >
                            <div>
                              <h5
                                style={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: S.main,
                                  marginBottom: 10,
                                }}
                              >
                                問題点
                              </h5>
                              {report.issues.map((t, i) => (
                                <p
                                  key={i}
                                  style={{
                                    fontSize: 13,
                                    color: "#555",
                                    lineHeight: 1.7,
                                    marginBottom: 8,
                                  }}
                                >
                                  {i + 1}. {t}
                                </p>
                              ))}
                            </div>
                            <div>
                              <h5
                                style={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: S.brand,
                                  marginBottom: 10,
                                }}
                              >
                                提言
                              </h5>
                              {report.recommendations.map((t, i) => (
                                <p
                                  key={i}
                                  style={{
                                    fontSize: 13,
                                    color: "#555",
                                    lineHeight: 1.7,
                                    marginBottom: 8,
                                  }}
                                >
                                  {i + 1}. {t}
                                </p>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p style={{ color: S.sub, fontSize: 13 }}>
                            分析結果なし
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  {activeSlide === 8 && (
                    <div>
                      <h4
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: S.main,
                          marginBottom: 20,
                        }}
                      >
                        ターゲットペルソナ
                      </h4>
                      {personas && personas.length > 0 ? (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${personas.length}, 1fr)`,
                            gap: 16,
                          }}
                        >
                          {personas.map((p) => {
                            const c = PERSONA_COLORS[p.id];
                            return (
                              <div
                                key={p.id}
                                style={{
                                  background: "#FAFAF8",
                                  borderRadius: 10,
                                  padding: 16,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 10,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                  }}
                                >
                                  <Avatar
                                    letter={p.name.charAt(0)}
                                    bg={c.bg}
                                    color={c.text}
                                    size={40}
                                  />
                                  <div style={{ minWidth: 0 }}>
                                    <p
                                      style={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: S.main,
                                        margin: 0,
                                      }}
                                    >
                                      {p.name}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: 11,
                                        color: c.text,
                                        fontWeight: 600,
                                        margin: 0,
                                      }}
                                    >
                                      {p.age}歳・{p.job}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 700,
                                      color: S.sub,
                                      letterSpacing: "0.1em",
                                      margin: "0 0 3px",
                                    }}
                                  >
                                    行動特性
                                  </p>
                                  <p
                                    style={{
                                      fontSize: 12,
                                      color: "#555",
                                      lineHeight: 1.6,
                                      margin: 0,
                                    }}
                                  >
                                    {p.description}
                                  </p>
                                </div>
                                {p.needs && p.needs.length > 0 && (
                                  <div>
                                    <p
                                      style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: S.sub,
                                        letterSpacing: "0.1em",
                                        margin: "0 0 3px",
                                      }}
                                    >
                                      モチベーション
                                    </p>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 4,
                                      }}
                                    >
                                      {p.needs.map((n, i) => (
                                        <span
                                          key={i}
                                          style={{
                                            fontSize: 10,
                                            padding: "2px 8px",
                                            borderRadius: 99,
                                            background: c.bg,
                                            color: c.text,
                                            fontWeight: 600,
                                          }}
                                        >
                                          {n}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {p.concern && (
                                  <div>
                                    <p
                                      style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: S.sub,
                                        letterSpacing: "0.1em",
                                        margin: "0 0 3px",
                                      }}
                                    >
                                      ペインポイント
                                    </p>
                                    <p
                                      style={{
                                        fontSize: 12,
                                        color: "#555",
                                        lineHeight: 1.6,
                                        margin: 0,
                                        fontStyle: "italic",
                                      }}
                                    >
                                      「{p.concern}」
                                    </p>
                                  </div>
                                )}
                                {/* 会話サマリー */}
                                <div
                                  style={{
                                    borderTop: `1px dashed ${S.border}`,
                                    paddingTop: 10,
                                    marginTop: 2,
                                  }}
                                >
                                  <p
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 700,
                                      color: S.brand,
                                      letterSpacing: "0.1em",
                                      margin: "0 0 6px",
                                    }}
                                  >
                                    会話から抽出した主なポイント
                                  </p>
                                  {loadingSummaries &&
                                  (personaChatHistory[p.id] || []).length >
                                    0 ? (
                                    <div
                                      style={{ fontSize: 11, color: S.sub }}
                                    >
                                      <LoadingDots /> 要約中...
                                    </div>
                                  ) : (personaSummaries[p.id]?.length ?? 0) >
                                    0 ? (
                                    <ol
                                      style={{
                                        margin: 0,
                                        paddingLeft: 16,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 4,
                                      }}
                                    >
                                      {personaSummaries[p.id].map((s, i) => (
                                        <li
                                          key={i}
                                          style={{
                                            fontSize: 11,
                                            color: "#444",
                                            lineHeight: 1.6,
                                          }}
                                        >
                                          {s}
                                        </li>
                                      ))}
                                    </ol>
                                  ) : (
                                    <p
                                      style={{
                                        fontSize: 11,
                                        color: S.sub,
                                        margin: 0,
                                      }}
                                    >
                                      会話未実施
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p style={{ fontSize: 13, color: S.sub }}>
                          ペルソナ情報なし
                        </p>
                      )}
                    </div>
                  )}

                  {activeSlide === 9 && (
                    <div style={{ width: "100%" }}>
                      <h4
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: S.main,
                          marginBottom: 16,
                        }}
                      >
                        専門家との会話
                      </h4>
                      {(() => {
                        const expertsWithChat = EXPERT_IDS.filter(
                          (id) =>
                            (expertChatHistory[id] || []).length > 0
                        );
                        if (expertsWithChat.length === 0) {
                          return (
                            <p style={{ fontSize: 13, color: S.sub }}>
                              専門家との会話が行われていません。STEP3の「このプロに相談する」から会話を開始できます。
                            </p>
                          );
                        }
                        return (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 12,
                            }}
                          >
                            {expertsWithChat.map((id) => {
                              const e = EXPERTS[id];
                              const summary =
                                expertChatSummaries[id] || [];
                              return (
                                <div
                                  key={id}
                                  style={{
                                    background: "#FAFAF8",
                                    borderRadius: 10,
                                    padding: 14,
                                    borderLeft: `3px solid ${e.textColor}`,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 10,
                                      marginBottom: 10,
                                    }}
                                  >
                                    <ExpertAvatar id={id} size={28} />
                                    <span
                                      style={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: e.textColor,
                                      }}
                                    >
                                      {e.name}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: 11,
                                        color: S.sub,
                                      }}
                                    >
                                      ｜{e.role}
                                    </span>
                                  </div>
                                  <p
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 700,
                                      color: S.brand,
                                      letterSpacing: "0.1em",
                                      margin: "0 0 6px",
                                    }}
                                  >
                                    会話から抽出したポイント
                                  </p>
                                  {loadingSummaries && summary.length === 0 ? (
                                    <div
                                      style={{
                                        fontSize: 11,
                                        color: S.sub,
                                      }}
                                    >
                                      <LoadingDots /> 要約中...
                                    </div>
                                  ) : summary.length > 0 ? (
                                    <ol
                                      style={{
                                        margin: 0,
                                        paddingLeft: 18,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 4,
                                      }}
                                    >
                                      {summary.map((s, i) => (
                                        <li
                                          key={i}
                                          style={{
                                            fontSize: 12,
                                            color: "#444",
                                            lineHeight: 1.7,
                                          }}
                                        >
                                          {s}
                                        </li>
                                      ))}
                                    </ol>
                                  ) : (
                                    <p
                                      style={{
                                        fontSize: 11,
                                        color: S.sub,
                                        margin: 0,
                                      }}
                                    >
                                      要約情報なし
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {activeSlide === 10 && (
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: "#fff",
                          marginBottom: 12,
                        }}
                      >
                        ありがとうございました
                      </p>
                      <p style={{ fontSize: 13, color: "#BBB" }}>
                        Powered by Renewal Advisor / ciraf
                      </p>
                    </div>
                  )}
                </Card>

                {/* Bottom actions */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    marginTop: 24,
                  }}
                >
                  <PillButton
                    variant="outline"
                    size="md"
                    onClick={() => setStep(3)}
                  >
                    &larr; ペルソナ設定に戻る
                  </PillButton>
                  <PillButton
                    variant="secondary"
                    size="md"
                    onClick={handleDownloadPptx}
                    disabled={pptxGenerating}
                  >
                    {pptxGenerating
                      ? "生成中..."
                      : "PowerPointをダウンロード"}
                  </PillButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL: Chat ── */}
        <div
          style={{
            width: 420,
            borderLeft: `1px solid ${S.border}`,
            display: "flex",
            flexDirection: "column",
            background: S.bg,
            flexShrink: 0,
          }}
        >
          {/* Expert avatars row / Persona indicator */}
          <div
            style={{
              padding: "10px 16px",
              borderBottom: `1px solid ${S.border}`,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {step === 4 && selectedPersona && personas ? (
              (() => {
                const p = personas.find((x) => x.id === selectedPersona);
                if (!p) return null;
                const c = PERSONA_COLORS[selectedPersona];
                return (
                  <>
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: c.bg,
                        color: c.text,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {p.name.charAt(0)}
                    </span>
                    <span style={{ fontSize: 11, color: S.main, marginLeft: 4 }}>
                      現在 {p.name}（{p.age}歳・{p.job}）と会話中
                    </span>
                  </>
                );
              })()
            ) : step === 3 && selectedChatExpert ? (
              (() => {
                const e = EXPERTS[selectedChatExpert];
                return (
                  <>
                    <ExpertAvatar id={selectedChatExpert} size={26} />
                    <span
                      style={{
                        fontSize: 11,
                        color: S.main,
                        marginLeft: 4,
                      }}
                    >
                      現在 {e.name}（{e.role}）と会話中
                    </span>
                    <button
                      onClick={() => setSelectedChatExpert(null)}
                      style={{
                        marginLeft: "auto",
                        fontSize: 10,
                        color: S.sub,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      終了
                    </button>
                  </>
                );
              })()
            ) : (
              <>
                <AdvisorAvatar size={26} />
                {involvedExperts.map((id) => (
                  <ExpertAvatar key={id} id={id} size={26} />
                ))}
                <span style={{ fontSize: 10, color: S.sub, marginLeft: 8 }}>
                  {involvedExperts.length > 0
                    ? `${involvedExperts.length + 1}名が参加中`
                    : "アドバイザー"}
                </span>
              </>
            )}
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {bubbles.map(renderBubble)}
            {chatLoading && (
              <div style={{ display: "flex", gap: 8 }}>
                {step === 4 && selectedPersona && personas ? (
                  (() => {
                    const p = personas.find((x) => x.id === selectedPersona);
                    const c = PERSONA_COLORS[selectedPersona];
                    return p ? (
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: c.bg,
                          color: c.text,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {p.name.charAt(0)}
                      </span>
                    ) : null;
                  })()
                ) : step === 3 && selectedChatExpert ? (
                  <ExpertAvatar id={selectedChatExpert} size={28} />
                ) : step === 4 ? (
                  <ExpertAvatar id={selectedExpert} size={28} />
                ) : (
                  <AdvisorAvatar size={28} />
                )}
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: S.card,
                    border: `1px solid ${S.border}`,
                  }}
                >
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick replies + Input */}
          <div
            style={{
              padding: "10px 16px 14px",
              borderTop: `1px solid ${S.border}`,
            }}
          >
            {quickReplies.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                {quickReplies.map((qr, i) => (
                  <PillButton
                    key={i}
                    onClick={qr.action}
                    variant="outline"
                    size="sm"
                  >
                    {qr.label}
                  </PillButton>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && isInputActive && handleChatSend()}
                placeholder={
                  !isInputActive
                    ? "チャットで質問できます"
                    : step === 3 && selectedChatExpert
                      ? `${EXPERTS[selectedChatExpert].name}さんに質問...`
                      : selectedPersona && personas
                        ? `${personas.find((p) => p.id === selectedPersona)?.name ?? "ペルソナ"}さんに質問...`
                        : `${EXPERTS[selectedExpert].name}さんに質問...`
                }
                disabled={!isInputActive}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  border: `1px solid ${S.border}`,
                  borderRadius: 10,
                  fontSize: 13,
                  color: S.main,
                  outline: "none",
                  background: isInputActive ? S.card : "#F5F3EE",
                  opacity: isInputActive ? 1 : 0.6,
                }}
              />
              {isInputActive && (
                <PillButton
                  onClick={handleChatSend}
                  variant="primary"
                  size="sm"
                  disabled={!chatInput.trim() || chatLoading}
                >
                  送信
                </PillButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Tiny helper ─────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        color: "#888",
        letterSpacing: "0.12em",
        fontWeight: 700,
        textTransform: "uppercase",
        marginBottom: 6,
      }}
    >
      {children}
    </p>
  );
}
