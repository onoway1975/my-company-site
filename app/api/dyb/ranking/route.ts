import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sort = searchParams.get('sort') || 'top' // 'top' | 'new'

    const query = supabaseAdmin
      .from('punchlines')
      .select('*')

    const { data, error } = sort === 'top'
      ? await query.order('score', { ascending: false }).limit(50)
      : await query.order('created_at', { ascending: false }).limit(50)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Ranking error:', err)
    return NextResponse.json({ error: 'ランキング取得に失敗しました' }, { status: 500 })
  }
}
