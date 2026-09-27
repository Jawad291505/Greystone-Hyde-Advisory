"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import GbpCoins from "./GbpCoins";
import { hasWebGL } from "./webgl";

// three.js/@react-three/fiber only ever load once this section is near the
// viewport, and never load at all on a browser without WebGL — the CSS/SVG
// version (GbpCoins) covers that case and any WebGL context loss.
const GbpCoinsGL = dynamic(() => import("./GbpCoinsGL"), { ssr: false });

export default function GbpCoinsSmart({ progress }) {
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [glOk, setGlOk] = useState(true);

  useEffect(() => {
    // WebGL support can only be probed client-side (no `document` during
    // SSR), so this one-time capability check has to run in an effect —
    // there's no external store to subscribe to instead.
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
      {glOk && inView ? (
        <GbpCoinsGL progress={progress} onContextLost={() => setGlOk(false)} />
      ) : (
        <GbpCoins progress={progress} />
      )}
    </div>
  );
}
