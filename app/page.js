import Hero from "./components/Hero";
import ClarityIntro from "./components/ClarityIntro";
import CubeSection from "./components/CubeSection";
import ServicesDrum from "./components/ServicesDrum";
import WhyChooseUs from "./components/WhyChooseUs";
import OurValues from "./components/OurValues";
import ContactSection from "./components/ContactSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <ClarityIntro />
      <CubeSection />
      <ServicesDrum />
      <WhyChooseUs />
      <OurValues />
      <ContactSection />
    </main>
  );
}
