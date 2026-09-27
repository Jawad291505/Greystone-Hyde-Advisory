// Canvas-drawn bump maps for the WebGL coin (see GbpCoinsGL). Real coins
// aren't "printed" — the design is relief cut into solid metal — so instead
// of a color texture we draw a greyscale height map (lighter = raised) and
// feed it to MeshStandardMaterial as a bumpMap. Colour and reflections come
// from the material + environment map, not from this canvas.
//
// No royal crest/crown/heraldic beasts here on purpose: those are Royal
// Mint copyrighted coin designs, and the brief itself rules out crowns and
// generic British imagery. The £ mark plus abstract engraving carries the
// London-financial identity instead.

function drawArcText(ctx, text, cx, cy, radius, startAngleDeg, letterSpacingDeg) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((startAngleDeg * Math.PI) / 180);
  for (const ch of text) {
    ctx.save();
    ctx.translate(0, -radius);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    ctx.rotate((letterSpacingDeg * Math.PI) / 180);
  }
  ctx.restore();
}

function drawFaceBump(ctx, size, plain) {
  const c = size / 2;
  ctx.fillStyle = "#7a7a7a"; // neutral mid-height base
  ctx.fillRect(0, 0, size, size);

  const R = (r) => (r / 100) * c;

  // stepped collar: raised outer edge, recessed step, raised face
  ctx.fillStyle = "#c8c8c8";
  ctx.beginPath();
  ctx.arc(c, c, R(98), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#555";
  ctx.beginPath();
  ctx.arc(c, c, R(90), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8c8c8c";
  ctx.beginPath();
  ctx.arc(c, c, R(85), 0, Math.PI * 2);
  ctx.fill();

  // reeded ticks on the flat step so it still reads under steep light
  ctx.strokeStyle = "#3a3a3a";
  ctx.lineWidth = Math.max(1, size * 0.003);
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(c + Math.cos(a) * R(92), c + Math.sin(a) * R(92));
    ctx.lineTo(c + Math.cos(a) * R(97), c + Math.sin(a) * R(97));
    ctx.stroke();
  }

  // beaded rim — the main "genuinely minted" cue
  ctx.fillStyle = "#e6e6e6";
  for (let i = 0; i < 56; i++) {
    const a = (i / 56) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(c + Math.cos(a) * R(80), c + Math.sin(a) * R(80), Math.max(1, size * 0.006), 0, Math.PI * 2);
    ctx.fill();
  }

  // inner raised ring around the motif
  ctx.strokeStyle = "#bdbdbd";
  ctx.lineWidth = Math.max(1, size * 0.006);
  ctx.beginPath();
  ctx.arc(c, c, R(65), 0, Math.PI * 2);
  ctx.stroke();

  // fine engine-turned radiating linework, faint
  ctx.strokeStyle = "#6f6f6f";
  ctx.lineWidth = Math.max(0.6, size * 0.0018);
  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2;
    const r2 = i % 2 === 0 ? R(63) : R(57);
    ctx.beginPath();
    ctx.moveTo(c + Math.cos(a) * R(40), c + Math.sin(a) * R(40));
    ctx.lineTo(c + Math.cos(a) * r2, c + Math.sin(a) * r2);
    ctx.stroke();
  }

  if (plain) {
    ctx.strokeStyle = "#a9a9a9";
    ctx.lineWidth = Math.max(1, size * 0.004);
    ctx.beginPath();
    ctx.arc(c, c, R(30), 0, Math.PI * 2);
    ctx.stroke();
    return;
  }

  // the £ mark, raised
  ctx.fillStyle = "#f0f0f0";
  ctx.font = `700 ${size * 0.42}px Georgia, 'Times New Roman', serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("£", c, c + size * 0.01);

  // arced micro-band — an original label, not real currency text
  ctx.fillStyle = "#d8d8d8";
  ctx.font = `600 ${size * 0.032}px Geist, ui-sans-serif, system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  drawArcText(ctx, "STERLING · VALUE", c, c, R(50), -100, 12.2);
}

function makeTexture(size, plain) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  drawFaceBump(ctx, size, plain);
  return canvas;
}

function makeEdgeTexture() {
  const w = 256;
  const h = 32;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, w, h);
  const stripes = 48;
  const step = w / stripes;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#b0b0b0" : "#555";
    ctx.fillRect(i * step, 0, step, h);
  }
  return canvas;
}

// Lazily built + memoised on first WebGL mount; canvas APIs are client-only.
let faceCache = null;
let plainCache = null;
let edgeCache = null;

export function getFaceCanvas() {
  if (!faceCache) faceCache = makeTexture(512, false);
  return faceCache;
}

export function getPlainCanvas() {
  if (!plainCache) plainCache = makeTexture(512, true);
  return plainCache;
}

export function getEdgeCanvas() {
  if (!edgeCache) edgeCache = makeEdgeTexture();
  return edgeCache;
}
