"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { hasWebGL } from "./webgl";

// Same lazy-load-near-viewport pattern as the homepage's coin section. The
// spiral is purely decorative here, so on a browser without WebGL (or on
// context loss) it just doesn't render — the page's message stands on its
// own without it.
const SpiralCoins = dynamic(() => import("./SpiralCoins"), { ssr: false });

export default function AboutCoinsSmart({ progress }) {
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [glOk, setGlOk] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGlOk(hasWebGL());
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "600px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden>
      {glOk && inView ? <SpiralCoins progress={progress} onContextLost={() => setGlOk(false)} /> : null}
    </div>
  );
}
