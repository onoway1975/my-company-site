import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type PptxGenJS from "pptxgenjs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type Persona = {
  id: string;
  name: string;
  age: number;
  job: string;
  description: string;
  needs?: string[];
  concern?: string;
};

type ChatMsg = { role: string; content: string };

async function summarizePersonaChat(
  persona: Persona,
  history: ChatMsg[]
): Promise<string[]> {
  if (!history || history.length === 0) return [];
  try {
    const convo = history
      .map((m) => `${m.role === "user" ? "質問者" : persona.name}: ${m.content}`)
      .join("\n");
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: `以下のペルソナとの会話履歴から、リニューアルに反映すべき要望・懸念を3点に要約してください。
JSON形式のみで返してください: {"summary":["要望1","要望2","要望3"]}`,
      messages: [
        {
          role: "user",
          content: `ペルソナ: ${persona.name}（${persona.age}歳・${persona.job}）\n\n会話履歴:\n${convo}`,
        },
      ],
    });
    const raw =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Array.isArray(parsed.summary) ? parsed.summary : [];
  } catch (e) {
    console.warn("[renewal/pptx] persona summarize failed", e);
    return [];
  }
}

async function summarizeExpertChat(
  expertName: string,
  expertRole: string,
  history: ChatMsg[]
): Promise<string[]> {
  if (!history || history.length === 0) return [];
  try {
    const convo = history
      .map((m) => `${m.role === "user" ? "質問者" : expertName}: ${m.content}`)
      .join("\n");
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: `以下の${expertRole}「${expertName}」との会話履歴から、リニューアル施策に反映すべきポイントを3点に要約してください。
JSON形式のみで返してください: {"summary":["ポイント1","ポイント2","ポイント3"]}`,
      messages: [
        {
          role: "user",
          content: `会話履歴:\n${convo}`,
        },
      ],
    });
    const raw =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Array.isArray(parsed.summary) ? parsed.summary : [];
  } catch (e) {
    console.warn("[renewal/pptx] expert summarize failed", e);
    return [];
  }
}

const EXPERT_META: Record<
  string,
  { name: string; role: string; color: string }
> = {
  producer: { name: "田中 誠一", role: "Webプロデューサー", color: "#185FA5" },
  director: { name: "鈴木 彩", role: "Webディレクター", color: "#3B6D11" },
  planner: {
    name: "山本 健太",
    role: "プランナー/マーケター",
    color: "#854F0B",
  },
  designer: {
    name: "中村 あかり",
    role: "UI/UXデザイナー",
    color: "#993556",
  },
  coder: {
    name: "佐藤 拓也",
    role: "マークアップエンジニア",
    color: "#444441",
  },
  engineer: { name: "伊藤 大輔", role: "Webエンジニア", color: "#0F6E56" },
};

const EXPERT_ORDER = [
  "producer",
  "director",
  "planner",
  "designer",
  "coder",
  "engineer",
];

export async function POST(req: NextRequest) {
  try {
    const {
      siteData,
      expertReports,
      personas,
      personaChatHistory,
      expertChatHistory,
    } = (await req.json()) as {
      siteData: { siteName?: string; industry?: string; url?: string; description?: string; techStack?: string[]; pageStructure?: string; speedEstimate?: number; seoStatus?: string; designTone?: string[] };
      expertReports: Record<string, { issues?: string[]; recommendations?: string[] }>;
      personas?: Persona[];
      personaChatHistory?: Record<string, ChatMsg[]>;
      expertChatHistory?: Record<string, ChatMsg[]>;
    };

    // 会話サマリーを並列生成（ペルソナ + 専門家）
    const personaTasks =
      personas && personas.length > 0 && personaChatHistory
        ? personas.map(async (p) => {
            const history = personaChatHistory[p.id] || [];
            const summary = await summarizePersonaChat(p, history);
            return { kind: "persona" as const, id: p.id, summary };
          })
        : [];
    const expertsWithChat = expertChatHistory
      ? EXPERT_ORDER.filter(
          (eid) => (expertChatHistory[eid] || []).length > 0
        )
      : [];
    const expertTasks = expertsWithChat.map(async (eid) => {
      const meta = EXPERT_META[eid];
      const history = expertChatHistory?.[eid] || [];
      const summary = await summarizeExpertChat(
        meta.name,
        meta.role,
        history
      );
      return { kind: "expert" as const, id: eid, summary };
    });

    const allResults = await Promise.allSettled([
      ...personaTasks,
      ...expertTasks,
    ]);

    const personaSummaries: Record<string, string[]> = {};
    const expertSummaries: Record<string, string[]> = {};
    allResults.forEach((r) => {
      if (r.status === "fulfilled") {
        if (r.value.kind === "persona") {
          personaSummaries[r.value.id] = r.value.summary;
        } else {
          expertSummaries[r.value.id] = r.value.summary;
        }
      }
    });

    const PptxGenJS = (await import("pptxgenjs")).default;
    const prs = new PptxGenJS();
    prs.layout = "LAYOUT_16x9";

    const DARK = "0D1B2A";
    const ACCENT = "E8821A";
    const FONT = "Meiryo";

    // ── Slide 1: 表紙 ──
    const s1 = prs.addSlide();
    s1.background = { color: DARK };
    s1.addText(siteData?.siteName || "Webサイト", {
      x: 0.8,
      y: 1.5,
      w: 8.4,
      fontSize: 36,
      fontFace: FONT,
      color: "FFFFFF",
      bold: true,
    });
    s1.addText("リニューアル分析レポート", {
      x: 0.8,
      y: 2.5,
      w: 8.4,
      fontSize: 20,
      fontFace: FONT,
      color: ACCENT,
      bold: true,
    });
    s1.addText(
      `${siteData?.industry || ""}\n${new Date().toLocaleDateString("ja-JP")}`,
      {
        x: 0.8,
        y: 3.5,
        w: 8.4,
        fontSize: 12,
        fontFace: FONT,
        color: "999999",
      }
    );
    s1.addText("Powered by Renewal Advisor / ciraf", {
      x: 0.8,
      y: 4.8,
      w: 8.4,
      fontSize: 10,
      fontFace: FONT,
      color: "666666",
    });

    // ── Slide 2: サイト現状分析 ──
    const s2 = prs.addSlide();
    s2.addText("サイト現状分析", {
      x: 0.5,
      y: 0.3,
      w: 9,
      fontSize: 24,
      fontFace: FONT,
      color: DARK,
      bold: true,
    });

    // 左カラム: 基本情報
    s2.addText(siteData?.siteName || "", {
      x: 0.5,
      y: 1.1,
      w: 5.3,
      fontSize: 16,
      fontFace: FONT,
      color: DARK,
      bold: true,
    });
    s2.addText(siteData?.industry || "", {
      x: 0.5,
      y: 1.5,
      w: 5.3,
      fontSize: 11,
      fontFace: FONT,
      color: ACCENT,
      bold: true,
    });
    s2.addText(siteData?.url || "", {
      x: 0.5,
      y: 1.8,
      w: 5.3,
      fontSize: 10,
      fontFace: FONT,
      color: "666666",
    });

    const leftInfo = [
      `【概要】\n${siteData?.description || ""}`,
      `【技術スタック】\n${(siteData?.techStack || []).join(" / ")}`,
      `【ページ構成】\n${siteData?.pageStructure || ""}`,
    ].join("\n\n");
    s2.addText(leftInfo, {
      x: 0.5,
      y: 2.1,
      w: 5.3,
      h: 2.9,
      fontSize: 10,
      fontFace: FONT,
      color: "333333",
      valign: "top",
    });

    // 右カラム: PageSpeed / デザイン傾向 / SEO
    s2.addText(
      `PageSpeed 推定スコア\n${siteData?.speedEstimate ?? "N/A"} / 100`,
      {
        x: 6.0,
        y: 1.1,
        w: 3.6,
        h: 0.9,
        fontSize: 12,
        fontFace: FONT,
        color: DARK,
        bold: true,
        fill: { color: "F4F4F4" },
        valign: "middle",
        align: "center",
      }
    );
    s2.addText(
      `【デザイン傾向】\n${(siteData?.designTone || []).join(" / ") || "—"}`,
      {
        x: 6.0,
        y: 2.1,
        w: 3.6,
        h: 1.1,
        fontSize: 10,
        fontFace: FONT,
        color: "333333",
        fill: { color: "F4F4F4" },
        valign: "top",
        margin: 8,
      }
    );
    s2.addText(`【SEO状況】\n${siteData?.seoStatus || ""}`, {
      x: 6.0,
      y: 3.3,
      w: 3.6,
      h: 1.7,
      fontSize: 10,
      fontFace: FONT,
      color: "333333",
      fill: { color: "F4F4F4" },
      valign: "top",
      margin: 8,
    });

    // ── Slides 3-8: 各専門家の提言 ──
    for (const eid of EXPERT_ORDER) {
      const meta = EXPERT_META[eid];
      const report = expertReports?.[eid];
      const slide = prs.addSlide();

      // ヘッダー
      slide.addShape("rect" as PptxGenJS.ShapeType, {
        x: 0,
        y: 0,
        w: 10,
        h: 0.9,
        fill: { color: "F4F4F4" },
      });
      slide.addText(`${meta.name}  |  ${meta.role}`, {
        x: 0.5,
        y: 0.15,
        w: 9,
        fontSize: 16,
        fontFace: FONT,
        color: meta.color.replace("#", ""),
        bold: true,
      });

      // 問題点
      slide.addText("現状の問題点", {
        x: 0.5,
        y: 1.2,
        w: 4.3,
        fontSize: 14,
        fontFace: FONT,
        color: DARK,
        bold: true,
      });
      const issues = (report?.issues || ["分析結果なし"]).map(
        (t: string, i: number) => `${i + 1}. ${t}`
      );
      slide.addText(issues.join("\n\n"), {
        x: 0.5,
        y: 1.8,
        w: 4.3,
        h: 3,
        fontSize: 10,
        fontFace: FONT,
        color: "333333",
        valign: "top",
      });

      // 提言
      slide.addText("リニューアルへの提言", {
        x: 5.3,
        y: 1.2,
        w: 4.3,
        fontSize: 14,
        fontFace: FONT,
        color: ACCENT,
        bold: true,
      });
      const recs = (report?.recommendations || ["提言なし"]).map(
        (t: string, i: number) => `${i + 1}. ${t}`
      );
      slide.addText(recs.join("\n\n"), {
        x: 5.3,
        y: 1.8,
        w: 4.3,
        h: 3,
        fontSize: 10,
        fontFace: FONT,
        color: "333333",
        valign: "top",
      });
    }

    // ── 専門家との会話サマリー（会話があった専門家のみ） ──
    for (const eid of expertsWithChat) {
      const meta = EXPERT_META[eid];
      const history = expertChatHistory?.[eid] || [];
      const summary = expertSummaries[eid] || [];

      const sc = prs.addSlide();

      // タイトル + サブタイトル
      sc.addText(`${meta.name} との会話サマリー`, {
        x: 0.5,
        y: 0.3,
        w: 9,
        fontSize: 22,
        fontFace: FONT,
        color: DARK,
        bold: true,
      });
      sc.addText(meta.role, {
        x: 0.5,
        y: 0.95,
        w: 9,
        fontSize: 12,
        fontFace: FONT,
        color: ACCENT,
        bold: true,
      });

      // 左カラム: 抽出したポイント
      sc.addText("会話から抽出したポイント", {
        x: 0.5,
        y: 1.5,
        w: 4.3,
        fontSize: 14,
        fontFace: FONT,
        color: DARK,
        bold: true,
      });
      const pointText =
        summary.length > 0
          ? summary
              .map((s: string, i: number) => `${i + 1}. ${s}`)
              .join("\n\n")
          : "要約情報なし";
      sc.addText(pointText, {
        x: 0.5,
        y: 2.05,
        w: 4.3,
        h: 2.9,
        fontSize: 11,
        fontFace: FONT,
        color: "333333",
        valign: "top",
      });

      // 右カラム: 会話抜粋 (最大3往復)
      sc.addText("会話の抜粋", {
        x: 5.2,
        y: 1.5,
        w: 4.4,
        fontSize: 14,
        fontFace: FONT,
        color: DARK,
        bold: true,
      });

      const pairs: { q: string; a: string }[] = [];
      for (let i = 0; i < history.length && pairs.length < 3; i++) {
        if (history[i].role === "user") {
          const nextA = history[i + 1];
          pairs.push({
            q: history[i].content,
            a: nextA && nextA.role === "assistant" ? nextA.content : "",
          });
        }
      }

      const blockH = 1.0;
      pairs.forEach((p, idx) => {
        const top = 2.05 + idx * (blockH + 0.08);
        // Q
        sc.addText(`Q: ${p.q}`, {
          x: 5.2,
          y: top,
          w: 4.4,
          h: 0.42,
          fontSize: 9,
          fontFace: FONT,
          color: "333333",
          fill: { color: "F4F4F4" },
          margin: 4,
          valign: "top",
        });
        // A
        if (p.a) {
          sc.addText(`A: ${p.a}`, {
            x: 5.2,
            y: top + 0.46,
            w: 4.4,
            h: 0.5,
            fontSize: 9,
            fontFace: FONT,
            color: "333333",
            fill: { color: "FFFFFF" },
            line: { color: "E0E0E0", width: 0.5 },
            margin: 4,
            valign: "top",
          });
        }
      });
    }

    // ── Slide 9: ペルソナ ──
    if (personas && personas.length > 0) {
      // ペルソナ概要スライド
      const sOv = prs.addSlide();
      sOv.addText("ターゲットペルソナ", {
        x: 0.5,
        y: 0.3,
        w: 9,
        fontSize: 24,
        fontFace: FONT,
        color: DARK,
        bold: true,
      });
      const cols = personas.length;
      const colW = 9 / cols;
      personas.forEach((p, idx) => {
        const x = 0.5 + idx * colW;
        sOv.addText(p.name, {
          x,
          y: 1.2,
          w: colW - 0.2,
          fontSize: 16,
          fontFace: FONT,
          color: DARK,
          bold: true,
        });
        sOv.addText(`${p.age}歳 / ${p.job}`, {
          x,
          y: 1.7,
          w: colW - 0.2,
          fontSize: 10,
          fontFace: FONT,
          color: ACCENT,
          bold: true,
        });
        sOv.addText(p.description, {
          x,
          y: 2.1,
          w: colW - 0.2,
          h: 1.4,
          fontSize: 10,
          fontFace: FONT,
          color: "333333",
          valign: "top",
        });
        if (p.needs && p.needs.length > 0) {
          sOv.addText(`ニーズ: ${p.needs.join(" / ")}`, {
            x,
            y: 3.6,
            w: colW - 0.2,
            fontSize: 9,
            fontFace: FONT,
            color: "666666",
          });
        }
        if (p.concern) {
          sOv.addText(`懸念: ${p.concern}`, {
            x,
            y: 4.1,
            w: colW - 0.2,
            fontSize: 9,
            fontFace: FONT,
            color: "666666",
          });
        }
      });

      // ペルソナごとの会話サマリースライド
      for (const p of personas) {
        const summary = personaSummaries[p.id] || [];
        if (summary.length === 0) continue;
        const sp = prs.addSlide();
        sp.addText(`${p.name} の要望・懸念`, {
          x: 0.5,
          y: 0.3,
          w: 9,
          fontSize: 22,
          fontFace: FONT,
          color: DARK,
          bold: true,
        });
        sp.addText(`${p.age}歳 / ${p.job}`, {
          x: 0.5,
          y: 1.0,
          w: 9,
          fontSize: 12,
          fontFace: FONT,
          color: ACCENT,
        });
        sp.addText("会話から抽出した主なポイント", {
          x: 0.5,
          y: 1.6,
          w: 9,
          fontSize: 13,
          fontFace: FONT,
          color: DARK,
          bold: true,
        });
        const lines = summary.map(
          (t: string, i: number) => `${i + 1}. ${t}`
        );
        sp.addText(lines.join("\n\n"), {
          x: 0.5,
          y: 2.2,
          w: 9,
          h: 3,
          fontSize: 11,
          fontFace: FONT,
          color: "333333",
          valign: "top",
        });
      }
    } else {
      const s9 = prs.addSlide();
      s9.addText("ターゲットペルソナ", {
        x: 0.5,
        y: 0.3,
        w: 9,
        fontSize: 24,
        fontFace: FONT,
        color: DARK,
        bold: true,
      });
      s9.addText("ペルソナ情報なし", {
        x: 0.5,
        y: 1.2,
        w: 9,
        h: 3.5,
        fontSize: 12,
        fontFace: FONT,
        color: "333333",
        valign: "top",
      });
    }

    // ── Slide 12: まとめ ──
    const s12 = prs.addSlide();
    s12.background = { color: DARK };
    s12.addText("ありがとうございました", {
      x: 0.8,
      y: 1.8,
      w: 8.4,
      fontSize: 32,
      fontFace: FONT,
      color: "FFFFFF",
      bold: true,
      align: "center",
    });
    s12.addText(
      "本分析レポートをもとに、具体的なリニューアル計画を策定いたします。",
      {
        x: 0.8,
        y: 3,
        w: 8.4,
        fontSize: 14,
        fontFace: FONT,
        color: "999999",
        align: "center",
      }
    );
    s12.addText("Powered by Renewal Advisor / ciraf", {
      x: 0.8,
      y: 4.5,
      w: 8.4,
      fontSize: 10,
      fontFace: FONT,
      color: "666666",
      align: "center",
    });

    // ── バイナリ出力 ──
    const buf = await prs.write({ outputType: "nodebuffer" });

    return new NextResponse(buf as unknown as BodyInit, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition":
          'attachment; filename="renewal-report.pptx"',
      },
    });
  } catch (error) {
    console.error("[renewal/pptx]", error);
    return NextResponse.json(
      { error: "PPTX生成に失敗しました" },
      { status: 500 }
    );
  }
}
