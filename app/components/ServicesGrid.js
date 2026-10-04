"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ServiceIllustration from "./ServiceIllustrations";
import LineIcon from "./LineIcons";
import { SERVICES } from "../lib/services";

const ease = [0.22, 1, 0.36, 1];
// Unhurried in-and-out curve for cards opening and closing
const glide = [0.65, 0, 0.35, 1];
const bySlug = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));

// The nine practice areas, gathered into six disciplines so the section
// reads as six cards. Every service keeps its own copy and report panel.
const GROUPS = [
    { name: "Accounting & Bookkeeping", icon: "ledger", slugs: ["accounting", "bookkeeping"] },
    { name: "Tax & VAT", icon: "tax", slugs: ["tax", "vat"] },
    { name: "Payroll", icon: "payroll", slugs: ["payroll"] },
    { name: "Reporting & Management Accounts", icon: "chart", slugs: ["financial-reporting", "management-accounts"] },
    { name: "Tax Planning", icon: "planning", slugs: ["tax-planning"] },
    { name: "Business Advisory", icon: "compass", slugs: ["business-advisory"] },
];
const ROWS = [
    [0, 1, 2],
    [3, 4, 5],
];
const num = (i) => String(i + 1).padStart(2, "0");

const PHONE = "(max-width: 639px)";
function subscribePhone(cb) {
    const mq = window.matchMedia(PHONE);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
}

// Only one card is open at a time. Its row is four tracks wide (open card
// 2fr, the others 1fr) and the other row splits evenly into thirds. The
// copy column is one track wide in the open row, so opening a card reveals
// its report panel beside the copy rather than reflowing it.
const GAP = "1.25rem";
const TRACK = `calc((100cqw - 2 * ${GAP}) / 4)`;
const THIRD = `calc((100cqw - 2 * ${GAP}) / 3)`;
// Matches the row's grid-template-columns transition
const SWAP_MS = 1100;
// Row heights: a closed row shows each card's icon, title and description;
// the row holding the open card grows to reveal points, links and the panel.
// Only one row is ever open, so the section's overall height never changes.
const ROW_CLOSED = "15rem";
const ROW_OPEN = "31rem";

const list = { show: { transition: { staggerChildren: 0.1 } } };
const cardIn = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

// Switches between the services inside a two-service card.
function SubTabs({ g, sub, setSub }) {
    if (g.slugs.length < 2) return null;
    return (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${g.name} services`}>
            {g.slugs.map((slug) => {
                const on = slug === sub;
                return (
                    <button
                        key={slug}
                        type="button"
                        aria-pressed={on}
                        onMouseEnter={() => setSub(slug)}
                        onFocus={() => setSub(slug)}
                        onClick={() => setSub(slug)}
                        className={`rounded-full border px-3 py-1 text-[12px] tracking-wide transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${on ? "border-navy bg-navy text-white" : "border-navy/15 text-navy/65 hover:border-royal/40 hover:text-royal"
                            }`}
                    >
                        {bySlug[slug].name}
                    </button>
                );
            })}
        </div>
    );
}

function Points({ s }) {
    return (
        <ul className="border-t border-navy/10">
            {s.points.map((p) => (
                <li key={p} className="flex items-baseline gap-3 border-b border-navy/10 py-2.5 text-[13px] leading-snug text-ink/80">
                    <span className="h-px w-2.5 shrink-0 -translate-y-1 bg-royal" />
                    {p}
                </li>
            ))}
        </ul>
    );
}

function Actions({ g, s }) {
    return (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium">
            <a
                href="#contact"
                aria-label={`Discuss ${g.name.toLowerCase()}`}
                className="group/cta inline-flex items-center gap-2 text-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
            >
                Discuss
                <span className="transition-transform duration-500 group-hover/cta:translate-x-1" aria-hidden>
                    →
                </span>
            </a>
            <Link
                href={`/services#${s.slug}`}
                className="text-navy/55 underline decoration-navy/20 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            >
                Full details
            </Link>
        </div>
    );
}

// The report panel for the service in focus, cross-fading when it changes.
function Panel({ slug, reduce }) {
    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={slug}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease }}
                className="w-full overflow-hidden rounded-inner"
            >
                <ServiceIllustration slug={slug} />
            </motion.div>
        </AnimatePresence>
    );
}

// Six cards in two rows of three, every card the same height. One card is
// open at a time (the first, to begin with), twice the width with its report
// panel beside the copy; pointing at any other card opens it and closes the
// last. Below desktop the cards stack, each opened by a tap; closed cards
// fold down to their title so the stack stays short. On tablets the first
// starts open; on phones they all start closed, about one screen tall.
export default function ServicesGrid() {
    const [open, setOpen] = useState(0);
    // The stacked layout keeps its own open card: null until the first tap.
    const [tapped, setTapped] = useState(null);
    const phone = useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE).matches, () => true);
    const stacked = tapped ?? (phone ? -1 : 0);
    const [subs, setSubs] = useState({});
    const reduce = useReducedMotion();
    const uid = useId();
    const timer = useRef();
    const settle = useRef();
    const items = useRef([]);

    const activeRow = ROWS.findIndex((row) => row.includes(open));
    // Which rows lay their copy out one track wide. A row that gains the open
    // card narrows its copy at once (its cards are shrinking); a row that loses
    // it keeps the narrow copy until its cards have finished widening, so the
    // text re-wraps once rather than being clipped or squeezed mid-animation.
    const [narrow, setNarrow] = useState([true, false]);
    useEffect(() => {
        clearTimeout(settle.current);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNarrow((n) => n.map((v, r) => v || r === activeRow));
        settle.current = setTimeout(
            () => setNarrow(ROWS.map((_, r) => r === activeRow)),
            reduce ? 0 : SWAP_MS,
        );
        return () => clearTimeout(settle.current);
    }, [activeRow, reduce]);

    useEffect(() => () => clearTimeout(timer.current), []);

    const subOf = (i) => subs[i] ?? GROUPS[i].slugs[0];
    const setSubOf = (i) => (slug) => setSubs((s) => ({ ...s, [i]: slug }));

    // A deliberate hover intent, so sweeping across the grid doesn't set every
    // card moving; the card stays open after the pointer leaves.
    const hover = (i) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOpen(i), 200);
    };
    const cancel = () => clearTimeout(timer.current);

    // Stacked cards: the card above folds away as this one opens, which can
    // carry its heading off the top of the screen, so bring it back into view.
    const toggle = (i) => {
        const next = i === stacked ? -1 : i;
        setTapped(next);
        clearTimeout(timer.current);
        if (next < 0) return;
        timer.current = setTimeout(
            () => {
                const el = items.current[next];
                if (el && el.getBoundingClientRect().top < 88) {
                    el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
                }
            },
            reduce ? 0 : 850,
        );
    };

    return (
        <section id="services" aria-labelledby="services-title" className="relative scroll-mt-20 bg-paper text-ink">
            <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
                <div className="flex items-center justify-between border-t border-navy/10 pt-5 font-mono text-[10px] tracking-[0.2em] text-navy/50 uppercase">
                    <span>01 — Services</span>
                    <span className="hidden sm:inline"> practice areas</span>
                </div>

                <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-12 lg:items-end">
                    <h2
                        id="services-title"
                        className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-[-0.015em] lg:col-span-7"
                    >
                        What we do, <em className="text-royal">in detail.</em>
                    </h2>
                    <p className="max-w-md text-base leading-relaxed text-navy/75 lg:col-span-4 lg:col-start-9">
                        Each engagement is handled by the same team, so your accounts,
                        tax and payroll are always read together.
                    </p>
                </div>

                {/* Desktop: two rows of three, one open card across both */}
                <motion.div
                    variants={list}
                    initial={reduce ? false : "hidden"}
                    whileInView="show"
                    viewport={{ once: true, margin: "-10%" }}
                    className="@container mt-14 hidden flex-col xl:flex"
                    style={{ gap: GAP }}
                >
                    {ROWS.map((row, r) => (
                        <div
                            key={r}
                            onMouseLeave={cancel}
                            className="grid transition-[grid-template-columns,height] duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
                            style={{
                                gap: GAP,
                                height: r === activeRow ? ROW_OPEN : ROW_CLOSED,
                                gridTemplateColumns: r === activeRow ? row.map((i) => (i === open ? "2fr" : "1fr")).join(" ") : "1fr 1fr 1fr",
                            }}
                        >
                            {row.map((i) => {
                                const g = GROUPS[i];
                                const on = i === open;
                                const s = bySlug[subOf(i)];
                                return (
                                    <motion.article
                                        key={g.name}
                                        variants={cardIn}
                                        onMouseEnter={() => hover(i)}
                                        onFocusCapture={() => setOpen(i)}
                                        aria-labelledby={`${uid}-t-${i}`}
                                        className={`relative h-full overflow-hidden rounded-card border transition-[background-color,border-color,box-shadow] duration-700 ${on
                                                ? "border-navy/10 bg-white shadow-[0_30px_60px_-40px_rgba(11,26,56,0.4)]"
                                                : "border-navy/10 bg-white/55 hover:border-royal/25"
                                            }`}
                                    >
                                        <span
                                            aria-hidden
                                            className={`absolute top-0 left-0 h-0.5 w-full origin-left bg-royal transition-transform duration-1000 ${on ? "scale-x-100" : "scale-x-0"}`}
                                        />
                                        <div className="flex h-full">
                                            {/* Copy: one track wide in the open row, a third otherwise */}
                                            <div className="flex h-full shrink-0 flex-col p-7" style={{ width: narrow[r] ? TRACK : THIRD }}>
                                                <div className="flex items-start justify-between">
                                                    <LineIcon name={g.icon} className="h-11 w-11" />
                                                    <span className="font-mono text-[11px] text-navy/40">{num(i)}</span>
                                                </div>
                                                <h3
                                                    id={`${uid}-t-${i}`}
                                                    className={`mt-6 font-display text-[1.6rem] leading-[1.08] tracking-tight text-ink ${narrow[r] ? "min-h-[2.16em]" : ""}`}
                                                >
                                                    {g.name}
                                                </h3>
                                                <p className="mt-3 text-sm leading-relaxed text-navy/75">{s.desc}</p>
                                                <div
                                                    inert={r !== activeRow}
                                                    className={`mt-auto pt-5 transition-opacity ${r === activeRow ? "opacity-100 delay-500 duration-700" : "opacity-0 duration-300"}`}
                                                >
                                                    <Points s={s} />
                                                    <div className="mt-5">
                                                        <Actions g={g} s={s} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Report panel: revealed as the card opens */}
                                            <div
                                                inert={!on}
                                                className={`flex h-full shrink-0 flex-col justify-center py-7 pr-7 transition-opacity ${on ? "opacity-100 delay-300 duration-700" : "opacity-0 duration-300"}`}
                                                style={{ width: TRACK }}
                                            >
                                                <SubTabs g={g} sub={s.slug} setSub={setSubOf(i)} />
                                                <div className={g.slugs.length > 1 ? "mt-4" : ""}>
                                                    <Panel slug={s.slug} reduce={reduce} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    ))}
                </motion.div>

                {/* Below desktop: stacked cards, the first open, one open at a time */}
                <motion.ul
                    variants={list}
                    initial={reduce ? false : "hidden"}
                    whileInView="show"
                    viewport={{ once: true, margin: "-10%" }}
                    className="mt-10 space-y-3 xl:hidden"
                >
                    {GROUPS.map((g, i) => {
                        const on = i === stacked;
                        const s = bySlug[subOf(i)];
                        return (
                            <motion.li
                                key={g.name}
                                variants={cardIn}
                                ref={(el) => {
                                    items.current[i] = el;
                                }}
                                className={`scroll-mt-24 overflow-hidden rounded-card border transition-[background-color,box-shadow] duration-700 ${on ? "border-navy/10 bg-white shadow-[0_30px_60px_-44px_rgba(11,26,56,0.4)]" : "border-navy/10 bg-white/55"
                                    }`}
                            >
                                <h3>
                                    <button
                                        type="button"
                                        aria-expanded={on}
                                        aria-controls={`${uid}-acc-${i}`}
                                        onClick={() => toggle(i)}
                                        className="flex w-full items-start gap-4 p-5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-royal sm:gap-5 sm:p-6"
                                    >
                                        <LineIcon name={g.icon} className="h-10 w-10" />
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-mono text-[10px] tracking-[0.18em] text-navy/40">{num(i)}</span>
                                            <span className="mt-1 block font-display text-[1.45rem] leading-tight tracking-tight text-ink sm:text-[1.65rem]">
                                                {g.name}
                                            </span>
                                            {/* Folded away while the card is closed */}
                                            <span
                                                className={`grid transition-[grid-template-rows,opacity] duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                                            >
                                                <span className="overflow-hidden">
                                                    <span className="block pt-2 text-[15px] leading-relaxed text-navy/75">{s.desc}</span>
                                                </span>
                                            </span>
                                        </span>
                                        <span
                                            aria-hidden
                                            className={`relative mt-2 h-3 w-3 shrink-0 transition-transform duration-700 ${on ? "rotate-45" : ""}`}
                                        >
                                            <span className="absolute top-1/2 left-0 h-px w-3 bg-royal" />
                                            <span className="absolute top-0 left-1/2 h-3 w-px bg-royal" />
                                        </span>
                                    </button>
                                </h3>
                                <AnimatePresence initial={false}>
                                    {on && (
                                        <motion.div
                                            id={`${uid}-acc-${i}`}
                                            initial={reduce ? false : { height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={reduce ? undefined : { height: 0, opacity: 0 }}
                                            transition={{ height: { duration: 0.8, ease: glide }, opacity: { duration: 0.6, delay: 0.15 } }}
                                        >
                                            <div className="grid gap-7 px-5 pb-6 sm:grid-cols-2 sm:items-center sm:px-6 sm:pb-7">
                                                <div>
                                                    <div className="mb-5 empty:hidden">
                                                        <SubTabs g={g} sub={s.slug} setSub={setSubOf(i)} />
                                                    </div>
                                                    <Points s={s} />
                                                    <div className="mt-5">
                                                        <Actions g={g} s={s} />
                                                    </div>
                                                </div>
                                                <Panel slug={s.slug} reduce={reduce} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.li>
                        );
                    })}
                </motion.ul>

                <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-navy/70">
                    Not sure where to start?
                    <a
                        href="#contact"
                        className="font-medium text-royal underline decoration-royal/30 underline-offset-4 transition-colors hover:decoration-royal"
                    >
                        Book a consultation
                    </a>
                </p>
            </div>
        </section>
    );
}
