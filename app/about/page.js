import AboutHero from "../components/AboutHero";
import AboutStory from "../components/AboutStory";
import AboutValues from "../components/AboutValues";
import MagneticButton from "../components/MagneticButton";

export const metadata = {
  title: "About | Greystone Hyde Advisory",
  description:
    "The story and principles behind Greystone Hyde Advisory — London accounting and financial advisory that turns complexity into clarity.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutStory />
      <AboutValues />

      <section className="relative border-t border-line bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-28 text-center lg:px-10">
          <p className="font-display text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.15] tracking-tight">
            Your finances should create clarity, not complexity.
          </p>
          <p className="mt-3 font-display text-2xl text-brand">Let&apos;s talk.</p>
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
