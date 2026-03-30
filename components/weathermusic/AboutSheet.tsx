'use client'

import { useEffect } from 'react'

interface Props {
  open:    boolean
  onClose: () => void
}

export default function AboutSheet({ open, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ background: 'rgba(26,24,20,.55)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`bg-[#F0EDE8] rounded-t-[28px] w-full max-w-[430px] px-5 pt-5 pb-14 max-h-[88vh] overflow-y-auto transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-8'}`}
      >
        {/* handle */}
        <div className="w-9 h-1 bg-black/15 rounded-full mx-auto mb-6" />

        <h2 className="text-[24px] font-bold tracking-wide mb-6 text-[#1A1814]">About</h2>

        {/* サービス説明 */}
        <Section label="Weather Musicとは">
          <p className="text-sm text-[#1A1814] leading-relaxed">
            今日の天気に合わせて、今日だけのプレイリストを自動でお届けするサービスです。
            晴れの日には明るく弾むような音楽を、雨の日にはしっとりと寄り添う音楽を。
            天気が変われば、音楽も変わります。
          </p>
        </Section>

        {/* 使い方 */}
        <Section label="使い方">
          <div className="flex flex-col gap-3">
            <Step num={1} text="設定から自分の都市を選択してください。" />
            <Step num={2} text="今日の天気に合ったプレイリストが自動で生成されます。" />
            <Step num={3} text="気分に合うムードを設定すると、より好みに近い曲が選ばれます。" />
            <Step num={4} text="▶ ボタンで30秒のプレビューを再生できます。気に入った曲はApple Musicで全曲聴けます。" />
          </div>
        </Section>

        {/* 仕様 */}
        <Section label="仕様">
          <div className="flex flex-col gap-2">
            <SpecRow label="更新タイミング" value="1日1回（日付が変わると新しいプレイリストに）" />
            <SpecRow label="プレビュー" value="各曲30秒（iTunes提供）" />
            <SpecRow label="音楽ソース" value="iTunes Search API" />
            <SpecRow label="天気データ" value="Open-Meteo API" />
          </div>
        </Section>

        {/* クレジット */}
        <Section label="Credit">
          <p className="text-sm text-[#7A7874] leading-relaxed">
            Weather Music は <span className="text-[#1A1814] font-medium">ciraf.jp</span> のコンテンツとして提供しています。
            音楽データは iTunes Search API、天気データは Open-Meteo を利用しています。
          </p>
        </Section>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-[16px] bg-[#1A1814] text-[#F0EDE8] text-[15px] font-semibold mt-2 active:opacity-80 transition-opacity"
        >
          閉じる
        </button>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-[10px] font-semibold tracking-[.14em] uppercase text-[#7A7874] mb-3">{label}</p>
      {children}
    </div>
  )
}

function Step({ num, text }: { num: number; text: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-6 h-6 rounded-full bg-[#1A1814] text-[#F0EDE8] text-[11px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
        {num}
      </div>
      <p className="text-sm text-[#1A1814] leading-relaxed">{text}</p>
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-black/[.06] last:border-0">
      <span className="text-xs text-[#7A7874] flex-shrink-0">{label}</span>
      <span className="text-xs text-[#1A1814] text-right">{value}</span>
    </div>
  )
}
