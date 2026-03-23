# GTM トラッキング属性 実装一覧

## 属性ルール

| 属性名 | 役割 |
|--------|------|
| `data-gtm-click` | クリック種別（トリガー発火に必須） |
| `data-gtm-location` | 配置場所 |
| `data-gtm-label` | 内容識別 |

---

## Header.tsx

| 要素 | `data-gtm-click` | `data-gtm-location` | `data-gtm-label` |
|------|-----------------|---------------------|-----------------|
| Navリンク（Service / About / Works）× デスクトップ＋モバイル | `nav_link` | `header` | `service` / `about` / `works` |
| Navリンク（Contact）× デスクトップ＋モバイル | `cta_contact` | `header` | ー |
| Note 外部リンク × デスクトップ＋モバイル | `external_link` | `header` | `note` |
| X 外部リンク × デスクトップ＋モバイル | `external_link` | `header` | `x` |

---

## Footer.tsx

| 要素 | `data-gtm-click` | `data-gtm-location` | `data-gtm-label` |
|------|-----------------|---------------------|-----------------|
| Navリンク（Service / About / Works / Contact） | `nav_link` | `footer` | `service` / `about` / `works` / `contact` |
| Note 外部リンク | `external_link` | `footer` | `note` |
| X 外部リンク | `external_link` | `footer` | `x` |
| 電話リンク | `tel_link` | `footer` | ー |
| プライバシーポリシーリンク | `nav_link` | `footer` | `privacy` |

---

## WorksGrid.tsx

| 要素 | `data-gtm-click` | `data-gtm-location` | `data-gtm-label` |
|------|-----------------|---------------------|-----------------|
| Worksカード Link（SP リスト・PC グリッド共通） | `works_card` | `works_section` | `{work.slug}` |

> カード内 `<div>` に `style={{ pointerEvents: "none" }}` をインライン追加（SP テキスト div・PC サムネイル div）

---

## ContactSection.tsx

| 要素 | `data-gtm-click` | `data-gtm-location` | `data-gtm-label` |
|------|-----------------|---------------------|-----------------|
| 送信ボタン | `cta_contact_submit` | `contact_form` | `contact_submit` |

---

## HeroChat.tsx

| 要素 | `data-gtm-click` | `data-gtm-location` | `data-gtm-label` |
|------|-----------------|---------------------|-----------------|
| クイック選択ボタン | `chat_quick_select` | `hero_chat` | ボタンのテキスト |
| 送信ボタン | `chat_send` | `hero_chat` | ー |

---

## ChatWidget.tsx

| 要素 | `data-gtm-click` | `data-gtm-location` | `data-gtm-label` |
|------|-----------------|---------------------|-----------------|
| 開閉トグルボタン（画面固定） | `chat_toggle` | `chat_widget` | ー |
| クイック選択ボタン | `chat_quick_select` | `chat_widget` | ボタンのテキスト |
| 送信ボタン | `chat_send` | `chat_widget` | ー |

---

## NoteSection.tsx

| 要素 | `data-gtm-click` | `data-gtm-location` | `data-gtm-label` |
|------|-----------------|---------------------|-----------------|
| View all ボタン | `external_link` | `note_section` | `note_view_all` |
| 記事リンク | `external_link` | `note_section` | `note_article` |

---

## page.tsx（トップページ）

| 要素 | `data-gtm-click` | `data-gtm-location` | `data-gtm-label` |
|------|-----------------|---------------------|-----------------|
| Works「View all」ボタン | `nav_link` | `top_works_section` | `view_all_works` |
| Worksカード（上位 4 件） | `works_card` | `top_works_section` | `{work.slug}` |
| Works リスト SP（5〜8 件） | `works_card` | `top_works_section` | `{work.slug}` |

---

## works/[slug]/page.tsx（実績詳細）

| 要素 | `data-gtm-click` | `data-gtm-location` | `data-gtm-label` |
|------|-----------------|---------------------|-----------------|
| 「← Works」戻るリンク | `nav_link` | `works_detail` | `back_to_works` |
| 外部 URL（公開サイトリンク） | `external_link` | `works_detail` | `{work.slug}` |
| Other Works カード | `works_card` | `works_detail` | `{w.slug}` |
