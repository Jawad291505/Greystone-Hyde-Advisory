// Colours for the /services WebGL scene and its canvas-painted textures.
// WebGL can't read CSS custom properties, so each site theme has a matching
// palette here; `scenePalette()` picks the one for the theme on the page.

const NAVY = {
  // Text accents painted on the dark sheets; `brandRgb`/`deepRgb` are the same
  // hues as "r, g, b" for rules and highlight bands at varying alpha
  brand: "#6ba0d6",
  brandRgb: "107, 160, 214",
  deepRgb: "49, 106, 162",
  muted: "rgba(154, 163, 173, 0.9)",
  gold: "#b99a5f",
  sheet: ["#1f3f72", "#0c1a36"],
  cardFace: ["#0c1629", "#1b305c", "#2c5d93"],
  cardBack: ["#0c1629", "#203a68"],
  guillocheRgb: "150, 190, 232",
  magstripe: "#070b14",
  cvv: "#16233a",
  logoFilter: "none",
  // Scene objects
  field: "#316aa2",
  fieldGold: "#a8843f",
  seal: "#1b3157",
  grid: "#6ba0d6",
  bar: "#316aa2",
  forecast: "#6ba0d6",
  cardEdge: "#9fb6d3",
  rim: "#8fb6e0",
};

const CHARCOAL = {
  brand: "#dcc7a3",
  brandRgb: "220, 199, 163",
  deepRgb: "150, 150, 154",
  muted: "rgba(176, 170, 160, 0.9)",
  gold: "#c9a868",
  sheet: ["#3b3b3f", "#161618"],
  cardFace: ["#131315", "#2b2b2e", "#5a544b"],
  cardBack: ["#131315", "#36363a"],
  guillocheRgb: "226, 212, 188",
  magstripe: "#09090a",
  cvv: "#232326",
  logoFilter: "grayscale(1) brightness(0.62) contrast(1.15)",
  field: "#4a4a4e",
  fieldGold: "#a8843f",
  seal: "#2b2b2e",
  grid: "#8a8378",
  bar: "#3a3a3e",
  forecast: "#9a9184",
  cardEdge: "#bdb5a8",
  rim: "#e3d3b4",
};

export function scenePalette() {
  return typeof document !== "undefined" && document.querySelector(".theme-beige") ? CHARCOAL : NAVY;
}
