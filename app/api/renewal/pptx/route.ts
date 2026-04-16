import { NextRequest, NextResponse } from "next/server";
import type PptxGenJS from "pptxgenjs";

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
    const { siteData, expertReports, persona, pageStructure, kpi } =
      await req.json();

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
    s1.addText("リニューアル提案書", {
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
    const info = [
      `URL: ${siteData?.url || ""}`,
      `業種: ${siteData?.industry || ""}`,
      `概要: ${siteData?.description || ""}`,
      `技術スタック: ${(siteData?.techStack || []).join(", ")}`,
      `ページ構成: ${siteData?.pageStructure || ""}`,
    ].join("\n\n");
    s2.addText(info, {
      x: 0.5,
      y: 1.2,
      w: 5,
      h: 3.5,
      fontSize: 11,
      fontFace: FONT,
      color: "333333",
      valign: "top",
    });
    s2.addText(
      `PageSpeed\n推定スコア: ${siteData?.speedEstimate ?? "N/A"}\n\nSEO状況:\n${siteData?.seoStatus || ""}`,
      {
        x: 5.8,
        y: 1.2,
        w: 3.8,
        h: 3.5,
        fontSize: 11,
        fontFace: FONT,
        color: "333333",
        valign: "top",
      }
    );

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

    // ── Slide 9: ペルソナ ──
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
    s9.addText(persona || "ペルソナ情報なし", {
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 3.5,
      fontSize: 12,
      fontFace: FONT,
      color: "333333",
      valign: "top",
    });

    // ── Slide 10: リニューアル提案構成 ──
    const s10 = prs.addSlide();
    s10.addText("リニューアル提案構成", {
      x: 0.5,
      y: 0.3,
      w: 9,
      fontSize: 24,
      fontFace: FONT,
      color: DARK,
      bold: true,
    });
    s10.addText(pageStructure || "提案構成情報なし", {
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 3.5,
      fontSize: 12,
      fontFace: FONT,
      color: "333333",
      valign: "top",
    });

    // ── Slide 11: KPI設計 ──
    const s11 = prs.addSlide();
    s11.addText("KPI設計", {
      x: 0.5,
      y: 0.3,
      w: 9,
      fontSize: 24,
      fontFace: FONT,
      color: DARK,
      bold: true,
    });
    s11.addText(kpi || "KPI情報なし", {
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 3.5,
      fontSize: 12,
      fontFace: FONT,
      color: "333333",
      valign: "top",
    });

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
      "本提案書をもとに、具体的なリニューアル計画を策定いたします。",
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
          'attachment; filename="renewal-proposal.pptx"',
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
