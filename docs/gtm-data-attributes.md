# GTM data属性 一覧

## body の data-page-type

| ページ | data-page-type |
|---|---|
| トップ (`/`) | `top` |
| サービス (`/service`) | `service` |
| 会社概要 (`/about`) | `about` |
| 実績一覧 (`/works`) | `works_list` |
| 実績詳細 (`/works/[slug]`) | `works_detail` |
| お問い合わせ (`/contact`) | `contact` |
| プライバシーポリシー (`/privacy`) | `privacy` |

実装: `app/components/BodyPageType.tsx`（Client Component）を各ページで `<BodyPageType type="..." />` として使用。

---

## ヘッダー（Header.tsx）

| 要素 | data-gtm-click | data-gtm-location | data-gtm-label |
|---|---|---|---|
| SERVICE リンク | `internal_link` | `header` | `service` |
| ABOUT リンク | `internal_link` | `header` | `about` |
| WORKS リンク | `internal_link` | `header` | `works` |
| CONTACT リンク | `cta_contact` | `header` | — |
| NOTE アイコン | `external_link` | `header` | `note` |
| X アイコン | `external_link` | `header` | `x` |

※モバイルメニューの各リンクにも同一属性を付与。

---

## フッター（Footer.tsx）

| 要素 | data-gtm-click | data-gtm-location | data-gtm-label |
|---|---|---|---|
| Service リンク | `internal_link` | `footer` | `service` |
| About リンク | `internal_link` | `footer` | `about` |
| Works リンク | `internal_link` | `footer` | `works` |
| Contact リンク | `internal_link` | `footer` | `contact` |
| プライバシーポリシー | `internal_link` | `footer` | `privacy` |
| NOTE リンク | `external_link` | `footer` | `note` |
| X リンク | `external_link` | `footer` | `x` |
| 電話番号 | `phone_link` | `footer` | `03-4540-7546` |

---

## トップページ（app/page.tsx）

| 要素 | data-gtm-click | data-gtm-location | data-gtm-label |
|---|---|---|---|
| 実績カード | `internal_link` | `works_section` | `[slug]` |
| View all（実績） | `internal_link` | `works_section` | `view_all` |

---

## HeroChat（app/components/HeroChat.tsx）

| 要素 | data-gtm-click | data-gtm-location | data-gtm-label |
|---|---|---|---|
| 送信ボタン | `cta_ai_chat` | `hero` | — |
| サジェストボタン（サービスについて教えて） | `cta_ai_suggest` | `hero` | `サービスについて教えて` |
| サジェストボタン（実績を見たい） | `cta_ai_suggest` | `hero` | `実績を見たい` |
| サジェストボタン（相談したい） | `cta_ai_suggest` | `hero` | `相談したい` |

---

## NoteSection（app/components/NoteSection.tsx）

| 要素 | data-gtm-click | data-gtm-location | data-gtm-label |
|---|---|---|---|
| View all ボタン | `external_link` | `note_section` | `note_view_all` |
| 記事リンク | `external_link` | `note_section` | `[記事タイトル]` |

---

## お問い合わせフォーム（app/components/ContactSection.tsx）

| 要素 | data-gtm-click | data-gtm-location | data-gtm-label |
|---|---|---|---|
| 送信ボタン | `cta_contact_submit` | `contact_form` | — |
| プライバシー同意チェックボックス | `privacy_agree` | `contact_form` | — |

---

## 実績一覧（app/works/WorksGrid.tsx）

| 要素 | data-gtm-click | data-gtm-location | data-gtm-label |
|---|---|---|---|
| カテゴリフィルター | `filter` | `works_list` | `[category（小文字）]` |
| 案件カード | `internal_link` | `works_list` | `[slug]` |

---

## 実績詳細（app/works/[slug]/page.tsx）

| 要素 | data-gtm-click | data-gtm-location | data-gtm-label |
|---|---|---|---|
| ← Works リンク | `internal_link` | `works_detail` | `back_to_works` |
| URL リンク | `external_link` | `works_detail` | `[slug]` |

---

## data-gtm-click 値の命名規則

| 値 | 用途 |
|---|---|
| `internal_link` | サイト内ページ遷移 |
| `external_link` | 外部サイトへのリンク |
| `cta_contact` | お問い合わせ導線クリック |
| `cta_contact_submit` | お問い合わせフォーム送信 |
| `cta_ai_chat` | AIチャット送信 |
| `cta_ai_suggest` | AIチャット サジェスト選択 |
| `phone_link` | 電話番号クリック |
| `filter` | カテゴリフィルター操作 |
| `privacy_agree` | プライバシーポリシー同意 |
