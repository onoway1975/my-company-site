"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ────────────────────────────── Types & Constants ────────────────────────────── */

type SuitType = "male_navy" | "male_black" | "female_navy" | "female_black";
type BackgroundType = "white" | "blue" | "gray";
type PdfSizeId = "2x3" | "3x4";

const SUIT_OPTIONS: { value: SuitType; label: string }[] = [
  { value: "male_navy", label: "紺（男性）" },
  { value: "male_black", label: "黒（男性）" },
  { value: "female_navy", label: "紺（女性）" },
  { value: "female_black", label: "黒（女性）" },
];
const BACKGROUND_OPTIONS: {
  value: BackgroundType;
  label: string;
  hex: string;
  border: string;
}[] = [
  { value: "white", label: "白", hex: "#FFFFFF", border: "#E0E0E0" },
  { value: "blue", label: "水色", hex: "#B8D4E8", border: "#8AB0CC" },
  { value: "gray", label: "薄いグレー", hex: "#C8C8C8", border: "#A0A0A0" },
];

const PDF_SIZES: Record<
  PdfSizeId,
  {
    w: number;
    h: number;
    cols: number;
    rows: number;
    label: string;
    count: number;
  }
> = {
  "2x3": { w: 20, h: 30, cols: 5, rows: 4, label: "2×3cm", count: 20 },
  "3x4": { w: 30, h: 40, cols: 4, rows: 3, label: "3×4cm", count: 12 },
};

/* ────────────────────────────── Image resize helper ─────────────────────────── */

function resizeImage(dataUrl: string, maxSize: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width <= maxSize && height <= maxSize) {
        resolve(dataUrl);
        return;
      }
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.src = dataUrl;
  });
}

/* ────────────────────────────── PDF helpers ──────────────────────────────────── */

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}


/**
 * Canvas で元画像を cover トリミングし、指定 mm サイズの JPEG DataURL を返す。
 * ループの外で1回だけ呼び、全セルで使い回す。
 */
function cropCover(
  imgEl: HTMLImageElement,
  targetWmm: number,
  targetHmm: number
): string {
  const PX_PER_MM = 11.811; // 300 dpi
  const cW = Math.round(targetWmm * PX_PER_MM);
  const cH = Math.round(targetHmm * PX_PER_MM);

  const imgNW = imgEl.naturalWidth;
  const imgNH = imgEl.naturalHeight;
  const imgAspectVal = imgNW / imgNH;
  const canvasAspect = cW / cH;

  let sx: number, sy: number, sw: number, sh: number;
  if (imgAspectVal > canvasAspect) {
    // 元画像が横長 → 高さを合わせて左右をトリミング
    sh = imgNH;
    sw = imgNH * canvasAspect;
    sx = (imgNW - sw) / 2;
    sy = 0;
  } else {
    // 元画像が縦長 → 幅を合わせて上下をトリミング
    sw = imgNW;
    sh = imgNW / canvasAspect;
    sx = 0;
    sy = (imgNH - sh) / 2;
  }

  const canvas = document.createElement("canvas");
  canvas.width = cW;
  canvas.height = cH;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, cW, cH);
  return canvas.toDataURL("image/jpeg", 0.95);
}

/** jsPDF で A4 PDF を生成・保存 */
async function generatePDF(
  imageUrl: string,
  sizeId: PdfSizeId,
  _imgAspect: number
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jspdfModule = (window as any).jspdf;
  if (!jspdfModule) throw new Error("jsPDF not loaded");

  const size = PDF_SIZES[sizeId];
  const doc = new jspdfModule.jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // 元画像を HTMLImageElement として読み込む
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  const dataUrl = await blobToDataUrl(blob);

  const imgEl = await new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = dataUrl;
  });

  // Canvas で cover トリミング済み画像を1回だけ生成
  const croppedData = cropCover(imgEl, size.w, size.h);

  const MARGIN_X = 15;
  const MARGIN_Y = 20;
  const GAP = 3;

  /* ── ヘッダー ── */
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `ID Photo ${size.label} - ${size.cols} x ${size.rows} = ${size.count} prints`,
    MARGIN_X,
    13
  );
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text(
    "Please cut along the trim lines",
    MARGIN_X,
    17
  );

  /* ── 写真グリッド ── */
  const photoW = size.w;
  const photoH = size.h;

  for (let row = 0; row < size.rows; row++) {
    for (let col = 0; col < size.cols; col++) {
      const x = MARGIN_X + col * (photoW + GAP);
      const y = MARGIN_Y + row * (photoH + GAP);

      // トリミング済み画像をそのまま配置（アスペクト比は正確）
      doc.addImage(croppedData, "JPEG", x, y, photoW, photoH);

      // 切り取り線（画像の上に描画）
      doc.setDrawColor(80, 80, 80);
      doc.setLineWidth(0.2);
      doc.rect(x, y, photoW, photoH);

      // トンボ（四隅 L 字マーク 2mm・外側 0.5mm）
      const markLen = 2;
      const markGap = 0.5;
      doc.setDrawColor(120, 120, 120);
      doc.setLineWidth(0.15);
      // Top-left
      doc.line(x - markGap - markLen, y, x - markGap, y);
      doc.line(x, y - markGap - markLen, x, y - markGap);
      // Top-right
      doc.line(x + photoW + markGap, y, x + photoW + markGap + markLen, y);
      doc.line(x + photoW, y - markGap - markLen, x + photoW, y - markGap);
      // Bottom-left
      doc.line(x - markGap - markLen, y + photoH, x - markGap, y + photoH);
      doc.line(x, y + photoH + markGap, x, y + photoH + markGap + markLen);
      // Bottom-right
      doc.line(
        x + photoW + markGap,
        y + photoH,
        x + photoW + markGap + markLen,
        y + photoH
      );
      doc.line(
        x + photoW,
        y + photoH + markGap,
        x + photoW,
        y + photoH + markGap + markLen
      );
    }
  }

  /* ── フッター ── */
  doc.setFontSize(6);
  doc.setTextColor(180);
  doc.text("A4 Sticker Sheet / RESUME PHOTO MAKER", MARGIN_X, 290);

  doc.save(`resume_photo_${sizeId}.pdf`);
}

/* ────────────────────────────── Inline Components ───────────────────────────── */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 mb-4"
      style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E0D5" }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-bold tracking-wider mb-3"
      style={{ color: "#C8A96E" }}
    >
      {children}
    </p>
  );
}

function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; hex?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs mb-2" style={{ color: "#888" }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: selected ? "#1A1A1A" : "#FFFFFF",
                color: selected ? "#FFFFFF" : "#1A1A1A",
                border: `1px solid ${selected ? "#1A1A1A" : "#E8E0D5"}`,
              }}
            >
              {opt.hex && (
                <span
                  className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle border border-gray-200"
                  style={{ backgroundColor: opt.hex }}
                />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** A4 レイアウトの縮小プレビュー */
function A4Preview({
  sizeId,
  imageUrl,
}: {
  sizeId: PdfSizeId;
  imageUrl: string | null;
}) {
  const size = PDF_SIZES[sizeId];
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN_X = 15;
  const MARGIN_Y = 20;
  const GAP = 3;

  const availW = PAGE_W - MARGIN_X * 2;
  const availH = PAGE_H - MARGIN_Y * 2;
  const totalW = size.cols * size.w + (size.cols - 1) * GAP;
  const totalH = size.rows * size.h + (size.rows - 1) * GAP;
  const startX = MARGIN_X + (availW - totalW) / 2;
  const startY = MARGIN_Y + (availH - totalH) / 2;

  const cells: { left: string; top: string; width: string; height: string }[] =
    [];
  for (let r = 0; r < size.rows; r++) {
    for (let c = 0; c < size.cols; c++) {
      cells.push({
        left: `${((startX + c * (size.w + GAP)) / PAGE_W) * 100}%`,
        top: `${((startY + r * (size.h + GAP)) / PAGE_H) * 100}%`,
        width: `${(size.w / PAGE_W) * 100}%`,
        height: `${(size.h / PAGE_H) * 100}%`,
      });
    }
  }

  return (
    <div
      className="mx-auto relative bg-white rounded-lg overflow-hidden"
      style={{
        aspectRatio: "210/297",
        maxWidth: 220,
        border: "1px solid #E8E0D5",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {cells.map((cell, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: cell.left,
            top: cell.top,
            width: cell.width,
            height: cell.height,
            border: "0.5px dashed #C8A96E",
            backgroundColor: imageUrl ? undefined : "#F5F0E8",
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      ))}
      {/* 枚数ラベル */}
      <span
        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] whitespace-nowrap"
        style={{ color: "#AAA" }}
      >
        {size.label} × {size.count}枚
      </span>
    </div>
  );
}

/* ────────────────────────────── Main Page ────────────────────────────────────── */

export default function ResumePhotoPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [suit, setSuit] = useState<SuitType>("male_navy");
  const [background, setBackground] = useState<BackgroundType>("white");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfSize, setPdfSize] = useState<PdfSizeId>("3x4");
  const [jspdfReady, setJspdfReady] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [imgAspect, setImgAspect] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── 生成画像のアスペクト比を取得 ── */
  useEffect(() => {
    if (!generatedImageUrl) return;
    const img = new Image();
    img.onload = () => {
      setImgAspect(img.naturalWidth / img.naturalHeight);
    };
    img.src = generatedImageUrl;
  }, [generatedImageUrl]);

  /* ── jsPDF CDN 読み込み ── */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).jspdf) {
      setJspdfReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => setJspdfReady(true);
    document.head.appendChild(script);
  }, []);

  /* ── ファイルアップロード ── */
  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("画像ファイルを選択してください");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("ファイルサイズは10MB以下にしてください");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const resized = await resizeImage(dataUrl, 1024);
      setUploadedImage(resized);
      setError(null);
      setGeneratedImageUrl(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  /* ── AI 生成 ── */
  const handleGenerate = async () => {
    if (!uploadedImage) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/resumephoto/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: uploadedImage,
          suit,
          glasses: "none",
          expression: "natural_smile",
          background,
          angle: "front",
        }),
      });

      const data = await res.json();

      // 残り回数は成功・失敗問わず常に更新
      if (data.remaining !== undefined) setRemaining(data.remaining);

      if (!res.ok) {
        if (data.error === "LIMIT_REACHED") {
          setRemaining(0);
          setError(
            "本日の生成回数上限（100回）に達しました。明日またお試しください。"
          );
        } else {
          setError(data.error || "生成に失敗しました");
        }
        return;
      }

      setGeneratedImageUrl(data.imageUrl);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ── JPG ダウンロード（PC: 自動DL / スマホ: 同タブ画像ページ） ── */
  const handleDownloadJPG = async () => {
    if (!generatedImageUrl) return;
    try {
      const res = await fetch(generatedImageUrl);
      const blob = await res.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const isTouchDevice = navigator.maxTouchPoints > 0;

      if (isTouchDevice) {
        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>証明写真</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#111;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px;gap:16px}
img{max-width:100%;border-radius:16px;display:block}
p{color:rgba(255,255,255,0.6);font-size:14px;text-align:center;font-family:sans-serif;line-height:1.8}
.btn{display:inline-block;margin-top:8px;padding:14px 32px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:100px;color:white;font-size:15px;font-family:sans-serif;font-weight:bold;text-decoration:none;cursor:pointer}
</style>
</head>
<body>
<img src="${base64}" alt="証明写真">
<p>画像を長押しして<br>「写真に追加」で保存できます</p>
<a class="btn" href="javascript:history.back()">← 戻る</a>
</body>
</html>`;
        const htmlBlob = new Blob([html], { type: "text/html;charset=utf-8" });
        const blobUrl = URL.createObjectURL(htmlBlob);
        window.location.href = blobUrl;
      } else {
        const link = document.createElement("a");
        link.href = base64;
        link.download = "resume-photo.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      setError("ダウンロードに失敗しました");
    }
  };

  /* ── PDF ダウンロード ── */
  const handleDownloadPDF = async () => {
    if (!generatedImageUrl || !jspdfReady) return;
    setIsPdfGenerating(true);
    try {
      await generatePDF(generatedImageUrl, pdfSize, imgAspect);
    } catch {
      setError("PDF生成に失敗しました");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const currentPdfSize = PDF_SIZES[pdfSize];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F0EDE6" }}>
      {/* ── Hero Image ── */}
      <div style={{ width: "100%", background: "#F0EDE6" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/resumephoto/hero.webp"
          alt="証明写真メーカー"
          style={{
            display: "block",
            width: "100%",
            maxWidth: "800px",
            height: "auto",
            margin: "0 auto",
          }}
        />
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* 残り回数バッジ */}
        {remaining !== null && (
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: remaining === 0 ? "#FFF5F5" : "#FFFFFF",
                color: remaining === 0 ? "#C53030" : "#1A1A1A",
                border: `1px solid ${remaining === 0 ? "#FED7D7" : "#E8E0D5"}`,
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: remaining === 0 ? "#C53030" : "#C8A96E",
                }}
              />
              {remaining === 0
                ? "本日の上限に達しました"
                : `残り ${remaining} 回`}
            </div>
          </div>
        )}

        {/* ── Step 1: Upload ── */}
        <Card>
          <SectionLabel>1. 写真をアップロード</SectionLabel>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[180px]"
            style={{
              border: `2px dashed ${isDragging ? "#C8A96E" : "#E8E0D5"}`,
              backgroundColor: isDragging ? "#FAF6EF" : "#FAFAF8",
            }}
          >
            {uploadedImage ? (
              <div className="p-4 flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedImage}
                  alt="アップロード画像"
                  className="max-h-40 rounded-lg object-cover"
                />
                <span className="text-xs" style={{ color: "#999" }}>
                  タップで変更
                </span>
              </div>
            ) : (
              <div className="p-8 text-center">
                <svg
                  className="mx-auto mb-3"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C8A96E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#1A1A1A" }}
                >
                  写真をドラッグ&ドロップ
                </p>
                <p className="text-xs mt-1" style={{ color: "#999" }}>
                  またはタップして選択
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <p
            style={{
              fontSize: 11,
              color: "#999",
              textAlign: "center",
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            💡 正面を向いて真っすぐ撮影した写真を使うと、より精度が上がります
          </p>
        </Card>

        {/* ── Step 2: Customize ── */}
        <Card>
          <SectionLabel>2. スーツと背景を選ぶ</SectionLabel>
          <OptionGroup
            label="スーツ"
            options={SUIT_OPTIONS}
            value={suit}
            onChange={setSuit}
          />
          <OptionGroup
            label="背景色"
            options={BACKGROUND_OPTIONS}
            value={background}
            onChange={setBackground}
          />
        </Card>

        {/* ── 所要時間の目安 ── */}
        {uploadedImage && !generatedImageUrl && (
          <p
            className="text-center mb-2"
            style={{ fontSize: 12, color: "#999" }}
          >
            ⏱ 生成には約20〜40秒かかります
          </p>
        )}

        {/* ── Generate / Reset Button ── */}
        {generatedImageUrl ? (
          <button
            onClick={() => {
              setGeneratedImageUrl(null);
              setUploadedImage(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              background: "transparent",
              color: "#1A1A1A",
              border: "1.5px solid #1A1A1A",
              borderRadius: 10,
              padding: "14px",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.05em",
              width: "100%",
              cursor: "pointer",
              marginBottom: 16,
            }}
          >
            もう一度作る
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={!uploadedImage || isGenerating || remaining === 0}
            className="w-full py-4 rounded-xl text-base font-bold tracking-wider transition-opacity disabled:opacity-40"
            style={{ backgroundColor: "#C8A96E", color: "#1A1A1A" }}
          >
            {remaining === 0 ? (
              "本日の上限に達しました"
            ) : isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="31.4 31.4"
                    strokeLinecap="round"
                  />
                </svg>
                生成中...
              </span>
            ) : (
              "証明写真を生成する"
            )}
          </button>
        )}

        {/* ── Error ── */}
        {error && (
          <div
            className="mt-4 p-3 rounded-lg text-sm text-center"
            style={{
              backgroundColor: "#FFF5F5",
              color: "#C53030",
              border: "1px solid #FED7D7",
            }}
          >
            {error}
          </div>
        )}

        {/* ── Result: Photo + JPG ── */}
        {generatedImageUrl && (
          <>
            <Card>
              <SectionLabel>生成結果</SectionLabel>
              <div className="flex justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedImageUrl}
                  alt="生成された証明写真"
                  className="rounded-lg shadow-md"
                  style={{
                    maxHeight: 320,
                    aspectRatio: "3/4",
                    objectFit: "cover",
                  }}
                />
              </div>
              <button
                onClick={handleDownloadJPG}
                className="w-full py-3 rounded-xl text-sm font-bold tracking-wider"
                style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}
              >
                JPG ダウンロード
              </button>
            </Card>

            {/* ── Result: PDF ── */}
            <Card>
              <SectionLabel>PDF出力（A4・切り取り線付き）</SectionLabel>

              {/* サイズ選択 */}
              <p className="text-xs mb-2" style={{ color: "#888" }}>
                写真サイズ
              </p>
              <div className="flex gap-2 mb-5">
                {(Object.keys(PDF_SIZES) as PdfSizeId[]).map((id) => {
                  const s = PDF_SIZES[id];
                  const selected = id === pdfSize;
                  return (
                    <button
                      key={id}
                      onClick={() => setPdfSize(id)}
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: selected ? "#1A1A1A" : "#FFFFFF",
                        color: selected ? "#FFFFFF" : "#1A1A1A",
                        border: `1px solid ${selected ? "#1A1A1A" : "#E8E0D5"}`,
                      }}
                    >
                      {s.label}
                      <span
                        className="block text-[10px] mt-0.5"
                        style={{
                          color: selected
                            ? "rgba(255,255,255,0.6)"
                            : "#AAA",
                        }}
                      >
                        {s.count}枚面付け
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* A4 プレビュー */}
              <A4Preview sizeId={pdfSize} imageUrl={generatedImageUrl} />

              {/* PDF ダウンロード */}
              <button
                onClick={handleDownloadPDF}
                disabled={!jspdfReady || isPdfGenerating}
                className="w-full py-3 rounded-xl text-sm font-bold tracking-wider mt-5 transition-opacity disabled:opacity-40"
                style={{
                  border: "1.5px solid #1A1A1A",
                  color: "#1A1A1A",
                  backgroundColor: "#FFFFFF",
                }}
              >
                {isPdfGenerating
                  ? "PDF生成中..."
                  : `🖨 PDFをダウンロード（${currentPdfSize.count}枚／A4）`}
              </button>
            </Card>
          </>
        )}

        {/* ── Footer note ── */}
        <p
          className="text-center text-[10px] mt-8"
          style={{ color: "#BBB" }}
        >
          Powered by AI — 生成結果はAIによるものです
        </p>
      </div>
    </div>
  );
}
