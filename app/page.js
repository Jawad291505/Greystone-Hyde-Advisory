import Hero from "./components/Hero";
import ClarityIntro from "./components/ClarityIntro";
import CubeSection from "./components/CubeSection";
import ServicesDrum from "./components/ServicesDrum";
import GbpSection from "./components/GbpSection";
import ValueStrip from "./components/ValueStrip";

export default function Home() {
  return (
    <main>
      <Hero />
      <ClarityIntro />
      <CubeSection />
      <ServicesDrum />
      <ValueStrip />
    </main>
  );
}
