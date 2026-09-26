import CubeSection from "../components/CubeSection";

// Preview of the CSS 3D cube (no WebGL). Delete this route once decided.
export default function CubeCssPreview() {
  return (
    <main>
      <div className="grid h-[60vh] place-items-center text-center">
        <p className="font-display text-3xl text-foreground/80">
          CSS 3D cube preview
          <span className="mt-3 block font-mono text-xs tracking-[0.2em] text-muted uppercase">
            No WebGL · scroll down
          </span>
        </p>
      </div>
      <CubeSection forceCss />
    </main>
  );
}
