import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "インスタで使う方法 | ぷに文字メーカー",
};

const STEPS = [
  {
    num: 1,
    title: "画像をダウンロード",
    desc: "ぷに文字メーカーで作った画像を保存します。スマホの場合は画像を長押しして「写真に保存」をタップ。",
  },
  {
    num: 2,
    title: "インスタのストーリー作成画面を開く",
    desc: "Instagramアプリを開いて、ストーリーの作成画面に進みます。",
  },
  {
    num: 3,
    title: "画像ステッカーマーク（□+）をタップ",
    desc: "上部メニューの画像ステッカーアイコンをタップします。",
  },
  {
    num: 4,
    title: "DLした画像を選ぶ",
    desc: "カメラロールからダウンロードしたぷに文字画像を選択します。",
  },
  {
    num: 5,
    title: "サイズ・位置を調整して投稿",
    desc: "ピンチイン・アウトでサイズを調整し、好きな位置に配置して投稿しましょう！",
  },
];

export default function HowToPage() {
  return (
    <div
      className="bg-sunburst"
      style={{
        minHeight: "100vh",
        padding: "40px 20px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 440,
        }}
      >
        <a
          href="/punimoji/"
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#FF3B8E",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 24,
          }}
        >
          &larr; ぷに文字メーカーに戻る
        </a>

        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#2D1B3D",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          📷 インスタで使う方法
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#8B7A9A",
            textAlign: "center",
            marginBottom: 36,
          }}
        >
          ストーリーにぷに文字を貼り付ける5ステップ
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {STEPS.map((step) => (
            <div key={step.num} className="card-puni" style={{ padding: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(180deg, #FF5AA0 0%, #FF3B8E 100%)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </span>
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#2D1B3D",
                    margin: 0,
                  }}
                >
                  {step.title}
                </h2>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "#8B7A9A",
                  lineHeight: 1.7,
                  margin: "0 0 16px",
                }}
              >
                {step.desc}
              </p>
              {/* Placeholder for screenshot */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  background: "#FFE4EF",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFB8D0",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                スクリーンショット
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a
            href="/punimoji/"
            className="btn-puni"
            style={{
              display: "inline-block",
              textDecoration: "none",
              padding: "16px 40px",
              fontSize: 16,
            }}
          >
            ぷに文字を作る ✨
          </a>
        </div>
      </div>
    </div>
  );
}
