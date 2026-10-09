import { Suspense } from "react";
import Hero from "./components/Hero";
import Positioning from "./components/Positioning";
import ServicesGrid from "./components/ServicesGrid";
import ToolsMarquee from "./components/ToolsMarquee";
import WhyChooseUs from "./components/WhyChooseUs";
import Reasons from "./components/Reasons";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Coverage from "./components/Coverage";
import ContactSection from "./components/ContactSection";

// Each interactive section sits in its own Suspense boundary. Nothing here
// suspends, so the HTML is unchanged; what the boundaries buy is hydration in
// separate, interruptible steps rather than one long task for the whole
// page, with whichever section the visitor touches first jumping the queue.
export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense>
        <ServicesGrid />
      </Suspense>
      <ToolsMarquee />
      <Suspense>
        <Positioning />
      </Suspense>
      <WhyChooseUs />
      <Suspense>
        <Reasons />
      </Suspense>
      <Suspense>
        <Testimonials />
      </Suspense>
      <Pricing />
      <Suspense>
        <Coverage />
      </Suspense>
      <Suspense>
        <ContactSection />
      </Suspense>
    </main>
  );
}
