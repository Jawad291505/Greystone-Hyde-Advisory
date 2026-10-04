"use client";

import Link from "next/link";
import { useThemeHref } from "../lib/themeBase";

// next/link, with internal hrefs kept inside the active theme preview.
export default function ThemeLink({ href, ...rest }) {
  const themed = useThemeHref();
  return <Link href={themed(href)} {...rest} />;
}
