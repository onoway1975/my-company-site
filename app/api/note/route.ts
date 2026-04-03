import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(
      'https://note.com/api/v2/creators/ciraf_inc/contents?kind=note&page=1',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch note API' }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
