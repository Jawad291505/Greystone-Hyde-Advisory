"use client";

import Image from "next/image";
import Link from "./ThemeLink";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { useThemeHref } from "../lib/themeBase";

const links = [
  { href: "/services", label: "Services" },
  { href: "/#why-us", label: "Why us" },
  { href: "/#approach", label: "Approach" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
];

const menuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], when: "beforeChildren", staggerChildren: 0.06 },
  },
  exit: { opacity: 0, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const themed = useThemeHref();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the full-screen mobile nav is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
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
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 text-ink sm:px-5 sm:pt-4">
      <div
        className={`pointer-events-auto mx-auto flex max-w-[88rem] items-center justify-between rounded-full border py-2 pr-2 pl-5 transition-[background-color,border-color,box-shadow] duration-500 sm:py-2.5 sm:pr-2.5 sm:pl-7 ${
          open
            ? "border-navy/10 bg-white shadow-none"
            : scrolled
              ? "border-navy/15 bg-white/95 shadow-[0_22px_44px_-22px_color-mix(in_srgb,var(--ink)_55%,transparent)] backdrop-blur-md"
              : "border-navy/10 bg-white/85 shadow-[0_16px_36px_-24px_color-mix(in_srgb,var(--ink)_40%,transparent)] backdrop-blur-md"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="" width={28} height={28} preload />
          <span className="font-display text-xl tracking-tight text-ink">
            Greystone Hyde
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-9">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-[13px] tracking-wide text-navy/70 transition-colors duration-300 hover:text-royal"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <MagneticButton
            href="/#contact"
            className="rounded-full bg-navy px-6 py-2.5 max-sm:hidden text-[13px] font-medium tracking-wide text-white transition-colors duration-500 hover:bg-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal sm:block"
          >
            Book a consultation
          </MagneticButton>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-navy/20 bg-white md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-ink transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"
                  }`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-ink transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Full-screen mobile nav — quiet, editorial, no motion beyond a gentle fade/rise */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="pointer-events-auto fixed inset-0 -z-10 flex flex-col justify-center bg-paper px-6 md:hidden"
          >
            <ul>
              {links.map((l) => (
                <motion.li
                  key={l.href}
                  variants={itemVariants}
                  className="border-b border-navy/[0.08] py-4"
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block font-display text-3xl tracking-tight"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.a
              variants={itemVariants}
              href={themed("/#contact")}
              onClick={() => setOpen(false)}
              className="mt-8 block rounded-full bg-navy py-4 text-center text-sm font-medium tracking-wide text-white"
            >
              Book a consultation
            </motion.a>
            <motion.p
              variants={itemVariants}
              className="mt-10 text-[11px] tracking-[0.2em] text-navy/45"
            >
              London — Accounting &amp; Advisory
            </motion.p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
