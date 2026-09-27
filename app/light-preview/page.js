import Hero from "../components/Hero";
import ClarityIntro from "../components/ClarityIntro";
import CubeSection from "../components/CubeSection";
import ServicesDrum from "../components/ServicesDrum";
import ValueStrip from "../components/ValueStrip";

// Comparison-only route: full light theme, built by overriding the same
// color tokens the dark site reads (see `.theme-light` in globals.css).
// Not linked from the live site — for internal review of the "full light
// theme" direction against the shipped darker-navy theme.
export const metadata = {
  title: "Light theme preview | Greystone Hyde Advisory",
  robots: { index: false, follow: false },
};

export default function LightPreview() {
  return (
    <div className="theme-light min-h-screen bg-background text-foreground">
      <div className="border-b border-line bg-brand-soft/60 px-5 py-2 text-center text-xs tracking-wide text-foreground/70">
        Light-theme preview — internal comparison only, not the live site.
      </div>
      <main>
        <Hero />
        <ClarityIntro />
        <CubeSection />
        <ServicesDrum />
        <ValueStrip />
      </main>
    </div>
  );
}
