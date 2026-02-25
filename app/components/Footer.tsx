import Link from "next/link";
import { Logo } from "./Logo";

const navItems = [
  { label: "Service", href: "/service" },
  { label: "About", href: "/about" },
  { label: "Works", href: "/works" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-16 mb-20">
          {/* Brand */}
          <div>
            <Link href="/" className="text-ink hover:opacity-70 transition-opacity duration-200 inline-block mb-6">
              <Logo className="h-[20px] w-auto" />
            </Link>
            <p className="text-xs text-muted leading-loose mb-5">
              シラフ株式会社
              <br />
              ciraf inc.
            </p>
            <address className="not-italic text-xs text-muted leading-loose">
              〒150-0001 東京都渋谷区神宮前3-25-18
              <br />
              205 THE SHARE
              <br />
              <span className="inline-block mt-1">
                TEL&ensp;
                <a
                  href="tel:0345407546"
                  className="hover:text-ink transition-colors duration-200"
                >
                  03-4540-7546
                </a>
              </span>
              <br />
              FAX&ensp;03-6671-3158
            </address>
          </div>

          {/* Nav */}
          <nav className="flex flex-col md:flex-row gap-6 md:gap-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted hover:text-ink transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-muted">
            &copy; {currentYear} シラフ株式会社 / ciraf inc.
          </p>
          <p className="text-xs text-muted italic">
            私たちは、誰よりも、つくりたい人の味方。
          </p>
        </div>
      </div>
    </footer>
  );
}
