"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Counts from 0 up to `to` the first time it scrolls into view. Writes
// straight to the DOM so the count doesn't re-render React every frame.
export default function CountUp({ to, suffix = "", duration = 2, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = `${to.toLocaleString("en-GB")}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => {
        el.textContent = `${Math.round(n).toLocaleString("en-GB")}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, suffix, duration, delay]);

  // Screen readers get the final figure, not the ticking one.
  return (
    <>
      <span className="sr-only">{`${to.toLocaleString("en-GB")}${suffix}`}</span>
      <span ref={ref} aria-hidden className="tabular-nums">
        0{suffix}
      </span>
    </>
  );
}
