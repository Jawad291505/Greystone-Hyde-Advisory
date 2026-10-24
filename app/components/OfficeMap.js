"use client";

import { useRef } from "react";
import { useOnScreen } from "../lib/useOnScreen";
import { setConsent, useConsent } from "../lib/consent";

// The office map, in Google's default style. Google sets its own cookies
// when the embed loads, so it is only requested once the visitor has
// accepted optional cookies; until then the frame offers to load it. The
// embed is also a heavy third party (well over a megabyte of script that runs
// on the main thread), and the footer is on every page, so even with consent
// it waits until the footer is about to come into view. Its own place card
// is cropped off the top; the attribution stays visible below.
export default function OfficeMap({ src, title }) {
  const frame = useRef(null);
  const near = useOnScreen(frame, { rootMargin: "300px", once: true });
  const consent = useConsent();

  return (
    <div ref={frame} className="absolute inset-0 bg-[linear-gradient(160deg,var(--mist),var(--sky))]">
      {consent === "accepted" && near ? (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-x-0 bottom-0 h-[calc(100%+5rem)] w-full border-0"
        />
      ) : consent === undefined || consent === "accepted" ? (
        <span aria-hidden className="absolute inset-0 grid place-items-center font-mono text-[10px] tracking-[0.2em] text-navy/45 uppercase">
          Loading map
        </span>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-navy">
          <p className="max-w-[16rem] text-[13px] leading-relaxed text-navy/75">
            The map is provided by Google Maps, which sets its own cookies when it loads.
          </p>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="inline-flex min-h-11 items-center rounded-full border border-navy/20 px-5 text-[13px] font-medium transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
          >
            Accept cookies and load map
          </button>
        </div>
      )}
    </div>
  );
}
