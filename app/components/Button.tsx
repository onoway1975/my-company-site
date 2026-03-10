import Link from "next/link";

type Props = {
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  [key: string]: unknown;
};

const base =
  "inline-flex items-center gap-2 rounded-full border border-ink bg-ink text-white " +
  "text-[0.8rem] tracking-[0.1em] py-3 px-7 " +
  "hover:bg-white hover:text-ink " +
  "transition-all duration-[250ms] ease group";

function Arrow() {
  return (
    <span className="transition-transform duration-[250ms] ease group-hover:translate-x-[3px]">
      →
    </span>
  );
}

export function Button({
  children,
  href,
  external,
  type = "button",
  disabled,
  onClick,
  className = "",
  ...rest
}: Props) {
  const cls = `${base} ${className}`.trim();

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          {...rest}
        >
          {children}
          <Arrow />
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...(rest as Record<string, unknown>)}>
        {children}
        <Arrow />
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${cls} disabled:opacity-40 disabled:cursor-not-allowed`}
      {...rest}
    >
      {children}
      <Arrow />
    </button>
  );
}
