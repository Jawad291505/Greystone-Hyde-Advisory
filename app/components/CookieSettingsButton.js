"use client";

import { openCookieSettings } from "../lib/consent";

// Re-opens the cookie banner, so a choice can be changed at any time
export default function CookieSettingsButton({ className, children = "Cookie settings" }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {children}
    </button>
  );
}
