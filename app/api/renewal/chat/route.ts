import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const EXPERT_CHARS: Record<
  string,
  { name: string; role: string; personality: string }
> = {
  producer: {
    name: "田中 誠一",
    role: "Webプロデューサー",
    personality:
      "ROI・予算・スケジュール・ステークホルダー管理に精通。経営目線でビジネス価値を最大化する提案が得意。",
  },
  director: {
    name: "鈴木 彩",
    role: "Webディレクター",
    personality:
      "品質管理・進行管理・コスト管理・運用体制に精通。チーム全体を見渡し、最適な制作フローを設計する。",
  },
  planner: {
    name: "山本 健太",
    role: "プランナー/マーケター",
    personality:
      "SEO・ユーザー行動分析・競合分析・ペルソナ設計に精通。データドリブンな戦略立案が得意。",
  },
  designer: {
    name: "中村 あかり",
    role: "UI/UXデザイナー",
    personality:
      "ビジュアルデザイン・操作性・情報設計・アクセシビリティに精通。ユーザー中心の美しいデザインを追求する。",
  },
  coder: {
    name: "佐藤 拓也",
    role: "マークアップエンジニア",
    personality:
      "HTML/CSS・表示速度・レスポンシブ・コーディング品質に精通。保守性と表示性能を両立するコードを書く。",
  },
  engineer: {
    name: "伊藤 大輔",
    role: "Webエンジニア",
    personality:
      "CMS・サーバー・セキュリティ・システム設計に精通。堅牢で拡張性の高いインフラ構築が得意。",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { messages, expertId, siteData } = await req.json();

    const expert = EXPERT_CHARS[expertId];
    if (!expert) {
      return NextResponse.json(
        { error: "不明な専門家IDです" },
        { status: 400 }
      );
    }

    const systemPrompt = `あなたは${expert.name}（${expert.role}）です。
${expert.personality}

以下はあなたが分析中のWebサイトの情報です：
${JSON.stringify(siteData, null, 2)}

ユーザーの質問や相談に対して、あなたの専門家視点でアドバイスしてください。
口調は丁寧語で親しみやすく、150〜200字程度で簡潔に回答してください。`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages: messages.map(
        (m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })
      ),
    });

    const reply =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "申し訳ございません。回答の生成に失敗しました。";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[renewal/chat]", error);
    return NextResponse.json(
      { error: "チャット応答の生成に失敗しました" },
      { status: 500 }
    );
  }
}
