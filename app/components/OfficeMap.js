"use client";

import { useRef } from "react";
import { useOnScreen } from "../lib/useOnScreen";

// The office map, in Google's default style. The embed is a heavy third
// party (well over a megabyte of script that runs on the main thread), and
// the footer is on every page, so it is only requested once the footer is
// about to come into view; until then the frame holds its place with a
// quiet placeholder. Its own place card is cropped off the top; the
// attribution stays visible below.
export default function OfficeMap({ src, title }) {
  const frame = useRef(null);
  const near = useOnScreen(frame, { rootMargin: "300px", once: true });

  return (
    <div ref={frame} className="absolute inset-0 bg-[linear-gradient(160deg,var(--mist),var(--sky))]">
      {near ? (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-x-0 bottom-0 h-[calc(100%+5rem)] w-full border-0"
        />
      ) : (
        <span aria-hidden className="absolute inset-0 grid place-items-center font-mono text-[10px] tracking-[0.2em] text-navy/45 uppercase">
          Loading map
        </span>
      )}
    </div>
  );
}
