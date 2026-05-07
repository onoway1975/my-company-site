"use client";

import { useState, useCallback } from "react";
import type { BillyFormData } from "./page";

/* ── Option data ── */

const GENDER_OPTIONS = [
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "other", label: "その他" },
];

const ASSETS_OPTIONS = [
  { value: "up_to_100", label: "〜100万円" },
  { value: "100_300", label: "100〜300万円" },
  { value: "300_800", label: "300〜800万円" },
  { value: "800_2000", label: "800〜2,000万円" },
  { value: "2000_5000", label: "2,000〜5,000万円" },
  { value: "over_5000", label: "5,000万円以上" },
];

const TARGET_OPTIONS = [
  { value: "1000_2000", label: "1,000〜2,000万円" },
  { value: "3000_5000", label: "3,000〜5,000万円" },
  { value: "1oku", label: "1億円以上" },
  { value: "no_target", label: "特に決めていない" },
];

const INVEST_OPTIONS = [
  { value: "both", label: "NISA・iDeCo 両方" },
  { value: "nisa_only", label: "NISAのみ" },
  { value: "ideco_only", label: "iDeCoのみ" },
  { value: "none_want", label: "やってない（始めたい）" },
  { value: "none_no_interest", label: "やってない（興味なし）" },
];

/* ── Component ── */

export default function QuestionForm({
  onSubmit,
  error,
}: {
  onSubmit: (data: BillyFormData) => void;
  error: string | null;
}) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [assetsRange, setAssetsRange] = useState("");
  const [targetSavings, setTargetSavings] = useState("");
  const [investmentStatus, setInvestmentStatus] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [lastLuxury, setLastLuxury] = useState("");
  const [anxiety, setAnxiety] = useState("");

  const fields = [
    name, age, gender, assetsRange, targetSavings,
    investmentStatus, hobbies, lastLuxury, anxiety,
  ];
  const filledCount = fields.filter(Boolean).length;
  const totalFields = fields.length;
  const isComplete = filledCount === totalFields;

  const handleSubmit = useCallback(() => {
    if (!isComplete) return;
    onSubmit({
      name: name.trim(),
      age,
      gender,
      assets_range: assetsRange,
      target_savings: targetSavings,
      investment_status: investmentStatus,
      hobbies: hobbies.trim(),
      last_luxury: lastLuxury.trim(),
      anxiety: anxiety.trim(),
    });
  }, [
    isComplete, onSubmit, name, age, gender,
    assetsRange, targetSavings, investmentStatus,
    hobbies, lastLuxury, anxiety,
  ]);

  return (
    <div className="dwz-form">
      <div className="dwz-container">
        {/* Header */}
        <div className="dwz-form-header">
          <div className="dwz-label" style={{ marginBottom: 16 }}>
            financial assessment
          </div>
          <div className="dwz-heading" style={{ fontSize: 22, fontWeight: 700 }}>
            基本情報の入力
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 40 }}>
          <div className="dwz-form-progress-track">
            <div
              className="dwz-form-progress-fill"
              style={{ width: `${(filledCount / totalFields) * 100}%` }}
            />
          </div>
          <div className="dwz-form-progress-text">
            {filledCount} / {totalFields}
          </div>
        </div>

        {/* Q1: Name */}
        <div className="dwz-question">
          <div className="dwz-question-num">Q1</div>
          <div className="dwz-question-title">お名前（ニックネーム可）</div>
          <input
            className="dwz-input"
            type="text"
            placeholder="例: タロウ"
            maxLength={12}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Q2: Age + Gender */}
        <div className="dwz-question">
          <div className="dwz-question-num">Q2</div>
          <div className="dwz-question-title">年齢・性別</div>
          <div className="dwz-input-row" style={{ marginBottom: 16 }}>
            <input
              className="dwz-input"
              type="number"
              placeholder="年齢"
              min={15}
              max={99}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{ maxWidth: 120 }}
            />
            <span style={{ alignSelf: "flex-end", padding: "12px 0", opacity: 0.4 }}>
              歳
            </span>
          </div>
          <div className="dwz-option-grid">
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`dwz-option-btn ${gender === opt.value ? "selected" : ""}`}
                onClick={() => setGender(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q3: Assets range */}
        <div className="dwz-question">
          <div className="dwz-question-num">Q3</div>
          <div className="dwz-question-title">
            現在の総資産（貯蓄・投資含む）
          </div>
          <div className="dwz-option-grid">
            {ASSETS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`dwz-option-btn ${assetsRange === opt.value ? "selected" : ""}`}
                onClick={() => setAssetsRange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q4: Target savings */}
        <div className="dwz-question">
          <div className="dwz-question-num">Q4</div>
          <div className="dwz-question-title">目標貯金額</div>
          <div className="dwz-option-grid">
            {TARGET_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`dwz-option-btn dwz-option-btn-full ${targetSavings === opt.value ? "selected" : ""}`}
                onClick={() => setTargetSavings(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q5: Investment status */}
        <div className="dwz-question">
          <div className="dwz-question-num">Q5</div>
          <div className="dwz-question-title">現在の投資状況</div>
          <div className="dwz-option-grid">
            {INVEST_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`dwz-option-btn dwz-option-btn-full ${investmentStatus === opt.value ? "selected" : ""}`}
                onClick={() => setInvestmentStatus(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q6: Hobbies */}
        <div className="dwz-question">
          <div className="dwz-question-num">Q6</div>
          <div className="dwz-question-title">
            趣味・好きなこと
            <div className="dwz-question-hint">2つ書いてください</div>
          </div>
          <input
            className="dwz-input"
            type="text"
            placeholder="例: ジャズ鑑賞、登山"
            maxLength={40}
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />
        </div>

        {/* Q7: Last luxury */}
        <div className="dwz-question">
          <div className="dwz-question-num">Q7</div>
          <div className="dwz-question-title">最後にした贅沢は？</div>
          <input
            className="dwz-input"
            type="text"
            placeholder="例: 3年前の沖縄旅行"
            maxLength={40}
            value={lastLuxury}
            onChange={(e) => setLastLuxury(e.target.value)}
          />
        </div>

        {/* Q8: Anxiety */}
        <div className="dwz-question">
          <div className="dwz-question-num">Q8</div>
          <div className="dwz-question-title">将来に対する一番の不安</div>
          <input
            className="dwz-input"
            type="text"
            placeholder="例: 老後の生活費が足りるか不安"
            maxLength={50}
            value={anxiety}
            onChange={(e) => setAnxiety(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="dwz-form-error">{error}</div>
        )}

        {/* Submit */}
        <div className="dwz-form-submit">
          <button
            className="dwz-btn-primary"
            disabled={!isComplete}
            onClick={handleSubmit}
          >
            診断結果を見る
          </button>
          <div style={{ marginTop: 12, fontSize: 11, opacity: 0.3 }}>
            ※ 回答内容は診断にのみ使用されます
          </div>
        </div>
      </div>
    </div>
  );
}
