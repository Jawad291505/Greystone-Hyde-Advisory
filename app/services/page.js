import ServicesJourney from "../components/ServicesJourney";
import MagneticButton from "../components/MagneticButton";

export const metadata = {
  title: "Services | Greystone Hyde Advisory",
  description:
    "Accounting and bookkeeping, tax and compliance, business and financial advisory, and secure online invoice payments — from Greystone Hyde Advisory, London.",
};

export default function ServicesPage() {
  return (
    <main>
      <ServicesJourney />

      <section className="relative border-t border-line bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-28 text-center lg:px-10">
          <p className="font-display text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.15] tracking-tight">
            Not sure which you need?
          </p>
          <p className="mt-3 font-display text-2xl text-brand">Tell us where you are.</p>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-foreground/65 sm:text-base">
            Most clients start with one question and find it connects to three others. We&apos;ll
            help you work out where to begin.
          </p>
          <MagneticButton
            href="/#contact"
            className="mt-8 inline-block rounded-full border border-foreground/15 px-8 py-3 text-sm tracking-wide text-foreground/85 transition-colors duration-300 hover:border-brand/60 hover:text-brand"
          >
            Get Started
          </MagneticButton>
        </div>
      </section>
    </main>
  );
}
