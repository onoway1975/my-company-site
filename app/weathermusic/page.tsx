import { Metadata } from 'next'
import WeatherMusicWrapper from './WeatherMusicWrapper'

const BASE_URL = 'https://ciraf.jp'

export const metadata: Metadata = {
  title:       'Weather Music | ciraf',
  description: '今日の天気に合った、今日だけのプレイリスト。雨の日も、晴れの日も、その日の空気にぴったりの音楽をお届けします。',
  keywords:    ['天気', 'プレイリスト', '音楽', 'Apple Music', 'BGM', '天気予報', '雨の日', '晴れの日', 'weather music', 'playlist'],
  authors:     [{ name: 'ciraf', url: BASE_URL }],
  creator:     'ciraf',
  publisher:   'ciraf',

  metadataBase: new URL(BASE_URL),

  alternates: {
    canonical: '/weathermusic',
  },

  openGraph: {
    type:        'website',
    url:         `${BASE_URL}/weathermusic`,
    title:       'Weather Music | 今日の天気に合ったプレイリスト',
    description: '今日の天気に合った、今日だけのプレイリスト。雨の日も、晴れの日も、その日の空気にぴったりの音楽をお届けします。',
    siteName:    'ciraf',
    locale:      'ja_JP',
    images: [
      {
        url:    '/weathermusic/og-image.png',
        width:  1200,
        height: 630,
        alt:    'Weather Music — 今日の天気に合ったプレイリスト',
      },
    ],
  },

  twitter: {
    card:        'summary_large_image',
    title:       'Weather Music | 今日の天気に合ったプレイリスト',
    description: '今日の天気に合った、今日だけのプレイリスト。Apple Musicで聴けます。',
    images:      ['/weathermusic/og-image.png'],
    creator:     '@ciraf_jp',
  },

  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:             true,
      follow:            true,
      'max-image-preview':   'large',
      'max-snippet':         -1,
    },
  },
}

export default function WeatherMusicPage() {
  return (
    <>
      {/* 構造化データ (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type':    'WebApplication',
            name:       'Weather Music',
            url:        `${BASE_URL}/weathermusic`,
            description: '今日の天気に合った、今日だけのプレイリストを自動生成するサービス。',
            applicationCategory: 'MusicApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price:   '0',
              priceCurrency: 'JPY',
            },
            publisher: {
              '@type': 'Organization',
              name:    'ciraf',
              url:     BASE_URL,
            },
          }),
        }}
      />
      <WeatherMusicWrapper />
    </>
  )
}
