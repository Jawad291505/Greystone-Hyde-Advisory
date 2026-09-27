"use client";

import { useEffect } from "react";

// Header now lives in the root layout (outside this route's `.theme-light`
// wrapper div), so it only picks up the light-theme color tokens if `body`
// itself carries the class too — CSS custom properties cascade down the
// DOM tree, and Header is a sibling of this page's content under `body`.
export default function LightThemeBody() {
  useEffect(() => {
    document.body.classList.add("theme-light");
    return () => document.body.classList.remove("theme-light");
  }, []);

  return null;
}
