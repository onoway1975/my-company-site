import './styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tape Radio | ciraf inc.',
  description: 'iTunes Search APIで検索した曲を、テープの質感で聴くWebプレイヤー。',
  openGraph: {
    title: 'Tape Radio',
    description: 'Web Audio API でテープの質感を取り戻す。',
    images: ['/tape/ogp.jpg'],
  },
};

export default function TapeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
