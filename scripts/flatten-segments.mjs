// Runs after every build (the "postbuild" script). The static export writes
// each page's prefetch data as out/<page>/__next.<segment>/__PAGE__.txt, but
// the client asks for out/<page>/__next.<segment>.__PAGE__.txt, so on a plain
// file server every link prefetch 404s and navigation falls back to loading
// the whole page. This copies each file to the name the client requests.
import { copyFile, readdir } from "node:fs/promises";
import path from "node:path";

const OUT = "out";

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* files(p);
    else yield p;
  }
}

let copied = 0;
for await (const file of files(OUT)) {
  const parts = file.split(path.sep);
  const at = parts.findIndex((p) => p.startsWith("__next.") && p !== parts.at(-1));
  if (at === -1) continue;
  // out/a/__next.a/b/__PAGE__.txt -> out/a/__next.a.b.__PAGE__.txt
  const flat = parts.slice(at).join(".");
  await copyFile(file, path.join(...parts.slice(0, at), flat));
  copied++;
}

console.log(`flatten-segments: ${copied} prefetch files copied`);
