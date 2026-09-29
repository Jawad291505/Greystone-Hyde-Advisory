"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { isIntroReady, subscribeIntro } from "../lib/intro";

// Inertial scrolling so the whole page glides as one continuous surface.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.085, anchors: true });
    // Held still while the preloader covers the page
    let unsubscribe;
    if (!isIntroReady()) {
      lenis.stop();
      unsubscribe = subscribeIntro(() => lenis.start());
    }
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      unsubscribe?.();
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
