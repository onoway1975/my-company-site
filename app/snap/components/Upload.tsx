"use client";

import { useState, useRef, useCallback } from "react";
import {
  findTemplate,
  TEMPLATE_EN,
  SUBJECT_PREVIEWS,
  type Subject,
} from "../data/templates";

export default function Upload({
  subject,
  templateId,
  onBack,
  onUpload,
}: {
  subject: Subject;
  templateId: string | null;
  onBack: () => void;
  onUpload: () => void;
}) {
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const tpl = findTemplate(templateId || "jp_03") || findTemplate("jp_03");
  const tplEn = TEMPLATE_EN[tpl?.id || ""] || "—";

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
        setUploaded(true);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) {
        handleFile(f);
      }
    },
    [handleFile]
  );

  const handleChoose = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleReset = useCallback(() => {
    setUploaded(false);
    setFileName("");
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  return (
    <div
      style={{
        padding: "56px 20px 32px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div className="snap-header-bar">
        <button className="snap-back-btn" onClick={onBack}>
          ‹
        </button>
        <div style={{ flex: 1 }}>
          <div className="snap-wordmark-sm">SNAP STUDIO</div>
        </div>
        <div className="snap-header-spacer" />
      </div>

      {/* Selected studio badge */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div className="snap-selected-label">selected studio</div>
        <div className="snap-selected-title">
          {tpl?.title || "未選択"}{" "}
          <span className="snap-selected-en">— {tplEn}</span>
        </div>
      </div>

      {/* Upload card */}
      <div className="snap-upload-card">
        <div className="snap-upload-frame">
          {uploaded && previewUrl ? (
            <img src={previewUrl} alt="" />
          ) : uploaded ? (
            <img src={SUBJECT_PREVIEWS[subject]} alt="" />
          ) : (
            <>
              {/* Upload icon */}
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle
                  cx="22"
                  cy="22"
                  r="21"
                  stroke="#2C1810"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <path
                  d="M22 14v14M15 21l7-7 7 7"
                  stroke="#2C1810"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="snap-upload-label">写真を選ぶ</div>
              <div className="snap-upload-hint">tap to upload</div>
            </>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileInput}
        />

        {!uploaded ? (
          <button className="snap-choose-btn" onClick={handleChoose}>
            CHOOSE A PHOTO
          </button>
        ) : (
          <div className="snap-file-row">
            <div className="snap-file-dot" />
            <div className="snap-file-name">{fileName}</div>
            <button className="snap-file-change" onClick={handleReset}>
              change
            </button>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="snap-tips">
        <div className="snap-tips-label">— tips —</div>
        · 被写体がはっきり写っている写真がおすすめ
        <br />
        · 明るい自然光 · 正面〜斜め向き
        <br />
        {subject === "child" && "· 保護者の同意のもとご利用ください"}
      </div>

      {/* CTA */}
      <button
        className={`snap-cta ${uploaded ? "enabled" : "disabled"}`}
        disabled={!uploaded}
        onClick={onUpload}
      >
        CONTINUE
      </button>
    </div>
  );
}
