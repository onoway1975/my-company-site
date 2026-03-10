import Link from "next/link";
import { Logo } from "./Logo";

function NoteIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="24" height="24" rx="5.5" fill="currentColor" />
      <path
        d="M7 17V7h2.5C9.5 7 11.5 6.5 13 7c2 .5 4 2.5 4 4.5V17h-2.5v-5.5C14.5 10 13.5 9 12 9c-1.5 0-2.5 1-2.5 2.5V17H7z"
        fill="white"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const navItems = [
  { label: "Service", href: "/service", gtmLabel: "service" },
  { label: "About", href: "/about", gtmLabel: "about" },
  { label: "Works", href: "/works", gtmLabel: "works" },
  { label: "Contact", href: "/contact", gtmLabel: "contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white">
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
                  data-gtm-click="phone_link"
                  data-gtm-location="footer"
                  data-gtm-label="03-4540-7546"
                  className="hover:text-ink transition-colors duration-200"
                >
                  03-4540-7546
                </a>
              </span>
              <br />
              FAX&ensp;03-6671-3158
            </address>
          </div>

          {/* Nav + SNS */}
          <div className="flex flex-col gap-8">
            <nav className="flex flex-col md:flex-row gap-6 md:gap-12">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-gtm-click="internal_link"
                  data-gtm-location="footer"
                  data-gtm-label={item.gtmLabel}
                  className="text-xs tracking-[0.15em] text-ink uppercase hover:opacity-60 transition-opacity duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <a
                href="https://note.com/ciraf_inc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Note"
                data-gtm-click="external_link"
                data-gtm-location="footer"
                data-gtm-label="note"
                className="text-ink hover:opacity-60 transition-opacity duration-200"
              >
                <NoteIcon />
              </a>
              <a
                href="https://x.com/ciraf_onoe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                data-gtm-click="external_link"
                data-gtm-location="footer"
                data-gtm-label="x"
                className="text-ink hover:opacity-60 transition-opacity duration-200"
              >
                <XIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-muted">
            &copy; {currentYear} シラフ株式会社 / ciraf inc.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              data-gtm-click="internal_link"
              data-gtm-location="footer"
              data-gtm-label="privacy"
              className="text-xs text-muted hover:text-ink transition-colors duration-200"
            >
              プライバシーポリシー
            </Link>
            <p className="text-xs text-muted italic">
              私たちは、誰よりも、つくりたい人の味方。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
