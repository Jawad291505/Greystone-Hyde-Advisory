import Image from "next/image";
import Link from "./ThemeLink";
import OfficeMap from "./OfficeMap";

const ADDRESS = "4–6 Greatorex St, London E1 5NF";
const ADDRESS_QUERY = encodeURIComponent("4-6 Greatorex St, London E1 5NF, United Kingdom");
const MAP_SRC = `https://www.google.com/maps?q=${ADDRESS_QUERY}&z=16&output=embed`;
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${ADDRESS_QUERY}`;

// Placeholder contact details, shared with the contact section — replace
// with the firm's real ones.
const EMAIL = "hello@greystonehyde.co.uk";
const PHONE = { label: "+44 (0)20 0000 0000", href: "tel:+442000000000" };

// PLACEHOLDER profile URLs — replace with the firm's real pages before launch.
const SOCIAL = [
    { label: "LinkedIn", href: "#", icon: "linkedin" },
    { label: "Instagram", href: "#", icon: "instagram" },
    { label: "Facebook", href: "#", icon: "facebook" },
];

const LINKS = [
    { label: "Services", href: "/services" },
    { label: "Why us", href: "/#why-us" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/about" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact", href: "/#contact" },
    { label: "Pay an invoice", href: "/services#payments" },
];

function SocialIcon({ name }) {
    if (name === "linkedin")
        return (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                <path d="M6.94 8.75H3.56V20h3.38V8.75zM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92zM20.44 13.55c0-3.03-1.62-4.44-3.78-4.44-1.74 0-2.52.96-2.96 1.63V8.75h-3.38c.04.95 0 11.25 0 11.25h3.38v-6.28c0-.34.02-.67.12-.91.27-.67.88-1.37 1.91-1.37 1.35 0 1.89 1.03 1.89 2.53V20h3.38l-.56-6.45z" />
            </svg>
        );
    if (name === "instagram")
        return (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <rect x="3.5" y="3.5" width="17" height="17" rx="4.8" />
                <circle cx="12" cy="12" r="3.9" />
                <circle cx="17.2" cy="6.8" r="0.7" fill="currentColor" stroke="none" />
            </svg>
        );
    return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
            <path d="M13.9 20.5v-7.6h2.55l.38-2.96H13.9V8.05c0-.86.24-1.44 1.47-1.44h1.57V3.96c-.27-.04-1.2-.12-2.29-.12-2.26 0-3.81 1.38-3.81 3.92v2.18H8.28v2.96h2.56v7.6h3.06z" />
        </svg>
    );
}

const label = "font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase";
const link = "text-white/75 transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

// Site-wide footer: a navy sheet on the paper background, rounded at the top
// and flush with the bottom of the page — brand, contact, the office map, then
// one line of links.
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <div className="bg-paper">
            <footer className="relative overflow-hidden rounded-t-panel bg-[linear-gradient(165deg,var(--navy)_0%,var(--ink)_75%)] text-white">
                <div aria-hidden className="pointer-events-none absolute -top-1/2 right-[-10%] h-full w-1/2 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--royal)_40%,transparent),transparent)]" />

                <div className="relative mx-auto max-w-[88rem] px-5 pt-12 pb-8 sm:px-8 lg:px-12 lg:pt-16">
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                        {/* Brand */}
                        <div className="lg:col-span-4">
                            <Link href="/" className="inline-flex items-center gap-3">
                                <Image src="/logo.svg" alt="" width={30} height={30} className="brightness-0 invert" />
                                <span className="font-display text-2xl tracking-tight">Greystone Hyde</span>
                            </Link>
                            <p className="mt-6 font-display text-[clamp(1.8rem,2.6vw,2.4rem)] leading-[1.05] tracking-[-0.01em]">
                                Clear numbers.
                                <br />
                                <em className="text-glint">Considered advice.</em>
                            </p>
                            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
                                London accounting and financial advisory that turns financial
                                complexity into clarity.
                            </p>
                            <ul className="mt-7 flex items-center gap-2">
                                {SOCIAL.map((s) => (
                                    <li key={s.label}>
                                        <a
                                            href={s.href}
                                            aria-label={`Greystone Hyde on ${s.label}`}
                                            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/75 transition-colors duration-300 hover:border-white hover:bg-white hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                                        >
                                            <SocialIcon name={s.icon} />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="lg:col-span-4">
                            <p className={label}>Get in touch</p>
                            <ul className="mt-5 space-y-3 text-[15px]">
                                <li>
                                    <a href={`mailto:${EMAIL}`} className={`${link} inline-block max-lg:py-1.5`}>
                                        {EMAIL}
                                    </a>
                                </li>
                                <li>
                                    <a href={PHONE.href} className={`${link} inline-block max-lg:py-1.5`}>
                                        {PHONE.label}
                                    </a>
                                </li>
                                <li className="text-white/75">
                                    <address className="not-italic">{ADDRESS}</address>
                                    <a
                                        href={DIRECTIONS}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-1.5 py-2.5 text-[13px] text-glint transition-colors hover:text-white"
                                    >
                                        Get directions
                                        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                                            ↗
                                        </span>
                                        <span className="sr-only">(opens Google Maps in a new tab)</span>
                                    </a>
                                </li>
                            </ul>
                            <p className={`mt-8 ${label}`}>Hours</p>
                            <p className="mt-2 text-sm text-white/70">Mon – Fri, 9:00 – 17:30</p>
                        </div>

                        {/* Office map in Google's default style. Its own place card is
                            cropped off the top; the attribution stays visible below */}
                        <div className="sm:col-span-2 lg:col-span-4">
                            <div className="relative h-60 overflow-hidden rounded-card border border-white/10 bg-white lg:h-full lg:min-h-64">
                                <OfficeMap src={MAP_SRC} title={`Map showing the Greystone Hyde office at ${ADDRESS}`} />
                            </div>
                        </div>
                    </div>

                    {/* One line: copyright, links, back to top */}
                    <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-[13px] lg:flex-row lg:items-center lg:justify-between">
                        <p className="text-white/45">© {year} Greystone Hyde Advisory</p>
                        <nav aria-label="Footer">
                            <ul className="flex flex-wrap gap-x-6 max-lg:-my-2">
                                {LINKS.map((l) => (
                                    <li key={l.label}>
                                        <Link href={l.href} className={`${link} inline-block py-2.5 lg:py-1`}>
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <a href="#" className="group -my-2.5 inline-flex items-center gap-1.5 self-start py-2.5 text-white/55 transition-colors hover:text-white lg:self-auto">
                            Back to top
                            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5">
                                ↑
                            </span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
