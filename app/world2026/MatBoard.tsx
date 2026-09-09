"use client";

import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ *
 *  SJJIF World Championship 2026 / World No-Gi Championship 2026
 *  ARTA所属選手のタイムテーブル
 *
 *  データ出典: ASJJF公開ブラケット（asjjf.org）
 *  全1,054ブラケット / 4,933試合から所属 "Arta" の107試合を抽出
 * ------------------------------------------------------------------ */

/** [大会ID, 日付, マット, 試合番号, 時刻, カテゴリ, ARTA選手, 相手, 相手チーム, ブラケットID] */
type Row = [
  string, string, string, number, string, string, string, string, string, string
];

const R: Row[] = [
["1844","9/3","1",3,"10:59","男性 青 アダルト 18 ライトフェザー","Takamatsu Itsuki","Kagata Hirotaka","Blue House","1142825"],
["1844","9/3","1",6,"11:20","男性 青 アダルト 18 ライトフェザー","Takamatsu Itsuki","山下 ゆうき","Submit MMA","1142825"],
["1844","9/3","1",10,"11:45","男性 青 アダルト 18 ライトフェザー","Takamatsu Itsuki","Takamoto Tetsuji","Takamoto Dojo","1142825"],
["1844","9/3","16",19,"12:42","男性 茶 マスター 51 フェザー","裕典 尾上","Chien Chih-yuan","Hsinchu B J J","1143096"],
["1844","9/3","16",23,"12:58","男性 茶 マスター 51 フェザー","裕典 尾上","甲良 哲也","Ground Core Kyoto","1143096"],
["1843","9/4","12",19,"10:06","男性 紫 マスター 46 ライトフェザー","高橋 健太郎","Iba Shinsuke","Tatoru","1141876"],
["1843","9/4","13",17,"10:10","男性 白 マスター 41 ライトフェザー","佐伯 幸勅","阿部 哲紘","Grabaka Jiu-jitsu Club","1141806"],
["1843","9/4","13",21,"10:26","男性 白 マスター 41 ライトフェザー","佐伯 幸勅","佐藤 直人","Vanguard Jiu Jitsu Japan","1141806"],
["1843","9/4","16",24,"10:40","男性 白 マスター 36 ミドル","野田 翔","Ikeda Thiago","Impacto Bjj Japan","1141759"],
["1843","9/4","13",27,"10:55","男性 白 マスター 30 ライトフェザー","由元 和哉","Chiu Kwok Ho","Twft Military Combat An..","1141706"],
["1843","9/4","16",28,"11:02","男性 白 マスター 36 ミドル","野田 翔","波多野 一樹","Effect","1141759"],
["1843","9/4","13",32,"11:15","男性 白 マスター 30 ライトフェザー","由元 和哉","森岡 海斗","Life Jiu Jitsu Academy","1141706"],
["1843","9/4","13",36,"11:40","男性 白 マスター 30 ライトフェザー","由元 和哉","吉岡 龍馬","Strapple Setagaya Jiyug..","1141706"],
["1843","9/4","9",33,"11:44","男性 茶 マスター 51 フェザー","Utamura Tetsuya","小林 啓太","Paraestra Koiwa","1141937"],
["1843","9/4","8",41,"12:31","男性 茶 マスター 51 ライトフェザー","土山 大選","甲良 哲也","Ground Core Kyoto","1141936"],
["1843","9/4","9",41,"12:32","男性 紫 マスター 51 フェザー","フレイ マティアス","池田 充徳","United Gym Chiba","1141927"],
["1843","9/4","8",42,"12:39","男性 茶 マスター 51 ライトフェザー","裕典 尾上","鈴木 敏和","Newaza World","1141936"],
["1843","9/4","1",45,"12:44","男性 白 マスター 46 フェザー","桑原 優太","荒井 厚寛","Newaza World Utsunomiya","1141857"],
["1843","9/4","8",44,"12:45","男性 茶 マスター 51 ライトフェザー","土山 大選","Okubo Kouji","Tokorozawa Jiu-jitsu","1141936"],
["1843","9/4","5",46,"12:52","男性 茶 マスター 46 フェザー","Furukawa Koji","足立 正","Sora Bjj","1141887"],
["1843","9/4","5",50,"13:19","男性 茶 マスター 46 フェザー","Furukawa Koji","Masaki Koshiro","Submit MMA","1141887"],
["1843","9/4","9",48,"13:19","男性 紫 マスター 51 フェザー","フレイ マティアス","山本 修蔵","Secondout","1141927"],
["1843","9/4","7",52,"13:53","男性 青 マスター 46 ライトフェザー","榎本 欣泰","渡部 亘","Impacto Bjj Japan","1141866"],
["1843","9/4","9",55,"14:03","男性 紫 マスター 51 フェザー","フレイ マティアス","荒巻 存洋","Nova União Japan","1141927"],
["1843","9/4","1",58,"14:05","男性 白 マスター 46 ライトフェザー","市川 裕人","和田 竜介","Hiro Brazilian Jiu-jits..","1141856"],
["1843","9/4","7",56,"14:18","男性 青 マスター 46 ライトフェザー","榎本 欣泰","横溝 英昭","Carpe Diem Yokohama","1141866"],
["1843","9/4","9",57,"14:23","男性 紫 マスター 51 ライト","山口 昇吾","Kim Yeonhong","Yawara","1141928"],
["1843","9/4","11",59,"14:27","女性 茶 マスター 36 ライト","池澤 瑞希","Low Tiffany","Evolve Mma","1142380"],
["1843","9/4","7",60,"14:31","男性 青 マスター 46 ライトフェザー","榎本 欣泰","加藤 英俊","Carpe Diem Kofu","1141866"],
["1843","9/4","9",60,"14:44","男性 紫 マスター 51 ライト","山口 昇吾","横山 恭士","Tri-force Ikebukuro","1141928"],
["1843","9/4","9",62,"14:51","男性 紫 マスター 51 フェザー","フレイ マティアス","内田 潤青","Tribe Tokyo M.m.a","1141927"],
["1843","9/4","13",68,"15:00","男性 白 マスター 56 ライトフェザー","髙山 裕之","鈴木 光一","Submit MMA","1141956"],
["1843","9/4","9",64,"15:02","男性 紫 マスター 51 ライト","山口 昇吾","中村 大介","Newaza World Kawasaki","1141928"],
["1843","9/4","7",63,"15:11","男性 青 マスター 46 ライトフェザー","榎本 欣泰","武田 直幸","Src","1141866"],
["1843","9/4","1",72,"15:23","男性 茶 マスター 61 ルースター","井嶋 一雄","中川 隆司","Carpe Diem Yokohama","1142035"],
["1843","9/4","1",75,"15:39","男性 茶 マスター 61 ルースター","井嶋 一雄","飯本 哲","Paraestra Kichijoji","1142035"],
["1843","9/4","11",84,"16:50","女性 茶 マスター 36 オープンクラス","池澤 瑞希","Wang Wendy","Checkmat","1142384"],
["1843","9/4","1",97,"17:54","男性 黒 マスター 46 フェザー","吉田 直人","濱口 直宏","Master Japan Yamaguchi","1141897"],
["1843","9/4","11",97,"17:59","男性 黒 マスター 41 ライトフェザー","小渡 和久","上野 浩介","Newaza World","1141846"],
["1843","9/4","3",124,"21:39","男性 黒 マスター 30 ルースター","Sasaki Yoichi","De Souza Makoto","Infight Japan","1141745"],
["1843","9/5","4",3,"10:06","男性 青 アダルト 18 ライトフェザー","池谷 馨一","齊藤 璃貴","Fight Holic","1141666"],
["1843","9/5","4",7,"10:34","男性 青 アダルト 18 ライトフェザー","池谷 馨一","山本 岳日斗","Kussano Team","1141666"],
["1843","9/5","4",12,"10:59","男性 青 アダルト 18 ライトフェザー","池谷 馨一","田中 大渡","Gracie Barra Japan","1141666"],
["1843","9/5","4",13,"11:07","男性 青 アダルト 18 ヘビー","王 愷","アコスタ 英二","Infight Japan","1141671"],
["1844","9/5","3",19,"11:16","男性 灰 キッズ 2 フェザー","脇丸 俊一郎","Tsai Mu Cheng","Taiwan B J J Linkou","1142613"],
["1844","9/5","13",23,"12:33","女性 灰 キッズ 4 フェザー","薮内 椿","Lee Kyra","Deftac Six Blades Jiu-j..","1143287"],
["1844","9/5","13",26,"12:43","女性 灰 キッズ 4 フェザー","薮内 椿","Carlsson Nytomt Yrsa","Other","1143287"],
["1844","9/5","9",47,"13:55","男性 灰 キッズ 4 ルースター","Kasuga Mitsuki","Golez Nathan","Deftac Choking Grounds","1142664"],
["1843","9/5","2",50,"14:02","女性 白 アダルト 18 フェザー","青島 クロエ","佐藤 愛里","Jiu Jitsu And Mma Acade..","1142275"],
["1844","9/5","9",53,"14:16","男性 灰 キッズ 4 ルースター","Kasuga Mitsuki","Joson Tomas V","Deftac Greenhills Dojo ..","1142664"],
["1844","9/5","15",54,"14:22","男性 灰 キッズ 6 ルースター","平澤 蒼唯","前田 英吉","Triskelion Bjj Academy","1142754"],
["1843","9/5","8",52,"15:23","男性 青 アダルト 18 オープンクラス","王 愷","佐藤 竜馬","Holoimua","1141674"],
["1843","9/6","1",4,"9:19","男性 白 キッズ 4 ライト","島村 圭","Natsume Zen","Infight Japan","1141499"],
["1843","9/6","12",5,"9:19","男性 灰 キッズ 4 ライト","笹嶋 奏桜","Sim Aaron","Evolve Mma","1141508"],
["1843","9/6","11",4,"9:20","男性 灰 キッズ 4 ライト","海老名 理","柏田 笑玖","Senba Jiu-jitsu","1141508"],
["1843","9/6","7",7,"9:20","女性 灰 キッズ 4 フェザー","薮内 椿","キムラ アラナ美結","Pato Studio","1142128"],
["1843","9/6","2",7,"9:24","男性 灰 キッズ 3 ライト","橋尾 立希","Haque Musashi","Carpe Diem Yokohama","1141475"],
["1843","9/6","6",9,"9:32","男性 白 キッズ 3 フェザー","宇佐美 湖清","足水 慶","Triforce Tenma","1141466"],
["1843","9/6","2",14,"9:46","男性 灰 キッズ 3 ライト","橋尾 立希","Kyutoku Masato","Carlos Toyota Bjj","1141475"],
["1843","9/6","11",10,"9:47","男性 灰 キッズ 4 ライト","海老名 理","Yin Xiaoyi","Evolve Mma","1141508"],
["1843","9/6","7",12,"9:48","女性 灰 キッズ 4 フェザー","薮内 椿","Kuribayashi Karin","Paraestra Fukuoka Ide D..","1142128"],
["1843","9/6","4",11,"9:49","男性 灰 キッズ 4 ミドル","Kuno Ryoma","Abagon Andre Nicolas","Deftac Six Blades Jiu-j..","1141509"],
["1843","9/6","14",14,"9:57","男性 灰 キッズ 2 フェザー","Watai Hugh","Hyde Broly","Grappling Bros","1141454"],
["1843","9/6","8",15,"10:00","男性 灰 キッズ 2 ライトフェザー","脇丸 俊一郎","中田 樹希","Team Kizuna","1141453"],
["1843","9/6","2",18,"10:03","男性 灰 キッズ 3 ライト","橋尾 立希","王 若川","Gracie Barra Shunyi China","1141475"],
["1843","9/6","13",14,"10:03","女性 灰 キッズ 3 ルースター","原島 麗空","Aguilar Aleia Aielle","Deftac Six Blades Jiu-j..","1142093"],
["1843","9/6","12",22,"10:20","男性 灰 キッズ 4 ライト","海老名 理","Syofyan Omar","The Gc","1141508"],
["1843","9/6","7",17,"10:20","女性 灰 キッズ 4 フェザー","薮内 椿","亀山 芭奈","Carpe Diem Hope","1142128"],
["1843","9/6","13",24,"10:33","男性 灰 キッズ 4 ミディアムヘビー","吉崎 龍成","大西 弥太郎","Paraestra Koiwa","1141510"],
["1843","9/6","11",23,"10:40","男性 青 ジュベナイル 16-17 ライトフェザー","Kasuga Yuito","Cabugoy Sergiogabri..","Over Limit Jiu Jitsu Cebu","1141639"],
["1843","9/6","13",28,"10:48","男性 灰 キッズ 4 ミディアムヘビー","吉崎 龍成","Bowater Hudson","Oceanside Jiu Jitsu Nz","1141510"],
["1843","9/6","11",29,"11:16","男性 青 ジュベナイル 16-17 ライトフェザー","Kasuga Yuito","森本 颯","Alma Fight Gym Homies","1141639"],
["1843","9/6","11",35,"11:37","男性 青 ジュベナイル 16-17 ライトフェザー","Kasuga Yuito","倉岡 和也","Yaway Jiu-jitsu Academy","1141639"],
["1843","9/6","9",40,"11:44","男性 青 ジュベナイル 16-17 フェザー","岩澤 新","渡辺 大翔","Buffalo Jiu-jitsu","1141640"],
["1843","9/6","9",42,"11:58","男性 青 ジュベナイル 16-17 フェザー","岩澤 新","渡邊 陽成","Newaza World Shinagawa","1141640"],
["1843","9/6","10",39,"12:16","男性 青 ジュベナイル 16-17 フェザー","岩澤 新","Bilguuntei Bilegtii","Asm Bjj International","1141640"],
["1843","9/6","10",40,"12:42","男性 青 ジュベナイル 16-17 フェザー","岩澤 新","田中 仁","Burst","1141640"],
["1843","9/6","9",51,"13:29","女性 黄 キッズ 5 ライト","Mia Kuno","Regan Kora","Goioere Bjj Team","1142183"],
["1843","9/6","15",53,"13:37","男性 白 キッズ 2 ライトフェザー","近本 彪悟　アシキン","河野 耀大朗","Tatoru","1141447"],
["1843","9/6","7",54,"13:40","女性 灰 キッズ 3 フェザー","久能 莉奈","井内 翠々","The Academy Byron Bay","1142095"],
["1843","9/6","2",55,"13:43","男性 黄 キッズ 5 フェザー","Manoa Aoki","鈴木 秋人","Ishitsuna Mma","1141561"],
["1843","9/6","7",53,"13:44","女性 灰 キッズ 3 フェザー","梶間 千晶","丁 凌晴","Mavericks","1142095"],
["1843","9/6","2",57,"13:45","男性 黄 キッズ 6 フェザー","鈴木 将之助","野上 蒼太","Axis Yokohama","1141606"],
["1843","9/6","15",58,"13:52","男性 白 キッズ 2 ライトフェザー","近本 彪悟　アシキン","De La Rosa Razer","Over Limit Jiu Jitsu Cebu","1141447"],
["1843","9/6","9",56,"13:52","女性 黄 キッズ 5 ライト","高野 乙梨香","Casella Tahlia","Goioere Bjj Team","1142183"],
["1843","9/6","7",58,"13:56","女性 灰 キッズ 3 フェザー","梶間 千晶","Victa Jairah","Deftac Six Blades Jiu-j..","1142095"],
["1843","9/6","2",59,"13:58","男性 黄 キッズ 5 フェザー","Manoa Aoki","塩田 義晨","Tatoru","1141561"],
["1843","9/6","4",57,"13:59","男性 白 キッズ 3 ライト","芦田 淳平","Duurenbaatar Jamiya..","Glory- Jiu Jitsu - Mma ..","1141467"],
["1843","9/6","7",59,"14:03","女性 灰 キッズ 3 フェザー","久能 莉奈","Ngo-nguyen Dakota M..","High Rollers Australia","1142095"],
["1843","9/6","2",63,"14:06","男性 黄 キッズ 6 フェザー","鈴木 将之助","Mitsuo Henrique","Impacto Bjj Japan","1141606"],
["1843","9/6","16",61,"14:06","女性 灰 キッズ 5 フェザー","平澤 杏南","Oyobe Lily","Ivan Sakamoto Bjj Okinawa","1142173"],
["1843","9/6","4",61,"14:14","男性 白 キッズ 3 ライト","芦田 淳平","Kawai Hidetsugu","Impacto Bjj Japan","1141467"],
["1843","9/6","15",65,"14:16","男性 灰 キッズ 4 ルースター","Kasuga Mitsuki","原田 琉生","Carpe Diem Bjj Sendai","1141505"],
["1843","9/6","2",62,"14:16","男性 黄 キッズ 5 フェザー","Manoa Aoki","三好 朔弥","Sonic Squad","1141561"],
["1843","9/6","15",67,"14:30","男性 灰 キッズ 4 ルースター","Toyama Noah","朱 以宸","Taiwan B J J","1141505"],
["1843","9/6","16",64,"14:33","女性 灰 キッズ 5 フェザー","平澤 杏南","辻 智佳子","Carpe Diem Yokohama","1142173"],
["1843","9/6","1",61,"14:34","男性 黄 キッズ 6 フェザー","高橋 勘輔","De Lima Julian","Braves Jiu-jitsu","1141606"],
["1843","9/6","15",71,"14:41","男性 灰 キッズ 4 ルースター","Kasuga Mitsuki","戸村 英心","Tri-force Hikarigaoka","1141505"],
["1843","9/6","15",70,"14:43","男性 灰 キッズ 4 ルースター","Toyama Noah","Joson Tomas V","Deftac Greenhills Dojo ..","1141505"],
["1843","9/6","1",64,"14:50","男性 黄 キッズ 6 フェザー","高橋 勘輔","川合 開世","Base Bjj","1141606"],
["1843","9/6","3",75,"14:58","男性 黄 キッズ 6 ライト","麻生 海太","Chico Prince","Carpe Diem","1141607"],
["1843","9/6","15",77,"15:12","男性 灰 キッズ 4 ルースター","Kasuga Mitsuki","Joson Tomas V","Deftac Greenhills Dojo ..","1141505"],
["1843","9/6","2",78,"15:19","男性 黄 キッズ 6 ルースター","Toyama Kevin","Araujo Ian","Other","1141604"],
["1843","9/6","10",78,"15:28","男性 白 キッズ 6 フェザー","原口 逸輝","Yaakov Elroy","Abisror Mma","1141588"],
["1843","9/6","10",82,"15:45","男性 白 キッズ 6 フェザー","原口 逸輝","","","1141588"],
["1843","9/6","1",77,"15:49","男性 黄 キッズ 6 フェザー","鈴木 将之助","Ogawa Ryunosuke","Rrt","1141606"],
["1843","9/6","10",86,"16:00","男性 白 キッズ 6 フェザー","原口 逸輝","輪島 蓮","Bellatleo","1141588"],
];

/** そのマット・その日の総試合数 "大会ID|日付|マット" */
const TOT: Record<string, number> = {
  "1843|9/4|1":105,"1843|9/4|11":112,"1843|9/4|12":106,"1843|9/4|13":111,"1843|9/4|16":105,
  "1843|9/4|3":107,"1843|9/4|5":112,"1843|9/4|7":102,"1843|9/4|8":105,"1843|9/4|9":105,
  "1843|9/5|2":47,"1843|9/5|4":32,"1843|9/5|8":39,
  "1843|9/6|1":80,"1843|9/6|10":79,"1843|9/6|11":80,"1843|9/6|12":79,"1843|9/6|13":80,
  "1843|9/6|14":81,"1843|9/6|15":84,"1843|9/6|16":81,"1843|9/6|2":82,"1843|9/6|3":84,
  "1843|9/6|4":80,"1843|9/6|6":80,"1843|9/6|7":76,"1843|9/6|8":80,"1843|9/6|9":83,
  "1844|9/3|1":39,"1844|9/3|16":39,"1844|9/5|13":24,"1844|9/5|15":25,"1844|9/5|3":44,"1844|9/5|9":26,
};

type Day = { d: string; wd: string; jp: string; day: string; ev: string[] };

const DAYS: Day[] = [
  { d: "9/3", wd: "THU", jp: "木", day: "DAY 1", ev: ["1844"] },
  { d: "9/4", wd: "FRI", jp: "金", day: "DAY 2", ev: ["1843"] },
  { d: "9/5", wd: "SAT", jp: "土", day: "DAY 3", ev: ["1843", "1844"] },
  { d: "9/6", wd: "SUN", jp: "日", day: "DAY 4", ev: ["1843"] },
];

type Match = {
  ev: string; date: string; mat: string; num: number; time: string; cat: string;
  belt: string; sex: string; age: string;
  name: string; opp: string; team: string; br: string;
  mins: number; tot: number;
};

const M: Match[] = R.map((r) => {
  const p = r[5].split(" ");
  const [h, m] = r[4].split(":");
  return {
    ev: r[0], date: r[1], mat: r[2], num: r[3], time: r[4], cat: r[5],
    belt: p[1] || "白", sex: p[0], age: p[2],
    name: r[6], opp: r[7] || "未定", team: r[8], br: r[9],
    mins: Number(h) * 60 + Number(m),
    tot: TOT[`${r[0]}|${r[1]}|${r[2]}`] || 0,
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
  const [day, setDay] = useState<string>("9/3");
  const [view, setView] = useState<View>("time");
  const [q, setQ] = useState<string>("");

  const dayRows = useMemo(
    () => M.filter((m) => day === "all" || m.date === day),
    [day]
  );

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? dayRows.filter((m) => m.name.toLowerCase().includes(s)) : dayRows;
  }, [dayRows, q]);

  const stats = useMemo(() => {
    const ath = new Set(dayRows.map((m) => m.name));
    const mats = new Set(dayRows.map((m) => `${m.date}|${m.mat}`));
    return { ath: ath.size, match: dayRows.length, mat: mats.size };
  }, [dayRows]);

  /* ---------- ヒーロー（日付で大会名が切り替わる） ---------- */
  const hero = useMemo(() => {
    if (day === "all") {
      return {
        badge: "4 DAYS — 9.3 → 9.6",
        main: "SJJIF WORLD",
        sub: "CHAMPIONSHIP",
        plus: "＋ WORLD NO-GI CHAMPIONSHIP 2026",
      };
    }
    const d = DAYS.find((x) => x.d === day)!;
    const badge = `${d.day} — ${d.d.replace("/", ".")} ${d.wd}`;
    if (d.ev.length === 1) {
      return d.ev[0] === "1843"
        ? { badge, main: "SJJIF WORLD", sub: "CHAMPIONSHIP", plus: "" }
        : { badge, main: "SJJIF WORLD NO-GI", sub: "CHAMPIONSHIP", plus: "" };
    }
    return {
      badge,
      main: "SJJIF WORLD",
      sub: "CHAMPIONSHIP",
      plus: "＋ WORLD NO-GI CHAMPIONSHIP 2026",
    };
  }, [day]);

  /* ---------- グルーピング ---------- */
  const groups = useMemo(() => {
    if (view === "time") {
      const by: Record<string, Match[]> = {};
      rows.forEach((m) => (by[m.date] = by[m.date] || []).push(m));
      return Object.keys(by)
        .sort((a, b) => Number(a.split("/")[1]) - Number(b.split("/")[1]))
        .map((d) => {
          const l = [...by[d]].sort(byTime);
          const info = DAYS.find((x) => x.d === d)!;
          return {
            key: d,
            color: "var(--wc-flame)",
            title: `${d.replace("/", "月")}日（${info.jp}）`,
            meta: `${l.length}試合`,
            list: l,
          };
        });
    }

    if (view === "ath") {
      const by: Record<string, Match[]> = {};
      rows.forEach((m) => (by[m.name] = by[m.name] || []).push(m));
      return Object.keys(by)
        .map((n) => ({ n, l: [...by[n]].sort(byTime) }))
        .sort((a, b) => a.l[0].mins - b.l[0].mins)
        .map(({ n, l }) => ({
          key: n,
          color: `var(--wc-belt-${l[0].belt})`,
          title: n,
          meta: `${l[0].belt}帯・${l[0].age} ／ ${l.length}試合`,
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
          color: "var(--wc-lav)",
          title: `MAT ${mt}`,
          meta: `ARTA ${l.length}試合 ／ 全${l[0].tot || "?"}試合`,
          list: l,
        };
      });
  }, [rows, view]);

  return (
    <div className="wc-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="wc-wrap">
        <header className="wc-hero">
          <span className="wc-badge">{hero.badge}</span>
          <h1>
            {hero.main}
            <br />
            {hero.sub} <span className="wc-yr">2026</span>
            {hero.plus ? <span className="wc-plus">{hero.plus}</span> : null}
          </h1>
          <p className="wc-lede">
            <span className="wc-team">ARTA</span>
            <span>
              <b>{stats.ath}</b>名
            </span>
            <span>
              <b>{stats.match}</b>試合
            </span>
            <span>
              <b>{stats.mat}</b>マット
            </span>
          </p>
        </header>

        <div className="wc-note">
          <div>
            ASJJFの公開ブラケットから<b>ARTA所属選手の試合だけを抽出</b>した非公式のタイムテーブルです。
            変更が入ることがあるので、正式な情報は大会公式のブラケットをご確認ください。
          </div>
        </div>

        <div className="wc-controls">
          <div className="wc-pills" role="group" aria-label="日付で絞り込み">
            {[...DAYS.map((d) => ({
              id: d.d,
              main: d.d,
              sub: d.wd,
              n: M.filter((m) => m.date === d.d).length,
            })), { id: "all", main: "ALL", sub: "", n: M.length }].map((o) => (
              <button
                key={o.id}
                type="button"
                className="wc-p"
                aria-pressed={day === o.id}
                onClick={() => setDay(o.id)}
              >
                <span className="wc-d">{o.main}</span>
                {o.sub ? <span>{o.sub}</span> : null}
                <span className="wc-c">{o.n}</span>
              </button>
            ))}
          </div>

          <div className="wc-line2">
            <div className="wc-pills" role="group" aria-label="並び順">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className="wc-p wc-v"
                  aria-pressed={view === v.id}
                  onClick={() => setView(v.id)}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <div className="wc-searchwrap">
              <input
                className="wc-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="選手名で検索（例: 山口）"
                aria-label="選手名で検索"
              />
            </div>
          </div>
        </div>

        <section>
          {groups.length === 0 ? (
            <p className="wc-empty">
              該当する試合がありません。日付か検索語を変えてみてください。
            </p>
          ) : (
            groups.map((g) => (
              <section className="wc-grp" key={g.key}>
                <div className="wc-grp-head">
                  <span
                    className="wc-dot"
                    style={{ background: g.color, boxShadow: `0 0 14px ${g.color}` }}
                  />
                  <h2>{g.title}</h2>
                  <span className="wc-meta">{g.meta}</span>
                </div>
                <div className="wc-rows">
                  {g.list.map((m) => (
                    <div
                      className="wc-row"
                      key={`${m.ev}-${m.br}-${m.mat}-${m.num}-${m.name}`}
                      style={{ borderLeftColor: `var(--wc-belt-${m.belt})` }}
                    >
                      <span className="wc-chip">{m.time}</span>
                      <div className="wc-main">
                        <span className="wc-nm">{m.name}</span>
                        <span className="wc-op">
                          <span className="wc-vs">VS</span>
                          {m.opp}
                          {m.team ? <span className="wc-tm"> {m.team}</span> : null}
                        </span>
                        <span className="wc-cat">{m.cat}</span>
                      </div>
                      <div className="wc-side">
                        <span className={`wc-tag ${m.ev === "1843" ? "wc-gi" : "wc-ng"}`}>
                          {m.ev === "1843" ? "GI" : "NO-GI"}
                        </span>
                        <span className="wc-tag wc-mat">MAT {m.mat}</span>
                        <span className="wc-tag wc-ord">
                          {m.num}
                          {m.tot ? ` / ${m.tot}` : ""}試合目
                        </span>
                        <a
                          href={`https://asjjf.org/public/bracketsView/${m.br}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ブラケット
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </section>

        <footer className="wc-foot">
          <h3>読み方</h3>
          <p>
            試合番号は<b>マットごとの通し番号</b>です。「57 / 105試合目」は、そのマットのその日の105試合のうち57番目という意味。あと何試合かは同じマットの中で数えてください。
          </p>
          <p>
            時刻はブラケット上の予定時刻で、進行の遅れは反映されません。当日は自分のマットの進行番号と突き合わせるのが確実です。
          </p>
          <p>
            選手名・チーム名はブラケット上の表記のままです。長い名前は元データの時点で末尾が「..」で省略されています。相手が「未定」の試合は前の試合の勝者待ちです。
          </p>
          <p>
            左の色帯は帯色。出典：
            <a href="https://asjjf.org/" target="_blank" rel="noopener noreferrer">
              ASJJF公開ブラケット
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  スタイル（すべて .wc-root 配下にスコープ）
 *  LINE Seed は /public/fonts/ の既存ファイルを参照
 * ------------------------------------------------------------------ */
const CSS = `
@font-face{font-family:"LINE Seed JP";font-weight:400;font-display:swap;src:url("/fonts/LINESeedJP_OTF_Rg.woff2") format("woff2")}
@font-face{font-family:"LINE Seed JP";font-weight:700;font-display:swap;src:url("/fonts/LINESeedJP_OTF_Bd.woff2") format("woff2")}
@font-face{font-family:"LINE Seed Sans";font-weight:400;font-display:swap;src:url("/fonts/LINESeedSans_W_Rg.woff2") format("woff2")}
@font-face{font-family:"LINE Seed Sans";font-weight:700;font-display:swap;src:url("/fonts/LINESeedSans_W_Bd.woff2") format("woff2")}

.wc-root{
  --wc-ground:#100E1F;
  --wc-panel:#1A1730;
  --wc-panel-2:#2A2547;
  --wc-cream:#F5F2EA;
  --wc-lav:#CFC9EC;
  --wc-lav-2:#ADA7CE;
  --wc-lav-3:#6E6892;
  --wc-flame:#FF5A3C;
  --wc-hair:rgba(255,255,255,.08);
  --wc-belt-白:#E8E6F0; --wc-belt-灰:#9D97C4; --wc-belt-黄:#F5C542; --wc-belt-青:#4C8DFF;
  --wc-belt-紫:#A97BFF; --wc-belt-茶:#C08457; --wc-belt-黒:#7C83A0;
  --wc-disp:"LINE Seed Sans","LINE Seed JP",-apple-system,BlinkMacSystemFont,sans-serif;
  --wc-body:"LINE Seed JP","LINE Seed Sans","Hiragino Sans","Yu Gothic",sans-serif;

  min-height:100vh; background:var(--wc-ground); color:var(--wc-cream);
  font-family:var(--wc-body); line-height:1.6; -webkit-font-smoothing:antialiased;
}
.wc-root *{box-sizing:border-box}
.wc-wrap{max-width:940px; margin:0 auto; padding:0 14px 76px}

/* hero */
.wc-hero{padding:34px 4px 26px; display:flex; flex-direction:column; gap:14px}
.wc-badge{
  align-self:flex-start; background:var(--wc-flame); color:#fff; font-family:var(--wc-disp);
  font-weight:700; font-size:12px; letter-spacing:.1em; text-transform:uppercase;
  padding:7px 15px; border-radius:999px;
}
.wc-root h1{
  margin:0; font-family:var(--wc-disp); font-weight:700;
  font-size:clamp(34px,8.4vw,64px); line-height:.98; letter-spacing:-.02em;
  text-transform:uppercase; text-wrap:balance;
}
.wc-yr{color:var(--wc-lav-2)}
.wc-plus{
  display:block; font-size:clamp(15px,3.4vw,22px); letter-spacing:.02em;
  color:var(--wc-lav-2); margin-top:8px; font-weight:700;
}
.wc-lede{margin:0; display:flex; align-items:baseline; gap:10px; flex-wrap:wrap;
  font-size:13px; color:var(--wc-lav-2)}
.wc-team{font-family:var(--wc-disp); font-weight:700; font-size:17px; letter-spacing:.16em; color:var(--wc-flame)}
.wc-lede b{color:var(--wc-cream); font-family:var(--wc-disp); font-weight:700; font-size:17px;
  font-variant-numeric:tabular-nums; margin-right:1px}

.wc-note{
  display:flex; gap:9px; background:var(--wc-panel); border:1px solid var(--wc-hair);
  border-left:4px solid var(--wc-lav-3); border-radius:14px;
  padding:12px 15px; font-size:12.5px; color:var(--wc-lav-2); margin-bottom:22px;
}
.wc-note b{color:var(--wc-cream); font-weight:700}

/* controls */
.wc-controls{
  position:sticky; top:0; z-index:20; padding:12px 0;
  background:rgba(16,14,31,.92); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
  display:flex; flex-direction:column; gap:9px;
}
.wc-pills{display:flex; gap:7px; flex-wrap:wrap}
.wc-p{
  appearance:none; cursor:pointer; border:1px solid var(--wc-hair); background:var(--wc-panel);
  color:var(--wc-lav); font-family:var(--wc-body); font-size:12.5px; font-weight:400;
  padding:7px 14px; border-radius:999px; display:inline-flex; align-items:baseline; gap:7px;
  transition:background .15s, color .15s, border-color .15s;
}
.wc-d{font-family:var(--wc-disp); font-weight:700; font-size:14px; color:var(--wc-cream)}
.wc-c{font-size:11px; color:var(--wc-lav-2); font-variant-numeric:tabular-nums}
.wc-p[aria-pressed="true"]{background:var(--wc-flame); border-color:var(--wc-flame); color:#fff}
.wc-p[aria-pressed="true"] .wc-d,.wc-p[aria-pressed="true"] .wc-c{color:#fff}
.wc-p:focus-visible{outline:2px solid var(--wc-lav); outline-offset:2px}
.wc-v{padding:7px 16px}
.wc-v[aria-pressed="true"]{background:var(--wc-lav); border-color:var(--wc-lav); color:var(--wc-ground)}
.wc-searchwrap{display:flex; gap:7px; flex:1 1 200px; min-width:170px}
.wc-search{
  flex:1; background:var(--wc-panel); border:1px solid var(--wc-hair); border-radius:999px;
  color:var(--wc-cream); font-family:var(--wc-body); font-size:12.5px; padding:7px 15px;
}
.wc-search::placeholder{color:var(--wc-lav-3)}
.wc-search:focus-visible{outline:2px solid var(--wc-lav); outline-offset:1px}
.wc-line2{display:flex; gap:9px; flex-wrap:wrap; align-items:center}

/* groups */
.wc-grp{margin-bottom:6px}
.wc-grp-head{
  display:flex; align-items:center; gap:10px; padding:22px 4px 12px;
  position:sticky; top:104px; z-index:10;
  background:rgba(16,14,31,.92); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
}
.wc-dot{width:12px; height:12px; border-radius:50%; flex:none}
.wc-grp-head h2{
  margin:0; font-family:var(--wc-disp); font-weight:700; font-size:19px;
  letter-spacing:.05em; text-transform:uppercase; min-width:0; overflow-wrap:anywhere;
}
.wc-meta{margin-left:auto; font-size:11px; letter-spacing:.07em; color:var(--wc-lav-2);
  white-space:nowrap; font-variant-numeric:tabular-nums}
.wc-rows{display:flex; flex-direction:column; gap:8px}

.wc-row{
  display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center;
  padding:12px 15px; border-radius:16px; background:var(--wc-panel);
  border:1px solid var(--wc-hair); border-left-width:4px; border-left-style:solid;
}
.wc-chip{
  justify-self:start; font-family:var(--wc-disp); font-size:12.5px; font-weight:700;
  font-variant-numeric:tabular-nums; color:var(--wc-lav); background:var(--wc-panel-2);
  padding:5px 11px; border-radius:999px; white-space:nowrap;
}
.wc-main{min-width:0; display:flex; flex-direction:column; gap:2px}
.wc-nm{font-size:15.5px; font-weight:700; line-height:1.35; overflow-wrap:anywhere}
.wc-op{font-size:13px; color:var(--wc-lav); line-height:1.4; overflow-wrap:anywhere}
.wc-vs{font-family:var(--wc-disp); font-weight:700; font-size:11px; letter-spacing:.12em;
  color:var(--wc-flame); margin-right:6px}
.wc-tm{color:var(--wc-lav-2); font-size:11.5px}
.wc-cat{font-size:11.5px; color:var(--wc-lav-2); margin-top:3px; overflow-wrap:anywhere}
.wc-side{display:flex; flex-direction:column; align-items:flex-end; gap:5px}
.wc-tag{
  font-family:var(--wc-disp); font-size:11.5px; font-weight:700; letter-spacing:.06em;
  padding:3px 10px; border-radius:999px; white-space:nowrap; font-variant-numeric:tabular-nums;
}
.wc-mat{background:var(--wc-panel-2); color:var(--wc-cream)}
.wc-ord{border:1px solid rgba(255,255,255,.16); color:var(--wc-lav)}
.wc-gi{background:rgba(76,215,192,.14); color:#4CD7C0}
.wc-ng{background:rgba(255,90,60,.16); color:var(--wc-flame)}
.wc-side a{
  font-size:11px; color:var(--wc-lav); text-decoration:none; letter-spacing:.04em;
  border-bottom:1px solid var(--wc-lav-2);
}
.wc-side a:hover{color:var(--wc-flame); border-color:var(--wc-flame)}
.wc-side a:focus-visible{outline:2px solid var(--wc-lav); outline-offset:2px}

.wc-empty{
  padding:30px 16px; text-align:center; color:var(--wc-lav-2); font-size:13px;
  background:var(--wc-panel); border:1px solid var(--wc-hair); border-radius:16px;
}

.wc-foot{margin-top:34px; padding-top:18px; border-top:1px solid var(--wc-hair);
  display:flex; flex-direction:column; gap:7px}
.wc-foot h3{
  margin:0 0 3px; font-family:var(--wc-disp); font-weight:700; font-size:13px;
  letter-spacing:.14em; text-transform:uppercase; color:var(--wc-lav-2);
}
.wc-foot p{margin:0; font-size:12px; color:var(--wc-lav-2)}
.wc-foot b{color:var(--wc-lav)}
.wc-foot a{color:var(--wc-lav); text-decoration:underline}

@media (max-width:540px){
  .wc-row{grid-template-columns:auto 1fr; gap:10px}
  .wc-side{grid-column:1 / -1; flex-direction:row; align-items:center; flex-wrap:wrap;
    justify-content:flex-start; gap:6px; margin-top:2px}
  .wc-grp-head{top:138px}
}
@media (prefers-reduced-motion: reduce){ .wc-root *{transition:none !important} }
`;
