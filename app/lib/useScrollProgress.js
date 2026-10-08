"use client";

import { useEffect, useRef } from "react";

const clamp = (v) => Math.min(1, Math.max(0, v));

// How far the viewport has travelled through a tall element, 0 → 1, eased
// toward the scroll position so pinned scenes glide rather than snap.
//
// Cheap by construction: the element's place on the page is measured once
// and again only when the page resizes, so a frame reads nothing but
// `scrollY`; and the loop runs only while the element is on screen and still
// catching up, never while it is out of sight or at rest.
//
// `onFrame(progress)` is called on each frame that moves, for callers that
// write the value somewhere (a CSS variable, a stage label).
export function useScrollProgress(ref, onFrame) {
  const progress = useRef(0);
  const frame = useRef(onFrame);

  useEffect(() => {
    frame.current = onFrame;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let top = 0;
    let range = 1;
    let raf = 0;
    let visible = false;
    let smooth = -1;
    let last = 0;

    const loop = (now) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.25);
      last = now;
      const raw = reduce ? 1 : clamp((window.scrollY - top) / range);
      smooth = smooth < 0 || reduce ? raw : smooth + (raw - smooth) * (1 - Math.exp(-dt * 2.8));
      if (Math.abs(raw - smooth) < 0.0004) smooth = raw;
      progress.current = smooth;
      frame.current?.(smooth);
      // At rest: wait for the next scroll instead of spinning
      if (visible && smooth !== raw) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!visible || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const measure = () => {
      const rect = el.getBoundingClientRect();
      top = rect.top + window.scrollY;
      range = Math.max(1, rect.height - window.innerHeight);
      wake();
    };

    // Anything that moves the element down the page (an accordion opening
    // above it, fonts arriving, a resize) changes the body's height
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) measure();
    });
    io.observe(el);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", measure);
    };
  }, [ref]);

  return progress;
}
