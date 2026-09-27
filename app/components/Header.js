"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#why-us", label: "Why us" },
  { href: "/#process", label: "Process" },
  { href: "/about", label: "About" },
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

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background,border-color,backdrop-filter] duration-500 ${
        solid
          ? "border-foreground/[0.08] bg-background/90 backdrop-blur-2xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[padding] duration-500 sm:px-6 lg:px-10 ${
          scrolled ? "py-3.5" : "py-5 sm:py-7"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          {/* Fixed white, not theme-linked: the logo mark is a fixed navy and needs a light plate in both themes */}
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white">
            <Image src="/logo.svg" alt="" width={22} height={22} priority />
          </span>
          <span className="font-display text-lg tracking-tight">
            Greystone Hyde
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-[13px] tracking-wide text-foreground/65 transition-colors duration-300 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <MagneticButton
            href="/#contact"
            className="hidden rounded-full border border-foreground/15 px-6 py-2.5 text-[13px] tracking-wide text-foreground/85 transition-colors duration-300 hover:border-brand/60 hover:text-brand sm:block"
          >
            Get Started
          </MagneticButton>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-foreground/15 md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-foreground transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-foreground transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
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
            className="fixed inset-0 -z-10 flex flex-col justify-center bg-background px-6 md:hidden"
          >
            <ul>
              {links.map((l) => (
                <motion.li
                  key={l.href}
                  variants={itemVariants}
                  className="border-b border-foreground/[0.06] py-4"
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
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-8 block rounded-full bg-logo-blue py-4 text-center text-sm font-medium text-white"
            >
              Get Started
            </motion.a>
            <motion.p
              variants={itemVariants}
              className="mt-10 text-[11px] tracking-[0.2em] text-foreground/35"
            >
              London — Accounting &amp; Advisory
            </motion.p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
