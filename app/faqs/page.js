import FaqDesk from "../components/FaqDesk";
import { FAQS } from "../lib/faqs";

export const metadata = {
  title: "FAQs | Greystone Hyde Advisory",
  description:
    "Plain answers to the questions owners and finance teams ask Greystone Hyde most: switching accountant, fees, who you work with, software and services.",
};

// The same questions as structured data, so search engines can read them
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqsPage() {
  return (
    <main className="bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <FaqDesk />
    </main>
  );
}
