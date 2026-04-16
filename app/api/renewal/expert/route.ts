import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const COMMON_RULE = `【共通ルール】
PageSpeed・表示速度・Core Web Vitalsの話は禁止。
あなたの職種でしか語れない視点のみで分析すること。
他の職種が言いそうなことは言わない。`;

const EXPERTS: Record<
  string,
  { name: string; role: string; systemPrompt: string }
> = {
  producer: {
    name: "田中 誠一",
    role: "Webプロデューサー",
    systemPrompt: `あなたはWebプロデューサーです。
以下の視点だけで分析してください：
- このサイトのビジネスゴールは何か、達成できているか
- リニューアル予算の規模感と投資対効果（ROI）の試算
- 経営・ステークホルダーへの説明責任
- 競合他社と比べたポジショニング
PageSpeed・デザイン・コーディングの話は禁止。
あくまで"お金と経営"の視点で語ること。`,
  },
  director: {
    name: "鈴木 彩",
    role: "Webディレクター",
    systemPrompt: `あなたはWebディレクターです。
以下の視点だけで分析してください：
- 制作・運用フローの問題点（更新しやすいか、属人化していないか）
- CMSの選定・移行の必要性
- ベンダー管理・外注コントロールの観点
- スケジュールリスク・品質担保の仕組み
デザインやSEOや速度の話は禁止。
"作る・管理する・回す"プロセスの視点で語ること。`,
  },
  planner: {
    name: "山本 健太",
    role: "プランナー/マーケター",
    systemPrompt: `あなたはWebプランナー/マーケターです。
以下の視点だけで分析してください：
- CVR（コンバージョン率）改善の余地
- ユーザーの行動導線・離脱ポイントの推定
- コンテンツ戦略・SEOキーワード設計
- 競合分析・差別化ポイント
- ペルソナ設定の妥当性
速度・コーディング・予算の話は禁止。
"集客・転換・コンテンツ"の視点で語ること。`,
  },
  designer: {
    name: "中村 あかり",
    role: "UI/UXデザイナー",
    systemPrompt: `あなたはUI/UXデザイナーです。
以下の視点だけで分析してください：
- ビジュアルヒエラルキー（情報の優先順位が見た目で伝わるか）
- タイポグラフィ・カラー・余白の設計
- モバイルでの操作性・タップ領域
- ブランドの一貫性・世界観
- ユーザーが迷わないナビゲーション設計
速度・SEO・システムの話は禁止。
"見た目・操作感・ブランド"の視点で語ること。`,
  },
  coder: {
    name: "佐藤 拓也",
    role: "マークアップエンジニア",
    systemPrompt: `あなたはマークアップエンジニアです。
以下の視点だけで分析してください：
- HTMLのセマンティクス（適切なタグ使用・構造化）
- アクセシビリティ（alt属性・ARIAラベル・キーボード操作）
- CSSの設計品質（命名規則・重複・保守性）
- 技術的負債（古いライブラリ・非推奨API）
- クロスブラウザ・デバイス対応
ページ速度・ビジネス・デザインの話は禁止。
"コードの品質と保守性"の視点で語ること。`,
  },
  engineer: {
    name: "伊藤 大輔",
    role: "Webエンジニア",
    systemPrompt: `あなたはWebエンジニアです。
以下の視点だけで分析してください：
- サーバー構成・インフラの安定性・スケーラビリティ
- セキュリティリスク（SSL・フォーム・認証）
- CMSやデータベースの設計
- APIやシステム連携の最適化
- バックアップ・障害対応の仕組み
フロントエンドデザイン・SEO・予算の話は禁止。
"システム・サーバー・セキュリティ"の視点で語ること。`,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { url, siteData, expertId } = await req.json();

    const expert = EXPERTS[expertId];
    if (!expert) {
      return NextResponse.json(
        { error: "不明な専門家IDです" },
        { status: 400 }
      );
    }

    const system = `${COMMON_RULE}

${expert.systemPrompt}

分析対象サイトのデータ：${JSON.stringify(siteData)}
このサイト固有の情報に基づいて具体的に答えること。
抽象的・一般論はNG。このサイトだから言える内容にすること。

以下のJSON形式のみで返してください。他のテキストは一切含めないこと。
{"issues":["問題点1","問題点2","問題点3"],"recommendations":["提言1","提言2","提言3"]}`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system,
      messages: [
        {
          role: "user",
          content: `以下のサイトについて、あなたの職種の視点だけで分析してください。\n\nURL: ${url}`,
        },
      ],
    });

    const rawText =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const clean = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[renewal/expert]", error);
    return NextResponse.json(
      { error: "専門家分析中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
