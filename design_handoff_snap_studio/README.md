# Handoff: SNAP STUDIO — AI写真加工Webサービス

## Overview

SNAP STUDIO は、普段の写真をスタジオ撮影のような特別な一枚に変換するAI写真加工Webサービスです。ユーザーはスタジオ(テンプレート)を選び、愛犬・愛猫・子どもの写真をアップロードすると、FAL.ai(想定)で変換された結果を保存・シェアできます。

この ハンドオフ には **3画面** のプロトタイプが含まれています:
1. **Landing** — ロゴ + タグライン + カテゴリタブ + スタジオグリッド(2カラム)
2. **Upload** — 選択スタジオ表示 + 写真アップロードエリア + CTA
3. **Result** — 生成結果プレビュー + 保存/LINE/メールの円形アクションボタン + 再撮影リンク

Spec 原本: `snap_studio_spec_v0.5.md`

---

## About the Design Files

このバンドルに含まれる HTML/JSX ファイルは **HTML で作成されたデザインリファレンス**です — 最終的な見た目とインタラクションを示すプロトタイプであり、本番コードとしてそのまま移植するためのものではありません。

実装タスクは、これらの HTML デザインを **ターゲット・コードベース(Next.js App Router を想定 — spec参照)** の既存パターン・ライブラリを使って再現することです。まだ環境が無い場合は、spec どおり **Next.js (App Router) + Vercel** をベースに実装してください。

---

## Fidelity

**High-fidelity (hifi)** — ピクセルパーフェクトなモックアップです。
- 最終的なカラー・タイポグラフィ・余白・角丸・シャドウがすべて決まっています。
- インタラクション(画面遷移、タブ切替、選択状態、保存フィードバック)も動作確認済み。
- 既存ライブラリ・コンポーネントで **同じ見た目に再現** してください。

---

## Screens / Views

### 1. Landing (`01 Landing`)

**Purpose**: ユーザーがどのスタジオ(テンプレ)で撮るかを選ぶ最初の画面。

**Layout** (iPhone 390×844、パディング 56px top / 20px side / 32px bottom):
1. Editorial header row: `est. 2026` ↔ `ciraf inc.` (両端揃え、10px serif uppercase, letter-spacing 0.18em)
2. Silhouettes row: 犬・●・猫 (シルエット 34px、中央揃え、gap 12px)
3. Wordmark ブロック (中央揃え):
   - `SNAP STUDIO` — Cormorant Garamond 500, 30px, letter-spacing 0.10em
   - Hairline — 110×1px, `#2C1810`
   - `for your loved ones` — 10px italic, letter-spacing 0.20em
4. Tagline: `今日は、どのスタジオで撮ろう？` — 20px serif italic, 中央揃え
5. セクションラベル: `— choose your studio —` (10px serif uppercase, opacity 0.7)
6. Category tabs (横スクロール、中点区切り、選択中はアンダーライン+italic)
7. **Studio grid** — 2カラム、gap 12px。各カード:
   - 背景 `#F5EDE0`、角丸 14px、padding 8px、shadow `0 4px 12px rgba(44,24,16,0.10)`
   - 画像(aspect-ratio 3:4、角丸 8px、セピアフィルタ `sepia(0.22) saturate(0.85) contrast(0.95)`)
   - 日本語タイトル(14px serif 500)
   - カテゴリ名(9px serif uppercase italic, muted)
8. Footer: `30 templates · 7 categories` (9px serif uppercase, opacity 0.6)

**Interactions**:
- カードタップ → 選択テンプレ ID を保持して `upload` 画面へ
- カテゴリタブ切替 → グリッドが差し替わる(アニメなし、即時)

---

### 2. Upload (`02 Upload`)

**Purpose**: 選択済みスタジオを確認しつつ、変換したい写真をアップロード。

**Layout**:
1. Header: `‹` back ボタン + wordmark(small, 中央)
2. **Selected Studio バッジ**(中央揃え):
   - `SELECTED STUDIO` — 10px serif uppercase, muted
   - `桜満開 — Cherry Blossom` — 22px serif italic
3. **Upload card** (`#F5EDE0`、角丸 24px、padding 20px):
   - 点線 1px ダッシュの `#F5EDE0` フレーム(aspect-ratio 4:5、角丸 16px、背景 `#EFE4D4`)
   - 未アップロード: 丸い upload icon(44×44、thin line)+ `写真を選ぶ` + `tap to upload`
   - アップ後: サンプル画像(セピアフィルタ)
   - 下に `CHOOSE A PHOTO` 輪郭ボタン / アップ後は `● filename.jpg  change` row
4. Tips(11px、opacity 0.75、小文字点記号):
   - 被写体がはっきり写っている写真
   - 明るい自然光・正面〜斜め向き
   - (子どもの場合) 保護者の同意のもとご利用ください
5. CTA: `CONTINUE` 大型ボタン。未アップ時は disabled(opacity 0.35)、アップ後はソリッド `#2C1810` / `#F5EDE0` テキスト

**Interactions**:
- `‹` → landing へ戻る
- CHOOSE A PHOTO タップで file input、選択後プレビュー更新
- CONTINUE タップ → result 画面へ

---

### 3. Result (`03 Result`)

**Purpose**: 生成結果を確認し、保存・シェア、または別のスタジオで再撮影。

**Layout**:
1. Header: `‹` back + wordmark + トーン調整アイコン(右)
2. **Preview frame** (`#F5EDE0` 角丸 20px padding 14px shadow `0 8px 24px rgba(44,24,16,0.12)`):
   - 内側画像(aspect-ratio 4:5、セピア `sepia(0.18) saturate(0.92) contrast(0.95)`)
   - 左下キャプション: `— PREVIEW —` + テンプレ日本語タイトル(18px serif italic)
   - 右下: `NO. jp / 03` 的なID表記(10px serif uppercase)
3. **SAVE & SHARE セクション** (bottom、margin-top: auto):
   - ラベル `— save & share —`(10px serif uppercase, opacity 0.7)
   - 3つの円形ボタン(横並び、gap 28px、中央揃え):
     - 各ボタン: 58×58 円、背景 `#2C1810`、cream アイコン、shadow `0 6px 16px rgba(44,24,16,0.20)`
     - ラベル(11px serif) + 英サブ(8px serif uppercase italic muted)
     - 順: **保存 / LINE / メール** ( save / line / mail )
   - Divider: 1px `#2C1810` opacity 0.15、margin `4px 40px 18px`
   - Text ボタン: `他のスタジオで撮ってみる ›` — 13px serif italic, bottom-border 1px

**Interactions**:
- 保存ボタン → ラベルが一時的に `SAVED` に切替(1.6s)
- LINE / メール → ダミー(本番では share intent)
- 「他のスタジオで撮ってみる」 → landing へ戻る
- `‹` → upload へ戻る

---

## State Management

```ts
// ルートで管理する最小 state
screen:            'landing' | 'upload' | 'result'
subject:           'dog' | 'cat' | 'child'          // spec上は保持するが現UIでは選択画面なし(v0.5以降の変更)
selectedTemplate:  string | null                     // 例: 'jp_03'

// Upload ローカル
uploaded:          boolean
fileName:          string

// Result ローカル
saved:             boolean  // 保存アニメ用 (1.6s で false に戻す)
```

localStorage に `snap_screen` / `snap_subject` を保存しており、リフレッシュで画面復元されます。本番では画像データは保存しない(spec 参照)。

---

## Design Tokens

```css
/* Base */
--bg-page:        #F4A896   /* コーラルピンク・ベース背景 */
--bg-card:        #F5EDE0   /* クリーム・カード背景 */
--bg-preview:    #EFE4D4   /* プレビュー背景 */

/* Text */
--text-primary:   #2C1810   /* 深いブラウン */
--text-secondary: #6B4E3D
--text-muted:     #A88B78

/* Accent */
--accent:         #2C1810
--accent-subtle:  #D4A574

/* Semantic */
--border:         #D8C4A8
--divider:        #E8D9C4
```

```css
/* Fonts */
--font-serif: 'Cormorant Garamond', 'Noto Serif JP', serif;  /* 見出し・ロゴ・UI ラベル */
--font-sans:  'Inter', 'LINE Seed', sans-serif;               /* 本文・フォーム */

/* Scale */
10px  (uppercase, tracking 0.18–0.22em)
11–13px (body / caption)
14–16px (button label / studio title)
18–22px (tagline / selected studio)
30px  (wordmark)
```

```css
/* Radii */
--radius-sm: 8px
--radius-md: 14–16px
--radius-lg: 20–24px

/* Shadows */
--shadow-subtle: 0 4px 12px rgba(44,24,16,0.08)
--shadow-card:   0 8px 24px rgba(44,24,16,0.12)
--shadow-button: 0 6px 16px rgba(44,24,16,0.20)
```

```css
/* Photo treatment — 全画像 */
filter: sepia(0.18) saturate(0.92) contrast(0.95);
/* テンプレサムネ */
filter: sepia(0.22) saturate(0.85) contrast(0.95);
```

---

## Templates (MVP subset — spec に30種)

`app.jsx` の `TEMPLATES` に収録済み。本番では spec 全30種を実装してください。

Category tabs: `おすすめ / スタジオ / 記念日 / 世界 / ファンタジー / アート / クラシック`

英名マップ `TEMPLATE_EN` は Upload 画面で併記表示に使っています(例: `桜満開 — Cherry Blossom`)。

---

## Assets

- **Subject silhouettes**: インライン SVG(犬・猫・子ども) — `app.jsx` の `DogSilhouette` / `CatSilhouette` / `ChildSilhouette`。spec には実制作フロー(Gemini + Canva)の記載あり、本番は制作済み SVG を `public/snap/mascots/` に置く想定。
- **Template thumbnails**: 現状は Unsplash プレースホルダー URL。本番は spec の Phase 0 で Gemini 生成 → `public/snap/templates/<category>/*.jpg`
- **Fonts**: Google Fonts から Cormorant Garamond / Inter / Noto Serif JP を読み込み(preconnect 済み)
- **Logo**: spec のパターン A(横長ワードマーク)をライブ描画。本番は `public/snap/logo/logo_horizontal.svg` 推奨

---

## Recommended Stack (spec準拠)

| 用途 | 技術 |
|---|---|
| Framework | Next.js App Router |
| Host | Vercel |
| 画像生成 | FAL.ai `fal-ai/flux-pro/kontext` ($0.04/image) |
| Rate limit | Upstash Redis (日 10 回/IP) |
| 保存 | html-to-image + Blob (クライアント完結) |

フォルダ構成 (spec v0.5 参照):
```
app/snap/
├── page.tsx
├── components/
│   ├── LandingGrid.tsx
│   ├── CategoryTabs.tsx
│   ├── UploadArea.tsx
│   ├── ResultView.tsx
│   └── ActionBar.tsx
├── lib/
│   ├── templates.ts
│   ├── prompts.ts
│   └── generate.ts
└── styles/theme.ts
```

---

## Files in this handoff

- `README.md` — このドキュメント
- `SNAP STUDIO.html` — メインプロトタイプ(3画面 state-machine)
- `app.jsx` — 画面実装(Landing / Upload / Result / App ルート + design tokens + TEMPLATES + TEMPLATE_EN)
- `ios-frame.jsx` — iOS デバイスフレーム(参考用、実装不要)
- `snap_studio_spec_v0.5.md` — 元仕様書

ブラウザで `SNAP STUDIO.html` を開いて 3 画面の流れを確認できます。
