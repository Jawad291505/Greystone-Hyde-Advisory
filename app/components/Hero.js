import Header from "./Header";
import HeroMedia from "./HeroMedia";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Aerial London (Thames, Tower Bridge, Canary Wharf), toned to the brand navy */}
      <HeroMedia />
      <div className="absolute inset-0 -z-20 bg-[#243b6f] opacity-60 mix-blend-color" />
      {/* Desktop: solid behind the copy, photo fully revealed to its right */}
      <div className="absolute inset-0 -z-20 hidden bg-gradient-to-r from-background from-0% via-background/80 via-32% to-transparent to-62% lg:block" />
      {/* Mobile/tablet: photo on top, copy anchored on a darker base */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-background from-10% via-background/85 via-45% to-background/15 lg:hidden" />
      <div className="absolute inset-x-0 top-0 -z-20 h-40 bg-gradient-to-b from-background/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-20 h-56 bg-gradient-to-t from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_50%_45%_at_80%_25%,rgba(49,106,162,0.3),transparent)]" />

      <Header />

      <div className="mx-auto flex w-full max-w-7xl flex-1 items-end px-5 pt-32 pb-10 sm:px-6 sm:pt-40 sm:pb-16 lg:px-10">
        <div className="max-w-3xl">
          <p
            className="reveal mb-6 flex items-center gap-3 text-[11px] tracking-[0.22em] sm:mb-8 sm:gap-4 sm:text-xs sm:tracking-[0.28em] text-brand uppercase"
            style={{ "--d": "0.1s" }}
          >
            <span className="h-px w-10 bg-brand" />
            London Accounting &amp; Advisory
          </p>

          <h1
            className="reveal font-display text-[clamp(2.6rem,9.5vw,5.75rem)] lg:text-[clamp(3.5rem,6.4vw,5.75rem)] leading-[1.02] tracking-tight"
            style={{ "--d": "0.2s" }}
          >
            Financial complexity,
            <br />
            <span className="text-brand">made clear.</span>
          </h1>

          <p
            className="reveal mt-6 max-w-xl text-base leading-relaxed text-foreground/75 sm:mt-8 sm:text-lg"
            style={{ "--d": "0.35s" }}
          >
            Accounting, tax and advisory for London businesses that want
            precise numbers, confident decisions and a partner who turns
            complexity into a clear path forward.
          </p>

          <div
            className="reveal mt-9 flex flex-col items-stretch gap-5 sm:mt-12 sm:flex-row sm:items-center sm:gap-8"
            style={{ "--d": "0.5s" }}
          >
            <a
              href="#contact"
              className="bg-logo-blue px-8 py-4 text-center text-sm font-medium tracking-wide text-white shadow-[0_0_40px_-8px_rgba(49,106,162,0.9)] transition-colors hover:bg-brand"
            >
              Get Started
            </a>
            <a
              href="#clarity"
              className="group flex items-center justify-center gap-3 text-sm text-foreground sm:justify-start"
            >
              Explore services
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Trust bar — placeholder credentials, replace with verified ones */}
      <div className="reveal border-t border-white/10 bg-background/40 backdrop-blur-md" style={{ "--d": "0.8s" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-4 px-5 py-4 text-[10px] tracking-[0.16em] sm:px-6 sm:py-5 sm:text-[11px] sm:tracking-[0.2em] text-foreground/60 uppercase lg:px-10">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 sm:gap-x-10 sm:gap-y-3">
            {["Chartered accountants", "HMRC registered agent", "Xero · QuickBooks · Sage"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-brand" />
                {t}
              </li>
            ))}
          </ul>
          <a href="#clarity" className="hidden items-center gap-3 hover:text-foreground sm:flex">
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-white/20">
              <span className="scroll-tick absolute inset-x-0 top-0 h-3 bg-brand" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
