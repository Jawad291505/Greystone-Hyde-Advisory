import Image from "next/image";

// Every file in /public/logo is a 500 × 500 artboard with the mark floating in
// the middle, so `size` is the artboard's rendered edge, tuned per logo until
// the marks carry the same visual weight (a wordmark needs a bigger artboard
// than Xero's disc does).
const ROWS = [
    [
        { src: "xero", name: "Xero", size: 72 },
        { src: "bq", name: "QuickBooks", size: 155 },
        { src: "stripe", name: "Stripe", size: 110 },
        { src: "shopify", name: "Shopify", size: 145 },
        { src: "gusto", name: "Gusto", size: 120 },
        { src: "ramp", name: "Ramp", size: 130 },
    ],
    [
        { src: "a2x", name: "A2X", size: 150 },
        { src: "amazon", name: "Amazon", size: 140 },
        { src: "square", name: "Square", size: 150 },
        { src: "adp", name: "ADP", size: 120 },
        { src: "bill", name: "BILL", size: 130 },
        { src: "bluevine", name: "Bluevine", size: 160 },
    ],
];

// Enough repeats that one half of the track is wider than any screen; the
// track then slides by exactly that half and loops unseen.
const REPEATS = 3;

function Tiles({ row, hidden }) {
    return row.map((t) => (
        <li
            key={t.src}
            aria-hidden={hidden || undefined}
            className="relative mr-3 h-20 w-40 shrink-0 overflow-hidden rounded-inner border border-navy/10 bg-white sm:mr-4 sm:h-24 sm:w-48"
        >
            <Image
                src={`/logo/${t.src}.svg`}
                alt={hidden ? "" : t.name}
                width={t.size}
                height={t.size}
                className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 max-sm:scale-[0.85]"
            />
        </li>
    ));
}

// One row of the carousel. Only the first set of tiles is exposed to
// assistive tech; the rest are the visual copies that make the loop seamless.
function Row({ row, reverse }) {
    return (
        <div className="logo-marquee overflow-hidden">
            <ul className={`logo-track flex w-max ${reverse ? "logo-track-reverse" : ""}`}>
                {Array.from({ length: REPEATS * 2 }, (_, i) => (
                    <Tiles key={i} row={row} hidden={i > 0} />
                ))}
            </ul>
        </div>
    );
}

// The software the practice works in, as two rows drifting in opposite
// directions. Unnumbered: it sits between Services and Our approach as a
// short band rather than a section of its own in the page's running order.
export default function ToolsMarquee() {
    return (
        <section aria-labelledby="tools-title" className="relative bg-paper pb-4 text-ink lg:pb-6">
            <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
                <div className="grid gap-4 border-t border-navy/10 pt-10 lg:grid-cols-12 lg:items-end lg:pt-12">
                    <div className="lg:col-span-7">
                        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-navy/50 uppercase">
                            <span className="h-px w-4 bg-royal/50" />
                            Our expertise
                        </p>
                        <h2
                            id="tools-title"
                            className="mt-4 font-display text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.015em]"
                        >
                            Fluent in the tools <em className="text-royal">you already use.</em>
                        </h2>
                    </div>
                    <p className="max-w-md text-base leading-relaxed text-navy/75 lg:col-span-4 lg:col-start-9">
                        Accounting, payroll, payments and e-commerce platforms, connected
                        properly so your figures arrive clean and reconcile first time.
                    </p>
                </div>
            </div>

            <div className="logo-marquees mt-10 space-y-3 sm:space-y-4 lg:mt-12">
                <Row row={ROWS[0]} />
                <Row row={ROWS[1]} reverse />
            </div>
        </section>
    );
}
