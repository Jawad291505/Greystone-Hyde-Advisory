import Image from "next/image";

// Layered so the photo itself never fights the motion system: an outer
// wrapper takes the pointer/scroll-driven parallax transform (CSS vars set
// by Hero.js), an inner wrapper keeps the one-off load-in zoom, and grain
// sits above both as a static, non-animated texture layer (cheap: it's a
// single background-image, no per-frame cost).
export default function HeroMedia() {
  return (
    <div className="absolute inset-0 -z-30 overflow-hidden">
      <div
        className="hero-parallax absolute -inset-[6%]"
        style={{
          transform:
            "translate3d(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -10px), 0) scale(calc(1 + var(--sp, 0) * 0.05))",
        }}
      >
        <div className="hero-zoom absolute inset-0">
          <Image
            src="/hero-london.jpg"
            alt="Aerial view of the Thames, Tower Bridge and the Canary Wharf financial district in London"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_50%] grayscale-[0.25] contrast-110 brightness-95 saturate-105 lg:object-[65%_50%]"
          />
        </div>
      </div>

      {/* Filmic duotone + vignette pass, separate from the photo so grayscale/contrast on the <img> above is untouched by this color grade */}
      <div className="absolute inset-0 bg-[#0b1626] mix-blend-color opacity-45" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_20%,transparent_40%,rgba(6,11,20,0.55)_100%)]" />

      <div aria-hidden className="hero-grain absolute inset-0 opacity-[0.05]" />
    </div>
  );
}
