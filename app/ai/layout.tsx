import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: '制作現場のAI活用支援｜シラフ株式会社',
  description:
    'Web・映像制作20年のプロデューサーが、AI活用を一緒に考えます。提案用デモサイト制作・受託制作・内製化アドバイザリー。東京・シラフ株式会社。',
  openGraph: {
    title: '制作現場のAI活用支援｜シラフ株式会社',
    description:
      'Web・映像制作20年のプロデューサーが、AI活用を一緒に考えます。提案用デモサイト制作・受託制作・内製化アドバイザリー。東京・シラフ株式会社。',
  },
}

export default function AiLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
