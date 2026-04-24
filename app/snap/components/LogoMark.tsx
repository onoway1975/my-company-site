"use client";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export default function LogoMark({
  size = 80,
  className,
}: LogoMarkProps) {
  return (
    <img
      src="/snap/logo/logo_mark.png"
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ display: "block" }}
    />
  );
}
