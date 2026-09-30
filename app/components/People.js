"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import LineIcon from "./LineIcons";

const ease = [0.22, 1, 0.36, 1];

// The specialisms a client works with. Describes responsibilities only: no
// names, credentials or tenure until the firm supplies real team details.
const roles = [
    {
        icon: "contact",
        role: "Client accountant",
        focus: "Your day-to-day contact",
        body: "Owns your books, deadlines and questions. The person who knows your business best.",
    },
    {
        icon: "review",
        role: "Tax specialist",
        focus: "Corporate & personal tax",
        body: "Prepares returns, reviews reliefs and plans ahead of year end, not after it.",
    },
    {
        icon: "payday",
        role: "Payroll specialist",
        focus: "Payroll & pensions",
        body: "Runs each pay cycle, RTI submissions and auto-enrolment, on the same date every month.",
    },
    {
        icon: "direction",
        role: "Advisory partner",
        focus: "Growth & decisions",
        body: "Joins when the questions get bigger: funding, structure, expansion and change.",
    },
];

const list = { show: { transition: { staggerChildren: 0.1 } } };
const cardIn = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

// Who a client works with, told through expertise rather than team photos:
// the introduction across the top, then the City photograph beside the four
// specialisms as cards.
export default function People() {
    const reduce = useReducedMotion();

    return (
        <section id="people" aria-labelledby="people-title" className="relative scroll-mt-20 bg-paper text-ink">
            <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
                <div className="flex items-center justify-between border-t border-navy/10 pt-5 font-mono text-[10px] tracking-[0.2em] text-navy/50 uppercase">
                    <span>04 — Expertise</span>
                    <span className="hidden sm:inline">Who you&apos;ll work with</span>
                </div>

                {/* Introduction */}
                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.9, ease }}
                    className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12 lg:items-end lg:gap-8"
                >
                        <h2
                            id="people-title"
                            className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-[-0.015em] text-balance lg:col-span-7"
                        >
                            Experienced accountants and advisers{" "}
                            <em className="text-royal">who work directly with you.</em>
                        </h2>
                        <div className="lg:col-span-4 lg:col-start-9">
                        <p className="max-w-md text-base leading-relaxed text-navy/75">
                            You won&apos;t be passed between departments or left waiting in a
                            support queue. A small, consistent team works on your account and
                            knows the history behind every number.
                        </p>
                        <a
                            href="#contact"
                            className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
                        >
                            Book a consultation
                            <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                                →
                            </span>
                        </a>
                        </div>
                </motion.div>

                <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-12 lg:gap-5">
                    {/* The work itself: a report under review, not a team photo.
                        Photo: Towfiqu barbhuiya, Unsplash (Unsplash License) */}
                    {/* The frame is watched for visibility and the clip is animated on an
                        inner layer: a fully clipped element never registers as in view */}
                    <motion.figure
                        initial={reduce ? false : "hidden"}
                        whileInView="show"
                        viewport={{ once: true, margin: "-10%" }}
                        className="relative m-0 aspect-[16/10] overflow-hidden rounded-card sm:aspect-[2/1] lg:col-span-5 lg:aspect-auto"
                    >
                        <motion.div
                            variants={{
                                hidden: { clipPath: "inset(100% 0% 0% 0%)" },
                                show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.4, ease } },
                            }}
                            className="absolute inset-0 bg-navy"
                        >
                        <Image
                            src="/images/advisory-review.jpg"
                            alt="An adviser in a suit reviewing financial charts beside a calculator, pen and printed reports"
                            fill
                            sizes="(min-width: 1024px) 40vw, 100vw"
                            className="object-cover object-[55%_50%] [filter:saturate(0.45)_contrast(1.08)_brightness(0.97)]"
                        />
                        {/* House grade: navy-tinted, deepest where the caption sits */}
                        <div className="absolute inset-0 bg-[linear-gradient(200deg,rgba(36,82,181,0.25)_0%,rgba(20,42,92,0.45)_55%,rgba(11,26,56,0.85)_100%)] mix-blend-multiply" />
                        <div className="hero-grain absolute inset-0 opacity-[0.14]" />
                        </motion.div>
                        <figcaption className="absolute inset-x-0 bottom-0 p-7">
                            <p className="font-display text-[clamp(1.6rem,2.2vw,2rem)] leading-tight tracking-tight text-paper">
                                Every figure reviewed,
                                <br />
                                <em className="text-sky">every return checked.</em>
                            </p>
                            <p className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-paper/65 uppercase">
                                <span className="h-px w-4 bg-paper/40" />
                                Qualified, human review
                            </p>
                        </figcaption>
                    </motion.figure>

                    {/* The four specialisms */}
                    <motion.ol
                        variants={list}
                        initial={reduce ? false : "hidden"}
                        whileInView="show"
                        viewport={{ once: true, margin: "-10%" }}
                        className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5"
                    >
                        {roles.map((r, i) => (
                            <motion.li
                                key={r.role}
                                variants={cardIn}
                                className="group relative overflow-hidden rounded-card border border-navy/10 bg-white/60 p-7 transition-[background-color,border-color,box-shadow] duration-500 hover:border-royal/20 hover:bg-white hover:shadow-[0_30px_60px_-44px_rgba(11,26,56,0.4)]"
                            >
                                {/* Royal rule draws across the top on hover */}
                                <span
                                    aria-hidden
                                    className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-royal transition-transform duration-700 group-hover:scale-x-100"
                                />
                                <div className="flex items-start justify-between">
                                    <LineIcon name={r.icon} className="h-11 w-11" />
                                    <span className="font-mono text-[11px] text-navy/40">{String(i + 1).padStart(2, "0")}</span>
                                </div>
                                <h3 className="mt-6 font-display text-[1.65rem] leading-tight tracking-tight">{r.role}</h3>
                                <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-royal uppercase">{r.focus}</p>
                                <p className="mt-4 text-[15px] leading-relaxed text-navy/75">{r.body}</p>
                            </motion.li>
                        ))}
                    </motion.ol>
                </div>
            </div>
        </section>
    );
}
