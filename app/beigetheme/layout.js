// Client-preview route: the whole site re-skinned in beige and charcoal.
// Every page under /beigetheme renders the same page component as the live
// site; the `.theme-beige` wrapper switches the colour tokens (see
// `body:has(.theme-beige)` in globals.css), and internal links are re-based
// to stay inside the preview (see lib/themeBase.js). Not linked from the
// live site and kept out of search indexes.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function BeigeThemeLayout({ children }) {
  return <div className="theme-beige flex flex-1 flex-col">{children}</div>;
}
