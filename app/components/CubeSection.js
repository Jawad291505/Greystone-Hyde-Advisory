"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState } from "react";
import CubeCssStage from "./CubeCssStage";

// three.js is only fetched once the section is close to the viewport.
// One retry covers a transient chunk-load failure.
const CubeScene = dynamic(
  () => import("./CubeScene").catch(() => import("./CubeScene")),
  { ssr: false },
);

function StaticCube() {
  return (
    <div className="absolute inset-0 grid place-items-center lg:left-[38%]">
      <svg viewBox="0 0 200 200" className="w-[min(60vmin,380px)] opacity-90" aria-hidden>
        <path d="M100 20 L170 60 L100 100 L30 60 Z" fill="#316aa2" fillOpacity=".55" stroke="#5b93c7" />
        <path d="M30 60 L100 100 L100 180 L30 140 Z" fill="#131a26" stroke="#5b93c7" strokeOpacity=".6" />
        <path d="M170 60 L100 100 L100 180 L170 140 Z" fill="#0d121b" stroke="#5b93c7" strokeOpacity=".6" />
      </svg>
    </div>
  );
}

// If the scene throws (no WebGL, etc.), show the static cube instead of a gap.
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <StaticCube /> : this.props.children;
  }
}

const clamp = (v) => Math.min(1, Math.max(0, v));
const DISCIPLINES = ["Tax", "VAT", "Payroll", "Cash flow", "Expenses", "Invoices", "Reporting"];

export default function CubeSection({ forceCss = false }) {
  const section = useRef(null);
  const progress = useRef(0);
  const visRef = useRef(false);
  const nearRef = useRef(false);
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState(false);
  const [small, setSmall] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = section.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Warm the 3D chunk during idle time so it is ready before the section arrives.
    const warm = forceCss ? 0 : window.setTimeout(() => import("./CubeScene").catch(() => {}), 2500);

    let raf;
    let smooth = -1;
    let last = performance.now();
    const loop = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const near = rect.top < vh * 2 && rect.bottom > -vh;
      const visible = rect.top < vh * 1.1 && rect.bottom > -vh * 0.1;
      if (!forceCss && near !== nearRef.current) {
        nearRef.current = near;
        if (near) setSmall(window.innerWidth < 768);
        setLoad(near);
      }
      if (visible !== visRef.current) {
        visRef.current = visible;
        setActive(visible);
      }
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.25);
      last = now;
      const range = rect.height - window.innerHeight;
      const raw = reduce ? 1 : clamp(-rect.top / range);
      smooth = smooth < 0 || reduce ? raw : smooth + (raw - smooth) * (1 - Math.exp(-dt * 2.8));
      progress.current = smooth;
      el.style.setProperty("--p", smooth.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(warm);
    };
  }, [forceCss]);

  return (
    <section
      id="structure"
      ref={section}
      className="cube-section relative h-[540vh]"
      style={{ "--p": 0 }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_45%_50%_at_72%_50%,rgba(36,59,111,0.5),transparent)]"
        />

        <div className="absolute inset-0">
          {forceCss || failed ? (
            <CubeCssStage progress={progress} />
          ) : (
            load && (
              <SceneBoundary>
                <CubeScene progress={progress} small={small} active={active} onFail={() => setFailed(true)} />
              </SceneBoundary>
            )
          )}
        </div>

        <div className="pointer-events-none relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-14 sm:px-6 lg:justify-center lg:px-10 lg:pb-0">
          <div className="relative max-w-xl">
            <div className="cube-intro">
              <p className="mb-5 flex items-center gap-3 text-[11px] tracking-[0.22em] text-brand uppercase sm:gap-4 sm:text-xs sm:tracking-[0.28em]">
                <span className="h-px w-10 bg-brand" />
                The structure
              </p>
              <p className="font-display text-[clamp(1.75rem,4.6vw,3.25rem)] leading-[1.1] tracking-tight text-foreground/90">
                Seven disciplines. Scattered, they overwhelm.
              </p>
            </div>

            <div className="cube-final absolute inset-x-0 bottom-0 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2">
              <p className="mb-5 flex items-center gap-3 text-[11px] tracking-[0.22em] text-brand uppercase sm:gap-4 sm:text-xs sm:tracking-[0.28em]">
                <span className="h-px w-10 bg-brand" />
                Clarity
              </p>
              <h2 className="font-display text-[clamp(2.4rem,7vw,5rem)] leading-[1.02] tracking-tight">
                Complexity,
                <br />
                <span className="text-brand">organized.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/70 sm:text-base">
                One connected system for every part of your finances, built and
                run by a single accountable team.
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[10px] tracking-[0.16em] text-muted uppercase sm:text-[11px]">
                {DISCIPLINES.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
