import type { OrderState } from './types';
import {
  BELT_COLORS,
  THREAD_COLORS,
  FONTS,
  PRICE_BELT,
  PRICE_PER_CHAR,
  fontCssMap,
  fontWeightMap,
} from './data';

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function renderTextToImage(
  text: string,
  font: OrderState['font'],
  color: string
): { dataUrl: string; width: number; height: number } | null {
  if (!text) return null;
  const canvas = document.createElement('canvas');
  const scale = 3;
  canvas.width = 800 * scale;
  canvas.height = 120 * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  const weight = fontWeightMap[font];
  const family = fontCssMap[font];
  ctx.font = `${weight} 64px ${family}`;
  ctx.fillText(text, 10, 60);
  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: canvas.width / scale,
    height: canvas.height / scale,
  };
}

export function generateOrderId(): string {
  const d = new Date();
  const ymd =
    d.getFullYear().toString().slice(2) +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `OBI-${ymd}-${rand}`;
}

export async function buildPdf(state: OrderState, orderId: string) {
  // Dynamic import so jsPDF only loads on the client at order time
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const belt = BELT_COLORS.find((c) => c.id === state.beltColor)!;
  const threadA = THREAD_COLORS.find((c) => c.id === state.threadColorA)!;
  const threadB = THREAD_COLORS.find((c) => c.id === state.threadColorB)!;
  const fontInfo = FONTS[state.font];

  const W = 210;
  const H = 297;
  const margin = 18;

  // Yellow accent bar
  doc.setFillColor(245, 216, 0);
  doc.rect(0, 0, W, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(17);
  doc.text('OBI', margin, 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text('CUSTOM EMBROIDERY · MADE-TO-ORDER', margin, 29);
  doc.text('SHISHU INSTRUCTION', W - margin, 24, { align: 'right' });
  doc.text('施工指示書', W - margin, 29, { align: 'right' });
  doc.setDrawColor(232);
  doc.setLineWidth(0.3);
  doc.line(margin, 36, W - margin, 36);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(17);
  doc.text('Embroidery Order', margin, 48);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(136);
  doc.text(`Order ID: ${orderId}`, margin, 54);
  doc.text(`Issued: ${new Date().toLocaleString('ja-JP')}`, margin, 58);

  // Belt visualization
  const beltY = 72;
  const beltX = margin;
  const beltW = W - margin * 2;
  const beltH = 22;
  const rgb = hexToRgb(belt.hex);
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
  doc.rect(beltX, beltY, beltW, beltH, 'F');

  const hasTip = state.beltColor !== 'black';
  if (hasTip) {
    doc.setFillColor(17, 17, 17);
    doc.rect(beltX + beltW * 0.72, beltY, beltW * 0.28, beltH, 'F');
  }
  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
  doc.rect(beltX, beltY, beltW, beltH);

  const textImgA = renderTextToImage(state.textA, state.font, threadA.hex);
  if (textImgA) {
    const targetH = 12;
    const targetW = textImgA.width * (targetH / textImgA.height);
    const finalW = Math.min(targetW, beltW * 0.35);
    const finalH = finalW * (textImgA.height / textImgA.width);
    doc.addImage(
      textImgA.dataUrl,
      'PNG',
      beltX + 6,
      beltY + (beltH - finalH) / 2,
      finalW,
      finalH
    );
  }

  const textImgB = renderTextToImage(state.textB, state.font, threadB.hex);
  if (textImgB) {
    const targetH = 12;
    const targetW = textImgB.width * (targetH / textImgB.height);
    const finalW = Math.min(targetW, beltW * 0.35);
    const finalH = finalW * (textImgB.height / textImgB.width);
    const rightEdge = hasTip
      ? beltX + beltW * 0.72 - 4
      : beltX + beltW - 6;
    doc.addImage(
      textImgB.dataUrl,
      'PNG',
      rightEdge - finalW,
      beltY + (beltH - finalH) / 2,
      finalW,
      finalH
    );
  }

  let y = 110;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17);
  doc.text('§ Specification / 仕様', margin, y);
  doc.setDrawColor(232);
  doc.setLineWidth(0.2);
  doc.line(margin, y + 2, W - margin, y + 2);
  y += 12;

  const totalChars = state.textA.length + state.textB.length;
  const threadLine =
    state.threadColorA === state.threadColorB
      ? `${threadA.name} / ${threadA.hex}`
      : `Left: ${threadA.name} (${threadA.hex})  /  Right: ${threadB.name} (${threadB.hex})`;

  const rows: Array<[string, string]> = [
    ['Belt color', `${belt.name} / ${belt.ja} / ${belt.hex}`],
    ['Thread color', threadLine],
    ['Typeface', `${fontInfo.name} / ${fontInfo.ja}`],
    [
      'Characters',
      `${totalChars}  (Left: ${state.textA.length} / Right: ${state.textB.length})`,
    ],
    ['Side A', `Left end (左端)`],
    ['Side B', `Right end (右端)`],
    ['Orientation', `Horizontal (よこ書き)`],
  ];

  doc.setFontSize(9);
  rows.forEach(([k, v]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(136);
    doc.text(k, margin, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17);
    doc.text(v, margin + 50, y);
    y += 7;
  });

  y += 4;
  const blockH = 24;
  const blockGap = 4;

  // Side A block
  doc.setFillColor(250, 250, 248);
  doc.rect(margin, y, W - margin * 2, blockH, 'F');
  doc.setDrawColor(245, 216, 0);
  doc.setLineWidth(1.5);
  doc.line(margin, y, margin, y + blockH);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(136);
  doc.text(`SIDE A / 左端  —  Thread: ${threadA.name}`, margin + 6, y + 6);
  if (textImgA) {
    const maxW = W - margin * 2 - 12;
    const imgW = Math.min(maxW, textImgA.width * 0.35);
    const imgH = imgW * (textImgA.height / textImgA.width);
    doc.addImage(textImgA.dataUrl, 'PNG', margin + 6, y + 8, imgW, imgH);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(180);
    doc.text('(no embroidery)', margin + 6, y + 16);
  }
  y += blockH + blockGap;

  // Side B block
  doc.setFillColor(250, 250, 248);
  doc.rect(margin, y, W - margin * 2, blockH, 'F');
  doc.setDrawColor(245, 216, 0);
  doc.setLineWidth(1.5);
  doc.line(margin, y, margin, y + blockH);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(136);
  doc.text(`SIDE B / 右端  —  Thread: ${threadB.name}`, margin + 6, y + 6);
  if (textImgB) {
    const maxW = W - margin * 2 - 12;
    const imgW = Math.min(maxW, textImgB.width * 0.35);
    const imgH = imgW * (textImgB.height / textImgB.width);
    doc.addImage(textImgB.dataUrl, 'PNG', margin + 6, y + 8, imgW, imgH);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(180);
    doc.text('(no embroidery)', margin + 6, y + 16);
  }
  y += blockH + 8;

  // Invoice
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17);
  doc.text('§ Invoice / お会計', margin, y);
  doc.setDrawColor(232);
  doc.setLineWidth(0.2);
  doc.line(margin, y + 2, W - margin, y + 2);
  y += 12;

  const embPrice = totalChars * PRICE_PER_CHAR;
  const total = PRICE_BELT + embPrice;
  doc.setFontSize(9);
  const priceRows: Array<[string, string]> = [
    ['Belt (premium cotton)', `JPY ${PRICE_BELT.toLocaleString()}`],
    [
      `Embroidery — ${totalChars} chars x ${PRICE_PER_CHAR}`,
      `JPY ${embPrice.toLocaleString()}`,
    ],
  ];
  priceRows.forEach(([k, v]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(136);
    doc.text(k, margin, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17);
    doc.text(v, W - margin, y, { align: 'right' });
    y += 7;
  });
  y += 2;
  doc.setLineWidth(0.3);
  doc.setDrawColor(17);
  doc.line(margin, y, W - margin, y);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TOTAL', margin, y);
  doc.text(`JPY ${total.toLocaleString()}`, W - margin, y, { align: 'right' });

  // Footer
  const fy = H - 18;
  doc.setDrawColor(232);
  doc.setLineWidth(0.2);
  doc.line(margin, fy, W - margin, fy);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(136);
  doc.text('OBI Studio · Tokyo · Est. 2026', margin, fy + 5);
  doc.text('Lead time approx. 2 weeks', W / 2, fy + 5, { align: 'center' });
  doc.text('Page 1 / 1', W - margin, fy + 5, { align: 'right' });

  return doc;
}
