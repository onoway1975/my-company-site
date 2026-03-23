"use client";

import { useState, useRef } from "react";
import type { Figure } from "@/app/data/figures";
import { generateFaceFusion } from "./actions";

type Status = "idle" | "generating" | "done" | "error";

function resizeToDataUrl(file: File, maxPx = 768): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxPx || height > maxPx) {
          if (width >= height) {
            height = Math.round((height * maxPx) / width);
            width = maxPx;
          } else {
            width = Math.round((width * maxPx) / height);
            height = maxPx;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

async function downloadImage(url: string, filename: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function DemoClient({ figure }: { figure: Figure }) {
  // Face fusion state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fusionOutput, setFusionOutput] = useState<string | null>(null);
  const [fusionStatus, setFusionStatus] = useState<Status>("idle");
  const [fusionStep, setFusionStep] = useState<null>(null);
  const [fusionError, setFusionError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const dataUrl = await resizeToDataUrl(file);
    setUploadedImage(dataUrl);
    setFusionOutput(null);
    setFusionStatus("idle");
    setFusionError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleFaceFusion = async () => {
    if (!uploadedImage) return;
    setFusionStatus("generating");
    setFusionError(null);
    setFusionOutput(null);
    try {
      const { output } = await generateFaceFusion(figure.id, uploadedImage);
      if (!output?.[0]) throw new Error("生成結果が取得できませんでした");
      setFusionOutput(output[0]);
      setFusionStatus("done");
    } catch (e) {
      setFusionStatus("error");
      setFusionError(e instanceof Error ? e.message : "エラーが発生しました");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-24">
      {/* Figure info */}
      <div className="mb-14">
        <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-6">
          Today&apos;s Figure
        </p>
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-10 mb-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-ink leading-none">
            {figure.name}
          </h1>
          <div className="flex items-end gap-6 pb-2">
            <div>
              <p className="text-sm text-muted mb-1">{figure.nameEn}</p>
              <p className="text-sm text-muted">{figure.era}</p>
            </div>
            {figure.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={figure.image_url}
                alt={figure.name}
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover object-top shrink-0"
              />
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 border border-border px-3 py-1 text-xs text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BF3315]" />
            {figure.artStyle}
          </span>
          <span className="inline-flex items-center border border-border px-3 py-1 text-xs text-muted">
            {figure.tagline}
          </span>
        </div>
        <p className="text-sm text-muted leading-relaxed max-w-2xl">
          {figure.description}
        </p>
      </div>

      {/* Face Fusion Section */}
      <div className="border-t border-border pt-14">
        <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-2">
          Face Fusion
        </p>
        <p className="text-sm text-muted mb-10 max-w-xl">
          あなたの写真をアップロードして、{figure.name}スタイルの肖像画に合成します。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {/* Upload area */}
          <div>
            <p className="text-xs text-muted mb-3">あなたの写真</p>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={[
                "w-full aspect-square border flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative",
                isDragging
                  ? "border-[#BF3315] bg-[#BF3315]/5"
                  : "border-border bg-surface hover:border-ink",
              ].join(" ")}
            >
              {uploadedImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={uploadedImage}
                  alt="uploaded"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted select-none">
                  <UploadIcon />
                  <p className="text-xs text-center px-4">
                    クリックまたはドラッグで写真をアップロード
                  </p>
                  <p className="text-[10px] text-muted/50">JPG / PNG / WEBP</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {uploadedImage && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs text-muted hover:text-ink transition-colors"
              >
                写真を変更する
              </button>
            )}
          </div>

          {/* Output area */}
          <div>
            <p className="text-xs text-muted mb-3">合成結果</p>
            <div className="w-full aspect-square border border-border flex items-center justify-center bg-surface overflow-hidden relative">
              {fusionOutput ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fusionOutput}
                  alt="fusion result"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : fusionStatus === "generating" ? (
                <div className="flex flex-col items-center gap-4 text-muted">
                  <LoadingDots />
                  <p className="text-xs">顔合成中…</p>
                  <p className="text-xs text-muted/60">約 30〜60 秒かかります</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted">
                  <ImagePlaceholderIcon />
                  <p className="text-xs">合成画像がここに表示されます</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fusion button */}
        <div className="max-w-3xl mt-6">
          <button
            onClick={handleFaceFusion}
            disabled={!uploadedImage || fusionStatus === "generating"}
            className={[
              "w-full py-4 text-sm font-medium tracking-widest transition-colors",
              uploadedImage && fusionStatus !== "generating"
                ? "bg-[#BF3315] text-white hover:bg-[#a02c10] cursor-pointer"
                : "bg-surface text-muted cursor-not-allowed",
            ].join(" ")}
          >
            {fusionStatus === "generating" ? (
              <span className="flex items-center justify-center gap-2">
                <SpinnerIcon />
                顔合成中…
              </span>
            ) : fusionOutput ? (
              "もう一度合成する"
            ) : (
              "AI で合成する"
            )}
          </button>

          {fusionError && (
            <p className="mt-3 text-xs text-red-600 text-center">{fusionError}</p>
          )}

          {fusionOutput && (
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={() => downloadImage(fusionOutput, `${figure.id}-fusion.jpg`)}
                className="w-full py-3 border border-ink text-sm font-medium hover:bg-ink hover:text-white transition-colors cursor-pointer"
              >
                画像をダウンロード
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted/40">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function ImagePlaceholderIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted/40">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function LoadingDots() {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-muted/40 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
