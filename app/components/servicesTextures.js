import * as THREE from "three";

// Canvas-drawn textures for the /services scene. Everything is painted at
// runtime (no image downloads) and repainted once the page's web fonts are
// ready, so the documents and card use the site's own typefaces.
//
// Draft copy and illustrative figures — replace with the firm's real wording.

const FG = "rgba(244, 243, 238, 0.92)";
const FG_SOFT = "rgba(244, 243, 238, 0.62)";
const MUTED = "rgba(154, 163, 173, 0.9)";
const BRAND = "#6ba0d6";
const GOLD = "#b99a5f";

function fonts() {
  const s = getComputedStyle(document.documentElement);
  const v = (name, fallback) => s.getPropertyValue(name).trim() || fallback;
  return {
    display: v("--font-display", "Georgia, serif"),
    sans: v("--font-geist-sans", "system-ui, sans-serif"),
    mono: v("--font-geist-mono", "ui-monospace, monospace"),
  };
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function tracked(ctx, px) {
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${px}px`;
}

function makeTexture(w, h, draw, maxAnisotropy = 4) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  const paint = () => {
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    draw(ctx, w, h, fonts());
    ctx.restore();
    tex.needsUpdate = true;
  };
  paint();
  document.fonts?.ready.then(paint);
  return { tex, paint };
}

function sheetBase(ctx, W, H) {
  rr(ctx, 3, 3, W - 6, H - 6, 18);
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "rgba(36, 55, 88, 0.97)");
  g.addColorStop(1, "rgba(17, 28, 47, 0.97)");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(107, 160, 214, 0.42)";
  ctx.stroke();
}

function tick(ctx, cx, cy, r, color) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.45, cy + r * 0.02);
  ctx.lineTo(cx - r * 0.1, cy + r * 0.38);
  ctx.lineTo(cx + r * 0.5, cy - r * 0.35);
  ctx.stroke();
}

const LEDGER_ROWS = [
  ["02 Jul", "Client receipt — Harlow", "", "3,420.00"],
  ["03 Jul", "Office rent", "1,800.00", ""],
  ["05 Jul", "Supplier inv. 118", "640.00", ""],
  ["08 Jul", "Client receipt — Ferris", "", "12,750.00"],
  ["11 Jul", "Payroll — July", "18,204.36", ""],
  ["14 Jul", "HMRC PAYE / NI", "6,118.20", ""],
  ["16 Jul", "Client receipt — Oakmere", "", "8,900.00"],
  ["19 Jul", "Software subscriptions", "412.80", ""],
  ["22 Jul", "Client receipt — Beaumont", "", "5,265.00"],
  ["25 Jul", "Insurance premium", "1,140.00", ""],
  ["29 Jul", "Bank interest", "", "86.14"],
  ["31 Jul", "Sales invoices batch", "", "2,210.00"],
];

export function makeLedgerTexture() {
  return makeTexture(512, 724, (ctx, W, H, f) => {
    sheetBase(ctx, W, H);
    const L = 34;
    const R = W - 34;

    ctx.font = `600 13px ${f.sans}`;
    tracked(ctx, 3);
    ctx.fillStyle = BRAND;
    ctx.fillText("GENERAL LEDGER", L, 56);
    ctx.textAlign = "right";
    ctx.fillStyle = MUTED;
    ctx.fillText("FY26 · Q3", R, 56);
    ctx.textAlign = "left";
    tracked(ctx, 0);

    ctx.font = `400 34px ${f.display}`;
    ctx.fillStyle = FG;
    ctx.fillText("Operating account", L, 102);

    let y = 146;
    ctx.font = `600 11px ${f.sans}`;
    tracked(ctx, 2);
    ctx.fillStyle = MUTED;
    ctx.fillText("DATE", L, y);
    ctx.fillText("DESCRIPTION", 104, y);
    ctx.textAlign = "right";
    ctx.fillText("DEBIT", 380, y);
    ctx.fillText("CREDIT", R, y);
    ctx.textAlign = "left";
    tracked(ctx, 0);
    ctx.fillStyle = "rgba(107, 160, 214, 0.3)";
    ctx.fillRect(L, y + 12, R - L, 1.5);

    const rowH = 38;
    y += 20;
    LEDGER_ROWS.forEach((row, i) => {
      const top = y + i * rowH;
      if (i === 3) {
        ctx.fillStyle = "rgba(49, 106, 162, 0.28)";
        rr(ctx, L - 8, top + 3, R - L + 16, rowH - 6, 6);
        ctx.fill();
      } else if (i % 2) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
        ctx.fillRect(L - 8, top + 3, R - L + 16, rowH - 6);
      }
      const base = top + rowH / 2 + 5;
      ctx.font = `400 13px ${f.mono}`;
      ctx.fillStyle = MUTED;
      ctx.fillText(row[0], L, base);
      ctx.font = `400 14px ${f.sans}`;
      ctx.fillStyle = FG_SOFT;
      ctx.fillText(row[1], 104, base);
      ctx.font = `400 13px ${f.mono}`;
      ctx.textAlign = "right";
      ctx.fillStyle = FG;
      if (row[2]) ctx.fillText(row[2], 380, base);
      if (row[3]) ctx.fillText(row[3], R, base);
      ctx.textAlign = "left";
    });

    y += LEDGER_ROWS.length * rowH + 22;
    ctx.fillStyle = "rgba(107, 160, 214, 0.3)";
    ctx.fillRect(L, y - 18, R - L, 1.5);
    ctx.font = `400 15px ${f.sans}`;
    ctx.fillStyle = FG_SOFT;
    ctx.fillText("Closing balance", L, y + 10);
    ctx.font = `600 17px ${f.mono}`;
    ctx.fillStyle = FG;
    ctx.textAlign = "right";
    ctx.fillText("£284,120.00", R, y + 10);
    ctx.textAlign = "left";
    // Accounting double underline under the final figure
    ctx.fillStyle = BRAND;
    ctx.fillRect(R - 120, y + 20, 120, 1.5);
    ctx.fillRect(R - 120, y + 25, 120, 1.5);

    ctx.font = `500 12px ${f.sans}`;
    ctx.fillStyle = BRAND;
    tick(ctx, L + 8, H - 42, 8, BRAND);
    ctx.fillText("Reconciled to bank feed", L + 26, H - 38);
  });
}

const VAT_ROWS = [
  ["1", "VAT due on sales", "18,240.00"],
  ["2", "VAT due on acquisitions", "0.00"],
  ["3", "Total VAT due", "18,240.00"],
  ["4", "VAT reclaimed", "6,905.00"],
  ["5", "Net VAT to pay", "11,335.00"],
  ["6", "Total sales ex. VAT", "91,200.00"],
  ["7", "Total purchases ex. VAT", "34,525.00"],
  ["8", "Goods supplied (NI)", "0.00"],
  ["9", "Goods acquired (NI)", "0.00"],
];

export function makeTaxTexture() {
  return makeTexture(512, 724, (ctx, W, H, f) => {
    sheetBase(ctx, W, H);
    const L = 34;
    const R = W - 34;

    ctx.font = `600 13px ${f.sans}`;
    tracked(ctx, 3);
    ctx.fillStyle = BRAND;
    ctx.fillText("VAT RETURN", L, 56);
    ctx.textAlign = "right";
    ctx.fillStyle = MUTED;
    ctx.fillText("07/26 – 09/26", R, 56);
    ctx.textAlign = "left";
    tracked(ctx, 0);

    ctx.font = `400 34px ${f.display}`;
    ctx.fillStyle = FG;
    ctx.fillText("Quarterly submission", L, 102);

    const rowH = 50;
    const y0 = 134;
    VAT_ROWS.forEach((row, i) => {
      const top = y0 + i * rowH;
      if (i === 4) {
        ctx.fillStyle = "rgba(49, 106, 162, 0.28)";
        rr(ctx, L - 8, top + 4, R - L + 16, rowH - 8, 6);
        ctx.fill();
      }
      ctx.fillStyle = "rgba(107, 160, 214, 0.16)";
      ctx.fillRect(L, top + rowH - 1, R - L, 1);

      const base = top + rowH / 2 + 5;
      rr(ctx, L, top + 13, 24, 24, 5);
      ctx.strokeStyle = "rgba(107, 160, 214, 0.55)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.font = `600 12px ${f.mono}`;
      ctx.fillStyle = BRAND;
      ctx.textAlign = "center";
      ctx.fillText(row[0], L + 12, base);
      ctx.textAlign = "left";

      ctx.font = `400 14px ${f.sans}`;
      ctx.fillStyle = FG_SOFT;
      ctx.fillText(row[1], L + 38, base);
      ctx.font = `400 14px ${f.mono}`;
      ctx.fillStyle = FG;
      ctx.textAlign = "right";
      ctx.fillText(`£${row[2]}`, R - 30, base);
      ctx.textAlign = "left";
      tick(ctx, R - 9, base - 5, 8, i === 4 ? GOLD : "rgba(107, 160, 214, 0.8)");
    });

    const py = H - 90;
    rr(ctx, L, py, 196, 38, 19);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.font = `600 12px ${f.sans}`;
    tracked(ctx, 2.5);
    ctx.fillStyle = GOLD;
    ctx.fillText("✓  SUBMITTED · MTD", L + 20, py + 24);
    tracked(ctx, 0);
    ctx.font = `400 12px ${f.mono}`;
    ctx.fillStyle = MUTED;
    ctx.textAlign = "right";
    ctx.fillText("Filed 28 Oct 2026", R, py + 24);
    ctx.textAlign = "left";
  });
}

function drawGuilloche(ctx, W, H, color, lines, amp, y0) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.1;
  for (let k = 0; k < lines; k++) {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 8) {
      const y = y0 + Math.sin(x * 0.009 + k * 0.33) * amp + Math.sin(x * 0.021 - k * 0.5) * amp * 0.35 + k * 3;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

let logoImage;
function getLogo(onLoad) {
  if (!logoImage) {
    logoImage = new Image();
    logoImage.decoding = "async";
    logoImage.src = "/logo.svg";
  }
  if (!logoImage.complete) logoImage.addEventListener("load", onLoad, { once: true });
  return logoImage;
}

// 1024×646 ≈ the ID-1 card ratio (85.6 × 54mm)
export function makeCardFaceTexture(maxAnisotropy) {
  const result = makeTexture(
    1024,
    646,
    (ctx, W, H, f) => {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#0c1629");
      g.addColorStop(0.55, "#1b305c");
      g.addColorStop(1, "#2c5d93");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const glow = ctx.createRadialGradient(W * 0.18, H * 0.05, 0, W * 0.18, H * 0.05, W * 0.8);
      glow.addColorStop(0, "rgba(255,255,255,0.12)");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      drawGuilloche(ctx, W, H, "rgba(150, 190, 232, 0.07)", 22, 46, H * 0.5);

      // Logo on a white plate, as in the site header
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(104, 96, 38, 0, Math.PI * 2);
      ctx.fill();
      // Deferred: `result` doesn't exist yet during the first synchronous paint
      const logo = getLogo(() => result.paint());
      if (logo.complete && logo.naturalWidth !== 0) ctx.drawImage(logo, 80, 72, 48, 48);

      ctx.font = `400 46px ${f.display}`;
      ctx.fillStyle = "#f4f3ee";
      ctx.fillText("Greystone Hyde", 162, 100);
      ctx.font = `600 14px ${f.sans}`;
      tracked(ctx, 5);
      ctx.fillStyle = "rgba(244, 243, 238, 0.6)";
      ctx.fillText("ADVISORY", 164, 128);
      tracked(ctx, 0);

      // Contactless mark
      ctx.strokeStyle = "rgba(244, 243, 238, 0.75)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(890, 96, 12 + i * 12, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
      }

      ctx.font = `500 44px ${f.mono}`;
      tracked(ctx, 6);
      ctx.fillStyle = "#f4f3ee";
      ctx.fillText("••••  ••••  ••••  0427", 70, 440);
      tracked(ctx, 0);

      ctx.font = `600 13px ${f.sans}`;
      tracked(ctx, 3);
      ctx.fillStyle = "rgba(244, 243, 238, 0.55)";
      ctx.fillText("ACCOUNT", 70, 526);
      ctx.fillText("VALID THRU", 520, 526);
      tracked(ctx, 1.5);
      ctx.font = `500 24px ${f.sans}`;
      ctx.fillStyle = "#f4f3ee";
      ctx.fillText("CLIENT PAYMENTS", 70, 562);
      ctx.font = `500 24px ${f.mono}`;
      ctx.fillText("09/30", 520, 562);
      tracked(ctx, 0);

      ctx.font = `italic 400 48px ${f.display}`;
      ctx.fillStyle = GOLD;
      ctx.textAlign = "right";
      ctx.fillText("Debit", W - 70, 566);
      ctx.textAlign = "left";
    },
    maxAnisotropy,
  );
  return result;
}

export function makeCardBackTexture(maxAnisotropy) {
  return makeTexture(
    1024,
    646,
    (ctx, W, H, f) => {
      const g = ctx.createLinearGradient(W, 0, 0, H);
      g.addColorStop(0, "#0c1629");
      g.addColorStop(1, "#203a68");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      drawGuilloche(ctx, W, H, "rgba(150, 190, 232, 0.05)", 16, 30, H * 0.72);

      ctx.fillStyle = "#070b14";
      ctx.fillRect(0, 70, W, 104);

      rr(ctx, 70, 232, 600, 70, 8);
      ctx.fillStyle = "rgba(244, 243, 238, 0.88)";
      ctx.fill();
      ctx.strokeStyle = "rgba(49, 106, 162, 0.25)";
      ctx.lineWidth = 2;
      for (let x = 80; x < 660; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, 236);
        ctx.lineTo(x + 30, 298);
        ctx.stroke();
      }
      ctx.font = `italic 500 26px ${f.mono}`;
      ctx.fillStyle = "#16233a";
      ctx.fillText("•••", 700, 278);

      ctx.font = `400 19px ${f.sans}`;
      ctx.fillStyle = "rgba(244, 243, 238, 0.7)";
      ctx.fillText("Client payments are processed on a secure, hosted checkout.", 70, 400);
      ctx.fillText("Card details are never stored by Greystone Hyde Advisory.", 70, 432);

      ctx.font = `400 40px ${f.display}`;
      ctx.fillStyle = "rgba(244, 243, 238, 0.9)";
      ctx.fillText("Greystone Hyde", 70, 560);
      ctx.font = `600 13px ${f.sans}`;
      tracked(ctx, 4);
      ctx.fillStyle = "rgba(244, 243, 238, 0.5)";
      ctx.textAlign = "right";
      ctx.fillText("LONDON", W - 70, 556);
      ctx.textAlign = "left";
      tracked(ctx, 0);
    },
    maxAnisotropy,
  );
}
