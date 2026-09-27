"use client";

import { useRef } from "react";

// Subtle magnetic pull toward the cursor, snapping back on release with a
// spring-like ease. Skipped entirely on touch/coarse pointers via CSS
// (see the pointer-fine check below) — there's no cursor there to react to.
export default function MagneticButton({ href, children, className = "", ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transition = "transform 0.12s ease-out";
    el.style.transform = `translate3d(${x * 0.22}px, ${y * 0.32}px, 0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)";
    el.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <a
      {...rest}
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </a>
  );
}
