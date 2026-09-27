"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { hasWebGL } from "./webgl";

// three.js and the scene only download once the page has painted and the
// browser is idle, and only while the journey is near the viewport — the
// copy (and SEO) never waits on WebGL. Without WebGL, or on context loss,
// the page falls back to its HTML/CSS presentation via onUnavailable.
const ServicesScene = dynamic(() => import("./ServicesScene"), { ssr: false });

export default function ServicesSceneSmart({ journey, reduce, onUnavailable }) {
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [idle, setIdle] = useState(false);
  const [glOk, setGlOk] = useState(true);

  useEffect(() => {
    const ok = hasWebGL();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGlOk(ok);
    if (!ok) onUnavailable?.();

    const ric = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 250));
    const cic = window.cancelIdleCallback ?? clearTimeout;
    const handle = ric(() => setIdle(true), { timeout: 1500 });

    const el = wrapRef.current;
    let io;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
    } else {
      io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
        rootMargin: "400px 0px",
      });
      io.observe(el);
    }
    return () => {
      cic(handle);
      io?.disconnect();
    };
  }, [onUnavailable]);

  return (
    <div ref={wrapRef} className="svc-canvas absolute inset-0" aria-hidden>
      {glOk && inView && idle ? (
        <ServicesScene
          journey={journey}
          reduce={reduce}
          onContextLost={() => {
            setGlOk(false);
            onUnavailable?.();
          }}
        />
      ) : null}
    </div>
  );
}
