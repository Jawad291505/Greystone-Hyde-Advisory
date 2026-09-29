"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

// The roles a client works with. Describes responsibilities only: no names,
// credentials or tenure until the firm supplies real team details.
const roles = [
    {
        role: "Client accountant",
        focus: "Your day-to-day contact",
        body: "Owns your books, deadlines and questions. The person who knows your business best.",
    },
    {
        role: "Tax specialist",
        focus: "Corporate & personal tax",
        body: "Prepares returns, reviews reliefs and plans ahead of year end, not after it.",
    },
    {
        role: "Payroll specialist",
        focus: "Payroll & pensions",
        body: "Runs each pay cycle, RTI submissions and auto-enrolment, on the same date every month.",
    },
    {
        role: "Advisory partner",
        focus: "Growth & decisions",
        body: "Joins when the questions get bigger: funding, structure, expansion and change.",
    },
];

function Reveal({ children, delay = 0, className = "" }) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Photograph revealed with a clip wipe, with gentle parallax inside its frame.
function Photo({ src, alt, sizes, className, from = "bottom", depth = 8 }) {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : [`-${depth}%`, `${depth}%`]);
    const hidden = from === "bottom" ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 0% 100%)";

    return (
        <motion.div
            ref={ref}
            initial={reduce ? false : { clipPath: hidden }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.4, ease }}
            className={`relative overflow-hidden bg-mist ${className}`}
        >
            <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[12%]">
                <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
            </motion.div>
        </motion.div>
    );
}

export default function People() {
    return (
        <section id="people" aria-labelledby="people-title" className="relative scroll-mt-20 overflow-hidden bg-paper text-ink">
            {/* Light-blue wash that carries in from the cube's glow above */}
            <div aria-hidden className="absolute inset-0 -z-0 bg-[linear-gradient(180deg,var(--paper)_0%,var(--sky)_45%,var(--paper)_100%)]" />

            <div className="relative mx-auto max-w-[88rem] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
                <div className="flex items-center justify-between border-t border-navy/10 pt-5 font-mono text-[10px] tracking-[0.2em] text-navy/50 uppercase">
                    <span>04 — People</span>
                    <span className="hidden sm:inline">The team behind the numbers</span>
                </div>

                <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
                    <h2
                        id="people-title"
                        className="font-display text-[clamp(2.6rem,6.4vw,6rem)] leading-[0.96] tracking-[-0.02em] lg:col-span-8"
                    >
                        Real people.
                        <br />
                        Real expertise.
                        <br />
                        <em className="text-royal">Real businesses.</em>
                    </h2>
                    <Reveal delay={0.15} className="flex items-end lg:col-span-4">
                        <p className="max-w-sm text-base leading-relaxed text-navy/75">
                            You won&apos;t be passed between departments or left waiting in a
                            support queue. A small, consistent team works on your account and
                            knows the history behind every number.
                        </p>
                    </Reveal>
                </div>

                {/* Editorial photo composition: one large frame, one offset detail */}
                <div className="relative mt-16 lg:mt-24">
                    <Photo
                        src="/images/team-office.jpg"
                        alt="A small team of advisers working together around a table in a bright office"
                        sizes="(min-width: 1024px) 70vw, 100vw"
                        className="aspect-[4/3] lg:mr-[26%] lg:aspect-[16/9]"
                    />
                    <div className="relative mt-4 ml-[30%] lg:absolute lg:right-0 lg:-bottom-20 lg:mt-0 lg:ml-0 lg:w-[34%]">
                        <Photo
                            src="/images/team-discussion.jpg"
                            alt="Two colleagues discussing a report on a laptop"
                            sizes="(min-width: 1024px) 30vw, 70vw"
                            from="right"
                            depth={12}
                            className="aspect-[4/5] shadow-[0_40px_70px_-40px_rgba(11,26,56,0.55)]"
                        />
                        <p className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-navy/50 uppercase">
                            <span className="h-px w-4 bg-royal/50" />
                            Working sessions, not handovers
                        </p>
                    </div>
                </div>

                {/* Roles */}
                <div className="mt-24 lg:mt-44">
                    <Reveal>
                        <p className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight tracking-tight">
                            Who you&apos;ll work with
                        </p>
                    </Reveal>

                    <ol className="mt-10 grid border-t border-navy/15 sm:grid-cols-2 lg:grid-cols-4">
                        {roles.map((r, i) => (
                            <li
                                key={r.role}
                                className="group relative border-b border-navy/15 py-8 sm:pr-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"
                            >
                                <Reveal delay={i * 0.08}>
                                    {/* Royal rule grows across on hover */}
                                    <span className="absolute top-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-royal transition-transform duration-700 group-hover:scale-x-100" />
                                    <p className="font-mono text-[11px] text-royal">{String(i + 1).padStart(2, "0")}</p>
                                    <h3 className="mt-4 font-display text-[1.75rem] leading-tight tracking-tight">{r.role}</h3>
                                    <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-navy/50 uppercase">{r.focus}</p>
                                    <p className="mt-5 text-[15px] leading-relaxed text-navy/75">{r.body}</p>
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
