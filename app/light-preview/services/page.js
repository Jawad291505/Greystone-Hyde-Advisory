import ServicesJourney from "../../components/ServicesJourney";
import MagneticButton from "../../components/MagneticButton";
import LightThemeBody from "../LightThemeBody";

// Comparison-only route: the /services page under the full light theme,
// same `.theme-light` token override as /light-preview. Not linked from the
// live site — for internal review against the shipped dark services page.
export const metadata = {
  title: "Services light theme preview | Greystone Hyde Advisory",
  robots: { index: false, follow: false },
};

export default function ServicesLightPreview() {
  return (
    <div className="theme-light min-h-screen bg-background text-foreground">
      <LightThemeBody />
      <div className="border-b border-line bg-brand-soft/60 px-5 py-2 text-center text-xs tracking-wide text-foreground/70">
        Light-theme preview — internal comparison only, not the live site.
      </div>
      <main>
        <ServicesJourney />

        <section className="relative border-t border-line bg-surface">
          <div className="mx-auto max-w-3xl px-6 py-28 text-center lg:px-10">
            <p className="font-display text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.15] tracking-tight">
              Not sure which you need?
            </p>
            <p className="mt-3 font-display text-2xl text-brand">Tell us where you are.</p>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-foreground/65 sm:text-base">
              Most clients start with one question and find it connects to three others.
              We&apos;ll help you work out where to begin.
            </p>
            <MagneticButton
              href="/light-preview#contact"
              className="mt-8 inline-block rounded-full border border-foreground/15 px-8 py-3 text-sm tracking-wide text-foreground/85 transition-colors duration-300 hover:border-brand/60 hover:text-brand"
            >
              Get Started
            </MagneticButton>
          </div>
        </section>
      </main>
    </div>
  );
}
