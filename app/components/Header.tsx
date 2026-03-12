"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const navItems = [
  { label: "Service", labelJa: "サービス", href: "/service", gtmClick: "internal_link", gtmLabel: "service" },
  { label: "About", labelJa: "シラフについて", href: "/about", gtmClick: "internal_link", gtmLabel: "about" },
  { label: "Works", labelJa: "実績", href: "/works", gtmClick: "internal_link", gtmLabel: "works" },
  { label: "Contact", labelJa: "お問い合わせ", href: "/contact", gtmClick: "cta_contact", gtmLabel: "" },
];

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

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_0_#e2e2e2]" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-ink hover:opacity-70 transition-opacity duration-200">
          <Logo className="h-[18px] w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-gtm-click={item.gtmClick}
                  data-gtm-location="header"
                  {...(item.gtmLabel ? { "data-gtm-label": item.gtmLabel } : {})}
                  className={`text-xs tracking-[0.15em] uppercase transition-opacity duration-200 ${
                    isActive ? "text-ink font-bold" : "text-ink hover:opacity-60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://note.com/ciraf_inc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Note"
              data-gtm-click="external_link"
              data-gtm-location="header"
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
              data-gtm-location="header"
              data-gtm-label="x"
              className="text-ink hover:opacity-60 transition-opacity duration-200"
            >
              <XIcon />
            </a>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-10 h-10 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          <span
            className={`block w-5 h-px bg-ink origin-center transition-transform duration-200 ${
              menuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-ink transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-ink origin-center transition-transform duration-200 ${
              menuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-0">
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              data-gtm-click={item.gtmClick}
              data-gtm-location="header"
              {...(item.gtmLabel ? { "data-gtm-label": item.gtmLabel } : {})}
              className={`flex justify-between items-baseline py-5 ${
                i < navItems.length - 1 ? "" : ""
              }`}
            >
              <span className="text-xs tracking-[0.15em] text-ink uppercase">
                {item.label}
              </span>
              <span className="text-xl font-bold text-ink">{item.labelJa}</span>
            </Link>
          ))}
          <div className="flex items-center gap-5 pt-6">
            <a
              href="https://note.com/ciraf_inc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Note"
              data-gtm-click="external_link"
              data-gtm-location="header"
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
              data-gtm-location="header"
              data-gtm-label="x"
              className="text-ink hover:opacity-60 transition-opacity duration-200"
            >
              <XIcon />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
