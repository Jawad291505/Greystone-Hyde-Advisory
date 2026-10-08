import Image from "next/image";
import LondonTime from "./LondonTime";

// Server-rendered, and animated entirely in CSS (see "Hero intro" in
// globals.css): the headline, copy and photograph are in the first paint and
// their entrance starts as the preloader's curtain lifts, whether or not any
// script has loaded yet. The only client code here is the clock.
//
// One choreographed sequence — "coming into focus". The ledger rules draw,
// the photograph sharpens while it fills the screen, the frame retracts to
// its resting place, the headline focuses, the total is double-ruled, then
// the supporting copy arrives. Below desktop the same sequence runs on
// transform and opacity alone.

// Shared by the ink headline and its paper-white twin inside the photo frame,
// so the two lay out identically and the colour flips exactly at the frame edge.
const CONTAINER = "mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12";
const TOP = "pt-32 sm:pt-36 lg:pt-[clamp(8rem,18svh,13rem)]";

// Left edge of a column on the container's 12-column grid, as a length in the
// full-width stage's own box.
const col = (fraction) =>
  `calc(max(0px, (100% - 88rem) / 2) + 3rem + (min(100%, 88rem) - 6rem) * ${fraction})`;

// `data-intro` rises in once the curtain lifts, `d` seconds into the sequence
const intro = (d) => ({ "data-intro": "", style: { "--d": `${d}s` } });

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

// Rendered twice: once in ink on the page, once in paper-white inside the
// photograph's clip, which covers the page while the intro plays. `twin` is
// the decorative copy.
function Headline({ twin = false }) {
  const Tag = twin ? "p" : "h1";
  return (
    <Tag
      id={twin ? undefined : "hero-title"}
      aria-hidden={twin || undefined}
      // On desktop the size is derived from the left column (the longer line
      // is ~7.3em wide), so the headline stops short of the photograph's edge.
      className={`font-editorial text-[clamp(3.25rem,8.2vw,9.5rem)] lg:text-[length:min((50vw_-_4.5rem)_/_7.45,5.3rem)] leading-[0.92] font-[350] tracking-[-0.03em] [font-kerning:normal] [font-variation-settings:'opsz'_72] ${
        twin ? "text-paper" : "text-ink"
      }`}
    >
      {/* Each line resolves out of blur rather than sliding in */}
      <span className="hi-line block" style={{ "--i": 0 }}>
        Clear{" "}
        <span className="relative inline-block">
          numbers
          {/* The accountant's double rule under a final total */}
          {[0.17, 0.12].map((b, i) => (
            <span
              key={b}
              aria-hidden
              style={{ bottom: `${b}em`, "--i": i }}
              className={`hi-total absolute inset-x-[0.04em] h-[max(1px,0.012em)] origin-left ${
                twin ? "bg-paper/80" : "bg-royal"
              }`}
            />
          ))}
        </span>
        .
      </span>
      <span className="hi-line block" style={{ "--i": 1 }}>
        <em className={twin ? "text-sky" : "text-royal"}>Considered</em> advice.
      </span>
    </Tag>
  );
}

// The one primary action on the page, as a solid pill.
function PrimaryCta() {
  return (
    <a
      href="#contact"
      className="group inline-flex items-center gap-4 rounded-full bg-navy py-2 pr-2 pl-7 text-[15px] font-medium tracking-wide text-white shadow-[0_18px_40px_-18px_color-mix(in_srgb,var(--navy)_60%,transparent)] transition-colors duration-500 hover:bg-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
    >
      Book a consultation
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
              Greystone Hyde is a London accounting and advisory practice. We
              work directly with owners and finance teams, on the books, the
              tax, the payroll and the decisions that follow.
            </p>

            <div
              {...intro(1.05)}
              className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-[clamp(1.5rem,4.2svh,2.75rem)]"
            >
              <PrimaryCta />
              <a
                href="#services"
                className="py-2 text-[15px] font-medium tracking-wide text-navy/85 underline decoration-navy/40 underline-offset-[6px] transition-colors duration-300 hover:text-royal hover:decoration-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
              >
                Our services
              </a>
            </div>

            {/* Trust note: the reply commitment made in the contact section */}
            <p {...intro(1.15)} className="mt-6 flex items-center gap-3 text-sm text-navy/80 lg:mt-5">
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-royal" />
              A qualified accountant replies within one working day.
            </p>
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

        {/* The photograph. On desktop it spans the whole stage and is clipped to
            its resting rectangle, so it can fill the screen on load and retract;
            the white headline twin lives inside the same clip. */}
        <figure className="hi-frame relative m-0 aspect-[4/5] overflow-hidden bg-[linear-gradient(155deg,var(--navy)_0%,var(--panel-end)_100%)] sm:aspect-[5/4] lg:absolute lg:inset-0 lg:aspect-auto">
          <div className="hi-focus absolute inset-0">
            <div className="hi-shift absolute inset-0">
              <Image
                src="/images/desk-documents.jpg"
                alt="Two advisers working through figures on printed working papers at a desk"
                fill
                preload
                sizes="100vw"
                className="object-cover object-[58%_50%] [filter:saturate(0.5)_contrast(1.08)_brightness(0.97)] lg:object-center"
              />
            </div>
            {/* House grade: navy-tinted shadows, deepest where the type crosses */}
            <div className="absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_srgb,var(--ink)_80%,transparent)_0%,color-mix(in_srgb,var(--navy)_55%,transparent)_45%,color-mix(in_srgb,var(--royal)_30%,transparent)_100%)] mix-blend-multiply" />
            <div className="hero-grain absolute inset-0 opacity-[0.16]" />
          </div>

          <div aria-hidden className={`${CONTAINER} ${TOP} relative hidden lg:block`}>
            <Headline twin />
          </div>

          <figcaption
            {...intro(1.15)}
            className="absolute right-9 bottom-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-paper/75 uppercase sm:right-14 lg:right-[calc(var(--r)_+_1.75rem)] lg:bottom-[calc(10%+1.1rem)]"
          >
            <span className="text-paper/45">Fig. 01</span>
            <span className="h-px w-4 bg-paper/40" />
            Working papers
          </figcaption>
        </figure>

        {/* One detail crop, overlapping the main frame's edge (desktop only) */}
        <figure style={{ left: col(0.4) }} className="absolute bottom-[6%] m-0 hidden w-[clamp(12rem,16vw,18rem)] lg:block">
          <div className="hi-detail relative aspect-[4/3] overflow-hidden rounded-inner bg-navy shadow-[0_30px_60px_-30px_color-mix(in_srgb,var(--ink)_55%,transparent)]">
            {/* Oversized and offset so the frame shows only the hands and papers */}
            <div className="absolute top-[-140%] left-[-65%] h-[270%] w-[294%]">
              {/* Lazy, so phones (where this figure is not shown) never fetch it */}
              <Image
                src="/images/team-office.jpg"
                alt="An adviser's hand resting on printed reports during a client review"
                fill
                sizes="(min-width: 1024px) 47vw, 1px"
                className="object-cover [filter:saturate(0.5)_contrast(1.08)_brightness(0.97)]"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_srgb,var(--navy)_45%,transparent),color-mix(in_srgb,var(--royal)_25%,transparent))] mix-blend-multiply" />
            <div className="hero-grain absolute inset-0 opacity-[0.16]" />
          </div>
          <figcaption
            {...intro(1.8)}
            className="mt-2.5 flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-navy/70 uppercase"
          >
            <span className="text-navy/50">Fig. 02</span>
            <span className="h-px w-4 bg-royal/50" />
            Client review
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
