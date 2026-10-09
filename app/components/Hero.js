import Image from "next/image";
import LondonTime from "./LondonTime";
import { PIECES } from "../lib/logoMark";

// Server-rendered, and animated entirely in CSS (see "Hero intro" in
// globals.css): the headline, copy and photograph are in the first paint and
// their entrance starts as the preloader's curtain lifts, whether or not any
// script has loaded yet. The only client code here is the clock.
//
// One choreographed sequence — "coming into focus". The ledger rules draw,
// the photograph is unveiled in its frame from the foot up while it settles
// back, the headline focuses, the total is double-ruled, then the supporting
// copy arrives. Below desktop the same sequence runs on transform and
// opacity alone.

const CONTAINER = "mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12";
const TOP = "pt-32 sm:pt-36 lg:pt-[clamp(8rem,18svh,13rem)]";

// `data-intro` rises in once the curtain lifts, `d` seconds into the sequence
const intro = (d) => ({ "data-intro": "", style: { "--d": `${d}s` } });

// The mark's own colours, exactly as in the header's logo (public/logo.svg)
const MARK_FILLS = ["#316aa2", "#243b6f", "#243b6f"];

// The mark as a seal on the photograph's corner, in CSS only (see "Hero
// mark" in globals.css): a white disc on the frame's rim, with the
// practice's name turning slowly round its edge.
// Each piece of the mark is drawn in outline, fills, and locks into place;
// after that the three ease apart and back in turn and a sheen crosses the
// disc. Decorative: the header carries the logo itself.
const SEAL = "Greystone Hyde · Accounting & Advisory · ";

function MarkSeal() {
  return (
    <div
      aria-hidden
      className="hi-detail relative aspect-square overflow-hidden rounded-full border border-navy/10 bg-white text-navy shadow-[0_40px_70px_-30px_color-mix(in_srgb,var(--ink)_70%,transparent),0_10px_24px_-14px_color-mix(in_srgb,var(--navy)_45%,transparent)]"
    >
      {/* A faint cool wash, so the white reads as a lit surface */}
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,white,var(--sky)_85%)]" />
      <span className="lm-glow absolute inset-[24%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--glint)_30%,transparent),transparent)]" />

      {/* The name, set round the edge and turning slowly */}
      <svg viewBox="0 0 100 100" className="lm-orbit absolute inset-0 h-full w-full">
        <defs>
          <path id="hero-seal-arc" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
        </defs>
        <text className="font-mono uppercase" fontSize="6.2" fill="currentColor" fillOpacity="0.8">
          <textPath href="#hero-seal-arc" textLength="251" lengthAdjust="spacing">
            {SEAL}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-[19%] rounded-full border border-navy/10" />

      <svg viewBox="0 0 50 50" className="absolute top-1/2 left-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2 overflow-visible">
        {PIECES.map((p, i) => (
          <g key={i} className="lm-piece" style={{ "--i": i, "--dx": `${p.from.x * 0.4}px`, "--dy": `${p.from.y * 0.4}px` }}>
            <path d={p.d} fill={MARK_FILLS[i]} className="lm-fill" />
            <path d={p.d} pathLength={1} fill="none" stroke={MARK_FILLS[i]} strokeWidth={0.45} strokeLinejoin="round" className="lm-stroke" />
          </g>
        ))}
      </svg>

      <span className="lm-sheen absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(100deg,transparent,color-mix(in_srgb,var(--glint)_22%,transparent),transparent)]" />
    </div>
  );
}

// Accountant's ruled paper: hairlines on the layout's own column grid.
function LedgerRules() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className={`${CONTAINER} grid h-full grid-cols-4 lg:grid-cols-12`}>
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            style={{ "--i": i }}
            className={`hi-rule border-l border-navy/[0.07] ${i >= 4 ? "hidden lg:block" : ""} ${
              i === 3 ? "border-r lg:border-r-0" : ""
            } ${i === 11 ? "border-r" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

function Headline() {
  return (
    <h1
      id="hero-title"
      // Sized from the space the longest line (~8.3em wide) has: the page
      // width below desktop, the left column on desktop, so the headline stops
      // short of the photograph's edge. Short screens cap it by height too.
      className="font-editorial text-[clamp(2rem,10vw,6rem)] lg:text-[length:min((50vw_-_4.5rem)_/_8.6,4.5rem,9svh)] leading-[0.92] font-[350] tracking-[-0.03em] [font-kerning:normal] [font-variation-settings:'opsz'_72] text-ink"
    >
      {/* Each line resolves out of blur rather than sliding in */}
      <span className="hi-line block" style={{ "--i": 0 }}>
        Bookkeeping and
      </span>
      <span className="hi-line block" style={{ "--i": 1 }}>
        accounting that keep
      </span>
      <span className="hi-line block" style={{ "--i": 2 }}>
        your{" "}
        <span className="relative inline-block">
          business
          {/* The accountant's double rule under a final total */}
          {[0.17, 0.12].map((b, i) => (
            <span
              key={b}
              aria-hidden
              style={{ bottom: `${b}em`, "--i": i }}
              className="hi-total absolute inset-x-[0.04em] h-[max(1px,0.012em)] origin-left bg-royal"
            />
          ))}
        </span>{" "}
        <em className="text-royal">moving.</em>
      </span>
    </h1>
  );
}

// The one primary action on the page, as a solid pill.
function PrimaryCta() {
  return (
    <a
      href="#contact"
      className="group inline-flex items-center gap-4 rounded-full bg-navy py-2 pr-2 pl-7 text-[15px] font-medium tracking-wide text-white shadow-[0_18px_40px_-18px_color-mix(in_srgb,var(--navy)_60%,transparent)] transition-colors duration-500 hover:bg-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
    >
      Book a free consultation
      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white transition-transform duration-500 group-hover:translate-x-1">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
    </a>
  );
}

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative bg-paper bg-[radial-gradient(70%_60%_at_18%_32%,var(--sky),transparent_72%)] text-ink"
    >
      {/* --t/--r/--b/--l (set by .hero-stage) are the photograph's resting
          frame, as insets of this stage */}
      <div className="hero-stage relative isolate lg:h-svh lg:overflow-hidden">
        <LedgerRules />

        {/* Headline and copy, on paper */}
        <div className={`${CONTAINER} ${TOP} relative pb-14 lg:pb-0`}>
          <Headline />

          <div>
            <p
              {...intro(0.95)}
              className="mt-9 max-w-[28rem] text-[17px] leading-[1.65] text-navy/90 sm:text-lg lg:mt-[clamp(1.5rem,4.2svh,2.75rem)]"
            >
              You started a business to do what you love, not to chase
              receipts. We handle the books, taxes, payroll and financial
              strategy so you can focus on growth.
            </p>

            <div
              {...intro(1.05)}
              className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-[clamp(1.5rem,4.2svh,2.75rem)]"
            >
              <PrimaryCta />
              <a
                href="#pricing"
                className="py-2 text-[15px] font-medium tracking-wide text-navy/85 underline decoration-navy/40 underline-offset-[6px] transition-colors duration-300 hover:text-royal hover:decoration-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
              >
                See pricing
              </a>
            </div>

            {/* Trust strip: the client rating, then the software we work in */}
            <ul {...intro(1.15)} className="mt-6 space-y-1.5 text-sm text-navy/80 lg:mt-5">
              <li className="flex items-center gap-3">
                <span aria-hidden className="w-1.5 shrink-0 text-center text-[13px] leading-none text-royal [text-indent:-0.25em]">
                  ★
                </span>
                4.8/5 from 200+ client reviews
              </li>
              <li className="flex items-center gap-3">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-royal" />
                Works with Xero, QuickBooks, Sage and more
              </li>
            </ul>
          </div>
        </div>

        {/* Metadata: facts about where the practice is, no claims */}
        <div className="absolute inset-x-0 bottom-0 hidden lg:block">
          <div {...intro(1.25)} className={`${CONTAINER} pb-[4svh]`}>
            <dl className="flex w-[min(30rem,32%)] gap-10 border-t border-navy/15 pt-4 font-mono text-[11px] tracking-[0.16em] text-navy/70 uppercase">
              <div>
                <dt className="sr-only">Practice</dt>
                <dd>London</dd>
              </div>
              <div>
                <dt className="sr-only">Coordinates</dt>
                <dd>51.51° N · 0.13° W</dd>
              </div>
              <div>
                <dt className="sr-only">Local time</dt>
                <dd>
                  <LondonTime />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* The photograph. On desktop the figure spans the stage and is clipped
            to the photograph's frame (.hi-frame), which is unveiled from its
            foot on load. The photograph fills exactly that frame (.hi-photo),
            which keeps close to the picture's own proportions, so it is shown
            nearly whole at every size. */}
        {/* A soft navy shadow under the frame, which the figure's clip would
            otherwise cut off (desktop only) */}
        <div
          aria-hidden
          {...intro(1.1)}
          className="hi-photo pointer-events-none absolute hidden rounded-panel shadow-[0_45px_80px_-45px_color-mix(in_srgb,var(--navy)_75%,transparent),0_18px_36px_-24px_color-mix(in_srgb,var(--ink)_45%,transparent)] lg:block"
        />

        <figure className="hi-frame relative m-0 aspect-[3/2] sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
          <div className="hi-photo absolute overflow-hidden bg-navy">
            {/* Served as supplied: the file is small, and re-encoding it at a
                narrower width would only soften it further */}
            <Image
              src="/images/hero.webp"
              alt="An accountant and a client reviewing a financial report at a desk overlooking the City of London skyline"
              fill
              preload
              unoptimized
              sizes="(min-width: 1024px) 70vw, 130vw"
              className="hi-settle object-cover object-[80%_50%] [filter:saturate(0.82)_contrast(1.08)]"
            />
            {/* House grade, so the busy skyline reads as one calm picture: the
                colours are pulled towards navy, the corners fall away, and the
                foot deepens where the caption sits */}
            <div aria-hidden className="absolute inset-0 bg-navy opacity-30 mix-blend-color" />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(200deg,color-mix(in_srgb,var(--glint)_22%,transparent)_0%,transparent_45%)] mix-blend-soft-light" />
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_95%_at_60%_40%,transparent_45%,color-mix(in_srgb,var(--ink)_55%,transparent)_100%)]" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--ink)_70%,transparent),transparent)]" />
            {/* Fine film grain, which also hides the softness of a small file */}
            <div aria-hidden className="hero-grain absolute inset-0 opacity-[0.22]" />
            {/* A hairline inside the edge, as on a mounted print */}
            <div aria-hidden className="absolute inset-0 rounded-panel border border-white/20" />
          </div>

          <figcaption
            {...intro(1.15)}
            className="absolute right-9 bottom-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-paper/75 uppercase sm:right-14 lg:right-[calc(var(--r)_+_1.75rem)] lg:bottom-[calc(var(--b)_+_1.1rem)]"
          >
            <span className="h-px w-4 bg-paper/40" />
            Clear numbers, considered advice
          </figcaption>
        </figure>

        {/* The seal, straddling the photograph's lower-left corner
            (desktop only), so it reads as part of the frame */}
        <div className="absolute bottom-[calc(var(--b)_-_1.5rem)] left-[var(--l)] hidden w-[clamp(8.5rem,10.5vw,11rem)] -translate-x-[38%] lg:block">
          <MarkSeal />
        </div>
      </div>
    </section>
  );
}
