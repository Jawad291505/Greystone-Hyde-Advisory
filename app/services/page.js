import Link from "next/link";
import ServicesJourney from "../components/ServicesJourney";

export const metadata = {
  title: "Services | Greystone Hyde Advisory",
  description:
    "Accounting and bookkeeping, tax and compliance, business and financial advisory, and secure online invoice payments — from Greystone Hyde Advisory, London.",
};

export default function ServicesPage() {
  return (
    <main className="bg-paper text-ink">
      <ServicesJourney />

      {/* Closing CTA: the same navy → royal plane used behind the hero photographs */}
      <section className="relative mx-3 mb-3 overflow-hidden rounded-panel bg-[linear-gradient(155deg,var(--navy)_0%,var(--royal)_100%)] text-white">
        <div aria-hidden className="pointer-events-none absolute -top-1/3 right-[-10%] h-[120%] w-[55%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.12),transparent)]" />
        <div className="relative mx-auto grid max-w-[88rem] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:items-end lg:px-12 lg:py-32">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-4 font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
              <span className="h-px w-10 bg-white/50" />
              Not sure where to start?
            </p>
            <h2 className="mt-8 font-display text-[clamp(2.4rem,5.4vw,4.8rem)] leading-[1] tracking-[-0.015em]">
              Tell us where you are.
              <br />
              <em className="text-[#bcd0ff]">We&apos;ll map the rest.</em>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-sm text-base leading-relaxed text-white/75">
              Most clients start with one question and find it connects to three
              others. We&apos;ll help you work out where to begin.
            </p>
            <Link
              href="/#contact"
              className="group mt-8 inline-flex items-center gap-4 rounded-full bg-white py-2 pr-2 pl-7 text-sm font-medium tracking-wide text-navy transition-colors duration-500 hover:bg-sky focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Book a consultation
              <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-white transition-transform duration-500 group-hover:translate-x-1">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
