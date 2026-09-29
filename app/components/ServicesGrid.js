import Link from "next/link";
import ServiceIllustration from "./ServiceIllustrations";
import { SERVICES } from "../lib/services";

const N = SERVICES.length;

// Every service visible at once, side by side: a grid of soft, rounded
// cards that lift to white on hover. No scroll-linked motion; each
// navy report panel animates its chart and headline figure once on first view.
export default function ServicesGrid() {
    return (
        <section
            id="services"
            aria-labelledby="services-title"
            className="relative scroll-mt-20 bg-paper text-ink"
        >
            <div className="mx-auto max-w-[88rem] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
                <div className="flex items-center justify-between border-t border-navy/10 pt-5 font-mono text-[10px] tracking-[0.2em] text-navy/50 uppercase">
                    <span>04 — Services</span>
                    <span className="hidden sm:inline">{N} practice areas</span>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-end">
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

                <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-5">
                    {SERVICES.map((s, i) => (
                        <li
                            key={s.slug}
                            className="group flex flex-col overflow-hidden rounded-panel border border-navy/10 bg-white/50 pb-7 transition-[background-color,box-shadow] duration-500 hover:bg-white hover:shadow-[0_30px_60px_-40px_rgba(11,26,56,0.45)] sm:pb-9"
                        >
                            {/* Flush to the card's top, left and right edges; the card's
                                rounded corners clip its top corners */}
                            <ServiceIllustration slug={s.slug} />

                            <div className="flex flex-1 flex-col px-7 sm:px-9">
                                <p className="mt-8 font-mono text-xs tracking-[0.2em] text-royal">
                                    {String(i + 1).padStart(2, "0")}
                                </p>
                                <h3 className="mt-2 font-display text-[2rem] leading-[1.05] tracking-tight text-ink">
                                    {s.name}
                                </h3>
                                <p className="mt-3 text-[15px] leading-relaxed text-navy/80">{s.desc}</p>

                                <ul className="mt-6 border-t border-navy/10">
                                    {s.points.map((p) => (
                                        <li key={p} className="flex items-baseline gap-3 border-b border-navy/10 py-3 text-sm text-ink/85">
                                            <span className="h-px w-3 shrink-0 -translate-y-1 bg-royal" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 pt-7 text-sm font-medium">
                                    <a href="#contact" className="inline-flex items-center gap-2 text-royal">
                                        Discuss {s.name.toLowerCase()}
                                        <span className="transition-transform duration-500 group-hover:translate-x-1" aria-hidden>
                                            →
                                        </span>
                                    </a>
                                    <Link
                                        href={`/services#${s.slug}`}
                                        className="text-navy/60 underline decoration-navy/20 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                                    >
                                        Full details
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
