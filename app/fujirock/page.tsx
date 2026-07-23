'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';

/* ──────────────────────────────────────────────────────────────────────────
   FUJI ROCK '26 — 7.25 SAT タイムテーブル
   ciraf.jp/fujirock/
   Claude Design で作った dc-runtime 版を Next.js（App Router / 'use client'）に移植。
   データ・ロジックはオリジナルのまま。表示フォントはプロジェクト標準の LINE Seed。
   共通ヘッダー・フッターは全画面表示のため useEffect で非表示化（fog mail / SNAP STUDIO と同方式）。
   ────────────────────────────────────────────────────────────────────────── */

// 旧 dc props（エディタ用）→ 定数化。ここを変えれば挙動を調整できる。
const TIME_NOTATION: '25:00表記' | '翌1:00表記' = '25:00表記';
const SHOW_NOW = true;
const WALK_FACTOR = 1; // ステージ間の徒歩時間の倍率（0.8〜2.0）
const FAV_KEY = 'frf26-sat-favs';

type Act = [string, string, string] | [string, string, string, string];
type StageEntry = [string, Act[]] | [string, Act[], string];

/* CSS 宣言文字列 → React style オブジェクト（オリジナルの style 文字列をそのまま使うため） */
function css(s: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of s.split(';')) {
    const i = decl.indexOf(':');
    if (i === -1) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop || !val) continue;
    const key = prop.startsWith('--')
      ? prop
      : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[key] = val;
  }
  return out as CSSProperties;
}

const STAGE_COLORS: Record<string, string> = {
  'GREEN STAGE': '#3ecf6a',
  'WHITE STAGE': '#e8e6f0',
  'RED MARQUEE': '#ff4d4d',
  'TRIBAL CIRCUS': '#c86bff',
  'FIELD OF HEAVEN': '#4cd7c0',
  'ORANGE ECHO': '#ff9a3c',
  'GYPSY AVALON': '#f2c94c',
  '苗場食堂': '#ff6f91',
  'PYRAMID GARDEN': '#6fb2ff',
  'DAY DREAMING': '#8a7dff',
  'ROOKIE A GO-GO': '#59d9ff',
  'CRYSTAL PALACE TENT': '#ffd23c',
  'BLUE GALAXY': '#5a7bff',
  'PALACE ARENA': '#ff5ad0',
};
const hue = (stage: string) => STAGE_COLORS[stage] || '#9d97c4';

/* ステージ相対位置（移動時間の概算に使用） */
const STAGE_POS: Record<string, number> = {
  'CRYSTAL PALACE TENT': 0, 'PALACE ARENA': 0, 'ROOKIE A GO-GO': 0, 'BLUE GALAXY': 0,
  'PYRAMID GARDEN': 5, 'DAY DREAMING': 5,
  'RED MARQUEE': 12, 'TRIBAL CIRCUS': 12,
  'GREEN STAGE': 15, '苗場食堂': 17,
  'WHITE STAGE': 25, 'ORANGE ECHO': 30, 'GYPSY AVALON': 33, 'FIELD OF HEAVEN': 38,
};
const pos = (stage: string) => (stage in STAGE_POS ? STAGE_POS[stage] : 15);
const travel = (a: string, b: string) =>
  a === b ? 0 : Math.max(3, Math.round(Math.abs(pos(a) - pos(b)) * WALK_FACTOR));

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const disp = (t: string) => {
  if (TIME_NOTATION === '25:00表記') return t;
  const [h, m] = t.split(':').map(Number);
  return h >= 24 ? '翌' + (h - 24) + ':' + String(m).padStart(2, '0') : t;
};

/* 開催当日（2026-07-25 SAT、翌26日 06:00 まで）だけ現在時刻を分で返す。それ以外は null */
function nowMin(): number | null {
  const n = new Date();
  if (n.getFullYear() !== 2026 || n.getMonth() !== 6) return null;
  if (n.getDate() === 25) return n.getHours() * 60 + n.getMinutes();
  if (n.getDate() === 26 && n.getHours() < 6) return (n.getHours() + 24) * 60 + n.getMinutes();
  return null;
}

const DATA: StageEntry[] = [
  ['GREEN STAGE', [
    ['11:00', '12:00', 'Bialystocks'],
    ['13:00', '14:00', 'Trueno', 'Trueno argentina rap'],
    ['15:00', '16:00', 'IO', 'IO 日本語ラップ'],
    ['17:00', '18:00', 'BASEMENT JAXX'],
    ['19:00', '20:10', '藤井風 (Fujii Kaze)', 'Fujii Kaze'],
    ['21:10', '22:40', 'KHRUANGBIN'],
  ]],
  ['WHITE STAGE', [
    ['12:10', '13:00', 'Riddim Saunter'],
    ['13:50', '14:40', 'BOHEMIAN BETYARS'],
    ['15:30', '16:30', 'Kroi'],
    ['17:50', '18:50', 'JOEY VALENCE & BRAE'],
    ['19:50', '20:50', 'XG'],
    ['22:00', '23:15', 'TOMORA', 'TOMORA band'],
  ]],
  ['RED MARQUEE', [
    ['10:20', '11:00', 'ブランデー戦記'],
    ['11:30', '12:10', 'SIX LOUNGE'],
    ['12:40', '13:30', 'QUADECA'],
    ['14:00', '15:00', 'THE BETHS'],
    ['16:00', '17:00', 'cero', 'cero バンド'],
    ['18:00', '19:00', 'THURSTON MOORE GROUP'],
    ['20:10', '21:10', 'サニーデイ・サービス'],
  ]],
  ['TRIBAL CIRCUS', [
    ['23:30', '24:20', '唾奇'],
    ['24:30', '26:00', 'KELLY LEE OWENS (DJ)', 'Kelly Lee Owens'],
    ['26:00', '27:30', 'Weval (DJ Set)', 'Weval'],
    ['27:30', '29:00', 'Soichi Terada'],
  ], 'RED MARQUEE 深夜'],
  ['FIELD OF HEAVEN', [
    ['11:10', '12:00', '柴田聡子 (BAND SET)', '柴田聡子'],
    ['12:50', '13:50', 'YUUF'],
    ['14:40', '15:40', 'LA LOM'],
    ['16:40', '17:40', 'OAU'],
    ['18:30', '19:40', 'KOKOROKO'],
    ['20:30', '22:00', 'BADBADNOTGOOD'],
  ]],
  ['ORANGE ECHO', [
    ['10:50', '11:30', '来島エル'],
    ['12:15', '12:55', 'タデクイ'],
    ['13:50', '14:30', 'neco眠る'],
    ['15:40', '16:20', 'CADEJO', 'CADEJO band'],
    ['17:50', '18:30', 'DMBQ'],
    ['19:50', '20:30', 'Bongjeingan'],
  ]],
  ['GYPSY AVALON', [
    ['11:00', '12:00', 'ケロポンズ'],
    ['13:00', '13:50', 'MASH弦楽団'],
    ['14:40', '15:20', 'アトミック・カフェ トーク【福島事故から15年】', 'アトミック・カフェ フジロック'],
    ['16:30', '17:20', '梅井美咲'],
    ['18:50', '19:40', '中西レモン＆すずめのティアーズ'],
    ['20:50', '21:50', 'jizue'],
  ]],
  ['苗場食堂', [
    ['12:10', '12:50', 'Za SAVAGE'],
    ['13:30', '14:10', '寺久保伶矢'],
    ['15:10', '15:50', 'NONE THE WiSER'],
    ['17:10', '17:50', 'ANIEKY A GO GO ! BAND'],
    ['19:10', '19:50', '苗場音楽突撃隊'],
    ['21:10', '21:50', 'the Tiger', 'the Tiger バンド'],
    ['22:45', '23:25', 'HOT DOG EXPRESS'],
  ]],
  ['PYRAMID GARDEN', [
    ['08:30', '09:20', 'ヨガワークショップ / 渋木さやか', '渋木さやか ヨガ'],
    ['09:40', '10:40', 'GOMA', 'GOMA didgeridoo'],
    ['11:30', '12:30', 'Michael Kaneko'],
    ['16:30', '19:30', 'YOSHIROTTEN'],
    ['19:30', '20:30', 'AOIZO'],
    ['20:30', '22:00', 'BAKU (KAIKOO)'],
    ['23:00', '24:00', 'ずっと真夜中でいいのに。(スパイシーズ状態)', 'ずっと真夜中でいいのに'],
    ['24:50', '25:50', 'SILENT POETS (DUB ENSEMBLE)', 'SILENT POETS'],
  ]],
  ['DAY DREAMING', [
    ['23:30', '24:30', 'AAAMYYY (Tempalay)', 'AAAMYYY'],
    ['24:30', '26:00', 'MONJOE'],
    ['26:00', '26:45', 'O.N.O (THA BLUE HERB)', 'O.N.O THA BLUE HERB'],
    ['26:45', '27:45', 'MaL a.k.a. Primal Dub'],
    ['27:45', '29:00', 'Lomax (NC4K)'],
  ]],
  ['ROOKIE A GO-GO', [
    ['22:00', '22:30', 'A_Root同根生', 'A_Root 同根生'],
    ['23:00', '23:30', 'mayu', 'mayu シンガー'],
    ['24:00', '24:30', '日髙晴野'],
    ['25:00', '25:30', 'Tocago'],
    ['26:00', '26:30', '猿臂', '猿臂 バンド'],
    ['27:00', '27:30', '二兆円', '二兆円 バンド'],
  ]],
  ['CRYSTAL PALACE TENT', [
    ['22:30', '23:45', 'BABY SOUL'],
    ['23:45', '24:30', "STOMPIN' RIFFRAFFS"],
    ['24:30', '25:30', 'GAZ MAYALL'],
    ['25:30', '26:15', 'THE KING LION'],
    ['26:15', '27:15', 'KING NABE'],
    ['27:15', '28:00', 'ZIONHILL SESSION'],
    ['28:00', '29:00', 'RUBY FLASHMAN'],
  ]],
  ['BLUE GALAXY', [
    ['12:50', '14:00', 'DJ JIM'],
    ['14:00', '14:50', 'DJ GONCHAN'],
    ['14:50', '15:30', 'NORTH KANTO REBEL SOUND CLASH'],
    ['15:30', '16:20', 'JAPAN CUMBIA FESTIVAL DJs'],
    ['16:20', '17:10', 'FUMINN'],
    ['17:10', '18:00', 'TXAKO'],
    ['18:00', '18:50', 'DJ TOMMY'],
    ['18:50', '21:20', 'CLUB SKA'],
    ['21:20', '22:00', 'SPECIAL GUEST', 'Blue Galaxy フジロック'],
    ['22:00', '23:00', 'RIHO'],
    ['23:00', '24:00', 'DJ JIM'],
  ]],
  ['PALACE ARENA', [
    ['24:30', '24:45', 'SAKURA CIRCUS'],
    ['25:30', '25:45', 'SAKURA CIRCUS'],
    ['26:30', '26:45', 'SAKURA CIRCUS'],
  ]],
];

type ActVM = {
  key: string; name: string; stage: string; stageColor: string;
  start: number; end: number; time: string; ytUrl: string;
  fav: boolean; isNow: boolean;
  starColor: string; rowStyle: string;
  lane?: number; conflict?: boolean;
};

export default function FujiRockPage() {
  const [view, setView] = useState<'stage' | 'time' | 'plan'>('stage');
  const [favOnly, setFavOnly] = useState(false);
  const [favs, setFavs] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 共通ヘッダー・フッターを全画面表示のため非表示に（fog mail / SNAP STUDIO と同方式）
  useEffect(() => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.style.setProperty('display', 'none', 'important');
    if (footer) footer.style.setProperty('display', 'none', 'important');
    return () => {
      if (header) header.style.removeProperty('display');
      if (footer) footer.style.removeProperty('display');
    };
  }, []);

  // localStorage からお気に入りを復元（Hydration 差異回避のためマウント後に実行）
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
      if (Array.isArray(saved)) setFavs(saved);
    } catch {}
    setMounted(true);
  }, []);

  // 1分ごとに再描画して NOW / LIVE 表示を更新
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const toggleFav = useCallback((key: string) => {
    setFavs((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const openYt = useCallback((e: MouseEvent, url: string) => {
    const w = window.open(url, '_blank', 'noopener');
    if (w) { e.preventDefault(); return; }
    // ポップアップがブロックされた場合：URL をコピーして案内
    e.preventDefault();
    const done = (ok: boolean) => {
      setToast(ok ? 'URLをコピーしました — 新しいタブに貼り付けてください' : url);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 6000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => done(true), () => done(false));
    } else done(false);
  }, []);

  const vals = useMemo(() => {
    const now = mounted && SHOW_NOW ? nowMin() : null;
    let total = 0;

    const mk = (stage: string, a: Act): ActVM => {
      const key = stage + '|' + a[0] + '|' + a[2];
      const fav = favs.includes(key);
      const isNow = now !== null && now >= toMin(a[0]) && now < toMin(a[1]);
      const card = () =>
        'display:grid; gap:12px; align-items:center; padding:12px 16px; border-radius:16px; background:#1a1730; border:1px solid rgba(255,255,255,0.08); border-left:4px solid ' +
        hue(stage) + '; transition:transform 0.15s ease, border-color 0.15s ease;' +
        (isNow ? ' background:linear-gradient(90deg, rgba(255,90,60,0.22), #1a1730 60%);' : '');
      const ytUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(a[3] || a[2]);
      return {
        key, name: a[2], stage, stageColor: hue(stage),
        start: toMin(a[0]), end: toMin(a[1]),
        time: disp(a[0]) + '–' + disp(a[1]),
        ytUrl, fav, isNow,
        starColor: fav ? '#ffb54a' : '#4a4664',
        rowStyle: card(),
      };
    };

    const all = DATA.map(([name, acts, sub]) => {
      total += acts.length;
      return {
        name,
        sub: sub || acts.length + '組',
        color: hue(name),
        acts: acts.map((a) => mk(name, a)),
      };
    });

    const allActs = all.flatMap((g) => g.acts);
    const favActs = allActs.filter((a) => a.fav);
    const { plan, conflicts } = buildPlan(favActs);
    const filt = (a: ActVM) => !favOnly || a.fav;
    const groups = all
      .map((g) => ({ ...g, acts: g.acts.filter(filt) }))
      .filter((g) => g.acts.length > 0);
    const timeline = allActs.filter(filt).sort((a, b) => a.start - b.start);

    return {
      totalActs: total,
      isStageView: view === 'stage' && groups.length > 0,
      isTimeView: view === 'time' && timeline.length > 0,
      isPlanView: view === 'plan' && favActs.length > 0,
      isEmpty:
        (view === 'plan' && favActs.length === 0) ||
        (favOnly && view !== 'plan' && timeline.length === 0),
      groups, timeline, plan,
      conflictLabel: conflicts > 0 ? '⚠ ' + conflicts + '組で時間被りあり' : favActs.length + '組 — 被りなし',
      favCount: favs.length,
      nowLabel: now !== null ? 'LIVE NOW — 演奏中をハイライト' : '7.25 SAT / GATE 8:30〜',
    };
  }, [view, favOnly, favs, mounted, tick]);

  const seg = (on: boolean) =>
    'border:none; padding:9px 18px; border-radius:999px; font-family:inherit; font-size:13px; font-weight:800; cursor:pointer; transition:background 0.15s ease;' +
    (on ? ' background:#ff5a3c; color:#fff;' : ' background:transparent; color:#b9b4d6;');
  const favBtnStyle =
    'border:1px solid ' + (favOnly ? '#ffb54a' : 'rgba(255,255,255,0.18)') +
    '; padding:8px 16px; border-radius:999px; font-family:inherit; font-size:13px; font-weight:800; cursor:pointer;' +
    (favOnly ? ' background:rgba(255,181,74,0.16); color:#ffb54a;' : ' background:transparent; color:#b9b4d6;');

  const ActRow = ({ act, timeView }: { act: ActVM; timeView: boolean }) => (
    <div className={'fr-row ' + (timeView ? 'fr-rowT' : 'fr-rowS')} style={css(act.rowStyle)}>
      <div style={css('justify-self:start; font-size:12px; font-weight:700; font-variant-numeric:tabular-nums; color:#cfc9ec; background:#2a2547; padding:5px 11px; border-radius:999px; white-space:nowrap')}>{act.time}</div>
      <div style={css('min-width:0; display:flex; align-items:center; gap:10px; flex-wrap:wrap')}>
        <span style={css('font-weight:800; font-size:16px')}>{act.name}</span>
        {act.isNow && (
          <span style={css('background:#ff5a3c; color:#fff; font-size:10px; font-weight:900; padding:3px 9px; border-radius:999px; letter-spacing:0.12em')}>NOW</span>
        )}
      </div>
      {timeView && (
        <div style={css('justify-self:start; display:flex; align-items:center; gap:6px; font-size:10px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; color:' + act.stageColor + '; white-space:nowrap')}>
          <span style={css('width:8px; height:8px; border-radius:50%; background:' + act.stageColor)}></span>{act.stage}
        </div>
      )}
      <a href={act.ytUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => openYt(e, act.ytUrl)} className="fr-yt" style={css('justify-self:end; display:flex; align-items:center; gap:6px; background:#ff5a3c; color:#fff; padding:7px 14px; border-radius:999px; font-size:12px; font-weight:800; text-decoration:none; letter-spacing:0.04em; white-space:nowrap')}>▶ YouTube</a>
      <button onClick={() => toggleFav(act.key)} aria-label="お気に入り" style={css('justify-self:end; background:none; border:none; cursor:pointer; padding:4px; font-size:22px; line-height:1; color:' + act.starColor)}>★</button>
    </div>
  );

  return (
    <div className="fr-root">
      <style>{FR_STYLE}</style>
      <div style={css('min-height:100vh; max-width:1080px; margin:0 auto; padding:0 20px 90px 20px')}>
        <header style={css('display:flex; justify-content:space-between; align-items:center; padding:18px 4px')}>
          <div style={css('font-weight:900; letter-spacing:0.14em; font-size:13px; text-transform:uppercase')}>Fuji Rock &apos;26</div>
          <div style={css('font-size:12px; letter-spacing:0.1em; color:#9d97c4; text-transform:uppercase')}>Naeba Ski Resort</div>
        </header>

        <section style={css('position:relative; border-radius:28px; overflow:hidden; height:min(56vh,480px); background:linear-gradient(160deg,#2b2350,#0f0c22)')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fujirock/hero.webp" alt="苗場の山" style={css('position:absolute; inset:0; width:100%; height:100%; object-fit:cover')} />
          <div style={css('position:absolute; inset:0; background:linear-gradient(180deg, rgba(16,14,31,0.05) 35%, rgba(16,14,31,0.62) 78%, rgba(16,14,31,0.88) 100%); pointer-events:none')}></div>
          <div style={css('position:absolute; left:28px; right:28px; bottom:26px; pointer-events:none')}>
            <div style={css('display:inline-block; background:#ff5a3c; color:#fff; font-weight:900; font-size:12px; letter-spacing:0.18em; padding:6px 14px; border-radius:999px; text-transform:uppercase')}>Day 2 — Saturday</div>
            <h1 style={css('margin:12px 0 6px 0; font-weight:900; font-size:clamp(56px,10vw,110px); line-height:0.9; letter-spacing:-0.03em; text-transform:uppercase')}>7.25 <span style={css('color:transparent; -webkit-text-stroke:2px #f5f2ea')}>SAT</span></h1>
            <div style={css('font-weight:900; font-size:clamp(20px,3.4vw,32px); letter-spacing:0.32em; text-transform:uppercase; background:linear-gradient(90deg,#ffb54a,#ff5a3c 45%,#c86bff); -webkit-background-clip:text; background-clip:text; color:transparent')}>Timetable</div>
            <div style={css('margin-top:10px; font-size:13px; color:#cfc9ec')}>全{vals.totalActs}組 / 13ステージ — タップでYouTubeへ、★でマイプランに追加</div>
          </div>
        </section>

        <div style={css('display:flex; flex-wrap:wrap; gap:10px; align-items:center; padding:14px 0; position:sticky; top:0; z-index:20; background:rgba(16,14,31,0.82); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px)')}>
          <div style={css('display:flex; gap:2px; background:#211d3a; border-radius:999px; padding:4px')}>
            <button onClick={() => setView('stage')} style={css(seg(view === 'stage'))}>ステージ別</button>
            <button onClick={() => setView('time')} style={css(seg(view === 'time'))}>時間順</button>
            <button onClick={() => setView('plan')} style={css(seg(view === 'plan'))}>マイプラン</button>
          </div>
          <button onClick={() => setFavOnly((v) => !v)} style={css(favBtnStyle)}>★ お気に入り {vals.favCount}</button>
          <div style={css('margin-left:auto; font-size:11px; letter-spacing:0.06em; color:#9d97c4')}>{vals.nowLabel}</div>
        </div>

        {vals.isStageView && (
          vals.groups.map((g) => (
            <section key={g.name} style={css('margin-bottom:8px')}>
              <div style={css('display:flex; align-items:center; gap:10px; padding:22px 4px 12px 4px; position:sticky; top:58px; z-index:10; background:rgba(16,14,31,0.92); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px)')}>
                <span style={css('width:12px; height:12px; border-radius:50%; background:' + g.color + '; box-shadow:0 0 14px ' + g.color + '; animation:glowpulse 3s ease-in-out infinite')}></span>
                <h2 style={css('margin:0; font-weight:900; font-size:20px; letter-spacing:0.06em; text-transform:uppercase')}>{g.name}</h2>
                <div style={css('margin-left:auto; font-size:11px; letter-spacing:0.08em; color:#9d97c4; text-transform:uppercase')}>{g.sub}</div>
              </div>
              <div style={css('display:flex; flex-direction:column; gap:8px')}>
                {g.acts.map((act) => (
                  <ActRow key={act.key} act={act} timeView={false} />
                ))}
              </div>
            </section>
          ))
        )}

        {vals.isTimeView && (
          <div style={css('display:flex; flex-direction:column; gap:8px; padding-top:16px')}>
            {vals.timeline.map((act) => (
              <ActRow key={act.key} act={act} timeView={true} />
            ))}
          </div>
        )}

        {vals.isPlanView && (
          <section style={css('padding:20px 0')}>
            <div style={css('display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px; flex-wrap:wrap; gap:8px')}>
              <h2 style={css('margin:0; font-weight:900; font-size:22px; letter-spacing:0.04em; text-transform:uppercase')}>My Plan</h2>
              <div style={css('font-size:12px; font-weight:700; color:#ffb54a')}>{vals.conflictLabel}</div>
            </div>
            <div style={css('font-size:12px; color:#9d97c4; margin-bottom:18px')}>★を付けたアーティストを時間軸に配置。横並び＝時間被り（赤枠）。</div>
            <div style={css(vals.plan.containerStyle)}>
              {vals.plan.hours.map((h, i) => (
                <div key={'h' + i}>
                  <div style={css(h.lineStyle)}></div>
                  <div style={css(h.labelStyle)}>{h.label}</div>
                </div>
              ))}
              {vals.plan.blocks.map((b, i) => (
                <div key={'b' + i} style={css(b.style)}>
                  <div style={css('font-size:11px; font-weight:700; font-variant-numeric:tabular-nums; color:#cfc9ec; white-space:nowrap')}>{b.time}</div>
                  <div style={css('font-weight:800; font-size:13px; line-height:1.25; overflow:hidden')}>{b.name}</div>
                  <div style={css('font-size:10px; font-weight:800; letter-spacing:0.06em; text-transform:uppercase; color:' + b.stageColor + '; white-space:nowrap; overflow:hidden; text-overflow:ellipsis')}>{b.stage}</div>
                  {b.conflict && (
                    <div style={css('position:absolute; top:6px; right:6px; background:#ff5a3c; color:#fff; font-size:10px; font-weight:900; padding:2px 8px; border-radius:999px; letter-spacing:0.08em')}>被り</div>
                  )}
                </div>
              ))}
            </div>
            {vals.plan.hasMoves && (
              <div style={css('margin-top:30px')}>
                <h3 style={css('margin:0 0 4px 0; font-weight:900; font-size:16px; letter-spacing:0.06em; text-transform:uppercase')}>移動チェック</h3>
                <div style={css('font-size:12px; color:#9d97c4; margin-bottom:12px')}>ステージ間の徒歩時間（目安）と空き時間を照合します。</div>
                <div style={css('display:flex; flex-direction:column; gap:8px')}>
                  {vals.plan.moves.map((mv, i) => (
                    <div key={'mv' + i} style={css(mv.style)}>
                      <div style={css('font-size:13px; font-weight:700; min-width:0; color:#f5f2ea')}>{mv.label}</div>
                      <div style={css('font-size:12px; font-weight:800; white-space:nowrap; color:' + mv.color)}>{mv.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {vals.isEmpty && (
          <div style={css('padding:56px 0; text-align:left; font-size:14px; color:#9d97c4')}>お気に入りはまだありません。各行の ★ を押して登録してください。</div>
        )}

        {toast && (
          <div style={css('position:fixed; left:50%; bottom:24px; transform:translateX(-50%); z-index:50; background:#2a2547; color:#f5f2ea; border:1px solid rgba(255,255,255,0.18); border-radius:14px; padding:12px 18px; font-size:13px; font-weight:700; max-width:88vw; overflow-wrap:anywhere; box-shadow:0 8px 30px rgba(0,0,0,0.5)')}>{toast}</div>
        )}

        <footer style={css('margin-top:56px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.12); font-size:11px; color:#9d97c4; line-height:1.8')}>
          出典：フジロック公式タイムテーブル（変更の可能性あり）。25:00 = 翌1:00。YouTubeボタンはアーティスト検索結果を開きます。★はこの端末に保存されます。
        </footer>
      </div>
    </div>
  );
}

/* ── マイプラン：レーン割り当て・被り判定・移動時間チェック ── */
type PlanHour = { label: string; lineStyle: string; labelStyle: string };
type PlanBlock = { name: string; time: string; stage: string; conflict: boolean; stageColor: string; style: string };
type PlanMove = { label: string; status: string; color: string; style: string };
type Plan = { containerStyle: string; hours: PlanHour[]; blocks: PlanBlock[]; moves: PlanMove[]; hasMoves: boolean };

function buildPlan(favActs: ActVM[]): { plan: Plan; conflicts: number } {
  const acts = [...favActs].sort((a, b) => a.start - b.start || a.end - b.end);
  if (acts.length === 0) {
    return { plan: { containerStyle: 'display:none', hours: [], blocks: [], moves: [], hasMoves: false }, conflicts: 0 };
  }
  const overlaps = (a: ActVM, b: ActVM) => a.start < b.end && b.start < a.end;
  const lanes: number[] = [];
  let maxLanes = 1;
  acts.forEach((a) => {
    let lane = lanes.findIndex((end) => end <= a.start);
    if (lane === -1) { lane = lanes.length; lanes.push(0); }
    lanes[lane] = a.end;
    a.lane = lane;
    maxLanes = Math.max(maxLanes, lane + 1);
  });
  acts.forEach((a) => { a.conflict = acts.some((b) => b !== a && overlaps(a, b)); });
  const t0 = Math.floor(Math.min(...acts.map((a) => a.start)) / 60) * 60;
  const t1 = Math.ceil(Math.max(...acts.map((a) => a.end)) / 60) * 60;
  const PPM = 2.2, AXIS = 64;
  const height = (t1 - t0) * PPM;
  const hours: PlanHour[] = [];
  for (let t = t0; t <= t1; t += 60) {
    const y = (t - t0) * PPM;
    const h = t / 60;
    hours.push({
      label: disp((h < 10 ? '0' + h : h) + ':00'),
      lineStyle: 'position:absolute; left:' + AXIS + 'px; right:0; top:' + y + 'px; border-top:1px solid rgba(255,255,255,0.1);',
      labelStyle: 'position:absolute; left:0; top:' + (y - 7) + 'px; font-size:11px; font-variant-numeric:tabular-nums; color:#9d97c4;',
    });
  }
  const laneW = 100 / maxLanes;
  const blocks: PlanBlock[] = acts.map((a) => ({
    name: a.name, time: a.time, stage: a.stage, conflict: !!a.conflict, stageColor: hue(a.stage),
    style:
      'position:absolute;' +
      ' left:calc(' + AXIS + 'px + (100% - ' + AXIS + 'px) * ' + (a.lane! * laneW / 100) + ');' +
      ' width:calc((100% - ' + AXIS + 'px) * ' + (laneW / 100) + ' - 6px);' +
      ' top:' + ((a.start - t0) * PPM) + 'px; height:' + Math.max((a.end - a.start) * PPM - 4, 32) + 'px;' +
      ' box-sizing:border-box; padding:7px 10px; overflow:hidden; display:flex; flex-direction:column; gap:2px; border-radius:12px;' +
      ' background:#1e1a35; border-left:4px solid ' + hue(a.stage) + ';' +
      (a.conflict ? ' border:2px solid #ff5a3c; border-left:4px solid ' + hue(a.stage) + '; background:rgba(255,90,60,0.14);' : ''),
  }));
  const moves: PlanMove[] = [];
  for (let i = 0; i < acts.length - 1; i++) {
    const a = acts[i], b = acts[i + 1];
    if (a.stage === b.stage && b.start >= a.end) continue;
    const tr = travel(a.stage, b.stage);
    const gap = b.start - a.end;
    let status: string, color: string;
    const base = 'display:grid; grid-template-columns:1fr auto; gap:12px; align-items:baseline; padding:12px 16px; border-radius:14px; background:#1a1730; border:1px solid rgba(255,255,255,0.08);';
    if (gap < 0) { status = '時間被り（' + (-gap) + '分重複）'; color = '#ff5a3c'; }
    else if (gap < tr) { status = '間に合わない可能性 — 空き' + gap + '分 / 移動約' + tr + '分'; color = '#ffb54a'; }
    else { status = 'OK — 空き' + gap + '分 / 移動約' + tr + '分'; color = '#4cd7c0'; }
    moves.push({
      label: a.name + ' (' + a.stage + ') → ' + b.name + ' (' + b.stage + ')',
      status, color,
      style: base + (gap < tr ? ' border-color:' + color + ';' : ''),
    });
  }
  return {
    plan: { containerStyle: 'position:relative; height:' + (height + 20) + 'px;', hours, blocks, moves, hasMoves: moves.length > 0 },
    conflicts: acts.filter((a) => a.conflict).length,
  };
}

/* ── LINE Seed（プロジェクト標準フォント）と全画面用スタイル ── */
const FR_STYLE = `
@font-face { font-family:'LINE Seed JP'; font-weight:400; font-display:swap; src:url('/fonts/LINESeedJP_OTF_Rg.woff2') format('woff2'); }
@font-face { font-family:'LINE Seed JP'; font-weight:700; font-display:swap; src:url('/fonts/LINESeedJP_OTF_Bd.woff2') format('woff2'); }
@font-face { font-family:'LINE Seed Sans'; font-weight:400; font-display:swap; src:url('/fonts/LINESeedSans_W_Rg.woff2') format('woff2'); }
@font-face { font-family:'LINE Seed Sans'; font-weight:700; font-display:swap; src:url('/fonts/LINESeedSans_W_Bd.woff2') format('woff2'); }
.fr-root { min-height:100vh; background:#100e1f; color:#f5f2ea; font-family:'LINE Seed Sans','LINE Seed JP',-apple-system,BlinkMacSystemFont,sans-serif; }
.fr-root * { box-sizing:border-box; }
.fr-root h1, .fr-root h2, .fr-root h3 { font-family:'LINE Seed Sans','LINE Seed JP',sans-serif; }
.fr-root a { color:#f5f2ea; }
.fr-root a:hover { color:#ff5a3c; }
.fr-root button:focus-visible, .fr-root a:focus-visible { outline:2px solid #ff5a3c; outline-offset:2px; }
.fr-row:hover { transform:translateX(4px); border-color:rgba(255,255,255,0.22) !important; }
.fr-yt:hover { background:#ff7a5f !important; color:#fff !important; }
@keyframes glowpulse { 0%,100% { opacity:0.55; } 50% { opacity:1; } }
.fr-rowS { grid-template-columns:auto 1fr auto 40px; }
.fr-rowT { grid-template-columns:auto 1fr 170px auto 40px; }
@media (max-width:560px) {
  .fr-rowT {
    grid-template-columns:1fr auto;
    grid-template-areas:"time star" "name name" "stage yt";
    row-gap:10px; align-items:center;
  }
  .fr-rowT > :nth-child(1) { grid-area:time; }
  .fr-rowT > :nth-child(2) { grid-area:name; }
  .fr-rowT > :nth-child(3) { grid-area:stage; }
  .fr-rowT > :nth-child(4) { grid-area:yt; }
  .fr-rowT > :nth-child(5) { grid-area:star; }
  .fr-rowS {
    grid-template-columns:1fr auto;
    grid-template-areas:"time star" "name name" "yt yt";
    row-gap:10px; align-items:center;
  }
  .fr-rowS > :nth-child(1) { grid-area:time; }
  .fr-rowS > :nth-child(2) { grid-area:name; }
  .fr-rowS > :nth-child(3) { grid-area:yt; justify-self:start; }
  .fr-rowS > :nth-child(4) { grid-area:star; }
}
`;
