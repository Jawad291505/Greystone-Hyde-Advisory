"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Hero photo with a slow settle-in zoom and a light scroll parallax.
export default function HeroMedia() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        if (ref.current) ref.current.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="absolute -inset-x-0 -top-10 -bottom-10 -z-30 will-change-transform">
      <div className="hero-zoom absolute inset-0">
        <Image
          src="/hero-london.jpg"
          alt="Aerial view of the Thames, Tower Bridge and the Canary Wharf financial district in London"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_50%] grayscale-[0.55] contrast-110 lg:object-[65%_50%]"
        />
      </div>
    </div>
  );
}
