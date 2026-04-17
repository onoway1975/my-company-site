"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

type StepNum = 1 | 2 | 3 | 4 | 5;
type StepContextValue = {
  step: StepNum;
  setStep: Dispatch<SetStateAction<StepNum>>;
  onReset: (() => void) | null;
  setOnReset: Dispatch<SetStateAction<(() => void) | null>>;
};

const Ctx = createContext<StepContextValue | null>(null);

const STEPS: { num: StepNum; label: string }[] = [
  { num: 1, label: "URL入力" },
  { num: 2, label: "リサーチ" },
  { num: 3, label: "専門家分析" },
  { num: 4, label: "ペルソナ設定" },
  { num: 5, label: "レポート作成" },
];

function StepBar({ step }: { step: StepNum }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        height: 40,
        padding: "0 24px",
        background: "#FFFFFF",
        borderBottom: "1px solid #E0DBD0",
        flexShrink: 0,
        fontSize: 12,
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
    >
      {STEPS.map((s, i) => {
        const isCurrent = s.num === step;
        const isCompleted = s.num < step;

        const badgeBg = isCurrent
          ? "#0D1B2A"
          : isCompleted
            ? "#E8821A"
            : "#E0DBD0";
        const badgeColor = isCurrent || isCompleted ? "#fff" : "#888";
        const labelColor = isCurrent ? "#0D1B2A" : "#888";
        const labelWeight = isCurrent ? 500 : 400;

        return (
          <div
            key={s.num}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: badgeBg,
                color: badgeColor,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {s.num}
            </span>
            <span style={{ color: labelColor, fontWeight: labelWeight }}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <span style={{ color: "#CFCAC0", marginLeft: 4 }}>—</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ResetButton({ onReset, setStep }: { onReset: (() => void) | null; setStep: Dispatch<SetStateAction<StepNum>> }) {
  return (
    <button
      onClick={() => {
        if (onReset) onReset();
        setStep(1);
      }}
      style={{
        marginLeft: "auto",
        padding: "6px 16px",
        fontSize: 12,
        fontWeight: 500,
        border: "1.5px solid #1A1A1A",
        borderRadius: 99,
        background: "transparent",
        color: "#1A1A1A",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      URL入力に戻る
    </button>
  );
}

export function StepProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<StepNum>(1);
  const [onReset, setOnReset] = useState<(() => void) | null>(null);
  return (
    <Ctx.Provider value={{ step, setStep, onReset, setOnReset }}>
      <header
        style={{
          height: 48,
          borderBottom: "1px solid #E0DBD0",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          background: "#F2EFE8",
          flexShrink: 0,
        }}
      >
        <span
          style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.05em" }}
        >
          Renewal Advisor
        </span>
        <span style={{ fontSize: 11, color: "#888", marginLeft: 8 }}>
          by ciraf
        </span>
        <ResetButton onReset={onReset} setStep={setStep} />
      </header>
      <StepBar step={step} />
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function useStep(): StepContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStep must be used within StepProvider");
  return v;
}
