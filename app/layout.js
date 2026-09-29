import { Geist, Geist_Mono, Instrument_Serif, Newsreader } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Header from "./components/Header";
import Preloader from "./components/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${editorial.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <noscript>
          <style>{`#preloader{display:none}`}</style>
        </noscript>
        <Preloader />
        <SmoothScroll />
        <Header />
        {children}
      </body>
    </html>
  );
}
