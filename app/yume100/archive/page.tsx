import Image from "next/image";
import Link from "next/link";
import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "@/lib/supabase";

export const revalidate = 0;

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function parseProposal(text: string): { title: string; body: string } | null {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    if (parsed.title && parsed.body) return parsed;
    return null;
  } catch {
    return null;
  }
}

async function generateProposal(dream: { id: string; content: string }) {
  const prompt = `以下は100人が良いなと思った未来の夢です。
この夢を1枚の宣言文として仕上げてください。
・タイトル（20文字以内）
・本文（150文字以内）：なぜこの未来が大切か、どんな社会を目指しているかを力強く書く
JSON形式のみ返す：{ "title": "...", "body": "..." }
夢のテキスト：${dream.content}`;

  const response = await claude.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const proposalText =
    response.content[0]?.type === "text" ? response.content[0].text : "";

  await supabaseAdmin
    .from("dreams")
    .update({
      proposal_text: proposalText,
      proposal_generated_at: new Date().toISOString(),
    })
    .eq("id", dream.id);

  return proposalText;
}

async function getArchivedDreams() {
  const { data, error } = await supabaseAdmin
    .from("dreams")
    .select("*")
    .gte("finger_count", 100)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("archive fetch error:", error);
    return [];
  }

  const dreams = data || [];

  // proposal 未生成の dream があれば生成
  for (const dream of dreams) {
    if (!dream.proposal_text) {
      try {
        dream.proposal_text = await generateProposal(dream);
        dream.proposal_generated_at = new Date().toISOString();
      } catch (err) {
        console.error("proposal generation error:", err);
      }
    }
  }

  return dreams;
}

export default async function YumeArchivePage() {
  const dreams = await getArchivedDreams();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFDF7" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#111]">
            宣言書アーカイブ
          </h1>
          <p className="text-sm text-[#767676] mt-2">
            100人の「この指止まれ」が集まった夢たち
          </p>
        </header>

        {dreams.length === 0 ? (
          <p className="text-center text-[#767676] py-20">
            まだ達成された夢はありません。
          </p>
        ) : (
          <div className="space-y-10">
            {dreams.map((dream) => {
              const proposal = parseProposal(dream.proposal_text || "");
              return (
                <article
                  key={dream.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e2e2e2]"
                >
                  <Image
                    src={dream.image_url}
                    alt={dream.content}
                    width={800}
                    height={600}
                    className="w-full"
                  />
                  <div className="p-6">
                    <p className="text-base font-bold text-[#111] mb-3">
                      {dream.content}
                    </p>
                    {proposal ? (
                      <div className="bg-[#FFFDF7] rounded-xl p-4 border border-[#F5A623]/20">
                        <p className="text-[10px] tracking-[0.2em] text-[#F5A623] uppercase mb-2 font-bold">
                          宣言書
                        </p>
                        <p className="text-base font-bold text-[#111] mb-1">
                          {proposal.title}
                        </p>
                        <p className="text-sm text-[#111] leading-relaxed">
                          {proposal.body}
                        </p>
                      </div>
                    ) : dream.proposal_text ? (
                      <div className="bg-[#FFFDF7] rounded-xl p-4 border border-[#F5A623]/20">
                        <p className="text-[10px] tracking-[0.2em] text-[#F5A623] uppercase mb-2 font-bold">
                          宣言書
                        </p>
                        <p className="text-sm text-[#111] leading-relaxed whitespace-pre-wrap">
                          {dream.proposal_text}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-[#FFFDF7] rounded-xl p-4 border border-[#e2e2e2]">
                        <p className="text-sm text-[#767676] text-center">
                          宣言書の生成に失敗しました
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4 text-xs text-[#767676]">
                      <span>
                        ☝️ {dream.finger_count}人が賛同
                      </span>
                      {dream.proposal_generated_at && (
                        <time>
                          {new Date(dream.proposal_generated_at).toLocaleDateString(
                            "ja-JP"
                          )}
                        </time>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/yume100/"
            className="inline-block rounded-full px-8 py-3.5 font-bold text-base text-[#F5A623] bg-white hover:bg-[#F5A623] hover:text-white transition-colors duration-200"
            style={{ border: "1.5px solid #F5A623" }}
          >
            &larr; タイムラインに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
