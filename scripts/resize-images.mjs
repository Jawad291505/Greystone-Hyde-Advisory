// Runs before every build (the "prebuild" script). Writes each photograph in
// public/images at every width next/image can ask for, as WebP, into
// public/images/sized/ — the files app/lib/imageLoader.js points at. A width
// past the original keeps the original size. Up-to-date files are skipped.
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import nextConfig from "../next.config.mjs";

const SRC = "public/images";
const OUT = path.join(SRC, "sized");
const { deviceSizes, imageSizes } = nextConfig.images;
const WIDTHS = [...new Set([...imageSizes, ...deviceSizes])];

// The hero is the page's centrepiece; a higher quality keeps the re-encode
// from softening it
const QUALITY = { hero: 85 };

async function mtime(file) {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0;
  }
}

await mkdir(OUT, { recursive: true });

let written = 0;
for (const file of await readdir(SRC)) {
  if (!/\.(webp|jpe?g|png)$/i.test(file)) continue;
  const src = path.join(SRC, file);
  const name = file.replace(/\.[^.]+$/, "");
  const srcTime = await mtime(src);

  for (const width of WIDTHS) {
    const out = path.join(OUT, `${name}-${width}.webp`);
    if ((await mtime(out)) > srcTime) continue;
    await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY[name] ?? 75 })
      .toFile(out);
    written++;
  }
}

console.log(`resize-images: ${written} written, ${WIDTHS.length} widths per photograph`);
