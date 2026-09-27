// Shared feature check used by every WebGL section's "smart" wrapper, so a
// browser without WebGL (or with it disabled) always gets the same,
// single source of truth for falling back to a non-WebGL experience.
export function hasWebGL() {
  try {
    if (typeof window === "undefined") return false;
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")));
  } catch {
    return false;
  }
}
