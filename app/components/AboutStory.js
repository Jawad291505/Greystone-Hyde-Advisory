export default function AboutStory() {
  return (
    <section className="relative border-t border-line bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
        <p className="mb-5 flex items-center justify-center gap-3 text-[11px] tracking-[0.22em] text-brand uppercase sm:text-xs sm:tracking-[0.28em]">
          <span className="h-px w-10 bg-brand" />
          Our story
          <span className="h-px w-10 bg-brand" />
        </p>
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">Built around one idea</h2>
        <p className="mt-6 text-base leading-relaxed text-foreground/70 md:text-lg">
          Most businesses don&apos;t struggle because of bad decisions — they struggle because their
          numbers are unclear. Greystone Hyde Advisory exists to fix that: to take the tax, payroll,
          reporting and cash flow that make up a business&apos;s financial life, and organise it into
          something a founder can actually read and act on.
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground/70 md:text-lg">
          We&apos;re a single accountable team, not a rotating cast of contacts — because in this line
          of work, trust is built through continuity.
        </p>
      </div>
    </section>
  );
}
