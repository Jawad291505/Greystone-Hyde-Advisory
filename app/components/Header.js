"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const links = [
  { href: "#services", label: "Services" },
  { href: "#why-us", label: "Why us" },
  { href: "#process", label: "Process" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background,border-color,backdrop-filter] duration-500 ${
        solid
          ? "border-foreground/10 bg-background/70 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[padding] duration-500 sm:px-6 lg:px-10 ${
          scrolled ? "py-3" : "py-4 sm:py-6"
        }`}
      >
        <a href="#" className="flex items-center gap-3">
          {/* Fixed white, not theme-linked: the logo mark is a fixed navy and needs a light plate in both themes */}
          <span className="grid h-10 w-10 place-items-center rounded-md bg-white">
            <Image src="/logo.svg" alt="" width={28} height={28} priority />
          </span>
          <span className="text-xs font-medium tracking-[0.16em] uppercase sm:text-sm sm:tracking-[0.18em]">
            Greystone Hyde
          </span>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden border border-foreground/15 px-5 py-2.5 text-sm transition-colors hover:border-brand hover:text-brand sm:block"
          >
            Get Started
          </a>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center border border-foreground/15 md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-foreground transition-all ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-foreground transition-all ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-foreground/10 px-6 pb-6 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-foreground/[0.06] py-4 font-display text-2xl"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-6 block bg-logo-blue py-4 text-center text-sm font-medium text-white"
          >
            Get Started
          </a>
        </nav>
      )}
    </header>
  );
}
