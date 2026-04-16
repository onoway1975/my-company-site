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

export function StepProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<StepNum>(1);
  return (
    <Ctx.Provider value={{ step, setStep }}>
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
