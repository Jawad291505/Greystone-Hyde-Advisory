import Hero from "../components/Hero";
import ClarityIntro from "../components/ClarityIntro";
import CubeSection from "../components/CubeSection";
import ServicesDrum from "../components/ServicesDrum";
import ValueStrip from "../components/ValueStrip";

// Comparison-only route: dark Hero (unchanged) followed by the light theme
// for everything after it — the inverse of /light-preview, which lights the
// whole page. Header is left on its default dark styling here since it's
// opaque once scrolled either way, so it doesn't need the body-level theme
// toggle that /light-preview uses to stay legible over a light backdrop.
export const metadata = {
  title: "Hero (dark) + light theme preview | Greystone Hyde Advisory",
  robots: { index: false, follow: false },
};

export default function HeroLightPreview() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-line bg-brand-soft/60 px-5 py-2 text-center text-xs tracking-wide text-foreground/70">
        Hero (dark) + light theme preview — internal comparison only, not the
        live site.
      </div>
      <main>
        <Hero />
        <div className="theme-light bg-background text-foreground">
          <ClarityIntro />
          <CubeSection />
          <ServicesDrum />
          <ValueStrip />
        </div>
      </main>
    </div>
  );
}
