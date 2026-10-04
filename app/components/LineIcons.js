"use client";

import { motion, useReducedMotion } from "framer-motion";

// A small family of hairline icons, drawn on a 48-unit grid with one stroke
// weight so they read as a set. Each one draws itself in once, the first
// time it scrolls into view; a single soft royal accent carries the message.

const ease = [0.22, 1, 0.36, 1];
const draw = (i) => ({
    hidden: { pathLength: 0, opacity: 0 },
    show: {
        pathLength: 1,
        opacity: 1,
        transition: { pathLength: { duration: 1.1, ease, delay: 0.1 + i * 0.09 }, opacity: { duration: 0.2, delay: 0.1 + i * 0.09 } },
    },
});
const fade = (i) => ({
    hidden: { opacity: 0, scale: 0.6 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease, delay: 0.5 + i * 0.09 } },
});

// Line: a stroked path that draws in. Dot: a filled accent that settles in.
function L({ i = 0, ...p }) {
    return <motion.path variants={draw(i)} {...p} />;
}
function Dot({ i = 0, ...p }) {
    return <motion.circle variants={fade(i)} style={{ transformBox: "fill-box", transformOrigin: "center" }} stroke="none" {...p} />;
}
const ACCENT = "color-mix(in srgb, var(--royal) 14%, transparent)";

const ICONS = {
    // Open ledger with a reconciled tick: accounts kept and balanced
    ledger: (
        <>
            <L i={0} d="M24 13c-5-3-11.5-3.4-16-2.2v26.4c4.5-1.2 11-.8 16 2.2" />
            <L i={1} d="M24 13c5-3 11.5-3.4 16-2.2v26.4c-4.5-1.2-11-.8-16 2.2" />
            <L i={2} d="M24 13v26.4" />
            <L i={3} d="M12.5 18.5h7M12.5 23.5h7M12.5 28.5h5" />
            <Dot i={4} cx={32.5} cy={25} r={6.5} fill={ACCENT} />
            <L i={4} d="M29.5 25l2.2 2.2 4.3-4.6" />
        </>
    ),
    // A return with a % seal: tax and VAT computed and filed
    tax: (
        <>
            <L i={0} d="M13 7h15l7 7v27H13z" />
            <L i={1} d="M28 7v7h7" />
            <L i={2} d="M18 19h9M18 24h12" />
            <Dot i={3} cx={31} cy={34} r={7.5} fill={ACCENT} />
            <L i={3} d="M28 37l6-6" />
            <L i={4} d="M28.6 31.6a.6.6 0 1 0 0-.01M33.4 36.4a.6.6 0 1 0 0-.01" />
        </>
    ),
    // A payslip marked in pounds: people paid correctly, on time
    payroll: (
        <>
            <L i={0} d="M9 12a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3z" />
            <L i={1} d="M9 17h30" />
            <Dot i={2} cx={24} cy={28} r={8} fill={ACCENT} />
            <L i={2} d="M27 24.2c-.4-2.6-5.6-2.9-5.6.9V32M19 28.4h6M19 32h8.5" />
        </>
    ),
    // Bars under a rising trend line: reporting that shows direction
    chart: (
        <>
            <L i={0} d="M8 39h32" />
            <L i={1} d="M13 39V29M21 39V24M29 39V20M37 39V14" />
            <L i={2} d="M10 25l8-7 7 2.5L37 9" />
            <Dot i={3} cx={37} cy={9} r={3.2} fill="currentColor" />
        </>
    ),
    // A calendar with a planned, rising path through the year
    planning: (
        <>
            <L i={0} d="M8 14a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v23a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z" />
            <L i={1} d="M8 19h32M16 7v7M32 7v7" />
            <L i={2} d="M13 34l6.5-5 6 2 9-8" />
            <L i={3} d="M30.5 23h4v4" />
            <Dot i={3} cx={19.5} cy={29} r={2.2} fill="currentColor" />
        </>
    ),
    // A compass: independent direction for bigger decisions
    compass: (
        <>
            <L i={0} d="M24 9a15 15 0 1 1 0 30 15 15 0 1 1 0-30" />
            <L i={1} d="M24 4.5v3M24 40.5v3M4.5 24h3M40.5 24h3" />
            <Dot i={2} cx={24} cy={24} r={9.5} fill={ACCENT} />
            <L i={2} d="M29.5 16.5L26.4 26.4 16.5 31.5 21.6 21.6z" />
            <Dot i={3} cx={24} cy={24} r={1.6} fill="currentColor" />
        </>
    ),
    // A person with a speech bubble: one contact who answers directly
    contact: (
        <>
            <L i={0} d="M19 11a6 6 0 1 1 0 12 6 6 0 1 1 0-12" />
            <L i={1} d="M8 39c0-7 4.9-11.5 11-11.5S30 32 30 39" />
            <Dot i={2} cx={36} cy={14} r={7} fill={ACCENT} />
            <L i={2} d="M30 8.5h12v10h-5l-3.5 3.2v-3.2H30z" />
            <L i={3} d="M33.5 13.5h5" />
        </>
    ),
    // A return under a magnifying glass: detail checked, reliefs found
    review: (
        <>
            <L i={0} d="M11 7h14l6 6v12" />
            <L i={0} d="M11 7v32h13" />
            <L i={1} d="M25 7v6h6" />
            <L i={2} d="M15.5 18h9M15.5 23h6" />
            <Dot i={3} cx={31} cy={32} r={6.5} fill={ACCENT} />
            <L i={3} d="M31 25.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 1 1 0-13M35.8 36.8L41 42" />
        </>
    ),
    // A month with one date ringed: pay day, the same every month
    payday: (
        <>
            <L i={0} d="M8 14a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v23a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z" />
            <L i={1} d="M8 19h32M16 7v7M32 7v7" />
            <L i={2} d="M14 25h.01M20 25h.01M26 25h.01M14 31h.01M20 31h.01M26 31h.01M14 35.5h.01M20 35.5h.01" strokeWidth={2.2} />
            <Dot i={3} cx={33} cy={31} r={5} fill={ACCENT} />
            <L i={3} d="M30.8 31l1.6 1.6 3-3.2" />
        </>
    ),
    // A target with the arrow home: advice read against your goals
    target: (
        <>
            <Dot i={0} cx={22} cy={26} r={8} fill={ACCENT} />
            <L i={0} d="M22 11a15 15 0 1 1 0 30 15 15 0 1 1 0-30" />
            <L i={1} d="M22 18a8 8 0 1 1 0 16 8 8 0 1 1 0-16" />
            <L i={2} d="M22 26L38 10" />
            <L i={3} d="M33 10h5v5" />
            <Dot i={3} cx={22} cy={26} r={2.2} fill="currentColor" />
        </>
    ),
    // A report with a verified tick: figures reconciled to the penny
    precision: (
        <>
            <L i={0} d="M25 41H11V7h20l5 5v13" />
            <L i={1} d="M31 7v5h5" />
            <L i={2} d="M16 14h9M17 33v-5M23 33v-9M29 33v-6" />
            <Dot i={3} cx={35} cy={35} r={7} fill={ACCENT} />
            <L i={3} d="M32 35l2.2 2.2 4.3-4.6" />
        </>
    ),
    // A flag planted ahead on the horizon: issues flagged before they arrive
    proactive: (
        <>
            <L i={0} d="M6 38h36" />
            <L i={1} d="M7 32c6 0 9-7 15-7s7 3 10 3" />
            <Dot i={2} cx={36} cy={17} r={6.5} fill={ACCENT} />
            <L i={2} d="M31 38V10" />
            <L i={3} d="M31 11h11l-3.2 4.5L42 20H31" />
        </>
    ),
    // A price tag marked in pounds: the fee agreed up front
    fees: (
        <>
            <L i={0} d="M7 24V10a3 3 0 0 1 3-3h14l17 17-17 17z" />
            <L i={1} d="M14.5 14.5h.01" strokeWidth={2.6} />
            <Dot i={2} cx={24.5} cy={25} r={7.5} fill={ACCENT} />
            <L i={2} d="M27.2 21.4c-.4-2.3-5.1-2.6-5.1.8V29M20.2 25.3h5M20.2 29h7.6" />
        </>
    ),
    // A cloud carrying a rising line: live figures, always current
    cloud: (
        <>
            <L i={0} d="M14 36a7.5 7.5 0 0 1-1-14.9A10.5 10.5 0 0 1 33.4 18 9 9 0 0 1 34.5 36z" />
            <Dot i={1} cx={24} cy={27} r={7} fill={ACCENT} />
            <L i={1} d="M16.5 31l5.5-4.5 4 2.2 6.5-6.7" />
            <L i={2} d="M28.5 22h4v4" />
        </>
    ),
    // A shield with a keyhole: confidentiality built in
    shield: (
        <>
            <L i={0} d="M24 6l14 5v11c0 9.5-6 16.5-14 20-8-3.5-14-10.5-14-20V11z" />
            <Dot i={1} cx={24} cy={23} r={8} fill={ACCENT} />
            <L i={2} d="M24 18.5a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 1 1 0-5.6M24 24.1v5.4" />
        </>
    ),
    // A path that branches: the options weighed, one direction chosen
    direction: (
        <>
            <L i={0} d="M24 41V26" />
            <L i={1} d="M24 26L13 13M24 26l11-13" />
            <L i={2} d="M13 18.5V13h5.5" />
            <L i={2} d="M29.5 13H35v5.5" />
            <Dot i={3} cx={35} cy={13} r={5} fill={ACCENT} />
            <Dot i={3} cx={24} cy={26} r={2} fill="currentColor" />
        </>
    ),
};

export default function LineIcon({ name, className = "h-10 w-10" }) {
    const reduce = useReducedMotion();
    return (
        <motion.svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-5%" }}
            className={`shrink-0 text-royal ${className}`}
        >
            {ICONS[name]}
        </motion.svg>
    );
}
