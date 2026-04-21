import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ストーリーで使う方法 | ぷに文字メーカー",
  description:
    "ぷに文字をInstagramストーリーに貼る方法を5ステップで解説",
};

const STEPS = [
  {
    image: "/punimoji/howto/step-01.jpg",
    title: "画像を保存する",
    desc: "ぷに文字メーカーで画像を作ったら「画像を保存」をタップして、カメラロールに保存してね。",
  },
  {
    image: "/punimoji/howto/step-02.jpg",
    title: "ストーリーズを開いてスタンプアイコンをタップ",
    desc: "画面上のメニューから「スタンプ」アイコン（□+）をタップ。",
  },
  {
    image: "/punimoji/howto/step-03.jpg",
    title: "写真を追加",
    desc: "画面上のメニューから「写真」をタップ。",
  },
  {
    image: "/punimoji/howto/step-04.jpg",
    title: "ぷに文字を選ぶ",
    desc: "カメラロールから、さっき保存したぷに文字の画像を選ぶ。",
  },
  {
    image: "/punimoji/howto/step-05.jpg",
    title: "配置して完成！",
    desc: "サイズ・位置・角度を調整してストーリーに投稿しよう。ぷに文字ステッカーの完成！",
  },
];

export default function HowToPage() {
  return (
    <main
      className="bg-sunburst"
      style={{ minHeight: "100vh" }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 640,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <a
            href="/punimoji/"
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#FF3B8E",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: 16,
            }}
          >
            &larr; トップに戻る
          </a>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#2D1B3D",
              marginBottom: 8,
            }}
          >
            ストーリーで使う方法
          </h1>
          <p style={{ fontSize: 14, color: "#8B7A9A" }}>
            ぷに文字をインスタストーリーに貼るやり方を紹介
          </p>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 64,
          }}
        >
          {STEPS.map((step, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              {/* Badge */}
              <div className="step-badge" style={{ margin: "0 auto 16px" }}>
                {i + 1}
              </div>

              {/* Title */}
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#2D1B3D",
                  marginBottom: 24,
                }}
              >
                {step.title}
              </h2>

              {/* Screenshot */}
              <div style={{ marginBottom: 24 }}>
                <img
                  src={step.image}
                  alt={`STEP ${i + 1}: ${step.title}`}
                  className="howto-screenshot"
                />
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: 15,
                  color: "#2D1B3D",
                  lineHeight: 1.8,
                  maxWidth: 400,
                  margin: "0 auto",
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 80 }}>
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
            ぷに文字をつくる ✨
          </a>
        </div>
      </div>
    </main>
  );
}
