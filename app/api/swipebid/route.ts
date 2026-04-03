import { NextRequest, NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'

// ── 都道府県 → LG_Code ──────────────────────────────────────────────
const PREF_CODE: Record<string, string> = {
  '北海道': '01', '青森県': '02', '岩手県': '03', '宮城県': '04',
  '秋田県': '05', '山形県': '06', '福島県': '07', '茨城県': '08',
  '栃木県': '09', '群馬県': '10', '埼玉県': '11', '千葉県': '12',
  '東京都': '13', '神奈川県': '14', '新潟県': '15', '富山県': '16',
  '石川県': '17', '福井県': '18', '山梨県': '19', '長野県': '20',
  '岐阜県': '21', '静岡県': '22', '愛知県': '23', '三重県': '24',
  '滋賀県': '25', '京都府': '26', '大阪府': '27', '兵庫県': '28',
  '奈良県': '29', '和歌山県': '30', '鳥取県': '31', '島根県': '32',
  '岡山県': '33', '広島県': '34', '山口県': '35', '徳島県': '36',
  '香川県': '37', '愛媛県': '38', '高知県': '39', '福岡県': '40',
  '佐賀県': '41', '長崎県': '42', '熊本県': '43', '大分県': '44',
  '宮崎県': '45', '鹿児島県': '46', '沖縄県': '47',
}

// ── ジャンル推定 ────────────────────────────────────────────────────
function inferGenre(title: string): string {
  if (/ホームページ|Web|ウェブ|サイト|システム|ポータル|アプリ/i.test(title)) return 'web'
  if (/動画|映像|ビデオ|撮影|配信/i.test(title)) return 'video'
  if (/ライティング|コピー|原稿|広報誌|執筆|記事|コンテンツ制作/i.test(title)) return 'writing'
  if (/デザイン|印刷|パンフ|チラシ|ポスター|冊子|グラフィック/i.test(title)) return 'design'
  if (/SNS|Instagram|Twitter|Facebook|広告|プロモーション/i.test(title)) return 'sns'
  return 'other'
}

// ── 残り日数（日本時間） ────────────────────────────────────────────
function calcDaysLeft(deadline: string): number {
  if (!deadline) return -1
  try {
    const jstNow = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })
    )
    jstNow.setHours(0, 0, 0, 0)
    const dl = new Date(deadline.replace(/\//g, '-'))
    return Math.ceil((dl.getTime() - jstNow.getTime()) / 86400000)
  } catch {
    return -1
  }
}

function str(v: unknown): string {
  if (v === null || v === undefined) return ''
  return String(v)
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const keywords = searchParams.get('keywords') || 'ホームページ Web 動画 デザイン'
  const pref     = searchParams.get('pref') || ''

  // URLSearchParams を使わず直接組み立て（日本語をそのまま渡す）
  let url = `http://www.kkj.go.jp/api/?Query=${keywords}&Category=3&Count=20`

  if (pref && pref !== '全国') {
    const code = PREF_CODE[pref]
    if (code) url += `&LG_Code=${code}`
  }

  console.log('[swipebid] fetch URL:', url)

  try {
    const res = await fetch(url, {
      headers: { 'Accept': '*/*' },
      cache: 'no-store',
    })

    if (!res.ok) throw new Error(`KKJ API ${res.status}`)

    const xml = await res.text()
    console.log('[swipebid] raw XML (first 500):', xml.slice(0, 500))

    const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: true })
    const parsed = parser.parse(xml)
    console.log('[swipebid] parsed top-level keys:', Object.keys(parsed))
    console.log('[swipebid] full parsed:', JSON.stringify(parsed, null, 2).slice(0, 2000))

    // <Results><SearchResults><SearchResult>
    const rawResult = parsed?.Results?.SearchResults?.SearchResult ?? null

    console.log('[swipebid] rawResult type:', typeof rawResult, Array.isArray(rawResult), rawResult ? 'found' : 'null')

    if (!rawResult) {
      return NextResponse.json([])
    }

    // 1件のときオブジェクト、複数のとき配列になるので統一
    const items: Record<string, unknown>[] = Array.isArray(rawResult)
      ? rawResult
      : [rawResult]

    console.log('[swipebid] items count:', items.length)
    if (items[0]) console.log('[swipebid] first item keys:', Object.keys(items[0]))

    const bidItems = items.map((item, i) => {
      const title    = str(item.ProjectDescription ?? item.Title ?? '')
      const deadline = str(item.EndDate ?? item.DeadlineDate ?? '')
        .replace(/\//g, '-')

      return {
        id:       str(item.ProjectID ?? item.Id ?? i),
        title,
        org:      str(item.OrganizationName ?? item.InstitutionName ?? ''),
        pref:     str(item.LGName ?? item.PrefectureName ?? ''),
        deadline,
        daysLeft: calcDaysLeft(deadline),
        budget:   str(item.Budget ?? item.BudgetAmount ?? ''),
        type:     str(item.ProcedureType ?? item.NoticeType ?? ''),
        genre:    inferGenre(title),
        url:      str(item.ProjectURL ?? item.DetailUrl ?? item.URL ?? ''),
      }
    })

    return NextResponse.json(bidItems)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[swipebid] error:', msg)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
