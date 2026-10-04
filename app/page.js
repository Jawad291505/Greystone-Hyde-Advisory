import Hero from "./components/Hero";
import Positioning from "./components/Positioning";
import ServicesGrid from "./components/ServicesGrid";
import WhyChooseUs from "./components/WhyChooseUs";
import People from "./components/People";
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
      <People />
      <Testimonials />
      <Coverage />
      <ContactSection />
    </main>
  );
}
