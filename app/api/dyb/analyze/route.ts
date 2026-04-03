import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { nickname, content } = await req.json()

    if (!nickname || !content) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 })
    }
    if (content.length > 100) {
      return NextResponse.json({ error: '100文字以内で入力してください' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `日本語ラップの韻分析の専門家として、以下のパンチラインの韻を分析してください。

パンチライン:「${content}」

【韻の定義】
日本語ラップの韻は「母音が一致または近似する単語・フレーズのグループ」です。
例：「展開だな」「天才肌」「玄界灘」→ 母音が "e-a-i-a-a" で一致 → 同じグループ
例：「金貸しつける」「何か信じろ」→ 母音 "i-a-i-u-e-u" / "a-i-i-i-o" は不一致 → 別グループ
例：「前人未到」「前自民党総裁」「小泉」→ 末尾の母音 "o" 系で一致 → 同じグループ

【重要なルール】
1. 韻を踏んでいる単語・フレーズのみをwordsに含める（韻を踏んでいない部分は含めない）
2. wordsの各要素は元テキストに含まれる文字列をそのまま使用
3. 同じ韻のグループはひとつのrhyme_groupにまとめる（複数単語も可）
4. 韻が弱い・確信が持てない場合はグループに含めない
5. 母音の一致度が高いほど良い韻

以下のJSON形式のみで返答してください。他のテキストは一切含めないでください:

{
  "rhyme_groups": [
    {
      "color_index": 0,
      "words": ["韻を踏んでいる単語A", "単語B", "単語C"]
    }
  ],
  "rhyme_score": 30,
  "length_bonus": 10,
  "total_score": 40,
  "comment": "韻の解説（30字以内、具体的に）"
}

スコア計算:
- rhyme_score: 強い韻ペア×20点 + 普通の韻ペア×10点（最大80点）
- length_bonus: 80文字以上→20点、60文字以上→10点、それ以外→0点
- total_score: rhyme_score + length_bonus
- 韻がない場合: rhyme_groups=[], rhyme_score=0`,
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const clean = responseText.replace(/```json|```/g, '').trim()
    const analysis = JSON.parse(clean)

    const { data, error } = await supabaseAdmin
      .from('punchlines')
      .insert({
        nickname,
        content,
        score: analysis.total_score,
        rhyme_analysis: analysis,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'DBへの保存に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data, analysis })
  } catch (err) {
    console.error('Analyze error:', err)
    return NextResponse.json({ error: '分析に失敗しました' }, { status: 500 })
  }
}
