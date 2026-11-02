// next/image's loader for the static export. Photographs in public/images
// are resized ahead of the build (scripts/resize-images.mjs) into
// public/images/sized/<name>-<width>.webp; this names the file for each width
// next/image asks for. SVGs are served as they are.
export default function imageLoader({ src, width }) {
  if (!/\.(webp|jpe?g|png)$/i.test(src)) return src;

  const file = src.split("/").pop();
  // A static import is served from /_next/static/media/<name>.<hash>.<ext>
  const name = src.startsWith("/_next/static/media/") ? file.split(".")[0] : file.replace(/\.[^.]+$/, "");

  // Encoded: a space in a file name would otherwise split the srcset entry
  return encodeURI(`/images/sized/${name}-${width}.webp`);
}
