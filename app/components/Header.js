"use client";

import Image from "next/image";
import Link from "./ThemeLink";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MagneticButton from "./MagneticButton";

const links = [
  { href: "/services", label: "Services" },
  { href: "/#why-us", label: "Why us" },
  { href: "/#approach", label: "Approach" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
];

// Each row of the mobile nav rises in turn as it opens (opacity and transform
// only), and they all leave together.
const row = (open) =>
  `transition-[opacity,translate] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
    open ? "translate-y-0 opacity-100 duration-500" : "translate-y-4 opacity-0 duration-200"
  }`;
const stagger = (open, i) => ({ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" });

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navigating closes the menu (adjusted during render, not in an effect)
  const [seen, setSeen] = useState(pathname);
  if (seen !== pathname) {
    setSeen(pathname);
    setOpen(false);
  }

  // While the full-screen mobile nav is open: lock page scroll, close on
  // Escape, and close if the screen grows into the desktop layout
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onWide = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [open]);

  // The header is a bar of its own, floating clear of the page: a white
  // capsule with a hairline border and a soft shadow, so it reads as separate
  // from whatever passes beneath it, at the top of the page as much as
  // mid-scroll. Scrolling only firms it up (more opaque, deeper shadow).
  //
  // The header element itself takes no pointer events and no filter: the gaps
  // either side of the bar stay clickable, and the full-screen mobile nav (a
  // fixed child) is not trapped inside a filtered ancestor.
  //
  // The frosted backdrop is for wide screens only. A backdrop blur on a fixed
  // bar is re-rendered on every scrolled frame, which phones pay for in
  // dropped frames, so there the bar is simply near-opaque.
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 text-ink sm:px-5 sm:pt-4">
      <div
        className={`pointer-events-auto mx-auto flex max-w-[88rem] items-center justify-between rounded-full border py-2 pr-2 pl-5 transition-[background-color,border-color,box-shadow] duration-500 sm:py-2.5 sm:pr-2.5 sm:pl-7 ${
          open
            ? "border-navy/10 bg-white shadow-none"
            : scrolled
              ? "border-navy/15 bg-white/[0.97] shadow-[0_22px_44px_-22px_color-mix(in_srgb,var(--ink)_55%,transparent)] lg:bg-white/95 lg:backdrop-blur-md"
              : "border-navy/10 bg-white/95 shadow-[0_16px_36px_-24px_color-mix(in_srgb,var(--ink)_40%,transparent)] lg:bg-white/85 lg:backdrop-blur-md"
        }`}
      >
        <Link href="/" className="-my-2 flex items-center gap-3 py-2">
          <Image src="/logo.svg" alt="" width={28} height={28} preload />
          <span className="font-display text-xl tracking-tight whitespace-nowrap text-ink">
            Greystone Hyde
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-9">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative py-2 text-[13px] tracking-wide whitespace-nowrap text-navy/70 transition-colors duration-300 hover:text-royal"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <MagneticButton
            href="/#contact"
            className="rounded-full bg-navy px-6 py-2.5 max-sm:hidden text-[13px] whitespace-nowrap font-medium tracking-wide text-white transition-colors duration-500 hover:bg-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal sm:block"
          >
            Book a consultation
          </MagneticButton>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
            className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-navy/20 bg-white lg:hidden"
          >
            {/* The two bars meet in the middle and cross: transforms only */}
            <span className="relative block h-3 w-4">
              <span
                className={`absolute top-1/2 left-0 -mt-px h-px w-4 bg-ink transition-transform duration-300 ${
                  open ? "rotate-45" : "-translate-y-[5px]"
                }`}
              />
              <span
                className={`absolute top-1/2 left-0 -mt-px h-px w-4 bg-ink transition-transform duration-300 ${
                  open ? "-rotate-45" : "translate-y-[5px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Full-screen mobile nav — quiet, editorial, a gentle fade with the rows
          rising in turn. Always in the markup (so opening it costs no mount),
          inert and hidden while closed. */}
      <nav
        id="mobile-nav"
        aria-label="Site"
        inert={!open}
        className={`fixed inset-0 -z-10 flex flex-col justify-center overflow-y-auto overscroll-contain bg-paper px-6 pt-24 pb-10 transition-[opacity,visibility] motion-reduce:transition-none lg:hidden ${
          open ? "pointer-events-auto visible opacity-100 duration-300" : "invisible opacity-0 duration-300"
        }`}
      >
        <ul>
          {links.map((l, i) => (
            <li key={l.href} style={stagger(open, i)} className={`border-b border-navy/[0.08] ${row(open)}`}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-4 font-display text-3xl tracking-tight"
              >
                {l.label}
                <span aria-hidden className="font-mono text-[10px] tracking-[0.18em] text-navy/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/#contact"
          onClick={() => setOpen(false)}
          style={stagger(open, links.length)}
          className={`mt-8 block rounded-full bg-navy py-4 text-center text-sm font-medium tracking-wide text-white ${row(open)}`}
        >
          Book a consultation
        </Link>
        <p style={stagger(open, links.length + 1)} className={`mt-10 text-[11px] tracking-[0.2em] text-navy/45 ${row(open)}`}>
          London — Accounting &amp; Advisory
        </p>
      </nav>
    </header>
  );
}
