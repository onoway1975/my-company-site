'use client';

import { useState, useMemo, useCallback } from 'react';
import styles from './styles.module.css';
import {
  BELT_COLORS,
  THREAD_COLORS,
  FONTS,
  PRICE_BELT,
  PRICE_PER_CHAR,
  MAX_CHARS,
} from './data';
import type {
  OrderState,
  BeltColorId,
  ThreadColorId,
  FontId,
} from './types';
import { buildPdf, generateOrderId } from './pdf';

const initialState: OrderState = {
  beltColor: 'black',
  threadColorA: 'gold',
  threadColorB: 'gold',
  font: 'gothic',
  textA: '',
  textB: '',
};

const fontClassMap: Record<FontId, string> = {
  gyosho: styles.fontGyosho,
  kaisho: styles.fontKaisho,
  gothic: styles.fontGothic,
};

const fcardFontClass: Record<FontId, string> = {
  gyosho: styles.fGyosho,
  kaisho: styles.fKaisho,
  gothic: styles.fGothic,
};

export default function ObiApp() {
  const [state, setState] = useState<OrderState>(initialState);
  const [orderId, setOrderId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const belt = useMemo(
    () => BELT_COLORS.find((c) => c.id === state.beltColor)!,
    [state.beltColor]
  );
  const threadA = useMemo(
    () => THREAD_COLORS.find((c) => c.id === state.threadColorA)!,
    [state.threadColorA]
  );
  const threadB = useMemo(
    () => THREAD_COLORS.find((c) => c.id === state.threadColorB)!,
    [state.threadColorB]
  );
  const fontInfo = FONTS[state.font];

  const totalChars = state.textA.length + state.textB.length;
  const embPrice = totalChars * PRICE_PER_CHAR;
  const total = PRICE_BELT + embPrice;
  const hasAny = totalChars > 0;
  const hasTip = state.beltColor !== 'black';

  const set = useCallback(
    <K extends keyof OrderState>(key: K, value: OrderState[K]) => {
      setState((s) => ({ ...s, [key]: value }));
    },
    []
  );

  const handlePreview = useCallback(async () => {
    if (!hasAny) return;
    const id = generateOrderId();
    setOrderId(id);
    const doc = await buildPdf(state, id);
    window.open(doc.output('bloburl'), '_blank');
  }, [state, hasAny]);

  const handleOrder = useCallback(() => {
    if (!hasAny) return;
    setOrderId(generateOrderId());
    setModalOpen(true);
  }, [hasAny]);

  const handleDownloadPdf = useCallback(async () => {
    const doc = await buildPdf(state, orderId);
    doc.save(`${orderId}.pdf`);
  }, [state, orderId]);

  const samePillThread = state.threadColorA === state.threadColorB;
  const threadStatusLabel = samePillThread
    ? threadA.name
    : `${threadA.name}/${threadB.name}`;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Noto+Serif+JP:wght@400;700&family=Klee+One:wght@400;600&family=Yuji+Syuku&family=Inter:wght@400;500;600;700;800&display=swap"
      />

      <div className={styles.app}>
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <span className={styles.logo}>OBI</span>
            <span className={styles.tag}>柔術帯刺繍オーダー</span>
          </div>
        </header>

        <div className={styles.body}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* 01 Belt */}
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <div className={styles.panelTitle}>
                  <span>01 Belt</span>
                  <span className={styles.panelTitleJa}>帯色</span>
                </div>
                <span className={styles.panelMeta}>{belt.name}</span>
              </div>
              <div className={styles.swatchRow}>
                {BELT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`${styles.swatch} ${
                      state.beltColor === c.id ? styles.swatchSelected : ''
                    }`}
                    onClick={() => set('beltColor', c.id as BeltColorId)}
                    aria-label={c.name}
                  >
                    <div
                      className={styles.swatchChip}
                      style={{ background: c.hex }}
                    />
                    <span className={styles.swatchLbl}>{c.ja}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 02 Text A */}
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <div className={styles.panelTitle}>
                  <span>02 Text</span>
                  <span className={styles.panelTitleJa}>左端の文字</span>
                </div>
                <span className={styles.panelMeta}>
                  {state.textA.length}/{MAX_CHARS}
                </span>
              </div>
              <input
                type="text"
                className={styles.tinput}
                maxLength={MAX_CHARS}
                placeholder="例: 田中 / 不動心 / TANAKA"
                value={state.textA}
                onChange={(e) => set('textA', e.target.value)}
              />
            </div>

            {/* 03 Text B */}
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <div className={styles.panelTitle}>
                  <span>03 Text</span>
                  <span className={styles.panelTitleJa}>右端の文字</span>
                </div>
                <span className={styles.panelMeta}>
                  {state.textB.length}/{MAX_CHARS}
                </span>
              </div>
              <input
                type="text"
                className={styles.tinput}
                maxLength={MAX_CHARS}
                placeholder="例: 道場名 / TEAM / 2026"
                value={state.textB}
                onChange={(e) => set('textB', e.target.value)}
              />
            </div>

            {/* 04 Font */}
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <div className={styles.panelTitle}>
                  <span>04 Font</span>
                  <span className={styles.panelTitleJa}>書体</span>
                </div>
                <span className={styles.panelMeta}>{fontInfo.name}</span>
              </div>
              <div className={styles.fontRow}>
                {(Object.keys(FONTS) as FontId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`${styles.fcard} ${fcardFontClass[id]} ${
                      state.font === id ? styles.fcardSelected : ''
                    }`}
                    onClick={() => set('font', id)}
                  >
                    <div className={styles.fcardSample}>柔</div>
                    <div className={styles.fcardLbl}>{FONTS[id].ja}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 05 Thread */}
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <div className={styles.panelTitle}>
                  <span>05 Thread</span>
                  <span className={styles.panelTitleJa}>糸色</span>
                </div>
                <span className={styles.panelMeta}>
                  {threadA.name} / {threadB.name}
                </span>
              </div>
              {(['threadColorA', 'threadColorB'] as const).map((key, idx) => (
                <div key={key} className={styles.threadSection}>
                  <div className={styles.threadSideLabel}>
                    <span>{idx === 0 ? '左端' : '右端'}</span>
                    <span className={styles.threadSideName}>
                      {idx === 0 ? threadA.name : threadB.name}
                    </span>
                  </div>
                  <div className={styles.threadRow}>
                    {THREAD_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`${styles.tdot} ${
                          state[key] === c.id ? styles.tdotSelected : ''
                        }`}
                        onClick={() => set(key, c.id as ThreadColorId)}
                        aria-label={c.name}
                        title={c.name}
                      >
                        <div
                          className={styles.tdotDot}
                          style={{ background: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order */}
            <div className={styles.panel}>
              <div className={styles.orderPanel}>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Belt</span>
                  <span className={styles.priceAmount}>
                    ¥{PRICE_BELT.toLocaleString()}
                  </span>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>
                    Embroidery ({totalChars}文字)
                  </span>
                  <span className={styles.priceAmount}>
                    ¥{embPrice.toLocaleString()}
                  </span>
                </div>
                <div className={`${styles.priceRow} ${styles.priceTotal}`}>
                  <span className={styles.priceLabel}>Total</span>
                  <span className={styles.priceAmount}>
                    ¥{total.toLocaleString()}
                  </span>
                </div>
                <div className={styles.btnActions}>
                  <button
                    className={styles.btn}
                    onClick={handlePreview}
                    disabled={!hasAny}
                  >
                    PDF
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={handleOrder}
                    disabled={!hasAny}
                  >
                    注文する →
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Canvas */}
          <main className={styles.canvas}>
            <div className={styles.canvasToolbar}>
              <div className={styles.canvasTitle}>
                <span className={styles.canvasTitleEn}>Preview</span>
                <span className={styles.canvasTitleJa}>仕上がりイメージ</span>
              </div>
              <div className={styles.pillRow}>
                <span className={styles.pill}>
                  <span
                    className={styles.pillDot}
                    style={{ background: belt.hex }}
                  />
                  {belt.name}
                </span>
                <span className={styles.pill}>{fontInfo.name}</span>
                {samePillThread ? (
                  <span className={styles.pill}>
                    <span
                      className={styles.pillDot}
                      style={{ background: threadA.hex }}
                    />
                    {threadA.name}糸
                  </span>
                ) : (
                  <>
                    <span className={styles.pill}>
                      <span
                        className={styles.pillDot}
                        style={{ background: threadA.hex }}
                      />
                      {threadA.name}
                    </span>
                    <span className={styles.pill}>
                      <span
                        className={styles.pillDot}
                        style={{ background: threadB.hex }}
                      />
                      {threadB.name}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className={styles.stage}>
              <div className={styles.beltWrap}>
                <div className={`${styles.ruler} ${styles.rulerTop}`}>
                  <div className={styles.rulerTick}>
                    <span>L</span>
                    <span className={styles.rulerLine} />
                  </div>
                  <div className={styles.rulerTick}>
                    <span>EMBROIDERY AREA</span>
                    <span className={styles.rulerLine} />
                  </div>
                  <div className={styles.rulerTick}>
                    <span>R</span>
                    <span className={styles.rulerLine} />
                  </div>
                </div>

                <div
                  className={`${styles.belt} ${
                    !hasTip ? styles.beltNoTip : ''
                  }`}
                  style={{ backgroundColor: belt.hex }}
                >
                  <span
                    className={`${styles.beltText} ${styles.beltTextA} ${fontClassMap[state.font]}`}
                    style={{
                      color: threadA.hex,
                      opacity: state.textA ? 1 : 0.25,
                    }}
                  >
                    {state.textA || 'TEXT A'}
                  </span>
                  <span
                    className={`${styles.beltText} ${styles.beltTextB} ${fontClassMap[state.font]}`}
                    style={{
                      color: threadB.hex,
                      opacity: state.textB ? 1 : 0.25,
                    }}
                  >
                    {state.textB || 'TEXT B'}
                  </span>
                  {hasTip && <span className={styles.beltTip} />}
                </div>

                <div className={`${styles.ruler} ${styles.rulerBottom}`}>
                  <div className={styles.rulerTick}>
                    <span className={styles.rulerLine} />
                    <span>オリマーク側</span>
                  </div>
                  <div className={styles.rulerTick}>
                    <span className={styles.rulerLine} />
                    <span>≈ 260 cm</span>
                  </div>
                  <div className={styles.rulerTick}>
                    <span className={styles.rulerLine} />
                    <span>黒タグ側</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.statusbar}>
              <span>
                納期 <strong>約2週間</strong> · 全国送料無料
              </span>
              <span>
                構成:{' '}
                <strong>
                  {belt.name} / {fontInfo.name} / {threadStatusLabel}
                </strong>
              </span>
              <span>OBI Studio Tokyo</span>
            </div>
          </main>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className={styles.modal}>
            <div className={styles.modalCheck}>✓</div>
            <h2 className={styles.modalTitle}>ご注文ありがとうございます</h2>
            <div className={styles.modalOrderId}>ORDER #{orderId}</div>
            <p className={styles.modalText}>
              ご注文内容を施工指示書（PDF）として生成しました。
              <br />
              職人へ送付され、約2週間でお手元へお届けします。
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.btn}
                onClick={() => setModalOpen(false)}
              >
                閉じる
              </button>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleDownloadPdf}
              >
                PDFをダウンロード
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
