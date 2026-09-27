// Flat SVG coin face rendered inside a CSS 3D transform (see GbpCoins).
// Detail is original/abstract on purpose — no royal crest, crown or
// heraldic beasts: those are Royal Mint copyrighted coin designs, and the
// brief explicitly rules out crowns/flags/generic British imagery. Realism
// instead comes from engraving craft: a beaded rim, engine-turned guilloché
// rings, fine radiating linework and a stepped bevelled collar.
//
// All trig is pre-rounded to a fixed string precision — raw Math.cos/sin
// can differ by a float ULP between Node (SSR) and the browser, which
// otherwise trips a hydration mismatch on first paint.
const round = (n) => n.toFixed(2);

const BEADS = Array.from({ length: 56 }, (_, i) => {
  const a = (i / 56) * Math.PI * 2;
  return [round(100 + Math.cos(a) * 95), round(100 + Math.sin(a) * 95)];
});

const EDGE_TICKS = Array.from({ length: 64 }, (_, i) => {
  const a = (i / 64) * Math.PI * 2;
  return [
    round(100 + Math.cos(a) * 92),
    round(100 + Math.sin(a) * 92),
    round(100 + Math.cos(a) * 98),
    round(100 + Math.sin(a) * 98),
  ];
});

const RAYS = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2;
  const r1 = 40;
  const r2 = i % 2 === 0 ? 76 : 68;
  return {
    x1: round(100 + Math.cos(a) * r1),
    y1: round(100 + Math.sin(a) * r1),
    x2: round(100 + Math.cos(a) * r2),
    y2: round(100 + Math.sin(a) * r2),
    dim: i % 3 === 0,
  };
});

export default function CoinFace({ id, plain = false }) {
  const g = `coin-${id}`;
  const arcId = `${g}-arc`;
  return (
    <svg viewBox="0 0 200 200" className="block h-full w-full">
      <defs>
        <radialGradient id={`${g}-body`} cx="36%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#e9c979" />
          <stop offset="28%" stopColor="#c69a49" />
          <stop offset="58%" stopColor="#8c6829" />
          <stop offset="84%" stopColor="#5a3f16" />
          <stop offset="100%" stopColor="#38270e" />
        </radialGradient>
        <linearGradient id={`${g}-rimOuter`} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
          <stop offset="0%" stopColor="#fdeeb6" />
          <stop offset="35%" stopColor="#a67c30" />
          <stop offset="70%" stopColor="#563c15" />
          <stop offset="100%" stopColor="#201607" />
        </linearGradient>
        <linearGradient id={`${g}-rimInner`} x1="0.85" y1="0.9" x2="0.15" y2="0.1">
          <stop offset="0%" stopColor="#201607" />
          <stop offset="45%" stopColor="#8c6829" />
          <stop offset="100%" stopColor="#fdeeb6" />
        </linearGradient>
        <filter id={`${g}-soft`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.6" />
        </filter>
        <filter id={`${g}-blur2`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <path id={arcId} d="M 34,138 A 66,66 0 0 1 166,138" />
      </defs>

      {/* outer collar: bevelled, diagonally lit so it reads as a rounded edge */}
      <circle cx="100" cy="100" r="98" fill={`url(#${g}-rimOuter)`} />
      <circle cx="100" cy="100" r="92" fill={`url(#${g}-rimInner)`} />

      {/* reeded edge ticks, tight and dark for real contrast */}
      <g stroke="rgba(0,0,0,0.5)" strokeWidth="1">
        {EDGE_TICKS.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>

      {/* recessed main face, stepped down from the collar via a hard dark/light pair */}
      <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="2" />
      <circle cx="100" cy="100" r="83.5" fill="none" stroke="rgba(255,241,199,0.35)" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="82" fill={`url(#${g}-body)`} />

      {/* beaded rim, engraved just inside the collar step — the main "this
          is a real minted coin, not a sticker" cue */}
      {BEADS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.5" fill="rgba(255,241,199,0.85)" stroke="rgba(0,0,0,0.4)" strokeWidth="0.4" />
      ))}

      {/* inner raised ring around the motif */}
      <circle cx="100" cy="100" r="66" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="64.5" fill="none" stroke="rgba(255,241,199,0.28)" strokeWidth="1" />

      {plain ? (
        <>
          <g stroke="rgba(0,0,0,0.22)" strokeWidth="0.6">
            {RAYS.map((r, i) => (
              <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} opacity={r.dim ? 0.35 : 0.7} />
            ))}
          </g>
          <circle cx="100" cy="100" r="38" fill="none" stroke="rgba(0,0,0,0.38)" strokeWidth="1" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(255,241,199,0.3)" strokeWidth="1" />
        </>
      ) : (
        <>
          {/* fine engine-turned linework behind the mark, engraved not printed */}
          <g stroke="rgba(0,0,0,0.16)" strokeWidth="0.6">
            {RAYS.map((r, i) => (
              <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} opacity={r.dim ? 0.3 : 0.6} />
            ))}
          </g>

          <text x="103" y="133" textAnchor="middle" fontSize="80" fontWeight="700" fontFamily="Georgia, 'Times New Roman', serif" fill="rgba(0,0,0,0.7)" filter={`url(#${g}-blur2)`}>
            £
          </text>
          <text x="99" y="126" textAnchor="middle" fontSize="80" fontWeight="700" fontFamily="Georgia, 'Times New Roman', serif" fill="#3a2a10" opacity="0.5">
            £
          </text>
          <text x="100" y="128" textAnchor="middle" fontSize="80" fontWeight="700" fontFamily="Georgia, 'Times New Roman', serif" fill="#fff3cf">
            £
          </text>

          {/* arced micro-text, mirrors a minted denomination band without
              claiming to be real currency */}
          <text fontSize="9" fontWeight="600" letterSpacing="3.2" fill="rgba(20,14,5,0.65)">
            <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
              STERLING · VALUE
            </textPath>
          </text>
        </>
      )}

      {/* tight, blurred specular hit rather than a broad plastic sheen */}
      <ellipse cx="64" cy="56" rx="26" ry="16" fill="#fff8e2" opacity="0.65" filter={`url(#${g}-soft)`} />
      <ellipse cx="128" cy="148" rx="34" ry="20" fill="#000000" opacity="0.28" filter={`url(#${g}-soft)`} />
    </svg>
  );
}
