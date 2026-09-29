"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import CubeCssStage from "./CubeCssStage";

const ease = [0.22, 1, 0.36, 1];
const clamp = (v) => Math.min(1, Math.max(0, v));

const STATEMENT =
    "Most businesses don't need more figures. They need someone who reads them properly, and tells them what they mean.";

// How we work, stated as commitments rather than metrics.
const principles = [
    {
        n: "01",
        title: "One named accountant",
        body: "You work with the same person, who knows your business and answers your questions directly.",
    },
    {
        n: "02",
        title: "Reviewed by people",
        body: "Software does the recording. Qualified professionals check the numbers before they reach you.",
    },
    {
        n: "03",
        title: "Advice you can act on",
        body: "Plain English, clear next steps, and the context behind every figure we report.",
    },
];

const STAGES = ["Complexity", "Structure", "Clarity"];
const DISCIPLINES = ["Accounts", "Tax", "VAT", "Payroll", "Compliance", "Reporting", "Advisory"];

function Word({ progress, i, total, children }) {
    const start = (i / total) * 0.75;
    const color = useTransform(progress, [start, start + 0.18], ["rgba(20,42,92,0.18)", "rgba(11,26,56,1)"]);
    return (
        <motion.span style={{ color }} className="inline">
            {children}{" "}
        </motion.span>
    );
}

// Scroll progress through the cube column drives the cube. On desktop the
// column spans the whole copy column, so the cube assembles as you read;
// on mobile the column is its own short scroll runway.
function useCubeProgress(ref) {
    const progress = useRef(0);
    const [stage, setStage] = useState(0);

    useEffect(() => {
        const el = ref.current;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let raf;
        let smooth = -1;
        let last = performance.now();
        let lastStage = -1;

        const loop = () => {
            const rect = el.getBoundingClientRect();
            const now = performance.now();
            const dt = Math.min((now - last) / 1000, 0.25);
            last = now;
            const range = Math.max(1, rect.height - window.innerHeight);
            const raw = reduce ? 1 : clamp(-rect.top / range);
            smooth = smooth < 0 || reduce ? raw : smooth + (raw - smooth) * (1 - Math.exp(-dt * 2.8));
            progress.current = smooth;

            const s = smooth < 0.4 ? 0 : smooth < 0.8 ? 1 : 2;
            if (s !== lastStage) {
                lastStage = s;
                setStage(s);
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [ref]);

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
            <div className="mx-auto max-w-[88rem] px-5 pt-28 sm:px-8 lg:px-12 lg:pt-36">
                <div className="flex items-center justify-between border-t border-navy/10 pt-5 font-mono text-[10px] tracking-[0.2em] text-navy/50 uppercase">
                    <span>03 — Our approach</span>
                    <span className="hidden sm:inline">Complexity → structure → clarity</span>
                </div>
                <h2 id="approach-title" className="sr-only">
                    Our approach
                </h2>
            </div>

            <div className="mx-auto grid max-w-[88rem] px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
                {/* Copy column */}
                <div className="pb-20 lg:col-span-6 lg:pb-40">
                    <p
                        ref={statementRef}
                        className="mt-14 font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.1] tracking-[-0.015em] lg:mt-20"
                    >
                        {reduce
                            ? STATEMENT
                            : words.map((w, i) => (
                                <Word key={i} progress={progress} i={i} total={words.length}>
                                    {w}
                                </Word>
                            ))}
                    </p>

                    <motion.figure
                        initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
                        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                        viewport={{ once: true, margin: "-15%" }}
                        transition={{ duration: 1.4, ease }}
                        className="mt-20 lg:mt-28"
                    >
                        <div ref={imageRef} className="relative aspect-[4/3] overflow-hidden bg-mist">
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

                    <p className="mt-16 max-w-md text-base leading-relaxed text-navy/75">
                        Good accounting is less about software and more about judgement. We
                        keep the process organised so the conversation can focus on your
                        business.
                    </p>

                    <ol className="mt-10 max-w-lg border-t border-navy/10">
                        {principles.map((p, i) => (
                            <motion.li
                                key={p.n}
                                initial={reduce ? false : { opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.9, ease, delay: i * 0.1 }}
                                className="group grid grid-cols-[2.5rem_1fr] border-b border-navy/10 py-6"
                            >
                                <span className="pt-1 font-mono text-[11px] text-royal">{p.n}</span>
                                <div>
                                    <h3 className="font-display text-2xl tracking-tight text-ink transition-colors duration-500 group-hover:text-royal">
                                        {p.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-navy/70">{p.body}</p>
                                </div>
                            </motion.li>
                        ))}
                    </ol>

                    {/* The cube's payoff: lands as the cube locks into place */}
                    <div className="mt-24 lg:mt-36">
                        <p className="max-w-md text-lg leading-relaxed text-navy/80">
                            Accounts, tax, payroll, compliance, reporting, advice. Each one
                            moves on its own schedule, and each one affects the others.
                        </p>
                        <p className="mt-10 font-display text-[clamp(2.6rem,5vw,4.4rem)] leading-[1] tracking-[-0.015em]">
                            Complexity,
                            <br />
                            <em className="text-royal">organised.</em>
                        </p>
                        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.18em] text-navy/55 uppercase">
                            {DISCIPLINES.map((d) => (
                                <li key={d}>{d}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Cube column: stretches to the copy's height on desktop, pinned inside */}
                <div ref={cubeCol} aria-hidden className="relative h-[200svh] lg:col-span-6 lg:h-auto">
                    <div className="sticky top-0 h-svh overflow-hidden">
                        <div className="absolute inset-[6%] bg-[radial-gradient(closest-side,var(--mist),transparent)]" />
                        <div className="absolute inset-[22%] bg-[radial-gradient(closest-side,rgba(36,82,181,0.14),transparent)]" />

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
