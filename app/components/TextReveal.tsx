"use client";

import { useEffect, useRef, useState } from "react";

type Tag = "h1" | "h2" | "h3" | "p";

type Props = {
  text: string;
  as?: Tag;
  className?: string;
  delayStart?: number;
};

export function TextReveal({ text, as: Tag = "h2", className, delayStart = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const lines = text.split("\n");
  let charIndex = 0;

  return (
    <Tag ref={ref as React.RefObject<never>} className={className} aria-label={text}>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block overflow-hidden">
          {line.split("").map((char) => {
            const delay = delayStart + charIndex++ * 0.04;
            return (
              <span
                key={`${lineIdx}-${charIndex}`}
                aria-hidden="true"
                className="inline-block"
                style={{
                  transform: visible ? "translateY(0)" : "translateY(110%)",
                  transition: "transform 1s cubic-bezier(0.85, 0, 0.15, 1)",
                  transitionDelay: `${delay}s`,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
