"use client";

import { useState, useEffect, useCallback, useId } from "react";
import {
  Plus,
  ChevronUp,
  ChevronDown,
  X,
  Download,
  CalendarDays,
  ArrowRight,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import holidaysData from "./holidays.json";

/* ────────────────────────── Holidays ────────────────────────── */

type HolidayEntry = { date: string; name: string };
const holidayEntries = (holidaysData as { holidays: HolidayEntry[] }).holidays;
const HOLIDAYS_SET = new Set(holidayEntries.map((h) => h.date));
const HOLIDAYS_MAP = new Map(holidayEntries.map((h) => [h.date, h.name] as const));

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function isHoliday(d: Date): boolean {
  return HOLIDAYS_SET.has(formatDateKey(d));
}

function getHolidayName(d: Date): string | null {
  return HOLIDAYS_MAP.get(formatDateKey(d)) || null;
}

/* ────────────────────────── Constants ────────────────────────── */

function getPhaseColor(name: string): string {
  if (name.includes("確認")) return "#4A7C59";
  if (name.includes("納品")) return "#1F3864";
  if (name.includes("調整")) return "#888780";
  if (name.includes("WF")) return "#E8901A";
  if (name.includes("デザイン")) return "#C2185B";
  if (name.includes("HTML")) return "#2E75B6";
  return "#FFFFFF";
}

type Phase = {
  id: string;
  name: string;
  self: string;
  other: string;
  days: number;
};

type CalcMode = "forward" | "backward";

type TemplateKey = "empty" | "lp" | "video" | "event" | "hiring";

type TemplateDef = {
  name: string;
  clientLabel: string;
  selfHeader: string;
  phases: Omit<Phase, "id">[];
};

const TEMPLATES: Record<TemplateKey, TemplateDef> = {
  empty: { name: "空（ゼロから作る）", clientLabel: "クライアント様", selfHeader: "LP", phases: [] },
  lp: {
    name: "LP制作",
    clientLabel: "クライアント様",
    selfHeader: "LP",
    phases: [
      { name: "WF", self: "WF制作", other: "", days: 3 },
      { name: "WF確認", self: "", other: "ご確認＆お戻し", days: 2 },
      { name: "WF修正", self: "WF修正", other: "", days: 2 },
      { name: "WF修正確認", self: "", other: "ご確認＆お戻し", days: 2 },
      { name: "デザイン", self: "デザイン", other: "", days: 5 },
      { name: "デザイン確認", self: "", other: "ご確認＆お戻し", days: 2 },
      { name: "修正デザイン①", self: "デザイン修正", other: "", days: 2 },
      { name: "修正①確認", self: "", other: "ご確認＆お戻し", days: 2 },
      { name: "修正デザイン②", self: "デザイン修正", other: "", days: 2 },
      { name: "修正②確認", self: "", other: "ご確認＆お戻し", days: 2 },
      { name: "HTML", self: "HTML/CSS実装", other: "", days: 5 },
      { name: "テスト確認", self: "テストアップ", other: "ご確認＆お戻し", days: 2 },
      { name: "修正①(HTML)", self: "HTML修正", other: "", days: 1 },
      { name: "修正①確認", self: "", other: "ご確認＆お戻し", days: 2 },
      { name: "修正②(HTML)", self: "HTML修正", other: "", days: 1 },
      { name: "修正②確認", self: "", other: "ご確認＆お戻し", days: 2 },
      { name: "調整・FIX", self: "最終調整", other: "", days: 1 },
      { name: "納品", self: "納品", other: "", days: 1 },
    ],
  },
  video: {
    name: "動画制作",
    clientLabel: "クライアント様",
    selfHeader: "動画",
    phases: [
      { name: "企画", self: "企画書作成", other: "", days: 3 },
      { name: "企画確認", self: "", other: "ご確認＆お戻し", days: 2 },
      { name: "絵コンテ", self: "絵コンテ作成", other: "", days: 4 },
      { name: "絵コンテ確認", self: "", other: "ご確認＆お戻し", days: 2 },
      { name: "撮影", self: "撮影", other: "", days: 2 },
      { name: "編集", self: "編集作業", other: "", days: 5 },
      { name: "初稿確認", self: "初稿提出", other: "ご確認＆お戻し", days: 2 },
      { name: "修正①", self: "修正対応", other: "", days: 2 },
      { name: "修正①確認", self: "", other: "ご確認＆お戻し", days: 2 },
      { name: "修正②", self: "修正対応", other: "", days: 1 },
      { name: "納品", self: "納品", other: "", days: 1 },
    ],
  },
  event: {
    name: "イベント準備",
    clientLabel: "主催者様",
    selfHeader: "運営",
    phases: [
      { name: "企画", self: "企画立案", other: "", days: 5 },
      { name: "企画確認", self: "", other: "ご確認＆お戻し", days: 3 },
      { name: "会場手配", self: "会場リサーチ・予約", other: "", days: 7 },
      { name: "集客準備", self: "LP・告知物作成", other: "", days: 10 },
      { name: "集客開始", self: "SNS・広告配信", other: "", days: 14 },
      { name: "運営準備", self: "台本・タイムテーブル", other: "", days: 5 },
      { name: "リハーサル", self: "リハーサル実施", other: "同席", days: 1 },
      { name: "当日", self: "本番運営", other: "当日参加", days: 1 },
    ],
  },
  hiring: {
    name: "採用プロセス",
    clientLabel: "候補者",
    selfHeader: "採用側",
    phases: [
      { name: "書類選考", self: "書類確認", other: "", days: 3 },
      { name: "一次面接調整", self: "日程調整", other: "日程返答", days: 2 },
      { name: "一次面接", self: "面接実施", other: "面接受諾", days: 1 },
      { name: "一次合否連絡", self: "結果連絡", other: "", days: 2 },
      { name: "二次面接調整", self: "日程調整", other: "日程返答", days: 2 },
      { name: "二次面接", self: "面接実施", other: "面接受諾", days: 1 },
      { name: "最終面接", self: "最終面接実施", other: "面接受諾", days: 1 },
      { name: "内定", self: "内定通知", other: "内定承諾", days: 3 },
    ],
  },
};

const LS_KEY = "schedule-data";

/* ────────────────────────── Helpers ────────────────────────── */

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function isBusinessDay(d: Date): boolean {
  const day = d.getDay();
  return day !== 0 && day !== 6 && !isHoliday(d);
}

function nextBusinessDay(d: Date): Date {
  const r = new Date(d);
  do { r.setDate(r.getDate() + 1); } while (!isBusinessDay(r));
  return r;
}

function toBusinessDay(d: Date): Date {
  const r = new Date(d);
  while (!isBusinessDay(r)) r.setDate(r.getDate() + 1);
  return r;
}

function addBusinessDays(start: Date, count: number): Date {
  let d = new Date(start);
  let remaining = count - 1;
  while (remaining > 0) {
    d.setDate(d.getDate() + 1);
    if (isBusinessDay(d)) remaining--;
  }
  return d;
}

function subtractBusinessDays(from: Date, count: number): Date {
  let d = new Date(from);
  let remaining = count;
  while (remaining > 0) {
    d.setDate(d.getDate() - 1);
    if (isBusinessDay(d)) remaining--;
  }
  return d;
}

type SchedulePhase = Phase & { startDate: Date; endDate: Date };
type Schedule = {
  phases: SchedulePhase[];
  startDate: Date;
  endDate: Date;
  totalBusinessDays: number;
  clientLabel: string;
  selfHeader: string;
};

function calcSchedule(
  phases: Phase[],
  dateStr: string,
  mode: CalcMode,
  bufferDays: number,
  addDeliveryRow: boolean,
  clientLabel: string,
  selfHeader: string,
): Schedule | null {
  if (phases.length === 0) return null;
  const baseDate = new Date(dateStr);
  if (isNaN(baseDate.getTime())) return null;

  const totalDays = phases.reduce((s, p) => s + p.days, 0) + bufferDays;

  let start: Date;
  if (mode === "forward") {
    start = toBusinessDay(baseDate);
  } else {
    const deliveryDate = toBusinessDay(baseDate);
    start = subtractBusinessDays(deliveryDate, totalDays - 1);
  }

  const result: SchedulePhase[] = [];
  let cursor = new Date(start);

  for (const phase of phases) {
    if (phase.days <= 0) continue;
    const phaseStart = new Date(cursor);
    const phaseEnd = addBusinessDays(phaseStart, phase.days);
    result.push({ ...phase, startDate: phaseStart, endDate: phaseEnd });
    cursor = nextBusinessDay(phaseEnd);
  }

  if (bufferDays > 0) {
    const bufferStart = new Date(cursor);
    const bufferEnd = addBusinessDays(bufferStart, bufferDays);
    result.push({
      id: uid(),
      name: "バッファ",
      self: "",
      other: "",
      days: bufferDays,
      startDate: bufferStart,
      endDate: bufferEnd,
    });
    cursor = nextBusinessDay(bufferEnd);
  }

  if (addDeliveryRow) {
    const deliveryStart = new Date(cursor);
    result.push({
      id: uid(),
      name: "納品",
      self: "納品",
      other: "",
      days: 1,
      startDate: deliveryStart,
      endDate: deliveryStart,
    });
  }

  const endDate = result.length > 0 ? result[result.length - 1].endDate : start;

  return {
    phases: result,
    startDate: start,
    endDate,
    totalBusinessDays: totalDays + (addDeliveryRow ? 1 : 0),
    clientLabel,
    selfHeader,
  };
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function fmtMD(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function dateToInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ────────────────────────── Excel ────────────────────────── */

function toArgb(hex: string): string {
  return "FF" + hex.replace("#", "").toUpperCase();
}

function lightenColor(hex: string, amount = 0.7): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const newR = Math.round(r + (255 - r) * amount);
  const newG = Math.round(g + (255 - g) * amount);
  const newB = Math.round(b + (255 - b) * amount);
  return [newR, newG, newB].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

async function generateExcel(
  schedule: Schedule,
  projectName: string,
) {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();

  /* ── Sheet 1 ── */
  const ws = wb.addWorksheet("全体schedule");
  ws.properties.defaultRowHeight = 15;

  const colWidths = [5.75, 6.5, 4.5, 8.5, 28.25, 37.0, 37.0];
  colWidths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });

  const baseFont = { name: "Arial", size: 8 };
  const boldFont = { ...baseFont, bold: true };
  const whiteFont = { ...baseFont, color: { argb: "FFFFFFFF" }, bold: true };

  // Project name row
  const projRow = ws.addRow([projectName, "", "", "", "", "", ""]);
  ws.mergeCells("A1:D1");
  projRow.getCell(1).font = { name: "Arial", size: 12, bold: true, color: { argb: "FF1A1A1A" } };
  projRow.getCell(1).alignment = { vertical: "middle", horizontal: "left" };
  projRow.height = 25;

  // Header row
  const headerRow = ws.addRow(["", "日付", "曜日", "お打ち合わせ希望", schedule.clientLabel, schedule.selfHeader, "備考"]);
  headerRow.height = 23.25;
  headerRow.eachCell((cell, colNumber) => {
    cell.font = boldFont;
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF999999" } },
    };
    if (colNumber === 5) {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF073763" } };
      cell.font = whiteFont;
    } else if (colNumber === 6) {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD0E0E3" } };
    }
  });

  // Build day-by-day schedule map
  type DayInfo = { self: string; other: string; phaseName: string; isDelivery: boolean };
  const dayMap = new Map<string, DayInfo>();

  for (const phase of schedule.phases) {
    const cursor = new Date(phase.startDate);
    const end = new Date(phase.endDate);
    const businessDays: Date[] = [];

    while (cursor <= end) {
      if (isBusinessDay(cursor)) {
        businessDays.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    businessDays.forEach((d, i) => {
      const key = dateToInput(d);
      let selfText = "";
      let otherText = "";

      if (phase.self) {
        if (businessDays.length === 1) {
          selfText = phase.self;
        } else if (i === 0) {
          selfText = phase.name;
        } else if (i === businessDays.length - 1) {
          selfText = `${phase.name}提出`;
        } else {
          selfText = "↓";
        }
      }
      if (phase.other) {
        if (businessDays.length === 1) {
          otherText = phase.other;
        } else if (i === 0) {
          otherText = phase.other;
        } else if (i === businessDays.length - 1) {
          otherText = phase.other;
        } else {
          otherText = "↓";
        }
      }

      dayMap.set(key, {
        self: selfText,
        other: otherText,
        phaseName: phase.name,
        isDelivery: phase.name === "納品",
      });
    });
  }

  // Generate rows for each day
  const current = new Date(schedule.startDate);
  const end = new Date(schedule.endDate);
  let lastMonth = -1;

  while (current <= end) {
    const month = current.getMonth() + 1;
    const monthLabel = month !== lastMonth ? `${month}月` : "";
    lastMonth = month;

    const key = dateToInput(current);
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const holidayName = getHolidayName(current);
    const isNonBusiness = isWeekend || !!holidayName;
    const info = dayMap.get(key);

    const row = ws.addRow([
      monthLabel,
      new Date(current),
      "", // formula below
      "",
      isNonBusiness ? "" : (info?.other || ""),
      isNonBusiness ? "" : (info?.self || ""),
      "",
    ]);

    // Date format
    row.getCell(2).numFmt = "M/D";

    // Weekday formula
    row.getCell(3).value = { formula: `TEXT(B${row.number},"aaa")` } as unknown as string;

    row.eachCell((cell) => {
      cell.font = baseFont;
      cell.alignment = { vertical: "middle" };
    });

    if (isNonBusiness) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9D9D9" } };
      });
      if (holidayName) {
        row.getCell(5).value = holidayName;
        row.getCell(5).font = { ...baseFont, color: { argb: "FFCC0000" } };
      }
    } else if (info) {
      if (info.isDelivery) {
        row.getCell(6).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F3864" } };
        row.getCell(6).font = whiteFont;
      } else {
        const phaseColor = getPhaseColor(info.phaseName);
        const lightArgb = phaseColor !== "#FFFFFF" ? "FF" + lightenColor(phaseColor, 0.7) : null;
        if (info.self) {
          row.getCell(6).font = boldFont;
          if (lightArgb) {
            row.getCell(6).fill = { type: "pattern", pattern: "solid", fgColor: { argb: lightArgb } };
          }
        }
        if (info.other) {
          row.getCell(5).font = boldFont;
          if (lightArgb) {
            row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: lightArgb } };
          }
        }
      }
    }

    // Thin borders
    row.eachCell((cell) => {
      cell.border = {
        bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
      };
    });

    current.setDate(current.getDate() + 1);
  }

  /* ── Sheet 2 ── */
  const memo = wb.addWorksheet("メモ");
  memo.getColumn(2).width = 16;
  memo.getColumn(3).width = 32;
  memo.getCell("B2").value = "ご確認事項";
  memo.getCell("B2").font = boldFont;
  memo.getCell("B3").value = "プロジェクト名";
  memo.getCell("B3").font = baseFont;
  memo.getCell("C3").value = projectName;
  memo.getCell("C3").font = baseFont;
  memo.getCell("B4").value = "納品日";
  memo.getCell("B4").font = baseFont;
  memo.getCell("C4").value = fmtDate(schedule.endDate);
  memo.getCell("C4").font = baseFont;

  /* ── Download ── */
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName || "schedule"}_schedule.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ────────────────────────── Component ────────────────────────── */

export default function LpSchedulePage() {
  const formId = useId();

  const [projectName, setProjectName] = useState("");
  const [clientLabel, setClientLabel] = useState("クライアント様");
  const [calcMode, setCalcMode] = useState<CalcMode>("forward");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [templateKey, setTemplateKey] = useState<TemplateKey>("empty");
  const [phases, setPhases] = useState<Phase[]>([]);
  const [bufferDays, setBufferDays] = useState(1);
  const [addDeliveryRow, setAddDeliveryRow] = useState(true);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [mounted, setMounted] = useState(false);

  // localStorage restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.projectName) setProjectName(data.projectName);
        if (data.clientLabel) setClientLabel(data.clientLabel);
        if (data.calcMode) setCalcMode(data.calcMode);
        if (data.startDate) setStartDate(data.startDate);
        if (data.endDate) setEndDate(data.endDate);
        if (data.phases?.length) setPhases(data.phases);
        if (typeof data.bufferDays === "number") setBufferDays(data.bufferDays);
        if (typeof data.addDeliveryRow === "boolean") setAddDeliveryRow(data.addDeliveryRow);
      }
    } catch { /* ignore */ }
    setMounted(true);
  }, []);

  // localStorage save
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ projectName, clientLabel, calcMode, startDate, endDate, phases, bufferDays, addDeliveryRow }),
      );
    } catch { /* ignore */ }
  }, [mounted, projectName, clientLabel, calcMode, startDate, endDate, phases, bufferDays, addDeliveryRow]);

  // Template switch
  const handleTemplateChange = useCallback((key: TemplateKey) => {
    setTemplateKey(key);
    const tmpl = TEMPLATES[key];
    setClientLabel(tmpl.clientLabel);
    setPhases(tmpl.phases.map((p) => ({ ...p, id: uid() })));
    setSchedule(null);
  }, []);

  // Phase CRUD
  const addPhase = useCallback(() => {
    setPhases((prev) => [
      ...prev,
      { id: uid(), name: "", self: "", other: "", days: 1 },
    ]);
  }, []);

  const removePhase = useCallback((id: string) => {
    setPhases((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePhase = useCallback((id: string, field: keyof Phase, value: string | number) => {
    setPhases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  }, []);

  const movePhase = useCallback((index: number, dir: -1 | 1) => {
    setPhases((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  // Generate
  const handleGenerate = useCallback(() => {
    if (!projectName.trim()) { alert("プロジェクト名を入力してください"); return; }
    const dateStr = calcMode === "forward" ? startDate : endDate;
    if (!dateStr) { alert("日付を入力してください"); return; }
    if (phases.length === 0) { alert("フェーズを追加してください"); return; }

    const selfHeader = TEMPLATES[templateKey].selfHeader;
    const result = calcSchedule(phases, dateStr, calcMode, bufferDays, addDeliveryRow, clientLabel, selfHeader);
    if (result) {
      setSchedule(result);
      setTimeout(() => {
        document.getElementById("schedule-preview")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [projectName, calcMode, startDate, endDate, phases, bufferDays, addDeliveryRow, clientLabel, templateKey]);

  // Excel
  const handleExcel = useCallback(() => {
    if (!schedule) return;
    generateExcel(schedule, projectName);
  }, [schedule, projectName]);

  if (!mounted) {
    return (
      <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
        <style jsx global>{`
          header, footer { display: none !important; }
          main { padding-top: 0 !important; }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        header, footer { display: none !important; }
        main { padding-top: 0 !important; }
        @font-face {
          font-family: 'LINE Seed JP';
          src: url('/fonts/LINESeedJP_OTF_Bd.woff2') format('woff2');
          font-weight: 700;
          font-display: swap;
        }
      `}</style>
      <style jsx>{`
        .lps-page {
          --bg-page: #FFFFFF;
          --bg-card: #FFFFFF;
          --bg-input: #FFFFFF;
          --bg-muted: #F8F8F8;
          --border: #E5E5E5;
          --border-focus: #1A1A1A;
          --text: #1A1A1A;
          --text-sub: #666666;
          --text-muted: #AAAAAA;
          --accent: #1A1A1A;
          --accent-text: #FFFFFF;
          --accent-hover: #333333;
          --weekend: #F5F5F5;
          --delivery-bg: #1F3864;
          --delivery-text: #FFFFFF;

          background: var(--bg-page);
          color: var(--text);
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
          font-size: 14px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .lps-wrap {
          max-width: 720px;
          margin: 0 auto;
          padding: 32px 20px 80px;
        }
        .lps-title {
          font-family: 'LINE Seed JP', sans-serif;
          font-weight: 700;
          font-size: 24px;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .lps-sub {
          color: var(--text-sub);
          font-size: 13px;
          margin-bottom: 32px;
        }
        .lps-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 16px;
        }
        .lps-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-sub);
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }
        .lps-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 12px;
          color: var(--text);
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .lps-input:focus-visible {
          border-color: var(--border-focus);
        }
        .lps-input::placeholder {
          color: var(--text-muted);
        }
        .lps-select {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 12px;
          color: var(--text);
          font-size: 14px;
          font-family: inherit;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M2 4l4 4 4-4'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }
        .lps-select:focus-visible {
          border-color: var(--border-focus);
        }
        .lps-row {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }
        .lps-row > * {
          flex: 1;
        }
        .lps-toggle-group {
          display: flex;
          gap: 0;
          background: var(--bg-muted);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .lps-toggle-btn {
          flex: 1;
          padding: 10px;
          background: transparent;
          border: none;
          color: var(--text-sub);
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .lps-toggle-btn[data-active="true"] {
          background: var(--accent);
          color: var(--accent-text);
          font-weight: 600;
        }
        .phase-actions { opacity: 0; transition: opacity 0.15s; }
        .phase-card:hover .phase-actions { opacity: 1; }
        @media (hover: none) { .phase-actions { opacity: 1; } }
        .lps-add-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          height: 44px;
          background: #FFFFFF;
          border: 1px dashed #CCCCCC;
          border-radius: 8px;
          color: #666666;
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.15s, color 0.15s;
        }
        .lps-add-btn:hover {
          background: #F8F8F8;
          color: #1A1A1A;
        }
        .lps-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'LINE Seed JP', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
        }
        .lps-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .lps-btn-primary {
          background: var(--accent);
          color: var(--accent-text);
        }
        .lps-btn-primary:hover:not(:disabled) {
          background: var(--accent-hover);
        }
        .lps-btn-secondary {
          background: var(--bg-muted);
          border: 1px solid var(--border);
          color: var(--text);
        }
        .lps-btn-secondary:hover:not(:disabled) {
          background: var(--border);
        }
        .lps-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }
        .lps-summary-item {
          padding: 12px;
          background: var(--bg-muted);
          border-radius: 8px;
        }
        .lps-summary-label {
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .lps-summary-value {
          font-size: 16px;
          font-weight: 600;
          font-family: "SF Mono", "Menlo", monospace;
        }
        .lps-timeline {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .lps-timeline th {
          text-align: left;
          padding: 8px;
          font-size: 11px;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }
        .lps-timeline td {
          padding: 8px;
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }
        .lps-timeline tr[data-delivery="true"] td {
          background: var(--delivery-bg);
          color: var(--delivery-text);
          font-weight: 600;
        }
        .lps-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 6px;
          vertical-align: middle;
          flex-shrink: 0;
        }
        .lps-section {
          margin-top: 48px;
        }
        .lps-section-title {
          font-family: 'LINE Seed JP', sans-serif;
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 16px;
        }
        .lps-prose {
          color: var(--text-sub);
          font-size: 14px;
          line-height: 1.8;
        }
        .lps-prose h3 {
          color: var(--text);
          font-family: 'LINE Seed JP', sans-serif;
          font-weight: 700;
          font-size: 16px;
          margin: 32px 0 12px;
        }
        .lps-prose p {
          margin-bottom: 16px;
        }
        .lps-prose ul {
          padding-left: 20px;
          margin-bottom: 16px;
        }
        .lps-prose li {
          margin-bottom: 8px;
        }
        .lps-prose strong {
          color: var(--text);
        }
        .lps-check-row {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .lps-check-row input[type="checkbox"] {
          accent-color: var(--accent);
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
        @media (max-width: 600px) {
          .lps-summary {
            grid-template-columns: 1fr;
          }
          .lps-timeline-wrap {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .lps-phase-detail-card {
            flex-direction: column;
            gap: 6px;
          }
        }
      `}</style>

      <div className="lps-page">
        <div className="lps-wrap">
          {/* Title */}
          <h1 className="lps-title">スケジュールメーカー</h1>
          <p className="lps-sub">営業日ベースで予定を組み立てて、Excelに書き出すツール</p>

          {/* Basic Info */}
          <div className="lps-card">
            <div className="lps-row">
              <div>
                <label className="lps-label" htmlFor={`${formId}-project`}>プロジェクト名</label>
                <input
                  id={`${formId}-project`}
                  className="lps-input"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="例）ABCコーポレーション LP"
                />
              </div>
              <div>
                <label className="lps-label" htmlFor={`${formId}-client`}>相手側の呼び名</label>
                <input
                  id={`${formId}-client`}
                  className="lps-input"
                  value={clientLabel}
                  onChange={(e) => setClientLabel(e.target.value)}
                  placeholder="クライアント様"
                />
              </div>
            </div>

            {/* Calc mode */}
            <label className="lps-label">計算モード</label>
            <div className="lps-toggle-group">
              <button
                type="button"
                className="lps-toggle-btn"
                data-active={calcMode === "forward"}
                onClick={() => setCalcMode("forward")}
              >
                <ArrowRight size={16} />
                開始日から順算
              </button>
              <button
                type="button"
                className="lps-toggle-btn"
                data-active={calcMode === "backward"}
                onClick={() => setCalcMode("backward")}
              >
                <ArrowLeft size={16} />
                納品日から逆算
              </button>
            </div>

            <div style={{ marginBottom: 0 }}>
              <label className="lps-label" htmlFor={`${formId}-date`}>
                {calcMode === "forward" ? "開始日" : "納品日"}
              </label>
              <input
                id={`${formId}-date`}
                type="date"
                className="lps-input"
                style={{ maxWidth: 200 }}
                value={calcMode === "forward" ? startDate : endDate}
                onChange={(e) =>
                  calcMode === "forward"
                    ? setStartDate(e.target.value)
                    : setEndDate(e.target.value)
                }
              />
            </div>
          </div>

          {/* Template */}
          <div className="lps-card">
            <label className="lps-label" htmlFor={`${formId}-template`}>テンプレート</label>
            <select
              id={`${formId}-template`}
              className="lps-select"
              value={templateKey}
              onChange={(e) => handleTemplateChange(e.target.value as TemplateKey)}
            >
              {(Object.keys(TEMPLATES) as TemplateKey[]).map((key) => (
                <option key={key} value={key}>{TEMPLATES[key].name}</option>
              ))}
            </select>
          </div>

          {/* Phase List */}
          <div className="lps-card">
            <label className="lps-label" style={{ marginBottom: 12 }}>フェーズ</label>
            <div className="lps-phase-list">
              {phases.map((phase, i) => (
                <PhaseRow
                  key={phase.id}
                  phase={phase}
                  index={i}
                  total={phases.length}
                  onUpdate={updatePhase}
                  onMove={movePhase}
                  onRemove={removePhase}
                />
              ))}
            </div>
            <button type="button" className="lps-add-btn" onClick={addPhase}>
              <Plus size={14} /> フェーズを追加
            </button>
          </div>

          {/* Settings */}
          <div className="lps-card">
            <label className="lps-label">詳細設定</label>
            <div className="lps-row" style={{ alignItems: "flex-end" }}>
              <div>
                <label className="lps-label" htmlFor={`${formId}-buffer`}>納品前バッファ（営業日）</label>
                <input
                  id={`${formId}-buffer`}
                  type="number"
                  className="lps-input"
                  style={{ maxWidth: 100, textAlign: "center", fontFamily: '"SF Mono", "Menlo", monospace' }}
                  value={bufferDays}
                  min={0}
                  max={30}
                  onChange={(e) => setBufferDays(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <div style={{ paddingBottom: 2 }}>
                <label className="lps-check-row">
                  <input
                    type="checkbox"
                    checked={addDeliveryRow}
                    onChange={(e) => setAddDeliveryRow(e.target.checked)}
                  />
                  <span style={{ fontSize: 13, color: "var(--text-sub)" }}>納品行を追加</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            <button
              type="button"
              className="lps-btn lps-btn-primary"
              onClick={handleGenerate}
              disabled={phases.length === 0}
            >
              <CalendarDays size={18} />
              スケジュールを生成
            </button>
            {schedule && (
              <button
                type="button"
                className="lps-btn lps-btn-secondary"
                onClick={handleExcel}
              >
                <Download size={18} />
                Excelで出力
              </button>
            )}
          </div>

          {/* Preview */}
          {schedule && (
            <div id="schedule-preview" className="lps-card" style={{ marginTop: 8 }}>
              <div className="lps-summary">
                <div className="lps-summary-item">
                  <div className="lps-summary-label">開始日</div>
                  <div className="lps-summary-value">{fmtDate(schedule.startDate)}</div>
                </div>
                <div className="lps-summary-item">
                  <div className="lps-summary-label">納品日</div>
                  <div className="lps-summary-value">{fmtDate(schedule.endDate)}</div>
                </div>
                <div className="lps-summary-item">
                  <div className="lps-summary-label">合計営業日数</div>
                  <div className="lps-summary-value">{schedule.totalBusinessDays}日</div>
                </div>
                <div className="lps-summary-item">
                  <div className="lps-summary-label">相手側</div>
                  <div className="lps-summary-value" style={{ fontFamily: "inherit", fontSize: 14 }}>{schedule.clientLabel}</div>
                </div>
              </div>

              {(() => {
                const holidays: { date: Date; name: string }[] = [];
                const cur = new Date(schedule.startDate);
                const endD = new Date(schedule.endDate);
                while (cur <= endD) {
                  const hName = getHolidayName(cur);
                  if (hName) holidays.push({ date: new Date(cur), name: hName });
                  cur.setDate(cur.getDate() + 1);
                }
                if (holidays.length === 0) return null;
                return (
                  <div style={{ marginBottom: 12, padding: "8px 12px", background: "#FFF8F0", borderRadius: 6, border: "1px solid #F0E0D0", fontSize: 13, color: "#666666" }}>
                    <span style={{ fontWeight: 600, color: "#CC0000", marginRight: 8 }}>祝日除外</span>
                    {holidays.map((h, i) => (
                      <span key={i} style={{ marginRight: 12 }}>
                        {fmtMD(h.date)}({WEEKDAYS[h.date.getDay()]}) {h.name}
                      </span>
                    ))}
                  </div>
                );
              })()}

              <div className="lps-timeline-wrap">
                <table className="lps-timeline">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>フェーズ</th>
                      <th>{schedule.selfHeader}</th>
                      <th>{schedule.clientLabel}</th>
                      <th>開始</th>
                      <th>終了</th>
                      <th>日数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.phases.map((p, i) => (
                      <tr key={p.id} data-delivery={p.name === "納品" ? "true" : undefined}>
                        <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                        <td>
                          <span className="lps-dot" style={{ background: getPhaseColor(p.name), border: getPhaseColor(p.name) === "#FFFFFF" ? "1px solid #CCCCCC" : "none" }} />
                          {p.name}
                        </td>
                        <td>{p.self || "—"}</td>
                        <td>{p.other || "—"}</td>
                        <td style={{ fontFamily: '"SF Mono", "Menlo", monospace' }}>{fmtMD(p.startDate)}</td>
                        <td style={{ fontFamily: '"SF Mono", "Menlo", monospace' }}>{fmtMD(p.endDate)}</td>
                        <td style={{ fontFamily: '"SF Mono", "Menlo", monospace', textAlign: "center" }}>{p.days}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* How-to Section */}
          <div className="lps-section">
            <h2 className="lps-section-title">使い方</h2>
            <div className="lps-prose">
              <h3>このツールについて</h3>
              <p>
                LP Schedule は、営業日ベースでプロジェクトのスケジュールを自動計算し、
                実務でそのまま使えるExcelファイルとして出力できる無料ツールです。
              </p>
              <p>
                LP制作・動画制作・イベント準備・採用プロセスなど、あらゆるプロジェクトに対応。
                「開始日から順算」と「納品日から逆算」の2つのモードで、柔軟にスケジュールを組み立てられます。
              </p>

              <h3>3ステップで完成</h3>
              <ul>
                <li>
                  <strong>① 基本情報を入れる</strong> — プロジェクト名、相手側の呼び名、開始日 or 納品日を入力します。
                </li>
                <li>
                  <strong>② テンプレートを選んで編集</strong> — LP制作・動画制作など、プロジェクトに近いテンプレートを選択。
                  フェーズの追加・削除・日数変更は自由にできます。
                </li>
                <li>
                  <strong>③ Excelで出力</strong> — 「スケジュールを生成」でプレビューを確認したら、「Excelで出力」でダウンロード。
                  そのまま社内共有やクライアント提出に使えます。
                </li>
              </ul>

              <h3>どんな場面で使えるか</h3>
              <ul>
                <li>LP・Webサイト制作の工程管理</li>
                <li>動画制作の進行スケジュール</li>
                <li>イベント・セミナーの準備タイムライン</li>
                <li>採用プロセスの日程管理</li>
                <li>社内プロジェクトのタスクスケジュール</li>
                <li>フリーランスのクライアント提出用スケジュール表</li>
              </ul>

              <h3>よくある質問</h3>
              <p>
                <strong>Q. 祝日は考慮されますか？</strong><br />
                現在は土日のみを休日として計算します。祝日は含まれませんので、必要に応じてバッファ日数で調整してください。
              </p>
              <p>
                <strong>Q. 入力した内容は保存されますか？</strong><br />
                ブラウザのlocalStorageに自動保存されます。リロードしても入力内容は消えません。ただし、ブラウザのデータを消去すると失われます。
              </p>
              <p>
                <strong>Q. スマホでも使えますか？</strong><br />
                はい、スマホ・タブレット・PCすべてで使えます。Excel出力もそのままダウンロードできます。
              </p>
              <p>
                <strong>Q. 無料ですか？</strong><br />
                完全無料です。ユーザー登録も不要です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ────────────────────────── PhaseRow ────────────────────────── */

const iconBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#AAAAAA",
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
};

function PhaseRow({
  phase,
  index,
  total,
  onUpdate,
  onMove,
  onRemove,
}: {
  phase: Phase;
  index: number;
  total: number;
  onUpdate: (id: string, field: keyof Phase, value: string | number) => void;
  onMove: (index: number, dir: -1 | 1) => void;
  onRemove: (id: string) => void;
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  const dotColor = getPhaseColor(phase.name);

  return (
    <div>
      {/* Main card */}
      <div
        className="phase-card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          border: "1px solid #E5E5E5",
          borderRadius: "8px",
          background: "#FFFFFF",
          marginBottom: detailOpen ? "4px" : "8px",
          minHeight: "52px",
          boxSizing: "border-box",
        }}
      >
        {/* 1. Color dot (auto-assigned by phase name) */}
        <span
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: dotColor,
            border: dotColor === "#FFFFFF" ? "1px solid #CCCCCC" : "none",
            flexShrink: 0,
          }}
        />

        {/* 2. Phase name */}
        <input
          type="text"
          value={phase.name}
          onChange={(e) => onUpdate(phase.id, "name", e.target.value)}
          placeholder="フェーズ名"
          aria-label="フェーズ名"
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            background: "transparent",
            fontSize: "14px",
            color: "#1A1A1A",
            outline: "none",
            padding: 0,
            fontFamily: "inherit",
          }}
        />

        {/* 3. Days input */}
        <input
          type="number"
          value={phase.days}
          min={0}
          max={30}
          onChange={(e) => onUpdate(phase.id, "days", Math.max(0, parseInt(e.target.value) || 0))}
          aria-label="営業日数"
          style={{
            width: "60px",
            height: "32px",
            textAlign: "center",
            border: "1px solid #E5E5E5",
            borderRadius: "6px",
            fontSize: "14px",
            fontFamily: '"SF Mono", "Menlo", monospace',
            color: "#1A1A1A",
            background: "#FFFFFF",
            outline: "none",
            flexShrink: 0,
            boxSizing: "border-box",
          }}
        />

        {/* 4. 日間 label */}
        <span style={{ color: "#666666", fontSize: "13px", flexShrink: 0 }}>日間</span>

        {/* 5. Actions (hover only) */}
        <div
          className="phase-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          <button type="button" style={iconBtnStyle} onClick={() => setDetailOpen((v) => !v)} aria-label="詳細">
            <MoreVertical size={16} />
          </button>
          <button type="button" style={iconBtnStyle} onClick={() => onMove(index, -1)} disabled={index === 0} aria-label="上に移動">
            <ChevronUp size={14} />
          </button>
          <button type="button" style={iconBtnStyle} onClick={() => onMove(index, 1)} disabled={index === total - 1} aria-label="下に移動">
            <ChevronDown size={14} />
          </button>
          <button type="button" style={iconBtnStyle} onClick={() => onRemove(phase.id)} aria-label="削除">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Detail accordion */}
      {detailOpen && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            padding: "12px 16px",
            border: "1px solid #E5E5E5",
            borderRadius: "8px",
            background: "#FFFFFF",
            marginBottom: "8px",
          }}
        >
          <input
            value={phase.self}
            onChange={(e) => onUpdate(phase.id, "self", e.target.value)}
            placeholder="自分側タスク名"
            aria-label="自分側タスク"
            style={{
              flex: 1,
              minWidth: 0,
              border: "1px solid #E5E5E5",
              borderRadius: "6px",
              padding: "8px 10px",
              fontSize: "13px",
              color: "#1A1A1A",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <input
            value={phase.other}
            onChange={(e) => onUpdate(phase.id, "other", e.target.value)}
            placeholder="相手側タスク名"
            aria-label="相手側タスク"
            style={{
              flex: 1,
              minWidth: 0,
              border: "1px solid #E5E5E5",
              borderRadius: "6px",
              padding: "8px 10px",
              fontSize: "13px",
              color: "#1A1A1A",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <button
            type="button"
            onClick={() => setDetailOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "#AAAAAA",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "inherit",
              padding: "4px",
              flexShrink: 0,
            }}
          >
            閉じる
          </button>
        </div>
      )}
    </div>
  );
}
