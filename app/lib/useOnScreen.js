"use client";

import { useEffect, useState } from "react";

// Whether an element is on (or within `rootMargin` of) the screen. With
// `once`, it latches true the first time and stops observing.
export function useOnScreen(ref, { rootMargin = "0px", once = false } = {}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setOn(entry.isIntersecting);
        if (once && entry.isIntersecting) io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);

  return on;
}
