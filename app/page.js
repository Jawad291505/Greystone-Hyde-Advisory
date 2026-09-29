import Hero from "./components/Hero";
import Positioning from "./components/Positioning";
import ServicesGrid from "./components/ServicesGrid";
import WhyChooseUs from "./components/WhyChooseUs";
import Coverage from "./components/Coverage";
import OurValues from "./components/OurValues";
import ContactSection from "./components/ContactSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesGrid />
      <Positioning />
      <WhyChooseUs />
      <Coverage />
    </main>
  );
}
