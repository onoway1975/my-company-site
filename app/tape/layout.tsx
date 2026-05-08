import './styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tape Radio | ciraf inc.',
  description: 'iTunes Search APIで検索した曲を、テープの質感で聴くWebプレイヤー。Web Audio APIでカセットテープのロウファイサウンドを再現。',
  alternates: {
    canonical: 'https://ciraf.jp/tape/',
  },
  openGraph: {
    title: 'Tape Radio | Lo-Fi Cassette Player',
    description: 'iTunesの曲も自分の音源も、ブラウザでテープの音にして聴ける。Web Audio APIで作ったロウファイ・プレイヤー。',
    url: 'https://ciraf.jp/tape/',
    siteName: 'ciraf inc.',
    images: [
      {
        url: 'https://ciraf.jp/tape/ogp.jpg',
        width: 1200,
        height: 630,
        alt: 'Tape Radio - Lo-Fi Cassette Player for iTunes & Your Music',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tape Radio | Lo-Fi Cassette Player',
    description: 'iTunesの曲も自分の音源も、ブラウザでテープの音にして聴ける。',
    images: ['https://ciraf.jp/tape/ogp.jpg'],
  },
};

export default function TapeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
