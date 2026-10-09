import Image from "next/image";

// Every file in /public/logo is a 500 × 500 artboard with the mark floating in
// the middle, so `size` is the artboard's rendered edge, tuned per logo until
// the marks carry the same visual weight (a wordmark needs a bigger artboard
// than Xero's disc does).
const ROWS = [
    [
        { src: "xero", name: "Xero", size: 46 },
        { src: "bq", name: "QuickBooks", size: 100 },
        { src: "stripe", name: "Stripe", size: 72 },
        { src: "shopify", name: "Shopify", size: 94 },
        { src: "gusto", name: "Gusto", size: 78 },
        { src: "ramp", name: "Ramp", size: 84 },
    ],
    [
        { src: "a2x", name: "A2X", size: 96 },
        { src: "amazon", name: "Amazon", size: 90 },
        { src: "square", name: "Square", size: 96 },
        { src: "adp", name: "ADP", size: 78 },
        { src: "bill", name: "BILL", size: 84 },
        { src: "bluevine", name: "Bluevine", size: 104 },
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
            className="relative mr-3 h-14 w-28 shrink-0 overflow-hidden rounded-inner border border-navy/10 bg-white sm:mr-4 sm:h-16 sm:w-36"
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
                            Platforms we work with
                        </p>
                        <h2
                            id="tools-title"
                            className="mt-4 font-display text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.015em]"
                        >
                            The software <em className="text-royal">behind your numbers.</em>
                        </h2>
                    </div>
                    <p className="max-w-md text-base leading-relaxed text-navy/75 lg:col-span-4 lg:col-start-9">
                        From bookkeeping and payroll to payments and online sales, we
                        work inside the systems your business already runs on.
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
