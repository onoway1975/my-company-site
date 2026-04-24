# SNAP STUDIO 仕様書 v0.5

---

## プロダクト概要

| 項目 | 内容 |
|---|---|
| プロダクト名 | **SNAP STUDIO** |
| タグライン | 今日は、どのスタジオで撮ろう？ |
| URL（想定） | https://ciraf.jp/snap/ |
| コンセプト | 普段の写真を、スタジオ撮影のような特別な一枚に変える。記念日・季節イベントも豊富 |
| 対象被写体 | 犬 / 猫 / 子ども |
| プラットフォーム | Webアプリ（SP・PC両対応。SPファースト） |

---

## デザイントンマナ（確定）

### デザインDNA
参考：エディトリアルマガジン × ソフトコーラル × Cormorant Garamond

- 温かく、落ち着き、やや西海岸〜北欧の香り
- 「特別な瞬間を丁寧に切り取る」雰囲気
- 装飾は控えめ、余白を広く、写真が主役
- カフェメニュー・アートブックのような品のあるトーン

### カラーパレット

```css
/* Base */
--bg-page:        #F4A896    /* コーラルピンク・ベース背景 */
--bg-card:        #F5EDE0    /* クリーム・カード背景 */
--bg-preview:     #EFE4D4    /* プレビュー背景 */

/* Text */
--text-primary:   #2C1810    /* 深いブラウン・メインテキスト */
--text-secondary: #6B4E3D    /* サブテキスト */
--text-muted:     #A88B78    /* 薄いテキスト */

/* Accent */
--accent:         #2C1810    /* 深いブラウン・CTA */
--accent-subtle:  #D4A574    /* ビスケット色・選択枠 */

/* Semantic */
--border:         #D8C4A8    /* ボーダー */
--divider:        #E8D9C4    /* 区切り */
```

### タイポグラフィ

```css
/* Font Stack */
--font-serif:  'Cormorant Garamond', 'Noto Serif JP', serif;  /* 見出し・ロゴ */
--font-sans:   'Inter', 'LINE Seed', sans-serif;              /* 本文・UI */

/* Scale */
--text-xs:     10px  /letter-spacing 0.08em  /uppercase
--text-sm:     12px  /letter-spacing 0.02em
--text-base:   14px
--text-md:     16px
--text-lg:     22px  /letter-spacing 0.02em
--text-xl:     32px  /letter-spacing 0.03em
--text-2xl:    48px  /letter-spacing 0.04em  /italic可
```

### スペーシング・ボーダー

```css
--radius-sm:   8px
--radius-md:   16px
--radius-lg:   24px

--shadow-subtle: 0 4px 12px rgba(44, 24, 16, 0.08)
--shadow-card:   0 8px 24px rgba(44, 24, 16, 0.12)
```

---

## ロゴ・ブランドアイデンティティ

### 構成要素
1. 犬のシルエット（左向き・柴犬かゴールデン系・しっぽピン）
2. 猫のシルエット（右向き・立ち姿・しっぽ立て）
3. 「SNAP STUDIO」のセリフ体タイポグラフィ
4. 下線（hairline）
5. サブコピー「for your loved ones」

### レイアウト案

#### パターン A（推奨・横長ロゴ）

```
    🐕  ᠃  🐈
    
  SNAP  STUDIO
  ──────────────
  for your loved ones
```

#### パターン B（囲み・雑誌風）

```
    ━━━━━━━━━━━━━━
   │  🐕 ᠃ 🐈    │
   │              │
   │ SNAP STUDIO  │
    ━━━━━━━━━━━━━━
    est. 2026   ciraf inc.
```

#### パターン C（モノグラム・ファビコン向け）

```
   ┌──────┐
   │ 🐕🐈 │
   │  ──  │
   │   S  │
   └──────┘
```

### ロゴ制作のGeminiプロンプト

```
Design a minimalist logo for a photo service called "SNAP STUDIO" 
inspired by editorial magazine design.

Layout:
- At the top center, place a simple silhouette of a dog (facing left, 
  shiba inu or golden retriever style, tail up) and a simple silhouette 
  of a cat (facing right, tail up, standing pose) side by side, 
  separated by a small dot or mark.
- Below the silhouettes, elegant serif typography reading "SNAP STUDIO" 
  in dark brown color #2C1810, letter-spacing slightly wide.
- Under the wordmark, a thin horizontal hairline.
- Below the line, small italic serif text "for your loved ones" in 
  dark brown.

Colors:
- Background: soft coral pink #F4A896
- Text and silhouettes: deep warm brown #2C1810
- No other colors

Style:
- Editorial magazine aesthetic
- Minimal, refined, breathable spacing
- Cormorant Garamond style serif font
- Silhouettes should be filled (not outlined), clean and simple
- High-end boutique studio feel

Format:
- Square 1:1 composition
- Generous padding around the logo (at least 15% on each side)
- Print-ready quality, 8k resolution
- No watermark, no additional text
```

### ロゴ運用ルール

- メイン使用：パターンA（ヘッダー・OGP・note記事サムネ）
- ファビコン：パターンC
- 背景色違いバリエーション：コーラル背景版・クリーム背景版・白背景版・ダーク背景版の4種類を用意
- 最小サイズ：横幅 120px 以上で使用（それ未満はパターンCのモノグラムを使用）

### ロゴ制作フロー
1. Gemini でシルエット + 全体構図を生成（複数バリエーション）
2. Canva で「SNAP STUDIO」のタイポを Cormorant Garamond で手動乗せ
3. 色味・余白・位置を微調整
4. SVG or 高解像度PNGで書き出し

---

## UI設計：テンプレート選択型

### 基本レイアウト（デザイントンマナ適用済み）

```
┌──────────────────────────────────────┐
│  [←]       SNAP STUDIO           中  │ ← コーラル背景・セリフ体ロゴ
│                                        │
│  ┌────────────────────────────────┐   │
│  │                                │   │ ← クリーム色フレーム
│  │     (生成画像プレビュー)          │   │ ← 角丸16px
│  │                                │   │
│  └────────────────────────────────┘   │
│                                        │
│  おすすめ ・ スタジオ ・ 記念日 ・ 世界  │ ← セリフ体・中央揃え
│  ──────                                │ ← 選択中アンダーライン
│                                        │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐           │
│  │  │ │  │ │🔆│ │  │ │  │ →         │ ← クリーム背景・セピアトーン
│  └──┘ └──┘ └──┘ └──┘ └──┘           │
│   春の  フラワー 七五三  星空  ハロ     │
│   撮影  アーチ         月明  ウィン     │
│                                        │
│  [  💾 保存  ]    [  ↗ シェア  ]       │ ← セリフ体ボタン
│                                        │
└──────────────────────────────────────┘
```

### 画面構成ルール

- **全画面共通背景**：コーラルピンク `#F4A896`
- **コンテンツコンテナ**：クリーム `#F5EDE0` の角丸カード
- **テキスト**：基本 `#2C1810` のみ。装飾色は使わない
- **タブ・ボタン**：シンプルなテキスト or アンダーライン。ベタ塗りボタンは最小限
- **余白**：十分に広く取る。詰め込まない
- **写真**：コントラスト控えめのセピア寄りでトーン統一

### コンポーネント詳細

#### ヘッダー
- 背景：コーラル
- ロゴ：中央 or 左寄せ、セリフ体
- 左：戻るボタン（`<`）
- 右：濃淡調整アイコン（任意）

#### プレビューエリア
- クリーム色のフレーム（角丸16px）
- 画像は角丸8pxで内側に配置
- 周囲に十分なパディング（24px以上）

#### カテゴリタブ
- セリフ体（Cormorant Garamond）
- 中央揃え・中点（・）区切り
- 選択中：細いアンダーライン
- 非選択：マットブラウン（やや薄め）

#### テンプレカード
- 幅：120px 前後（SP）/ 160px 前後（PC）
- 背景：クリーム
- 枠線：なし or ヘアライン
- 選択中：ブラウンで細枠 + 影
- サムネ画像 + タイトル（14px・セリフ体）

#### アクションボタン
- 白抜き or ベタ塗りブラウン
- 角丸16px
- セリフ体のラベル
- アイコンはシンプルな線画

---

## カテゴリ構成（7タブ）

| タブ | 内容 | デフォルト |
|---|---|---|
| **おすすめ** | 今月のおすすめ8本（月替わり自動） | ● |
| **スタジオ** | 花・バルーン・シネマティック | |
| **記念日**（日本） | 七五三・お宮参り・お正月など | |
| **世界**（海外イベント） | ハロウィン・クリスマス・イースターなど | |
| **ファンタジー** | 星空・魔法の森・宇宙 | |
| **アート** | 油絵・水彩・ジブリ風 | |
| **クラシック** | 昭和レトロ・和室・ヴィンテージ | |

---

## 画面遷移

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ランディング  │ →  │  アップロード  │ →  │   結果画面    │
│  + 被写体選択 │     │              │     │  テンプレ選択  │
└─────────────┘     └─────────────┘     └─────────────┘
                                              ↓
                                    テンプレタップで即再生成
```

---

## 被写体カテゴリ

| カテゴリ | 対象 |
|---|---|
| 🐕 犬 | 愛犬 |
| 🐈 猫 | 愛猫 |
| 👶 子ども | 子ども・赤ちゃん |

被写体別の保持プロンプト：

```typescript
const PRESERVE_INSTRUCTIONS = {
  dog: "Keep the dog in the exact same position, scale, pose, facial expression, fur color and markings, and all accessories exactly as they are.",
  cat: "Keep the cat in the exact same position, scale, pose, facial expression, fur color, markings, and whiskers exactly as they are.",
  child: "Keep the child in the exact same position, scale, pose, facial expression, clothing, skin tone, and hairstyle exactly as they are. Do not change facial features or body proportions."
}
```

---

## テンプレート全30種（MVP）

### A. スタジオ（6）
studio_01 フラワードレッシングルーム / studio_02 パステルバルーンパーティー / studio_03 スプリングガーデン / studio_04 フラワーアーチ / studio_05 シネマティック・ポートレート / studio_06 ビクトリアン・レモンガーデン

### B. 記念日・日本（8）
jp_01 七五三 / jp_02 お宮参り / jp_03 桜満開 / jp_04 こどもの日 / jp_05 七夕 / jp_06 夏祭り・浴衣 / jp_07 紅葉狩り / jp_08 お正月・初詣

### C. 世界のお祝い（7）
world_01 ハロウィン魔女 / world_02 パンプキンパッチ / world_03 クリスマスツリー / world_04 クリスマスサンタ / world_05 イースター / world_06 バレンタイン / world_07 旧正月

### D. ファンタジー（3）
fantasy_01 星空と月明かり / fantasy_02 魔法の森 / fantasy_03 宇宙飛行士

### E. アート（3）
art_01 油絵風 / art_02 ジブリ風 / art_03 水彩画

### F. クラシック（3）
classic_01 昭和レトロ縁側 / classic_02 和室床の間 / classic_03 ヴィンテージ写真館

---

## 月替わり「おすすめ」ロジック

（v0.4から継承。詳細は前版参照）

ランディング時に日本時間の月を取得、`getFeaturedTemplates(month)` で8枚決定。

---

## 子ども対応の注意事項

### 倫理・法的配慮
- 写真の保存は一切行わない
- プライバシーポリシーに明記
- アップロード前に「ご本人・保護者の同意のもとご利用ください」
- 第三者API送信の透明性確保

### AI生成の安全性
- 「顔・肌色・髪型・身体比率は変えない」を強く指定
- FAL.ai の safety checker を有効化

### UX配慮
- 子ども選択時はファンタジー系・アート系の変換強度を弱めに

---

## 技術スタック

| カテゴリ | 技術・サービス | コスト |
|---|---|---|
| フレームワーク | Next.js（App Router） | — |
| ホスティング | Vercel | 無料枠 |
| 画像生成 | FAL.ai `fal-ai/flux-pro/kontext` | $0.04/画像 |
| AI文章 | Anthropic Claude API（任意） | 数円/回 |
| アクセス制限 | Upstash Redis | 無料枠 |
| 状態管理 | React state / localStorage | — |
| 画像ダウンロード | html-to-image + Blob | — |

---

## フォルダ構成

```
app/
├── snap/
│   ├── page.tsx
│   ├── components/
│   │   ├── SubjectSelector.tsx
│   │   ├── UploadArea.tsx
│   │   ├── ResultView.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── TemplateCarousel.tsx
│   │   ├── GenerationLoader.tsx
│   │   └── ActionBar.tsx
│   ├── lib/
│   │   ├── templates.ts
│   │   ├── prompts.ts
│   │   ├── seasonal.ts
│   │   └── generate.ts
│   └── styles/
│       └── theme.ts          ← カラー・タイポのトークン定義
└── api/
    └── snap/
        ├── generate/route.ts
        └── limit/route.ts

public/
└── snap/
    ├── ogp.jpg
    ├── logo/
    │   ├── logo_horizontal.svg
    │   ├── logo_monogram.svg
    │   ├── logo_coral.png
    │   └── logo_cream.png
    ├── templates/
    │   ├── studio/   (6枚)
    │   ├── jp/       (8枚)
    │   ├── world/    (7枚)
    │   ├── fantasy/  (3枚)
    │   ├── art/      (3枚)
    │   └── classic/  (3枚)
    └── mascots/
        ├── dog_silhouette.svg
        └── cat_silhouette.svg
```

---

## アクセス制限

```
- 上限：1日10回（IP単位）
- Upstash Redisでカウント管理
- 日本時間0時にリセット
```

---

## MVPスコープ

### やること
- [x] 被写体選択（犬/猫/子ども）
- [x] 写真アップロード
- [x] カテゴリタブ切替（7タブ）
- [x] テンプレ横スクロール
- [x] タップで即生成
- [x] 月替わり「おすすめ」タブ
- [x] 結果プレビュー
- [x] 保存・シェア
- [x] 1日10回制限
- [x] 30テンプレ実装
- [x] エディトリアル・コーラル系デザイン適用

### やらないこと（MVP）
- ユーザー登録
- ガチャ演出
- コレクション機能
- 有料プラン
- 複数被写体同時対応

### 将来追加検討
- ガチャモード
- コレクション機能
- プレミアムプラン
- テンプレ追加（月1-2本）
- 記念日の自動通知
- 海外展開（英語UI）

---

## 開発ステップ

### Phase 0：デザインアセット制作
1. Gemini でロゴ複数案生成
2. Canva で仕上げ
3. 犬猫シルエット SVG 作成
4. テンプレ30枚のサムネを Gemini で生成

### Phase 1：プロンプト事前検証
5. FAL.ai Playground で主要テンプレを被写体別にテスト
6. 精度の低いものは修正 or 除外

### Phase 2：プロトタイプ（3日）
7. Next.js に `app/snap/` 追加
8. デザイントークン実装（theme.ts）
9. 基本フロー実装
10. 10テンプレで動作確認

### Phase 3：全実装・UI磨き込み（3-4日）
11. 30テンプレ実装
12. 月替わりロジック
13. UI仕上げ
14. 保存・シェア処理
15. Upstash Redis 制限

### Phase 4：公開（2日）
16. 実機QA
17. Vercel デプロイ
18. note 記事執筆

**合計目安：10〜12日**

---

## コスト試算

- FAL.ai 初回チャージ：$10（250枚分）
- 運用コスト（100人×1日5回生成想定）：$20/日（約3,000円）
- Vercel / GitHub：無料

---

## 改訂履歴

- v0.1（2026-04-21）：初版
- v0.2（2026-04-22）：プロダクト名確定、ガチャ体験
- v0.3（2026-04-22）：UI テンプレ選択型、対象を犬・猫・子どもに拡大
- v0.4（2026-04-22）：記念日・海外イベント30テンプレ、月替わりおすすめ
- v0.5（2026-04-22）：**デザイントンマナ・ロゴ方針確定（エディトリアル・コーラル系）**
