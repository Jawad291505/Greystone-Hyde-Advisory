import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import Entrances from "./components/Entrances";
import CookieBanner from "./components/CookieBanner";
import MotionFeatures from "./components/MotionFeatures";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Small labels and captions, but the preloader sets its captions and count in
// it from the first frame: preloaded, so they don't swap face mid-animation.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

// Editorial display face for the hero: Newsreader's high-contrast display
// cut. Every use sets 'opsz' 72 at weight 350–400, so these files are
// Google's latin Newsreader with the optical size pinned at 72 and weight
// cut to that range: the same letterforms at about a quarter of the bytes,
// which on a phone frees the connection for the hero photograph.
const editorial = localFont({
  variable: "--font-editorial",
  src: [
    { path: "./fonts/newsreader-roman.woff2", weight: "350 400", style: "normal" },
    { path: "./fonts/newsreader-italic.woff2", weight: "350 400", style: "italic" },
  ],
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const metadata = {
  title: "Greystone Hyde | Bookkeeping & Accounting Services in London",
  description:
    "Bookkeeping and accounting for UK businesses: year-end accounts, tax and VAT, payroll, management reporting and advisory from one dedicated London team.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fdfdfe",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // In-page links scroll smoothly (globals.css); route changes stay instant
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${editorial.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Without scripts nothing marks entrances as seen: show everything */}
        <noscript>
          <style>{`[data-rise]{opacity:1!important}`}</style>
        </noscript>
        <Preloader />
        <SmoothScroll />
        <Entrances />
        <Header />
        <MotionFeatures>{children}</MotionFeatures>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
