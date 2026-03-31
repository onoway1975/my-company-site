import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import MenuCardClient from './MenuCardClient'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Menu Card — スプレッドシートをメニューに',
  description: 'Googleスプレッドシートをそのままカフェメニューページに変換するデモ。',
  robots: { index: false, follow: false },
}

export default function MenuCardPage() {
  return (
    <div className={playfair.variable}>
      <MenuCardClient />
    </div>
  )
}
