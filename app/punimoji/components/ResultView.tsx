"use client";

import { useState } from "react";
import { STYLES, type StyleId } from "@/lib/punimoji-prompt";

export default function ResultView({
  word,
  style,
  imageUrl,
  onClose,
  onRegenerate,
}: {
  word: string;
  style: StyleId;
  imageUrl: string;
  onClose: () => void;
  onRegenerate: (newStyle: StyleId) => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const otherStyles = STYLES.filter((s) => s.id !== style);

  const handleSave = async () => {
    if (!imageUrl) return;
    setDownloading(true);
    try {
      // fetch → blob化（CORS対策: fal.mediaの外部URLを直接<a download>できないため）
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      // 透過PNGを維持するためCanvas変換は行わない
      const pngBlob = new Blob([blob], { type: "image/png" });

      const isTouchDevice = navigator.maxTouchPoints > 0;

      if (isTouchDevice) {
        // スマホ: BlobURL HTMLページに同タブ遷移 → 長押し保存 → 「← 結果に戻る」で戻る
        // BlobURL内の別BlobURLはSafariが画像と認識できないため、data URL(base64)に変換
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(pngBlob);
        });
        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ぷに文字 - ${word}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#FFE4EF;min-height:100vh;font-family:sans-serif;-webkit-user-select:none;user-select:none;padding:20px}
.image-wrapper{display:block;width:100%;max-width:500px;margin:20px auto;background:white;border-radius:24px;padding:20px;box-shadow:0 4px 16px rgba(255,59,142,0.1)}
.image-wrapper img{display:block;width:100%;height:auto;-webkit-user-select:auto;user-select:auto;-webkit-touch-callout:default;pointer-events:auto}
p{text-align:center;color:#8B7A9A;font-size:14px;margin:20px 0}
.btn{display:block;margin:20px auto;background:#FF3B8E;color:white;border:none;border-radius:9999px;padding:16px 32px;font-size:16px;font-weight:700;cursor:pointer;text-decoration:none;text-align:center;width:fit-content}
</style>
</head>
<body>
<figure class="image-wrapper"><img src="${dataUrl}" alt="ぷに文字: ${word}"></figure>
<p>画像を長押しして<br>「写真に追加」で保存できます 📱</p>
<a class="btn" href="javascript:history.back()">← 結果に戻る</a>
</body>
</html>`;
        const htmlBlob = new Blob([html], { type: "text/html;charset=utf-8" });
        const blobUrl = URL.createObjectURL(htmlBlob);
        window.location.href = blobUrl;
      } else {
        // PC: 自動ダウンロード
        const url = URL.createObjectURL(pngBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `punimoji-${word}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error("Download error:", e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(255,245,247,0.97)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 20px 60px",
        animation: "puniFadeIn 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: 16,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: 14,
            fontWeight: 700,
            color: "#FF3B8E",
            cursor: "pointer",
            padding: "8px 0",
            fontFamily: "'LINE Seed JP', sans-serif",
          }}
        >
          &larr; もう一度
        </button>
      </div>

      {/* Image */}
      <div
        className="card-puni"
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <img
          src={imageUrl}
          alt={`ぷに文字: ${word}`}
          style={{
            width: "100%",
            borderRadius: 24,
            display: "block",
          }}
        />
      </div>

      {/* Word label */}
      <p
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#2D1B3D",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        「{word}」
      </p>

      {/* Style label */}
      <p
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "#8B7A9A",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        {STYLES.find((s) => s.id === style)?.emoji} {STYLES.find((s) => s.id === style)?.name} で作成
      </p>

      {/* Save button */}
      <button
        className="btn-puni"
        onClick={handleSave}
        disabled={downloading}
        style={{ width: "100%", maxWidth: 320, marginBottom: 12, opacity: downloading ? 0.6 : 1 }}
      >
        {downloading ? "⏳ 準備中…" : "📥 画像を保存"}
      </button>

      {/* How-to link */}
      <a
        href="/punimoji/how-to/"
        style={{
          display: "block",
          width: "100%",
          maxWidth: 320,
          padding: "14px 0",
          borderRadius: 9999,
          border: "2px solid #FFD9E3",
          background: "white",
          color: "#FF3B8E",
          fontSize: 14,
          fontWeight: 700,
          textAlign: "center",
          textDecoration: "none",
          marginBottom: 32,
        }}
      >
        📷 ストーリーで使う方法
      </a>

      {/* Other styles */}
      <div style={{ width: "100%", maxWidth: 400 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#8B7A9A",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          このワードで別スタイル
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {otherStyles.map((s) => (
            <button
              key={s.id}
              className="style-chip"
              onClick={() => onRegenerate(s.id)}
            >
              <span className="emoji">{s.emoji}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
