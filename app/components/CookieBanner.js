"use client";

import { useEffect, useRef, useState } from "react";
import Link from "./ThemeLink";
import { setConsent, useConsent, useCookieSettingsOpen } from "../lib/consent";
import { useIntroReady } from "../lib/intro";

const button =
  "inline-flex h-9 items-center justify-center rounded-full px-4 text-[13px] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal";

// A compact floating bar at the bottom right asking first-time visitors
// whether optional cookies may be set: one line, with the detail behind
// "Read more". Accept and reject carry equal weight, and nothing optional
// loads until "accept". It waits for the preloader's curtain to lift, and
// comes back whenever "Cookie settings" is chosen.
export default function CookieBanner() {
  const consent = useConsent();
  const settings = useCookieSettingsOpen();
  const ready = useIntroReady();
  const card = useRef(null);
  const [more, setMore] = useState(false);

  // `undefined` until the saved choice has been read on the client
  const show = ready && (consent === null || settings);

  // Opened from "Cookie settings": move focus in so keyboard users land on it
  useEffect(() => {
    if (show && settings) card.current?.focus();
  }, [show, settings]);

  if (!show) return null;

  return (
    <section
      ref={card}
      tabIndex={-1}
      aria-label="Cookie consent"
      className="cookie-banner fixed right-3 bottom-3 left-3 z-[60] max-w-[34rem] rounded-2xl border border-navy/10 bg-paper px-4 py-3 text-ink shadow-[0_18px_44px_-20px_rgba(11,26,56,0.45)] outline-none sm:right-5 sm:bottom-5 sm:left-auto"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
        <p className="min-w-0 flex-1 basis-56 text-[13px] leading-snug text-navy/80">
          We use optional cookies only with your consent.{" "}
          <button
            type="button"
            aria-expanded={more}
            aria-controls="cookie-more"
            onClick={() => setMore((m) => !m)}
            className="cursor-pointer whitespace-nowrap text-royal underline decoration-royal/30 underline-offset-4 hover:decoration-royal"
          >
            {more ? "Show less" : "Read more"}
          </button>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent("rejected")}
            className={`${button} border border-navy/20 text-navy hover:border-navy hover:bg-navy hover:text-white`}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className={`${button} border border-royal bg-royal text-white hover:border-navy hover:bg-navy`}
          >
            Accept
          </button>
        </div>
      </div>

      {more && (
        <div id="cookie-more" className="mt-3 border-t border-navy/10 pt-3 text-[13px] leading-relaxed text-navy/75">
          <p>
            We use essential storage to keep the site working. With your consent, we&apos;ll also load
            the Google Map in our footer, which lets Google set its own cookies. You can change your
            choice at any time.{" "}
            <Link href="/privacy#cookies" className="text-royal underline decoration-royal/30 underline-offset-4 hover:decoration-royal">
              Cookie policy
            </Link>
          </p>
          {settings && consent && (
            <p className="mt-2 text-navy/60">Currently: optional cookies {consent}.</p>
          )}
        </div>
      )}
    </section>
  );
}
