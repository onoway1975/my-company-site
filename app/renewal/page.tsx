"use client";

import { useState, useRef, useEffect } from "react";

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

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ProposalData = {
  persona: string;
  pageStructure: string;
  kpi: string;
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

const C = {
  bg: "#F4F4F4",
  card: "#FFFFFF",
  border: "#E8E8E8",
  main: "#0D1B2A",
  accent: "#E8821A",
  sidebar: "#F8F8F8",
  muted: "#888888",
};

const STEP_LABELS = ["URL入力", "Research", "専門家分析", "相談チャット", "提案書"];

/* ── Sub-components ────────────────────────── */

function StepIndicator({ current }: { current: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: "20px 0 16px",
        background: C.card,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const active = stepNum <= current;
        return (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: active ? 700 : 400,
                color: active ? "#fff" : C.muted,
                background: active ? C.main : "#EEEEEE",
                transition: "all 0.2s",
              }}
            >
              <span>{stepNum}</span>
              <span>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                style={{
                  width: 20,
                  height: 1,
                  background: active ? C.main : "#DDD",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExpertAvatar({
  id,
  size = 36,
}: {
  id: ExpertId;
  size?: number;
}) {
  const e = EXPERTS[id];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: e.color,
        color: e.textColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {e.avatar}
    </div>
  );
}

function PageSpeedGauge({ score }: { score: number }) {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const offset = circumference * (1 - pct);
  const color = score >= 70 ? "#22C55E" : score >= 40 ? "#F5A623" : "#EF4444";

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#EEEEEE"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="20"
          fontWeight="700"
          fill={color}
        >
          {score}
        </text>
      </svg>
      <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
        PageSpeed推定
      </p>
    </div>
  );
}

function ExpertSidebar({
  selected,
  onSelect,
  reports,
  loadingExperts,
}: {
  selected: ExpertId;
  onSelect: (id: ExpertId) => void;
  reports: Record<string, ExpertReport | null>;
  loadingExperts: boolean;
}) {
  return (
    <div
      style={{
        width: 200,
        minHeight: "calc(100vh - 120px)",
        background: C.sidebar,
        borderRight: `1px solid ${C.border}`,
        padding: "12px 0",
        flexShrink: 0,
      }}
    >
      <p
        style={{
          fontSize: 10,
          color: C.muted,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          padding: "8px 16px",
          fontWeight: 700,
        }}
      >
        メンバー
      </p>
      {EXPERT_IDS.map((id) => {
        const e = EXPERTS[id];
        const active = id === selected;
        const loaded = !!reports[id];
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "10px 16px",
              border: "none",
              background: active ? C.card : "transparent",
              borderLeft: active
                ? `3px solid ${C.accent}`
                : "3px solid transparent",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <ExpertAvatar id={id} size={28} />
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.main,
                  margin: 0,
                }}
              >
                {e.name}
              </p>
              <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>
                {e.role}
              </p>
            </div>
            {loadingExperts && !loaded && (
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.accent,
                  marginLeft: "auto",
                  animation: "pulse 1s ease-in-out infinite",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Main Component ────────────────────────── */

export default function RenewalPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [url, setUrl] = useState("");
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [expertReports, setExpertReports] = useState<
    Record<string, ExpertReport | null>
  >({});
  const [loadingExperts, setLoadingExperts] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<ExpertId>("producer");
  const [chatMessages, setChatMessages] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [pptxGenerating, setPptxGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, selectedExpert]);

  /* ── STEP 1 → 2: 分析 ─────────────────── */

  async function handleAnalyze() {
    if (!url.trim()) return;
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
        return;
      }
      setSiteData(data.siteData);
      setStep(2);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setAnalyzing(false);
    }
  }

  /* ── STEP 2 → 3: 専門家分析 ───────────── */

  async function handleStartExperts() {
    setLoadingExperts(true);
    setStep(3);
    const results = await Promise.allSettled(
      EXPERT_IDS.map((id) =>
        fetch("/api/renewal/expert/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, siteData, expertId: id }),
        })
          .then((r) => r.json())
          .then((data) => ({ id, data }))
      )
    );
    const reports: Record<string, ExpertReport | null> = {};
    results.forEach((r, i) => {
      if (r.status === "fulfilled" && r.value.data.issues) {
        reports[EXPERT_IDS[i]] = r.value.data;
      } else {
        reports[EXPERT_IDS[i]] = null;
      }
    });
    setExpertReports(reports);
    setLoadingExperts(false);
  }

  /* ── STEP 4: チャット送信 ──────────────── */

  async function handleChatSend() {
    if (!chatInput.trim() || chatLoading) return;
    const newMsg: ChatMessage = { role: "user", content: chatInput.trim() };
    const prev = chatMessages[selectedExpert] || [];
    const updated = [...prev, newMsg];
    setChatMessages((m) => ({ ...m, [selectedExpert]: updated }));
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/renewal/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated,
          expertId: selectedExpert,
          siteData,
        }),
      });
      const data = await res.json();
      const reply: ChatMessage = {
        role: "assistant",
        content: data.reply || "回答の生成に失敗しました",
      };
      setChatMessages((m) => ({
        ...m,
        [selectedExpert]: [...updated, reply],
      }));
    } catch {
      setChatMessages((m) => ({
        ...m,
        [selectedExpert]: [
          ...updated,
          { role: "assistant", content: "通信エラーが発生しました" },
        ],
      }));
    } finally {
      setChatLoading(false);
    }
  }

  /* ── STEP 3 → 5: 提案書生成 ───────────── */

  async function handleGenerateProposal() {
    setStep(5);
    setError(null);
    try {
      // Claude APIで追加データ生成 (expert APIを流用)
      const res = await fetch("/api/renewal/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `以下のサイト分析結果をもとに、3つのセクションをそれぞれ生成してください。

【セクション1: ペルソナ】
このサイトのターゲットペルソナを具体的に記述（年齢、職業、課題、ニーズ等）

【セクション2: リニューアル提案構成】
推奨するページ構成を箇条書きで（各ページの目的も簡潔に）

【セクション3: KPI設計】
3〜5個のKPI指標と目標値を箇条書きで

以下のJSON形式のみで返してください:
{"persona":"...","pageStructure":"...","kpi":"..."}

サイト分析結果:
${JSON.stringify(siteData, null, 2)}`,
            },
          ],
          expertId: "planner",
          siteData,
        }),
      });
      const data = await res.json();
      try {
        const clean = data.reply.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        setProposalData(parsed);
      } catch {
        setProposalData({
          persona: data.reply || "生成に失敗しました",
          pageStructure: "",
          kpi: "",
        });
      }
    } catch {
      setError("提案書データの生成に失敗しました");
    }
  }

  /* ── STEP 5: PPTX DL ──────────────────── */

  async function handleDownloadPptx() {
    setPptxGenerating(true);
    try {
      const res = await fetch("/api/renewal/pptx/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteData: { ...siteData, url },
          expertReports,
          persona: proposalData?.persona || "",
          pageStructure: proposalData?.pageStructure || "",
          kpi: proposalData?.kpi || "",
        }),
      });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "renewal-proposal.pptx";
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      setError("PPTX生成に失敗しました");
    } finally {
      setPptxGenerating(false);
    }
  }

  /* ── Render ────────────────────────────── */

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: C.bg }}>
        <StepIndicator current={step} />

        {/* ── STEP 1: URL入力 ── */}
        {step === 1 && (
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              padding: "80px 24px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: C.main,
                marginBottom: 8,
              }}
            >
              Webリニューアル提案書メーカー
            </h1>
            <p style={{ fontSize: 14, color: C.muted, marginBottom: 40 }}>
              URLを貼るだけで、Webのプロ6人がリニューアル提案書を作成します
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 6,
              }}
            >
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder="https://example.com"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: "12px 16px",
                  fontSize: 15,
                  borderRadius: 8,
                  color: C.main,
                  background: "transparent",
                }}
              />
              <button
                onClick={handleAnalyze}
                disabled={!url.trim() || analyzing}
                style={{
                  padding: "12px 28px",
                  borderRadius: 8,
                  border: "none",
                  background: C.accent,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  opacity: !url.trim() || analyzing ? 0.5 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {analyzing ? "分析中..." : "分析開始"}
              </button>
            </div>
            {error && (
              <p
                style={{
                  marginTop: 16,
                  fontSize: 13,
                  color: "#C53030",
                  background: "#FFF5F5",
                  border: "1px solid #FED7D7",
                  padding: "10px 16px",
                  borderRadius: 8,
                }}
              >
                {error}
              </p>
            )}
            {remaining !== null && (
              <p style={{ marginTop: 12, fontSize: 11, color: C.muted }}>
                本日の残り利用回数: {remaining}回
              </p>
            )}
          </div>
        )}

        {/* ── STEP 2: Research ── */}
        {step === 2 && siteData && (
          <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: C.main,
                marginBottom: 24,
              }}
            >
              サイト分析結果
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 200px",
                gap: 24,
              }}
            >
              {/* 左: 基本情報 */}
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.main,
                    marginBottom: 4,
                  }}
                >
                  {siteData.siteName}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: C.accent,
                    fontWeight: 600,
                    marginBottom: 16,
                  }}
                >
                  {siteData.industry}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "#444",
                    lineHeight: 1.7,
                    marginBottom: 20,
                  }}
                >
                  {siteData.description}
                </p>

                {/* 技術スタック */}
                <p
                  style={{
                    fontSize: 10,
                    color: C.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  技術スタック
                </p>
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
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: "#F0F0F0",
                        color: "#555",
                        fontWeight: 500,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* ページ構成 */}
                <p
                  style={{
                    fontSize: 10,
                    color: C.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  ページ構成
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "#444",
                    lineHeight: 1.7,
                    marginBottom: 20,
                  }}
                >
                  {siteData.pageStructure}
                </p>

                {/* SEO */}
                <p
                  style={{
                    fontSize: 10,
                    color: C.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  SEO状況
                </p>
                <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7 }}>
                  {siteData.seoStatus}
                </p>
              </div>

              {/* 右: スコア + デザイントーン */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: 20,
                    textAlign: "center",
                  }}
                >
                  <PageSpeedGauge score={siteData.speedEstimate} />
                </div>
                <div
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      color: C.muted,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    デザイン傾向
                  </p>
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
                          fontSize: 11,
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: "#F0F0F0",
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

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button
                onClick={handleStartExperts}
                style={{
                  padding: "14px 40px",
                  borderRadius: 8,
                  border: "none",
                  background: C.accent,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                エキスパート分析を開始
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: 専門家分析 ── */}
        {step === 3 && (
          <div style={{ display: "flex", minHeight: "calc(100vh - 120px)" }}>
            <ExpertSidebar
              selected={selectedExpert}
              onSelect={setSelectedExpert}
              reports={expertReports}
              loadingExperts={loadingExperts}
            />
            <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
              {(() => {
                const e = EXPERTS[selectedExpert];
                const report = expertReports[selectedExpert];

                return (
                  <>
                    {/* ヘッダー */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 24,
                      }}
                    >
                      <ExpertAvatar id={selectedExpert} size={48} />
                      <div>
                        <h2
                          style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: C.main,
                            margin: 0,
                          }}
                        >
                          {e.name}
                        </h2>
                        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
                          {e.role}
                        </p>
                      </div>
                    </div>

                    {loadingExperts && !report ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: 60,
                          color: C.muted,
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            border: `3px solid ${C.border}`,
                            borderTopColor: C.accent,
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                            margin: "0 auto 12px",
                          }}
                        />
                        分析中...
                      </div>
                    ) : report ? (
                      <>
                        {/* 問題点 */}
                        <div
                          style={{
                            background: C.card,
                            border: `1px solid ${C.border}`,
                            borderRadius: 12,
                            padding: 24,
                            marginBottom: 20,
                          }}
                        >
                          <h3
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: C.main,
                              marginBottom: 16,
                            }}
                          >
                            現状の問題点
                          </h3>
                          <ol
                            style={{
                              margin: 0,
                              paddingLeft: 20,
                              display: "flex",
                              flexDirection: "column",
                              gap: 12,
                            }}
                          >
                            {report.issues.map((issue, i) => (
                              <li
                                key={i}
                                style={{
                                  fontSize: 13,
                                  color: "#444",
                                  lineHeight: 1.7,
                                }}
                              >
                                {issue}
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* 提言 */}
                        <h3
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: C.main,
                            marginBottom: 12,
                          }}
                        >
                          リニューアルへの提言
                        </h3>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: 12,
                            marginBottom: 32,
                          }}
                        >
                          {report.recommendations.map((rec, i) => (
                            <div
                              key={i}
                              style={{
                                background: C.card,
                                border: `1px solid ${C.border}`,
                                borderRadius: 12,
                                padding: 20,
                                borderTop: `3px solid ${e.textColor}`,
                              }}
                            >
                              <p
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: e.textColor,
                                  marginBottom: 4,
                                }}
                              >
                                提言 {i + 1}
                              </p>
                              <p
                                style={{
                                  fontSize: 13,
                                  color: "#444",
                                  lineHeight: 1.7,
                                  margin: 0,
                                }}
                              >
                                {rec}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: 60,
                          color: "#C53030",
                          background: "#FFF5F5",
                          borderRadius: 12,
                        }}
                      >
                        分析に失敗しました
                      </div>
                    )}

                    {/* アクションボタン */}
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        onClick={() => setStep(4)}
                        style={{
                          padding: "10px 24px",
                          borderRadius: 8,
                          border: `1px solid ${C.border}`,
                          background: C.card,
                          color: C.main,
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        このプロに相談する &rarr;
                      </button>
                      <button
                        onClick={handleGenerateProposal}
                        disabled={loadingExperts}
                        style={{
                          padding: "10px 24px",
                          borderRadius: 8,
                          border: "none",
                          background: C.accent,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          opacity: loadingExperts ? 0.5 : 1,
                        }}
                      >
                        提案書を生成
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── STEP 4: チャット ── */}
        {step === 4 && (
          <div style={{ display: "flex", minHeight: "calc(100vh - 120px)" }}>
            <ExpertSidebar
              selected={selectedExpert}
              onSelect={setSelectedExpert}
              reports={expertReports}
              loadingExperts={false}
            />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 120px)",
              }}
            >
              {/* チャットヘッダー */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 24px",
                  borderBottom: `1px solid ${C.border}`,
                  background: C.card,
                }}
              >
                <button
                  onClick={() => setStep(3)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${C.border}`,
                    background: "transparent",
                    color: C.muted,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  &larr; 戻る
                </button>
                <ExpertAvatar id={selectedExpert} size={32} />
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: C.main,
                      margin: 0,
                    }}
                  >
                    {EXPERTS[selectedExpert].name}
                  </p>
                  <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
                    {EXPERTS[selectedExpert].role}
                  </p>
                </div>
              </div>

              {/* メッセージ一覧 */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {(chatMessages[selectedExpert] || []).length === 0 && (
                  <p
                    style={{
                      textAlign: "center",
                      color: C.muted,
                      fontSize: 13,
                      padding: 40,
                    }}
                  >
                    {EXPERTS[selectedExpert].name}
                    に質問してみましょう
                  </p>
                )}
                {(chatMessages[selectedExpert] || []).map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent:
                        msg.role === "user" ? "flex-end" : "flex-start",
                      gap: 8,
                    }}
                  >
                    {msg.role === "assistant" && (
                      <ExpertAvatar id={selectedExpert} size={28} />
                    )}
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "10px 16px",
                        borderRadius: 12,
                        fontSize: 13,
                        lineHeight: 1.7,
                        background:
                          msg.role === "user" ? C.main : C.card,
                        color: msg.role === "user" ? "#fff" : "#444",
                        border:
                          msg.role === "assistant"
                            ? `1px solid ${C.border}`
                            : "none",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <ExpertAvatar id={selectedExpert} size={28} />
                    <div
                      style={{
                        padding: "10px 16px",
                        borderRadius: 12,
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        color: C.muted,
                        fontSize: 13,
                      }}
                    >
                      入力中...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* 入力欄 */}
              <div
                style={{
                  padding: "12px 24px",
                  borderTop: `1px solid ${C.border}`,
                  background: C.card,
                  display: "flex",
                  gap: 8,
                }}
              >
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                  placeholder="メッセージを入力..."
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    fontSize: 13,
                    outline: "none",
                    color: C.main,
                  }}
                />
                <button
                  onClick={handleChatSend}
                  disabled={!chatInput.trim() || chatLoading}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "none",
                    background: C.accent,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    opacity: !chatInput.trim() || chatLoading ? 0.5 : 1,
                  }}
                >
                  送信
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: 提案書プレビュー ── */}
        {step === 5 && (
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <h2
                style={{ fontSize: 22, fontWeight: 700, color: C.main, margin: 0 }}
              >
                提案書プレビュー
              </h2>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setStep(3)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: `1px solid ${C.border}`,
                    background: C.card,
                    color: C.main,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  &larr; 分析に戻る
                </button>
                <button
                  onClick={handleDownloadPptx}
                  disabled={pptxGenerating}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 8,
                    border: "none",
                    background: C.accent,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    opacity: pptxGenerating ? 0.5 : 1,
                  }}
                >
                  {pptxGenerating
                    ? "生成中..."
                    : "PowerPointをダウンロード"}
                </button>
              </div>
            </div>

            {/* スライドタブ */}
            <div
              style={{
                display: "flex",
                gap: 4,
                overflowX: "auto",
                marginBottom: 20,
                paddingBottom: 4,
              }}
            >
              {[
                "表紙",
                "現状分析",
                ...EXPERT_IDS.map((id) => EXPERTS[id].name),
                "ペルソナ",
                "提案構成",
                "KPI設計",
                "まとめ",
              ].map((label, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    border:
                      i === activeSlide
                        ? `1px solid ${C.accent}`
                        : `1px solid ${C.border}`,
                    background: i === activeSlide ? C.accent : C.card,
                    color: i === activeSlide ? "#fff" : C.muted,
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

            {/* スライドプレビュー (16:9) */}
            <div
              style={{
                aspectRatio: "16/9",
                background: activeSlide === 0 || activeSlide === 11
                  ? C.main
                  : C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                overflow: "hidden",
                padding: 40,
                display: "flex",
                flexDirection: "column",
                justifyContent:
                  activeSlide === 0 || activeSlide === 11
                    ? "center"
                    : "flex-start",
              }}
            >
              {/* Slide 0: 表紙 */}
              {activeSlide === 0 && (
                <div style={{ textAlign: activeSlide === 0 ? "left" : "center" }}>
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
                      color: C.accent,
                      marginBottom: 16,
                    }}
                  >
                    リニューアル提案書
                  </p>
                  <p style={{ fontSize: 12, color: "#999" }}>
                    {siteData?.industry} |{" "}
                    {new Date().toLocaleDateString("ja-JP")}
                  </p>
                  <p style={{ fontSize: 10, color: "#666", marginTop: 24 }}>
                    Powered by Renewal Advisor / ciraf
                  </p>
                </div>
              )}

              {/* Slide 1: 現状分析 */}
              {activeSlide === 1 && siteData && (
                <div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: C.main,
                      marginBottom: 20,
                    }}
                  >
                    サイト現状分析
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 20,
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#444", lineHeight: 2 }}>
                      <p>
                        <strong>URL:</strong> {url}
                      </p>
                      <p>
                        <strong>業種:</strong> {siteData.industry}
                      </p>
                      <p>
                        <strong>技術:</strong>{" "}
                        {siteData.techStack.join(", ")}
                      </p>
                      <p>
                        <strong>構成:</strong> {siteData.pageStructure}
                      </p>
                    </div>
                    <div>
                      <PageSpeedGauge score={siteData.speedEstimate} />
                      <p
                        style={{
                          fontSize: 12,
                          color: "#444",
                          marginTop: 12,
                          lineHeight: 1.7,
                        }}
                      >
                        {siteData.seoStatus}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Slides 2-7: 専門家 */}
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
                      <div>
                        <p
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: meta.textColor,
                            margin: 0,
                          }}
                        >
                          {meta.name}
                        </p>
                        <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
                          {meta.role}
                        </p>
                      </div>
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
                          <h4
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: C.main,
                              marginBottom: 8,
                            }}
                          >
                            問題点
                          </h4>
                          {report.issues.map((t, i) => (
                            <p
                              key={i}
                              style={{
                                fontSize: 11,
                                color: "#444",
                                lineHeight: 1.7,
                                marginBottom: 8,
                              }}
                            >
                              {i + 1}. {t}
                            </p>
                          ))}
                        </div>
                        <div>
                          <h4
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: C.accent,
                              marginBottom: 8,
                            }}
                          >
                            提言
                          </h4>
                          {report.recommendations.map((t, i) => (
                            <p
                              key={i}
                              style={{
                                fontSize: 11,
                                color: "#444",
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
                      <p style={{ color: C.muted }}>分析結果なし</p>
                    )}
                  </div>
                );
              })()}

              {/* Slide 8: ペルソナ */}
              {activeSlide === 8 && (
                <div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: C.main,
                      marginBottom: 16,
                    }}
                  >
                    ターゲットペルソナ
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#444",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {proposalData?.persona || "生成中..."}
                  </p>
                </div>
              )}

              {/* Slide 9: 提案構成 */}
              {activeSlide === 9 && (
                <div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: C.main,
                      marginBottom: 16,
                    }}
                  >
                    リニューアル提案構成
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#444",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {proposalData?.pageStructure || "生成中..."}
                  </p>
                </div>
              )}

              {/* Slide 10: KPI */}
              {activeSlide === 10 && (
                <div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: C.main,
                      marginBottom: 16,
                    }}
                  >
                    KPI設計
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#444",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {proposalData?.kpi || "生成中..."}
                  </p>
                </div>
              )}

              {/* Slide 11: まとめ */}
              {activeSlide === 11 && (
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
                  <p style={{ fontSize: 13, color: "#999" }}>
                    本提案書をもとに、具体的なリニューアル計画を策定いたします。
                  </p>
                  <p style={{ fontSize: 10, color: "#666", marginTop: 24 }}>
                    Powered by Renewal Advisor / ciraf
                  </p>
                </div>
              )}
            </div>

            {error && (
              <p
                style={{
                  marginTop: 16,
                  fontSize: 13,
                  color: "#C53030",
                  background: "#FFF5F5",
                  border: "1px solid #FED7D7",
                  padding: "10px 16px",
                  borderRadius: 8,
                }}
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
