'use client'

import { useState, useRef, useEffect } from 'react'
import { Poppins } from 'next/font/google'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Layout, Zap, Shield, Star, ArrowRight,
  MessageSquare, HelpCircle, Building2, Image as ImageIcon, Play, Download, MapPin,
} from 'lucide-react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

// ── Types ────────────────────────────────────────────────────────────────
type PartId =
  | 'hero-basic' | 'features' | 'cta' | 'testimonial' | 'faq' | 'logos'
  | 'pricing' | 'stats' | 'team' | 'blog' | 'newsletter' | 'steps' | 'contact' | 'footer'
  | 'text-2col' | 'features-4col-image' | 'team-horizontal' | 'gallery-slider'
  | 'features-icon-circle' | 'testimonial-slider' | 'steps-5' | 'map'
  | 'services-labeled' | 'mission-split'
  | 'hero-center' | 'hero-split' | 'hero-dark-split' | 'hero-minimal' | 'hero-with-video'
  | 'hero-slider'
  | 'image-fullwidth' | 'image-gallery' | 'image-text' | 'image-text-right' | 'video-embed'
  | 'bullet-points' | 'icon-cards-2x2' | 'timeline-steps' | 'quote-fullscreen'
  | 'quote-side-accent' | 'before-after' | 'compare-two-option' | 'problem-background'
  | 'mission-statement'
  | 'image-caption' | 'image-three-grid'
  | 'big-number' | 'chart-bar' | 'chart-donut' | 'chart-line' | 'kpi-dashboard' | 'compare-table'
  | 'closing-thankyou' | 'closing-contact-card' | 'speaker-bio' | 'agenda-toc'
  | 'btn-outline' | 'btn-filled' | 'btn-ghost' | 'btn-rounded' | 'btn-icon' | 'btn-cta-lg'
  | 'fade-in-up' | 'fade-in' | 'slide-in-left' | 'slide-in-right'
  | 'text-fade-in' | 'text-slide-up' | 'text-stagger' | 'text-typewriter'
  | 'btn-hover-fill' | 'btn-hover-slide'
  | 'parallax' | 'counter-up'

type ActiveTab  = 'area' | 'hero' | 'media' | 'data' | 'closing' | 'button' | 'animation' | 'font'
type PromptTab  = 'chat' | 'code' | 'pptx'

interface Part {
  id:          PartId
  name:        string
  description: string
  tab:         ActiveTab
  previewH?:   number   // default 160
}

interface FontEntry {
  id:       string
  name:     string
  category: string
  google:   boolean
  weights:  string[]
  cssUrl?:  string
}

interface PartOptions {
  buttonStyle:  'none' | 'outline' | 'filled' | 'rounded' | 'ghost' | 'icon'
  columns:      2 | 3 | 4
  bgColor:      'white' | 'light' | 'dark'
  spacing:      'sm' | 'md' | 'lg'
  memberCount?: number
}

interface SelectedPart {
  uid:        number
  id:         PartId
  options:    PartOptions
  isExpanded: boolean
}

// ── Colors ───────────────────────────────────────────────────────────────
const C = {
  bg:    '#F4F4F4',
  card:  '#FFFFFF',
  muted: '#EBEBEB',
  bd:    '#D4D4D4',
  main:  '#1A1A1A',
  sub:   '#888888',
  hint:  '#BBBBBB',
  sel:   '#EBEBEB',
}

// ── Parts ─────────────────────────────────────────────────────────────────
const PARTS: Part[] = [
  // ① Area
  { id: 'hero-basic',   tab: 'area',   name: 'ヒーローエリア（基本）', description: 'ファーストビューの大きなメインビジュアル' },
  { id: 'features',     tab: 'area',   name: '特徴紹介（3カラム）',    description: 'サービスの強みを3〜4項目で紹介' },
  { id: 'cta',          tab: 'area',   name: 'CTAバナー',              description: '申し込みや問い合わせへ誘導するボタン' },
  { id: 'testimonial',  tab: 'area',   name: 'お客様の声',             description: '利用者のレビューや感想を掲載' },
  { id: 'faq',          tab: 'area',   name: 'よくある質問',           description: '疑問を解消するQ&Aセクション' },
  { id: 'logos',        tab: 'area',   name: 'ロゴ一覧',              description: '導入企業や実績のロゴを並べる' },
  { id: 'pricing',      tab: 'data',   name: '料金プラン',             description: '2〜3カラムの料金比較テーブル' },
  { id: 'stats',        tab: 'data',   name: '実績・数値',             description: '大きな数字で成果を訴求するセクション' },
  { id: 'team',         tab: 'area',   name: 'チーム紹介',             description: 'メンバーの顔写真・名前・役職カード' },
  { id: 'blog',         tab: 'area',   name: 'ブログ・ニュース',       description: '記事カードを3カラムで表示' },
  { id: 'newsletter',   tab: 'area',   name: 'メルマガ登録',           description: 'メールアドレス入力＋登録ボタン' },
  { id: 'steps',        tab: 'area',   name: '導入ステップ',           description: '番号付きの手順説明（3〜4ステップ）' },
  { id: 'contact',      tab: 'area',   name: 'お問い合わせ',           description: '名前・メール・メッセージのフォーム' },
  { id: 'footer',       tab: 'closing', name: 'フッター',               description: 'ロゴ・ナビ・コピーライトのフッター' },
  // ① Area 追加
  { id: 'text-2col',            tab: 'area', name: 'テキスト2カラム',            description: '本文を左右2カラムに分けて表示' },
  { id: 'features-4col-image',  tab: 'area', name: '特徴（4カラム・画像付き）',  description: '画像＋タイトル＋説明の4カラムグリッド' },
  { id: 'team-horizontal',      tab: 'area', name: 'チーム（横型）',              description: '左画像・右テキストの横並びメンバーカード' },
  { id: 'gallery-slider',       tab: 'area', name: 'ギャラリースライダー',        description: '左右矢印付き横スクロールギャラリー' },
  { id: 'features-icon-circle', tab: 'area', name: '特徴（丸アイコン・3カラム）', description: '円形アイコン＋タイトル＋説明の3カラム' },
  { id: 'testimonial-slider',   tab: 'area', name: 'お客様の声（スライダー）',    description: '左右矢印付きの証言スライダー' },
  { id: 'steps-5',              tab: 'area', name: 'ステップ（5段階）',           description: '5つの円形番号付きプロセス説明' },
  { id: 'map',                  tab: 'area', name: 'Googleマップ',               description: '店舗・会社の地図を埋め込み表示' },
  { id: 'services-labeled',     tab: 'area', name: 'サービス（ラベル付き4カラム）', description: 'カテゴリラベル＋タイトル＋説明の4カラム' },
  { id: 'mission-split',        tab: 'area', name: 'ミッション文（左右分割）',    description: '左に大きな日本語テキスト・右に説明文' },
  // ① Area 追加（新規9個）
  { id: 'bullet-points',        tab: 'area', name: '箇条書きリスト',             description: 'チェックマーク付きの箇条書きセクション' },
  { id: 'icon-cards-2x2',       tab: 'area', name: 'アイコンカード（2×2）',      description: '2×2グリッドのアイコン付きカード' },
  { id: 'timeline-steps',       tab: 'area', name: 'タイムライン / ステップ',    description: '縦型タイムラインでプロセスを表示' },
  { id: 'quote-fullscreen',     tab: 'area', name: '引用（フルスクリーン）',      description: '大きな引用テキストを全画面で表示' },
  { id: 'quote-side-accent',    tab: 'area', name: '引用（サイドアクセント）',    description: '左にアクセント線付きの引用テキスト' },
  { id: 'before-after',         tab: 'area', name: 'Before / After比較',         description: '導入前後のビフォーアフター比較' },
  { id: 'compare-two-option',   tab: 'area', name: '2択比較',                    description: '2つの選択肢を左右に並べて比較' },
  { id: 'problem-background',   tab: 'area', name: '課題提示',                   description: '解決すべき課題・背景を提示するセクション' },
  { id: 'mission-statement',    tab: 'area', name: 'ミッションステートメント',    description: '企業のミッション・ビジョンを大きく表示' },
  // メディア追加（新規2個）
  { id: 'image-caption',        tab: 'media', name: '画像＋キャプション',         description: '画像の下にキャプション付きで表示' },
  { id: 'image-three-grid',     tab: 'media', name: '3枚フォトギャラリー',        description: '3枚の画像を横並びで表示' },
  // データタブ（新規6個）
  { id: 'big-number',           tab: 'data', name: '大きな数値インパクト',        description: '巨大な数値で印象を与えるセクション' },
  { id: 'chart-bar',            tab: 'data', name: '棒グラフ',                   description: '棒グラフでデータを視覚化' },
  { id: 'chart-donut',          tab: 'data', name: 'ドーナツ / 円グラフ',        description: 'ドーナツチャートで割合を表示' },
  { id: 'chart-line',           tab: 'data', name: '折れ線グラフ',               description: '折れ線グラフで推移を表示' },
  { id: 'kpi-dashboard',        tab: 'data', name: 'KPIダッシュボード',          description: 'KPI指標をダッシュボード形式で表示' },
  { id: 'compare-table',        tab: 'data', name: '比較テーブル',               description: '機能比較を表形式で表示' },
  // クロージングタブ（新規4個）
  { id: 'closing-thankyou',     tab: 'closing', name: 'Thank You',               description: '感謝のメッセージを大きく表示' },
  { id: 'closing-contact-card', tab: 'closing', name: '連絡先カード',             description: '担当者の連絡先情報をカード表示' },
  { id: 'speaker-bio',          tab: 'closing', name: 'スピーカー紹介',           description: '講演者のプロフィールを紹介' },
  { id: 'agenda-toc',           tab: 'closing', name: 'アジェンダ / 目次',        description: 'プレゼンの目次やアジェンダを表示' },
  // ② Hero
  { id: 'hero-center',      tab: 'hero', name: 'ヒーロー（中央寄せ）',       description: 'テキストとCTAを中央配置' },
  { id: 'hero-split',       tab: 'hero', name: 'ヒーロー（左右分割）',       description: '左テキスト・右画像の2カラム' },
  { id: 'hero-dark-split',  tab: 'hero', name: 'ヒーロー（ダーク＋右画像）', description: '暗背景に左テキスト、右に画像' },
  { id: 'hero-minimal',     tab: 'hero', name: 'ヒーロー（ミニマル）',       description: '大きなタイポグラフィのみ・画像なし' },
  { id: 'hero-with-video',  tab: 'hero', name: 'ヒーロー（動画背景）',       description: '動画背景にテキストとCTAを重ねる' },
  { id: 'hero-slider',      tab: 'hero', name: 'ヒーロー（スライダー）',      description: '左右矢印ナビ付きフルスライダー' },
  // ③ Media
  { id: 'image-fullwidth', tab: 'media', name: 'フル幅画像',     description: 'セクション全幅の画像エリア' },
  { id: 'image-gallery',   tab: 'media', name: '画像ギャラリー', description: '3カラムのグリッドギャラリー' },
  { id: 'image-text',       tab: 'media', name: '画像＋テキスト',         description: '左画像・右テキストの2カラム' },
  { id: 'image-text-right', tab: 'media', name: '画像＋テキスト（画像右）', description: '左テキスト・右画像の2カラム' },
  { id: 'video-embed',      tab: 'media', name: '動画埋め込み',             description: 'YouTube等の動画プレーヤーエリア' },
  // ④ Button
  { id: 'btn-outline',  tab: 'button', previewH: 80, name: 'アウトラインボタン',   description: '枠線のみ・背景透明' },
  { id: 'btn-filled',   tab: 'button', previewH: 80, name: 'フィルドボタン',       description: '黒背景・白テキスト' },
  { id: 'btn-ghost',    tab: 'button', previewH: 80, name: 'ゴーストボタン',       description: 'テキスト＋矢印のみ・枠なし' },
  { id: 'btn-rounded',  tab: 'button', previewH: 80, name: '丸ボタン',             description: '角丸99pxの大きめボタン' },
  { id: 'btn-icon',     tab: 'button', previewH: 80, name: 'アイコン付きボタン',   description: 'アイコン＋テキストのボタン' },
  { id: 'btn-cta-lg',   tab: 'button', previewH: 80, name: '大CTAボタン',          description: 'フル幅の大きなCTAボタン' },
  // ⑤ Animation - Scroll
  { id: 'fade-in-up',      tab: 'animation', previewH: 160, name: 'フェードイン（下から）',     description: 'スクロールで要素が下からフワッと出現' },
  { id: 'fade-in',         tab: 'animation', previewH: 160, name: 'フェードイン',               description: 'スクロールで要素がじわっと出現' },
  { id: 'slide-in-left',   tab: 'animation', previewH: 160, name: 'スライドイン（左から）',     description: '左からスライドして出現' },
  { id: 'slide-in-right',  tab: 'animation', previewH: 160, name: 'スライドイン（右から）',     description: '右からスライドして出現' },
  // Animation - Text
  { id: 'text-fade-in',    tab: 'animation', previewH: 160, name: 'テキストフェードイン',       description: '見出しがじわっと出現' },
  { id: 'text-slide-up',   tab: 'animation', previewH: 160, name: 'テキストスライドアップ',     description: 'テキストが下から滑り上がって出現' },
  { id: 'text-stagger',    tab: 'animation', previewH: 160, name: 'テキスト連続出現',           description: '行ごとに時間差でフェードイン' },
  { id: 'text-typewriter', tab: 'animation', previewH: 160, name: 'タイプライター',             description: '1文字ずつ順番に表示されるエフェクト' },
  // Animation - Button
  { id: 'btn-hover-fill',  tab: 'animation', previewH: 160, name: 'ボタンホバー（塗りつぶし）', description: 'ホバーで背景色が塗りつぶされるボタン' },
  { id: 'btn-hover-slide', tab: 'animation', previewH: 160, name: 'ボタンホバー（スライド）',   description: 'ホバーで左から背景がスライドするボタン' },
  // Animation - Page
  { id: 'parallax',        tab: 'animation', previewH: 160, name: 'パララックス',               description: 'スクロールで背景と前景が異なる速度で動く' },
  { id: 'counter-up',      tab: 'animation', previewH: 160, name: 'カウントアップ',             description: 'スクロールで数字が0からカウントアップ' },
]

const TABS: { id: ActiveTab; label: string; disabled?: boolean }[] = [
  { id: 'area',      label: 'エリア' },
  { id: 'hero',      label: 'ヒーロー' },
  { id: 'media',     label: 'メディア' },
  { id: 'data',      label: 'データ' },
  { id: 'closing',   label: 'クロージング' },
  { id: 'button',    label: 'ボタン' },
  { id: 'animation', label: 'アニメーション' },
  { id: 'font',      label: 'フォント' },
]

// ── PPTX bullet guides ───────────────────────────────────────────────────
const PPTX_BULLETS: Record<PartId, string[]> = {
  'hero-basic':      ['全画面ヒーローセクション', '背景はダーク系', 'h1キャッチコピー＋サブコピー＋CTAボタン'],
  features:          ['3カラムのグリッドレイアウト', 'アイコン＋タイトル＋説明文'],
  cta:               ['背景色を主カラーに設定', '中央揃えの見出しと大きなCTAボタン'],
  testimonial:       ['3カラムカード', '星評価・引用文・会社名を表示'],
  faq:               ['アコーディオン形式', 'Q&Aを5件程度用意'],
  logos:             ['grayscaleフィルター付きロゴを横並び', 'ダミーはテキストロゴで代替'],
  pricing:           ['3カラム料金テーブル', '中央をおすすめとして強調'],
  stats:             ['大きな数字で実績を訴求', '4項目程度'],
  team:              ['メンバーカード3〜4枚', '顔写真・名前・役職・SNSリンク'],
  blog:              ['記事カード3枚', 'サムネ・タイトル・日付・カテゴリタグ'],
  newsletter:        ['メール登録フォーム', 'input + submitボタンを横並び'],
  steps:             ['番号付き3〜4ステップ', '矢印で接続'],
  contact:           ['シンプルなお問い合わせフォーム', '送信ボタン付き'],
  footer:            ['ロゴ・ナビ・SNSリンク・コピーライト'],
  'text-2col':           ['上部にh2見出し', '本文をCSS grid 2カラムで分割', '左右均等な行間設定'],
  'features-4col-image': ['4カラムグリッド', '各カードに画像コンテナ(aspect-ratio 16/9)＋テキスト'],
  'team-horizontal':     ['各メンバー: 左に画像(w:40%)・右にラベル/名前/肩書き', 'リスト形式で縦に並べる'],
  'gallery-slider':      ['useRefとscrollIntoViewで横スクロール', '矢印ボタンで操作'],
  'features-icon-circle':['円形コンテナ(rounded-full)にlucide-reactアイコン配置', '3カラムグリッド'],
  'testimonial-slider':  ['useState でスライド管理', '写真＋コメント＋名前・矢印ナビ付き'],
  'steps-5':             ['5ステップを上段3・下段2に配置', '各ステップ: 番号丸＋タイトル＋説明'],
  map:                   ['Google Maps Embed API (iframeのみ・APIキー不要)', 'src="https://maps.google.com/maps?q=住所&output=embed"'],
  'services-labeled':    ['4カラムグリッド', '各カード上部にoverline（小文字・letter-spacing）', '下部にカテゴリタグ'],
  'mission-split':       ['左右2カラム(40/55%)', '左に大きなh2・右にp要素複数', '区切り線で分割'],
  'hero-center':     ['中央揃えヒーロー', '大きなh1・サブコピー・CTAボタン'],
  'hero-split':      ['左右2カラム', '左テキスト・右に画像プレースホルダー'],
  'hero-dark-split': ['ダーク背景＋右画像', '白テキスト・アウトラインボタン'],
  'hero-minimal':    ['極大タイポグラフィのみ', 'font-weight300・letter-spacing広め'],
  'hero-with-video': ['動画背景', 'overlay暗め・中央にCTAテキスト＋ボタン'],
  'hero-slider':     ['useStateでスライドインデックス管理', '左右ボタンで切り替え', '下部にドットインジケーター', '自動再生(setInterval)オプション推奨'],
  'image-fullwidth': ['max-width 100%', 'aspect-ratio 16/9の画像コンテナ'],
  'image-gallery':   ['CSS gridで3カラムギャラリー', 'hover時にoverlay表示'],
  'image-text':       ['左右2カラム', 'sticky scrollエフェクト推奨'],
  'image-text-right': ['左テキスト・右画像の2カラム', 'image-textの左右反転', 'sticky scrollエフェクト推奨'],
  'video-embed':      ['iframeでYouTube/Vimeo埋め込み', 'aspect-ratio 16/9維持'],
  'btn-outline':     ['枠線のみ・背景透明のアウトラインボタン'],
  'btn-filled':      ['黒背景・白テキストのフィルドボタン'],
  'btn-ghost':       ['テキスト＋矢印のみのゴーストボタン'],
  'btn-rounded':     ['border-radius 99pxの丸ボタン'],
  'btn-icon':        ['ArrowRightアイコン＋テキストのボタン'],
  'btn-cta-lg':      ['フル幅の大きなCTAボタン'],
  // Animation
  'fade-in-up':      ['Intersection Observer でスクロール検知', '初期: opacity:0, translateY:20px', '発火後: opacity:1, translateY:0, transition:0.6s ease'],
  'fade-in':         ['Intersection Observer でスクロール検知', '初期: opacity:0', '発火後: opacity:1, transition:0.6s ease'],
  'slide-in-left':   ['初期: opacity:0, translateX:-40px', '発火後: opacity:1, translateX:0, transition:0.6s ease'],
  'slide-in-right':  ['初期: opacity:0, translateX:40px', '発火後: opacity:1, translateX:0, transition:0.6s ease'],
  'text-fade-in':    ['h1/h2に適用', '初期: opacity:0', '発火後: opacity:1, transition:0.6s ease, delay:0.1s'],
  'text-slide-up':   ['overflow:hidden のコンテナ内で実装', '初期: translateY:100%', '発火後: translateY:0, transition:0.6s ease'],
  'text-stagger':    ['子要素に animation-delay を0.1sずつずらして適用', '各行: opacity:0 → opacity:1'],
  'text-typewriter': ['useEffect内でsetIntervalで1文字ずつ追加', 'カーソル点滅はCSS @keyframesで実装'],
  'btn-hover-fill':  ['CSS: hover時にbackground-colorをtransition:0.3sで変化', '通常: 背景透明・枠線あり', 'ホバー: background:#1A1A1A, color:#FFFFFF'],
  'btn-hover-slide': ['CSS: ::before 疑似要素でbackground をscaleX(0)→scaleX(1)', 'overflow:hidden + position:relative必須'],
  parallax:          ['onScrollイベントでtranslateYを速度0.5倍で設定', 'useEffect内でwindow.addEventListener("scroll", handler)'],
  'counter-up':      ['Intersection Observer 発火時にsetIntervalで数値を増加', '終了値に達したらclearInterval'],
  // Area 追加
  'bullet-points':       ['チェックマーク付き箇条書き', '4〜6項目のリスト', '左アイコン＋テキストの横並び'],
  'icon-cards-2x2':      ['2×2グリッド（4枚）', '各カードにアイコン＋タイトル＋説明', 'カード間に均等な余白'],
  'timeline-steps':      ['縦型タイムライン', '左に丸番号・右にタイトル＋説明', '縦線で各ステップを接続'],
  'quote-fullscreen':    ['全画面ダーク背景', '中央に大きな引用テキスト（白）', '下部に引用元の名前・肩書き'],
  'quote-side-accent':   ['左に太いアクセント線（border-left）', '右に引用テキスト＋引用元', '白背景・控えめなデザイン'],
  'before-after':        ['左右2カラム（Before / After）', '各カラムにラベル＋内容', 'ダーク←→ライトのコントラスト'],
  'compare-two-option':  ['2カラムカード比較', '各カードにタイトル＋特徴リスト', '片方を推奨として強調可能'],
  'problem-background':  ['課題・背景を提示', '大きなh2見出し＋説明テキスト', 'アイコンまたは番号付きリスト'],
  'mission-statement':   ['ダーク全画面背景', '中央に大きなミッションテキスト', '企業理念・ビジョンの訴求'],
  // Media 追加
  'image-caption':       ['画像エリア＋下部キャプション', 'ダーク背景に白テキスト', 'aspect-ratio 16/9の画像コンテナ'],
  'image-three-grid':    ['3枚の画像を横並び', '均等幅・同一高さ', 'hover時にoverlay表示推奨'],
  // Data
  'big-number':          ['超大型数値（80px以上）を中央配置', 'サブテキストで補足説明', '1〜3個の数値を横並び'],
  'chart-bar':           ['縦棒グラフ（4〜6本）', '各バーにラベル＋数値', 'CSSのみで実装（SVG不要）'],
  'chart-donut':         ['ドーナツチャート（CSS conic-gradient）', '中央に数値表示', '凡例を下部に配置'],
  'chart-line':          ['折れ線グラフ（SVG polyline）', '5〜7ポイント', 'X軸Y軸のラベル付き'],
  'kpi-dashboard':       ['ダーク背景のダッシュボード', '4つのKPI指標カード', '各カードに数値＋ラベル＋トレンド矢印'],
  'compare-table':       ['機能比較テーブル', '3カラム（プラン名）×5行（機能）', '○×または✓で比較表示'],
  // Closing
  'closing-thankyou':    ['ダーク全画面背景', '大きな「Thank You」テキスト', 'サブテキストで次のアクションを案内'],
  'closing-contact-card':['連絡先情報カード', '名前・メール・電話・住所', 'アイコン付きの整列されたレイアウト'],
  'speaker-bio':         ['講演者プロフィール', '左に顔写真・右にバイオグラフィー', '名前・肩書き・SNSリンク'],
  'agenda-toc':          ['ダーク背景の目次', '番号付きリスト形式', '各項目にタイトル＋時間'],
}

const PART_GUIDES: Record<PartId, string> = {
  'hero-basic':      'ヒーローエリア: ダーク背景、大きなキャッチコピー（白）、サブテキスト、青いCTAボタン。高さはビューポート全体',
  features:          '特徴紹介エリア: 白背景、3カラムグリッドカード（アイコン・タイトル・説明文）',
  cta:               'CTAバナー: 主カラー背景、中央寄せの見出し・サブテキスト・白いアウトラインボタン',
  testimonial:       'お客様の声: 薄グレー背景、3カラムカード（星評価・引用文・名前・会社名）',
  faq:               'よくある質問: 白背景、アコーディオン形式Q&Aリスト（5〜8項目）',
  logos:             'ロゴ一覧: 薄グレー背景、ロゴグリッド（グレースケール表示）',
  pricing:           '料金プラン: 3カラム料金テーブル。中央カードをおすすめとして border強調',
  stats:             '実績・数値: 薄グレー背景、大きな数字4項目で実績を訴求',
  team:              'チーム紹介: 白背景、3〜4カラムのメンバーカード（顔写真・名前・役職・SNSリンク）',
  blog:              'ブログ・ニュース: 白背景、3カラムの記事カード（サムネ・タイトル・日付・カテゴリタグ）',
  newsletter:        'メルマガ登録: 薄グレー背景、メール入力フォーム＋送信ボタンを横並び',
  steps:             '導入ステップ: 白背景、番号付き3〜4ステップを矢印で接続',
  contact:           'お問い合わせ: 白背景、名前・メール・メッセージのシンプルフォーム',
  footer:            'フッター: ダーク背景、ロゴ・ナビリンク・SNSリンク・コピーライト',
  'text-2col':           'テキスト2カラム: 白背景、h2見出し中央揃え、本文をCSS grid(1fr 1fr)で2カラム分割',
  'features-4col-image': '特徴4カラム画像付き: 薄グレー背景、4カラムグリッド、各カードに16:9画像＋タイトル＋説明',
  'team-horizontal':     'チーム横型: 薄グレー背景、各メンバーは左画像(w:40%)＋右テキスト(ラベル/名前/肩書き)',
  'gallery-slider':      'ギャラリースライダー: 白背景、横スクロールギャラリー、左右矢印ボタン付き',
  'features-icon-circle':'特徴丸アイコン: 白背景、3カラム、各カラムにrounded-fullコンテナ＋アイコン＋テキスト',
  'testimonial-slider':  '証言スライダー: 白背景、左右矢印ナビ、写真ダミー＋コメント＋名前・会社名',
  'steps-5':             '5ステップ: 白背景、上段3ステップ＋下段2ステップ配置、番号丸＋タイトル＋説明',
  map:                   'Googleマップ: Google Maps Embed APIをiframe方式で埋め込み。src="https://maps.google.com/maps?q=住所&output=embed"',
  'services-labeled':    'サービスラベル付き: 薄グレー背景、4カラム、各カードにoverlineラベル＋タイトル＋説明＋タグ',
  'mission-split':       'ミッション分割: 白背景、左右2カラム(40/55%)。左に大きなh2、右にp複数、縦線で区切り',
  'hero-center':     '中央寄せヒーロー: ダーク背景、テキスト・CTAボタンを中央配置',
  'hero-split':      '左右分割ヒーロー: 白背景、左テキスト・右に画像プレースホルダーの2カラム',
  'hero-dark-split': 'ダーク分割ヒーロー: ダーク背景、左白テキスト・右に画像',
  'hero-minimal':    'ミニマルヒーロー: 白背景、極大タイポグラフィのみ（font-weight 300）',
  'hero-with-video': '動画背景ヒーロー: 動画背景にdark overlay、中央にCTAテキスト＋ボタン',
  'hero-slider':     'スライダーヒーロー: ダーク背景、useState管理のスライダー、左右矢印ボタン＋下部ドットインジケーター',
  'image-fullwidth': 'フル幅画像: aspect-ratio 16/9の全幅画像コンテナ',
  'image-gallery':   '画像ギャラリー: CSS gridで3カラム、hover時にoverlay表示',
  'image-text':       '画像＋テキスト: 左右2カラム（左画像・右テキスト）、sticky scroll推奨',
  'image-text-right': '画像＋テキスト（画像右）: 左テキスト・右画像の2カラム。image-textの左右を反転した構成。sticky scrollエフェクト推奨。ボタンはテキストエリアの下に配置。',
  'video-embed':      '動画埋め込み: iframeでYouTube/Vimeo埋め込み、aspect-ratio 16/9維持',
  'btn-outline':     'アウトラインボタン: border 1px solid #1A1A1A、背景透明、黒テキスト',
  'btn-filled':      'フィルドボタン: background #1A1A1A、白テキスト',
  'btn-ghost':       'ゴーストボタン: テキスト＋矢印のみ、枠なし・下線なし',
  'btn-rounded':     '丸ボタン: border-radius 99px、border 1px solid #1A1A1A',
  'btn-icon':        'アイコン付きボタン: ArrowRightアイコン＋テキスト、アウトライン',
  'btn-cta-lg':      '大CTAボタン: フル幅・height 56px・background #1A1A1A・白テキスト・中央配置',
  // Animation
  'fade-in-up':      'フェードイン（下から）: Intersection Observer でスクロール検知。初期状態 opacity:0, translateY:20px → 発火後 opacity:1, translateY:0, transition:0.6s ease',
  'fade-in':         'フェードイン: Intersection Observer でスクロール検知。初期状態 opacity:0 → 発火後 opacity:1, transition:0.6s ease',
  'slide-in-left':   'スライドイン（左から）: 初期 opacity:0, translateX:-40px → 発火後 opacity:1, translateX:0, transition:0.6s ease',
  'slide-in-right':  'スライドイン（右から）: 初期 opacity:0, translateX:40px → 発火後 opacity:1, translateX:0, transition:0.6s ease',
  'text-fade-in':    'テキストフェードイン: h1/h2に適用。初期 opacity:0 → 発火後 opacity:1, transition:0.6s ease, delay:0.1s',
  'text-slide-up':   'テキストスライドアップ: overflow:hidden のコンテナ内で translateY:100% → translateY:0, transition:0.6s ease',
  'text-stagger':    'テキスト連続出現: 子要素に animation-delay を0.1sずつずらして opacity:0→1 を適用',
  'text-typewriter': 'タイプライター: useEffect内でsetIntervalで1文字ずつ追加。カーソル点滅はCSS @keyframes',
  'btn-hover-fill':  'ボタンホバー（塗りつぶし）: hover時に background-color を transition:0.3s で変化。通常→背景透明・枠線あり、ホバー→background:#1A1A1A, color:#FFFFFF',
  'btn-hover-slide': 'ボタンホバー（スライド）: ::before 疑似要素でbackground を scaleX(0)→scaleX(1) でスライド。overflow:hidden + position:relative必須',
  parallax:          'パララックス: onScrollイベントで translateY を速度0.5倍で設定。useEffect内で window.addEventListener("scroll", handler)',
  'counter-up':      'カウントアップ: Intersection Observer 発火時に setInterval で数値を増加。終了値に達したら clearInterval',
  // Area 追加
  'bullet-points':       '箇条書きリスト: 白背景、チェックマーク付き4〜6項目のリスト。左にアイコン、右にテキスト。',
  'icon-cards-2x2':      'アイコンカード2×2: 白背景、2×2グリッドで4枚のカード。各カードにアイコン＋タイトル＋説明文。',
  'timeline-steps':      'タイムライン: 白背景、縦型タイムライン。左に丸番号、右にタイトル＋説明。縦線で各ステップを接続。',
  'quote-fullscreen':    '引用フルスクリーン: ダーク背景、中央に大きな引用テキスト（白・italic）。下部に引用元の名前と肩書き。',
  'quote-side-accent':   '引用サイドアクセント: 白背景、左に太い縦線（border-left 4px）。右に引用テキスト＋引用元。',
  'before-after':        'Before/After: 白背景、左右2カラム。左（Before）はグレー系、右（After）はアクセント色で対比。',
  'compare-two-option':  '2択比較: ライトグレー背景、2カラムのカード。各カードにタイトル＋特徴リスト。片方を推奨強調。',
  'problem-background':  '課題提示: 白背景、大きなh2見出し「こんな課題ありませんか？」＋アイコン付きリストで課題を列挙。',
  'mission-statement':   'ミッションステートメント: ダーク背景、中央に大きなミッションテキスト（白・font-weight 300）。',
  // Media 追加
  'image-caption':       '画像＋キャプション: ダーク背景、16:9画像エリア＋下部に白テキストのキャプション。',
  'image-three-grid':    '3枚フォトギャラリー: 白背景、3枚の画像を横並びグリッド。均等幅・同一高さ。',
  // Data
  'big-number':          '大きな数値: 白背景、超大型数値（font-size 64px以上）を中央配置。サブテキストで補足。',
  'chart-bar':           '棒グラフ: 白背景、CSSのみで縦棒グラフ（4〜6本）。各バーにラベル＋数値。',
  'chart-donut':         'ドーナツグラフ: 白背景、CSS conic-gradientでドーナツチャート。中央に数値、下部に凡例。',
  'chart-line':          '折れ線グラフ: 白背景、SVG polylineで5〜7ポイントの折れ線。X軸Y軸ラベル付き。',
  'kpi-dashboard':       'KPIダッシュボード: ダーク背景、4つのKPIカード。各カードに数値＋ラベル＋トレンド矢印。',
  'compare-table':       '比較テーブル: 白背景、3カラム×5行の機能比較テーブル。✓/×で比較表示。ヘッダー行を強調。',
  // Closing
  'closing-thankyou':    'Thank You: ダーク背景、中央に大きな「Thank You」テキスト（白）。サブテキストで次のアクション案内。',
  'closing-contact-card':'連絡先カード: 白背景、名前・メール・電話・住所の連絡先情報をアイコン付きカードで表示。',
  'speaker-bio':         'スピーカー紹介: 白背景、左に顔写真プレースホルダー・右にバイオグラフィー。名前・肩書き・SNS。',
  'agenda-toc':          'アジェンダ: ダーク背景、番号付きリスト形式の目次。各項目にタイトル＋時間。',
}

// ── Font List ─────────────────────────────────────────────────────────────
const FONT_LIST: FontEntry[] = [
  // サンセリフ系
  { id: 'noto-sans-jp',  name: 'Noto Sans JP',       category: 'サンセリフ',    google: true,  weights: ['400','700'] },
  { id: 'poppins',       name: 'Poppins',             category: 'サンセリフ',    google: true,  weights: ['300','400','600','700'] },
  { id: 'inter',         name: 'Inter',               category: 'サンセリフ',    google: true,  weights: ['400','600','700'] },
  { id: 'dm-sans',       name: 'DM Sans',             category: 'サンセリフ',    google: true,  weights: ['400','500','700'] },
  { id: 'outfit',        name: 'Outfit',              category: 'サンセリフ',    google: true,  weights: ['300','400','700'] },
  { id: 'plus-jakarta',  name: 'Plus Jakarta Sans',   category: 'サンセリフ',    google: true,  weights: ['400','600','700'] },
  // セリフ系
  { id: 'noto-serif-jp', name: 'Noto Serif JP',       category: 'セリフ',        google: true,  weights: ['400','700'] },
  { id: 'playfair',      name: 'Playfair Display',    category: 'セリフ',        google: true,  weights: ['400','700'] },
  { id: 'cormorant',     name: 'Cormorant Garamond',  category: 'セリフ',        google: true,  weights: ['300','400','600'] },
  { id: 'lora',          name: 'Lora',                category: 'セリフ',        google: true,  weights: ['400','700'] },
  // モノスペース系
  { id: 'space-mono',    name: 'Space Mono',          category: 'モノスペース',  google: true,  weights: ['400','700'] },
  { id: 'ibm-plex-mono', name: 'IBM Plex Mono',       category: 'モノスペース',  google: true,  weights: ['400','600'] },
  // 個性系
  { id: 'space-grotesk', name: 'Space Grotesk',       category: '個性系',        google: true,  weights: ['400','500','700'] },
  { id: 'syne',          name: 'Syne',                category: '個性系',        google: true,  weights: ['400','700','800'] },
  { id: 'cabinet',       name: 'Cabinet Grotesk',     category: '個性系',        google: true,  weights: ['400','500','700'] },
  // 日本語特化
  { id: 'zen-kaku',      name: 'Zen Kaku Gothic',     category: '日本語',        google: true,  weights: ['400','700'] },
  { id: 'shippori',      name: 'Shippori Mincho',     category: '日本語',        google: true,  weights: ['400','700'] },
  { id: 'line-seed',     name: 'LINE Seed',           category: '日本語',        google: false, weights: ['400','700'],
    cssUrl: '/fonts/LINESeedJP_OTF_Rg.woff2' },
]

const FONT_CATEGORIES = ['すべて', 'サンセリフ', 'セリフ', 'モノスペース', '個性系', '日本語'] as const

function fontToNextImport(name: string): string {
  return name.replace(/\s+/g, '_')
}

// ── Card Previews ─────────────────────────────────────────────────────────
// Area ──────────────────────────────────────────────────────────────────────
function PreviewHeroBasic() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center gap-2 px-4 text-center" style={{ background: '#2C2C2C' }}>
      <Layout size={18} color="rgba(244,244,244,0.35)" />
      <p style={{ fontSize: 12, fontWeight: 700, color: '#F4F4F4', lineHeight: 1.4 }}>あなたの事業を、次のステージへ</p>
      <p style={{ fontSize: 9, color: 'rgba(244,244,244,0.4)' }}>サービスの説明がここに入ります</p>
      <div style={{ marginTop: 4, padding: '3px 10px', border: '1px solid rgba(244,244,244,0.5)', color: '#F4F4F4', borderRadius: 2, fontSize: 9 }}>無料で始める</div>
    </div>
  )
}
function PreviewFeatures() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center px-3 gap-2.5" style={{ background: C.card }}>
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: C.hint }}>FEATURES</p>
      <div className="flex gap-2 w-full">
        {[Zap, Shield, Star].map((Icon, i) => (
          <div key={i} className="flex-1 flex flex-col items-center py-3 gap-1.5" style={{ background: C.bg, border: `1px solid ${C.bd}`, borderRadius: 2 }}>
            <Icon size={16} color={C.sub} />
            <div className="w-8 h-px" style={{ background: C.bd }} />
          </div>
        ))}
      </div>
    </div>
  )
}
function PreviewCta() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center gap-2 px-4" style={{ background: C.main }}>
      <ArrowRight size={18} color="rgba(244,244,244,0.35)" />
      <p style={{ fontSize: 12, fontWeight: 700, color: '#F4F4F4' }}>今すぐ無料でスタート</p>
      <p style={{ fontSize: 9, color: 'rgba(244,244,244,0.4)' }}>クレジットカード不要</p>
      <div style={{ marginTop: 4, padding: '3px 12px', border: '1px solid rgba(244,244,244,0.4)', color: '#F4F4F4', borderRadius: 2, fontSize: 9, display: 'flex', alignItems: 'center', gap: 4 }}>登録する <ArrowRight size={9} /></div>
    </div>
  )
}
function PreviewTestimonial() {
  return (
    <div className="h-[160px] flex items-center px-3 gap-2" style={{ background: C.bg }}>
      {[0, 1].map(i => (
        <div key={i} className="flex-1 h-28 flex flex-col justify-between p-2.5" style={{ background: C.card, border: `1px solid ${C.bd}`, borderRadius: 2 }}>
          <MessageSquare size={12} color={C.hint} />
          <div>
            <p style={{ fontSize: 8, color: C.sub }}>★★★★★</p>
            <div className="w-full h-px mt-1.5" style={{ background: C.bd }} />
            <div className="w-3/4 h-px mt-1.5" style={{ background: C.bd }} />
          </div>
          <div className="w-10 h-px" style={{ background: C.hint }} />
        </div>
      ))}
    </div>
  )
}
function PreviewFaq() {
  return (
    <div className="h-[160px] flex flex-col justify-center px-4 gap-0" style={{ background: C.card }}>
      <div className="flex items-center gap-1.5 mb-3">
        <HelpCircle size={12} color={C.hint} />
        <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: C.hint }}>FAQ</p>
      </div>
      {['無料プランはありますか？', '解約はいつでもできますか？'].map((q, i) => (
        <div key={i} className="py-2.5" style={{ borderBottom: `1px solid ${C.muted}` }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: C.main }}>Q. {q}</p>
        </div>
      ))}
    </div>
  )
}
function PreviewLogos() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center gap-3" style={{ background: C.muted }}>
      <div className="flex items-center gap-1.5">
        <Building2 size={12} color={C.hint} />
        <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: C.hint }}>PARTNERS</p>
      </div>
      <div className="flex gap-2.5">
        {[76, 60, 68, 56].map((w, i) => (<div key={i} style={{ width: w, height: 20, background: C.bd, borderRadius: 2 }} />))}
      </div>
    </div>
  )
}
function PreviewPricing() {
  return (
    <div className="h-[160px] flex items-center justify-center px-3 gap-2" style={{ background: C.card }}>
      {[false, true, false].map((featured, i) => (
        <div key={i} className="flex-1 h-32 flex flex-col justify-between p-2"
          style={{ background: featured ? C.bg : C.card, border: featured ? `1.5px solid ${C.main}` : `1px solid ${C.bd}`, borderRadius: 2 }}>
          <div>
            <div className="w-10 h-1.5 rounded mb-1" style={{ background: C.bd }} />
            <div className="w-6 h-2.5 rounded" style={{ background: featured ? C.main : C.bd }} />
          </div>
          <div className="space-y-1">
            {[0,1,2].map(j => (<div key={j} className="h-1 rounded" style={{ background: C.muted }} />))}
          </div>
          <div className="h-5 rounded" style={{ background: featured ? C.main : C.bd, borderRadius: 2 }} />
        </div>
      ))}
    </div>
  )
}
function PreviewStats() {
  return (
    <div className="h-[160px] flex items-center justify-around px-4" style={{ background: C.bg }}>
      {[['1,200+', '導入企業数'], ['98%', '継続率'], ['4.8', '満足度'], ['3x', '成果向上']].map(([n, l], i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <p style={{ fontSize: 18, fontWeight: 700, color: C.main, lineHeight: 1 }}>{n}</p>
          <p style={{ fontSize: 8, color: C.sub }}>{l}</p>
        </div>
      ))}
    </div>
  )
}
function PreviewTeam() {
  return (
    <div className="h-[160px] flex items-center justify-center px-3 gap-2" style={{ background: C.card }}>
      {[0,1,2].map(i => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 py-3">
          <div style={{ width: 40, height: 40, background: C.muted, borderRadius: 2 }} />
          <div className="w-12 h-1.5 rounded" style={{ background: C.bd }} />
          <div className="w-8 h-1 rounded" style={{ background: C.muted }} />
        </div>
      ))}
    </div>
  )
}
function PreviewBlog() {
  return (
    <div className="h-[160px] flex items-start px-3 pt-4 gap-2" style={{ background: C.card }}>
      {[0,1,2].map(i => (
        <div key={i} className="flex-1 flex flex-col gap-1.5">
          <div style={{ height: 70, background: C.muted, borderRadius: 2 }} />
          <div className="w-full h-1.5 rounded" style={{ background: C.bd }} />
          <div className="w-2/3 h-1 rounded" style={{ background: C.muted }} />
        </div>
      ))}
    </div>
  )
}
function PreviewNewsletter() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center gap-3 px-4" style={{ background: C.muted }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: C.main }}>メルマガ登録</p>
      <p style={{ fontSize: 9, color: C.sub }}>最新情報をお届けします</p>
      <div className="flex gap-2 w-full mt-1">
        <div className="flex-1 h-7" style={{ border: `1px solid ${C.bd}`, borderRadius: 2, background: C.card }} />
        <div style={{ width: 48, height: 28, background: C.main, borderRadius: 2 }} />
      </div>
    </div>
  )
}
function PreviewSteps() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center px-4 gap-3" style={{ background: C.card }}>
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: C.hint }}>STEPS</p>
      <div className="flex items-center gap-2 w-full">
        {['①', '②', '③'].map((n, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center" style={{ width: 22, height: 22, border: `1px solid ${C.main}`, borderRadius: '50%', fontSize: 9, color: C.main, background: C.card }}>{n}</div>
              <div className="w-10 h-1 rounded" style={{ background: C.muted }} />
            </div>
            {i < 2 && <div className="flex-1 h-px" style={{ background: C.bd, borderStyle: 'dashed', borderTop: `1px dashed ${C.bd}`, height: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  )
}
function PreviewContact() {
  return (
    <div className="h-[160px] flex flex-col justify-center px-4 gap-3" style={{ background: C.card }}>
      {['お名前', 'メールアドレス', 'メッセージ'].map((label, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${C.bd}`, paddingBottom: 4 }}>
          <p style={{ fontSize: 8, color: C.hint }}>{label}</p>
        </div>
      ))}
      <div style={{ alignSelf: 'flex-end', padding: '3px 10px', border: `1px solid ${C.main}`, borderRadius: 2, fontSize: 9, color: C.main }}>送信する →</div>
    </div>
  )
}
function PreviewFooter() {
  return (
    <div className="h-[160px] flex flex-col justify-between px-4 py-3" style={{ background: '#2C2C2C' }}>
      <div className="flex justify-between">
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#F4F4F4' }}>LOGO</p>
          <p style={{ fontSize: 8, color: C.sub, marginTop: 4 }}>キャッチコピーが入ります</p>
        </div>
        <div className="flex flex-col gap-1">
          {['About', 'Service', 'Works', 'Contact'].map(l => (<p key={l} style={{ fontSize: 8, color: C.sub }}>{l}</p>))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid #3C3C3C`, paddingTop: 8 }}>
        <p style={{ fontSize: 8, color: '#444444' }}>© 2026 Company Name. All rights reserved.</p>
      </div>
    </div>
  )
}

// Hero tab ──────────────────────────────────────────────────────────────────
function PreviewHeroCenter() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center gap-2 px-4 text-center" style={{ background: C.main }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#F4F4F4', lineHeight: 1.4 }}>あなたの事業を<br />次のステージへ</p>
      <p style={{ fontSize: 9, color: 'rgba(244,244,244,0.4)' }}>サービスの説明がここに入ります</p>
      <div style={{ marginTop: 4, padding: '3px 10px', border: '1px solid rgba(244,244,244,0.5)', color: '#F4F4F4', borderRadius: 2, fontSize: 9 }}>無料で始める</div>
    </div>
  )
}
function PreviewHeroSplit() {
  return (
    <div className="h-[160px] flex" style={{ background: C.card }}>
      <div className="flex-1 flex flex-col justify-center px-3 gap-2">
        <div className="w-16 h-2 rounded" style={{ background: C.bd }} />
        <div className="w-12 h-1.5 rounded" style={{ background: C.muted }} />
        <div style={{ width: 48, padding: '3px 0', border: `1px solid ${C.main}`, borderRadius: 2, fontSize: 8, color: C.main, textAlign: 'center' }}>詳しく見る</div>
      </div>
      <div className="flex-1" style={{ background: C.muted }} />
    </div>
  )
}
function PreviewHeroDarkSplit() {
  return (
    <div className="h-[160px] flex" style={{ background: C.main }}>
      <div className="flex-1 flex flex-col justify-center px-3 gap-2">
        <div className="w-16 h-2 rounded" style={{ background: '#3C3C3C' }} />
        <div className="w-12 h-1.5 rounded" style={{ background: '#333333' }} />
        <div style={{ width: 48, padding: '3px 0', border: '1px solid rgba(244,244,244,0.5)', borderRadius: 2, fontSize: 8, color: '#F4F4F4', textAlign: 'center' }}>詳しく見る</div>
      </div>
      <div className="flex-1" style={{ background: '#2C2C2C' }} />
    </div>
  )
}
function PreviewHeroMinimal() {
  return (
    <div className="h-[160px] flex flex-col justify-center px-5 gap-2" style={{ background: C.card }}>
      <p style={{ fontSize: 22, fontWeight: 300, color: C.main, lineHeight: 1.2, letterSpacing: '-0.02em' }}>あなたの事業を<br />次のステージへ</p>
      <div style={{ width: 64, padding: '3px 0', border: `1px solid ${C.bd}`, borderRadius: 2, fontSize: 8, color: C.sub, textAlign: 'center' }}>詳しく見る</div>
    </div>
  )
}
function PreviewHeroWithVideo() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center gap-3" style={{ background: '#3C3C3C' }}>
      <div className="flex items-center justify-center" style={{ width: 36, height: 36, border: '2px solid rgba(244,244,244,0.7)', borderRadius: '50%' }}>
        <div style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '12px solid rgba(244,244,244,0.8)', marginLeft: 2 }} />
      </div>
      <p style={{ fontSize: 10, color: 'rgba(244,244,244,0.7)' }}>動画タイトルが入ります</p>
    </div>
  )
}

// Media tab ─────────────────────────────────────────────────────────────────
function PreviewImageFullwidth() {
  return (
    <div className="h-[160px] flex items-center justify-center" style={{ background: C.bd }}>
      <ImageIcon size={28} color={C.hint} />
    </div>
  )
}
function PreviewImageGallery() {
  return (
    <div className="h-[160px] p-3" style={{ background: C.card }}>
      <div className="grid grid-cols-3 gap-1.5 h-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ background: C.muted, borderRadius: 2 }} />
        ))}
      </div>
    </div>
  )
}
function PreviewImageText() {
  return (
    <div className="h-[160px] flex" style={{ background: C.card }}>
      <div className="flex-1" style={{ background: C.muted }} />
      <div className="flex-1 flex flex-col justify-center px-3 gap-2">
        <div className="w-16 h-1.5 rounded" style={{ background: C.bd }} />
        <div className="w-full h-1 rounded" style={{ background: C.muted }} />
        <div className="w-3/4 h-1 rounded" style={{ background: C.muted }} />
        <div style={{ width: 48, padding: '3px 0', border: `1px solid ${C.bd}`, borderRadius: 2, fontSize: 8, color: C.sub, textAlign: 'center', marginTop: 4 }}>詳しく見る</div>
      </div>
    </div>
  )
}
function PreviewImageTextRight() {
  return (
    <div className="h-[160px] flex" style={{ background: C.card }}>
      <div className="flex-1 flex flex-col justify-center px-3 gap-2">
        <div className="w-16 h-1.5 rounded" style={{ background: C.bd }} />
        <div className="w-full h-1 rounded" style={{ background: C.muted }} />
        <div className="w-3/4 h-1 rounded" style={{ background: C.muted }} />
        <div style={{ width: 48, padding: '3px 0', border: `1px solid ${C.bd}`, borderRadius: 2, fontSize: 8, color: C.sub, textAlign: 'center', marginTop: 4 }}>詳しく見る</div>
      </div>
      <div className="flex-1" style={{ background: C.muted }} />
    </div>
  )
}
function PreviewVideoEmbed() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center gap-3" style={{ background: '#2C2C2C' }}>
      <div className="flex items-center justify-center" style={{ width: 44, height: 44, border: '2px solid rgba(244,244,244,0.6)', borderRadius: '50%' }}>
        <div style={{ width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: '16px solid rgba(244,244,244,0.8)', marginLeft: 3 }} />
      </div>
      <p style={{ fontSize: 9, color: 'rgba(244,244,244,0.4)' }}>動画タイトルが入ります</p>
    </div>
  )
}

// Button tab ─────────────────────────────────────────────────────────────────
function PreviewBtnOutline() {
  return (
    <div className="h-[80px] flex items-center justify-center" style={{ background: C.card }}>
      <div style={{ padding: '8px 20px', border: `1px solid ${C.main}`, borderRadius: 2, fontSize: 12, color: C.main }}>詳しく見る</div>
    </div>
  )
}
function PreviewBtnFilled() {
  return (
    <div className="h-[80px] flex items-center justify-center" style={{ background: C.card }}>
      <div style={{ padding: '8px 20px', background: C.main, borderRadius: 2, fontSize: 12, color: '#F4F4F4' }}>詳しく見る</div>
    </div>
  )
}
function PreviewBtnGhost() {
  return (
    <div className="h-[80px] flex items-center justify-center" style={{ background: C.card }}>
      <div style={{ fontSize: 12, color: C.main, display: 'flex', alignItems: 'center', gap: 6 }}>詳しく見る <ArrowRight size={12} /></div>
    </div>
  )
}
function PreviewBtnRounded() {
  return (
    <div className="h-[80px] flex items-center justify-center" style={{ background: C.card }}>
      <div style={{ padding: '8px 24px', border: `1px solid ${C.main}`, borderRadius: 99, fontSize: 12, color: C.main }}>詳しく見る</div>
    </div>
  )
}
function PreviewBtnIcon() {
  return (
    <div className="h-[80px] flex items-center justify-center" style={{ background: C.card }}>
      <div style={{ padding: '8px 20px', border: `1px solid ${C.main}`, borderRadius: 2, fontSize: 12, color: C.main, display: 'flex', alignItems: 'center', gap: 8 }}>
        <ArrowRight size={13} />はじめる
      </div>
    </div>
  )
}
function PreviewBtnCtaLg() {
  return (
    <div className="h-[80px] flex items-center justify-center px-4" style={{ background: C.card }}>
      <div style={{ width: '90%', height: 40, background: C.main, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#F4F4F4' }}>今すぐ始める</div>
    </div>
  )
}

// Area 追加パーツ ──────────────────────────────────────────────────────────────
function PreviewText2col() {
  return (
    <div className="h-[160px] flex flex-col items-center px-4 py-5 gap-3" style={{ background: C.card }}>
      <div style={{ width: 80, height: 8, background: C.main, borderRadius: 1 }} />
      <div className="flex gap-3 w-full pt-1">
        <div className="flex-1 flex flex-col gap-1.5">
          {[90,80,90,70,85].map((w,i) => <div key={i} style={{ height: 5, width:`${w}%`, background: C.bd, borderRadius: 1 }} />)}
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          {[75,90,65,85,75].map((w,i) => <div key={i} style={{ height: 5, width:`${w}%`, background: C.bd, borderRadius: 1 }} />)}
        </div>
      </div>
    </div>
  )
}
function PreviewFeatures4colImage() {
  return (
    <div className="h-[160px] flex flex-col px-2 py-3 gap-2" style={{ background: C.bg }}>
      <div style={{ width: 60, height: 6, background: C.bd, borderRadius: 1, alignSelf: 'center' }} />
      <div className="flex gap-1.5">
        {[0,1,2,3].map(i => (
          <div key={i} className="flex-1 flex flex-col gap-1.5">
            <div style={{ height: 60, background: '#2C2C2C', borderRadius: 2 }} />
            <div style={{ height: 5, background: C.bd, borderRadius: 1 }} />
            <div style={{ height: 4, width: '80%', background: C.muted, borderRadius: 1 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
function PreviewTeamHorizontal() {
  return (
    <div className="h-[160px] flex flex-col px-3 py-3 gap-3" style={{ background: C.bg }}>
      <div style={{ width: 60, height: 6, background: C.bd, borderRadius: 1, alignSelf: 'center' }} />
      <div className="flex flex-col gap-2">
        {[0,1].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div style={{ width: 44, height: 44, background: '#2C2C2C', borderRadius: 2, flexShrink: 0 }} />
            <div className="flex flex-col gap-1.5 flex-1">
              <div style={{ height: 4, width: '55%', background: C.hint, borderRadius: 1 }} />
              <div style={{ height: 6, width: '80%', background: C.main, borderRadius: 1 }} />
              <div style={{ height: 4, width: '65%', background: C.bd, borderRadius: 1 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
function PreviewGallerySlider() {
  return (
    <div className="h-[160px] relative flex flex-col px-4 py-4 gap-3" style={{ background: C.card }}>
      <div style={{ width: 60, height: 6, background: C.bd, borderRadius: 1, alignSelf: 'center' }} />
      <div className="flex gap-1.5">
        {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: 80, background: C.muted, borderRadius: 2 }} />)}
      </div>
      <span style={{ position: 'absolute', left: 6, top: '60%', fontSize: 18, color: C.sub, lineHeight: 1 }}>‹</span>
      <span style={{ position: 'absolute', right: 6, top: '60%', fontSize: 18, color: C.sub, lineHeight: 1 }}>›</span>
    </div>
  )
}
function PreviewFeaturesIconCircle() {
  return (
    <div className="h-[160px] flex items-center justify-around px-4" style={{ background: C.card }}>
      {[0,1,2].map(i => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.muted }} />
          <div style={{ width: 40, height: 5, background: C.bd, borderRadius: 1 }} />
          <div style={{ width: 48, height: 4, background: C.muted, borderRadius: 1 }} />
          <div style={{ width: 40, height: 4, background: C.muted, borderRadius: 1 }} />
        </div>
      ))}
    </div>
  )
}
function PreviewTestimonialSlider() {
  return (
    <div className="h-[160px] relative flex flex-col px-4 py-3 gap-2.5" style={{ background: C.card }}>
      <div style={{ width: 70, height: 6, background: C.bd, borderRadius: 1, alignSelf: 'center' }} />
      <div className="flex gap-2">
        {[0,1,2].map(i => <div key={i} style={{ flex: 1, height: 85, background: C.muted, borderRadius: 2 }} />)}
      </div>
      <span style={{ position: 'absolute', left: 4, top: '60%', fontSize: 18, color: C.sub, lineHeight: 1 }}>‹</span>
      <span style={{ position: 'absolute', right: 4, top: '60%', fontSize: 18, color: C.sub, lineHeight: 1 }}>›</span>
    </div>
  )
}
function PreviewSteps5() {
  return (
    <div className="h-[160px] flex flex-col px-3 py-3 gap-2" style={{ background: C.card }}>
      <div style={{ width: 60, height: 6, background: C.bd, borderRadius: 1, alignSelf: 'center', marginBottom: 2 }} />
      <div className="flex justify-around">
        {[1,2,3].map(n => (
          <div key={n} className="flex flex-col items-center gap-1">
            <div style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: C.sub }}>{n}</div>
            <div style={{ width: 28, height: 4, background: C.muted, borderRadius: 1 }} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-8">
        {[4,5].map(n => (
          <div key={n} className="flex flex-col items-center gap-1">
            <div style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: C.sub }}>{n}</div>
            <div style={{ width: 28, height: 4, background: C.muted, borderRadius: 1 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
function PreviewMap() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center gap-2" style={{ background: '#2C2C2C' }}>
      <MapPin size={24} color="rgba(244,244,244,0.7)" />
      <p style={{ fontSize: 10, color: 'rgba(244,244,244,0.35)' }}>所在地マップ</p>
    </div>
  )
}
function PreviewServicesLabeled() {
  return (
    <div className="h-[160px] flex items-stretch px-2 py-3 gap-1" style={{ background: C.bg }}>
      {[0,1,2,3].map(i => (
        <div key={i} className="flex-1 flex flex-col gap-1.5 px-1 py-1">
          <div style={{ width: '70%', height: 3, background: C.hint, borderRadius: 1 }} />
          <div style={{ width: '90%', height: 7, background: C.main, borderRadius: 1 }} />
          <div style={{ width: '85%', height: 4, background: C.bd, borderRadius: 1 }} />
          <div style={{ width: '75%', height: 4, background: C.bd, borderRadius: 1 }} />
          <div style={{ width: '65%', height: 4, background: C.muted, borderRadius: 1 }} />
          <div style={{ marginTop: 'auto', width: '50%', height: 10, background: C.muted, borderRadius: 99 }} />
        </div>
      ))}
    </div>
  )
}
function PreviewMissionSplit() {
  return (
    <div className="h-[160px] flex items-center px-4 gap-4" style={{ background: C.card, border: `1px solid ${C.bd}` }}>
      <div style={{ width: '40%' }} className="flex flex-col gap-2">
        <div style={{ height: 10, background: C.main, borderRadius: 1 }} />
        <div style={{ height: 10, width: '90%', background: C.main, borderRadius: 1 }} />
        <div style={{ height: 10, width: '70%', background: C.main, borderRadius: 1 }} />
      </div>
      <div style={{ width: '55%' }} className="flex flex-col gap-1.5">
        {[95,85,90,75,80].map((w,i) => <div key={i} style={{ height: 4, width:`${w}%`, background: C.bd, borderRadius: 1 }} />)}
      </div>
    </div>
  )
}
// Hero 追加パーツ ──────────────────────────────────────────────────────────────
function PreviewHeroSlider() {
  return (
    <div className="h-[160px] relative flex items-center justify-center" style={{ background: '#1A1A1A' }}>
      <p style={{ fontSize: 12, color: '#F4F4F4', fontWeight: 600 }}>Photo of Hero</p>
      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 22, color: '#F4F4F4', lineHeight: 1 }}>‹</span>
      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 22, color: '#F4F4F4', lineHeight: 1 }}>›</span>
      <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
        <span style={{ fontSize: 8, color: '#F4F4F4' }}>●</span>
        <span style={{ fontSize: 8, color: 'rgba(244,244,244,0.3)' }}>○</span>
        <span style={{ fontSize: 8, color: 'rgba(244,244,244,0.3)' }}>○</span>
      </div>
    </div>
  )
}

// Area 追加パーツ Preview（新規9個）──────────────────────────────────────────
function PreviewBulletPoints() {
  return (
    <div className="h-[160px] flex flex-col justify-center px-5 gap-2" style={{ background: C.card }}>
      {['導入コスト削減', '運用効率アップ', 'サポート充実', '高い拡張性'].map((t, i) => (
        <div key={i} className="flex items-center gap-2">
          <span style={{ fontSize: 10, color: '#4CAF50' }}>✓</span>
          <span style={{ fontSize: 10, color: C.main }}>{t}</span>
        </div>
      ))}
    </div>
  )
}
function PreviewIconCards2x2() {
  return (
    <div className="h-[160px] p-3" style={{ background: C.card }}>
      <div className="grid grid-cols-2 gap-2 h-full">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center justify-center gap-1" style={{ background: C.bg, borderRadius: 2, border: `1px solid ${C.bd}` }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.muted }} />
            <div style={{ width: 32, height: 4, background: C.bd, borderRadius: 1 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
function PreviewTimelineSteps() {
  return (
    <div className="h-[160px] flex flex-col justify-center px-5 gap-0" style={{ background: C.card }}>
      {[1, 2, 3].map(n => (
        <div key={n} className="flex items-start gap-3" style={{ paddingBottom: n < 3 ? 8 : 0 }}>
          <div className="flex flex-col items-center">
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1px solid ${C.main}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: C.main, flexShrink: 0 }}>{n}</div>
            {n < 3 && <div style={{ width: 1, height: 16, background: C.bd }} />}
          </div>
          <div>
            <div style={{ width: 50, height: 5, background: C.main, borderRadius: 1, marginBottom: 3 }} />
            <div style={{ width: 70, height: 4, background: C.bd, borderRadius: 1 }} />
          </div>
        </div>
      ))}
    </div>
  )
}
function PreviewQuoteFullscreen() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center gap-2 px-5" style={{ background: '#2C2C2C' }}>
      <span style={{ fontSize: 22, color: 'rgba(244,244,244,0.2)', lineHeight: 1, fontFamily: 'serif' }}>"</span>
      <p style={{ fontSize: 10, color: '#F4F4F4', textAlign: 'center', lineHeight: 1.6, fontStyle: 'italic' }}>お客様の声やキャッチコピーが<br />ここに入ります</p>
      <div style={{ width: 40, height: 3, background: 'rgba(244,244,244,0.15)', borderRadius: 1 }} />
    </div>
  )
}
function PreviewQuoteSideAccent() {
  return (
    <div className="h-[160px] flex items-center px-5" style={{ background: C.card }}>
      <div style={{ borderLeft: `3px solid ${C.main}`, paddingLeft: 12 }}>
        <p style={{ fontSize: 10, color: C.sub, fontStyle: 'italic', lineHeight: 1.7, marginBottom: 6 }}>"素晴らしいサービスでした。<br />チーム全員が満足しています。"</p>
        <div style={{ width: 50, height: 4, background: C.bd, borderRadius: 1 }} />
      </div>
    </div>
  )
}
function PreviewBeforeAfter() {
  return (
    <div className="h-[160px] flex" style={{ background: C.card }}>
      <div className="flex-1 flex flex-col items-center justify-center gap-2" style={{ background: '#E8E8E8' }}>
        <p style={{ fontSize: 9, fontWeight: 600, color: C.sub, letterSpacing: '0.1em' }}>BEFORE</p>
        <div style={{ width: '60%', height: 50, background: C.bd, borderRadius: 2 }} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-2" style={{ background: C.card }}>
        <p style={{ fontSize: 9, fontWeight: 600, color: C.main, letterSpacing: '0.1em' }}>AFTER</p>
        <div style={{ width: '60%', height: 50, background: C.main, borderRadius: 2 }} />
      </div>
    </div>
  )
}
function PreviewCompareTwoOption() {
  return (
    <div className="h-[160px] flex items-center justify-center px-3 gap-2" style={{ background: C.bg }}>
      {[false, true].map((featured, i) => (
        <div key={i} className="flex-1 h-32 flex flex-col justify-between p-2.5"
          style={{ background: C.card, border: featured ? `1.5px solid ${C.main}` : `1px solid ${C.bd}`, borderRadius: 2 }}>
          <div>
            <div className="w-12 h-1.5 rounded mb-1.5" style={{ background: featured ? C.main : C.bd }} />
            <div className="w-8 h-1 rounded" style={{ background: C.muted }} />
          </div>
          <div className="space-y-1">
            {[0, 1, 2].map(j => (<div key={j} className="h-1 rounded" style={{ background: C.muted }} />))}
          </div>
          {featured && <div className="h-4 rounded" style={{ background: C.main, borderRadius: 2 }} />}
        </div>
      ))}
    </div>
  )
}
function PreviewProblemBackground() {
  return (
    <div className="h-[160px] flex flex-col justify-center px-5 gap-3" style={{ background: C.card }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: C.main }}>こんな課題ありませんか？</p>
      {['集客が伸びない', 'CVRが低い', '運用コストが高い'].map((t, i) => (
        <div key={i} className="flex items-center gap-2">
          <span style={{ fontSize: 10, color: '#D32F2F' }}>!</span>
          <span style={{ fontSize: 9, color: C.sub }}>{t}</span>
        </div>
      ))}
    </div>
  )
}
function PreviewMissionStatement() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center gap-2 px-5" style={{ background: '#2C2C2C' }}>
      <p style={{ fontSize: 14, fontWeight: 300, color: '#F4F4F4', textAlign: 'center', lineHeight: 1.5, letterSpacing: '0.05em' }}>デザインの力で<br />社会を変える</p>
      <div style={{ width: 30, height: 1, background: 'rgba(244,244,244,0.2)' }} />
    </div>
  )
}
// Media 追加 Preview（新規2個）────────────────────────────────────────────────
function PreviewImageCaption() {
  return (
    <div className="h-[160px] flex flex-col" style={{ background: '#2C2C2C' }}>
      <div className="flex-1 flex items-center justify-center" style={{ background: C.muted }}>
        <ImageIcon size={22} color={C.hint} />
      </div>
      <div style={{ padding: '8px 12px' }}>
        <div style={{ width: '70%', height: 4, background: 'rgba(244,244,244,0.3)', borderRadius: 1 }} />
      </div>
    </div>
  )
}
function PreviewImageThreeGrid() {
  return (
    <div className="h-[160px] p-3 flex gap-2" style={{ background: C.card }}>
      {[0, 1, 2].map(i => (
        <div key={i} className="flex-1" style={{ background: C.muted, borderRadius: 2 }} />
      ))}
    </div>
  )
}
// Data Preview（新規6個）──────────────────────────────────────────────────────
function PreviewBigNumber() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center gap-1" style={{ background: C.card }}>
      <p style={{ fontSize: 36, fontWeight: 700, color: C.main, lineHeight: 1 }}>98%</p>
      <p style={{ fontSize: 9, color: C.sub }}>顧客満足度</p>
    </div>
  )
}
function PreviewChartBar() {
  return (
    <div className="h-[160px] flex items-end justify-center gap-3 px-5 pb-5 pt-4" style={{ background: C.card }}>
      {[60, 85, 45, 95, 70].map((h, i) => (
        <div key={i} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
          <div style={{ width: '100%', height: h, background: i === 3 ? C.main : C.bd, borderRadius: '2px 2px 0 0' }} />
          <span style={{ fontSize: 7, color: C.sub }}>{'ABCDE'[i]}</span>
        </div>
      ))}
    </div>
  )
}
function PreviewChartDonut() {
  return (
    <div className="h-[160px] flex items-center justify-center" style={{ background: C.card }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: `conic-gradient(${C.main} 0% 65%, ${C.bd} 65% 100%)` }} />
        <div style={{ position: 'absolute', inset: 18, borderRadius: '50%', background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.main }}>65%</span>
        </div>
      </div>
    </div>
  )
}
function PreviewChartLine() {
  return (
    <div className="h-[160px] flex items-center justify-center px-4 py-4" style={{ background: C.card }}>
      <svg viewBox="0 0 120 60" width="120" height="60" style={{ overflow: 'visible' }}>
        <polyline points="0,50 20,40 40,45 60,25 80,30 100,10 120,15" fill="none" stroke={C.main} strokeWidth="2" />
        <line x1="0" y1="55" x2="120" y2="55" stroke={C.bd} strokeWidth="0.5" />
        <line x1="0" y1="0" x2="0" y2="55" stroke={C.bd} strokeWidth="0.5" />
      </svg>
    </div>
  )
}
function PreviewKpiDashboard() {
  return (
    <div className="h-[160px] grid grid-cols-2 gap-1.5 p-3" style={{ background: '#2C2C2C' }}>
      {[['1,200', '導入数', '↑'], ['98%', '継続率', '↑'], ['¥2.4M', '月次売上', '↑'], ['4.8', '満足度', '→']].map(([n, l, t], i) => (
        <div key={i} className="flex flex-col items-center justify-center gap-0.5" style={{ background: '#3C3C3C', borderRadius: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#F4F4F4' }}>{n}</span>
          <span style={{ fontSize: 7, color: '#888' }}>{l}</span>
          <span style={{ fontSize: 8, color: t === '↑' ? '#4CAF50' : '#888' }}>{t}</span>
        </div>
      ))}
    </div>
  )
}
function PreviewCompareTable() {
  return (
    <div className="h-[160px] flex flex-col px-3 py-3 gap-0" style={{ background: C.card }}>
      <div className="flex mb-1">
        <div style={{ flex: 1 }} />
        {['Free', 'Pro', 'Biz'].map(p => (
          <div key={p} style={{ flex: 1, textAlign: 'center', fontSize: 8, fontWeight: 600, color: C.main }}>{p}</div>
        ))}
      </div>
      {['機能A', '機能B', '機能C', '機能D'].map((f, i) => (
        <div key={i} className="flex items-center" style={{ borderTop: `1px solid ${C.muted}`, padding: '4px 0' }}>
          <div style={{ flex: 1, fontSize: 8, color: C.sub }}>{f}</div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 9, color: i < 1 ? '#4CAF50' : C.bd }}>✓</div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 9, color: '#4CAF50' }}>✓</div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 9, color: '#4CAF50' }}>✓</div>
        </div>
      ))}
    </div>
  )
}
// Closing Preview（新規4個）───────────────────────────────────────────────────
function PreviewClosingThankyou() {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center gap-2 px-4" style={{ background: '#2C2C2C' }}>
      <p style={{ fontSize: 18, fontWeight: 300, color: '#F4F4F4', letterSpacing: '0.1em' }}>Thank You</p>
      <p style={{ fontSize: 9, color: 'rgba(244,244,244,0.35)' }}>お問い合わせをお待ちしています</p>
    </div>
  )
}
function PreviewClosingContactCard() {
  return (
    <div className="h-[160px] flex flex-col justify-center px-5 gap-2" style={{ background: C.card }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: C.main }}>お問い合わせ</p>
      {['✉ info@example.com', '☎ 03-1234-5678', '📍 東京都千代田区'].map((t, i) => (
        <p key={i} style={{ fontSize: 9, color: C.sub }}>{t}</p>
      ))}
    </div>
  )
}
function PreviewSpeakerBio() {
  return (
    <div className="h-[160px] flex items-center px-4 gap-3" style={{ background: C.card }}>
      <div style={{ width: 56, height: 56, background: C.muted, borderRadius: '50%', flexShrink: 0 }} />
      <div className="flex flex-col gap-1.5">
        <div style={{ width: 50, height: 6, background: C.main, borderRadius: 1 }} />
        <div style={{ width: 70, height: 4, background: C.bd, borderRadius: 1 }} />
        <div style={{ width: 60, height: 4, background: C.muted, borderRadius: 1 }} />
      </div>
    </div>
  )
}
function PreviewAgendaToc() {
  return (
    <div className="h-[160px] flex flex-col justify-center px-5 gap-2" style={{ background: '#2C2C2C' }}>
      {[['01', 'はじめに', '5 min'], ['02', 'サービス紹介', '15 min'], ['03', 'Q&A', '10 min']].map(([n, t, d], i) => (
        <div key={i} className="flex items-center gap-2">
          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(244,244,244,0.3)', fontFamily: 'monospace' }}>{n}</span>
          <span style={{ fontSize: 10, color: '#F4F4F4', flex: 1 }}>{t}</span>
          <span style={{ fontSize: 8, color: 'rgba(244,244,244,0.3)' }}>{d}</span>
        </div>
      ))}
    </div>
  )
}

// ── Animation Card Previews (interactive) ────────────────────────────────
function PlayBtn({ playing, onClick, dark }: { playing: boolean; onClick: () => void; dark?: boolean }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      style={{
        position: 'absolute', bottom: 8, right: 8,
        padding: '3px 9px', fontSize: 10, fontWeight: 600,
        background: 'transparent',
        color: dark ? 'rgba(255,255,255,0.6)' : C.sub,
        border: `1px solid ${dark ? 'rgba(255,255,255,0.25)' : C.bd}`,
        borderRadius: 2, cursor: playing ? 'default' : 'pointer',
      }}
    >
      {playing ? '再生中...' : '▶ 再生'}
    </button>
  )
}

function PreviewFadeInUp() {
  const [playing, setPlaying] = useState(false)
  const play = () => { if (playing) return; setPlaying(true); setTimeout(() => setPlaying(false), 1100) }
  return (
    <div className="h-[160px] relative flex flex-col items-center justify-center gap-3 px-6" style={{ background: C.card }}>
      <div style={{ width: '60%', height: 40, background: '#EBEBEB', borderRadius: 2, opacity: playing ? 1 : 0.25, transform: playing ? 'none' : 'translateY(20px)', transition: playing ? 'opacity 0.7s ease, transform 0.7s ease' : 'none' }} />
      <div className="flex flex-col items-center gap-0.5" style={{ opacity: playing ? 0 : 1, transition: 'opacity 0.3s' }}>
        <span style={{ fontSize: 13, color: C.hint }}>↑</span>
        <span style={{ fontSize: 9, letterSpacing: '0.2em', color: C.hint }}>SCROLL</span>
      </div>
      <PlayBtn playing={playing} onClick={play} />
    </div>
  )
}
function PreviewFadeIn() {
  const [playing, setPlaying] = useState(false)
  const play = () => { if (playing) return; setPlaying(true); setTimeout(() => setPlaying(false), 1100) }
  return (
    <div className="h-[160px] relative flex flex-col items-center justify-center gap-3 px-6" style={{ background: C.card }}>
      <div style={{ width: '70%', height: 26, background: '#EBEBEB', borderRadius: 2, opacity: playing ? 1 : 0.15, transition: playing ? 'opacity 0.7s ease 0.1s' : 'none' }} />
      <div style={{ width: '70%', height: 26, background: '#EBEBEB', borderRadius: 2, opacity: playing ? 1 : 0.15, transition: playing ? 'opacity 0.7s ease 0.25s' : 'none' }} />
      <PlayBtn playing={playing} onClick={play} />
    </div>
  )
}
function PreviewSlideInLeft() {
  const [playing, setPlaying] = useState(false)
  const play = () => { if (playing) return; setPlaying(true); setTimeout(() => setPlaying(false), 1000) }
  return (
    <div className="h-[160px] relative flex items-center justify-center gap-2 px-4" style={{ background: C.card }}>
      <span style={{ fontSize: 13, color: C.hint, opacity: playing ? 0 : 1, transition: 'opacity 0.3s' }}>→</span>
      <div style={{ width: '50%', height: 32, background: C.main, borderRadius: 2, opacity: playing ? 1 : 0, transform: playing ? 'none' : 'translateX(-40px)', transition: playing ? 'opacity 0.6s ease, transform 0.6s ease' : 'none' }} />
      <PlayBtn playing={playing} onClick={play} />
    </div>
  )
}
function PreviewSlideInRight() {
  const [playing, setPlaying] = useState(false)
  const play = () => { if (playing) return; setPlaying(true); setTimeout(() => setPlaying(false), 1000) }
  return (
    <div className="h-[160px] relative flex items-center justify-center gap-2 px-4" style={{ background: C.card }}>
      <div style={{ width: '50%', height: 32, background: C.main, borderRadius: 2, opacity: playing ? 1 : 0, transform: playing ? 'none' : 'translateX(40px)', transition: playing ? 'opacity 0.6s ease, transform 0.6s ease' : 'none' }} />
      <span style={{ fontSize: 13, color: C.hint, opacity: playing ? 0 : 1, transition: 'opacity 0.3s' }}>←</span>
      <PlayBtn playing={playing} onClick={play} />
    </div>
  )
}
function PreviewTextFadeIn() {
  const [playing, setPlaying] = useState(false)
  const play = () => { if (playing) return; setPlaying(true); setTimeout(() => setPlaying(false), 1100) }
  return (
    <div className="h-[160px] relative flex flex-col items-center justify-center gap-3 px-6" style={{ background: C.card }}>
      <div style={{ width: '80%', height: 12, background: C.main, borderRadius: 1, opacity: playing ? 1 : 0, transition: playing ? 'opacity 0.5s ease 0s' : 'none' }} />
      <div style={{ width: '80%', height: 12, background: C.main, borderRadius: 1, opacity: playing ? 1 : 0, transition: playing ? 'opacity 0.5s ease 0.15s' : 'none' }} />
      <PlayBtn playing={playing} onClick={play} />
    </div>
  )
}
function PreviewTextSlideUp() {
  const [playing, setPlaying] = useState(false)
  const play = () => { if (playing) return; setPlaying(true); setTimeout(() => setPlaying(false), 1100) }
  return (
    <div className="h-[160px] relative flex flex-col items-center justify-center gap-2.5 px-6" style={{ background: C.card }}>
      {[0, 0.12].map((delay, i) => (
        <div key={i} style={{ overflow: 'hidden', width: '75%', height: 16 }}>
          <div style={{ height: 12, background: C.main, borderRadius: 1, marginTop: 2, transform: playing ? 'translateY(0)' : 'translateY(100%)', transition: playing ? `transform 0.6s ease ${delay}s` : 'none' }} />
        </div>
      ))}
      <PlayBtn playing={playing} onClick={play} />
    </div>
  )
}
function PreviewTextStagger() {
  const [playing, setPlaying] = useState(false)
  const play = () => { if (playing) return; setPlaying(true); setTimeout(() => setPlaying(false), 1200) }
  return (
    <div className="h-[160px] relative flex flex-col items-start justify-center gap-2.5 px-6" style={{ background: C.card }}>
      {(['0.1s', '0.2s', '0.3s'] as const).map((delay, i) => (
        <div key={i} className="flex items-center gap-2 w-full">
          <div style={{ flex: 1, height: 10, background: C.main, borderRadius: 1, opacity: playing ? 1 : 0, transition: playing ? `opacity 0.5s ease ${delay}` : 'none' }} />
          <span style={{ fontSize: 8, color: C.hint, whiteSpace: 'nowrap' }}>{delay}</span>
        </div>
      ))}
      <PlayBtn playing={playing} onClick={play} />
    </div>
  )
}
function PreviewTextTypewriter() {
  const fullText = 'Hello, World.'
  const [text, setText] = useState('')
  const [playing, setPlaying] = useState(false)
  const play = () => {
    if (playing) return
    setText(''); setPlaying(true)
    let i = 0
    const timer = setInterval(() => {
      i++; setText(fullText.slice(0, i))
      if (i >= fullText.length) { clearInterval(timer); setTimeout(() => { setPlaying(false); setText('') }, 1000) }
    }, 80)
  }
  return (
    <div className="h-[160px] relative flex items-center justify-center px-4" style={{ background: C.card }}>
      <span style={{ fontFamily: 'monospace', fontSize: 13, color: C.main, letterSpacing: '0.05em' }}>
        {playing ? text : fullText}
        {playing && <span className="lplus-cursor-blink">|</span>}
      </span>
      <PlayBtn playing={playing} onClick={play} />
    </div>
  )
}
function PreviewBtnHoverFill() {
  const [playing, setPlaying] = useState(false)
  const play = () => { if (playing) return; setPlaying(true); setTimeout(() => setPlaying(false), 1000) }
  return (
    <div className="h-[160px] relative flex items-center justify-center px-4" style={{ background: C.card }}>
      <div style={{ padding: '7px 18px', border: `1px solid ${C.main}`, borderRadius: 2, fontSize: 11, fontWeight: 600, color: playing ? '#FFFFFF' : C.main, background: playing ? C.main : 'transparent', transition: 'background 0.3s, color 0.3s', cursor: 'default' }}>ボタン</div>
      <PlayBtn playing={playing} onClick={play} />
    </div>
  )
}
function PreviewBtnHoverSlide() {
  const [playing, setPlaying] = useState(false)
  const play = () => { if (playing) return; setPlaying(true); setTimeout(() => setPlaying(false), 1000) }
  return (
    <div className="h-[160px] relative flex items-center justify-center px-6" style={{ background: C.card }}>
      <div style={{ position: 'relative', width: '65%', height: 36, border: `1px solid ${C.main}`, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: C.main, transform: playing ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: playing ? 'transform 0.4s ease' : 'none' }} />
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: playing ? '#FFFFFF' : C.main, zIndex: 1, transition: 'color 0.4s ease' }}>Button</span>
      </div>
      <PlayBtn playing={playing} onClick={play} />
    </div>
  )
}
function PreviewParallax() {
  const [playing, setPlaying] = useState(false)
  const play = () => { if (playing) return; setPlaying(true); setTimeout(() => setPlaying(false), 4500) }
  return (
    <div className="h-[160px] relative flex items-center justify-center overflow-hidden" style={{ background: '#2C2C2C' }}>
      <div style={{ position: 'absolute', inset: 0, animation: playing ? 'lplus-parallax-bg 2s ease-in-out infinite alternate' : 'none', background: '#2C2C2C' }} />
      <div style={{ width: '50%', height: 60, background: '#FFFFFF', borderRadius: 2, position: 'relative', animation: playing ? 'lplus-parallax-fg 2s ease-in-out infinite alternate' : 'none' }} />
      <span style={{ position: 'absolute', right: 8, bottom: 8, fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>×0.5 speed</span>
      <PlayBtn playing={playing} onClick={play} dark />
    </div>
  )
}
function PreviewCounterUp() {
  const [count, setCount] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const target = 1200
  const play = () => {
    if (playing) return
    setCount(0); setPlaying(true)
    const start = performance.now(); const dur = 1500
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * target))
      if (p < 1) requestAnimationFrame(tick)
      else { setCount(target); setTimeout(() => setPlaying(false), 300) }
    }
    requestAnimationFrame(tick)
  }
  return (
    <div className="h-[160px] relative flex flex-col items-center justify-center gap-2 px-4" style={{ background: '#F4F4F4' }}>
      {count === null ? (
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 11, color: C.hint }}>0 →</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.main }}>1,200+</span>
        </div>
      ) : (
        <span style={{ fontSize: 28, fontWeight: 700, color: C.main, fontVariantNumeric: 'tabular-nums' }}>
          {count.toLocaleString()}{count >= target ? '+' : ''}
        </span>
      )}
      <span style={{ fontSize: 9, color: C.sub, letterSpacing: '0.1em' }}>導入企業数</span>
      <PlayBtn playing={playing} onClick={play} />
    </div>
  )
}

const CARD_PREVIEW_MAP: Record<PartId, React.FC> = {
  'hero-basic': PreviewHeroBasic,
  features: PreviewFeatures,
  cta: PreviewCta,
  testimonial: PreviewTestimonial,
  faq: PreviewFaq,
  logos: PreviewLogos,
  pricing: PreviewPricing,
  stats: PreviewStats,
  team: PreviewTeam,
  blog: PreviewBlog,
  newsletter: PreviewNewsletter,
  steps: PreviewSteps,
  contact: PreviewContact,
  footer: PreviewFooter,
  'text-2col': PreviewText2col,
  'features-4col-image': PreviewFeatures4colImage,
  'team-horizontal': PreviewTeamHorizontal,
  'gallery-slider': PreviewGallerySlider,
  'features-icon-circle': PreviewFeaturesIconCircle,
  'testimonial-slider': PreviewTestimonialSlider,
  'steps-5': PreviewSteps5,
  map: PreviewMap,
  'services-labeled': PreviewServicesLabeled,
  'mission-split': PreviewMissionSplit,
  'hero-center': PreviewHeroCenter,
  'hero-split': PreviewHeroSplit,
  'hero-dark-split': PreviewHeroDarkSplit,
  'hero-minimal': PreviewHeroMinimal,
  'hero-with-video': PreviewHeroWithVideo,
  'hero-slider': PreviewHeroSlider,
  'image-fullwidth': PreviewImageFullwidth,
  'image-gallery': PreviewImageGallery,
  'image-text': PreviewImageText,
  'image-text-right': PreviewImageTextRight,
  'video-embed': PreviewVideoEmbed,
  'btn-outline': PreviewBtnOutline,
  'btn-filled': PreviewBtnFilled,
  'btn-ghost': PreviewBtnGhost,
  'btn-rounded': PreviewBtnRounded,
  'btn-icon': PreviewBtnIcon,
  'btn-cta-lg': PreviewBtnCtaLg,
  // Animation
  'fade-in-up': PreviewFadeInUp,
  'fade-in': PreviewFadeIn,
  'slide-in-left': PreviewSlideInLeft,
  'slide-in-right': PreviewSlideInRight,
  'text-fade-in': PreviewTextFadeIn,
  'text-slide-up': PreviewTextSlideUp,
  'text-stagger': PreviewTextStagger,
  'text-typewriter': PreviewTextTypewriter,
  'btn-hover-fill': PreviewBtnHoverFill,
  'btn-hover-slide': PreviewBtnHoverSlide,
  parallax: PreviewParallax,
  'counter-up': PreviewCounterUp,
  // Area 追加
  'bullet-points': PreviewBulletPoints,
  'icon-cards-2x2': PreviewIconCards2x2,
  'timeline-steps': PreviewTimelineSteps,
  'quote-fullscreen': PreviewQuoteFullscreen,
  'quote-side-accent': PreviewQuoteSideAccent,
  'before-after': PreviewBeforeAfter,
  'compare-two-option': PreviewCompareTwoOption,
  'problem-background': PreviewProblemBackground,
  'mission-statement': PreviewMissionStatement,
  // Media 追加
  'image-caption': PreviewImageCaption,
  'image-three-grid': PreviewImageThreeGrid,
  // Data
  'big-number': PreviewBigNumber,
  'chart-bar': PreviewChartBar,
  'chart-donut': PreviewChartDonut,
  'chart-line': PreviewChartLine,
  'kpi-dashboard': PreviewKpiDashboard,
  'compare-table': PreviewCompareTable,
  // Closing
  'closing-thankyou': PreviewClosingThankyou,
  'closing-contact-card': PreviewClosingContactCard,
  'speaker-bio': PreviewSpeakerBio,
  'agenda-toc': PreviewAgendaToc,
}

// ── Section render helpers ────────────────────────────────────────────────
function getBgStyle(bgColor: PartOptions['bgColor']) {
  if (bgColor === 'dark')  return { bg: '#1A1A1A', color: '#F4F4F4', subColor: '#AAAAAA', hintColor: 'rgba(244,244,244,0.35)', bdColor: 'rgba(244,244,244,0.12)', cardBg: '#2C2C2C', mutedBg: '#3C3C3C' }
  if (bgColor === 'light') return { bg: '#F4F4F4', color: '#1A1A1A', subColor: '#888888', hintColor: '#BBBBBB',                  bdColor: '#D4D4D4',                  cardBg: '#FFFFFF',  mutedBg: '#E2E2E2'  }
  return                          { bg: '#FFFFFF',  color: '#1A1A1A', subColor: '#888888', hintColor: '#BBBBBB',                  bdColor: '#E2E2E2',                  cardBg: '#F4F4F4',  mutedBg: '#EBEBEB'  }
}
function getSpacingPx(spacing: PartOptions['spacing']) {
  return { sm: 32, md: 64, lg: 96 }[spacing]
}
function renderButton(buttonStyle: PartOptions['buttonStyle'], color: string): React.ReactNode {
  if (buttonStyle === 'none') return null
  const base: React.CSSProperties = { alignSelf: 'flex-start', fontSize: 13, cursor: 'pointer', borderRadius: 2 }
  switch (buttonStyle) {
    case 'filled':  return <button style={{ ...base, background: color, color: color === '#F4F4F4' ? '#1A1A1A' : '#F4F4F4', border: 'none', padding: '10px 24px' }}>詳しく見る</button>
    case 'rounded': return <button style={{ ...base, border: `1px solid ${color}`, color, background: 'transparent', padding: '10px 24px', borderRadius: 99 }}>詳しく見る</button>
    case 'ghost':   return <button style={{ ...base, background: 'transparent', border: 'none', color, display: 'flex', alignItems: 'center', gap: 6 }}>詳しく見る <ArrowRight size={13} /></button>
    case 'icon':    return <button style={{ ...base, border: `1px solid ${color}`, color, background: 'transparent', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8 }}><ArrowRight size={13} />はじめる</button>
    default:        return <button style={{ ...base, border: `1px solid ${color}`, color, background: 'transparent', padding: '10px 24px' }}>詳しく見る →</button>
  }
}
function getGridCols(columns: number): string { return `repeat(${columns}, 1fr)` }

// ── LP Section Previews (modal right panel) ──────────────────────────────
function SectionHeroBasic({ options }: { options: PartOptions }) {
  const { bg, color, subColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex flex-col items-center justify-center text-center gap-6 px-8" style={{ background: bg, minHeight: 440, paddingTop: py, paddingBottom: py }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.35, maxWidth: 480 }}>あなたの事業を、次のステージへ</h1>
      <p style={{ fontSize: 13, color: subColor, maxWidth: 360, lineHeight: 1.8 }}>サービスの説明テキストがここに入ります。</p>
      {renderButton(options.buttonStyle, color)}
    </section>
  )
}
function SectionFeatures({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor, cardBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>FEATURES</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>選ばれる3つの理由</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: getGridCols(options.columns), gap: 20, maxWidth: 960, margin: '0 auto' }}>
        {([
          [Zap,'高速パフォーマンス','ページ読み込みが圧倒的に速く、ユーザー体験を向上させます。'],
          [Shield,'安心のセキュリティ','エンタープライズ級のセキュリティで大切なデータを守ります。'],
          [Star,'高い顧客満足度','業界平均4.8の満足度。導入後の継続率は96%です。'],
          [Zap,'サポート体制','24時間対応のサポートで安心してご利用いただけます。'],
        ] as const).slice(0, options.columns).map(([Icon, title, desc], i) => (
          <div key={i} className="p-6 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${bdColor}`, borderRadius: 2 }}>
            <Icon size={20} color={subColor} />
            <p style={{ fontSize: 13, fontWeight: 600, color }}>{title}</p>
            <p style={{ fontSize: 11, color: subColor, lineHeight: 1.8 }}>{desc}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionCta({ options }: { options: PartOptions }) {
  const { bg, color, subColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex flex-col items-center justify-center text-center gap-5 px-8" style={{ background: bg, minHeight: 200, paddingTop: py, paddingBottom: py }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color }}>今すぐ無料でスタート</h2>
      <p style={{ fontSize: 12, color: subColor }}>クレジットカード不要。いつでも解約できます。</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionTestimonial({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor, cardBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>TESTIMONIALS</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>お客様の声</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: getGridCols(options.columns), gap: 20, maxWidth: 960, margin: '0 auto' }}>
        {[['山田 太郎','株式会社A社','導入後3ヶ月で問い合わせが2倍に増えました。'],['鈴木 花子','合同会社B社','ノーコードなのにここまで自由度が高いとは。'],['佐藤 次郎','株式会社C社','圧倒的なコスパで大変助かっています。'],['田中 一郎','株式会社D社','サポートが非常に丁寧で安心できます。']].slice(0, options.columns).map(([n,co,t], i) => (
          <div key={i} className="p-5 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${bdColor}`, borderRadius: 2 }}>
            <MessageSquare size={16} color={hintColor} />
            <p style={{ fontSize: 9, color: subColor }}>★★★★★</p>
            <p style={{ fontSize: 11, color: subColor, lineHeight: 1.9, flex: 1 }}>"{t}"</p>
            <div style={{ borderTop: `1px solid ${bdColor}`, paddingTop: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color }}>{n}</p>
              <p style={{ fontSize: 10, color: hintColor, marginTop: 2 }}>{co}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
function SectionFaq({ options }: { options: PartOptions }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const { bg, color, subColor, hintColor, bdColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  const faqs = [
    { q: '無料プランはありますか？', a: 'はい、基本機能を無料でご利用いただけます。' },
    { q: '解約はいつでもできますか？', a: 'はい、いつでも解約できます。違約金などは一切発生しません。' },
    { q: 'サポートはありますか？', a: 'チャットサポートと日本語のヘルプドキュメントをご用意しています。' },
    { q: '独自ドメインは使えますか？', a: 'はい、スタンダードプラン以上でご利用いただけます。' },
    { q: 'データのエクスポートはできますか？', a: 'CSV・JSON形式でいつでもエクスポートできます。' },
  ]
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor }}>FAQ</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>よくある質問</h2>
      </div>
      <div className="max-w-2xl mx-auto" style={{ borderTop: `1px solid ${bdColor}` }}>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${bdColor}` }}>
            <button className="w-full flex justify-between text-left gap-4" style={{ padding: '16px 0', background: 'transparent', border: 'none' }} onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              <span style={{ fontSize: 13, fontWeight: 600, color }}>Q. {f.q}</span>
              <span style={{ color: subColor, fontSize: 18, flexShrink: 0 }}>{openIdx === i ? '−' : '+'}</span>
            </button>
            {openIdx === i && <p style={{ fontSize: 13, color: subColor, paddingBottom: 16, lineHeight: 1.8 }}>A. {f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
function SectionLogos({ options }: { options: PartOptions }) {
  const { bg, hintColor, bdColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-8 text-center" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 32 }}>PARTNERS</p>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {[100, 80, 120, 90, 110, 75].map((w, i) => (<div key={i} style={{ width: w, height: 28, background: bdColor, borderRadius: 2 }} />))}
      </div>
    </section>
  )
}
function SectionPricing({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor, cardBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  const plans = [{name:'Starter',price:'無料',featured:false},{name:'Pro',price:'¥2,980/月',featured:true},{name:'Enterprise',price:'要相談',featured:false},{name:'Team',price:'¥9,800/月',featured:false}]
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>PRICING</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>料金プラン</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: getGridCols(options.columns), gap: 20, maxWidth: 960, margin: '0 auto' }}>
        {plans.slice(0, options.columns).map((p,i) => (
          <div key={i} className="p-6 flex flex-col gap-4" style={{ background: p.featured ? cardBg : bg, border: p.featured ? `1.5px solid ${color}` : `1px solid ${bdColor}`, borderRadius: 2 }}>
            {p.featured && <p style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: '0.1em' }}>RECOMMENDED</p>}
            <p style={{ fontSize: 14, fontWeight: 600, color }}>{p.name}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color }}>{p.price}</p>
            <div className="flex flex-col gap-2">
              {['機能A','機能B','機能C'].map(f => (<p key={f} style={{ fontSize: 11, color: subColor }}>✓ {f}</p>))}
            </div>
            <button style={{ padding: '8px 0', background: p.featured ? color : 'transparent', border: `1px solid ${color}`, borderRadius: 2, fontSize: 12, color: p.featured ? bg : color, marginTop: 'auto', cursor: 'pointer' }}>選択する</button>
          </div>
        ))}
      </div>
    </section>
  )
}
function SectionStats({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-8" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, textAlign: 'center', marginBottom: 40 }}>NUMBERS</p>
      <div className="grid grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
        {[['1,200+','導入企業数'],['98%','継続率'],['4.8','顧客満足度'],['3×','成果向上']].map(([n,l],i) => (
          <div key={i}>
            <p style={{ fontSize: 36, fontWeight: 700, color, lineHeight: 1 }}>{n}</p>
            <p style={{ fontSize: 12, color: subColor, marginTop: 8 }}>{l}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
function SectionTeam({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  const members = [['山田 太郎','CEO'],['鈴木 花子','CTO'],['佐藤 次郎','Design'],['田中 次郎','Marketing']]
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>TEAM</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>チームメンバー</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: getGridCols(options.columns), gap: 24, maxWidth: 960, margin: '0 auto' }}>
        {members.slice(0, options.columns).map(([n,r],i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div style={{ width: 80, height: 80, background: mutedBg, borderRadius: 2 }} />
            <div className="text-center">
              <p style={{ fontSize: 14, fontWeight: 600, color }}>{n}</p>
              <p style={{ fontSize: 11, color: subColor, marginTop: 2 }}>{r}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionBlog({ options }: { options: PartOptions }) {
  const { bg, color, hintColor, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>BLOG</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>最新の記事</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: getGridCols(options.columns), gap: 20, maxWidth: 960, margin: '0 auto' }}>
        {Array.from({ length: options.columns }).map((_, i) => (
          <div key={i}>
            <div style={{ height: 140, background: mutedBg, borderRadius: 2, marginBottom: 12 }} />
            <p style={{ fontSize: 9, color: hintColor, marginBottom: 6 }}>2026.04.01</p>
            <p style={{ fontSize: 13, fontWeight: 600, color, lineHeight: 1.5 }}>記事タイトルがここに入ります</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionNewsletter({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor, cardBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-8 text-center" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 16 }}>NEWSLETTER</p>
      <h2 style={{ fontSize: 22, fontWeight: 700, color, marginBottom: 8 }}>最新情報を受け取る</h2>
      <p style={{ fontSize: 13, color: subColor, marginBottom: 24 }}>週1回のニュースレターで最新情報をお届けします。</p>
      <div className="flex justify-center gap-3 max-w-sm mx-auto">
        <input style={{ flex: 1, padding: '10px 14px', border: `1px solid ${bdColor}`, borderRadius: 2, fontSize: 13, background: cardBg, color }} placeholder="メールアドレス" readOnly />
        <button style={{ padding: '10px 20px', background: color, color: bg, border: 'none', borderRadius: 2, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>登録する</button>
      </div>
    </section>
  )
}
function SectionSteps({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>HOW IT WORKS</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>導入ステップ</h2>
      </div>
      <div className="flex items-start max-w-3xl mx-auto">
        {[['01','アカウント登録','メールアドレスで簡単登録。'],['02','設定する','ガイドに沿って設定。'],['03','公開する','ワンクリックで公開。']].map(([n,t,d],i) => (
          <div key={i} className="flex items-start flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center justify-center mb-4" style={{ width: 36, height: 36, border: `1px solid ${color}`, borderRadius: '50%', fontSize: 11, fontWeight: 700, color }}>{n}</div>
              <p style={{ fontSize: 13, fontWeight: 600, color, textAlign: 'center', marginBottom: 6 }}>{t}</p>
              <p style={{ fontSize: 11, color: subColor, textAlign: 'center', lineHeight: 1.7 }}>{d}</p>
            </div>
            {i < 2 && <div style={{ width: 40, height: 1, background: bdColor, marginTop: 18, flexShrink: 0 }} />}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10">{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionContact({ options }: { options: PartOptions }) {
  const { bg, color, hintColor, bdColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>CONTACT</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>お問い合わせ</h2>
      </div>
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        {['お名前','メールアドレス','メッセージ'].map((l,i) => (
          <div key={i} style={{ borderBottom: `1px solid ${bdColor}`, paddingBottom: 8 }}>
            <p style={{ fontSize: 10, color: hintColor, marginBottom: 8 }}>{l}</p>
            <div style={{ height: i === 2 ? 80 : 24 }} />
          </div>
        ))}
        <div className="flex justify-end">{renderButton(options.buttonStyle, color)}</div>
      </div>
    </section>
  )
}
function SectionFooter({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="flex justify-between max-w-4xl mx-auto mb-10">
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color, marginBottom: 8 }}>LOGO</p>
          <p style={{ fontSize: 12, color: subColor, lineHeight: 1.7 }}>キャッチコピーがここに入ります</p>
        </div>
        <div className="flex gap-12">
          {[['Company','About','Service','Works'],['Support','FAQ','Contact','Blog']].map((col, ci) => (
            <div key={ci}>
              <p style={{ fontSize: 10, color: hintColor, marginBottom: 10, letterSpacing: '0.1em' }}>{col[0]}</p>
              {col.slice(1).map(l => (<p key={l} style={{ fontSize: 12, color: subColor, marginBottom: 6 }}>{l}</p>))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${bdColor}`, paddingTop: 20 }}>
        <p style={{ fontSize: 11, color: subColor }}>© 2026 Company Name. All rights reserved.</p>
      </div>
    </section>
  )
}
// Hero sections ─────────────────────────────────────────────────────────────
function SectionHeroCenter({ options }: { options: PartOptions }) {
  const { bg, color, subColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex flex-col items-center justify-center text-center gap-6 px-8" style={{ background: bg, minHeight: 440, paddingTop: py, paddingBottom: py }}>
      <h1 style={{ fontSize: 30, fontWeight: 700, color, lineHeight: 1.3, maxWidth: 480 }}>あなたの事業を、次のステージへ</h1>
      <p style={{ fontSize: 13, color: subColor, maxWidth: 360, lineHeight: 1.8 }}>サービスの説明テキストがここに入ります。</p>
      {renderButton(options.buttonStyle, color)}
    </section>
  )
}
function SectionHeroSplit({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex" style={{ background: bg, minHeight: 440 }}>
      <div className="flex-1 flex flex-col justify-center px-12 gap-6" style={{ paddingTop: py, paddingBottom: py }}>
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor }}>YOUR TAGLINE</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.3 }}>あなたの事業を<br />次のステージへ</h1>
        <p style={{ fontSize: 13, color: subColor, lineHeight: 1.8 }}>サービスの説明テキスト</p>
        {renderButton(options.buttonStyle, color)}
      </div>
      <div className="flex-1" style={{ background: mutedBg, minHeight: 440 }} />
    </section>
  )
}
function SectionHeroDarkSplit({ options }: { options: PartOptions }) {
  const { bg, color, subColor, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex" style={{ background: bg, minHeight: 440 }}>
      <div className="flex-1 flex flex-col justify-center px-12 gap-6" style={{ paddingTop: py, paddingBottom: py }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.3 }}>あなたの事業を<br />次のステージへ</h1>
        <p style={{ fontSize: 13, color: subColor, lineHeight: 1.8 }}>サービスの説明テキスト</p>
        {renderButton(options.buttonStyle, color)}
      </div>
      <div className="flex-1" style={{ background: mutedBg, minHeight: 440 }} />
    </section>
  )
}
function SectionHeroMinimal({ options }: { options: PartOptions }) {
  const { bg, color, subColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex flex-col justify-center px-12 gap-8" style={{ background: bg, minHeight: 440, paddingTop: py, paddingBottom: py }}>
      <h1 style={{ fontSize: 48, fontWeight: 300, color, lineHeight: 1.15, letterSpacing: '-0.03em' }}>あなたの事業を、<br />次のステージへ。</h1>
      {renderButton(options.buttonStyle, subColor)}
    </section>
  )
}
function SectionHeroWithVideo({ options }: { options: PartOptions }) {
  const { bg, color, subColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex flex-col items-center justify-center text-center gap-6 px-8" style={{ background: bg, minHeight: 440, paddingTop: py, paddingBottom: py }}>
      <div className="flex items-center justify-center" style={{ width: 56, height: 56, border: `2px solid ${subColor}`, borderRadius: '50%' }}>
        <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: `18px solid ${color}`, marginLeft: 4 }} />
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.3 }}>あなたの事業を、次のステージへ</h1>
      {renderButton(options.buttonStyle, color)}
    </section>
  )
}
// Media sections ────────────────────────────────────────────────────────────
function SectionImageFullwidth({ options }: { options: PartOptions }) {
  const { mutedBg, hintColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex items-center justify-center" style={{ background: mutedBg, minHeight: 300, paddingTop: py, paddingBottom: py }}>
      <div className="flex flex-col items-center gap-3">
        <ImageIcon size={36} color={hintColor} />
        <p style={{ fontSize: 12, color: hintColor }}>フル幅画像エリア (16:9)</p>
      </div>
    </section>
  )
}
function SectionImageGallery({ options }: { options: PartOptions }) {
  const { bg, color, hintColor, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>GALLERY</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>ギャラリー</h2>
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (<div key={i} style={{ aspectRatio: '1', background: mutedBg, borderRadius: 2 }} />))}
      </div>
    </section>
  )
}
function SectionImageText({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex" style={{ background: bg, minHeight: 360 }}>
      <div className="flex-1" style={{ background: mutedBg }} />
      <div className="flex-1 flex flex-col justify-center px-12 gap-5" style={{ paddingTop: py, paddingBottom: py }}>
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor }}>ABOUT</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.4 }}>セクションタイトル</h2>
        <p style={{ fontSize: 13, color: subColor, lineHeight: 1.9 }}>サービスの説明テキストがここに入ります。詳細な内容を伝える段落です。</p>
        {renderButton(options.buttonStyle, color)}
      </div>
    </section>
  )
}
function SectionImageTextRight({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex" style={{ background: bg, minHeight: 360 }}>
      <div className="flex-1 flex flex-col justify-center px-12 gap-5" style={{ paddingTop: py, paddingBottom: py }}>
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor }}>ABOUT</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.4 }}>セクションタイトル</h2>
        <p style={{ fontSize: 13, color: subColor, lineHeight: 1.9 }}>サービスの説明テキストがここに入ります。詳細な内容を伝える段落です。</p>
        {renderButton(options.buttonStyle, color)}
      </div>
      <div className="flex-1 flex items-center justify-center" style={{ background: mutedBg }}>
        <ImageIcon size={32} color={hintColor} />
      </div>
    </section>
  )
}
function SectionVideoEmbed({ options }: { options: PartOptions }) {
  const { bg, subColor, hintColor, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex items-center justify-center px-8" style={{ background: bg, minHeight: 320, paddingTop: py, paddingBottom: py }}>
      <div style={{ width: '100%', maxWidth: 560, aspectRatio: '16/9', background: mutedBg, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div className="flex items-center justify-center" style={{ width: 56, height: 56, border: `2px solid ${subColor}`, borderRadius: '50%' }}>
          <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: `18px solid ${subColor}`, marginLeft: 4 }} />
        </div>
        <p style={{ fontSize: 12, color: hintColor }}>動画タイトルが入ります</p>
      </div>
    </section>
  )
}
// Button showcase sections ───────────────────────────────────────────────────
function ButtonShowcase({ options, children, label, desc }: { options: PartOptions; children: React.ReactNode; label: string; desc: string }) {
  const { bg, color, subColor, hintColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10 flex flex-col items-center gap-6" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor }}>BUTTON STYLE</p>
      <h2 style={{ fontSize: 18, fontWeight: 600, color }}>{label}</h2>
      <p style={{ fontSize: 12, color: subColor }}>{desc}</p>
      {children}
    </section>
  )
}
function SectionBtnOutline({ options }: { options: PartOptions }) {
  const { color } = getBgStyle(options.bgColor)
  return <ButtonShowcase options={options} label="アウトラインボタン" desc="枠線のみ・背景透明"><button style={{ padding: '12px 32px', border: `1px solid ${color}`, borderRadius: 2, fontSize: 14, color, background: 'transparent', cursor: 'pointer' }}>詳しく見る</button></ButtonShowcase>
}
function SectionBtnFilled({ options }: { options: PartOptions }) {
  const { bg, color } = getBgStyle(options.bgColor)
  return <ButtonShowcase options={options} label="フィルドボタン" desc="黒背景・白テキスト"><button style={{ padding: '12px 32px', background: color, borderRadius: 2, fontSize: 14, color: bg, border: 'none', cursor: 'pointer' }}>詳しく見る</button></ButtonShowcase>
}
function SectionBtnGhost({ options }: { options: PartOptions }) {
  const { color } = getBgStyle(options.bgColor)
  return <ButtonShowcase options={options} label="ゴーストボタン" desc="テキスト＋矢印のみ"><button style={{ fontSize: 14, color, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>詳しく見る <ArrowRight size={14} /></button></ButtonShowcase>
}
function SectionBtnRounded({ options }: { options: PartOptions }) {
  const { color } = getBgStyle(options.bgColor)
  return <ButtonShowcase options={options} label="丸ボタン" desc="border-radius 99px"><button style={{ padding: '12px 36px', border: `1px solid ${color}`, borderRadius: 99, fontSize: 14, color, background: 'transparent', cursor: 'pointer' }}>詳しく見る</button></ButtonShowcase>
}
function SectionBtnIcon({ options }: { options: PartOptions }) {
  const { color } = getBgStyle(options.bgColor)
  return <ButtonShowcase options={options} label="アイコン付きボタン" desc="アイコン＋テキスト"><button style={{ padding: '12px 28px', border: `1px solid ${color}`, borderRadius: 2, fontSize: 14, color, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}><ArrowRight size={14} />はじめる</button></ButtonShowcase>
}
function SectionBtnCtaLg({ options }: { options: PartOptions }) {
  const { bg, color } = getBgStyle(options.bgColor)
  return <ButtonShowcase options={options} label="大CTAボタン" desc="フル幅の大きなCTAボタン"><button style={{ width: '90%', padding: '18px 0', background: color, border: 'none', borderRadius: 2, fontSize: 16, color: bg, cursor: 'pointer' }}>今すぐ始める</button></ButtonShowcase>
}

// ── Area 追加セクション ───────────────────────────────────────────────────────
function SectionText2col({ options }: { options: PartOptions }) {
  const { bg, color, subColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color, textAlign: 'center', marginBottom: 40 }}>セクション見出し</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 800, margin: '0 auto' }}>
        {[0,1].map(i => (
          <p key={i} style={{ fontSize: 13, color: subColor, lineHeight: 2.0 }}>
            テキストの内容がここに入ります。サービスの特長や詳細を説明する文章を複数行にわたって記述できます。読みやすい2カラムレイアウトです。
          </p>
        ))}
      </div>
      <div style={{ maxWidth: 800, margin: '24px auto 0' }}>{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionFeatures4colImage({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, cardBg, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  const titles = ['高速処理', 'セキュリティ', 'サポート', 'カスタマイズ']
  return (
    <section className="px-8" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-10">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>FEATURES</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>4つの特徴</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: getGridCols(options.columns), gap: 16, maxWidth: 960, margin: '0 auto' }}>
        {titles.slice(0, options.columns).map((title, i) => (
          <div key={i} style={{ background: cardBg, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ aspectRatio: '16/9', background: mutedBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageIcon size={20} color={hintColor} />
            </div>
            <div style={{ padding: '12px 14px' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 6 }}>{title}</p>
              <p style={{ fontSize: 11, color: subColor, lineHeight: 1.7 }}>機能の説明テキストが入ります。</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionTeamHorizontal({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor, cardBg, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  const allMembers = [
    { label: 'CEO', name: '山田 太郎', title: '代表取締役社長' },
    { label: 'CTO', name: '鈴木 花子', title: '最高技術責任者' },
    { label: 'CFO', name: '佐藤 次郎', title: '最高財務責任者' },
    { label: 'CMO', name: '田中 花子', title: '最高マーケティング責任者' },
  ]
  const count = options.memberCount ?? 2
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-10">
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>チームメンバー</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640, margin: '0 auto' }}>
        {allMembers.slice(0, count).map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, background: cardBg, padding: 20, borderRadius: 4, border: `1px solid ${bdColor}` }}>
            <div style={{ width: 80, height: 80, background: mutedBg, borderRadius: 4, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.15em', color: hintColor, marginBottom: 4 }}>{m.label}</p>
              <p style={{ fontSize: 16, fontWeight: 700, color, marginBottom: 4 }}>{m.name}</p>
              <p style={{ fontSize: 12, color: subColor }}>{m.title}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionGallerySlider({ options }: { options: PartOptions }) {
  const { bg, color, bdColor, cardBg, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="relative" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-10 px-8">
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>ギャラリー</h2>
      </div>
      <div style={{ position: 'relative', padding: '0 40px' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ flex: '0 0 calc(25% - 9px)', aspectRatio: '4/3', background: mutedBg, borderRadius: 4 }} />
          ))}
        </div>
        <button style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, background: cardBg, border: `1px solid ${bdColor}`, borderRadius: 2, fontSize: 18, cursor: 'pointer', color }}>‹</button>
        <button style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, background: cardBg, border: `1px solid ${bdColor}`, borderRadius: 2, fontSize: 18, cursor: 'pointer', color }}>›</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionFeaturesIconCircle({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  const items = ([
    [Zap, '高速対応', 'リクエストから最短1営業日で対応します。'],
    [Shield, '安心保証', '品質に自信があるため全額返金保証付きです。'],
    [Star, '高評価', '業界平均4.8の満足度を維持しています。'],
    [Zap, 'サポート', '24時間対応のサポート体制を整えています。'],
  ] as const)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>FEATURES</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>3つの強み</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: getGridCols(options.columns), gap: 32, maxWidth: 960, margin: '0 auto' }}>
        {items.slice(0, options.columns).map(([Icon, title, desc], i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: mutedBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={26} color={subColor} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color }}>{title}</p>
            <p style={{ fontSize: 12, color: subColor, lineHeight: 1.8 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
function SectionTestimonialSlider({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor, cardBg, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="relative" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-10 px-8">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>TESTIMONIAL</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>お客様の声</h2>
      </div>
      <div style={{ position: 'relative', padding: '0 40px' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { name: '田中 様', company: '株式会社A', comment: '導入して業務効率が大幅に改善しました。チーム全員が使いやすいと好評です。' },
            { name: '佐藤 様', company: '有限会社B', comment: 'サポートが迅速で丁寧。困ったときに即座に対応してもらえて助かっています。' },
            { name: '鈴木 様', company: 'C合同会社',  comment: 'コストパフォーマンスが非常に高く、費用対効果に満足しています。' },
          ].map((t, i) => (
            <div key={i} style={{ flex: 1, background: cardBg, borderRadius: 4, padding: 20, border: `1px solid ${bdColor}` }}>
              <div style={{ height: 80, background: mutedBg, borderRadius: 2, marginBottom: 14 }} />
              <p style={{ fontSize: 11, color: subColor, lineHeight: 1.8, marginBottom: 12 }}>{t.comment}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color }}>{t.name}</p>
              <p style={{ fontSize: 10, color: hintColor }}>{t.company}</p>
            </div>
          ))}
        </div>
        <button style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, background: cardBg, border: `1px solid ${bdColor}`, borderRadius: 2, fontSize: 18, cursor: 'pointer', color }}>‹</button>
        <button style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, background: cardBg, border: `1px solid ${bdColor}`, borderRadius: 2, fontSize: 18, cursor: 'pointer', color }}>›</button>
      </div>
    </section>
  )
}
function SectionSteps5({ options }: { options: PartOptions }) {
  const { bg, color, hintColor, bdColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-8" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>PROCESS</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>5ステップで導入完了</h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
        {['お申し込み', 'ヒアリング', '設計・開発'].map((label, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: 110 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: `1.5px solid ${bdColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color }}>{i + 1}</div>
            <p style={{ fontSize: 12, fontWeight: 600, color, textAlign: 'center' }}>{label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
        {['テスト・確認', '納品・運用開始'].map((label, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: 110 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: `1.5px solid ${bdColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color }}>{i + 4}</div>
            <p style={{ fontSize: 12, fontWeight: 600, color, textAlign: 'center' }}>{label}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center">{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionMap({ options }: { options: PartOptions }) {
  const { bg, color, subColor, mutedBg, hintColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section style={{ background: bg }}>
      <div className="px-10 text-center" style={{ paddingTop: py, paddingBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color, marginBottom: 8 }}>アクセス</h2>
        <p style={{ fontSize: 13, color: subColor }}>東京都千代田区〇〇1-2-3</p>
      </div>
      <div style={{ width: '100%', height: 320, background: mutedBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <MapPin size={32} color={hintColor} />
        <p style={{ fontSize: 11, color: hintColor }}>Google Maps Embed</p>
      </div>
    </section>
  )
}
function SectionServicesLabeled({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor, cardBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  const services = [
    { label: 'WEB DESIGN',  title: 'Webデザイン',  desc: '最新のトレンドを取り入れたWebデザイン制作。UXを重視したレイアウト設計。', tag: '制作' },
    { label: 'DEVELOPMENT', title: '開発・実装',   desc: 'Next.js・Reactなどのモダンフレームワークを使用した高品質な実装。', tag: '開発' },
    { label: 'BRANDING',    title: 'ブランディング', desc: 'ロゴからガイドラインまで一貫したブランドアイデンティティを構築。', tag: '戦略' },
    { label: 'SUPPORT',     title: '保守・運用',   desc: '公開後の継続的なサポートとメンテナンスで安心の運用を提供。', tag: 'サポート' },
  ]
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div style={{ display: 'grid', gridTemplateColumns: getGridCols(options.columns), gap: 20, maxWidth: 960, margin: '0 auto' }}>
        {services.slice(0, options.columns).map(({ label, title, desc, tag }, i) => (
          <div key={i} style={{ background: cardBg, padding: 20, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 9, letterSpacing: '0.2em', color: hintColor, fontWeight: 600 }}>{label}</p>
            <p style={{ fontSize: 15, fontWeight: 700, color }}>{title}</p>
            <p style={{ fontSize: 11, color: subColor, lineHeight: 1.8, flex: 1 }}>{desc}</p>
            <span style={{ fontSize: 10, color: hintColor, border: `1px solid ${bdColor}`, padding: '2px 8px', borderRadius: 99, alignSelf: 'flex-start' }}>{tag}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionMissionSplit({ options }: { options: PartOptions }) {
  const { bg, color, subColor, bdColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section style={{ background: bg, borderTop: `1px solid ${bdColor}`, borderBottom: `1px solid ${bdColor}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ padding: `${py}px 40px ${py}px 0`, borderRight: `1px solid ${bdColor}` }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.35 }}>日本の<br />デザインを<br />変えていく</h2>
          <div style={{ marginTop: 24 }}>{renderButton(options.buttonStyle, color)}</div>
        </div>
        <div style={{ padding: `${py}px 0 ${py}px 40px`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
          <p style={{ fontSize: 13, color: subColor, lineHeight: 1.9 }}>私たちは、デザインの力で日本企業のブランド価値を高めることを使命としています。</p>
          <p style={{ fontSize: 13, color: subColor, lineHeight: 1.9 }}>単なるビジュアル制作にとどまらず、ユーザー体験の設計から事業戦略まで一貫してサポートします。</p>
        </div>
      </div>
    </section>
  )
}
// ── Area 追加セクション（新規9個）──────────────────────────────────────────────
function SectionBulletPoints({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>FEATURES</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>選ばれる理由</h2>
      </div>
      <div className="max-w-xl mx-auto flex flex-col gap-5">
        {['導入コストを大幅に削減', '運用効率が3倍にアップ', '24時間のサポート体制', '高い拡張性とカスタマイズ性', '充実したドキュメント'].map((t, i) => (
          <div key={i} className="flex items-center gap-4">
            <span style={{ fontSize: 16, color: subColor }}>✓</span>
            <span style={{ fontSize: 14, color }}>{ t }</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionIconCards2x2({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor, cardBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>FEATURES</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>4つの特徴</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 700, margin: '0 auto' }}>
        {([
          [Zap, '高速パフォーマンス', 'ページ読み込みが圧倒的に速い'],
          [Shield, 'セキュリティ', 'エンタープライズ級の安全性'],
          [Star, '高い満足度', '業界平均4.8の評価'],
          [Layout, '柔軟な設計', '自由なカスタマイズ性'],
        ] as const).map(([Icon, title, desc], i) => (
          <div key={i} className="p-6 flex flex-col items-center text-center gap-3" style={{ background: cardBg, border: `1px solid ${bdColor}`, borderRadius: 4 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={22} color={subColor} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color }}>{title}</p>
            <p style={{ fontSize: 12, color: subColor, lineHeight: 1.7 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
function SectionTimelineSteps({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  const steps = [
    ['お申し込み', 'Webフォームから簡単にお申し込みいただけます。'],
    ['ヒアリング', 'ご要望や課題を丁寧にヒアリングいたします。'],
    ['ご提案', 'カスタマイズされたプランをご提案します。'],
    ['導入開始', 'スムーズな導入をサポートいたします。'],
  ]
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>PROCESS</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>導入の流れ</h2>
      </div>
      <div className="max-w-lg mx-auto flex flex-col">
        {steps.map(([title, desc], i) => (
          <div key={i} className="flex gap-5">
            <div className="flex flex-col items-center">
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color, flexShrink: 0 }}>{i + 1}</div>
              {i < steps.length - 1 && <div style={{ width: 1, flex: 1, background: bdColor }} />}
            </div>
            <div style={{ paddingBottom: i < steps.length - 1 ? 28 : 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color, marginBottom: 4 }}>{title}</p>
              <p style={{ fontSize: 12, color: subColor, lineHeight: 1.8 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionQuoteFullscreen({ options }: { options: PartOptions }) {
  const { bg, color, subColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex flex-col items-center justify-center text-center gap-8 px-10" style={{ background: bg, minHeight: 400, paddingTop: py, paddingBottom: py }}>
      <span style={{ fontSize: 48, color: subColor, lineHeight: 1, fontFamily: 'serif', opacity: 0.3 }}>"</span>
      <p style={{ fontSize: 22, color, lineHeight: 1.7, maxWidth: 600, fontStyle: 'italic', fontWeight: 300 }}>
        このサービスのおかげで、私たちのビジネスは大きく変わりました。心からおすすめします。
      </p>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color }}>山田 太郎</p>
        <p style={{ fontSize: 11, color: subColor, marginTop: 4 }}>株式会社A CEO</p>
      </div>
    </section>
  )
}
function SectionQuoteSideAccent({ options }: { options: PartOptions }) {
  const { bg, color, subColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="max-w-2xl mx-auto" style={{ borderLeft: `4px solid ${color}`, paddingLeft: 32 }}>
        <p style={{ fontSize: 18, color, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 16 }}>
          "導入後3ヶ月で問い合わせが2倍に増えました。サポートも手厚く、安心して利用しています。"
        </p>
        <p style={{ fontSize: 13, fontWeight: 600, color }}>鈴木 花子</p>
        <p style={{ fontSize: 11, color: subColor, marginTop: 2 }}>合同会社B マーケティング部長</p>
      </div>
    </section>
  )
}
function SectionBeforeAfter({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, mutedBg, cardBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>Before / After</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 800, margin: '0 auto' }}>
        <div className="p-6 flex flex-col gap-4" style={{ background: mutedBg, borderRadius: 4 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, fontWeight: 600 }}>BEFORE</p>
          <p style={{ fontSize: 13, color: subColor, lineHeight: 1.8 }}>作業に時間がかかり、チーム間の連携もスムーズではありませんでした。</p>
        </div>
        <div className="p-6 flex flex-col gap-4" style={{ background: cardBg, border: `1.5px solid ${color}`, borderRadius: 4 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', color, fontWeight: 600 }}>AFTER</p>
          <p style={{ fontSize: 13, color: subColor, lineHeight: 1.8 }}>導入後、作業時間は半減。チームの生産性が大幅に向上しました。</p>
        </div>
      </div>
    </section>
  )
}
function SectionCompareTwoOption({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor, cardBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>プランを選ぶ</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 700, margin: '0 auto' }}>
        {[
          { name: 'スタンダード', price: '¥980/月', featured: false, items: ['基本機能', 'メールサポート', '5GBストレージ'] },
          { name: 'プレミアム', price: '¥2,980/月', featured: true, items: ['全機能', '優先サポート', '無制限ストレージ'] },
        ].map((plan, i) => (
          <div key={i} className="p-6 flex flex-col gap-4" style={{ background: cardBg, border: plan.featured ? `1.5px solid ${color}` : `1px solid ${bdColor}`, borderRadius: 4 }}>
            {plan.featured && <p style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: '0.1em' }}>RECOMMENDED</p>}
            <p style={{ fontSize: 16, fontWeight: 600, color }}>{plan.name}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color }}>{plan.price}</p>
            <div className="flex flex-col gap-2">
              {plan.items.map(f => (<p key={f} style={{ fontSize: 12, color: subColor }}>✓ {f}</p>))}
            </div>
            <button style={{ padding: '10px 0', background: plan.featured ? color : 'transparent', border: `1px solid ${color}`, borderRadius: 2, fontSize: 13, color: plan.featured ? bg : color, cursor: 'pointer', marginTop: 'auto' }}>選択する</button>
          </div>
        ))}
      </div>
    </section>
  )
}
function SectionProblemBackground({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>PROBLEM</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>こんな課題ありませんか？</h2>
      </div>
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        {['集客が思うように伸びない', 'コンバージョン率が低い', '運用コストが高すぎる', 'チーム間の連携が取れない'].map((t, i) => (
          <div key={i} className="flex items-start gap-4">
            <span style={{ fontSize: 14, fontWeight: 700, color: subColor, flexShrink: 0 }}>!</span>
            <p style={{ fontSize: 14, color, lineHeight: 1.7 }}>{t}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>{renderButton(options.buttonStyle, color)}</div>
    </section>
  )
}
function SectionMissionStatement({ options }: { options: PartOptions }) {
  const { bg, color, subColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex flex-col items-center justify-center text-center gap-6 px-10" style={{ background: bg, minHeight: 400, paddingTop: py, paddingBottom: py }}>
      <h1 style={{ fontSize: 36, fontWeight: 300, color, lineHeight: 1.4, letterSpacing: '0.05em', maxWidth: 600 }}>
        デザインの力で、<br />社会を変える。
      </h1>
      <div style={{ width: 40, height: 1, background: subColor, opacity: 0.3 }} />
      <p style={{ fontSize: 13, color: subColor, maxWidth: 420, lineHeight: 1.8 }}>
        私たちは、テクノロジーとクリエイティビティの融合で、より良い未来を創造します。
      </p>
    </section>
  )
}
// ── Media 追加セクション（新規2個）────────────────────────────────────────────
function SectionImageCaption({ options }: { options: PartOptions }) {
  const { bg, hintColor, color } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="max-w-3xl mx-auto px-8">
        <div style={{ aspectRatio: '16/9', background: getBgStyle('light').mutedBg, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <ImageIcon size={36} color={hintColor} />
        </div>
        <p style={{ fontSize: 12, color, lineHeight: 1.7 }}>画像のキャプションテキストがここに入ります。撮影場所や説明を記載できます。</p>
      </div>
    </section>
  )
}
function SectionImageThreeGrid({ options }: { options: PartOptions }) {
  const { bg, color, hintColor, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>GALLERY</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>フォトギャラリー</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, maxWidth: 900, margin: '0 auto' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ aspectRatio: '4/3', background: mutedBg, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={24} color={hintColor} />
          </div>
        ))}
      </div>
    </section>
  )
}
// ── Data セクション（新規6個）─────────────────────────────────────────────────
function SectionBigNumber({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="flex justify-center gap-16 max-w-3xl mx-auto text-center">
        {[['98%', '顧客満足度'], ['3x', '成果向上'], ['24h', 'サポート対応']].map(([n, l], i) => (
          <div key={i}>
            <p style={{ fontSize: 64, fontWeight: 700, color, lineHeight: 1 }}>{n}</p>
            <p style={{ fontSize: 13, color: subColor, marginTop: 12 }}>{l}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
function SectionChartBar({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  const data = [{ label: '1月', value: 60 }, { label: '2月', value: 75 }, { label: '3月', value: 45 }, { label: '4月', value: 90 }, { label: '5月', value: 80 }, { label: '6月', value: 95 }]
  const max = 100
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>DATA</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>月別推移</h2>
      </div>
      <div className="max-w-xl mx-auto flex items-end gap-4" style={{ height: 200, borderBottom: `1px solid ${bdColor}` }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <p style={{ fontSize: 10, fontWeight: 600, color }}>{d.value}</p>
            <div style={{ width: '70%', height: `${(d.value / max) * 150}px`, background: d.value === Math.max(...data.map(x => x.value)) ? color : bdColor, borderRadius: '2px 2px 0 0' }} />
            <p style={{ fontSize: 10, color: subColor, marginTop: 4 }}>{d.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
function SectionChartDonut({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>DATA</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>顧客満足度</h2>
      </div>
      <div className="flex flex-col items-center gap-8">
        <div style={{ position: 'relative', width: 180, height: 180 }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', background: `conic-gradient(${color} 0% 65%, ${subColor} 65% 85%, ${hintColor} 85% 100%)` }} />
          <div style={{ position: 'absolute', inset: 40, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 700, color }}>65%</span>
          </div>
        </div>
        <div className="flex gap-6">
          {[['満足', '65%', color], ['普通', '20%', subColor], ['不満', '15%', hintColor]].map(([l, v, c], i) => (
            <div key={i} className="flex items-center gap-2">
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              <span style={{ fontSize: 12, color: subColor }}>{l} {v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
function SectionChartLine({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  const points = [30, 45, 35, 55, 50, 70, 65]
  const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
  const max = 80
  const w = 400, h = 180
  const polyPoints = points.map((v, i) => `${(i / (points.length - 1)) * w},${h - (v / max) * h}`).join(' ')
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>TREND</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>成長推移</h2>
      </div>
      <div className="flex justify-center">
        <svg viewBox={`-30 -10 ${w + 40} ${h + 30}`} width={w + 40} height={h + 40} style={{ maxWidth: '100%' }}>
          <line x1="0" y1={h} x2={w} y2={h} stroke={bdColor} strokeWidth="1" />
          <line x1="0" y1="0" x2="0" y2={h} stroke={bdColor} strokeWidth="1" />
          <polyline points={polyPoints} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
          {points.map((v, i) => (
            <circle key={i} cx={(i / (points.length - 1)) * w} cy={h - (v / max) * h} r="3.5" fill={color} />
          ))}
          {labels.map((l, i) => (
            <text key={i} x={(i / (labels.length - 1)) * w} y={h + 18} textAnchor="middle" fontSize="10" fill={subColor}>{l}</text>
          ))}
        </svg>
      </div>
    </section>
  )
}
function SectionKpiDashboard({ options }: { options: PartOptions }) {
  const { bg, color, subColor, bdColor, cardBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 900, margin: '0 auto' }}>
        {[
          ['1,200+', '導入企業数', '+12%', true],
          ['98%', '継続率', '+2.3%', true],
          ['¥2.4M', '月次売上', '+18%', true],
          ['4.8', '顧客満足度', '±0', false],
        ].map(([n, l, t, up], i) => (
          <div key={i} className="p-5 flex flex-col gap-3 text-center" style={{ background: cardBg, borderRadius: 4, border: `1px solid ${bdColor}` }}>
            <p style={{ fontSize: 28, fontWeight: 700, color }}>{n as string}</p>
            <p style={{ fontSize: 11, color: subColor }}>{l as string}</p>
            <p style={{ fontSize: 11, color: up ? '#4CAF50' : subColor, fontWeight: 600 }}>{t as string}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
function SectionCompareTable({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor, cardBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  const plans = ['Free', 'Pro', 'Business']
  const features = [
    ['基本機能', true, true, true],
    ['カスタムドメイン', false, true, true],
    ['優先サポート', false, true, true],
    ['分析ダッシュボード', false, false, true],
    ['API連携', false, false, true],
  ]
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>COMPARE</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>プラン比較</h2>
      </div>
      <div className="max-w-2xl mx-auto" style={{ background: cardBg, borderRadius: 4, border: `1px solid ${bdColor}`, overflow: 'hidden' }}>
        <div className="flex" style={{ borderBottom: `1px solid ${bdColor}`, background: bg }}>
          <div style={{ flex: 2, padding: '12px 16px', fontSize: 12, fontWeight: 600, color: hintColor }}>機能</div>
          {plans.map(p => (
            <div key={p} style={{ flex: 1, padding: '12px 8px', fontSize: 12, fontWeight: 600, color, textAlign: 'center' }}>{p}</div>
          ))}
        </div>
        {features.map(([name, ...vals], i) => (
          <div key={i} className="flex" style={{ borderBottom: i < features.length - 1 ? `1px solid ${bdColor}` : 'none' }}>
            <div style={{ flex: 2, padding: '10px 16px', fontSize: 12, color: subColor }}>{name as string}</div>
            {(vals as boolean[]).map((v, j) => (
              <div key={j} style={{ flex: 1, padding: '10px 8px', fontSize: 13, textAlign: 'center', color: v ? '#4CAF50' : bdColor }}>
                {v ? '✓' : '—'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
// ── Closing セクション（新規4個）──────────────────────────────────────────────
function SectionClosingThankyou({ options }: { options: PartOptions }) {
  const { bg, color, subColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="flex flex-col items-center justify-center text-center gap-6 px-10" style={{ background: bg, minHeight: 400, paddingTop: py, paddingBottom: py }}>
      <h1 style={{ fontSize: 40, fontWeight: 300, color, letterSpacing: '0.1em' }}>Thank You</h1>
      <p style={{ fontSize: 13, color: subColor, maxWidth: 400, lineHeight: 1.8 }}>
        ご清聴ありがとうございました。<br />ご不明点がございましたら、お気軽にお問い合わせください。
      </p>
      {renderButton(options.buttonStyle, color)}
    </section>
  )
}
function SectionClosingContactCard({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, bdColor, cardBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="max-w-md mx-auto p-8 flex flex-col gap-5" style={{ background: cardBg, border: `1px solid ${bdColor}`, borderRadius: 4 }}>
        <div className="text-center mb-4">
          <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>CONTACT</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color }}>お問い合わせ</h2>
        </div>
        {[
          ['✉', 'info@example.com'],
          ['☎', '03-1234-5678'],
          ['📍', '東京都千代田区〇〇1-2-3'],
          ['🌐', 'https://example.com'],
        ].map(([icon, text], i) => (
          <div key={i} className="flex items-center gap-4" style={{ borderBottom: `1px solid ${bdColor}`, paddingBottom: 12 }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span style={{ fontSize: 13, color: subColor }}>{text}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
function SectionSpeakerBio({ options }: { options: PartOptions }) {
  const { bg, color, subColor, hintColor, mutedBg } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <p style={{ fontSize: 10, letterSpacing: '0.2em', color: hintColor, marginBottom: 8 }}>SPEAKER</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>スピーカー紹介</h2>
      </div>
      <div className="max-w-xl mx-auto flex gap-8 items-center">
        <div style={{ width: 120, height: 120, borderRadius: '50%', background: mutedBg, flexShrink: 0 }} />
        <div className="flex flex-col gap-3">
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color }}>山田 太郎</p>
            <p style={{ fontSize: 12, color: subColor, marginTop: 4 }}>株式会社A 代表取締役</p>
          </div>
          <p style={{ fontSize: 12, color: subColor, lineHeight: 1.8 }}>
            2010年に創業。デザインとテクノロジーの融合を通じて、多くの企業のDXを支援してきた。講演多数。
          </p>
        </div>
      </div>
    </section>
  )
}
function SectionAgendaToc({ options }: { options: PartOptions }) {
  const { bg, color, subColor, bdColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  const items = [
    ['01', 'はじめに', '5 min'],
    ['02', 'サービス紹介', '15 min'],
    ['03', '導入事例', '10 min'],
    ['04', '料金プラン', '5 min'],
    ['05', 'Q&A', '10 min'],
  ]
  return (
    <section className="px-10" style={{ background: bg, paddingTop: py, paddingBottom: py }}>
      <div className="text-center mb-12">
        <h2 style={{ fontSize: 22, fontWeight: 700, color }}>Agenda</h2>
      </div>
      <div className="max-w-lg mx-auto flex flex-col">
        {items.map(([num, title, time], i) => (
          <div key={i} className="flex items-center gap-6 py-4" style={{ borderBottom: i < items.length - 1 ? `1px solid ${bdColor}` : 'none' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: subColor, fontFamily: 'monospace', opacity: 0.4 }}>{num}</span>
            <span style={{ fontSize: 14, color, flex: 1 }}>{title}</span>
            <span style={{ fontSize: 11, color: subColor }}>{time}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
// ── Hero 追加セクション ───────────────────────────────────────────────────────
function SectionHeroSlider({ options }: { options: PartOptions }) {
  const { bg, color, subColor } = getBgStyle(options.bgColor)
  const py = getSpacingPx(options.spacing)
  return (
    <section className="relative flex items-center justify-center text-center px-8" style={{ background: bg, minHeight: 440, paddingTop: py, paddingBottom: py }}>
      <div className="flex flex-col gap-5 z-10 items-center">
        <h1 style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.35 }}>スライド1: メインビジュアル</h1>
        <p style={{ fontSize: 13, color: subColor, lineHeight: 1.8 }}>キャプションテキストがここに入ります</p>
        {renderButton(options.buttonStyle, color)}
      </div>
      <button style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, background: 'rgba(128,128,128,0.2)', border: 'none', color, fontSize: 22, cursor: 'pointer', borderRadius: 2 }}>‹</button>
      <button style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, background: 'rgba(128,128,128,0.2)', border: 'none', color, fontSize: 22, cursor: 'pointer', borderRadius: 2 }}>›</button>
      <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: subColor, display: 'inline-block', opacity: 0.4 }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: subColor, display: 'inline-block', opacity: 0.4 }} />
      </div>
    </section>
  )
}

// ── Animated section wrapper (modal right panel) ─────────────────────────
function AnimatedSectionWrapper({
  children, scrollAnimId, textAnimId, btnAnimId, rootRef,
}: {
  children: React.ReactNode
  scrollAnimId?: string
  textAnimId?: string
  btnAnimId?: string
  rootRef?: React.RefObject<HTMLElement | null>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const hasIO = !!(scrollAnimId || textAnimId)

  useEffect(() => {
    if (!hasIO || !ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { root: rootRef?.current ?? null, rootMargin: '0px', threshold: 0.15 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasIO]) // eslint-disable-line react-hooks/exhaustive-deps

  const dataAttrs: Record<string, string> = {}
  if (scrollAnimId) dataAttrs['data-lplus-anim'] = scrollAnimId
  if (textAnimId)   dataAttrs['data-lplus-text'] = textAnimId.replace('text-', '')
  if (btnAnimId)    dataAttrs['data-lplus-btn']  = btnAnimId.replace('btn-hover-', 'hover-')

  return (
    <div
      ref={ref}
      {...dataAttrs}
      className={`lplus-section-anim${visible ? ' lplus-visible' : ''}`}
    >
      {children}
    </div>
  )
}

// ── Animation Section Indicators ─────────────────────────────────────────
const ANIM_IDS = new Set<PartId>([
  'fade-in-up', 'fade-in', 'slide-in-left', 'slide-in-right',
  'text-fade-in', 'text-slide-up', 'text-stagger', 'text-typewriter',
  'btn-hover-fill', 'btn-hover-slide', 'parallax', 'counter-up',
])

const BUTTON_OPTION_PARTS = new Set<PartId>([
  'hero-basic', 'hero-center', 'hero-split', 'hero-dark-split',
  'hero-minimal', 'hero-with-video', 'hero-slider',
  'features', 'features-4col-image', 'features-icon-circle',
  'cta', 'steps', 'steps-5', 'contact', 'mission-split',
  'image-text', 'image-text-right',
  'team', 'blog', 'text-2col', 'team-horizontal', 'gallery-slider', 'services-labeled',
  'bullet-points', 'timeline-steps', 'problem-background', 'closing-thankyou',
])
const COLUMN_OPTION_PARTS = new Set<PartId>([
  'features', 'features-4col-image', 'features-icon-circle', 'blog', 'team', 'pricing',
  'services-labeled',
])
const DEFAULT_COLUMNS: Partial<Record<PartId, 2 | 3 | 4>> = {
  features: 3, 'features-4col-image': 4, 'features-icon-circle': 3,
  blog: 3, team: 3, pricing: 3, 'services-labeled': 4,
}
const DEFAULT_BUTTON: Partial<Record<PartId, PartOptions['buttonStyle']>> = {
  contact: 'filled',
}
const DEFAULT_BG: Record<string, 'white' | 'light' | 'dark'> = {
  'hero-basic':          'dark',
  'hero-center':         'dark',
  'hero-split':          'white',
  'hero-dark-split':     'dark',
  'hero-minimal':        'white',
  'hero-with-video':     'dark',
  'hero-slider':         'dark',
  'features':            'white',
  'features-4col-image': 'light',
  'features-icon-circle':'white',
  'cta':                 'dark',
  'testimonial':         'light',
  'testimonial-slider':  'light',
  'pricing':             'white',
  'stats':               'light',
  'team':                'white',
  'team-horizontal':     'light',
  'blog':                'white',
  'newsletter':          'light',
  'steps':               'white',
  'steps-5':             'white',
  'contact':             'white',
  'footer':              'dark',
  'logos':               'light',
  'faq':                 'white',
  'map':                 'dark',
  'services-labeled':    'light',
  'mission-split':       'white',
  'text-2col':           'white',
  'gallery-slider':      'light',
  'image-fullwidth':     'light',
  'image-gallery':       'white',
  'image-text':          'white',
  'image-text-right':    'white',
  'video-embed':         'dark',
  // Area 追加
  'bullet-points':       'white',
  'icon-cards-2x2':      'white',
  'timeline-steps':      'white',
  'quote-fullscreen':    'dark',
  'quote-side-accent':   'white',
  'before-after':        'white',
  'compare-two-option':  'light',
  'problem-background':  'white',
  'mission-statement':   'dark',
  // Media 追加
  'image-caption':       'dark',
  'image-three-grid':    'white',
  // Data
  'big-number':          'white',
  'chart-bar':           'white',
  'chart-donut':         'white',
  'chart-line':          'white',
  'kpi-dashboard':       'dark',
  'compare-table':       'white',
  // Closing
  'closing-thankyou':    'dark',
  'closing-contact-card':'white',
  'speaker-bio':         'white',
  'agenda-toc':          'dark',
}
function defaultOptions(id: PartId): PartOptions {
  return {
    buttonStyle: DEFAULT_BUTTON[id] ?? 'outline',
    columns:     DEFAULT_COLUMNS[id] ?? 3,
    bgColor:     DEFAULT_BG[id] ?? 'white',
    spacing:     'md',
    memberCount: id === 'team-horizontal' ? 2 : undefined,
  }
}
function formatPartOptions(id: PartId, opts: PartOptions): string {
  const bgLabels    = { white: '白（#FFFFFF）', light: 'ライトグレー（#F4F4F4）', dark: 'ダーク（#1A1A1A）' }
  const spaceLabels = { sm: '小（padding: 32px 48px）', md: '中（padding: 64px 48px）', lg: '大（padding: 96px 48px）' }
  const btnLabels   = {
    none: 'なし（ボタン非表示）', outline: 'アウトライン（border 1px・背景透明）',
    filled: 'フィルド（background:#1A1A1A・白テキスト）', rounded: '丸ボタン（border-radius: 99px）',
    ghost: 'ゴースト（テキスト＋矢印のみ）', icon: 'アイコン付き（ArrowRight ＋ テキスト）',
  }
  const lines: string[] = []
  if (BUTTON_OPTION_PARTS.has(id)) lines.push(`  - ボタンスタイル: ${btnLabels[opts.buttonStyle]}`)
  if (COLUMN_OPTION_PARTS.has(id)) lines.push(`  - カラム数: ${opts.columns}`)
  lines.push(`  - 背景色: ${bgLabels[opts.bgColor]}`)
  lines.push(`  - 余白: ${spaceLabels[opts.spacing]}`)
  return lines.join('\n')
}

function AnimationBadge({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3" style={{ background: '#F8F6FF', borderTop: '1px solid #E8E2FF', borderBottom: '1px solid #E8E2FF' }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 11, color: '#6B57D6', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 10, color: '#9B8FD4', marginLeft: 'auto' }}>Animation</span>
    </div>
  )
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionFadeInUp(_p: { options: PartOptions })      { return <AnimationBadge label="フェードイン（下から）"     icon="✦" /> }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionFadeIn(_p: { options: PartOptions })        { return <AnimationBadge label="フェードイン"               icon="✦" /> }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionSlideInLeft(_p: { options: PartOptions })   { return <AnimationBadge label="スライドイン（左から）"     icon="→" /> }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionSlideInRight(_p: { options: PartOptions })  { return <AnimationBadge label="スライドイン（右から）"     icon="←" /> }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionTextFadeIn(_p: { options: PartOptions })    { return <AnimationBadge label="テキストフェードイン"       icon="T" /> }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionTextSlideUp(_p: { options: PartOptions })   { return <AnimationBadge label="テキストスライドアップ"     icon="↑" /> }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionTextStagger(_p: { options: PartOptions })   { return <AnimationBadge label="テキスト連続出現"           icon="≡" /> }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionTextTypewriter(_p: { options: PartOptions }){ return <AnimationBadge label="タイプライター"             icon="_" /> }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionBtnHoverFill(_p: { options: PartOptions })  { return <AnimationBadge label="ボタンホバー（塗りつぶし）" icon="◼" /> }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionBtnHoverSlide(_p: { options: PartOptions }) { return <AnimationBadge label="ボタンホバー（スライド）"   icon="▶" /> }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionParallax(_p: { options: PartOptions })      { return <AnimationBadge label="パララックス"               icon="⊞" /> }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionCounterUp(_p: { options: PartOptions })     { return <AnimationBadge label="カウントアップ"             icon="↗" /> }

const SECTION_MAP: Record<PartId, React.FC<{ options: PartOptions }>> = {
  'hero-basic': SectionHeroBasic, features: SectionFeatures, cta: SectionCta,
  testimonial: SectionTestimonial, faq: SectionFaq, logos: SectionLogos,
  pricing: SectionPricing, stats: SectionStats, team: SectionTeam,
  blog: SectionBlog, newsletter: SectionNewsletter, steps: SectionSteps,
  contact: SectionContact, footer: SectionFooter,
  'text-2col': SectionText2col, 'features-4col-image': SectionFeatures4colImage,
  'team-horizontal': SectionTeamHorizontal, 'gallery-slider': SectionGallerySlider,
  'features-icon-circle': SectionFeaturesIconCircle, 'testimonial-slider': SectionTestimonialSlider,
  'steps-5': SectionSteps5, map: SectionMap,
  'services-labeled': SectionServicesLabeled, 'mission-split': SectionMissionSplit,
  'hero-center': SectionHeroCenter, 'hero-split': SectionHeroSplit,
  'hero-dark-split': SectionHeroDarkSplit, 'hero-minimal': SectionHeroMinimal,
  'hero-with-video': SectionHeroWithVideo, 'hero-slider': SectionHeroSlider,
  'image-fullwidth': SectionImageFullwidth, 'image-gallery': SectionImageGallery,
  'image-text': SectionImageText, 'image-text-right': SectionImageTextRight, 'video-embed': SectionVideoEmbed,
  'btn-outline': SectionBtnOutline, 'btn-filled': SectionBtnFilled,
  'btn-ghost': SectionBtnGhost, 'btn-rounded': SectionBtnRounded,
  'btn-icon': SectionBtnIcon, 'btn-cta-lg': SectionBtnCtaLg,
  // Animation
  'fade-in-up': SectionFadeInUp, 'fade-in': SectionFadeIn,
  'slide-in-left': SectionSlideInLeft, 'slide-in-right': SectionSlideInRight,
  'text-fade-in': SectionTextFadeIn, 'text-slide-up': SectionTextSlideUp,
  'text-stagger': SectionTextStagger, 'text-typewriter': SectionTextTypewriter,
  'btn-hover-fill': SectionBtnHoverFill, 'btn-hover-slide': SectionBtnHoverSlide,
  parallax: SectionParallax, 'counter-up': SectionCounterUp,
  // Area 追加
  'bullet-points': SectionBulletPoints, 'icon-cards-2x2': SectionIconCards2x2,
  'timeline-steps': SectionTimelineSteps, 'quote-fullscreen': SectionQuoteFullscreen,
  'quote-side-accent': SectionQuoteSideAccent, 'before-after': SectionBeforeAfter,
  'compare-two-option': SectionCompareTwoOption, 'problem-background': SectionProblemBackground,
  'mission-statement': SectionMissionStatement,
  // Media 追加
  'image-caption': SectionImageCaption, 'image-three-grid': SectionImageThreeGrid,
  // Data
  'big-number': SectionBigNumber, 'chart-bar': SectionChartBar, 'chart-donut': SectionChartDonut,
  'chart-line': SectionChartLine, 'kpi-dashboard': SectionKpiDashboard, 'compare-table': SectionCompareTable,
  // Closing
  'closing-thankyou': SectionClosingThankyou, 'closing-contact-card': SectionClosingContactCard,
  'speaker-bio': SectionSpeakerBio, 'agenda-toc': SectionAgendaToc,
}

// ── Prompt generators ────────────────────────────────────────────────────
function genChatPrompt(parts: SelectedPart[], fontId?: string | null): string {
  const contentParts = parts.filter(sp => !ANIM_IDS.has(sp.id))
  const animParts    = parts.filter(sp => ANIM_IDS.has(sp.id))
  const list = contentParts.map((sp, i) => {
    const partName = PARTS.find(p => p.id === sp.id)!.name
    const optsStr  = formatPartOptions(sp.id, sp.options)
    return `${i + 1}. ${partName}\n${optsStr}`
  }).join('\n')
  const animSection = animParts.length > 0
    ? `\n\n## アニメーション指示\n以下のアニメーションを実装してください（Intersection Observer API 推奨）。\n${animParts.map(sp => `- ${PARTS.find(p => p.id === sp.id)!.name}: ${PART_GUIDES[sp.id]}`).join('\n')}`
    : ''
  const font = fontId ? FONT_LIST.find(f => f.id === fontId) : null
  const fontSection = font
    ? `\n\n## フォント指定\n使用フォント: ${font.name}\n読み込み:\n<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.name)}:wght@${font.weights.join(';')}&display=swap" rel="stylesheet">\nbody に font-family: '${font.name}', sans-serif; を設定してください。`
    : ''
  return `以下の構成でランディングページ（LP）のHTMLを作成してください。

## LP構成（上から順番に）
${list}

## 要件
- レスポンシブデザイン（スマートフォン対応）
- Tailwind CSS を使用
- モダンでプロフェッショナルなデザイン
- 各エリアにはサンプルテキストを入れてください
- CTAボタンは目立つ色にしてください

## 出力形式
HTMLファイル1つにまとめて出力してください。${animSection}${fontSection}`
}

function genCodePrompt(parts: SelectedPart[], path: string, fontId?: string | null): string {
  const contentParts = parts.filter(sp => !ANIM_IDS.has(sp.id))
  const animParts    = parts.filter(sp => ANIM_IDS.has(sp.id))
  const contentIds = contentParts.map(sp => sp.id)
  const animIds    = animParts.map(sp => sp.id)
  const list   = contentParts.map((sp, i) => {
    const partName = PARTS.find(p => p.id === sp.id)!.name
    const optsStr  = formatPartOptions(sp.id, sp.options)
    return `${i + 1}. ${partName}\n${optsStr}`
  }).join('\n')
  const guides = contentIds.map((id, i) => `${i + 1}. ${PART_GUIDES[id]}`).join('\n')
  const animSection = animIds.length > 0
    ? `

---
【アニメーション実装指示】
以下のアニメーションを実装してください。
ライブラリ: Intersection Observer API（外部ライブラリ不要）
または framer-motion（Next.js推奨）

${animIds.map(id => `${PARTS.find(p => p.id === id)!.name}
  → ${PART_GUIDES[id]}`).join('\n\n')}`
    : ''
  return `既存のNext.jsプロジェクト（src/なし、app/直下構成）に
新しいLPページ /${path} を追加してください。

【ページ構成】（上から順番に）
${list}

【構成ルール】
- app/${path}/page.tsx を作成（'use client'）
- TypeScript + Tailwind CSS
- SPファースト・レスポンシブ
- ヘッダー・フッターは app/layout.tsx が自動適用するので不要

【各エリアの実装指示】
${guides}

【デザイン】
- アクセントカラー: #1A1A1A（黒）
- フォント: Poppins + Meiryo / LINE Seed${animSection}${(() => {
    const font = fontId ? FONT_LIST.find(f => f.id === fontId) : null
    if (!font) return ''
    if (!font.google) {
      return `\n\n【フォント指定】\n使用フォント: ${font.name}\n読み込み方法: ローカルフォント（woff2）を @font-face で読み込み\n\n全体のfont-familyに '${font.name}', sans-serif を適用する。`
    }
    const imp = fontToNextImport(font.name)
    return `\n\n【フォント指定】\n使用フォント: ${font.name}\n読み込み方法: next/font/google を使用\n\nimport { ${imp} } from 'next/font/google'\nconst font = ${imp}({\n  subsets: ['latin'],\n  weight: [${font.weights.map(w => `'${w}'`).join(', ')}],\n  variable: '--font-main',\n})\n\n全体のfont-familyに var(--font-main) を適用する。`
  })()}`
}

// ── Options Panel ─────────────────────────────────────────────────────────
function OptionsPanel({ partId, options, onUpdate }: {
  partId: PartId
  options: PartOptions
  onUpdate: (opts: PartOptions) => void
}) {
  const hasButton  = BUTTON_OPTION_PARTS.has(partId)
  const hasColumn  = COLUMN_OPTION_PARTS.has(partId)
  const hasMember  = partId === 'team-horizontal'
  const seg = (selected: boolean) => ({
    padding: '3px 9px', fontSize: 10, border: 'none', cursor: 'pointer',
    background: selected ? C.main : 'transparent',
    color: selected ? C.bg : C.sub,
  } as React.CSSProperties)
  const segWrap: React.CSSProperties = { display: 'flex', border: `1px solid ${C.bd}`, borderRadius: 3, overflow: 'hidden' }
  const row: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }
  const label: React.CSSProperties = { fontSize: 10, color: C.sub, minWidth: 64, flexShrink: 0 }
  const btnStyle: Array<{ v: PartOptions['buttonStyle']; label: string }> = [
    { v: 'none', label: 'なし' }, { v: 'outline', label: 'アウトライン' },
    { v: 'filled', label: 'フィルド' }, { v: 'rounded', label: '丸' },
    { v: 'ghost', label: 'ゴースト' }, { v: 'icon', label: 'アイコン' },
  ]
  return (
    <div style={{ borderTop: `1px solid ${C.muted}`, padding: '10px 12px', background: '#F9F9F9', borderRadius: '0 0 4px 4px' }}>
      {/* Background */}
      <div style={row}>
        <span style={label}>背景色</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {([['white','#FFFFFF'],['light','#F4F4F4'],['dark','#1A1A1A']] as [PartOptions['bgColor'],string][]).map(([k, color]) => (
            <button key={k} title={k} onClick={() => onUpdate({ ...options, bgColor: k })} style={{ width: 18, height: 18, borderRadius: '50%', background: color, border: options.bgColor === k ? `2.5px solid ${C.main}` : `1px solid ${C.bd}`, cursor: 'pointer', padding: 0, flexShrink: 0 }} />
          ))}
        </div>
      </div>
      {/* Spacing */}
      <div style={{ ...row, marginBottom: hasButton || hasColumn ? 8 : 0 }}>
        <span style={label}>上下の余白</span>
        <div style={segWrap}>
          {(['sm','md','lg'] as const).map((v, i) => (
            <button key={v} onClick={() => onUpdate({ ...options, spacing: v })} style={{ ...seg(options.spacing === v), borderLeft: i > 0 ? `1px solid ${C.bd}` : 'none' }}>
              {v === 'sm' ? '小' : v === 'md' ? '中' : '大'}
            </button>
          ))}
        </div>
      </div>
      {/* Button style */}
      {hasButton && (
        <div style={{ ...row, marginBottom: hasColumn ? 8 : 0 }}>
          <span style={label}>ボタン</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {btnStyle.map(({ v, label: l }) => (
              <button key={v} onClick={() => onUpdate({ ...options, buttonStyle: v })} style={{ padding: '2px 7px', fontSize: 9, borderRadius: 3, cursor: 'pointer', border: `1px solid ${options.buttonStyle === v ? C.main : C.bd}`, background: options.buttonStyle === v ? C.main : 'transparent', color: options.buttonStyle === v ? C.bg : C.sub }}>{l}</button>
            ))}
          </div>
        </div>
      )}
      {/* Columns */}
      {hasColumn && (
        <div style={{ ...row, marginBottom: hasMember ? 8 : 0 }}>
          <span style={label}>カラム数</span>
          <div style={segWrap}>
            {([2,3,4] as const).map((v, i) => (
              <button key={v} onClick={() => onUpdate({ ...options, columns: v })} style={{ ...seg(options.columns === v), borderLeft: i > 0 ? `1px solid ${C.bd}` : 'none' }}>{v}</button>
            ))}
          </div>
        </div>
      )}
      {/* Member count (team-horizontal only) */}
      {hasMember && (
        <div style={{ ...row, marginBottom: 0 }}>
          <span style={label}>人数</span>
          <div style={segWrap}>
            {([1,2,3,4] as const).map((v, i) => (
              <button key={v} onClick={() => onUpdate({ ...options, memberCount: v })} style={{ ...seg((options.memberCount ?? 2) === v), borderLeft: i > 0 ? `1px solid ${C.bd}` : 'none' }}>{v}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sortable item ─────────────────────────────────────────────────────────
function SortableItem({ uid, partId, index, name, options, isExpanded, onRemove, onToggleExpand, onUpdateOptions }: {
  uid: number; partId: PartId; index: number; name: string
  options: PartOptions; isExpanded: boolean
  onRemove: () => void; onToggleExpand: () => void; onUpdateOptions: (opts: PartOptions) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: String(uid) })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, background: C.card, borderColor: isDragging ? C.main : C.bd, borderWidth: 1, borderStyle: 'solid', borderRadius: 4 }}>
      <div className="flex items-center gap-2.5" style={{ padding: '10px 12px' }}>
        <span {...attributes} {...listeners} className="select-none cursor-grab active:cursor-grabbing" style={{ color: C.hint, fontSize: 16, lineHeight: 1 }}>⠿</span>
        <span className="flex items-center justify-center shrink-0 text-[11px] font-bold" style={{ width: 20, height: 20, borderRadius: '50%', background: C.main, color: C.bg }}>{index + 1}</span>
        <span className="flex-1 text-sm min-w-0 truncate" style={{ color: C.main }}>{name}</span>
        <button onClick={onToggleExpand} style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `0.5px solid ${C.bd}`, borderRadius: 4, background: 'none', cursor: 'pointer', fontSize: 11, color: C.sub, flexShrink: 0 }} aria-label="オプション">
          {isExpanded ? '∧' : '∨'}
        </button>
        <button onClick={onRemove} className="flex items-center justify-center w-6 h-6 text-base leading-none transition-colors" style={{ color: C.hint }} onMouseEnter={e => (e.currentTarget.style.color = C.main)} onMouseLeave={e => (e.currentTarget.style.color = C.hint)} aria-label="削除">×</button>
      </div>
      {isExpanded && <OptionsPanel partId={partId} options={options} onUpdate={onUpdateOptions} />}
    </div>
  )
}

// ── Section Preview Wrapper ───────────────────────────────────────────────
// ── Font Card ────────────────────────────────────────────────────────────
const _loadedFontIds = new Set<string>()

function FontCard({ font, selected, onToggle }: {
  font: FontEntry
  selected: boolean
  onToggle: () => void
}) {
  useEffect(() => {
    if (!font.google || _loadedFontIds.has(font.id)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.name)}:wght@${font.weights.join(';')}&display=swap`
    document.head.appendChild(link)
    _loadedFontIds.add(font.id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const ff = `'${font.name}', sans-serif`

  return (
    <div
      onClick={onToggle}
      style={{ background: selected ? C.sel : C.card, border: selected ? `1.5px solid ${C.main}` : `1px solid ${C.bd}`, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', position: 'relative', transition: 'border-color 0.15s' }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLDivElement).style.borderColor = C.main }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLDivElement).style.borderColor = C.bd }}
    >
      {selected && (
        <div className="absolute flex items-center justify-center font-bold" style={{ width: 22, height: 22, background: C.main, color: C.bg, borderRadius: '50%', top: 10, right: 10, fontSize: 11, zIndex: 5 }}>✓</div>
      )}
      {/* Preview */}
      <div style={{ height: 120, background: '#F4F4F4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', gap: 6, userSelect: 'none' }}>
        <p style={{ fontSize: 36, fontWeight: 700, fontFamily: ff, color: C.main, lineHeight: 1, margin: 0 }}>Aa</p>
        <p style={{ fontSize: 13, fontFamily: ff, color: C.sub, margin: 0 }}>あいうえお / ABCDE 12345</p>
      </div>
      {/* Info */}
      <div className="flex items-center justify-between" style={{ padding: '12px 14px' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.main }}>{font.name}</p>
          <span style={{ fontSize: 10, color: C.sub, border: `1px solid ${C.bd}`, borderRadius: 99, padding: '2px 8px', display: 'inline-block', marginTop: 4 }}>{font.category}</span>
        </div>
        <div className="flex items-center justify-center shrink-0 font-bold" style={{ width: 28, height: 28, borderRadius: '50%', border: selected ? `1px solid ${C.main}` : `1px solid ${C.bd}`, background: selected ? C.main : 'transparent', color: selected ? C.bg : C.main, fontSize: 16 }}>
          {selected ? '✓' : '+'}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────
export default function LPlusPage() {
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([])
  const [activeTab, setActiveTab]         = useState<ActiveTab>('area')
  const uidCounterRef = useRef(0)
  const [modalOpen, setModalOpen]     = useState(false)
  const [promptTab, setPromptTab]     = useState<PromptTab>('chat')
  const [copied, setCopied]           = useState(false)
  const [pagePath, setPagePath]                     = useState('lp')
  const [selectedFontId, setSelectedFontId]         = useState<string | null>(null)
  const [fontCategoryFilter, setFontCategoryFilter] = useState('すべて')
  const [pptxGenerating, setPptxGenerating]         = useState(false)

  // Derived: selected font object
  const selectedFont = selectedFontId ? (FONT_LIST.find(f => f.id === selectedFontId) ?? null) : null

  // Load Google Font into <head> whenever selectedFontId changes
  useEffect(() => {
    if (!selectedFont?.google) return
    const linkId = `gfont-${selectedFont.name.replace(/\s/g, '-').toLowerCase()}`
    if (document.getElementById(linkId)) return
    const link = document.createElement('link')
    link.id   = linkId
    link.rel  = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.name.replace(/\s/g, '+')}:wght@${selectedFont.weights.join(';')}&display=swap`
    document.head.appendChild(link)
  }, [selectedFontId]) // eslint-disable-line react-hooks/exhaustive-deps
  const [jpgSaving, setJpgSaving]           = useState(false)
  const lpPreviewRef   = useRef<HTMLDivElement>(null)
  const modalRightRef  = useRef<HTMLElement | null>(null)

  // Derived IDs (backward-compat for PPTX etc.)
  const selectedIds = selectedParts.map(sp => sp.id)

  // Animation IDs selected by user
  const selectedAnimIds    = selectedIds.filter(id => ANIM_IDS.has(id))
  const activeScrollAnimId = selectedAnimIds.find(id => ['fade-in-up', 'fade-in', 'slide-in-left', 'slide-in-right'].includes(id))
  const activeTextAnimId   = selectedAnimIds.find(id => ['text-fade-in', 'text-slide-up', 'text-stagger'].includes(id))
  const activeBtnAnimId    = selectedAnimIds.find(id => ['btn-hover-fill', 'btn-hover-slide'].includes(id))

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const visibleParts = PARTS.filter(p => p.tab === activeTab)

  function togglePart(id: PartId) {
    setSelectedParts(prev => {
      if (prev.some(sp => sp.id === id)) return prev.filter(sp => sp.id !== id)
      const uid = ++uidCounterRef.current
      return [...prev, { uid, id, options: defaultOptions(id), isExpanded: false }]
    })
  }
  function removePart(id: PartId) {
    setSelectedParts(prev => prev.filter(sp => sp.id !== id))
  }
  function toggleExpand(uid: number) {
    setSelectedParts(prev => prev.map(sp => sp.uid === uid ? { ...sp, isExpanded: !sp.isExpanded } : sp))
  }
  function updateOptions(uid: number, options: PartOptions) {
    setSelectedParts(prev => prev.map(sp => sp.uid === uid ? { ...sp, options } : sp))
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSelectedParts(prev => {
        const oldIdx = prev.findIndex(sp => String(sp.uid) === String(active.id))
        const newIdx = prev.findIndex(sp => String(sp.uid) === String(over.id))
        return arrayMove(prev, oldIdx, newIdx)
      })
    }
  }

  const promptText =
    promptTab === 'chat' ? genChatPrompt(selectedParts, selectedFontId) :
    promptTab === 'code' ? genCodePrompt(selectedParts, pagePath.trim() || 'lp', selectedFontId) : ''

  async function handleCopy() {
    await navigator.clipboard.writeText(promptText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function generatePptx() {
    setPptxGenerating(true)
    try {
      const PptxGenJS = (await import('pptxgenjs')).default
      const prs = new PptxGenJS()
      prs.layout = 'LAYOUT_16x9'  // 10 × 5.63 inch
      const now = new Date()
      const dateStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`
      const dateJp = now.toLocaleDateString('ja-JP')

      // ── Drawing helpers ─────────────────────────────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type PS = any
      const addRect = (s: PS, x: number, y: number, w: number, h: number, fill?: string, lc?: string, lw = 0.75) => {
        const opts: Record<string, unknown> = { x, y, w, h }
        if (fill) opts.fill = { color: fill }
        if (lc)   opts.line = { color: lc, width: lw }
        s.addShape('rect', opts)
      }
      const addEll = (s: PS, x: number, y: number, d: number, fill: string, lc?: string, lw = 1.0) => {
        const opts: Record<string, unknown> = { x, y, w: d, h: d, fill: { color: fill } }
        if (lc) opts.line = { color: lc, width: lw }
        s.addShape('ellipse', opts)
      }
      const addHLine = (s: PS, x: number, y: number, w: number, color = 'DCDCDC', lw = 0.75) =>
        s.addShape('line', { x, y, w, h: 0, line: { color, width: lw } })
      const addTxt = (s: PS, text: string, opts: Record<string, unknown>) =>
        s.addText(text, { fontFace: 'Meiryo', ...opts })

      // ── Right-column shape renderer ──────────────────────────────────────
      function drawRight(slide: PS, id: PartId) {
        const rx = 4.4, ry = 0.4, rw = 5.0
        switch (id) {

          // Hero: full-dark block
          case 'hero-basic': case 'hero-center':
          case 'hero-dark-split': case 'hero-minimal': case 'hero-with-video': {
            addRect(slide, rx, ry, rw, 2.8, '1A1A1A')
            addTxt(slide, 'HERO', { x: rx, y: ry + 0.85, w: rw, h: 1.0, fontSize: 20, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' })
            addRect(slide, rx + 1.9, ry + 2.35, 1.2, 0.3, 'FFFFFF')
            break
          }
          // Hero: split (left dark / right image placeholder)
          case 'hero-split': {
            addRect(slide, rx, ry, 2.4, 2.8, '1A1A1A')
            addRect(slide, rx + 2.6, ry, 2.4, 2.8, 'DCDCDC')
            addTxt(slide, 'HERO', { x: rx, y: ry + 1.0, w: 2.4, h: 0.8, fontSize: 20, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' })
            break
          }
          // 3-column feature cards
          case 'features': {
            for (let i = 0; i < 3; i++) {
              const bx = rx + i * 1.7
              addRect(slide, bx, ry + 0.3, 1.5, 2.0, 'FFFFFF', 'DCDCDC')
              addRect(slide, bx + 0.55, ry + 0.6, 0.4, 0.4, 'EBEBEB')
              addHLine(slide, bx + 0.1, ry + 1.2, 1.3)
              addHLine(slide, bx + 0.1, ry + 1.5, 1.0)
            }
            break
          }
          // Dark CTA banner
          case 'cta': {
            addRect(slide, rx, ry + 0.6, rw, 2.0, '1A1A1A')
            addTxt(slide, 'CTA', { x: rx, y: ry + 0.6, w: rw, h: 2.0, fontSize: 20, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' })
            addRect(slide, rx + 1.8, ry + 2.15, 1.4, 0.35, 'FFFFFF')
            break
          }
          // 3 testimonial cards
          case 'testimonial': {
            for (let i = 0; i < 3; i++) {
              const bx = rx + i * 1.7
              addRect(slide, bx, ry + 0.3, 1.5, 2.0, 'FFFFFF', 'DCDCDC')
              addTxt(slide, '★★★★★', { x: bx + 0.05, y: ry + 0.5, w: 1.4, h: 0.3, fontSize: 9, color: '888888', fontFace: 'Calibri' })
              addHLine(slide, bx + 0.1, ry + 0.95, 1.3)
              addHLine(slide, bx + 0.1, ry + 1.2, 1.1)
              addHLine(slide, bx + 0.1, ry + 1.45, 0.85)
              addHLine(slide, bx + 0.1, ry + 1.85, 0.6, 'BBBBBB', 0.5)
            }
            break
          }
          // FAQ accordion
          case 'faq': {
            addRect(slide, rx, ry, rw, 2.6, 'FFFFFF', 'DCDCDC', 0.5)
            for (let i = 0; i < 4; i++) {
              const qy = ry + 0.25 + i * 0.55
              addTxt(slide, 'Q.', { x: rx + 0.15, y: qy, w: 0.4, h: 0.35, fontSize: 10, bold: true, color: '888888' })
              addHLine(slide, rx + 0.5, qy + 0.17, 3.8)
              addTxt(slide, '+', { x: rx + 4.55, y: qy, w: 0.3, h: 0.35, fontSize: 12, color: '888888', align: 'center', fontFace: 'Calibri' })
              if (i < 3) addHLine(slide, rx + 0.1, qy + 0.48, 4.7, 'EBEBEB', 0.5)
            }
            break
          }
          // Logo grid
          case 'logos': {
            addRect(slide, rx, ry + 0.5, rw, 1.6, 'EBEBEB')
            for (let i = 0; i < 4; i++) addRect(slide, rx + 0.3 + i * 1.1, ry + 1.0, 0.9, 0.45, 'DCDCDC')
            break
          }
          // 3-column pricing table
          case 'pricing': {
            for (let i = 0; i < 3; i++) {
              const bx = rx + i * 1.7
              const featured = i === 1
              addRect(slide, bx, ry + 0.1, 1.5, 2.6, 'FFFFFF', featured ? '1A1A1A' : 'DCDCDC', featured ? 1.5 : 0.75)
              addHLine(slide, bx + 0.1, ry + 0.4, 0.8)
              addHLine(slide, bx + 0.1, ry + 0.7, 0.5, '1A1A1A', 1.5)
              addHLine(slide, bx + 0.05, ry + 1.0, 1.4)
              for (let j = 0; j < 3; j++) addHLine(slide, bx + 0.15, ry + 1.25 + j * 0.35, 1.2)
            }
            break
          }
          // Stats: large numbers
          case 'stats': {
            addRect(slide, rx, ry + 0.5, rw, 2.0, 'F4F4F4')
            ;(['1,200+', '98%', '4.8', '3x'] as const).forEach((n, i) => {
              const labels = ['導入企業数', '継続率', '満足度', '成果向上'] as const
              const bx = rx + 0.4 + i * 1.2
              addTxt(slide, n, { x: bx, y: ry + 0.9, w: 1.0, h: 0.55, fontSize: 20, bold: true, color: '1A1A1A', align: 'center', fontFace: 'Calibri' })
              addTxt(slide, labels[i], { x: bx, y: ry + 1.5, w: 1.0, h: 0.3, fontSize: 9, color: '888888', align: 'center' })
            })
            break
          }
          // Team member cards
          case 'team': {
            for (let i = 0; i < 3; i++) {
              const bx = rx + i * 1.7
              addRect(slide, bx, ry + 0.3, 1.5, 2.0, 'FFFFFF', 'DCDCDC')
              addRect(slide, bx + 0.35, ry + 0.5, 0.8, 0.8, 'DCDCDC')
              addHLine(slide, bx + 0.1, ry + 1.5, 1.2)
              addHLine(slide, bx + 0.25, ry + 1.75, 0.9, 'EBEBEB')
            }
            break
          }
          // Blog cards
          case 'blog': {
            for (let i = 0; i < 3; i++) {
              const bx = rx + i * 1.7
              addRect(slide, bx, ry + 0.3, 1.5, 2.0, 'FFFFFF', 'DCDCDC')
              addRect(slide, bx, ry + 0.3, 1.5, 0.85, 'DCDCDC')
              addHLine(slide, bx + 0.1, ry + 1.3, 1.3)
              addHLine(slide, bx + 0.1, ry + 1.55, 0.9, 'EBEBEB')
            }
            break
          }
          // Newsletter email form
          case 'newsletter': {
            addRect(slide, rx, ry + 0.8, rw, 2.0, 'EBEBEB')
            addHLine(slide, rx + 1.0, ry + 1.25, 3.0, 'DCDCDC', 1.0)
            addRect(slide, rx + 0.4, ry + 1.6, 3.0, 0.42, 'FFFFFF', 'DCDCDC')
            addRect(slide, rx + 3.5, ry + 1.6, 1.1, 0.42, '1A1A1A')
            break
          }
          // Contact form
          case 'contact': {
            addRect(slide, rx, ry, rw, 2.6, 'FFFFFF')
            for (let i = 0; i < 3; i++) addHLine(slide, rx + 0.3, ry + 0.65 + i * 0.55, 4.4, 'DCDCDC', 1.0)
            addRect(slide, rx + 1.5, ry + 2.1, 2.0, 0.38, 'FFFFFF', '1A1A1A', 1.0)
            addTxt(slide, '送信する', { x: rx + 1.5, y: ry + 2.1, w: 2.0, h: 0.38, fontSize: 10, color: '1A1A1A', align: 'center', valign: 'middle' })
            break
          }
          // Dark footer
          case 'footer': {
            addRect(slide, rx, ry, rw, 2.6, '2C2C2C')
            addTxt(slide, 'LOGO', { x: rx + 0.3, y: ry + 0.25, w: 1.0, h: 0.4, fontSize: 14, bold: true, color: 'FFFFFF', fontFace: 'Calibri' })
            for (let i = 0; i < 4; i++) addHLine(slide, rx + 3.0, ry + 0.3 + i * 0.38, 1.7, '888888', 0.5)
            addHLine(slide, rx, ry + 2.05, rw, '444444', 0.5)
            addTxt(slide, '© 2024 Company Name', { x: rx + 0.3, y: ry + 2.15, w: 4.0, h: 0.3, fontSize: 9, color: '888888', fontFace: 'Calibri' })
            break
          }
          // Numbered steps with dashed connectors
          case 'steps': {
            for (let i = 0; i < 3; i++) {
              const bx = rx + 0.5 + i * 1.8
              addEll(slide, bx, ry + 0.8, 0.55, 'FFFFFF', '1A1A1A', 1.0)
              addTxt(slide, String(i + 1), { x: bx, y: ry + 0.8, w: 0.55, h: 0.55, fontSize: 12, bold: true, color: '1A1A1A', align: 'center', valign: 'middle', fontFace: 'Calibri' })
              addTxt(slide, `Step ${i + 1}`, { x: bx - 0.3, y: ry + 1.5, w: 1.15, h: 0.35, fontSize: 9, color: '888888', align: 'center' })
              if (i < 2) slide.addShape('line', { x: bx + 0.55, y: ry + 1.075, w: 1.25, h: 0, line: { color: 'DCDCDC', width: 0.75, dashType: 'dash' } })
            }
            break
          }
          // ── 追加エリアパーツ ─────────────────────────────────────────────
          case 'text-2col': {
            addRect(slide, rx, ry, rw, 2.6, 'FFFFFF', 'DCDCDC', 0.5)
            addHLine(slide, rx + 1.0, ry + 0.38, 3.0, '1A1A1A', 1.5)
            for (let i = 0; i < 5; i++) addHLine(slide, rx + 0.2, ry + 0.82 + i * 0.3, 2.1)
            for (let i = 0; i < 5; i++) addHLine(slide, rx + 2.7, ry + 0.82 + i * 0.3, 2.1)
            break
          }
          case 'features-4col-image': {
            addRect(slide, rx, ry, rw, 2.8, 'F4F4F4')
            addHLine(slide, rx + 1.5, ry + 0.28, 2.0, 'DCDCDC', 1.0)
            for (let i = 0; i < 4; i++) {
              const bx = rx + i * 1.25
              addRect(slide, bx, ry + 0.55, 1.15, 0.9, '2C2C2C')
              addHLine(slide, bx + 0.05, ry + 1.6, 1.1, '1A1A1A', 0.75)
              addHLine(slide, bx + 0.05, ry + 1.9, 1.0)
              addHLine(slide, bx + 0.05, ry + 2.1, 0.8)
            }
            break
          }
          case 'team-horizontal': {
            addRect(slide, rx, ry, rw, 2.8, 'F4F4F4')
            addHLine(slide, rx + 1.5, ry + 0.28, 2.0, 'DCDCDC', 1.0)
            for (let i = 0; i < 2; i++) {
              const ty = ry + 0.65 + i * 1.0
              addRect(slide, rx + 0.2, ty, 0.9, 0.75, '2C2C2C')
              addHLine(slide, rx + 1.3, ty + 0.08, 1.5, 'BBBBBB', 0.5)
              addHLine(slide, rx + 1.3, ty + 0.32, 2.0, '1A1A1A', 1.0)
              addHLine(slide, rx + 1.3, ty + 0.58, 1.5)
            }
            break
          }
          case 'gallery-slider': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            addHLine(slide, rx + 1.5, ry + 0.3, 2.0, 'DCDCDC', 1.0)
            for (let i = 0; i < 4; i++) addRect(slide, rx + 0.15 + i * 1.18, ry + 0.65, 1.08, 1.5, 'DCDCDC')
            addTxt(slide, '‹', { x: rx, y: ry + 0.9, w: 0.4, h: 0.8, fontSize: 16, color: '888888', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addTxt(slide, '›', { x: rx + 4.6, y: ry + 0.9, w: 0.4, h: 0.8, fontSize: 16, color: '888888', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            break
          }
          case 'features-icon-circle': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            for (let i = 0; i < 3; i++) {
              const bx = rx + 0.3 + i * 1.55
              addEll(slide, bx + 0.35, ry + 0.4, 0.7, 'DCDCDC')
              addHLine(slide, bx + 0.05, ry + 1.3, 1.3, '1A1A1A', 0.75)
              addHLine(slide, bx + 0.1, ry + 1.6, 1.1)
              addHLine(slide, bx + 0.15, ry + 1.85, 0.9)
            }
            break
          }
          case 'testimonial-slider': {
            addRect(slide, rx, ry, rw, 2.8, 'F4F4F4')
            addHLine(slide, rx + 1.5, ry + 0.28, 2.0, 'DCDCDC', 1.0)
            for (let i = 0; i < 3; i++) {
              const bx = rx + 0.15 + i * 1.6
              addRect(slide, bx, ry + 0.6, 1.5, 1.85, 'FFFFFF', 'DCDCDC')
              addRect(slide, bx, ry + 0.6, 1.5, 0.65, 'DCDCDC')
              addHLine(slide, bx + 0.1, ry + 1.45, 1.3)
              addHLine(slide, bx + 0.1, ry + 1.7, 1.1)
              addHLine(slide, bx + 0.1, ry + 2.1, 0.7, 'BBBBBB', 0.5)
            }
            addTxt(slide, '‹', { x: rx, y: ry + 0.9, w: 0.4, h: 0.8, fontSize: 16, color: '888888', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addTxt(slide, '›', { x: rx + 4.6, y: ry + 0.9, w: 0.4, h: 0.8, fontSize: 16, color: '888888', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            break
          }
          case 'steps-5': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            addHLine(slide, rx + 1.5, ry + 0.28, 2.0, 'DCDCDC', 1.0)
            for (let i = 0; i < 3; i++) {
              const bx = rx + 0.5 + i * 1.4
              addEll(slide, bx, ry + 0.58, 0.45, 'FFFFFF', 'DCDCDC', 0.75)
              addTxt(slide, String(i+1), { x: bx, y: ry + 0.58, w: 0.45, h: 0.45, fontSize: 10, color: '888888', align: 'center', valign: 'middle', fontFace: 'Calibri' })
              addHLine(slide, bx, ry + 1.18, 0.45)
            }
            for (let i = 0; i < 2; i++) {
              const bx = rx + 1.0 + i * 1.8
              addEll(slide, bx, ry + 1.55, 0.45, 'FFFFFF', 'DCDCDC', 0.75)
              addTxt(slide, String(i+4), { x: bx, y: ry + 1.55, w: 0.45, h: 0.45, fontSize: 10, color: '888888', align: 'center', valign: 'middle', fontFace: 'Calibri' })
              addHLine(slide, bx, ry + 2.15, 0.45)
            }
            break
          }
          case 'map': {
            addRect(slide, rx, ry, rw, 2.6, '2C2C2C')
            addEll(slide, rx + 2.1, ry + 0.75, 0.8, '555555')
            addTxt(slide, 'MAP', { x: rx, y: ry + 0.7, w: rw, h: 1.0, fontSize: 14, bold: true, color: '888888', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addTxt(slide, '所在地マップ', { x: rx, y: ry + 2.0, w: rw, h: 0.35, fontSize: 10, color: '888888', align: 'center' })
            break
          }
          case 'services-labeled': {
            addRect(slide, rx, ry, rw, 2.8, 'F4F4F4')
            for (let i = 0; i < 4; i++) {
              const bx = rx + i * 1.25
              addHLine(slide, bx + 0.05, ry + 0.28, 0.8, 'BBBBBB', 0.5)
              addHLine(slide, bx + 0.05, ry + 0.55, 1.0, '1A1A1A', 1.5)
              addHLine(slide, bx + 0.05, ry + 0.95, 1.0)
              addHLine(slide, bx + 0.05, ry + 1.2, 0.85)
              addHLine(slide, bx + 0.05, ry + 1.45, 0.7)
              addRect(slide, bx + 0.05, ry + 1.9, 0.6, 0.2, 'EBEBEB', 'DCDCDC', 0.5)
            }
            break
          }
          case 'mission-split': {
            addRect(slide, rx, ry, rw, 2.6, 'FFFFFF', 'DCDCDC', 0.75)
            addRect(slide, rx + 0.2, ry + 0.55, 1.6, 0.2, '1A1A1A')
            addRect(slide, rx + 0.2, ry + 0.9, 1.4, 0.2, '1A1A1A')
            addRect(slide, rx + 0.2, ry + 1.25, 1.1, 0.2, '1A1A1A')
            slide.addShape('line', { x: rx + 2.1, y: ry + 0.2, w: 0, h: 2.2, line: { color: 'DCDCDC', width: 0.5 } })
            for (let i = 0; i < 5; i++) addHLine(slide, rx + 2.3, ry + 0.6 + i * 0.35, 2.5)
            break
          }
          // ── 追加ヒーローパーツ ───────────────────────────────────────────
          case 'hero-slider': {
            addRect(slide, rx, ry, rw, 2.8, '1A1A1A')
            addTxt(slide, 'HERO / SLIDER', { x: rx, y: ry + 0.85, w: rw, h: 1.0, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' })
            addRect(slide, rx + 1.9, ry + 2.35, 1.2, 0.3, 'FFFFFF')
            addTxt(slide, '‹', { x: rx + 0.05, y: ry + 1.0, w: 0.5, h: 0.8, fontSize: 18, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addTxt(slide, '›', { x: rx + 4.45, y: ry + 1.0, w: 0.5, h: 0.8, fontSize: 18, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addEll(slide, rx + 2.25, ry + 2.68, 0.14, 'FFFFFF')
            addEll(slide, rx + 2.44, ry + 2.68, 0.14, '555555')
            addEll(slide, rx + 2.63, ry + 2.68, 0.14, '555555')
            break
          }
          // Full-width image placeholder
          case 'image-fullwidth': {
            addRect(slide, rx, ry + 0.3, rw, 2.1, 'DCDCDC')
            addTxt(slide, 'IMAGE', { x: rx, y: ry + 0.8, w: rw, h: 1.2, fontSize: 14, color: '888888', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            break
          }
          // 3×2 gallery grid
          case 'image-gallery': {
            for (let row = 0; row < 2; row++)
              for (let col = 0; col < 3; col++)
                addRect(slide, rx + col * 1.7 + 0.05, ry + row * 1.15 + 0.25, 1.55, 1.0, 'DCDCDC')
            break
          }
          // Image + text two-column
          case 'image-text': {
            addRect(slide, rx, ry + 0.2, 2.4, 2.4, 'DCDCDC')
            for (let i = 0; i < 3; i++) addHLine(slide, rx + 2.6, ry + 0.55 + i * 0.4, 2.2)
            addRect(slide, rx + 2.6, ry + 1.75, 1.6, 0.38, 'FFFFFF', '1A1A1A', 1.0)
            break
          }
          // Video embed with play button
          case 'video-embed': {
            addRect(slide, rx, ry, rw, 2.6, '2C2C2C')
            addEll(slide, rx + 2.1, ry + 0.85, 0.8, 'FFFFFF')
            addTxt(slide, '▶', { x: rx + 2.1, y: ry + 0.85, w: 0.8, h: 0.8, fontSize: 14, color: '2C2C2C', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            break
          }
          // Outline button
          case 'btn-outline': {
            addRect(slide, rx + 1.5, ry + 1.15, 2.0, 0.55, 'FFFFFF', '1A1A1A', 1.0)
            addTxt(slide, 'ボタン', { x: rx + 1.5, y: ry + 1.15, w: 2.0, h: 0.55, fontSize: 13, color: '1A1A1A', align: 'center', valign: 'middle' })
            break
          }
          // Filled button
          case 'btn-filled': {
            addRect(slide, rx + 1.5, ry + 1.15, 2.0, 0.55, '1A1A1A')
            addTxt(slide, 'ボタン', { x: rx + 1.5, y: ry + 1.15, w: 2.0, h: 0.55, fontSize: 13, color: 'FFFFFF', align: 'center', valign: 'middle' })
            break
          }
          // Ghost (text + arrow only)
          case 'btn-ghost': {
            addTxt(slide, 'ボタン　→', { x: rx + 1.5, y: ry + 1.15, w: 2.0, h: 0.55, fontSize: 13, color: '1A1A1A', align: 'center', valign: 'middle' })
            break
          }
          // Rounded button
          case 'btn-rounded': {
            slide.addShape('roundRect', { x: rx + 1.5, y: ry + 1.15, w: 2.0, h: 0.55, fill: { color: 'FFFFFF' }, line: { color: '1A1A1A', width: 1.0 }, rectRadius: 0.4 })
            addTxt(slide, 'ボタン', { x: rx + 1.5, y: ry + 1.15, w: 2.0, h: 0.55, fontSize: 13, color: '1A1A1A', align: 'center', valign: 'middle' })
            break
          }
          // Icon button
          case 'btn-icon': {
            addRect(slide, rx + 1.5, ry + 1.15, 2.0, 0.55, 'FFFFFF', '1A1A1A', 1.0)
            addTxt(slide, '→  ボタン', { x: rx + 1.5, y: ry + 1.15, w: 2.0, h: 0.55, fontSize: 13, color: '1A1A1A', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            break
          }
          // Full-width CTA button
          case 'btn-cta-lg': {
            addRect(slide, rx + 0.2, ry + 1.05, 4.6, 0.65, '1A1A1A')
            addTxt(slide, '今すぐ始める', { x: rx + 0.2, y: ry + 1.05, w: 4.6, h: 0.65, fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' })
            break
          }
          // Animation
          case 'fade-in-up': {
            addRect(slide, rx + 1.0, ry + 0.7, 3.0, 0.8, 'EBEBEB')
            addTxt(slide, 'opacity: 0 → 1', { x: rx + 1.0, y: ry + 0.7, w: 3.0, h: 0.8, fontSize: 10, color: 'AAAAAA', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addTxt(slide, '↑  translateY: 20px → 0', { x: rx, y: ry + 1.65, w: rw, h: 0.5, fontSize: 11, color: '888888', align: 'center', fontFace: 'Calibri' })
            addTxt(slide, 'SCROLL', { x: rx, y: ry + 2.2, w: rw, h: 0.3, fontSize: 9, color: 'CCCCCC', align: 'center', fontFace: 'Calibri', charSpacing: 3 })
            break
          }
          case 'fade-in': {
            addRect(slide, rx + 1.2, ry + 0.7, 2.6, 0.6, 'EBEBEB')
            addTxt(slide, 'opacity: 0', { x: rx + 1.2, y: ry + 0.7, w: 2.6, h: 0.6, fontSize: 9, color: 'CCCCCC', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addRect(slide, rx + 1.2, ry + 1.55, 2.6, 0.6, 'D0D0D0')
            addTxt(slide, 'opacity: 1', { x: rx + 1.2, y: ry + 1.55, w: 2.6, h: 0.6, fontSize: 9, color: '444444', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            break
          }
          case 'slide-in-left': {
            addTxt(slide, '→', { x: rx, y: ry + 1.1, w: 1.0, h: 0.5, fontSize: 16, color: 'AAAAAA', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addRect(slide, rx + 1.2, ry + 0.9, 3.0, 0.8, '1A1A1A')
            addTxt(slide, 'slide-in', { x: rx + 1.2, y: ry + 0.9, w: 3.0, h: 0.8, fontSize: 11, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            break
          }
          case 'slide-in-right': {
            addRect(slide, rx + 0.8, ry + 0.9, 3.0, 0.8, '1A1A1A')
            addTxt(slide, 'slide-in', { x: rx + 0.8, y: ry + 0.9, w: 3.0, h: 0.8, fontSize: 11, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addTxt(slide, '←', { x: rx + 4.0, y: ry + 1.1, w: 0.8, h: 0.5, fontSize: 16, color: 'AAAAAA', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            break
          }
          case 'text-fade-in': {
            addRect(slide, rx + 0.5, ry + 0.8, 3.8, 0.22, 'E0E0E0')
            addRect(slide, rx + 0.5, ry + 1.18, 3.8, 0.22, '888888')
            addTxt(slide, 'opacity: 0.2 → 1.0', { x: rx, y: ry + 1.65, w: rw, h: 0.4, fontSize: 10, color: 'AAAAAA', align: 'center', fontFace: 'Calibri' })
            break
          }
          case 'text-slide-up': {
            addRect(slide, rx + 0.5, ry + 0.6, 3.8, 0.22, '333333')
            addRect(slide, rx + 0.5, ry + 1.0, 3.8, 0.22, 'D0D0D0')
            addTxt(slide, '↑  translateY: 100% → 0', { x: rx, y: ry + 1.5, w: rw, h: 0.4, fontSize: 10, color: 'AAAAAA', align: 'center', fontFace: 'Calibri' })
            break
          }
          case 'text-stagger': {
            addRect(slide, rx + 0.5, ry + 0.55, 3.2, 0.2, '1A1A1A')
            addRect(slide, rx + 0.5, ry + 0.9,  3.2, 0.2, 'AAAAAA')
            addRect(slide, rx + 0.5, ry + 1.25, 3.2, 0.2, 'DDDDDD')
            addTxt(slide, '0.1s', { x: rx + 3.85, y: ry + 0.55, w: 1.0, h: 0.2, fontSize: 8, color: 'BBBBBB', align: 'left', valign: 'middle', fontFace: 'Calibri' })
            addTxt(slide, '0.2s', { x: rx + 3.85, y: ry + 0.9,  w: 1.0, h: 0.2, fontSize: 8, color: 'BBBBBB', align: 'left', valign: 'middle', fontFace: 'Calibri' })
            addTxt(slide, '0.3s', { x: rx + 3.85, y: ry + 1.25, w: 1.0, h: 0.2, fontSize: 8, color: 'BBBBBB', align: 'left', valign: 'middle', fontFace: 'Calibri' })
            break
          }
          case 'text-typewriter': {
            addTxt(slide, 'Hello World_', { x: rx, y: ry + 1.0, w: rw, h: 0.7, fontSize: 18, bold: true, color: '1A1A1A', align: 'center', valign: 'middle', fontFace: 'Courier New' })
            addTxt(slide, 'Typewriter Effect', { x: rx, y: ry + 1.85, w: rw, h: 0.35, fontSize: 9, color: 'AAAAAA', align: 'center', fontFace: 'Calibri' })
            break
          }
          case 'btn-hover-fill': {
            addRect(slide, rx + 0.6, ry + 1.05, 1.5, 0.5, 'FFFFFF', '1A1A1A', 1.0)
            addTxt(slide, '通常', { x: rx + 0.6, y: ry + 1.05, w: 1.5, h: 0.5, fontSize: 11, color: '1A1A1A', align: 'center', valign: 'middle' })
            addTxt(slide, '→', { x: rx + 2.2, y: ry + 1.05, w: 0.6, h: 0.5, fontSize: 14, color: 'AAAAAA', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addRect(slide, rx + 2.9, ry + 1.05, 1.5, 0.5, '1A1A1A')
            addTxt(slide, 'ホバー', { x: rx + 2.9, y: ry + 1.05, w: 1.5, h: 0.5, fontSize: 11, color: 'FFFFFF', align: 'center', valign: 'middle' })
            break
          }
          case 'btn-hover-slide': {
            addRect(slide, rx + 1.0, ry + 0.9, 3.0, 0.7, 'FFFFFF', '1A1A1A', 1.0)
            addRect(slide, rx + 1.0, ry + 0.9, 1.5, 0.7, '1A1A1A')
            addTxt(slide, '←', { x: rx + 1.02, y: ry + 0.9, w: 0.5, h: 0.7, fontSize: 11, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addTxt(slide, 'Button', { x: rx + 2.6, y: ry + 0.9, w: 1.35, h: 0.7, fontSize: 11, color: '1A1A1A', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addTxt(slide, '::before scaleX(0→1)', { x: rx, y: ry + 1.8, w: rw, h: 0.35, fontSize: 9, color: 'AAAAAA', align: 'center', fontFace: 'Calibri' })
            break
          }
          case 'parallax': {
            addRect(slide, rx, ry, rw, 2.8, '2C2C2C')
            addRect(slide, rx + 1.5, ry + 0.7, 2.0, 1.4, 'FFFFFF')
            addTxt(slide, '×0.5 speed', { x: rx + 3.0, y: ry + 2.4, w: 1.8, h: 0.3, fontSize: 8, color: '888888', align: 'right', fontFace: 'Calibri' })
            break
          }
          case 'counter-up': {
            addRect(slide, rx, ry, rw, 2.8, 'F4F4F4')
            addTxt(slide, '0  →  1,200+', { x: rx, y: ry + 0.75, w: rw, h: 0.9, fontSize: 20, bold: true, color: '1A1A1A', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addTxt(slide, '導入企業数', { x: rx, y: ry + 1.75, w: rw, h: 0.4, fontSize: 11, color: '888888', align: 'center' })
            break
          }
          // ── 新規21パーツ ───────────────────────────────────────────────
          case 'bullet-points': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF', 'DCDCDC', 0.5)
            addHLine(slide, rx + 1.5, ry + 0.28, 2.0, '1A1A1A', 1.5)
            for (let i = 0; i < 5; i++) {
              addTxt(slide, '✓', { x: rx + 0.3, y: ry + 0.65 + i * 0.4, w: 0.3, h: 0.3, fontSize: 10, color: '4CAF50', fontFace: 'Calibri' })
              addHLine(slide, rx + 0.7, ry + 0.77 + i * 0.4, 3.5)
            }
            break
          }
          case 'icon-cards-2x2': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
              const bx = rx + c * 2.5 + 0.1, by = ry + r * 1.35 + 0.1
              addRect(slide, bx, by, 2.3, 1.2, 'F4F4F4', 'DCDCDC')
              addEll(slide, bx + 0.85, by + 0.15, 0.6, 'DCDCDC')
              addHLine(slide, bx + 0.3, by + 0.9, 1.7)
            }
            break
          }
          case 'timeline-steps': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            for (let i = 0; i < 4; i++) {
              const ty = ry + 0.3 + i * 0.6
              addEll(slide, rx + 0.5, ty, 0.35, 'FFFFFF', '1A1A1A', 1.0)
              addTxt(slide, String(i+1), { x: rx + 0.5, y: ty, w: 0.35, h: 0.35, fontSize: 9, color: '1A1A1A', align: 'center', valign: 'middle', fontFace: 'Calibri' })
              addHLine(slide, rx + 1.0, ty + 0.1, 3.5)
              if (i < 3) slide.addShape('line', { x: rx + 0.675, y: ty + 0.35, w: 0, h: 0.25, line: { color: 'DCDCDC', width: 0.75 } })
            }
            break
          }
          case 'quote-fullscreen': {
            addRect(slide, rx, ry, rw, 2.8, '2C2C2C')
            addTxt(slide, '"', { x: rx, y: ry + 0.2, w: rw, h: 0.8, fontSize: 36, color: '555555', align: 'center', valign: 'middle', fontFace: 'Georgia' })
            addTxt(slide, '引用テキスト', { x: rx + 0.5, y: ry + 1.0, w: 4.0, h: 0.8, fontSize: 14, color: 'FFFFFF', align: 'center', valign: 'middle', italic: true })
            addHLine(slide, rx + 2.0, ry + 2.1, 1.0, '555555')
            addTxt(slide, '引用元', { x: rx, y: ry + 2.2, w: rw, h: 0.4, fontSize: 10, color: '888888', align: 'center' })
            break
          }
          case 'quote-side-accent': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            addRect(slide, rx + 0.5, ry + 0.5, 0.08, 2.0, '1A1A1A')
            for (let i = 0; i < 3; i++) addHLine(slide, rx + 0.9, ry + 0.7 + i * 0.35, 3.5)
            addHLine(slide, rx + 0.9, ry + 1.8, 1.5, '1A1A1A', 0.75)
            addHLine(slide, rx + 0.9, ry + 2.1, 1.2, 'BBBBBB', 0.5)
            break
          }
          case 'before-after': {
            addRect(slide, rx, ry + 0.2, 2.4, 2.4, 'EBEBEB')
            addTxt(slide, 'BEFORE', { x: rx, y: ry + 0.3, w: 2.4, h: 0.4, fontSize: 10, color: '888888', align: 'center', fontFace: 'Calibri', charSpacing: 2 })
            addRect(slide, rx + 2.6, ry + 0.2, 2.4, 2.4, 'FFFFFF', '1A1A1A', 1.0)
            addTxt(slide, 'AFTER', { x: rx + 2.6, y: ry + 0.3, w: 2.4, h: 0.4, fontSize: 10, color: '1A1A1A', align: 'center', fontFace: 'Calibri', charSpacing: 2 })
            break
          }
          case 'compare-two-option': {
            addRect(slide, rx, ry, rw, 2.8, 'F4F4F4')
            for (let i = 0; i < 2; i++) {
              const bx = rx + i * 2.6 + 0.1
              const featured = i === 1
              addRect(slide, bx, ry + 0.3, 2.3, 2.2, 'FFFFFF', featured ? '1A1A1A' : 'DCDCDC', featured ? 1.5 : 0.75)
              addHLine(slide, bx + 0.15, ry + 0.6, 1.2, featured ? '1A1A1A' : 'DCDCDC', 1.0)
              addHLine(slide, bx + 0.15, ry + 0.9, 0.6, '1A1A1A', 1.5)
              for (let j = 0; j < 3; j++) addHLine(slide, bx + 0.15, ry + 1.3 + j * 0.3, 1.8)
            }
            break
          }
          case 'problem-background': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF', 'DCDCDC', 0.5)
            addHLine(slide, rx + 1.0, ry + 0.35, 3.0, '1A1A1A', 1.5)
            for (let i = 0; i < 4; i++) {
              addTxt(slide, '!', { x: rx + 0.3, y: ry + 0.75 + i * 0.45, w: 0.3, h: 0.3, fontSize: 11, bold: true, color: 'D32F2F', fontFace: 'Calibri' })
              addHLine(slide, rx + 0.7, ry + 0.87 + i * 0.45, 3.5)
            }
            break
          }
          case 'mission-statement': {
            addRect(slide, rx, ry, rw, 2.8, '2C2C2C')
            addTxt(slide, 'Mission', { x: rx, y: ry + 0.7, w: rw, h: 1.2, fontSize: 22, color: 'FFFFFF', align: 'center', valign: 'middle' })
            addHLine(slide, rx + 2.0, ry + 2.1, 1.0, '555555')
            addTxt(slide, 'サブテキスト', { x: rx, y: ry + 2.2, w: rw, h: 0.4, fontSize: 10, color: '888888', align: 'center' })
            break
          }
          case 'image-caption': {
            addRect(slide, rx, ry, rw, 2.8, '2C2C2C')
            addRect(slide, rx + 0.2, ry + 0.2, 4.6, 1.8, 'DCDCDC')
            addTxt(slide, 'IMAGE', { x: rx + 0.2, y: ry + 0.6, w: 4.6, h: 1.0, fontSize: 14, color: '888888', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            addHLine(slide, rx + 0.3, ry + 2.3, 3.0, '888888', 0.5)
            break
          }
          case 'image-three-grid': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            addHLine(slide, rx + 1.5, ry + 0.28, 2.0, 'DCDCDC', 1.0)
            for (let i = 0; i < 3; i++) addRect(slide, rx + 0.1 + i * 1.65, ry + 0.6, 1.5, 1.8, 'DCDCDC')
            break
          }
          case 'big-number': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            ;(['98%', '3x', '24h'] as const).forEach((n, i) => {
              const labels = ['顧客満足度', '成果向上', 'サポート'] as const
              const bx = rx + 0.3 + i * 1.6
              addTxt(slide, n, { x: bx, y: ry + 0.5, w: 1.4, h: 1.2, fontSize: 28, bold: true, color: '1A1A1A', align: 'center', valign: 'middle', fontFace: 'Calibri' })
              addTxt(slide, labels[i], { x: bx, y: ry + 1.7, w: 1.4, h: 0.4, fontSize: 10, color: '888888', align: 'center' })
            })
            break
          }
          case 'chart-bar': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            addHLine(slide, rx + 1.5, ry + 0.28, 2.0, 'DCDCDC', 1.0)
            const heights = [1.0, 1.4, 0.7, 1.6, 1.3, 1.8]
            for (let i = 0; i < 6; i++) {
              const bx = rx + 0.3 + i * 0.78
              addRect(slide, bx, ry + 2.3 - heights[i], 0.55, heights[i], i === 5 ? '1A1A1A' : 'DCDCDC')
            }
            addHLine(slide, rx + 0.2, ry + 2.3, 4.6)
            break
          }
          case 'chart-donut': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            addHLine(slide, rx + 1.5, ry + 0.28, 2.0, 'DCDCDC', 1.0)
            addEll(slide, rx + 1.6, ry + 0.6, 1.8, 'DCDCDC')
            addEll(slide, rx + 2.0, ry + 1.0, 1.0, 'FFFFFF')
            addTxt(slide, '65%', { x: rx + 2.0, y: ry + 1.0, w: 1.0, h: 1.0, fontSize: 14, bold: true, color: '1A1A1A', align: 'center', valign: 'middle', fontFace: 'Calibri' })
            break
          }
          case 'chart-line': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            addHLine(slide, rx + 1.5, ry + 0.28, 2.0, 'DCDCDC', 1.0)
            slide.addShape('line', { x: rx + 0.4, y: ry + 0.6, w: 0, h: 1.8, line: { color: 'DCDCDC', width: 0.5 } })
            addHLine(slide, rx + 0.4, ry + 2.4, 4.2, 'DCDCDC', 0.5)
            // Simplified line chart as connected segments
            const pts = [[0, 1.3], [0.7, 1.0], [1.4, 1.1], [2.1, 0.6], [2.8, 0.7], [3.5, 0.3], [4.2, 0.4]]
            for (let i = 0; i < pts.length - 1; i++) {
              slide.addShape('line', { x: rx + 0.4 + pts[i][0], y: ry + 0.7 + pts[i][1], w: pts[i+1][0] - pts[i][0], h: pts[i+1][1] - pts[i][1], line: { color: '1A1A1A', width: 1.5 } })
            }
            break
          }
          case 'kpi-dashboard': {
            addRect(slide, rx, ry, rw, 2.8, '2C2C2C')
            ;(['1,200+', '98%', '¥2.4M', '4.8'] as const).forEach((n, i) => {
              const labels = ['導入数', '継続率', '月次売上', '満足度'] as const
              const bx = rx + (i % 2) * 2.5 + 0.1
              const by = ry + Math.floor(i / 2) * 1.35 + 0.1
              addRect(slide, bx, by, 2.3, 1.2, '3C3C3C')
              addTxt(slide, n, { x: bx, y: by + 0.1, w: 2.3, h: 0.7, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
              addTxt(slide, labels[i], { x: bx, y: by + 0.85, w: 2.3, h: 0.3, fontSize: 9, color: '888888', align: 'center' })
            })
            break
          }
          case 'compare-table': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF', 'DCDCDC', 0.5)
            addRect(slide, rx, ry, rw, 0.4, 'F4F4F4')
            addHLine(slide, rx + 1.2, ry + 0.13, 0.8, '1A1A1A', 0.75)
            addHLine(slide, rx + 2.3, ry + 0.13, 0.8, '1A1A1A', 0.75)
            addHLine(slide, rx + 3.5, ry + 0.13, 0.8, '1A1A1A', 0.75)
            for (let i = 0; i < 5; i++) {
              addHLine(slide, rx, ry + 0.4 + i * 0.45, rw, 'EBEBEB', 0.5)
              addHLine(slide, rx + 0.1, ry + 0.55 + i * 0.45, 0.9)
              for (let j = 0; j < 3; j++) {
                const cx = rx + 1.45 + j * 1.15
                addTxt(slide, i < 2 + j ? '✓' : '—', { x: cx, y: ry + 0.5 + i * 0.45, w: 0.5, h: 0.3, fontSize: 10, color: i < 2 + j ? '4CAF50' : 'DCDCDC', align: 'center', valign: 'middle', fontFace: 'Calibri' })
              }
            }
            break
          }
          case 'closing-thankyou': {
            addRect(slide, rx, ry, rw, 2.8, '2C2C2C')
            addTxt(slide, 'Thank You', { x: rx, y: ry + 0.7, w: rw, h: 1.2, fontSize: 26, color: 'FFFFFF', align: 'center', valign: 'middle' })
            addHLine(slide, rx + 1.5, ry + 2.1, 2.0, '555555')
            addTxt(slide, 'お問い合わせをお待ちしています', { x: rx, y: ry + 2.2, w: rw, h: 0.4, fontSize: 10, color: '888888', align: 'center' })
            break
          }
          case 'closing-contact-card': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            addRect(slide, rx + 0.8, ry + 0.3, 3.4, 2.2, 'F4F4F4', 'DCDCDC')
            addHLine(slide, rx + 1.5, ry + 0.6, 2.0, '1A1A1A', 1.0)
            for (let i = 0; i < 4; i++) {
              addTxt(slide, ['✉', '☎', '📍', '🌐'][i], { x: rx + 1.0, y: ry + 0.95 + i * 0.35, w: 0.3, h: 0.3, fontSize: 10, fontFace: 'Calibri' })
              addHLine(slide, rx + 1.4, ry + 1.07 + i * 0.35, 2.2)
            }
            break
          }
          case 'speaker-bio': {
            addRect(slide, rx, ry, rw, 2.8, 'FFFFFF')
            addEll(slide, rx + 0.5, ry + 0.7, 1.2, 'DCDCDC')
            addHLine(slide, rx + 2.0, ry + 0.8, 2.5, '1A1A1A', 1.5)
            addHLine(slide, rx + 2.0, ry + 1.15, 1.5, 'BBBBBB', 0.5)
            for (let i = 0; i < 3; i++) addHLine(slide, rx + 2.0, ry + 1.6 + i * 0.3, 2.5)
            break
          }
          case 'agenda-toc': {
            addRect(slide, rx, ry, rw, 2.8, '2C2C2C')
            addTxt(slide, 'Agenda', { x: rx, y: ry + 0.15, w: rw, h: 0.5, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' })
            for (let i = 0; i < 5; i++) {
              addTxt(slide, String(i+1).padStart(2, '0'), { x: rx + 0.3, y: ry + 0.7 + i * 0.38, w: 0.4, h: 0.3, fontSize: 10, color: '555555', fontFace: 'Courier New' })
              addHLine(slide, rx + 0.8, ry + 0.82 + i * 0.38, 2.5, 'FFFFFF')
              addTxt(slide, ['5 min', '15 min', '10 min', '5 min', '10 min'][i], { x: rx + 3.8, y: ry + 0.7 + i * 0.38, w: 0.8, h: 0.3, fontSize: 8, color: '888888', align: 'right', fontFace: 'Calibri' })
            }
            break
          }
          // image-text-right uses same as image-text but mirrored
          case 'image-text-right': {
            for (let i = 0; i < 3; i++) addHLine(slide, rx + 0.2, ry + 0.55 + i * 0.4, 2.2)
            addRect(slide, rx + 0.2, ry + 1.75, 1.6, 0.38, 'FFFFFF', '1A1A1A', 1.0)
            addRect(slide, rx + 2.6, ry + 0.2, 2.4, 2.4, 'DCDCDC')
            break
          }
        }
      }

      // ── Cover slide ─────────────────────────────────────────────────────
      const cover = prs.addSlide()
      cover.background = { color: '1A1A1A' }
      addTxt(cover, 'LP構成案', { x: 0, y: 1.8, w: 10, h: 1.0, fontSize: 36, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' })
      addTxt(cover, 'LP.LUS で生成', { x: 0, y: 2.9, w: 10, h: 0.5, fontSize: 14, color: '888888', align: 'center' })
      addTxt(cover, dateJp, { x: 0, y: 5.1, w: 10, h: 0.4, fontSize: 12, color: '888888', align: 'center', fontFace: 'Calibri' })

      // ── Part slides ──────────────────────────────────────────────────────
      selectedIds.forEach((id, idx) => {
        const part = PARTS.find(p => p.id === id)!
        const slide = prs.addSlide()
        slide.background = { color: 'FFFFFF' }
        const num = String(idx + 1).padStart(2, '0')

        // Left column
        addTxt(slide, num,              { x: 0.4, y: 0.4,  w: 3.8, h: 0.3,  fontSize: 11, bold: true, color: '888888', fontFace: 'Calibri' })
        addTxt(slide, part.name,        { x: 0.4, y: 0.75, w: 3.8, h: 0.8,  fontSize: 28, bold: true, color: '1A1A1A' })
        addTxt(slide, part.description, { x: 0.4, y: 1.6,  w: 3.8, h: 0.4,  fontSize: 13, color: '888888' })
        slide.addShape('line', { x: 0.4, y: 2.1,  w: 3.8, h: 0, line: { color: 'DCDCDC', width: 0.75 } })
        addTxt(slide, '実装ガイド',      { x: 0.4, y: 2.25, w: 3.8, h: 0.3,  fontSize: 10, bold: true, color: 'BBBBBB', fontFace: 'Calibri', charSpacing: 1 })
        const bullets = PPTX_BULLETS[id]
        slide.addText(
          bullets.map((b, i) => ({ text: `・${b}`, options: { breakLine: i < bullets.length - 1 } })),
          { x: 0.4, y: 2.65, w: 3.8, h: 2.6, fontSize: 12, color: '1A1A1A', fontFace: 'Meiryo', lineSpacingMultiple: 1.4 }
        )

        // Column divider
        slide.addShape('line', { x: 4.2, y: 0.2, w: 0, h: 5.2, line: { color: 'EBEBEB', width: 0.5 } })

        // Right column: part-specific wireframe shapes
        drawRight(slide, id)

        // Footer branding
        addTxt(slide, 'LP.LUS', { x: 8.5, y: 5.2, w: 1.3, h: 0.3, fontSize: 9, color: 'D4D4D4', align: 'right', fontFace: 'Calibri' })
      })

      // ── Final slide ──────────────────────────────────────────────────────
      const last = prs.addSlide()
      last.background = { color: 'F4F4F4' }
      addTxt(last, '以上',   { x: 0, y: 2.0, w: 10, h: 1.2, fontSize: 24, bold: true, color: '1A1A1A', align: 'center', valign: 'middle' })
      addTxt(last, 'LP.LUS', { x: 0, y: 5.0, w: 10, h: 0.4, fontSize: 12, color: '888888', align: 'center', fontFace: 'Calibri' })

      await prs.writeFile({ fileName: `lp-plan-${dateStr}.pptx` })
    } finally {
      setPptxGenerating(false)
    }
  }

  async function saveAsJpg() {
    const el = lpPreviewRef.current
    if (!el) return
    setJpgSaving(true)
    try {
      const { toJpeg } = await import('html-to-image')
      const now = new Date()
      const dateStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`
      const dataUrl = await toJpeg(el, { quality: 0.95, height: el.scrollHeight })
      const link = document.createElement('a')
      link.download = `lp-preview-${dateStr}.jpg`
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error('[lplus] saveAsJpg error:', e)
    } finally {
      setJpgSaving(false)
    }
  }

  const fontStyle: React.CSSProperties = {
    fontFamily: "'Poppins', 'こぶりなゴシック W3 JIS2004', sans-serif",
    fontWeight: 300,
  }

  return (
    <>
      {/* ── Screen 1 ────────────────────────────────────────────────── */}
      <div className={poppins.variable} style={{ minHeight: 'calc(100vh - 4rem)', background: C.bg, ...fontStyle }}>

        {/* Header */}
        <div className="sticky top-16 z-20 flex items-center justify-between gap-3" style={{ background: C.card, borderBottom: `1px solid ${C.bd}`, padding: '0 40px', height: 60 }}>
          <div className="flex items-baseline" style={{ gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.05em', color: C.main }}>LP.LUS</span>
            <span style={{ fontSize: 12, color: C.hint }}>LPプラス</span>
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <span style={{ border: `1px solid ${C.main}`, background: 'transparent', color: C.main, fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 500 }}>
                選択中 {selectedIds.length}件
              </span>
            )}
            <button
              disabled={selectedIds.length === 0}
              onClick={() => setModalOpen(true)}
              style={{ border: `1px solid ${selectedIds.length === 0 ? C.bd : C.main}`, background: 'transparent', color: selectedIds.length === 0 ? C.bd : C.main, padding: '8px 20px', borderRadius: 2, fontSize: 13, fontWeight: 500, cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition: 'background 0.15s, color 0.15s' }}
              onMouseEnter={e => { if (selectedIds.length > 0) { const el = e.currentTarget as HTMLButtonElement; el.style.background = C.main; el.style.color = C.bg } }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'transparent'; el.style.color = selectedIds.length === 0 ? C.bd : C.main }}
            >
              プレビュー &amp; プロンプト生成 →
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-stretch" style={{ position: 'sticky', top: 124, zIndex: 20, background: C.card, borderBottom: `1px solid ${C.bd}`, padding: '0 40px' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              style={{
                fontSize: 13,
                padding: '14px 0',
                marginRight: 28,
                color: tab.disabled ? C.bd : activeTab === tab.id ? C.main : C.sub,
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: tab.disabled ? 'default' : 'pointer',
                pointerEvents: tab.disabled ? 'none' : 'auto',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? `1px solid ${C.main}` : '1px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content: Font tab or Parts grid */}
        {activeTab === 'font' ? (
          <div style={{ padding: '0 40px 40px' }}>
            {/* Category filter */}
            <div className="flex items-center" style={{ borderBottom: `1px solid ${C.bd}`, marginBottom: 28, overflowX: 'auto' }}>
              {FONT_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFontCategoryFilter(cat)}
                  style={{
                    padding: '14px 16px 13px',
                    fontSize: 12,
                    color: fontCategoryFilter === cat ? C.main : C.sub,
                    fontWeight: fontCategoryFilter === cat ? 600 : 400,
                    background: 'none',
                    border: 'none',
                    borderBottom: fontCategoryFilter === cat ? `2px solid ${C.main}` : '2px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    marginBottom: -1,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Font grid */}
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 24 }}>
              {FONT_LIST
                .filter(f => fontCategoryFilter === 'すべて' || f.category === fontCategoryFilter)
                .map(font => (
                  <FontCard
                    key={font.id}
                    font={font}
                    selected={selectedFontId === font.id}
                    onToggle={() => setSelectedFontId(prev => prev === font.id ? null : font.id)}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ padding: 40, gap: 24 }}>
              {visibleParts.map(part => {
                const Preview  = CARD_PREVIEW_MAP[part.id]
                const selected = selectedIds.includes(part.id)
                return (
                  <div
                    key={part.id}
                    onClick={() => togglePart(part.id)}
                    style={{ background: selected ? C.sel : C.card, border: selected ? `1.5px solid ${C.main}` : `1px solid ${C.bd}`, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', position: 'relative', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLDivElement).style.borderColor = C.main }}
                    onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLDivElement).style.borderColor = C.bd }}
                  >
                    {selected && (
                      <div className="absolute flex items-center justify-center font-bold" style={{ width: 22, height: 22, background: C.main, color: C.bg, borderRadius: '50%', top: 10, right: 10, fontSize: 11, zIndex: 5 }}>✓</div>
                    )}
                    <div style={{ overflow: 'hidden' }}>
                      <Preview />
                    </div>
                    <div className="flex items-center justify-between" style={{ padding: '14px 16px' }} onClick={e => { e.stopPropagation(); togglePart(part.id) }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: C.main }}>{part.name}</p>
                        <p style={{ fontSize: 11, color: C.sub, marginTop: 3 }}>{part.description}</p>
                      </div>
                      <div className="flex items-center justify-center shrink-0 font-bold" style={{ width: 28, height: 28, borderRadius: '50%', border: selected ? `1px solid ${C.main}` : `1px solid ${C.bd}`, background: selected ? C.main : 'transparent', color: selected ? C.bg : C.main, fontSize: 16 }}>
                        {selected ? '✓' : '+'}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* ── Screen 2: Modal ─────────────────────────────────────────── */}
      {modalOpen && (
        <div className={`fixed inset-0 z-50 flex flex-col md:flex-row overflow-hidden ${poppins.variable}`} style={{ background: 'rgba(26,23,20,0.6)', ...fontStyle }}>

          {/* Left panel */}
          <aside className="md:shrink-0 flex flex-col overflow-y-auto scrollbar-hide" style={{ width: '100%', maxWidth: 380, background: C.card, borderRight: `1px solid ${C.bd}` }}>
            <div className="flex flex-col gap-6 p-6 flex-1">
              <div className="flex items-center gap-3">
                <button onClick={() => setModalOpen(false)} className="text-sm transition-colors" style={{ color: C.sub, fontWeight: 500 }} onMouseEnter={e => (e.currentTarget.style.color = C.main)} onMouseLeave={e => (e.currentTarget.style.color = C.sub)}>← 戻る</button>
                <div className="flex items-baseline gap-2 ml-auto">
                  <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.05em', color: C.main }}>LP.LUS</span>
                  <span style={{ fontSize: 10, color: C.hint }}>LPプラス</span>
                </div>
              </div>

              <div>
                <p className="font-bold tracking-widest uppercase mb-3" style={{ fontSize: 10, color: C.hint }}>構成パーツ（ドラッグで並び替え）</p>
                {selectedIds.length === 0 ? (
                  <p className="text-xs text-center py-8" style={{ color: C.hint }}>パーツがありません</p>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={selectedParts.map(sp => String(sp.uid))} strategy={verticalListSortingStrategy}>
                      <div className="flex flex-col gap-2">
                        {selectedParts.map((sp, idx) => {
                          const part = PARTS.find(p => p.id === sp.id)!
                          return (
                            <SortableItem
                              key={sp.uid}
                              uid={sp.uid}
                              partId={sp.id}
                              index={idx}
                              name={part.name}
                              options={sp.options}
                              isExpanded={sp.isExpanded}
                              onRemove={() => removePart(sp.id)}
                              onToggleExpand={() => toggleExpand(sp.uid)}
                              onUpdateOptions={opts => updateOptions(sp.uid, opts)}
                            />
                          )
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: 11, color: '#888888' }}>ページのパス名</label>
                  <input
                    type="text"
                    value={pagePath}
                    onChange={e => setPagePath(e.target.value)}
                    placeholder="例: lp-service, lp-campaign"
                    style={{ width: '100%', border: '1px solid #D4D4D4', borderRadius: 4, padding: '6px 10px', fontSize: 12, color: C.main, background: C.card, outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => (e.currentTarget.style.borderColor = C.main)}
                    onBlur={e => (e.currentTarget.style.borderColor = '#D4D4D4')}
                  />
                </div>
                {selectedFontId && (
                  <div className="flex flex-col gap-1.5">
                    <label style={{ fontSize: 11, color: '#888888' }}>フォント</label>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${C.bd}`, borderRadius: 4, padding: '6px 10px' }}>
                      <span style={{ fontSize: 12, color: C.main, fontWeight: 600 }}>
                        {FONT_LIST.find(f => f.id === selectedFontId)?.name}
                      </span>
                      <button onClick={() => setSelectedFontId(null)} style={{ fontSize: 11, color: C.sub, background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>✕</button>
                    </div>
                  </div>
                )}
                <p className="font-bold tracking-widest uppercase" style={{ fontSize: 10, color: C.hint }}>プロンプト</p>

                <div className="flex items-center gap-2">
                  <div className="flex flex-1" style={{ background: C.muted, border: `1px solid ${C.bd}`, borderRadius: 4, padding: 3, gap: 3 }}>
                    {([
                      { id: 'chat' as const, label: 'Claude向け' },
                      { id: 'code' as const, label: 'Claude Code向け' },
                      { id: 'pptx' as const, label: 'PowerPoint' },
                    ]).map(t => (
                      <button key={t.id} onClick={() => { setPromptTab(t.id); setCopied(false) }} style={{ flex: 1, padding: '6px 0', borderRadius: 2, fontSize: 11, fontWeight: 600, background: promptTab === t.id ? C.card : 'transparent', color: promptTab === t.id ? C.main : C.sub, border: promptTab === t.id ? `1px solid ${C.bd}` : '1px solid transparent' }}>{t.label}</button>
                    ))}
                  </div>
                  <button
                    disabled={selectedIds.length === 0 || jpgSaving}
                    onClick={saveAsJpg}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: C.muted, color: selectedIds.length === 0 || jpgSaving ? C.hint : C.sub, border: `1px solid ${C.bd}`, cursor: selectedIds.length === 0 || jpgSaving ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                    onMouseEnter={e => { if (selectedIds.length > 0 && !jpgSaving) (e.currentTarget as HTMLButtonElement).style.color = C.main }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = selectedIds.length === 0 || jpgSaving ? C.hint : C.sub }}
                  >
                    <Download size={11} />
                    {jpgSaving ? '保存中...' : 'JPGで保存'}
                  </button>
                </div>

                {promptTab !== 'pptx' ? (
                  <>
                    <textarea readOnly value={selectedIds.length > 0 ? promptText : 'パーツを選択するとプロンプトが生成されます'} className="flex-1 scrollbar-hide resize-none focus:outline-none" style={{ minHeight: 200, background: C.muted, border: `1px solid ${C.bd}`, borderRadius: 4, padding: 12, fontFamily: 'monospace', fontSize: 11, color: C.main, lineHeight: 1.8 }} />
                    <button onClick={handleCopy} disabled={selectedIds.length === 0} className="w-full py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors" style={{ background: 'transparent', color: C.main, border: `1px solid ${C.bd}`, borderRadius: 2 }} onMouseEnter={e => { if (selectedIds.length > 0) (e.currentTarget as HTMLButtonElement).style.background = C.muted }} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                      {copied ? 'コピーしました ✓' : 'コピー'}
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 rounded" style={{ background: C.muted, border: `1px solid ${C.bd}`, minHeight: 200, padding: 24 }}>
                    <p style={{ fontSize: 11, color: C.sub, textAlign: 'center', lineHeight: 1.7 }}>
                      選択中のパーツをスライドとして書き出します。<br />
                      表紙・パーツ詳細・最終スライドの{selectedIds.length + 2}枚構成です。
                    </p>
                    <button onClick={generatePptx} disabled={selectedIds.length === 0 || pptxGenerating} className="w-full py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: 'transparent', color: C.main, border: `1px solid ${C.main}`, borderRadius: 2 }} onMouseEnter={e => { if (selectedIds.length > 0 && !pptxGenerating) { const el = e.currentTarget as HTMLButtonElement; el.style.background = C.main; el.style.color = C.bg } }} onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'transparent'; el.style.color = C.main }}>
                      {pptxGenerating ? '生成中...' : 'PowerPoint を書き出す (.pptx)'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right panel */}
          <main
            ref={el => { modalRightRef.current = el }}
            className="flex-1 overflow-y-auto scrollbar-hide"
            style={{ background: C.muted }}
          >
            {/* Font override CSS for preview */}
            {selectedFont && (
              <style dangerouslySetInnerHTML={{ __html:
                `.lplus-preview,.lplus-preview *{font-family:'${selectedFont.name}',sans-serif!important;}`
              }} />
            )}
            {selectedIds.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-24 px-8 gap-4">
                <Layout size={28} color={C.hint} />
                <p style={{ fontSize: 14, fontWeight: 600, color: C.main }}>パーツを選択してください</p>
                <p style={{ fontSize: 12, color: C.hint }}>左のリストにパーツを追加するとここにプレビューが表示されます</p>
              </div>
            ) : (
              <div ref={lpPreviewRef} className="lplus-preview">
                {selectedParts.map(sp => {
                  const Section = SECTION_MAP[sp.id]
                  if (ANIM_IDS.has(sp.id)) return <Section key={sp.uid} options={sp.options} />
                  return (
                    <AnimatedSectionWrapper
                      key={sp.uid}
                      scrollAnimId={activeScrollAnimId}
                      textAnimId={activeTextAnimId}
                      btnAnimId={activeBtnAnimId}
                      rootRef={modalRightRef}
                    >
                      <Section options={sp.options} />
                    </AnimatedSectionWrapper>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      )}
    </>
  )
}
