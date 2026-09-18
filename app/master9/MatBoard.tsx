"use client";

import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ *
 *  第9回全日本マスター柔術オープントーナメント（JBJJF）
 *  2026年9月20日(日) 横浜武道館 武道場 / 9:00開場 / 全5マット
 *
 *  出典: https://www.jbjjf.com/upcoming-events/al_mop9/ のトーナメント表PDF
 *  全60ページから所属 "ARTA" の30名・31試合（初戦）を抽出
 * ------------------------------------------------------------------ */

/** [マット, 試合順, カテゴリ, 選手, 相手, 相手所属, 集合, 計量, 試合開始, シード] */
type Row = [string, number, string, string, string, string, string, string, string, 0 | 1];

const R: Row[] = [
["1",1,"マスター2黒帯ライトフェザー級 -64.00kg（2人）","柳沼パウロセザル Paulo Yaginuma","古間木崇宏 Takahiro Furumaki","パラエストラ八王子","9:00","9:20","9:30",0],
["1",9,"女子マスター2黒帯ルースター級 -48.50kg（2人）","DeniseJoanna Visda Tan","鎌田有理枝 Yurie Kamada","フィジカルスペース柔術アカデミー","9:40","10:00","10:10",0],
["1",10,"女子マスター3茶帯ライトフェザー級 -53.50kg（2人）","齋藤悠子 Yuko Saito","尾崎加世子 Kayoko Ozaki","PATO STUDIO","9:45","10:05","10:15",0],
["1",64,"女子マスター2青帯ライトフェザー級 -53.50kg（3人）","羽中田みな美 Minami Hanakata","田口舞花 Maika Taguchi","Carpe Diem Machida","13:55","14:45","14:55",0],
["1",81,"女子マスター2紫帯ライトフェザー級 -53.50kg（7人）","中山かるら Karura Nakayama","髙山安奈 Anna Takayama","CARPE DIEM SHONAN","15:14","16:12","16:22",0],
["2",19,"マスター1紫帯ミドル級 -82.30kg（3人）","安田昌平 Shohei Yasuda","出口力也 Rikiya Deguchi","Carpe Diem Shibuya","10:33","11:00","11:10",0],
["2",73,"マスター4茶帯ライト級 -76.00kg（4人）","橋爪雅樹 Masaki Hashizume","田谷安之 Yasuyuki Taya","トライフォース柔術アカデミー","14:40","15:34","15:44",0],
["2",83,"マスター3茶帯ライトフェザー級 -64.00kg（13人）","関谷祐治 Yuji Sekiya","迫慶太 Keita Sako","CARPE DIEM YOKOHAMA","15:25","16:24","16:34",0],
["2",86,"マスター3茶帯ライトフェザー級 -64.00kg（13人）","松川慶太郎 Keitaro Matsukawa","琢磨修一 Shuichi Takuma","飛翔塾 SORA","15:38","16:39","16:49",0],
["2",102,"マスター1紫帯オープンクラス OPEN（3人）","安田昌平 Shohei Yasuda","2-96（桑原隆志／森岡祥彬）の敗者","","16:51","18:00","18:10",1],
["3",5,"マスター2紫帯ライトフェザー級 -64.00kg（7人）","石原遼平 Ryohei Ishihara","村上翔悟 Shogo Murakami","Carpe Diem芦屋","9:20","9:40","9:50",0],
["3",14,"マスター3紫帯ライト級 -76.00kg（7人）","吉田勝観 Shokan Yoshida","上川聡一郎 Soichiro Kamikawa","Carpe Diem Fukagawa","10:01","10:25","10:35",0],
["3",34,"マスター3紫帯ルースター級 -57.50kg（3人）","塚越太史 Taishi Tsukagoshi","堀内亮介 Ryosuke Horiuchi","パラエストラ吉祥寺","11:31","12:06","12:16",0],
["3",35,"マスター5紫帯ミドル級 -82.30kg（3人）","東忠男 Tadao Azuma","矢舗秀和 Hidekazu Yashiki","ゼロ戦クラブ","11:36","12:11","12:21",0],
["3",39,"マスター5紫帯ライト級 -76.00kg（6人）","山口昇吾 Shogo Yamaguchi","多葉好弘 Yoshihiro Taba","トライフォース柔術アカデミー","11:54","12:31","12:41",0],
["3",46,"マスター5紫帯ライト級 -76.00kg（6人）","齋藤敦 Atsushi Saito","3-40（佐川太郎／Park Jaechul）の勝者","","12:25","13:06","13:16",1],
["3",51,"マスター4紫帯フェザー級 -70.00kg（15人）","木村岳央 Takehisa Kimura","藤田武也 Takeya Fujita","レナトゥス柔術アカデミー","12:48","13:31","13:41",0],
["3",79,"マスター5紫帯ライトフェザー級 -64.00kg（12人）","小池誠宏 Masahiro Koike","3-73（岩間茂夫／林裕一朗）の勝者","","14:54","15:51","16:01",1],
["4",10,"マスター2青帯フェザー級 -70.00kg（19人）","近藤克哉 Katsuya Kondo","後藤判士郎 Hanshiro Goto","トライフォース柔術アカデミー","9:45","10:05","10:15",0],
["4",23,"マスター2青帯ミドル級 -82.30kg（7人）","関根幹祐 Mikisuke Sekine","折笠慎也 Shinya Orikasa","トライフォース柔術アカデミー","10:41","11:10","11:20",0],
["4",35,"マスター2青帯ライトフェザー級 -64.00kg（9人）","今成宏幸 Hiroyuki Imanari","斎藤孝晴 Takaharu Saito","CARPE DIEM SHONAN","11:35","12:10","12:20",0],
["4",53,"マスター1青帯フェザー級 -70.00kg（17人）","橋爪貴 Takashi Hashizume","村山弘毅 Hiroki Murayama","Carpe Diem Shibuya","12:56","13:40","13:50",0],
["4",61,"マスター1青帯フェザー級 -70.00kg（17人）","松下智紀 Tomoki Matsushita","高壮一郎 Soichiro Ko","リバーサルジム川口リディプス","13:32","14:20","14:30",0],
["4",79,"マスター3青帯ライトフェザー級 -64.00kg（13人）","高野慎一 Shinichi Takano","鈴木勇策 Yusaku Suzuki","CHECKMAT CDJJ TOKYO","14:53","15:50","16:00",0],
["4",102,"マスター2青帯ルースター級 -57.50kg（4人）","長瀬優秀 Masahide Nagase","伊藤智哉 Tomoya Ito","Carpe Diem Nagoya","16:36","17:45","17:55",0],
["5",24,"マスター4青帯ライトフェザー級 -64.00kg（12人）","榎本欣泰 Yoshiyasu Enomoto","延命寺誠 Makoto Emmeiji","パラエストラ東大阪","10:45","11:15","11:25",0],
["5",35,"マスター3青帯ライト級 -76.00kg（13人）","川﨑英世 Hideyo Kawasaki","佐藤大 Dai Sato","ねわざワールド品川","11:35","12:10","12:20",0],
["5",69,"マスター3青帯フェザー級 -70.00kg（15人）","川口竜 Ryo Kawaguchi","佐藤明夫 Akio Sato","TOYATT","14:08","15:00","15:10",0],
["5",90,"マスター4青帯フェザー級 -70.00kg（16人）","相樂喜一郎 Kiichiro Sagara","佐藤昌光 Shoko Sato","トライフォース柔術アカデミー","15:42","16:45","16:55",0],
["5",92,"マスター4青帯フェザー級 -70.00kg（16人）","水上旭 Akira Mizukami","鈴木浩司 Koji Suzuki","リバーサルジム川口リディプス","15:51","16:55","17:05",0],
["5",95,"マスター4青帯フェザー級 -70.00kg（16人）","財満栄治 Eiji Zaima","土屋正昭 Masaaki Tsuchiya","シュラプネル柔術アカデミー","16:05","17:10","17:20",0],
];

/** マットごとの総試合数 */
const TOT: Record<string, number> = { "1": 121, "2": 121, "3": 125, "4": 123, "5": 124 };

type Match = {
  mat: string; num: number; cat: string; belt: string; name: string;
  opp: string; team: string; call: string; weigh: string; start: string;
  bye: boolean; mins: number; tot: number;
};

const M: Match[] = R.map((r) => {
  const belt = (r[2].match(/(白|青|紫|茶|黒)帯/) || [])[1] || "白";
  const [h, m] = r[8].split(":");
  return {
    mat: r[0], num: r[1], cat: r[2], belt, name: r[3], opp: r[4], team: r[5],
    call: r[6], weigh: r[7], start: r[8], bye: r[9] === 1,
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
        ? [{ key: "d", color: "var(--m9-flame)", title: "9月20日（日）", meta: `${l.length}試合`, list: l }]
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
          color: `var(--m9-belt-${l[0].belt})`,
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
          color: "var(--m9-lav)",
          title: `MAT ${mt}`,
          meta: `ARTA ${l.length}試合 ／ 全${l[0].tot}試合`,
          list: l,
        };
      });
  }, [rows, view]);

  return (
    <div className="m9-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="m9-wrap">
        <header className="m9-hero">
          <span className="m9-badge">9.20 SUN — 横浜武道館</span>
          <h1>
            第9回 全日本マスター
            <br />
            柔術オープントーナメント
            <span className="m9-sub2">9th ALL JAPAN MASTER JIU-JITSU OPEN</span>
          </h1>
          <p className="m9-lede">
            <span className="m9-team">ARTA</span>
            <span><b>30</b>名</span>
            <span><b>31</b>試合</span>
            <span><b>5</b>マット</span>
            <span>9:00開場</span>
          </p>
        </header>

        <div className="m9-note">
          <div>
            JBJJFのトーナメント表（PDF）から<b>ARTA所属の初戦だけを抽出</b>した非公式の一覧です。
            <b>集合時間までに会場入り</b>してください。時刻は目安で、進行により大幅に前後します。
          </div>
        </div>

        <div className="m9-controls">
          <div className="m9-pills" role="group" aria-label="並び順">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                className="m9-p"
                aria-pressed={view === v.id}
                onClick={() => setView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
          <input
            className="m9-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="選手名で検索"
            aria-label="選手名で検索"
          />
        </div>

        <section>
          {groups.length === 0 ? (
            <p className="m9-empty">該当する選手がいません。検索語を変えてみてください。</p>
          ) : (
            groups.map((g) => (
              <section className="m9-grp" key={g.key}>
                <div className="m9-grp-head">
                  <span
                    className="m9-dot"
                    style={{ background: g.color, boxShadow: `0 0 14px ${g.color}` }}
                  />
                  <h2>{g.title}</h2>
                  <span className="m9-meta">{g.meta}</span>
                </div>
                <div className="m9-rows">
                  {g.list.map((m) => (
                    <div
                      className="m9-row"
                      key={`${m.mat}-${m.num}-${m.name}`}
                      style={{ borderLeftColor: `var(--m9-belt-${m.belt})` }}
                    >
                      <div className="m9-clock">
                        <span className="m9-t">{m.start}</span>
                        <span className="m9-lb">試合開始</span>
                      </div>
                      <div className="m9-main">
                        <span className="m9-nm">{m.name}</span>
                        <span className="m9-op">
                          <span className="m9-vs">VS</span>
                          {m.opp}
                          {m.team ? <span className="m9-tm"> {m.team}</span> : null}
                        </span>
                        <span className="m9-cat">{m.cat}</span>
                      </div>
                      <div className="m9-side">
                        {m.bye ? <span className="m9-tag m9-bye">シード</span> : null}
                        <span className="m9-tag m9-call">集合 {m.call}</span>
                        <span className="m9-tag m9-weigh">計量 {m.weigh}</span>
                        <span className="m9-tag m9-mat">MAT {m.mat}</span>
                        <span className="m9-tag m9-ord">
                          {m.num} / {m.tot}試合目
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </section>

        <footer className="m9-foot">
          <h3>読み方</h3>
          <p>
            「2-19」は<b>2マット19試合目</b>という意味です。「19 / 121試合目」の分母はそのマットの全試合数。あと何試合かは同じマットの中で数えてください。
          </p>
          <p>
            オレンジの<b>集合</b>が会場に居るべき時刻、ミントの<b>計量</b>が計量の目安、大きい数字が<b>試合開始</b>の目安です。集合時間を過ぎると失格になることがあります。
          </p>
          <p>
            ここに出ているのは<b>初戦のみ</b>です。勝ち上がった後の試合はトーナメント表で確認してください。<b>シード</b>の選手は相手が前の試合の勝者（または敗者）になります。
          </p>
          <p>
            出典：
            <a href="https://www.jbjjf.com/upcoming-events/al_mop9/" target="_blank" rel="noopener noreferrer">
              JBJJF 第9回全日本マスター柔術オープントーナメント
            </a>
            （トーナメント表PDF・全60ページ）
          </p>
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  スタイル（すべて .m9-root 配下にスコープ）
 *  LINE Seed は /public/fonts/ の既存ファイルを参照
 * ------------------------------------------------------------------ */
const CSS = `
@font-face{font-family:"LINE Seed JP";font-weight:400;font-display:swap;src:url("/fonts/LINESeedJP_OTF_Rg.woff2") format("woff2")}
@font-face{font-family:"LINE Seed JP";font-weight:700;font-display:swap;src:url("/fonts/LINESeedJP_OTF_Bd.woff2") format("woff2")}
@font-face{font-family:"LINE Seed Sans";font-weight:400;font-display:swap;src:url("/fonts/LINESeedSans_W_Rg.woff2") format("woff2")}
@font-face{font-family:"LINE Seed Sans";font-weight:700;font-display:swap;src:url("/fonts/LINESeedSans_W_Bd.woff2") format("woff2")}

.m9-root{
  --m9-ground:#100E1F; --m9-panel:#1A1730; --m9-panel-2:#2A2547;
  --m9-cream:#F5F2EA; --m9-lav:#CFC9EC; --m9-lav-2:#ADA7CE; --m9-lav-3:#6E6892;
  --m9-flame:#FF5A3C; --m9-mint:#4CD7C0;
  --m9-hair:rgba(255,255,255,.08);
  --m9-belt-白:#E8E6F0; --m9-belt-青:#4C8DFF; --m9-belt-紫:#A97BFF;
  --m9-belt-茶:#C08457; --m9-belt-黒:#7C83A0;
  --m9-disp:"LINE Seed Sans","LINE Seed JP",-apple-system,BlinkMacSystemFont,sans-serif;
  --m9-body:"LINE Seed JP","LINE Seed Sans","Hiragino Sans","Yu Gothic",sans-serif;

  min-height:100vh; background:var(--m9-ground); color:var(--m9-cream);
  font-family:var(--m9-body); line-height:1.6; -webkit-font-smoothing:antialiased;
}
.m9-root *{box-sizing:border-box}
.m9-wrap{max-width:940px; margin:0 auto; padding:0 14px 76px}

.m9-hero{padding:34px 4px 24px; display:flex; flex-direction:column; gap:14px}
.m9-badge{align-self:flex-start; background:var(--m9-flame); color:#fff; font-family:var(--m9-disp);
  font-weight:700; font-size:12px; letter-spacing:.1em; text-transform:uppercase;
  padding:7px 15px; border-radius:999px}
.m9-root h1{margin:0; font-family:var(--m9-disp); font-weight:700;
  font-size:clamp(28px,6.6vw,50px); line-height:1.08; letter-spacing:-.01em; text-wrap:balance}
.m9-sub2{display:block; font-size:clamp(13px,3vw,19px); letter-spacing:.02em;
  color:var(--m9-lav-2); margin-top:9px; font-weight:700; text-transform:uppercase}
.m9-lede{margin:0; display:flex; align-items:baseline; gap:10px; flex-wrap:wrap;
  font-size:13px; color:var(--m9-lav-2)}
.m9-team{font-family:var(--m9-disp); font-weight:700; font-size:17px;
  letter-spacing:.16em; color:var(--m9-flame)}
.m9-lede b{color:var(--m9-cream); font-family:var(--m9-disp); font-weight:700; font-size:17px;
  font-variant-numeric:tabular-nums; margin-right:1px}

.m9-note{display:flex; gap:9px; background:var(--m9-panel); border:1px solid var(--m9-hair);
  border-left:4px solid var(--m9-lav-3); border-radius:14px;
  padding:12px 15px; font-size:12.5px; color:var(--m9-lav-2); margin-bottom:20px}
.m9-note b{color:var(--m9-cream); font-weight:700}

.m9-controls{position:sticky; top:0; z-index:20; padding:12px 0;
  background:rgba(16,14,31,.92); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
  display:flex; gap:9px; flex-wrap:wrap; align-items:center}
.m9-pills{display:flex; gap:7px; flex-wrap:wrap}
.m9-p{appearance:none; cursor:pointer; border:1px solid var(--m9-hair); background:var(--m9-panel);
  color:var(--m9-lav); font-family:var(--m9-body); font-size:12.5px; padding:7px 16px;
  border-radius:999px; transition:background .15s,color .15s,border-color .15s}
.m9-p[aria-pressed="true"]{background:var(--m9-lav); border-color:var(--m9-lav); color:var(--m9-ground)}
.m9-p:focus-visible{outline:2px solid var(--m9-lav); outline-offset:2px}
.m9-search{flex:1 1 190px; min-width:160px; background:var(--m9-panel); border:1px solid var(--m9-hair);
  border-radius:999px; color:var(--m9-cream); font-family:var(--m9-body); font-size:12.5px; padding:7px 15px}
.m9-search::placeholder{color:var(--m9-lav-3)}
.m9-search:focus-visible{outline:2px solid var(--m9-lav); outline-offset:1px}

.m9-grp{margin-bottom:6px}
.m9-grp-head{display:flex; align-items:center; gap:10px; padding:22px 4px 12px;
  position:sticky; top:56px; z-index:10;
  background:rgba(16,14,31,.92); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px)}
.m9-dot{width:12px; height:12px; border-radius:50%; flex:none}
.m9-grp-head h2{margin:0; font-family:var(--m9-disp); font-weight:700; font-size:19px;
  letter-spacing:.05em; text-transform:uppercase; min-width:0; overflow-wrap:anywhere}
.m9-meta{margin-left:auto; font-size:11px; letter-spacing:.07em; color:var(--m9-lav-2);
  white-space:nowrap; font-variant-numeric:tabular-nums}
.m9-rows{display:flex; flex-direction:column; gap:8px}

.m9-row{display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center;
  padding:12px 15px; border-radius:16px; background:var(--m9-panel);
  border:1px solid var(--m9-hair); border-left-width:4px; border-left-style:solid}
.m9-clock{display:flex; flex-direction:column; align-items:flex-start; gap:3px}
.m9-t{font-family:var(--m9-disp); font-weight:700; font-size:23px; line-height:1;
  font-variant-numeric:tabular-nums; color:var(--m9-cream)}
.m9-lb{font-size:9.5px; letter-spacing:.12em; color:var(--m9-lav-3)}
.m9-main{min-width:0; display:flex; flex-direction:column; gap:2px}
.m9-nm{font-size:15.5px; font-weight:700; line-height:1.35; overflow-wrap:anywhere}
.m9-op{font-size:13px; color:var(--m9-lav); line-height:1.4; overflow-wrap:anywhere}
.m9-vs{font-family:var(--m9-disp); font-weight:700; font-size:11px; letter-spacing:.12em;
  color:var(--m9-flame); margin-right:6px}
.m9-tm{color:var(--m9-lav-2); font-size:11.5px}
.m9-cat{font-size:11.5px; color:var(--m9-lav-2); margin-top:3px; overflow-wrap:anywhere}
.m9-side{display:flex; flex-direction:column; align-items:flex-end; gap:5px}
.m9-tag{font-family:var(--m9-disp); font-size:11.5px; font-weight:700; letter-spacing:.06em;
  padding:3px 10px; border-radius:999px; white-space:nowrap; font-variant-numeric:tabular-nums}
.m9-mat{background:var(--m9-panel-2); color:var(--m9-cream)}
.m9-ord{border:1px solid rgba(255,255,255,.16); color:var(--m9-lav)}
.m9-call{background:rgba(255,90,60,.16); color:var(--m9-flame)}
.m9-weigh{background:rgba(76,215,192,.13); color:var(--m9-mint)}
.m9-bye{background:rgba(169,123,255,.16); color:#BFA0FF}

.m9-empty{padding:30px 16px; text-align:center; color:var(--m9-lav-2); font-size:13px;
  background:var(--m9-panel); border:1px solid var(--m9-hair); border-radius:16px}

.m9-foot{margin-top:34px; padding-top:18px; border-top:1px solid var(--m9-hair);
  display:flex; flex-direction:column; gap:7px}
.m9-foot h3{margin:0 0 3px; font-family:var(--m9-disp); font-weight:700; font-size:13px;
  letter-spacing:.14em; text-transform:uppercase; color:var(--m9-lav-2)}
.m9-foot p{margin:0; font-size:12px; color:var(--m9-lav-2)}
.m9-foot b{color:var(--m9-lav)}
.m9-foot a{color:var(--m9-lav); text-decoration:underline}

@media (max-width:540px){
  .m9-row{grid-template-columns:auto 1fr; gap:10px}
  .m9-side{grid-column:1 / -1; flex-direction:row; align-items:center; flex-wrap:wrap;
    justify-content:flex-start; gap:6px; margin-top:2px}
  .m9-grp-head{top:98px}
}
@media (prefers-reduced-motion: reduce){ .m9-root *{transition:none !important} }
`;
