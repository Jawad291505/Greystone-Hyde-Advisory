const WORDS = ["Greystone", "Hyde"];

// Every full page load: a paper panel where the ledger rules draw, the
// wordmark rises and a rule fills. A second rule closes it off (an
// accountant's double rule under a balanced total), then the panel lifts and
// hands over to the page's own intro.
//
// It is a curtain, not a loader: about a second, on a fixed CSS timeline (see
// "Preloader" in globals.css), with no script behind it. It never waits on
// the network and never locks scrolling, so a slow connection or a slow
// phone can't hold the page behind it. Hidden by CSS under reduced motion.
// Client-side navigation doesn't remount the root layout, so it never
// replays mid-visit.
export default function Preloader() {
  return (
    <div
      id="preloader"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-paper text-ink"
    >
      {/* Ledger rules, on the same column grid as the hero's */}
      <div className="absolute inset-0">
        <div className="mx-auto grid h-full max-w-[88rem] grid-cols-4 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              style={{ "--i": i }}
              className={`pl-col border-l border-navy/[0.07] ${i >= 4 ? "hidden lg:block" : ""} ${
                i === 3 ? "border-r lg:border-r-0" : ""
              } ${i === 11 ? "border-r" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="relative">
        <p className="flex gap-[0.22em] font-editorial text-[clamp(3rem,12.5vw,9rem)] leading-none font-[350] tracking-[-0.03em] [font-variation-settings:'opsz'_72]">
          {WORDS.map((w, i) => (
            // Padded mask so the descenders of y aren't clipped
            <span key={w} className="-mb-[0.16em] block overflow-hidden pb-[0.16em]">
              <span className="pl-word block" style={{ "--i": i }}>
                {w}
              </span>
            </span>
          ))}
        </p>

        <div className="relative mt-5 h-[7px] sm:mt-7">
          <span className="pl-rule absolute inset-x-0 top-0 h-px bg-ink/70" />
          <span className="pl-rule pl-rule-close absolute inset-x-0 bottom-0 h-px bg-royal" />
        </div>

        <p className="pl-fade mt-5 font-mono text-[10px] tracking-[0.2em] text-navy/55 uppercase sm:mt-6">
          Accounting · Tax · Payroll · Advisory
        </p>
      </div>

      <div className="pl-fade absolute inset-x-0 bottom-0 mx-auto flex max-w-[88rem] items-end justify-between px-5 pb-6 font-mono text-[10px] tracking-[0.18em] text-navy/55 uppercase sm:px-8 lg:px-12 lg:pb-8">
        <span>
          Greystone Hyde<span className="hidden sm:inline"> Advisory</span> — London
        </span>
        <span className="flex gap-3 tabular-nums">
          <span className="grid text-right [&>*]:col-start-1 [&>*]:row-start-1">
            <span className="pl-label-a">Reconciling</span>
            <span className="pl-label-b">Balanced</span>
          </span>
          <span className="pl-count text-ink" />
        </span>
      </div>
    </div>
  );
}
