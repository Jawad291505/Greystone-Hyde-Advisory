// Draft copy — replace with the firm's real positioning.
const beliefs = [
  {
    title: "Clarity over complexity",
    body: "If a number can't be explained in one sentence, it isn't finished yet.",
  },
  {
    title: "Proactive, not reactive",
    body: "We flag what's coming before it becomes a problem you have to react to.",
  },
  {
    title: "One accountable team",
    body: "The person who understands your business is the person you actually talk to.",
  },
  {
    title: "Built on trust",
    body: "Every recommendation is one we'd act on ourselves, in your position.",
  },
];

export default function AboutValues() {
  return (
    <section className="relative border-t border-line bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">What we believe</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {beliefs.map((v, i) => (
            <div key={v.title}>
              <p className="font-mono text-xs text-brand">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-sm font-medium">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
