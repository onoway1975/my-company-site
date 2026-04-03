import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { punchline_id, client_id } = await req.json()

    if (!punchline_id || !client_id) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 })
    }

    // すでにいいね済みか確認
    const { data: existing } = await supabaseAdmin
      .from('likes')
      .select('id')
      .eq('punchline_id', punchline_id)
      .eq('client_id', client_id)
      .single()

    if (existing) {
      // いいね取り消し
      await supabaseAdmin
        .from('likes')
        .delete()
        .eq('punchline_id', punchline_id)
        .eq('client_id', client_id)

      await supabaseAdmin.rpc('decrement_like_count', { punchline_id })

      return NextResponse.json({ liked: false })
    } else {
      // いいね追加
      await supabaseAdmin
        .from('likes')
        .insert({ punchline_id, client_id })

      await supabaseAdmin.rpc('increment_like_count', { punchline_id })

      return NextResponse.json({ liked: true })
    }
  } catch (err) {
    console.error('Like error:', err)
    return NextResponse.json({ error: 'いいね処理に失敗しました' }, { status: 500 })
  }
}
