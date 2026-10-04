"use client";

import { usePathname } from "next/navigation";

// Theme previews (currently /beigetheme) mirror the whole site under a path
// prefix. Internal links are written once, for the live site ("/services",
// "/#contact"); under a preview they are re-based so navigation stays inside
// it. On the live site this is a no-op.
const PREVIEW_BASES = ["/beigetheme"];

export function useThemeHref() {
  const pathname = usePathname() ?? "";
  const base = PREVIEW_BASES.find((b) => pathname === b || pathname.startsWith(`${b}/`)) ?? "";

  return (href) => {
    if (!base || typeof href !== "string" || !href.startsWith("/") || href.startsWith("//")) return href;
    // "/" → base, "/#contact" → base#contact, "/services#x" → base/services#x
    return base + href.replace(/^\/(?=$|[#?])/, "");
  };
}
