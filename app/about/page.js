import Image from "next/image";
import AboutIntro from "../components/about/AboutIntro";
import { Reveal } from "../components/about/Reveal";
import Link from "../components/ThemeLink";

export const metadata = {
  title: "About | Greystone Hyde Advisory",
  description:
    "The story and principles behind Greystone Hyde Advisory — London accounting and financial advisory that turns complexity into clarity.",
};

const CONTAINER = "mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12";

// Draft copy, restating the practice's existing principles as goals — confirm
// the wording with the firm.
const goals = [
  {
    title: "Make every number legible",
    body: "If a number can't be explained in one sentence, it isn't finished yet.",
  },
  {
    title: "Stay ahead of what's coming",
    body: "We flag what's coming before it becomes a problem you have to react to.",
  },
  {
    title: "Be one accountable team",
    body: "The person who understands your business is the person you actually talk to.",
  },
  {
    title: "Earn trust through continuity",
    body: "Every recommendation is one we'd act on ourselves, in your position.",
  },
];

// How an engagement unfolds, told in three chapters, each with its photograph.
// Draft copy drawn from the practice's existing principles — replace with
// the firm's own.
const chapters = [
  {
    src: "/images/Listening.webp",
    alt: "An accountant talking a client through the figures on a laptop across a desk",
    at: "50% 50%",
    when: "First",
    title: "We start by listening.",
    body: "Before any figures, we learn how your business works: what it does, how it earns, and what you want from it. The person in that first conversation is the person you keep.",
  },
  {
    src: "/images/We_get_the numbers_staright.webp",
    alt: "An accountant reconciling ledgers at a desk with the City of London skyline behind",
    at: "50% 50%",
    when: "Then",
    title: "We get the numbers straight.",
    body: "Clean, reconciled books and returns checked by a qualified accountant. If a number can't be explained in one sentence, it isn't finished yet.",
  },
  {
    src: "/images/We_stay.webp",
    alt: "An adviser and a client going through a printed report together",
    at: "50% 50%",
    when: "And after",
    title: "We stay.",
    body: "The same team, year after year. We flag what's coming before it becomes a problem, and we're there when the questions get bigger.",
  },
];

const num = (i) => String(i + 1).padStart(2, "0");

// The About page, kept simple on the bright theme: who Greystone Hyde is
// beside its mark, how working with us goes in three chapters, then the mission
// and the goals behind it, and a quiet way in. Server-rendered; the only client code is the entrances (opacity and
// transform, each played once). No WebGL.
export default function AboutPage() {
  return (
    <main className="bg-paper text-ink">
      <AboutIntro />

      {/* The story, in three chapters down a single rule: each chapter is a
          photograph and what happens at that point, on alternating sides.
          The photographs share one quiet grade so they read as a set, and
          settle a little closer when pointed at (transform only). */}
      <section aria-labelledby="story-title" className="relative">
        <div className={`${CONTAINER} pb-16 lg:pb-24`}>
          <Reveal className="border-t border-navy/10 pt-10 lg:pt-14">
            <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-navy/70 uppercase">
              <span className="h-px w-8 bg-royal" />
              How it goes
            </p>
            <h2 id="story-title" className="mt-6 max-w-3xl font-display text-[clamp(2.2rem,4.2vw,3.6rem)] leading-[1.03] tracking-[-0.015em] text-balance">
              Working with us, <em className="text-royal">in three chapters.</em>
            </h2>
          </Reveal>

          {/* The `before` line is the rule the chapters hang from */}
          <ol className="relative mt-12 space-y-12 before:absolute before:top-2 before:bottom-2 before:left-[1.15rem] before:w-px before:bg-navy/15 lg:mt-20 lg:space-y-24 lg:before:left-1/2">

            {chapters.map((c, i) => {
              const flip = i % 2 === 1;
              return (
                <li key={c.title} className="relative grid gap-6 pl-12 lg:grid-cols-2 lg:items-center lg:gap-0 lg:pl-0">
                  {/* Chapter marker, on the rule */}
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 grid h-[2.35rem] w-[2.35rem] place-items-center rounded-full border border-navy/15 bg-paper font-mono text-[11px] tracking-[0.08em] text-royal lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
                  >
                    {num(i)}
                  </span>

                  <Reveal as="figure" className={`group m-0 ${flip ? "lg:order-2 lg:pl-16" : "lg:pr-16"}`}>
                    <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-navy">
                      <Image
                        src={c.src}
                        alt={c.alt}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        style={{ objectPosition: c.at }}
                        className="object-cover transition-[scale] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none [filter:saturate(0.55)_contrast(1.05)]"
                      />
                      {/* House grade: a light navy wash, deeper at the foot */}
                      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--ink)_45%,transparent),color-mix(in_srgb,var(--navy)_16%,transparent)_60%)]" />
                    </div>
                  </Reveal>

                  <Reveal delay={0.1} className={flip ? "lg:order-1 lg:pr-16 lg:text-right" : "lg:pl-16"}>
                    <p className="font-mono text-[11px] tracking-[0.2em] text-navy/60 uppercase">{c.when}</p>
                    <h3 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05] tracking-[-0.015em]">{c.title}</h3>
                    <p className={`mt-4 max-w-md text-[17px] leading-[1.7] text-navy/85 ${flip ? "lg:ml-auto" : ""}`}>{c.body}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Mission: one statement, on the page's one navy panel */}
      <section aria-labelledby="mission-title" className="relative">
        <div className="relative mx-3 overflow-hidden rounded-panel bg-[linear-gradient(165deg,var(--navy)_0%,var(--ink)_70%)] text-white">
          <div aria-hidden className="pointer-events-none absolute -top-1/4 right-[-10%] h-[90%] w-[60%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--royal)_50%,transparent),transparent)]" />
          {/* An oversized opening quote mark, as the panel's only ornament */}
          <span aria-hidden className="pointer-events-none absolute top-[-0.12em] left-[3%] font-display text-[clamp(14rem,30vw,26rem)] leading-none text-white/[0.05] select-none">
            “
          </span>

          <Reveal className={`${CONTAINER} relative grid gap-8 py-16 lg:grid-cols-12 lg:gap-8 lg:py-24`}>
            <p id="mission-title" className="flex items-center gap-3 self-start font-mono text-[11px] tracking-[0.2em] text-glint uppercase lg:col-span-3 lg:pt-4">
              <span className="h-px w-8 bg-glint" />
              Our mission
            </p>
            <div className="lg:col-span-9">
              <p className="font-display text-[clamp(2.2rem,4.8vw,4.2rem)] leading-[1.04] tracking-[-0.015em] text-balance">
                To turn financial complexity <em className="text-glint">into clarity.</em>
              </p>
              <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-white/80">
                Every service we offer, every report we send, is built around
                one goal: making your numbers legible enough to act on with
                confidence.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Goals: four, side by side, each under its own rule */}
      <section aria-labelledby="goals-title" className="relative">
        <div className={`${CONTAINER} py-16 lg:py-24`}>
          <Reveal className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-navy/70 uppercase">
                <span className="h-px w-8 bg-royal" />
                Our goals
              </p>
              <h2 id="goals-title" className="mt-6 font-display text-[clamp(2.2rem,4.2vw,3.6rem)] leading-[1.03] tracking-[-0.015em] text-balance">
                Four things we hold <em className="text-royal">ourselves to.</em>
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-navy/80 lg:col-span-4 lg:col-start-9">
              The mission only means something if it shows up in the work. These
              are the standards we measure every engagement against.
            </p>
          </Reveal>

          <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {goals.map((g, i) => (
              <Reveal as="li" key={g.title} delay={i * 0.08} className="group relative border-t border-navy/15 pt-6">
                {/* Royal rule draws across the top on hover */}
                <span aria-hidden className="absolute top-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-royal transition-transform duration-700 group-hover:scale-x-100" />
                <span className="block font-display text-[clamp(3.4rem,5vw,4.6rem)] leading-none tracking-[-0.03em] text-navy/15 transition-colors duration-500 group-hover:text-royal">
                  {num(i)}
                </span>
                <h3 className="mt-6 font-display text-[1.6rem] leading-[1.1] tracking-tight">{g.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-navy/80">{g.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* A quiet way in */}
      <section aria-labelledby="about-close-title" className="relative border-t border-navy/10">
        <Reveal className={`${CONTAINER} py-16 text-center lg:py-20`}>
          <h2
            id="about-close-title"
            className="mx-auto max-w-3xl font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] tracking-[-0.015em] text-balance"
          >
            Your finances should create clarity, <em className="text-royal">not complexity.</em>
          </h2>
          <Link
            href="/#contact"
            className="group mt-7 inline-flex items-center gap-2 font-display text-2xl text-royal underline decoration-royal/30 underline-offset-[8px] transition-colors duration-300 hover:decoration-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
          >
            Let&apos;s talk
            <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
