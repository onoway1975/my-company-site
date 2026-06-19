import Anthropic from "@anthropic-ai/sdk";
import type { SearchConditions, JGrantsSubsidy, MatchResult } from "@/types/subsidy";
import { buildOfficialUrl } from "./jgrants";

const MODEL = "claude-sonnet-4-6";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

/** JSONフェンス（```json ... ```）を除去してパース */
function parseJSON<T>(raw: string): T {
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  return JSON.parse(stripped);
}

/** 呼び出しA: ユーザー入力 → 検索条件JSON抽出 */
export async function extractSearchConditions(
  text: string
): Promise<SearchConditions> {
  const client = getClient();

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `あなたは補助金検索の専門家です。以下のユーザー入力から、Jグランツ（デジタル庁）の補助金検索に使う条件をJSON形式で抽出してください。

【ユーザー入力】
${text}

【返却形式（JSONのみ・前置きやMarkdown禁止）】
{
  "keywords": ["キーワード1", "キーワード2"],
  "industry": "業種名 または null",
  "area": "都道府県名 または null",
  "employees": "従業員規模 または null",
  "summary": "入力内容の要約（1文）"
}

ルール:
- keywords は各2文字以上、2〜4個。補助金検索に有効なキーワードを選ぶ
- industry は「情報通信業」「小売業」「製造業」等のJグランツ対応カテゴリ。不明なら null
- area は「東京都」「大阪府」等。不明なら null
- employees は「20名以下」「50名以下」等。不明なら null
- JSONのみを返すこと`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Claude returned non-text response");
  }

  return parseJSON<SearchConditions>(content.text);
}

/** 呼び出しB: 補助金リスト + ユーザー入力 → マッチング判定 */
export async function matchSubsidies(
  subsidies: JGrantsSubsidy[],
  userText: string
): Promise<MatchResult[]> {
  if (subsidies.length === 0) return [];

  const client = getClient();

  const subsidyList = subsidies.map((s) => ({
    id: s.id,
    title: s.title,
    acceptance_end_datetime: s.acceptance_end_datetime,
    subsidy_max_limit: s.subsidy_max_limit,
  }));

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `あなたは補助金マッチングの専門家です。以下のユーザーの事業内容と、Jグランツから取得した公募中補助金リストを照合し、マッチ度の高い候補をJSON形式で返してください。

【ユーザーの事業内容】
${userText}

【公募中補助金リスト】
${JSON.stringify(subsidyList, null, 2)}

【返却形式（JSONのみ・前置きやMarkdown禁止）】
{
  "matches": [
    {
      "subsidy_id": "補助金ID",
      "title": "補助金名",
      "match_score": 85,
      "reasons": ["マッチ理由1", "マッチ理由2"],
      "cautions": ["注意点1"],
      "subsidy_max_limit": 2000000,
      "acceptance_end_datetime": "2026-08-31"
    }
  ]
}

ルール:
- match_score は 0〜100（事業内容との合致度）
- reasons は2〜3個、日本語で簡潔に
- cautions は0〜2個、申請時の注意点や条件
- match_score 降順で最大5件
- 明らかにマッチしない補助金は含めない
- 該当なしの場合は "matches": [] を返す
- subsidy_max_limit, acceptance_end_datetime は元データをそのまま使う
- JSONのみを返すこと`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Claude returned non-text response");
  }

  const parsed = parseJSON<{ matches: MatchResult[] }>(content.text);

  // official_url を付与して返却
  return parsed.matches.map((m) => ({
    ...m,
    official_url: buildOfficialUrl(m.subsidy_id),
  }));
}
