import type { BeltColor, ThreadColor, FontInfo, FontId } from './types';

export const BELT_COLORS: BeltColor[] = [
  { id: 'white',  name: 'White',  ja: '白', hex: '#f0ead8' },
  { id: 'blue',   name: 'Blue',   ja: '青', hex: '#1d3a7a' },
  { id: 'purple', name: 'Purple', ja: '紫', hex: '#3d1f4f' },
  { id: 'brown',  name: 'Brown',  ja: '茶', hex: '#3d2418' },
  { id: 'black',  name: 'Black',  ja: '黒', hex: '#111111' },
];

export const THREAD_COLORS: ThreadColor[] = [
  { id: 'gold',   name: '金', hex: '#c9a253' },
  { id: 'silver', name: '銀', hex: '#bcbcbc' },
  { id: 'white',  name: '白', hex: '#f4efe6' },
  { id: 'black',  name: '黒', hex: '#111111' },
  { id: 'red',    name: '朱', hex: '#c8341f' },
  { id: 'navy',   name: '紺', hex: '#1d3a7a' },
];

export const FONTS: Record<FontId, FontInfo> = {
  gyosho: { name: 'Gyosho', ja: '行書' },
  kaisho: { name: 'Kaisho', ja: '楷書' },
  gothic: { name: 'Gothic', ja: 'ゴシック' },
};

export const PRICE_BELT = 4800;
export const PRICE_PER_CHAR = 200;
export const MAX_CHARS = 20;

export const fontCssMap: Record<FontId, string> = {
  gyosho: '"Yuji Syuku", "Noto Serif JP", serif',
  kaisho: '"Klee One", "Noto Serif JP", serif',
  gothic: '"Noto Sans JP", sans-serif',
};

export const fontWeightMap: Record<FontId, number> = {
  gyosho: 400,
  kaisho: 600,
  gothic: 700,
};
