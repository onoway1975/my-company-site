'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// =================== 定数 ===================
const FOOD_EMOJIS = ['🍔','🍕','🍟','🍩','🍰','🍫','🍦','🍗','🥓','🍖','🌭','🥐','🍪','🧁','🍮','🥞','🍣','🍜','🍝','🌮'];
const KCAL_PER_KG = 7200;

const MILESTONES: { at: number; label: string }[] = [
  { at: 1,    label: '🎉 はじめの一撃' },
  { at: 50,   label: '🔥 ウォームアップ' },
  { at: 200,  label: '💪 中級ハンター' },
  { at: 500,  label: '⚡ 500破壊' },
  { at: 1000, label: '🏆 1000の食物連鎖を断った者' },
  { at: 5000, label: '👑 神の指' },
];

type Food = {
  id: number;
  el: HTMLDivElement;
  x: number;
  y: number;
  speedMul: number;
  rot: number;
};

export default function FingerDietPage() {
  // =================== 入力 state ===================
  const [curW, setCurW] = useState<string>('70');
  const [tgtW, setTgtW] = useState<string>('65');
  const [days, setDays] = useState<string>('30');
  const [kcalPer, setKcalPer] = useState<string>('0.0007');

  // =================== 計算結果 ===================
  const [calcResult, setCalcResult] = useState<{
    diff: number;
    totalKcal: number;
    totalClicks: number;
    daily: number;
    comment: string;
  } | null>(null);

  // =================== ゲーム state ===================
  const [clicks, setClicks] = useState(0);
  const [kcal, setKcal] = useState(0);
  const [lives, setLives] = useState(3);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [overlayShown, setOverlayShown] = useState(true);
  const [overlayTitle, setOverlayTitle] = useState('START');
  const [overlayText, setOverlayText] = useState(
    '画面上から落ちてくる「美味しそうなアレ」を指先で消し飛ばせ。\n地面に着くと、君が食べたことになる(=太る)。'
  );
  const [startBtnText, setStartBtnText] = useState('▶ ゲーム開始');
  const [badges, setBadges] = useState<string[]>([]);
  const [dateline, setDateline] = useState('');

  // =================== refs(ゲームループ用) ===================
  const areaRef = useRef<HTMLDivElement>(null);
  const foodsRef = useRef<Food[]>([]);
  const foodIdRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const spawnIntervalRef = useRef(900);
  const fallSpeedRef = useRef(0.06);
  const lastTsRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const pausedRef = useRef(false);
  const livesRef = useRef(3);
  const clicksRef = useRef(0);
  const kcalRef = useRef(0);
  const targetClicksPerDayRef = useRef(0);
  const kcalPerClickRef = useRef(0.0007);
  const badgeSetRef = useRef<Set<string>>(new Set());

  // =================== ヘッダー・フッター非表示(ciraf.jp 全コンテンツ共通) ===================
  // body直下の <header> / <footer>(= グローバルレイアウトのもの)だけを対象にする。
  // ページ内でも <header>/<footer> を使う場合に誤って自身を非表示にしないため。
  useEffect(() => {
    const headers = Array.from(document.body.querySelectorAll(':scope > header'));
    const footers = Array.from(document.body.querySelectorAll(':scope > footer'));
    // Next.jsの構造によっては body > div > header になることがあるので、最初の階層も確認
    const deepHeaders = Array.from(document.querySelectorAll('body > div > header, body > main > header'));
    const deepFooters = Array.from(document.querySelectorAll('body > div > footer, body > main > footer'));
    const targets = [...headers, ...footers, ...deepHeaders, ...deepFooters] as HTMLElement[];
    targets.forEach((el) => el.style.setProperty('display', 'none', 'important'));
    return () => {
      targets.forEach((el) => el.style.removeProperty('display'));
    };
  }, []);

  // =================== 日付 ===================
  useEffect(() => {
    const d = new Date();
    setDateline(`${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 朝刊`);
  }, []);

  // =================== 計算 ===================
  const calc = useCallback(() => {
    const cur = parseFloat(curW);
    const tgt = parseFloat(tgtW);
    const dys = parseInt(days, 10);
    const kpc = parseFloat(kcalPer);
    if (!isFinite(cur) || !isFinite(tgt) || !isFinite(dys) || !isFinite(kpc)) return;
    const diff = cur - tgt;
    if (diff <= 0) {
      alert('もう目標体重以下です。素晴らしい!');
      return;
    }
    if (dys <= 0) {
      alert('日数は1以上にしてください。');
      return;
    }

    const totalKcal = diff * KCAL_PER_KG;
    const totalClicks = Math.ceil(totalKcal / kpc);
    const dailyClicks = Math.ceil(totalClicks / dys);

    kcalPerClickRef.current = kpc;
    targetClicksPerDayRef.current = dailyClicks;

    let cm = '';
    if (dailyClicks > 1_000_000) {
      cm = '⚠ 1日100万クリック超え。物理的に不可能です。日数か目標を見直しましょう。';
    } else if (dailyClicks > 100_000) {
      cm = '⚠ かなり厳しい数値です。指が壊れます。';
    } else if (dailyClicks > 10_000) {
      cm = '本気のフィンガーダイエッターのレベルです。';
    } else if (dailyClicks > 1000) {
      cm = 'まあ、現実的(※クリックの話)。';
    } else {
      cm = '余裕です。むしろもっと痩せられそう。';
    }
    const secPerDay = Math.ceil(dailyClicks / 5);
    const hours = (secPerDay / 3600).toFixed(1);
    cm += `\n(1秒5クリック連打しても1日 約${hours}時間 必要)`;

    setCalcResult({
      diff,
      totalKcal,
      totalClicks,
      daily: dailyClicks,
      comment: cm,
    });

    // ゲームエリアにスクロール
    setTimeout(() => {
      document.getElementById('gamePanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }, [curW, tgtW, days, kcalPer]);

  // 初回マウント時に1回計算
  useEffect(() => {
    calc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =================== ゲームループ ===================
  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const cleanupFoods = useCallback(() => {
    foodsRef.current.forEach((f) => f.el.remove());
    foodsRef.current = [];
  }, []);

  const updateProgressDOM = useCallback(() => {
    // 進捗表示は state(clicks) 経由なので何もしない。クリック数だけ反映用。
  }, []);

  const showFloat = useCallback((cx: number, cy: number, text: string) => {
    const area = areaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'float-score';
    el.textContent = text;
    el.style.left = `${cx - rect.left}px`;
    el.style.top = `${cy - rect.top}px`;
    area.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }, []);

  const checkBadges = useCallback((current: number) => {
    let added = false;
    MILESTONES.forEach((m) => {
      if (current >= m.at && !badgeSetRef.current.has(m.label)) {
        badgeSetRef.current.add(m.label);
        added = true;
      }
    });
    if (added) {
      setBadges([...badgeSetRef.current]);
    }
  }, []);

  const hitFood = useCallback(
    (food: Food, cx: number, cy: number) => {
      if (!runningRef.current || pausedRef.current) return;
      const idx = foodsRef.current.indexOf(food);
      if (idx === -1) return;
      foodsRef.current.splice(idx, 1);

      clicksRef.current += 1;
      kcalRef.current += kcalPerClickRef.current;
      setClicks(clicksRef.current);
      setKcal(kcalRef.current);
      updateProgressDOM();

      showFloat(cx, cy, `-${kcalPerClickRef.current.toFixed(4)} kcal`);

      food.el.classList.add('zapped');
      setTimeout(() => food.el.remove(), 350);

      checkBadges(clicksRef.current);
    },
    [showFloat, checkBadges, updateProgressDOM]
  );

  const gameOver = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    cleanupFoods();
    spawnIntervalRef.current = 900;
    fallSpeedRef.current = 0.06;
    spawnTimerRef.current = 0;

    const eaten = `君は ${clicksRef.current.toLocaleString()} 個の食べ物を消し飛ばしたが、3個を許してしまった。`;
    const remain = targetClicksPerDayRef.current - clicksRef.current;
    let extra = '';
    if (remain <= 0 && targetClicksPerDayRef.current > 0) {
      extra = '🎉 でも本日のノルマは達成済みだ!よくやった!';
    } else {
      extra = `本日のノルマ残り: あと ${Math.max(0, remain).toLocaleString()} クリック`;
    }
    setOverlayTitle('GAME OVER');
    setOverlayText(`${eaten}\n${extra}`);
    setStartBtnText('▶ もう一度');
    setOverlayShown(true);
    stopLoop();
  }, [cleanupFoods, stopLoop]);

  const missFood = useCallback(
    (food: Food) => {
      food.el.classList.add('missed');
      setTimeout(() => food.el.remove(), 400);
      livesRef.current -= 1;
      setLives(livesRef.current);
      if (livesRef.current <= 0) {
        gameOver();
      }
    },
    [gameOver]
  );

  const spawnFood = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const w = area.clientWidth;
    const emoji = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)];
    const el = document.createElement('div');
    el.className = 'food';
    el.style.fontSize = '52px';
    el.style.lineHeight = '64px';
    el.style.textAlign = 'center';
    el.textContent = emoji;
    const x = Math.random() * (w - 64);
    const y = -64;
    const speedMul = 0.7 + Math.random() * 0.8;
    const rot = Math.random() * 30 - 15;
    el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;

    const id = ++foodIdRef.current;
    const food: Food = { id, el, x, y, speedMul, rot };

    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      hitFood(food, e.clientX, e.clientY);
    });

    area.appendChild(el);
    foodsRef.current.push(food);
  }, [hitFood]);

  const loop = useCallback(
    (ts: number) => {
      if (!runningRef.current) return;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;

      if (!pausedRef.current) {
        spawnTimerRef.current += dt;
        if (spawnTimerRef.current >= spawnIntervalRef.current) {
          spawnTimerRef.current = 0;
          spawnFood();
          spawnIntervalRef.current = Math.max(350, spawnIntervalRef.current - 4);
          fallSpeedRef.current = Math.min(0.25, fallSpeedRef.current + 0.0008);
        }

        const area = areaRef.current;
        if (area) {
          const areaH = area.clientHeight;
          for (let i = foodsRef.current.length - 1; i >= 0; i--) {
            const f = foodsRef.current[i];
            f.y += fallSpeedRef.current * dt * f.speedMul;
            f.el.style.transform = `translate(${f.x}px, ${f.y}px) rotate(${f.rot + f.y * 0.5}deg)`;
            if (f.y > areaH - 64) {
              missFood(f);
              foodsRef.current.splice(i, 1);
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    },
    [spawnFood, missFood]
  );

  const startGame = useCallback(() => {
    if (targetClicksPerDayRef.current === 0) {
      calc();
      if (targetClicksPerDayRef.current === 0) return;
    }
    runningRef.current = true;
    pausedRef.current = false;
    livesRef.current = 3;
    setRunning(true);
    setPaused(false);
    setLives(3);
    setOverlayShown(false);
    lastTsRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
  }, [calc, loop]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      stopLoop();
      cleanupFoods();
    };
  }, [stopLoop, cleanupFoods]);

  // =================== 一時停止(Pキー) ===================
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'p' && e.key !== 'P') return;
      if (!runningRef.current) return;
      pausedRef.current = !pausedRef.current;
      setPaused(pausedRef.current);
      if (pausedRef.current) {
        setOverlayTitle('PAUSE');
        setOverlayText('Pキーで再開');
        setStartBtnText('▶ 再開');
        setOverlayShown(true);
      } else {
        setOverlayShown(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // =================== リセット ===================
  const resetAll = () => {
    if (!confirm('全部リセットしますか?(クリックも体重も戻りません)')) return;
    runningRef.current = false;
    pausedRef.current = false;
    setRunning(false);
    setPaused(false);
    stopLoop();
    cleanupFoods();
    clicksRef.current = 0;
    kcalRef.current = 0;
    livesRef.current = 3;
    badgeSetRef.current.clear();
    setClicks(0);
    setKcal(0);
    setLives(3);
    setBadges([]);
    spawnIntervalRef.current = 900;
    fallSpeedRef.current = 0.06;
    spawnTimerRef.current = 0;
    setOverlayTitle('START');
    setOverlayText(
      '画面上から落ちてくる「美味しそうなアレ」を指先で消し飛ばせ。\n地面に着くと、君が食べたことになる(=太る)。'
    );
    setStartBtnText('▶ ゲーム開始');
    setOverlayShown(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =================== 表示用ヘルパー ===================
  const targetDaily = targetClicksPerDayRef.current;
  const remain = targetDaily > 0 ? Math.max(0, targetDaily - clicks) : null;
  const pct = targetDaily > 0 ? Math.min(100, (clicks / targetDaily) * 100) : 0;

  // =================== JSX ===================
  return (
    <div className="finger-diet-root">
      <div className="wrap">
        <div className="fd-header">
          <div className="top-meta">
            <span>SERIAL No. 7-0-0-0</span>
            <span>{dateline}</span>
            <span>VOL.Ⅸ</span>
          </div>
          <h1>フィンガーダイエット</h1>
          <div className="sub">ク リ ッ ク 式 ・ 脂 肪 燃 焼 装 置</div>
          <div className="stamp">
            医学的
            <br />
            未承認
          </div>
        </div>

        {/* ===== セットアップ ===== */}
        <section className="panel">
          <span className="panel-label">─ STEP 1 ─ あなたのデータを入力 ─</span>
          <p className="lead">
            脂肪1kgを燃やすには <strong className="red">約7,200kcal</strong> が必要です。
            <br />
            運動?嫌だ。歩く?無理。でも痩せたい。
            <br />
            ─ そんな君のために、<strong>指先の動きだけ</strong>で痩せる装置を用意した。
          </p>

          <div className="setup-grid">
            <div className="field">
              <label htmlFor="curW">現在の体重</label>
              <div className="field-input">
                <input
                  id="curW"
                  type="number"
                  inputMode="decimal"
                  value={curW}
                  min={30}
                  max={200}
                  step={0.1}
                  onChange={(e) => setCurW(e.target.value)}
                />
                <span className="unit">kg</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="tgtW">目標体重</label>
              <div className="field-input">
                <input
                  id="tgtW"
                  type="number"
                  inputMode="decimal"
                  value={tgtW}
                  min={30}
                  max={200}
                  step={0.1}
                  onChange={(e) => setTgtW(e.target.value)}
                />
                <span className="unit">kg</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="days">達成までの日数</label>
              <div className="field-input">
                <input
                  id="days"
                  type="number"
                  inputMode="numeric"
                  value={days}
                  min={1}
                  max={3650}
                  step={1}
                  onChange={(e) => setDays(e.target.value)}
                />
                <span className="unit">日</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="kcalPer">1クリックの消費</label>
              <div className="field-input">
                <input
                  id="kcalPer"
                  type="number"
                  inputMode="decimal"
                  value={kcalPer}
                  min={0.0001}
                  max={1}
                  step={0.0001}
                  onChange={(e) => setKcalPer(e.target.value)}
                />
                <span className="unit">kcal</span>
              </div>
            </div>
          </div>

          <button type="button" className="calc-btn" onClick={calc}>
            ▶ 計 算 し て 始 め る ◀
          </button>

          {calcResult && (
            <div className="result-box">
              <div className="result-row">
                <span className="lbl">減量目標</span>
                <span>
                  <span className="val">{calcResult.diff.toFixed(1)}</span>
                  <span className="unit">kg</span>
                </span>
              </div>
              <div className="result-row">
                <span className="lbl">必要消費カロリー</span>
                <span>
                  <span className="val">{calcResult.totalKcal.toLocaleString()}</span>
                  <span className="unit">kcal</span>
                </span>
              </div>
              <div className="result-row">
                <span className="lbl">必要総クリック数</span>
                <span>
                  <span className="val">{calcResult.totalClicks.toLocaleString()}</span>
                  <span className="unit">回</span>
                </span>
              </div>
              <div className="result-row">
                <span className="lbl">▶ 1日のノルマ</span>
                <span>
                  <span className="val huge">{calcResult.daily.toLocaleString()}</span>
                  <span className="unit">クリック</span>
                </span>
              </div>
              <div className="result-comment">{calcResult.comment}</div>
            </div>
          )}
        </section>

        {/* ===== ゲーム ===== */}
        <section className="panel" id="gamePanel">
          <span className="panel-label">─ STEP 2 ─ 落ちてくる食べ物を消せ ─</span>

          <div className="gamearea" ref={areaRef}>
            <div className="hud" aria-hidden={overlayShown}>
              <div className="hud-cell">
                <span className="l">CLICKS</span>
                <span className="v">{clicks.toLocaleString()}</span>
              </div>
              <div className="hud-cell">
                <span className="l">消費 kcal</span>
                <span className="v">{kcal.toFixed(3)}</span>
              </div>
              <div className="hud-cell">
                <span className="l">本日のノルマ残</span>
                <span className="v">{remain === null ? '─' : remain.toLocaleString()}</span>
              </div>
              <div className="hud-cell warn">
                <span className="l">食われた</span>
                <span className="v">
                  <span className="lives">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className={`heart${i >= lives ? ' lost' : ''}`}>
                        ♥
                      </span>
                    ))}
                  </span>
                </span>
              </div>
            </div>

            {overlayShown && (
              <div className="overlay">
                <h2>{overlayTitle}</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{overlayText}</p>
                <button
                  type="button"
                  className="start-btn"
                  onClick={() => {
                    if (paused) {
                      pausedRef.current = false;
                      setPaused(false);
                      setOverlayShown(false);
                    } else {
                      startGame();
                    }
                  }}
                >
                  {startBtnText}
                </button>
                <p className="small">スマホはタップでもOK / Pキーで一時停止</p>
              </div>
            )}
          </div>

          <div className="progress-wrap">
            <div className="progress-label">
              <span>本日のノルマ達成度</span>
              <span>{pct.toFixed(1)}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {badges.length > 0 && (
            <div className="badge-area">
              {badges.map((b) => (
                <div key={b} className="badge">
                  {b}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <span className="panel-label">─ 注 意 ─</span>
          <div className="fine-print">
            ※脂肪1kg=約7,200kcalで計算しています。1クリックあたりの消費は <strong>0.0007kcal</strong>{' '}
            前後(マウス操作の概算値)。本装置は <strong>気の持ちよう</strong>{' '}
            で効果を発揮します。実際の体重変化はクリック以外の要因(食事・運動・睡眠・遺伝・気合)に大きく左右されます。腱鞘炎にはお気をつけください。
          </div>
          <div className="reset-wrap">
            <button type="button" className="reset" onClick={resetAll}>
              最初からやり直す
            </button>
          </div>
        </section>

        <div className="fd-footer">
          <div className="barcode-fake" aria-hidden="true">
            <span />
            <span style={{ width: 1 }} />
            <span style={{ width: 3 }} />
            <span style={{ height: 28 }} />
            <span />
            <span style={{ width: 1 }} />
            <span style={{ width: 3 }} />
            <span />
            <span style={{ width: 1, height: 28 }} />
            <span style={{ width: 2 }} />
            <span />
            <span />
            <span style={{ width: 3 }} />
            <span style={{ height: 28 }} />
            <span style={{ width: 1 }} />
            <span style={{ width: 2 }} />
            <span />
          </div>
          <div>7 2 0 0 ─ K C A L ─ 1 K G</div>
          <div className="copy">© フィンガーダイエット研究所 ─ 効果には個人差(と妄想)があります</div>
        </div>
      </div>

      {/* ====== styled-jsx ====== */}
      <style jsx>{`
        .finger-diet-root {
          --bg: #f3ead3;
          --ink: #1a1208;
          --red: #c1272d;
          --blue: #1a3a6e;
          --yellow: #f4c430;
          --green: #2d8a3e;
          --paper: #ebe0c0;
          --stamp: #a8232a;

          background: var(--bg);
          color: var(--ink);
          min-height: 100vh;
          font-family: 'Shippori Mincho', 'LINE Seed JP', serif;
          position: relative;
          overflow-x: hidden;
        }
        .finger-diet-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(120, 80, 20, 0.08) 0, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(120, 80, 20, 0.06) 0, transparent 40%),
            repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.015) 0 2px, transparent 2px 4px);
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: multiply;
        }
        .finger-diet-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .15 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
          pointer-events: none;
          z-index: 2;
          opacity: 0.5;
          mix-blend-mode: multiply;
        }

        .wrap {
          max-width: 920px;
          margin: 0 auto;
          padding: 24px 18px 60px;
          position: relative;
          z-index: 3;
        }

        /* ===== ヘッダー ===== */
        .fd-header {
          border-top: 6px double var(--ink);
          border-bottom: 6px double var(--ink);
          padding: 14px 0 12px;
          margin-bottom: 22px;
          text-align: center;
          position: relative;
        }
        .top-meta {
          display: flex;
          justify-content: space-between;
          font-family: 'VT323', monospace;
          font-size: 13px;
          opacity: 0.75;
          margin-bottom: 8px;
          padding: 0 6px;
        }
        .fd-header h1 {
          font-family: 'Bungee', 'Shippori Mincho', sans-serif;
          font-size: clamp(28px, 5.5vw, 52px);
          line-height: 0.95;
          letter-spacing: -0.02em;
          color: var(--red);
          text-shadow: 3px 3px 0 var(--ink);
          transform: scaleY(1.15);
          transform-origin: center;
          margin: 4px 0;
        }
        .sub {
          font-family: 'DotGothic16', 'LINE Seed JP', sans-serif;
          font-size: clamp(11px, 1.8vw, 15px);
          letter-spacing: 0.3em;
          color: var(--blue);
          margin-top: 6px;
        }
        .stamp {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%) rotate(-12deg);
          border: 3px double var(--stamp);
          color: var(--stamp);
          padding: 5px 10px;
          font-family: 'DotGothic16', sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          opacity: 0.85;
          line-height: 1.3;
          text-align: center;
        }

        /* ===== パネル ===== */
        .panel {
          background: var(--paper);
          border: 3px solid var(--ink);
          box-shadow: 8px 8px 0 var(--ink);
          padding: 22px 20px;
          margin-bottom: 22px;
          position: relative;
        }
        .panel-label {
          position: absolute;
          top: -14px;
          left: 18px;
          background: var(--bg);
          padding: 0 10px;
          font-family: 'DotGothic16', sans-serif;
          font-size: 13px;
          letter-spacing: 0.2em;
        }
        .lead {
          font-family: 'Shippori Mincho', 'LINE Seed JP', serif;
          font-weight: 800;
          font-size: 15px;
          margin-bottom: 14px;
          line-height: 1.7;
        }
        .red {
          color: var(--red);
        }

        /* ===== セットアップ ===== */
        .setup-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        @media (max-width: 520px) {
          .setup-grid {
            grid-template-columns: 1fr;
          }
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .field label {
          font-family: 'DotGothic16', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          color: var(--blue);
        }
        .field-input {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          border: 2px solid var(--ink);
          padding: 8px 10px;
        }
        .field-input input {
          border: none;
          background: transparent;
          font-family: 'VT323', monospace;
          font-size: 24px;
          width: 100%;
          color: var(--ink);
        }
        .field-input input:focus:not(:focus-visible) {
          outline: none;
        }
        .field-input input:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }
        .field-input .unit {
          font-family: 'DotGothic16', sans-serif;
          font-size: 13px;
          color: #7a6840;
        }
        .calc-btn {
          display: block;
          width: 100%;
          background: var(--ink);
          color: var(--paper);
          border: none;
          padding: 14px;
          font-family: 'Bungee', sans-serif;
          font-size: 18px;
          letter-spacing: 0.05em;
          cursor: pointer;
          box-shadow: 5px 5px 0 var(--red);
          transition: transform 0.08s, box-shadow 0.08s;
        }
        .calc-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 7px 7px 0 var(--red);
        }
        .calc-btn:active {
          transform: translate(3px, 3px);
          box-shadow: 2px 2px 0 var(--red);
        }
        .calc-btn:focus-visible {
          outline: 3px solid var(--red);
          outline-offset: 3px;
        }

        /* ===== 結果 ===== */
        .result-box {
          background: var(--ink);
          color: #7fff7f;
          padding: 18px;
          margin-top: 14px;
          font-family: 'VT323', monospace;
          border: 2px solid var(--ink);
          box-shadow: inset 0 0 12px rgba(127, 255, 127, 0.2);
          position: relative;
          overflow: hidden;
        }
        .result-box::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.25) 0 2px,
            transparent 2px 4px
          );
          pointer-events: none;
        }
        .result-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }
        .result-row .lbl {
          font-size: 13px;
          letter-spacing: 0.15em;
          opacity: 0.7;
        }
        .result-row .val {
          font-size: 28px;
          font-weight: bold;
          text-shadow: 0 0 8px rgba(127, 255, 127, 0.5);
        }
        .result-row .val.huge {
          font-size: 42px;
          color: #ffeb7f;
          text-shadow: 0 0 8px rgba(255, 235, 127, 0.6);
        }
        .result-row .unit {
          font-size: 14px;
          opacity: 0.7;
          margin-left: 3px;
        }
        .result-comment {
          margin-top: 10px;
          font-size: 14px;
          color: #ffeb7f;
          line-height: 1.5;
          white-space: pre-line;
        }

        /* ===== ゲームエリア ===== */
        .gamearea {
          position: relative;
          height: 520px;
          background: linear-gradient(180deg, #bce0e8 0%, #e8f1d8 70%, #d4c89a 100%);
          border: 3px solid var(--ink);
          overflow: hidden;
          cursor: crosshair;
          user-select: none;
          touch-action: manipulation;
        }
        .gamearea::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence baseFrequency='.7' numOctaves='2'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .12 0'/></filter><rect width='100' height='100' filter='url(%23n)'/></svg>");
          opacity: 0.4;
          mix-blend-mode: multiply;
          pointer-events: none;
        }
        .gamearea::after {
          content: '';
          position: absolute;
          top: 30px;
          left: -60px;
          width: 140px;
          height: 30px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          box-shadow:
            280px 50px 0 -5px rgba(255, 255, 255, 0.5),
            540px 20px 0 0 rgba(255, 255, 255, 0.55),
            150px 90px 0 -8px rgba(255, 255, 255, 0.4);
          animation: cloudDrift 30s linear infinite;
          pointer-events: none;
        }
        @keyframes cloudDrift {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(80px);
          }
        }

        .hud {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          display: flex;
          justify-content: space-between;
          gap: 8px;
          z-index: 10;
          pointer-events: none;
          flex-wrap: wrap;
        }
        .hud-cell {
          background: rgba(26, 18, 8, 0.85);
          color: #7fff7f;
          padding: 8px 12px;
          font-family: 'VT323', monospace;
          border: 2px solid var(--ink);
          min-width: 90px;
        }
        .hud-cell .l {
          font-size: 11px;
          letter-spacing: 0.1em;
          opacity: 0.7;
          display: block;
        }
        .hud-cell .v {
          font-size: 22px;
          line-height: 1;
          font-weight: bold;
        }
        .hud-cell.warn .v {
          color: #ff7f7f;
        }
        .lives {
          display: inline-flex;
          gap: 3px;
          font-size: 18px;
          line-height: 1;
        }
        .heart.lost {
          filter: grayscale(1);
          opacity: 0.3;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(26, 18, 8, 0.92);
          color: var(--paper);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          z-index: 30;
        }
        .overlay h2 {
          font-family: 'Bungee', sans-serif;
          font-size: clamp(28px, 5vw, 46px);
          color: var(--yellow);
          text-shadow: 3px 3px 0 var(--red);
          margin-bottom: 12px;
          transform: scaleY(1.15);
        }
        .overlay p {
          font-family: 'Shippori Mincho', 'LINE Seed JP', serif;
          font-weight: 800;
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 18px;
          max-width: 520px;
        }
        .start-btn {
          background: var(--red);
          color: #fff;
          border: none;
          padding: 14px 36px;
          font-family: 'Bungee', sans-serif;
          font-size: 24px;
          cursor: pointer;
          letter-spacing: 0.05em;
          box-shadow: 5px 5px 0 var(--paper);
          transition: transform 0.08s, box-shadow 0.08s;
        }
        .start-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 7px 7px 0 var(--paper);
        }
        .start-btn:active {
          transform: translate(3px, 3px);
          box-shadow: 2px 2px 0 var(--paper);
        }
        .start-btn:focus-visible {
          outline: 3px solid var(--yellow);
          outline-offset: 3px;
        }
        .small {
          font-family: 'VT323', monospace;
          font-size: 14px;
          margin-top: 14px;
          opacity: 0.7;
        }

        /* 進捗 */
        .progress-wrap {
          margin-top: 14px;
        }
        .progress-label {
          display: flex;
          justify-content: space-between;
          font-family: 'DotGothic16', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          margin-bottom: 6px;
        }
        .progress-track {
          height: 22px;
          border: 2px solid var(--ink);
          background: #fff;
          position: relative;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          width: 0%;
          background: repeating-linear-gradient(
            45deg,
            var(--green) 0 10px,
            #3aa050 10px 20px
          );
          transition: width 0.3s ease;
        }
        .progress-fill::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent 40%);
        }

        /* バッジ */
        .badge-area {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .badge {
          background: var(--yellow);
          border: 2px solid var(--ink);
          box-shadow: 3px 3px 0 var(--ink);
          padding: 5px 10px;
          font-family: 'DotGothic16', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          animation: popIn 0.4s cubic-bezier(0.5, 1.6, 0.4, 1);
        }
        @keyframes popIn {
          0% {
            transform: scale(0) rotate(-20deg);
            opacity: 0;
          }
          100% {
            transform: scale(1) rotate(-3deg);
            opacity: 1;
          }
        }

        /* 注意書き */
        .fine-print {
          font-family: 'VT323', monospace;
          font-size: 13px;
          line-height: 1.55;
          color: #5a4a30;
          border-top: 1px dashed var(--ink);
          padding-top: 12px;
          margin-top: 0;
        }
        .fine-print strong {
          color: var(--red);
        }
        .reset-wrap {
          text-align: right;
          margin-top: 10px;
        }
        .reset {
          background: none;
          border: 1px solid var(--ink);
          padding: 5px 12px;
          font-family: 'DotGothic16', sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          cursor: pointer;
          color: var(--ink);
        }
        .reset:hover {
          background: var(--ink);
          color: var(--paper);
        }
        .reset:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }

        /* フッター */
        .fd-footer {
          text-align: center;
          margin-top: 24px;
          font-family: 'VT323', monospace;
          font-size: 13px;
          color: #6b5635;
          letter-spacing: 0.1em;
          line-height: 1.6;
        }
        .barcode-fake {
          display: inline-flex;
          align-items: center;
          gap: 1px;
          margin: 6px 0 4px;
        }
        .barcode-fake :global(span) {
          display: inline-block;
          background: var(--ink);
          width: 2px;
          height: 34px;
        }
        .copy {
          margin-top: 5px;
        }

        @media (prefers-reduced-motion: reduce) {
          .calc-btn,
          .start-btn,
          .reset {
            transition: none;
          }
          .progress-fill {
            transition: none;
          }
          .badge {
            animation: none;
          }
          .gamearea::after {
            animation: none;
          }
        }
      `}</style>

      {/* Google Fonts preconnect */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* グローバルなアニメーション・動的に追加されるDOM要素のスタイル */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Bungee&family=VT323&family=Shippori+Mincho:wght@700;800&display=swap');

        .finger-diet-root .food {
          position: absolute;
          width: 64px;
          height: 64px;
          cursor: pointer;
          user-select: none;
          transition: transform 0.1s;
          filter: drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.3));
          will-change: transform;
        }
        .finger-diet-root .food:hover {
          transform: scale(1.1) rotate(5deg);
        }
        .finger-diet-root .food.zapped {
          animation: fd-zap 0.35s ease-out forwards;
          pointer-events: none;
        }
        @keyframes fd-zap {
          0% {
            transform: scale(1) rotate(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 0.8;
            filter: drop-shadow(0 0 12px #c1272d) brightness(1.5);
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }
        .finger-diet-root .food.missed {
          animation: fd-miss 0.4s ease-in forwards;
          pointer-events: none;
        }
        @keyframes fd-miss {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(40px) scale(0.7);
          }
        }
        .finger-diet-root .float-score {
          position: absolute;
          pointer-events: none;
          font-family: 'Bungee', sans-serif;
          font-size: 18px;
          color: #c1272d;
          text-shadow: 2px 2px 0 #fff;
          z-index: 20;
          animation: fd-scoreUp 1s ease-out forwards;
        }
        @keyframes fd-scoreUp {
          0% {
            opacity: 0;
            transform: translate(-50%, 0) scale(0.5);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -15px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -80px) scale(0.9);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .finger-diet-root .food {
            transition: none;
          }
          .finger-diet-root .food.zapped,
          .finger-diet-root .food.missed {
            animation: none;
            opacity: 0;
          }
          .finger-diet-root .float-score {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
