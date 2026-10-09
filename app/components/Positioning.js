"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import CubeCssStage from "./CubeCssStage";
import { useScrollProgress } from "../lib/useScrollProgress";

const ease = [0.22, 1, 0.36, 1];

const STATEMENT =
    "Behind every set of accounts is a business with real decisions to make. We read the numbers properly, then tell you what they mean.";

// How we work, stated as commitments rather than metrics.
const principles = [
    {
        n: "01",
        title: "A dedicated accountant",
        body: "One person looks after your business from the start. They know your history, understand your goals and give you a direct answer whenever you ask, with no ticket numbers or call centres in between.",
    },
    {
        n: "02",
        title: "Checked by qualified people",
        body: "Software handles the data entry. A qualified accountant then reviews every figure, return and filing, so nothing reaches you until it has been checked properly.",
    },
    {
        n: "03",
        title: "Guidance you can use",
        body: "No jargon, just clear explanations and sensible next steps. You'll know what changed in your numbers, why it happened and what to do next.",
    },
];

const STAGES = ["Complexity", "Structure", "Clarity"];
const DISCIPLINES = ["Accounts", "Tax", "VAT", "Payroll", "Compliance", "Reporting", "Advisory"];

function Word({ progress, i, total, children }) {
    const start = (i / total) * 0.75;
    // Ink at 18% → 100%, as opacity so the colour itself stays a theme token
    const opacity = useTransform(progress, [start, start + 0.18], [0.18, 1]);
    return (
        <motion.span style={{ opacity }} className="inline text-ink">
            {children}{" "}
        </motion.span>
    );
}

// Scroll progress through the cube column drives the cube. On desktop the
// column spans the whole copy column, so the cube assembles as you read;
// on mobile the column is its own short scroll runway.
function useCubeProgress(ref) {
    const [stage, setStage] = useState(0);
    // Setting the same stage again is a no-op for React, so this only
    // re-renders on the two frames where the stage actually changes
    const progress = useScrollProgress(ref, (p) => setStage(p < 0.4 ? 0 : p < 0.8 ? 1 : 2));
    return { progress, stage };
}

export default function Positioning() {
    const statementRef = useRef(null);
    const imageRef = useRef(null);
    const cubeCol = useRef(null);
    const reduce = useReducedMotion();
    const words = STATEMENT.split(" ");
    const { progress: cubeProgress, stage } = useCubeProgress(cubeCol);

    const { scrollYProgress: statementP } = useScroll({
        target: statementRef,
        offset: ["start 0.85", "end 0.45"],
    });
    const progress = useSpring(statementP, { stiffness: 120, damping: 28, mass: 0.5 });

    const { scrollYProgress: imageP } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
    const imageY = useTransform(imageP, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

    return (
        <section id="approach" aria-labelledby="approach-title" className="relative scroll-mt-20 bg-paper text-ink">
            <div className="mx-auto max-w-[88rem] px-5 pt-12 sm:px-8 lg:px-12 lg:pt-16">
                <div className="flex items-center justify-between border-t border-navy/10 pt-5 font-mono text-[10px] tracking-[0.2em] text-navy/50 uppercase">
                    <span>02 — Our approach</span>
                    <span className="hidden sm:inline">Complexity → structure → clarity</span>
                </div>
                <h2 id="approach-title" className="sr-only">
                    Our approach
                </h2>
            </div>

            <div className="mx-auto grid max-w-[88rem] px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
                {/* Copy column */}
                <div className="pb-12 lg:col-span-6 lg:pb-32">
                    <p
                        ref={statementRef}
                        className="mt-10 font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.1] tracking-[-0.015em] lg:mt-12"
                    >
                        {reduce
                            ? STATEMENT
                            : words.map((w, i) => (
                                <Word key={i} progress={progress} i={i} total={words.length}>
                                    {w}
                                </Word>
                            ))}
                    </p>

                    <p className="mt-8 max-w-md text-base leading-relaxed text-navy/75 lg:mt-10">
                        Anyone can enter numbers into software. What matters is someone
                        who looks at them with care and talks you through them. We take
                        care of the paperwork, so our conversations stay about your
                        business.
                    </p>

                    <motion.figure
                        initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
                        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                        viewport={{ once: true, margin: "-8%" }}
                        transition={{ duration: 1.4, ease }}
                        className="mt-12 lg:mt-14"
                    >
                        <div ref={imageRef} className="relative aspect-[4/3] overflow-hidden rounded-panel bg-mist">
                            <motion.div style={{ y: imageY }} className="absolute -inset-y-[10%] inset-x-0">
                                <Image
                                    src="/images/desk-documents.jpg"
                                    alt="Financial documents, a laptop and notes spread across a desk during a review"
                                    fill
                                    sizes="(min-width: 1024px) 45vw, 100vw"
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>
                        <figcaption className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-navy/50 uppercase">
                            <span className="h-px w-4 bg-royal/50" />
                            Behind every report, a review
                        </figcaption>
                    </motion.figure>

                    <p className="mt-12 max-w-md text-base leading-relaxed text-navy/75">
                        Good accounting is less about software and more about judgement.
                        Technology records the numbers, but people decide what they mean.
                        We keep the process organised so every conversation can focus on
                        your business, not on chasing paperwork.
                    </p>

                    <ol className="mt-10 max-w-lg border-t border-navy/10">
                        {principles.map((p, i) => (
                            <li
                                key={p.n}
                                data-rise=""
                                style={{ "--d": `${i * 0.1}s` }}
                                className="group grid grid-cols-[2.5rem_1fr] border-b border-navy/10 py-6"
                            >
                                <span className="pt-1 font-mono text-[11px] text-royal">{p.n}</span>
                                <div>
                                    <h3 className="font-display text-2xl tracking-tight text-ink transition-colors duration-500 group-hover:text-royal">
                                        {p.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-navy/70">{p.body}</p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    {/* The cube's payoff: lands as the cube locks into place */}
                    <div className="mt-14 lg:mt-20">
                        <p className="max-w-md text-lg leading-relaxed text-navy/80">
                            Your finances are never one task. Accounts, tax, payroll and
                            reporting each have their own deadlines and depend on one
                            another. We keep every part in step.
                        </p>
                        <p className="mt-10 font-display text-[clamp(2.6rem,5vw,4.4rem)] leading-[1] tracking-[-0.015em]">
                            Finance,
                            <br />
                            <em className="text-royal">made clear.</em>
                        </p>
                        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.18em] text-navy/55 uppercase">
                            {DISCIPLINES.map((d) => (
                                <li key={d}>{d}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Cube column: stretches to the copy's height on desktop, pinned inside */}
                <div ref={cubeCol} aria-hidden className="relative h-[170svh] lg:col-span-6 lg:h-auto">
                    <div className="sticky top-0 h-svh overflow-hidden">
                        <div className="absolute inset-[6%] bg-[radial-gradient(closest-side,var(--mist),transparent)]" />
                        <div className="absolute inset-[22%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--royal)_14%,transparent),transparent)]" />

                        <CubeCssStage progress={cubeProgress} offsetX={0} offsetYMobile={0} spread={0.55} />

                        {/* Stage indicator */}
                        <ol className="absolute inset-x-0 bottom-10 flex justify-center gap-8 font-mono text-[10px] tracking-[0.2em] uppercase">
                            {STAGES.map((s, i) => (
                                <li
                                    key={s}
                                    className={`flex items-center gap-2 transition-colors duration-700 ${i === stage ? "text-royal" : "text-navy/30"
                                        }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full transition-colors duration-700 ${i === stage ? "bg-royal" : "bg-navy/20"
                                            }`}
                                    />
                                    {s}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}
