import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Particles from "./components/Particles";
import SmoothScroll from "./components/SmoothScroll";

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

export const metadata = {
  title: "Greystone Hyde Advisory | London Accounting & Financial Advisory",
  description:
    "London accounting and financial advisory that turns financial complexity into clarity.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        <Particles />
        {children}
      </body>
    </html>
  );
}
