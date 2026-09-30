"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Counts from 0 up to `to` the first time it scrolls into view. Writes
// straight to the DOM so the count doesn't re-render React every frame.
//
// A single text node that is rendered with the final figure, so server HTML,
// screen readers and copied text always read one value ("1", never a hidden
// "1" run into a visible "0"). It is reset to zero just before paint and only
// counts up once in view.
export default function CountUp({ to, suffix = "", duration = 2, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const fmt = (n) => `${Math.round(n).toLocaleString("en-GB")}${suffix}`;

  useLayoutEffect(() => {
    if (!reduce && !inView && ref.current) ref.current.textContent = fmt(0);
    // Only on mount: hide the final figure until the count starts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = fmt(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => {
        el.textContent = fmt(n);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, to, suffix, duration, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      {fmt(to)}
    </span>
  );
}
