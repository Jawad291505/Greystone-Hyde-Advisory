"use client";

import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

// Report-style panels for each service: a headline figure, a real chart
// (gridlines, axis labels, annotations) and supporting line items.
// Every figure is ILLUSTRATIVE sample data, labelled as such in the panel;
// none of it represents the firm's clients or results.

const ease = [0.22, 1, 0.36, 1];
const W = 320;
const H = 150;
const PAD = { t: 14, r: 38, b: 22, l: 2 };
const BOTTOM = H - PAD.b;
const INNER_W = W - PAD.l - PAD.r;

const C = {
    line: "#8fb4ff",
    faint: "rgba(255,255,255,0.3)",
    grid: "rgba(255,255,255,0.08)",
    label: "rgba(255,255,255,0.42)",
    bar: "rgba(143,180,255,0.3)",
};

const k = (v) => `£${Math.round(v / 1000)}k`;
const m = (v) => `£${v.toFixed(1)}m`;
const pct = (v) => `${v.toFixed(1)}%`;
const n0 = (v) => `${Math.round(v)}`;
const MONTHS = ["A", "M", "J", "J", "A", "S", "O", "N", "D", "J", "F", "M"];

export const PANELS = {
    accounting: {
        title: "Profit & loss",
        tag: "FY 2025/26",
        kpi: { label: "Net profit", value: 181240, format: { prefix: "£" }, delta: "+12.4% on prior year" },
        chart: {
            type: "line",
            area: true,
            x: MONTHS,
            tick: k,
            series: [
                { values: [34e3, 36e3, 35e3, 39e3, 41e3, 38e3, 42e3, 44e3, 40e3, 43e3, 45e3, 45e3] },
                { values: [24e3, 25e3, 24e3, 26e3, 26e3, 25e3, 26e3, 27e3, 25e3, 24e3, 25e3, 24e3], faint: true },
            ],
            legend: ["Revenue", "Costs"],
            note: { i: 11, label: "£45k" },
        },
        rows: [["Revenue", "£482k"], ["Costs", "£301k"], ["Margin", "37.6%"]],
    },
    bookkeeping: {
        title: "Bank reconciliation",
        tag: "Live feed",
        kpi: { label: "Transactions matched", value: 96.4, format: { suffix: "%", decimals: 1 }, delta: "412 of 427 this month" },
        chart: {
            type: "bars",
            x: ["W1", "W2", "W3", "W4", "W5", "W6"],
            tick: n0,
            series: [{ values: [58, 71, 66, 80, 74, 63] }],
            highlight: 5,
        },
        rows: [["Matched", "412"], ["Pending", "11"], ["Queries", "4"]],
    },
    vat: {
        title: "VAT return · MTD",
        tag: "Filed",
        kpi: { label: "Net VAT due · Box 5", value: 11335, format: { prefix: "£" }, delta: "Submitted 6 days early" },
        chart: {
            type: "bars",
            x: ["Q1", "Q2", "Q3", "Q4"],
            tick: k,
            series: [{ values: [9800, 10600, 12100, 11335] }],
            highlight: 3,
        },
        rows: [["Box 1", "£18,240"], ["Box 4", "£6,905"], ["Box 5", "£11,335"]],
    },
    tax: {
        title: "Corporation tax",
        tag: "Computed",
        kpi: { label: "Tax provision", value: 26375, format: { prefix: "£" }, delta: "After £14.5k of reliefs" },
        chart: {
            type: "bars",
            x: ["Profit", "Reliefs", "Taxable", "Tax"],
            tick: k,
            series: [{ values: [120000, 14500, 105500, 26375], bases: [0, 105500, 0, 0] }],
            faint: [1],
            highlight: 3,
        },
        rows: [["Taxable profit", "£120,000"], ["Reliefs", "−£14,500"], ["Rate", "25%"]],
    },
    payroll: {
        title: "Payroll run · March",
        tag: "RTI sent",
        kpi: { label: "Net pay · 12 employees", value: 38420, format: { prefix: "£" }, delta: "Paid on the 25th" },
        chart: {
            type: "bars",
            x: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            tick: k,
            series: [{ values: [49200, 49800, 52600, 50100, 50400, 51300] }],
            highlight: 5,
        },
        rows: [["Gross", "£51,300"], ["PAYE & NI", "−£10,480"], ["Pension", "−£2,400"]],
    },
    "financial-reporting": {
        title: "Revenue · year to date",
        tag: "Monthly pack",
        kpi: { label: "YTD revenue", value: 1.24, format: { prefix: "£", suffix: "m", decimals: 2 }, delta: "+8.4% against budget" },
        chart: {
            type: "line",
            area: true,
            x: MONTHS,
            tick: k,
            series: [
                { values: [82e3, 88e3, 91e3, 97e3, 95e3, 104e3, 108e3, 112e3, 106e3, 118e3, 121e3, 118e3] },
                { values: [85e3, 86e3, 88e3, 90e3, 92e3, 95e3, 97e3, 99e3, 100e3, 102e3, 104e3, 106e3], faint: true, dashed: true },
            ],
            legend: ["Actual", "Budget"],
            note: { i: 10, label: "£121k" },
        },
        rows: [["Actual", "£1.24m"], ["Budget", "£1.14m"], ["Variance", "+8.4%"]],
    },
    "management-accounts": {
        title: "Management pack · March",
        tag: "Reviewed",
        kpi: { label: "Gross margin", value: 41.2, format: { suffix: "%", decimals: 1 }, delta: "+2.1 pts month on month" },
        chart: {
            type: "line",
            area: true,
            x: ["W1", "", "W3", "", "W5", "", "W7", "", "W9", "", "W11", ""],
            tick: k,
            series: [{ values: [236e3, 241e3, 238e3, 252e3, 249e3, 258e3, 263e3, 259e3, 270e3, 276e3, 279e3, 284e3] }],
            legend: ["Cash balance"],
            note: { i: 11, label: "£284k" },
        },
        rows: [["Cash", "£284k"], ["Debtor days", "32"], ["Runway", "14 mo"]],
    },
    "business-advisory": {
        title: "Scenario model · 5 years",
        tag: "3 scenarios",
        kpi: { label: "Scenario B · year 5 EBITDA", value: 1.9, format: { prefix: "£", suffix: "m", decimals: 1 }, delta: "Against £1.1m if held" },
        chart: {
            type: "line",
            x: ["Y0", "Y1", "Y2", "Y3", "Y4", "Y5"],
            tick: m,
            series: [
                { values: [0.62, 0.7, 0.78, 0.88, 0.98, 1.1], faint: true, end: "A" },
                { values: [0.62, 0.66, 0.9, 1.2, 1.55, 1.9], end: "B" },
                { values: [0.62, 0.6, 0.8, 1.0, 1.22, 1.45], faint: true, dashed: true, end: "C" },
            ],
        },
        rows: [["A · Hold", "£1.10m"], ["B · Expand", "£1.90m"], ["C · Restructure", "£1.45m"]],
    },
    "tax-planning": {
        title: "Planning calendar",
        tag: "On track",
        kpi: { label: "Effective tax rate", value: 21.4, format: { suffix: "%", decimals: 1 }, delta: "From 24.6% before planning" },
        chart: {
            type: "line",
            x: ["Now", "Q1", "Q2", "Q3", "Q4"],
            tick: pct,
            series: [{ values: [24.6, 24.1, 23.0, 22.2, 21.4], markers: true }],
            note: { i: 4, label: "21.4%" },
        },
        rows: [["Q2", "Pensions"], ["Q3", "Year-end model"], ["Q4", "Implement"]],
    },
};

// ---------- rendering ----------

function scale(chart) {
    const all = chart.series.flatMap((s) => s.values.map((v, i) => v + (s.bases?.[i] ?? 0)));
    let lo = chart.type === "bars" ? 0 : Math.min(...all);
    let hi = Math.max(...all);
    const span = hi - lo || 1;
    if (chart.type !== "bars") lo -= span * 0.15;
    hi += span * 0.12;
    const y = (v) => PAD.t + (1 - (v - lo) / (hi - lo)) * (BOTTOM - PAD.t);
    const ticks = [0, 1, 2].map((t) => lo + ((hi - lo) * (t + 0.5)) / 3);
    return { y, ticks };
}

const xAt = (i, count, bars) =>
    bars ? PAD.l + (INNER_W / count) * (i + 0.5) : PAD.l + (INNER_W * i) / (count - 1);

const drawIn = (delay = 0) => ({
    hidden: { pathLength: 0, opacity: 0 },
    show: {
        pathLength: 1,
        opacity: 1,
        transition: { pathLength: { duration: 1.4, ease, delay }, opacity: { duration: 0.2, delay } },
    },
});

const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8, delay } },
});

function Chart({ chart, gid }) {
    const { y, ticks } = scale(chart);
    const bars = chart.type === "bars";
    const count = chart.x.length;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" aria-hidden>
            <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={C.line} stopOpacity="0.32" />
                    <stop offset="1" stopColor={C.line} stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Gridlines + value axis */}
            {ticks.map((t) => (
                <g key={t}>
                    <line x1={PAD.l} x2={W - PAD.r + 4} y1={y(t)} y2={y(t)} stroke={C.grid} strokeDasharray="2 4" />
                    <text x={W} y={y(t) + 3} textAnchor="end" fontSize="8.5" fill={C.label} className="font-mono">
                        {chart.tick(t)}
                    </text>
                </g>
            ))}
            <line x1={PAD.l} x2={W - PAD.r + 4} y1={BOTTOM} y2={BOTTOM} stroke="rgba(255,255,255,0.18)" />

            {/* Category axis */}
            {chart.x.map((l, i) => (
                <text
                    key={i}
                    x={xAt(i, count, bars)}
                    y={H - 6}
                    textAnchor="middle"
                    fontSize="8.5"
                    fill={C.label}
                    className="font-mono"
                >
                    {l}
                </text>
            ))}

            {bars
                ? chart.series[0].values.map((v, i) => {
                    const base = chart.series[0].bases?.[i] ?? 0;
                    const bw = Math.min(34, (INNER_W / count) * 0.56);
                    const top = y(v + base);
                    const h = y(base) - top;
                    const hi = chart.highlight === i;
                    const faint = chart.faint?.includes(i);
                    return (
                        <motion.rect
                            key={i}
                            x={xAt(i, count, true) - bw / 2}
                            y={top}
                            width={bw}
                            height={h}
                            rx="1.5"
                            fill={hi ? C.line : faint ? "none" : C.bar}
                            stroke={faint ? C.line : "none"}
                            strokeDasharray={faint ? "3 3" : undefined}
                            style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
                            variants={{
                                hidden: { scaleY: 0 },
                                show: { scaleY: 1, transition: { duration: 0.9, ease, delay: 0.2 + i * 0.08 } },
                            }}
                        />
                    );
                })
                : chart.series.map((s, si) => {
                    const pts = s.values.map((v, i) => [xAt(i, count, false), y(v)]);
                    const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
                    const last = pts[pts.length - 1];
                    return (
                        <g key={si}>
                            {chart.area && si === 0 && (
                                <motion.path
                                    d={`${d} L${last[0]} ${BOTTOM} L${pts[0][0]} ${BOTTOM} Z`}
                                    fill={`url(#${gid})`}
                                    variants={fadeIn(1)}
                                />
                            )}
                            <motion.path
                                d={d}
                                fill="none"
                                stroke={s.faint ? C.faint : C.line}
                                strokeWidth={s.faint ? 1.4 : 2}
                                strokeDasharray={s.dashed ? "4 4" : undefined}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                variants={drawIn(0.2 + si * 0.15)}
                            />
                            {s.markers &&
                                pts.map((p, i) => (
                                    <motion.circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--ink)" stroke={C.line} strokeWidth="1.5" variants={fadeIn(0.6 + i * 0.12)} />
                                ))}
                            {s.end && (
                                <motion.text x={last[0] + 7} y={last[1] + 3} fontSize="9" fill={s.faint ? C.label : C.line} className="font-mono" variants={fadeIn(1.4)}>
                                    {s.end}
                                </motion.text>
                            )}
                        </g>
                    );
                })}

            {/* Callout on the key data point */}
            {chart.note && (() => {
                const s = chart.series[0];
                const cx = xAt(chart.note.i, count, false);
                const cy = y(s.values[chart.note.i]);
                return (
                    <motion.g variants={fadeIn(1.5)}>
                        <line x1={cx} x2={cx} y1={cy} y2={BOTTOM} stroke={C.line} strokeOpacity="0.35" strokeDasharray="2 3" />
                        <circle cx={cx} cy={cy} r="7" fill={C.line} fillOpacity="0.18" />
                        <circle cx={cx} cy={cy} r="3.2" fill="#fff" />
                        <rect x={cx - 44} y={cy - 24} width="36" height="15" rx="2" fill="#fff" />
                        <text x={cx - 26} y={cy - 13.5} textAnchor="middle" fontSize="8.5" fontWeight="600" fill="var(--ink)" className="font-mono">
                            {chart.note.label}
                        </text>
                    </motion.g>
                );
            })()}
        </svg>
    );
}

// Headline figure that counts up once when the panel first appears. One text
// node, rendered with the final value (so it never reads as two numbers) and
// reset to zero before paint until the panel is in view.
function Kpi({ value, format, active }) {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const { prefix = "", suffix = "", decimals = 0 } = format;
    const fmt = (v) =>
        `${prefix}${v.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

    useLayoutEffect(() => {
        if (!reduce && !active && ref.current) ref.current.textContent = fmt(0);
        // Only on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!active || !ref.current) return;
        if (reduce) {
            ref.current.textContent = fmt(value);
            return;
        }
        const c = animate(0, value, {
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => ref.current && (ref.current.textContent = fmt(v)),
        });
        return () => c.stop();
        // fmt is derived from stable props
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, reduce, value]);

    return (
        <span ref={ref} className="tabular-nums">
            {fmt(value)}
        </span>
    );
}

export default function ServicePanel({ slug }) {
    const p = PANELS[slug];
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.35 });
    const reduce = useReducedMotion();
    const gid = `g${useId().replace(/:/g, "")}`;
    if (!p) return null;
    const active = inView || reduce;

    return (
        <motion.div
            ref={ref}
            initial={reduce ? false : "hidden"}
            animate={active ? "show" : "hidden"}
            className="relative overflow-hidden bg-[linear-gradient(160deg,var(--navy)_0%,var(--ink)_100%)] p-6 text-white sm:p-7"
        >
            {/* Soft royal light, top right */}
            <div aria-hidden className="pointer-events-none absolute -top-1/3 -right-1/4 h-[80%] w-[70%] bg-[radial-gradient(closest-side,rgba(36,82,181,0.55),transparent)]" />

            <div className="relative">
                <div className="flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.18em] uppercase">
                    <span className="truncate text-white/55">{p.title}</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-[#8fb4ff]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#8fb4ff]" />
                        {p.tag}
                    </span>
                </div>

                <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs text-white/60">{p.kpi.label}</p>
                        <p className="mt-1.5 font-display text-[2.25rem] leading-none tracking-tight">
                            <Kpi value={p.kpi.value} format={p.kpi.format} active={active} />
                        </p>
                    </div>
                    {p.chart.legend && (
                        <ul className="mb-1 hidden shrink-0 space-y-1 font-mono text-[9px] text-white/50 sm:block">
                            {p.chart.legend.map((l, i) => (
                                <li key={l} className="flex items-center gap-1.5">
                                    <span className={`h-px w-3 ${i === 0 ? "bg-[#8fb4ff]" : "bg-white/40"}`} />
                                    {l}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <p className="mt-2 text-xs text-[#8fb4ff]">{p.kpi.delta}</p>

                <div className="mt-5">
                    <Chart chart={p.chart} gid={gid} />
                </div>

                <dl className="mt-4 grid grid-cols-3 border-t border-white/10 pt-3">
                    {p.rows.map(([label, value]) => (
                        <div key={label} className="min-w-0">
                            <dt className="truncate font-mono text-[10px] tracking-[0.1em] text-white/50 uppercase">{label}</dt>
                            <dd className="mt-1 font-mono text-[13px] tabular-nums text-white/90">{value}</dd>
                        </div>
                    ))}
                </dl>

                <p className="mt-4 text-right font-mono text-[9px] tracking-[0.16em] text-white/35 uppercase">
                    Illustrative figures
                </p>
            </div>
        </motion.div>
    );
}
