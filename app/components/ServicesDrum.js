"use client";

import { useEffect, useRef, useState } from "react";

// Draft copy and illustrative figures — replace with the firm's real wording.
const SERVICES = [
  {
    name: "Accounting",
    desc: "Year-end accounts and statutory filings, prepared accurately and on time.",
    points: ["Annual accounts & filings", "Companies House and HMRC submissions", "A named accountant who knows your business"],
    visual: { type: "bars", title: "Profit & loss", rows: [["Revenue", 92, "£482k"], ["Costs", 58, "£301k"], ["Profit", 34, "£181k"]] },
  },
  {
    name: "Bookkeeping",
    desc: "Clean, reconciled books kept up to date, so you always know where you stand.",
    points: ["Bank and card reconciliation", "Invoice and expense processing", "Cloud accounting set-up and support"],
    visual: { type: "rows", title: "Bank feed", rows: [["Client receipt", "£3,420", "✓"], ["Office rent", "−£1,800", "✓"], ["Supplier invoice 118", "−£640", "✓"], ["Unmatched payment", "£210", "·"]] },
  },
  {
    name: "VAT",
    desc: "Registration, returns and Making Tax Digital compliance handled end to end.",
    points: ["Registration and scheme advice", "Quarterly MTD-compliant returns", "HMRC enquiry support"],
    visual: { type: "rows", title: "VAT return", tag: "Filed", rows: [["Box 1 · VAT due on sales", "£18,240"], ["Box 4 · VAT reclaimed", "£6,905"], ["Box 5 · Net VAT due", "£11,335"]] },
  },
  {
    name: "Tax",
    desc: "Corporation tax, self assessment and personal tax, prepared and filed correctly.",
    points: ["Corporation tax returns", "Self assessment for directors and owners", "Reliefs and allowances claimed in full"],
    visual: { type: "rows", title: "Tax computation", rows: [["Taxable profit", "£120,000"], ["Reliefs & allowances", "−£14,500"], ["Provision", "Calculated"]] },
  },
  {
    name: "Payroll",
    desc: "Reliable payroll and pensions, with RTI submissions and payslips handled for you.",
    points: ["Payslips and RTI submissions", "Auto-enrolment pensions", "P11D and year-end reporting"],
    visual: { type: "rows", title: "Payslip", tag: "Processed", rows: [["Gross pay", "£4,200.00"], ["PAYE tax", "−£620.40"], ["Employee NI", "−£287.20"], ["Net pay", "£3,292.40"]] },
  },
  {
    name: "Financial Reporting",
    desc: "Clear, decision-ready reports that turn the numbers into a story.",
    points: ["Monthly and quarterly packs", "Board-ready formats", "Budgets against actuals"],
    visual: { type: "chart", title: "Revenue trend" },
  },
  {
    name: "Management Accounts",
    desc: "Timely management information: margins, cash and KPIs in a single view.",
    points: ["KPI dashboards", "Cash-flow forecasts", "Monthly review call"],
    visual: { type: "tiles", title: "This month", tiles: [["Gross margin", "41%", "+2.1"], ["Cash", "£284k", "+6%"], ["Debtor days", "32", "−4"], ["Runway", "14 mo", "="]] },
  },
  {
    name: "Business Advisory",
    desc: "Independent, practical advice on growth, funding and change.",
    points: ["Growth and funding planning", "Scenario modelling", "An ongoing sounding board"],
    visual: { type: "bars", title: "Scenarios", rows: [["A · Hold", 48, "Lower risk"], ["B · Expand", 72, "Higher return"], ["C · Restructure", 60, "Balanced"]] },
  },
  {
    name: "Tax Planning",
    desc: "Structured, compliant planning to keep your tax bill as efficient as the law allows.",
    points: ["Year-round planning, not year-end panic", "Reliefs, allowances and incentives", "Owner remuneration strategy"],
    visual: { type: "rows", title: "Planning calendar", rows: [["Q1", "Review structure"], ["Q2", "Plan pension & dividends"], ["Q3", "Model year-end position"], ["Q4", "Confirm & implement"]] },
  },
];

const N = SERVICES.length;
const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);

function Visual({ v }) {
  return (
    <div className="mt-4 border border-white/[0.07] bg-background/50 p-3.5 sm:mt-5 sm:p-4">
      <div className="mb-3 flex items-center justify-between text-[10px] tracking-[0.2em] text-muted uppercase">
        <span>{v.title}</span>
        {v.tag && <span className="text-brand">● {v.tag}</span>}
      </div>

      {v.type === "rows" && (
        <ul className="divide-y divide-white/[0.06]">
          {v.rows.map((r) => (
            <li key={r[0]} className="flex items-center justify-between gap-4 py-2 text-xs">
              <span className="text-foreground/80">{r[0]}</span>
              <span className="font-mono text-foreground">
                {r[1]} {r[2] && <span className="text-brand">{r[2]}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      {v.type === "bars" && (
        <ul className="space-y-3">
          {v.rows.map((r) => (
            <li key={r[0]} className="text-xs">
              <div className="mb-1 flex justify-between">
                <span className="text-foreground/80">{r[0]}</span>
                <span className="font-mono text-muted">{r[2]}</span>
              </div>
              <div className="h-1.5 bg-white/[0.06]">
                <div className="bar h-full bg-gradient-to-r from-logo-blue to-brand" style={{ "--w": `${r[1]}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {v.type === "chart" && (
        <svg viewBox="0 0 300 100" className="h-24 w-full">
          <defs>
            <linearGradient id="svc-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5b93c7" stopOpacity="0.35" />
              <stop offset="1" stopColor="#5b93c7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 80 C30 74 45 60 70 64 S110 44 140 48 S180 34 210 38 S260 18 300 10 V100 H0Z" fill="url(#svc-area)" />
          <path className="trace-now" pathLength="1" d="M0 80 C30 74 45 60 70 64 S110 44 140 48 S180 34 210 38 S260 18 300 10" fill="none" stroke="#8cb4e1" strokeWidth="1.5" />
          <circle cx="300" cy="10" r="3.5" fill="#b99a5f" />
        </svg>
      )}

      {v.type === "tiles" && (
        <div className="grid grid-cols-2 gap-2">
          {v.tiles.map((t) => (
            <div key={t[0]} className="border border-white/[0.06] p-3">
              <p className="text-[10px] tracking-[0.14em] text-muted uppercase">{t[0]}</p>
              <p className="mt-1 font-mono text-lg">{t[1]}</p>
              <p className="font-mono text-[11px] text-brand">{t[2]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ServicesDrum() {
  const section = useRef(null);
  const items = useRef({ d: [], m: [] });
  const rail = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const el = section.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let disp = 0;

    const loop = () => {
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = clamp(-rect.top / range);
      // Dwell on each service: ease within each step so the dial "locks".
      const raw = p * (N - 1);
      const base = Math.floor(raw);
      const target = base + smooth(clamp((raw - base) * 1.15 - 0.075) / 1) ;
      disp = reduce ? target : disp + (target - disp) * 0.1;

      const place = (list, step, reach) =>
        list.forEach((node, i) => {
          if (!node) return;
          const d = i - disp;
          const ad = Math.abs(d);
          const sc = 1 - Math.min(ad, 3) * 0.08;
          node.style.transform = `translate3d(0, calc(-50% + ${d * step}px), 0) scale(${sc})`;
          node.style.opacity = ad > reach ? 0 : Math.max(0.1, 1 - ad * 0.42);
          node.style.pointerEvents = ad > reach ? "none" : "auto";
        });
      place(items.current.d, 84, 2.5);
      place(items.current.m, 54, 1.6);
      if (rail.current) rail.current.style.transform = `scaleY(${(disp / (N - 1)).toFixed(4)})`;

      const idx = Math.round(disp);
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const jump = (i) => {
    const el = section.current;
    const range = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i / (N - 1)) * range, behavior: "smooth" });
  };

  const s = SERVICES[active];

  return (
    <section id="services" ref={section} className="relative h-[620vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_20%_55%,rgba(36,59,111,0.4),transparent)]"
        />

        <div className="relative mx-auto grid h-full max-w-7xl grid-rows-[auto_9.5rem_1fr] gap-4 px-5 pt-20 pb-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-1 lg:gap-16 lg:px-10 lg:py-0">
          {/* Left: header + drum */}
          <div className="relative flex flex-col lg:py-28">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[11px] tracking-[0.22em] text-brand uppercase sm:gap-4 sm:text-xs sm:tracking-[0.28em]">
                <span className="h-px w-10 bg-brand" />
                What we do
              </p>
              <h2 className="font-display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-tight tracking-tight text-foreground/90">
                Nine services. One accountable team.
              </h2>
            </div>

            <div className="relative mt-4 hidden flex-1 lg:block">
              <DrumItems items={items} kind="d" active={active} jump={jump} />
            </div>

            <p className="mt-auto hidden items-center gap-4 font-mono text-xs text-muted lg:flex">
              <span className="relative block h-16 w-px bg-white/10">
                <span ref={rail} className="absolute inset-0 origin-top bg-brand" style={{ transform: "scaleY(0)" }} />
              </span>
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </p>
          </div>

          {/* Mobile drum (own row so it never overlaps the document) */}
          <div className="relative lg:hidden">
            <DrumItems items={items} kind="m" active={active} jump={jump} mobile />
          </div>

          {/* Right: the "client file" */}
          <div className="min-h-0 lg:flex lg:items-center">
            <div
              key={active}
              className="doc-in w-full overflow-hidden border border-white/10 bg-surface/70 p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-md sm:p-6"
            >
              <div className="flex items-center justify-between text-[10px] tracking-[0.2em] text-muted uppercase">
                <span>Client file · {String(active + 1).padStart(2, "0")}</span>
                <span>Illustrative</span>
              </div>
              <h3 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{s.desc}</p>
              <Visual v={s.visual} />
              <ul className="mt-5 hidden space-y-2 text-sm text-foreground/80 md:block">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                    {p}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="group mt-4 inline-flex sm:mt-5 items-center gap-3 text-sm text-brand"
              >
                Discuss {s.name}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Items are positioned imperatively each frame (desktop and mobile lists separately).
function DrumItems({ items, kind, active, jump, mobile }) {
  return (
    <div className="absolute inset-0">
      {SERVICES.map((s, i) => (
        <button
          key={s.name}
          type="button"
          ref={(node) => {
            items.current[kind][i] = node;
          }}
          onClick={() => jump(i)}
          aria-current={active === i}
          className="absolute top-1/2 left-0 flex origin-left items-baseline gap-4 text-left will-change-transform"
         
        >
          <span className={`font-mono text-xs ${active === i ? "text-brand" : "text-muted"}`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            className={`font-display leading-none tracking-tight transition-colors duration-500 ${
              mobile ? "text-3xl" : "text-[clamp(2.25rem,4.4vw,4rem)]"
            } ${active === i ? "text-foreground" : "text-foreground/60"}`}
          >
            {s.name}
          </span>
        </button>
      ))}
    </div>
  );
}
