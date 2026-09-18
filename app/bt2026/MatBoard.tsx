"use client";

import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ *
 *  ブルテリア柔術チャンピオンシップ2026（JBJJF）
 *  2026年9月19日(土) 横浜武道館 武道場 / 10:30開場 / 全5マット
 *
 *  出典: https://www.jbjjf.com/upcoming-events/bt_ch26/ のトーナメント表PDF
 *  全37ページから所属 "ARTA" / "ARTA BJJ HIROO" の18名・20試合を抽出
 * ------------------------------------------------------------------ */

/** 勝ち上がり1手: [試合順, 試合開始, ラウンド名] */
type Step = [number, string, string];

/** [マット, 試合順, カテゴリ, 選手, 初戦の相手, 相手所属, 集合, 計量, シード, 所属, 勝ち上がり] */
type Row = [string, number, string, string, string, string, string, string, 0 | 1, string, Step[]];

const R: Row[] = [
["1", 3, "マスター1紫帯ライト級 -76.00kg（2人）", "小川智也 Tomoya Ogawa", "加藤大地 Daichi Kato", "RJJ", "10:44", "11:04", 0, "ARTA", [[3, "11:14", "決勝"]]],
["3", 5, "マスター3白帯ライトフェザー級 -64.00kg（11人）", "佐伯幸勅 Yukinori Saeki", "橋口健 Ken Hashiguchi", "Carpe Diem Hiratsuka", "10:50", "11:10", 0, "ARTA", [[5, "11:20", "準々決勝"], [13, "12:00", "準決勝"], [21, "12:40", "決勝"]]],
["1", 5, "マスター2黒帯ライト級 -76.00kg（2人）", "佐野夏輝 Natsuki Sano", "キムラレナト Renato Kimura", "PATO STUDIO", "10:58", "11:18", 0, "ARTA", [[5, "11:28", "決勝"]]],
["4", 7, "アダルト白帯フェザー級 -70.00kg（20人）", "白澤龍之介 Ryunosuke Shirasawa", "刈込大輝 Daiki Karikomi", "CARPE DIEM KIMITSU", "11:00", "11:20", 0, "ARTA", [[7, "11:30", "1回戦"], [21, "12:40", "2回戦"], [31, "13:30", "準々決勝"], [39, "14:10", "準決勝"], [45, "14:40", "決勝"]]],
["5", 7, "マスター1白帯ライト級 -76.00kg（13人）", "Teo MariaCiyo Kano", "石井未来人 Mikuto Ishii", "ストライプルオハナ", "11:00", "11:20", 0, "ARTA BJJ HIROO", [[7, "11:30", "1回戦"], [14, "12:05", "準々決勝"], [22, "12:45", "準決勝"], [30, "13:25", "決勝"]]],
["1", 13, "マスター2紫帯ライトフェザー級 -64.00kg（2人）", "石原遼平 Ryohei Ishihara", "渡辺大洋 Masahiro Watanabe", "リバーサルジム新宿Me,We", "11:35", "11:58", 0, "ARTA", [[13, "12:08", "決勝"]]],
["2", 13, "アダルト青帯ミドル級 -82.30kg（6人）", "齋木有悟 Yugo Saiki", "岡本明彦 Akihiko Okamoto", "CARPE DIEM KIMITSU", "11:39", "12:02", 0, "ARTA", [[13, "12:12", "準々決勝"], [19, "12:48", "準決勝"], [24, "13:18", "決勝"]]],
["5", 19, "マスター4白帯ライトフェザー級 -64.00kg（11人）", "市川裕人 Hiroto Ichikawa", "小林健 Takeshi Kobayashi", "トライフォース柔術アカデミー", "11:53", "12:20", 0, "ARTA", [[19, "12:30", "1回戦"], [27, "13:10", "準々決勝"], [33, "13:40", "準決勝"], [41, "14:20", "決勝"]]],
["3", 24, "マスター3白帯フェザー級 -70.00kg（9人）", "﨑田隆弘 Takahiro Sakita", "浅山雄揮 Yuki Asayama", "Carpe Diem Hiratsuka", "道着12:45", "—", 1, "ARTA", [[24, "12:55", "決勝"]]],
["1", 23, "マスター3紫帯フェザー級 -70.00kg（3人）", "柏木健吾 Kengo Kashiwagi", "小林保夫 Yasuo Kobayashi", "トライフォース柔術アカデミー", "12:25", "12:54", 0, "ARTA", [[23, "13:04", "準決勝"], [35, "14:15", "決勝"]]],
["2", 23, "アダルト青帯ウルトラヘビー級 Free（2人）", "浅見太亮 Taisuke Asami", "須惠勝貴 Masaki Sue", "パラエストラ大阪", "12:33", "13:02", 0, "ARTA", [[23, "13:12", "決勝"]]],
["3", 33, "マスター3青帯ルースター級 -57.50kg（4人）", "長瀬優秀 Masahide Nagase", "窪田紳也 Shinya Kubota", "Gracie Barra Yamanashi", "12:56", "13:30", 0, "ARTA", [[33, "13:40", "準決勝"], [38, "14:05", "決勝"]]],
["2", 28, "アダルト青帯ライトフェザー級 -64.00kg（16人）", "岩瀬尚大 Takahiro Iwase", "志村郁哉 Fumiya Shimura", "リバーサルジム横浜グランドスラム", "13:00", "13:32", 0, "ARTA", [[28, "13:42", "1回戦"], [35, "14:24", "準々決勝"], [41, "14:57", "準決勝"], [47, "15:29", "決勝"]]],
["4", 37, "アダルト白帯ライト級 -76.00kg（7人）", "東江皓大 Kodai Agarie", "鹿股優仁 Hiroto Kanomata", "トライフォース柔術アカデミー", "13:14", "13:50", 0, "ARTA", [[37, "14:00", "準々決勝"], [43, "14:30", "準決勝"], [47, "14:50", "決勝"]]],
["4", 49, "アダルト白帯ルースター級 -57.50kg（10人）", "神谷祐輔 Yusuke Kamiya", "今村健人 Kento Imamura", "フィットネス柔術蒲田", "14:08", "14:50", 0, "ARTA", [[49, "15:00", "1回戦"], [57, "15:40", "準々決勝"], [61, "16:00", "準決勝"], [65, "16:20", "決勝"]]],
["1", 44, "アダルト紫帯ライトフェザー級 -64.00kg（2人）", "小寺竜童 Ryudo Kodera", "秋山義将 Yoshimasa Akiyama", "RRT", "14:16", "14:56", 0, "ARTA", [[44, "15:06", "決勝"]]],
["3", 61, "マスター3白帯ミディアムヘビー級 -88.30kg（3人）", "小林隼也 Junya Kobayashi", "3-55（安田哲／千葉久義）の敗者", "", "15:02", "15:50", 0, "ARTA", [[61, "16:00", "準決勝"], [67, "16:30", "決勝"]]],
["2", 57, "アダルト青帯ルースター級 -57.50kg（3人）", "遠藤信 Shin Endo", "中島優介 Yusuke Nakajima", "リバーサルジム新宿Me,We", "15:27", "16:13", 0, "ARTA", [[57, "16:23", "準決勝"], [69, "17:31", "決勝"]]],
["2", 59, "アダルト青帯オープンクラス OPEN（11人）", "齋木有悟 Yugo Saiki", "迫田空也 Kuya Sakota", "ネクサセンス", "15:37", "16:24", 0, "ARTA", [[59, "16:34", "準々決勝"], [66, "17:14", "準決勝"], [71, "17:42", "決勝"]]],
["2", 61, "アダルト青帯オープンクラス OPEN（11人）", "浅見太亮 Taisuke Asami", "本間遼太郎 Ryotaro Homma", "柳澤柔術", "15:48", "16:36", 0, "ARTA", [[61, "16:46", "準々決勝"], [67, "17:20", "準決勝"], [71, "17:42", "決勝"]]],
];

/** マットごとの総試合数 */
const TOT: Record<string, number> = { "1": 73, "2": 71, "3": 81, "4": 81, "5": 80 };

type Match = {
  mat: string; num: number; cat: string; belt: string; name: string;
  opp: string; team: string; call: string; weigh: string; start: string;
  round: string; seq: Step[]; seed: boolean; club: string; mins: number; tot: number;
};

const M: Match[] = R.map((r) => {
  const belt = (r[2].match(/(白|青|紫|茶|黒)帯/) || [])[1] || "白";
  const seq = r[10];
  const [h, m] = seq[0][1].split(":");
  return {
    mat: r[0], num: r[1], cat: r[2], belt, name: r[3], opp: r[4], team: r[5],
    call: r[6], weigh: r[7], start: seq[0][1], round: seq[0][2], seq,
    seed: r[8] === 1, club: r[9],
    mins: Number(h) * 60 + Number(m), tot: TOT[r[0]] || 0,
  };
});

type View = "time" | "ath" | "mat";
const VIEWS: { id: View; label: string }[] = [
  { id: "time", label: "時間順" },
  { id: "ath", label: "選手別" },
  { id: "mat", label: "マット別" },
];

const byTime = (a: Match, b: Match) => a.mins - b.mins;

export default function MatBoard() {
  const [view, setView] = useState<View>("time");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? M.filter((m) => m.name.toLowerCase().includes(s)) : M;
  }, [q]);

  const groups = useMemo(() => {
    if (view === "time") {
      const l = [...rows].sort(byTime);
      return l.length
        ? [{ key: "d", color: "var(--bt-flame)", title: "9月19日（土）", meta: `${l.length}試合`, list: l }]
        : [];
    }
    if (view === "ath") {
      const by: Record<string, Match[]> = {};
      rows.forEach((m) => (by[m.name] = by[m.name] || []).push(m));
      return Object.keys(by)
        .map((n) => ({ n, l: [...by[n]].sort(byTime) }))
        .sort((a, b) => a.l[0].mins - b.l[0].mins)
        .map(({ n, l }) => ({
          key: n,
          color: `var(--bt-belt-${l[0].belt})`,
          title: n,
          meta: `${l[0].belt}帯 ／ ${l.length}試合`,
          list: l,
        }));
    }
    const by: Record<string, Match[]> = {};
    rows.forEach((m) => (by[m.mat] = by[m.mat] || []).push(m));
    return Object.keys(by)
      .sort((a, b) => Number(a) - Number(b))
      .map((mt) => {
        const l = [...by[mt]].sort(byTime);
        return {
          key: mt,
          color: "var(--bt-lav)",
          title: `MAT ${mt}`,
          meta: `ARTA ${l.length}試合 ／ 全${l[0].tot}試合`,
          list: l,
        };
      });
  }, [rows, view]);

  return (
    <div className="bt-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="bt-wrap">
        <header className="bt-hero">
          <span className="bt-badge">9.19 SAT — 横浜武道館</span>
          <h1>
            ブルテリア柔術
            <br />
            チャンピオンシップ2026
            <span className="bt-sub2">BULLTERRIER JIU-JITSU CHAMPIONSHIP 2026</span>
          </h1>
          <p className="bt-lede">
            <span className="bt-team">ARTA</span>
            <span><b>18</b>名</span>
            <span><b>20</b>試合</span>
            <span><b>5</b>マット</span>
            <span>10:30開場</span>
          </p>
        </header>

        <div className="bt-note">
          <div>
            JBJJFのトーナメント表（PDF）から<b>ARTA所属の全試合を抽出</b>した非公式の一覧です。初戦に加えて、勝ち上がった場合の予定時刻も入っています。
            <b>集合時間までに会場入り</b>してください。時刻は目安で、進行により大幅に前後します。
          </div>
        </div>

        <div className="bt-controls">
          <div className="bt-pills" role="group" aria-label="並び順">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                className="bt-p"
                aria-pressed={view === v.id}
                onClick={() => setView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
          <input
            className="bt-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="選手名で検索"
            aria-label="選手名で検索"
          />
        </div>

        <section>
          {groups.length === 0 ? (
            <p className="bt-empty">該当する選手がいません。検索語を変えてみてください。</p>
          ) : (
            groups.map((g) => (
              <section className="bt-grp" key={g.key}>
                <div className="bt-grp-head">
                  <span
                    className="bt-dot"
                    style={{ background: g.color, boxShadow: `0 0 14px ${g.color}` }}
                  />
                  <h2>{g.title}</h2>
                  <span className="bt-meta">{g.meta}</span>
                </div>
                <div className="bt-rows">
                  {g.list.map((m) => (
                    <div
                      className="bt-row"
                      key={`${m.mat}-${m.num}-${m.name}`}
                      style={{ borderLeftColor: `var(--bt-belt-${m.belt})` }}
                    >
                      <div className="bt-clock">
                        <span className="bt-t">{m.start}</span>
                        <span className="bt-lb">{m.round}</span>
                      </div>
                      <div className="bt-main">
                        <span className="bt-nm">{m.name}</span>
                        <span className="bt-op">
                          <span className="bt-vs">VS</span>
                          {m.opp}
                          {m.team ? <span className="bt-tm"> {m.team}</span> : null}
                        </span>
                        <span className="bt-cat">{m.cat}</span>
                      </div>
                      <div className="bt-side">
                        {m.club !== "ARTA" ? (
                          <span className="bt-tag bt-club">{m.club}</span>
                        ) : null}
                        {m.seed ? <span className="bt-tag bt-bye">シード</span> : null}
                        <span className="bt-tag bt-call">集合 {m.call}</span>
                        <span className="bt-tag bt-weigh">計量 {m.weigh}</span>
                        <span className="bt-tag bt-mat">MAT {m.mat}</span>
                        <span className="bt-tag bt-ord">
                          {m.num} / {m.tot}試合目
                        </span>
                      </div>
                      {m.seq.length > 1 ? (
                        <div className="bt-path">
                          <span className="bt-pl">勝てば</span>
                          {m.seq.slice(1).map((s2, i) => (
                            <span
                              key={s2[0]}
                              className={`bt-step${i === m.seq.length - 2 ? " bt-fin" : ""}`}
                            >
                              <span className="bt-r">{s2[2]}</span>
                              <span className="bt-h">{s2[1]}</span>
                              <span className="bt-o">
                                {m.mat}-{s2[0]}
                              </span>
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </section>

        <footer className="bt-foot">
          <h3>読み方</h3>
          <p>
            「2-13」は<b>2マット13試合目</b>という意味です。「13 / 71試合目」の分母はそのマットの全試合数。あと何試合かは同じマットの中で数えてください。
          </p>
          <p>
            オレンジの<b>集合</b>が会場に居るべき時刻、ミントの<b>計量</b>が計量の目安、大きい数字が<b>試合開始</b>の目安です。集合時間を過ぎると失格になることがあります。シードの選手は集合時間の記載がなく、道着チェックの時刻を表示しています。
          </p>
          <p>
            カード下部の<b>「勝てば」</b>は勝ち上がった場合の予定です。オレンジが決勝。ここまで勝つと1日に4〜5試合になる階級もあるので、体力配分の目安にしてください。<b>シード</b>の選手は初戦の相手が前の試合の勝者（または敗者）になります。
          </p>
          <p>
            出典：
            <a href="https://www.jbjjf.com/upcoming-events/bt_ch26/" target="_blank" rel="noopener noreferrer">
              JBJJF ブルテリア柔術チャンピオンシップ2026
            </a>
            （トーナメント表PDF・全37ページ）
          </p>
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  スタイル（すべて .bt-root 配下にスコープ）
 *  LINE Seed は /public/fonts/ の既存ファイルを参照
 * ------------------------------------------------------------------ */
const CSS = `
/* このページだけ ciraf.jp 共通のヘッダー・フッターを隠す。
   スタイルはこのコンポーネントと一緒に外れるので、他ページには影響しない。
   （恒久対応をするなら root layout をルートグループで分ける） */
body > header, body > footer{display:none !important}
body > main{padding-top:0 !important}

@font-face{font-family:"LINE Seed JP";font-weight:400;font-display:swap;src:url("/fonts/LINESeedJP_OTF_Rg.woff2") format("woff2")}
@font-face{font-family:"LINE Seed JP";font-weight:700;font-display:swap;src:url("/fonts/LINESeedJP_OTF_Bd.woff2") format("woff2")}
@font-face{font-family:"LINE Seed Sans";font-weight:400;font-display:swap;src:url("/fonts/LINESeedSans_W_Rg.woff2") format("woff2")}
@font-face{font-family:"LINE Seed Sans";font-weight:700;font-display:swap;src:url("/fonts/LINESeedSans_W_Bd.woff2") format("woff2")}

.bt-root{
  --bt-ground:#100E1F; --bt-panel:#1A1730; --bt-panel-2:#2A2547;
  --bt-cream:#F5F2EA; --bt-lav:#CFC9EC; --bt-lav-2:#ADA7CE; --bt-lav-3:#6E6892;
  --bt-flame:#FF5A3C; --bt-mint:#4CD7C0;
  --bt-hair:rgba(255,255,255,.08);
  --bt-belt-白:#E8E6F0; --bt-belt-青:#4C8DFF; --bt-belt-紫:#A97BFF;
  --bt-belt-茶:#C08457; --bt-belt-黒:#7C83A0;
  --bt-disp:"LINE Seed Sans","LINE Seed JP",-apple-system,BlinkMacSystemFont,sans-serif;
  --bt-body:"LINE Seed JP","LINE Seed Sans","Hiragino Sans","Yu Gothic",sans-serif;

  min-height:100vh; background:var(--bt-ground); color:var(--bt-cream);
  font-family:var(--bt-body); line-height:1.6; -webkit-font-smoothing:antialiased;
}
.bt-root *{box-sizing:border-box}
.bt-wrap{max-width:940px; margin:0 auto; padding:0 14px 76px}

.bt-hero{padding:34px 4px 24px; display:flex; flex-direction:column; gap:14px}
.bt-badge{align-self:flex-start; background:var(--bt-flame); color:#fff; font-family:var(--bt-disp);
  font-weight:700; font-size:12px; letter-spacing:.1em; text-transform:uppercase;
  padding:7px 15px; border-radius:999px}
.bt-root h1{margin:0; font-family:var(--bt-disp); font-weight:700;
  font-size:clamp(28px,6.6vw,50px); line-height:1.08; letter-spacing:-.01em; text-wrap:balance}
.bt-sub2{display:block; font-size:clamp(13px,3vw,19px); letter-spacing:.02em;
  color:var(--bt-lav-2); margin-top:9px; font-weight:700; text-transform:uppercase}
.bt-lede{margin:0; display:flex; align-items:baseline; gap:10px; flex-wrap:wrap;
  font-size:13px; color:var(--bt-lav-2)}
.bt-team{font-family:var(--bt-disp); font-weight:700; font-size:17px;
  letter-spacing:.16em; color:var(--bt-flame)}
.bt-lede b{color:var(--bt-cream); font-family:var(--bt-disp); font-weight:700; font-size:17px;
  font-variant-numeric:tabular-nums; margin-right:1px}

.bt-note{display:flex; gap:9px; background:var(--bt-panel); border:1px solid var(--bt-hair);
  border-left:4px solid var(--bt-lav-3); border-radius:14px;
  padding:12px 15px; font-size:12.5px; color:var(--bt-lav-2); margin-bottom:20px}
.bt-note b{color:var(--bt-cream); font-weight:700}

.bt-controls{position:sticky; top:0; z-index:20; padding:12px 0;
  background:rgba(16,14,31,.92); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
  display:flex; gap:9px; flex-wrap:wrap; align-items:center}
.bt-pills{display:flex; gap:7px; flex-wrap:wrap}
.bt-p{appearance:none; cursor:pointer; border:1px solid var(--bt-hair); background:var(--bt-panel);
  color:var(--bt-lav); font-family:var(--bt-body); font-size:12.5px; padding:7px 16px;
  border-radius:999px; transition:background .15s,color .15s,border-color .15s}
.bt-p[aria-pressed="true"]{background:var(--bt-lav); border-color:var(--bt-lav); color:var(--bt-ground)}
.bt-p:focus-visible{outline:2px solid var(--bt-lav); outline-offset:2px}
.bt-search{flex:1 1 190px; min-width:160px; background:var(--bt-panel); border:1px solid var(--bt-hair);
  border-radius:999px; color:var(--bt-cream); font-family:var(--bt-body); font-size:12.5px; padding:7px 15px}
.bt-search::placeholder{color:var(--bt-lav-3)}
.bt-search:focus-visible{outline:2px solid var(--bt-lav); outline-offset:1px}

.bt-grp{margin-bottom:6px}
.bt-grp-head{display:flex; align-items:center; gap:10px; padding:22px 4px 12px;
  position:sticky; top:56px; z-index:10;
  background:rgba(16,14,31,.92); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px)}
.bt-dot{width:12px; height:12px; border-radius:50%; flex:none}
.bt-grp-head h2{margin:0; font-family:var(--bt-disp); font-weight:700; font-size:19px;
  letter-spacing:.05em; text-transform:uppercase; min-width:0; overflow-wrap:anywhere}
.bt-meta{margin-left:auto; font-size:11px; letter-spacing:.07em; color:var(--bt-lav-2);
  white-space:nowrap; font-variant-numeric:tabular-nums}
.bt-rows{display:flex; flex-direction:column; gap:8px}

.bt-row{display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center;
  padding:12px 15px; border-radius:16px; background:var(--bt-panel);
  border:1px solid var(--bt-hair); border-left-width:4px; border-left-style:solid}
.bt-clock{display:flex; flex-direction:column; align-items:flex-start; gap:3px}
.bt-t{font-family:var(--bt-disp); font-weight:700; font-size:23px; line-height:1;
  font-variant-numeric:tabular-nums; color:var(--bt-cream)}
.bt-lb{font-size:9.5px; letter-spacing:.12em; color:var(--bt-lav-3)}
.bt-main{min-width:0; display:flex; flex-direction:column; gap:2px}
.bt-nm{font-size:15.5px; font-weight:700; line-height:1.35; overflow-wrap:anywhere}
.bt-op{font-size:13px; color:var(--bt-lav); line-height:1.4; overflow-wrap:anywhere}
.bt-vs{font-family:var(--bt-disp); font-weight:700; font-size:11px; letter-spacing:.12em;
  color:var(--bt-flame); margin-right:6px}
.bt-tm{color:var(--bt-lav-2); font-size:11.5px}
.bt-cat{font-size:11.5px; color:var(--bt-lav-2); margin-top:3px; overflow-wrap:anywhere}
.bt-side{display:flex; flex-direction:column; align-items:flex-end; gap:5px}
.bt-tag{font-family:var(--bt-disp); font-size:11.5px; font-weight:700; letter-spacing:.06em;
  padding:3px 10px; border-radius:999px; white-space:nowrap; font-variant-numeric:tabular-nums}
.bt-mat{background:var(--bt-panel-2); color:var(--bt-cream)}
.bt-ord{border:1px solid rgba(255,255,255,.16); color:var(--bt-lav)}
.bt-call{background:rgba(255,90,60,.16); color:var(--bt-flame)}
.bt-weigh{background:rgba(76,215,192,.13); color:var(--bt-mint)}
.bt-bye{background:rgba(169,123,255,.16); color:#BFA0FF}
.bt-club{background:rgba(76,215,192,.13); color:var(--bt-mint); letter-spacing:.04em}

.bt-path{grid-column:1 / -1; margin-top:9px; padding-top:9px; border-top:1px dashed var(--bt-hair);
  display:flex; align-items:center; gap:7px; flex-wrap:wrap}
.bt-pl{font-size:10.5px; letter-spacing:.1em; color:var(--bt-lav-3); white-space:nowrap}
.bt-step{display:inline-flex; align-items:baseline; gap:6px; padding:3px 10px; border-radius:999px;
  background:rgba(255,255,255,.045); border:1px solid var(--bt-hair); white-space:nowrap}
.bt-r{font-size:10.5px; color:var(--bt-lav-2)}
.bt-h{font-family:var(--bt-disp); font-weight:700; font-size:13px; color:var(--bt-lav);
  font-variant-numeric:tabular-nums}
.bt-o{font-size:10px; color:var(--bt-lav-3); font-variant-numeric:tabular-nums}
.bt-fin{background:rgba(255,90,60,.12); border-color:rgba(255,90,60,.35)}
.bt-fin .bt-r,.bt-fin .bt-h{color:var(--bt-flame)}

.bt-empty{padding:30px 16px; text-align:center; color:var(--bt-lav-2); font-size:13px;
  background:var(--bt-panel); border:1px solid var(--bt-hair); border-radius:16px}

.bt-foot{margin-top:34px; padding-top:18px; border-top:1px solid var(--bt-hair);
  display:flex; flex-direction:column; gap:7px}
.bt-foot h3{margin:0 0 3px; font-family:var(--bt-disp); font-weight:700; font-size:13px;
  letter-spacing:.14em; text-transform:uppercase; color:var(--bt-lav-2)}
.bt-foot p{margin:0; font-size:12px; color:var(--bt-lav-2)}
.bt-foot b{color:var(--bt-lav)}
.bt-foot a{color:var(--bt-lav); text-decoration:underline}

@media (max-width:540px){
  .bt-row{grid-template-columns:auto 1fr; gap:10px}
  .bt-side{grid-column:1 / -1; flex-direction:row; align-items:center; flex-wrap:wrap;
    justify-content:flex-start; gap:6px; margin-top:2px}
  .bt-grp-head{top:98px}
}
@media (prefers-reduced-motion: reduce){ .bt-root *{transition:none !important} }
`;
