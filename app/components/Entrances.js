"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { markIntroReady } from "../lib/intro";

// Matches the preloader's CSS timeline (--intro-delay in globals.css)
const CURTAIN_MS = 950;

// The site's entrances are CSS (see "Entrances" in globals.css). This is the
// only script behind them: one IntersectionObserver for the whole page that
// marks `[data-rise]` and `[data-draw]` elements as they scroll into view,
// each once. It also tells the few scripted intros when the preloader's
// curtain lifts, and drops the curtain's delay after the first navigation.
export default function Entrances() {
  const pathname = usePathname();
  const prev = useRef(pathname);

  useEffect(() => {
    const id = setTimeout(markIntroReady, Math.max(0, CURTAIN_MS - performance.now()));
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    // The curtain only plays on a full page load
    if (prev.current !== pathname) document.documentElement.dataset.nav = "";
    prev.current = pathname;

    const pending = document.querySelectorAll("[data-rise]:not([data-in]), [data-draw]:not([data-in])");
    if (typeof IntersectionObserver === "undefined") {
      pending.forEach((el) => el.setAttribute("data-in", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // An attribute, not a class: React rewrites className on re-render
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
