import { Geist, Geist_Mono, Instrument_Serif, Newsreader } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import Entrances from "./components/Entrances";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Small labels and captions only, none of them in the first paint's critical
// path: fetched when first used rather than preloaded ahead of the hero.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

// Editorial display face for the hero: variable weight plus the optical-size
// axis, so the headline is drawn from the high-contrast display cut.
const editorial = Newsreader({
  variable: "--font-editorial",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

export const metadata = {
  title: "Greystone Hyde Advisory | London Accounting & Financial Advisory",
  description:
    "London accounting and financial advisory that turns financial complexity into clarity.",
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
        {children}
        <Footer />
      </body>
    </html>
  );
}
