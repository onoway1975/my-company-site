import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "FUJI ROCK '26 7.25 SAT タイムテーブル | ciraf",
  description:
    'フジロック2日目（7.25 SAT）の出演アーティストを、ステージ別・時間順・マイプランで確認。★でお気に入り登録、時間被り＆ステージ間の移動時間もチェックできます。',
  openGraph: {
    title: "FUJI ROCK '26 7.25 SAT タイムテーブル",
    description:
      'ステージ別・時間順・マイプランで見られる、フジロック土曜のタイムテーブル。時間被りと移動時間も自動チェック。',
    images: ['/fujirock/hero.webp'],
  },
};

export default function FujiRockLayout({ children }: { children: ReactNode }) {
  return children;
}
