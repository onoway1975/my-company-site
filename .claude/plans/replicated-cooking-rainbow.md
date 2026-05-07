# SNAP STUDIO Phase 2: FAL.ai 画像生成連携

## Context
Phase 1 でデプロイ済みの SNAP STUDIO (3画面プロトタイプ) に FAL.ai Kontext による画像生成を追加。
ユーザーが写真をアップロード → テンプレ選択 → CONTINUE で AI が背景を差し替えた画像を生成する。

## 既存パターンの流用
- `@fal-ai/client` (^1.9.4) インストール済み
- `FAL_KEY` 環境変数は天職占い等で設定済み
- API Route パターン: `app/api/{feature}/generate/route.ts`
- クライアント側 Canvas リサイズ: 天職占い (`app/tenshoku/TenshowClient.tsx`) の `resizeToDataUrl()` パターン
- レート制限: Upstash Redis REST API パターン (`app/api/punimoji/generate/route.ts`)

## ファイル一覧

| # | ファイル | 種別 | 概要 |
|---|---------|------|------|
| 1 | `app/snap/lib/prompts.ts` | 新規 | 12テンプレ × FAL.ai Kontext プロンプト定義 |
| 2 | `app/api/snap/generate/route.ts` | 新規 | FAL.ai Kontext 呼び出し API Route |
| 3 | `app/snap/components/SnapClient.tsx` | 変更 | uploadedFile/generatedImageUrl/isGenerating/error state 追加 |
| 4 | `app/snap/components/Upload.tsx` | 変更 | onUpload に File を渡す + クライアント Canvas リサイズ |
| 5 | `app/snap/components/Result.tsx` | 変更 | ローディング/生成完了/エラー表示 + 保存ボタン簡易実装 |
| 6 | `app/snap/layout.tsx` | 変更 | ローディング用 CSS 追加 |

## 実装順序

### Step 1: プロンプト定義
`app/snap/lib/prompts.ts` — ユーザー指定の12テンプレプロンプト + PRESERVE_INSTRUCTION + buildFullPrompt()

### Step 2: API Route
`app/api/snap/generate/route.ts`
- POST: FormData (image + templateId) を受け取り
- base64 DataURI に変換して `fal.subscribe('fal-ai/flux-pro/kontext')` に送信
- レート制限: Upstash Redis パターン (50回/日/IP)
- `runtime = 'nodejs'`, `maxDuration = 60`
- 参照: `app/api/punimoji/generate/route.ts` のレート制限パターン

### Step 3: Upload.tsx 変更
- `onUpload: () => void` → `onUpload: (file: File) => void` に変更
- CONTINUE 押下時に File オブジェクトを親に渡す
- Canvas リサイズ (max 1024px) をクライアントで実施してから渡す
  - 天職占いの `resizeToDataUrl()` パターンを参考に、File → resized File を返すヘルパー追加

### Step 4: SnapClient.tsx 変更
- state 追加: `uploadedFile: File | null`, `generatedImageUrl: string | null`, `isGenerating: boolean`, `error: string | null`
- `handleUpload` → `handleGenerate(file: File)`: screen を result に遷移 → fetch /api/snap/generate → 結果を state に反映
- Result に `isGenerating`, `generatedImageUrl`, `error`, `onRetry` を props で渡す

### Step 5: Result.tsx 変更
- props 追加: `isGenerating`, `generatedImageUrl`, `error`, `onRetry`
- 生成中: プレビュー枠に「撮影中...」+ 「お待ちください」(セリフ体中央)
- 完了: generatedImageUrl を img src に (snap-fade-in アニメーション)
- エラー: メッセージ + 「もう一度」ボタン (→ Upload) + 「他のスタジオを試す」(→ Landing)
- 保存ボタン: generatedImageUrl を window.open() で新タブ表示

### Step 6: CSS 追加
`app/snap/layout.tsx` に `.snap-loading`, `.snap-error` 等のスタイル追加

## データフロー

```
Upload (CONTINUE押下)
  ↓ Canvas resize (max 1024px) → File
  ↓ onUpload(file)
SnapClient
  ↓ setScreen('result'), setIsGenerating(true)
  ↓ FormData(file, templateId) → POST /api/snap/generate
API Route
  ↓ File → base64 DataURI
  ↓ fal.subscribe('fal-ai/flux-pro/kontext', { prompt, image_url })
  ↓ return { imageUrl }
SnapClient
  ↓ setGeneratedImageUrl(imageUrl), setIsGenerating(false)
Result
  ↓ img src={generatedImageUrl} 表示
```

## 検証
1. `npx tsc --noEmit` — TypeScript エラーなし
2. ローカル起動 → 写真アップ → テンプレ選択 → CONTINUE
3. ローディング「撮影中...」表示確認
4. 10〜30秒後に生成画像表示確認
5. 保存ボタン → 新タブで画像表示確認
6. エラー時のUI確認(FAL_KEY 未設定等)
7. コミット & プッシュ
