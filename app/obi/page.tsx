import type { Metadata } from 'next';
import ObiApp from './ObiApp';

export const metadata: Metadata = {
  title: 'OBI — 柔術帯刺繍オーダー',
  description:
    '柔術の帯に刺繍を入れて、世界にひとつの帯をつくります。色を選んで、書体を選んで、文字を打ち込むだけ。',
};

export default function ObiPage() {
  return <ObiApp />;
}
