import Hero from "./components/Hero";
import Positioning from "./components/Positioning";
import ServicesGrid from "./components/ServicesGrid";
import WhyChooseUs from "./components/WhyChooseUs";
import Reasons from "./components/Reasons";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Coverage from "./components/Coverage";
import ContactSection from "./components/ContactSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesGrid />
      <Positioning />
      <WhyChooseUs />
      <Reasons />
      <Testimonials />
      <Pricing />
      <Coverage />
      <ContactSection />
    </main>
  );
}
