// Draft copy — replace with the firm's real positioning.
const values = [
  {
    title: "Business-first approach",
    body: "Every number is read against your wider goals, so advice is practical and measurable, not just compliant.",
  },
  {
    title: "Precision in reporting",
    body: "Clean books, timely filings and reports you can actually read and act on.",
  },
  {
    title: "Proactive advice",
    body: "We flag risks and opportunities early, before they show up in your accounts.",
  },
  {
    title: "A long-term partner",
    body: "One accountable team that knows your business and grows alongside it.",
  },
];

export default function ValueStrip() {
  return (
    <section className="relative border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          Our value, your advantage
        </h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={v.title}>
              <p className="font-mono text-xs text-brand">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-sm font-medium">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
