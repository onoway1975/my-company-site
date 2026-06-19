import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/app/yume100/lib/rateLimit";
import { extractSearchConditions, matchSubsidies } from "@/lib/subsidy/claude";
import { searchSubsidies } from "@/lib/subsidy/jgrants";

export async function POST(req: NextRequest) {
  try {
    // レート制限（1日10回/IP）
    const ip = getClientIP(req);
    const limit = await checkRateLimit("subsidy", ip, 10);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "本日の利用上限に達しました。明日またお試しください。" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const text = (body.text ?? "").trim();
    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: "もう少し詳しく入力してください（10文字以上）。" },
        { status: 400 }
      );
    }

    // 1. Claude で検索条件を抽出
    const conditions = await extractSearchConditions(text);
    console.log("[subsidy] extracted conditions:", JSON.stringify(conditions));

    // 2. Jグランツで公募中補助金を検索
    const subsidies = await searchSubsidies(conditions);
    console.log(`[subsidy] found ${subsidies.length} subsidies from jGrants`);

    // 3. Claude でマッチング判定
    const matches = await matchSubsidies(subsidies, text);
    console.log(`[subsidy] matched ${matches.length} subsidies`);

    return NextResponse.json({ matches });
  } catch (e) {
    console.error("[subsidy] match error:", e);
    return NextResponse.json(
      { error: "処理中にエラーが発生しました。しばらくしてから再度お試しください。" },
      { status: 500 }
    );
  }
}
