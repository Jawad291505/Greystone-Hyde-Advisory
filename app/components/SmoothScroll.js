"use client";

import { useEffect } from "react";

// Inertial scrolling so the whole page glides as one continuous surface.
//
// Only where there is a wheel to smooth: touch screens already scroll with
// native momentum on the compositor, which no script can better, so they are
// left alone (and never download the library). On desktop it loads once the
// page is idle, off the critical path.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let lenis;
    let cancelled = false;
    const ric = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? clearTimeout;
    const handle = ric(
      async () => {
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;
        lenis = new Lenis({ lerp: 0.085, anchors: true, autoRaf: true });
      },
      { timeout: 1200 },
    );

    return () => {
      cancelled = true;
      cic(handle);
      lenis?.destroy();
    };
  }, []);

  return null;
}
