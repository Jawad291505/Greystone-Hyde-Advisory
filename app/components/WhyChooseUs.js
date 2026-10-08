import CountUp from "./CountUp";
import { SERVICES } from "../lib/services";

// Commitments the site already makes elsewhere (contact copy, approach
// principles, services list), so every counter is backed by existing claims
// rather than invented tenure or client numbers. Confirm with the firm.
const figures = [
  { to: 1, label: "Working day", body: "Maximum wait for a reply to any enquiry." },
  { to: 1, label: "Named accountant", body: "One person who knows your business, start to finish." },
  { to: SERVICES.length, label: "Practice areas", body: "Accounts to advisory, handled by one team." },
  { to: 100, suffix: "%", label: "Human-reviewed", body: "Every return checked by a qualified accountant." },
];

// Figure and label share one baseline, with the supporting line beneath, so
// the row stays a single short band. Single-digit commitments are set
// statically; counting 0 → 1 adds motion without meaning.
function Figure({ f, i }) {
  return (
    <li
      data-rise=""
      style={{ "--d": `${i * 0.08}s` }}
      className="border-white/10 py-6 max-lg:odd:pr-6 max-lg:even:border-l max-lg:even:pl-6 max-lg:[&:nth-child(-n+2)]:border-b lg:border-l lg:px-8 lg:py-7 lg:first:border-l-0 lg:first:pl-0"
    >
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-[clamp(2.4rem,3.4vw,3.25rem)] leading-none tracking-[-0.02em] text-white">
          {f.to > 10 ? <CountUp to={f.to} suffix={f.suffix} delay={0.2 + i * 0.12} duration={2.2} /> : `${f.to}${f.suffix ?? ""}`}
        </span>
        <span className="font-mono text-[11px] tracking-[0.16em] text-glint uppercase">{f.label}</span>
      </p>
      <p className="mt-2.5 max-w-[16rem] text-sm leading-relaxed text-white/70">{f.body}</p>
    </li>
  );
}

// The promise and its four commitments, in the one deep-colour moment
// between bright sections. The six reasons follow in their own section
// (Reasons.js), back on the bright page.
export default function WhyChooseUs() {
  return (
    <section id="why-us" aria-labelledby="why-title" className="relative scroll-mt-20 bg-paper text-ink">
      {/* Navy band, inset from the page edges as a rounded panel */}
      <div className="relative mx-3 overflow-hidden rounded-panel bg-[linear-gradient(165deg,var(--navy)_0%,var(--ink)_70%)] text-white">
        <div aria-hidden className="pointer-events-none absolute -top-1/4 right-[-10%] h-[90%] w-[60%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--royal)_50%,transparent),transparent)]" />
        <div aria-hidden className="pointer-events-none absolute bottom-[-30%] left-[-10%] h-[70%] w-[50%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--royal-soft)_18%,transparent),transparent)]" />

        <div className="relative mx-auto max-w-[88rem] px-5 pt-10 pb-2 sm:px-8 lg:px-12 lg:pt-12 lg:pb-4">
          <div className="flex items-center justify-between border-t border-white/15 pt-5 font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
            <span>03 — Why choose us</span>
            <span className="hidden sm:inline">Our value, your advantage</span>
          </div>

          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <h2
              id="why-title"
              className="font-display text-[clamp(2.4rem,4.6vw,4.2rem)] leading-[1] tracking-[-0.02em] lg:col-span-8"
            >
              The rigour of a large firm.
              <br />
              <em className="text-glint">The attention of a small one.</em>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-white/80 lg:col-span-4">
              What you get is a small, consistent team with clear commitments,
              written down and kept.
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-2 border-t border-white/10 lg:mt-10 lg:grid-cols-4">
            {figures.map((f, i) => (
              <Figure key={f.label} f={f} i={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
