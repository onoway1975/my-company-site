# LP.LUS デザインガイドライン
# design.md v1.0

参考サイト:
- details.co.jp — ブランドファーム。コードテキスト散乱×巨大セリフ体のエディトリアル
- tokyotechnology.jp — クリーンなグラデーション×有機的なフォルム
- momentia.jp — 左右分割ヒーロー×細字日本語×カームなトーン
- integratedbiosciences.com — フルブリードビジュアル×極大サンセリフ×高コントラスト

---

## 1. デザイン哲学

LP.LUSは「つくる人のためのツール」。
ユーザーがパーツを選んでいる間、UIは邪魔をしない。
コンテンツ（プレビュー）が主役。UIは脇役に徹する。

**3つの原則**
1. **Invisible UI** — UIの存在を感じさせない。余白・グレースケール・細線で構成
2. **Content Forward** — プレビューに最大限の面積を与える
3. **Editorial Precision** — タイポグラフィで品格を出す。装飾ではなく文字で語る

---

## 2. カラーパレット

### ベースカラー（グレースケール）
```
--color-bg-page     : #F4F4F4   ページ全体背景
--color-bg-card     : #FFFFFF   カード・パネル背景
--color-bg-muted    : #EBEBEB   薄グレー背景・区切り
--color-border      : #D8D8D8   ボーダー（通常）
--color-border-sel  : #1A1A1A   選択済みボーダー
--color-text-primary: #1A1A1A   メインテキスト
--color-text-sub    : #888888   サブテキスト
--color-text-muted  : #BBBBBB   ミュートテキスト
--color-accent      : #1A1A1A   アクセント（黒）
```

### 使用禁止
- 青・赤・緑などの有彩色をUI要素に使用しない
- グラデーション背景をUIに使用しない（プレビュー内のみ許容）
- 影（box-shadow）を多用しない

### 例外（プレビュー内のみ許容）
- ヒーローセクションの濃いダークグレー #1A1A1A
- CTAバナーの黒 #1A1A1A
- アクセントカラーはプレビュー用途のみ

---

## 3. タイポグラフィ

### フォントスタック
```
欧文: Poppins（Google Fonts）
日本語: こぶりなゴシック W3 JIS2004
フォールバック: sans-serif

font-family: 'Poppins', 'こぶりなゴシック W3 JIS2004', sans-serif;
```

### タイプスケール
```
--text-xs   : 10px / line-height 1.4 / letter-spacing 0.05em
--text-sm   : 11px / line-height 1.5
--text-base : 13px / line-height 1.6
--text-md   : 15px / line-height 1.6
--text-lg   : 18px / line-height 1.4
--text-xl   : 24px / line-height 1.2
--text-2xl  : 32px / line-height 1.1 / letter-spacing -0.02em
```

### ウェイト
- 300（Light）: 見出し・エディトリアル系
- 400（Regular）: 本文・説明文
- 500（Medium）: ラベル・タブ
- 600（SemiBold）: パーツ名・強調
- 700（Bold）: ロゴのみ

### ルール
- ロゴ「LP.LUS」: font-weight 700 / letter-spacing 0.08em
- タブラベル: font-weight 500 / font-size 13px
- パーツ名: font-weight 600 / font-size 13px
- 説明文: font-weight 400 / font-size 11px / color #888888
- セクションラベル（ABOUT等）: font-weight 400 / font-size 10px / letter-spacing 0.12em / text-transform uppercase / color #BBBBBB

---

## 4. スペーシング

### 基本単位: 4px
```
--space-1  : 4px
--space-2  : 8px
--space-3  : 12px
--space-4  : 16px
--space-5  : 20px
--space-6  : 24px
--space-8  : 32px
--space-10 : 40px
--space-12 : 48px
--space-16 : 64px
```

### コンポーネント内スペース
- カード内padding: 14px 16px
- タブpaddingY: 12px
- ヘッダーheight: 56px / padding: 0 32px
- グリッドgap: 20px
- グリッドpadding: 32px

---

## 5. ボーダーとシェイプ

### ボーダー
- カード通常: 1px solid #D8D8D8
- カード選択済み: 1.5px solid #1A1A1A
- タブバー下: 1px solid #D8D8D8
- ヘッダー下: 1px solid #D8D8D8
- ドラッグアイテム: 1px solid #D8D8D8

### ボーダーラジウス
```
--radius-sm : 4px   タグ・バッジ・ボタン
--radius-md : 6px   インプット・スモールカード
--radius-lg : 8px   カード・モーダルアイテム
--radius-xl : 10px  パーツカード
--radius-full: 99px 丸ボタン・バッジ丸
```

### シャドウ
- 原則: 使用しない
- 例外: モーダルオーバーレイ rgba(0,0,0,0.4) のみ

---

## 6. コンポーネント別仕様

### ヘッダー
```
background: #FFFFFF
border-bottom: 1px solid #D8D8D8
height: 56px
padding: 0 32px
position: sticky top: 0
z-index: 30
```

### タブバー
```
background: #FFFFFF
border-bottom: 1px solid #D8D8D8
position: sticky top: 56px （ヘッダーの高さ分）
z-index: 20
padding: 0 32px
```
タブアクティブ: border-bottom 2px solid #1A1A1A

### パーツカード
```
プレビューエリア: height 160px / overflow hidden
情報エリア: padding 14px 16px
border-radius: 10px
hover: border-color #1A1A1A （transitionなし or 0.1s）
選択時: border 1.5px solid #1A1A1A / background #F0F0F0
チェックバッジ: 右上absolute / background #1A1A1A / color #FFFFFF / 22px円
```

### ボタン（UI用・プレビュー用とは別）
```
Primary（プレビュー生成等）:
  background: #1A1A1A / color: #FFFFFF
  padding: 8px 20px / border-radius: 4px
  hover: opacity 0.85

Outline:
  border: 1px solid #1A1A1A / background: transparent / color: #1A1A1A
  padding: 8px 20px / border-radius: 4px
  hover: background #1A1A1A / color #FFFFFF

Ghost（削除・キャンセル等）:
  border: none / background: transparent
  color: #BBBBBB
  hover: color #1A1A1A

Segment（オプション切替）:
  border: 1px solid #D8D8D8 / border-radius: 4px
  選択時: background #1A1A1A / color #FFFFFF
  font-size: 11px / padding: 3px 10px
```

### モーダル
```
オーバーレイ: rgba(0,0,0,0.45)
左パネル幅: 320px（PC）/ 全幅（SP）
左パネルbg: #FFFFFF
右パネルbg: #F4F4F4
border-right: 1px solid #D8D8D8
z-index: 50
```

---

## 7. アニメーション・トランジション

### 基本方針
- 必要最小限のみ使用
- UIのトランジションは 0.15s 以内
- プレビュー内のアニメーションは別途 animation.md 参照

### 使用するトランジション
```
カードhover:     border-color 0.15s ease
ボタンhover:     background 0.2s ease, color 0.2s ease
モーダル展開:    opacity 0.2s ease
オプション展開: height/opacity 0.15s ease
```

### 使用禁止
- 装飾的なアニメーション（バウンス・揺れ等）
- transform scale によるポップアップ
- 不必要な遅延（delay > 0.1s）

---

## 8. グリッドシステム

### PCレイアウト
```
パーツグリッド: 3カラム / gap 20px / padding 32px
モーダル: 左320px固定 + 右flex-1
```

### SPレイアウト（max-width: 768px）
```
パーツグリッド: 1カラム
モーダル: 縦1カラム（左パネル上・右パネル下）
タブバー: 横スクロール
```

---

## 9. アイコン

- ライブラリ: lucide-react 一択
- サイズ: 16px（インライン）/ 20px（スタンドアロン）
- カラー: #888888（通常）/ #1A1A1A（強調・選択時）
- strokeWidth: 1.5（細め・エレガント）

---

## 10. LP.LUSとして目指すデザインクオリティ

### 参考サイトから学んだこと

**details.co.jp より**
- コードテキストが背景に散乱するビジュアル → パーツ名やHTMLタグを薄く背景に配置するなど「ツールらしさ」の演出ができる
- 極大セリフ体 → ロゴや見出しに大胆なタイポグラフィを使う
- 黒背景に白文字 → ダークパーツのプレビューはこのトーンを参照

**tokyotechnology.jp より**
- 有機的なフォルムのグラデーション → プレビュー内の装飾に使えるアイデア
- クリーンな余白 → UIの余白設計の基準にする

**momentia.jp より**
- 左右分割ヒーロー → hero-splitパーツの参考
- 細字かな文字 + 欧文の組み合わせ → こぶりなゴシック×Poppinsの現行設定の根拠
- カームなトーン → ページ全体のグレー基調の方向性

**integratedbiosciences.com より**
- フルブリードのビジュアルバック + 極大テキスト → image-caption・hero系パーツの参考
- Aspekta（font-weight 400で極大サイズ）→ 細いウェイトで大きくする手法
- ネイビー×グリーン系のアクセント → 将来のカラーテーマ拡張の参考

### 今後のブラッシュアップ方針
1. パーツカードのプレビューをよりリッチに（実際のセクションに近い縮小版）
2. モーダルのLPプレビューにより精緻なタイポグラフィを適用
3. フォントタブと連動してUI全体のフォントを切り替える
4. アニメーションタブのプレビューを動的に再生できるように
5. ダークモード対応の検討

---

## 11. ファイル管理ルール

- このファイルはプロジェクトナレッジに保存し、Claude Codeの参照ファイルとして使う
- デザインを変更するたびに対応するセクションを更新する
- バージョン番号を上げる（v1.0 → v1.1）