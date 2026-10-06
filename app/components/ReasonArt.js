"use client";

import { createContext, useContext } from "react";
import { motion, useReducedMotion } from "framer-motion";

// One small animated diagram per reason, drawn for a dark panel on a
// 320 × 180 grid with a single stroke weight so the six read as a set. Each
// draws itself in when it mounts; the parent remounts it (by key) whenever
// the reason in focus changes, so the drawing replays.

const ease = [0.22, 1, 0.36, 1];
const GLINT = "var(--glint)";
const LINE = "rgba(255,255,255,0.8)";
const FAINT = "rgba(255,255,255,0.22)";
const LABEL = "rgba(255,255,255,0.62)";

const draw = (delay = 0, duration = 1) => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration, ease, delay }, opacity: { duration: 0.2, delay } },
  },
});
const pop = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease, delay } },
});
const fade = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, delay } },
});
const grow = (delay = 0) => ({
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.7, ease, delay } },
});
const box = { transformBox: "fill-box", transformOrigin: "center" };

// Set when the diagram is shown too small for its lettering to be read
const Bare = createContext(false);

function Label({ delay = 0, children, ...p }) {
  const bare = useContext(Bare);
  if (bare) return null;
  return (
    <motion.text variants={fade(delay)} fontSize="13" letterSpacing="1" fill={LABEL} stroke="none" className="font-mono" {...p}>
      {children}
    </motion.text>
  );
}

// A soft ring that keeps pulsing out from a point once the drawing has landed
function Pulse({ cx, cy, delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={5}
      stroke={GLINT}
      style={box}
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: [0, 0.7, 0], scale: [1, 2.2, 3.2] }}
      transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity, delay }}
    />
  );
}

const ART = {
  // Business-first advice: the figures plotted towards the goal, not just filed
  target: (
    <>
      {[50, 95, 140].map((y) => (
        <motion.path key={y} variants={fade(0)} d={`M24 ${y}H296`} stroke={FAINT} strokeWidth={0.8} />
      ))}
      <motion.path variants={draw(0.2, 0.8)} d="M24 46H236" stroke={FAINT} strokeDasharray="3 4" />
      <Label delay={0.3} x={24} y={38}>
        YOUR GOAL
      </Label>
      <Label delay={0.3} x={24} y={158}>
        TODAY
      </Label>
      <motion.path variants={draw(0.35, 1.5)} d="M24 140C80 136 108 112 150 100S220 72 262 46" stroke={GLINT} strokeWidth={1.8} />
      <motion.circle variants={pop(1.5)} style={box} cx={262} cy={46} r={17} stroke={FAINT} />
      <motion.circle variants={pop(1.6)} style={box} cx={262} cy={46} r={9.5} stroke={LINE} />
      <motion.circle variants={pop(1.7)} style={box} cx={262} cy={46} r={3.5} fill={GLINT} stroke="none" />
      <Pulse cx={262} cy={46} delay={2} />
    </>
  ),
  // Precision in reporting: every line matched, then the double-ruled total
  precision: (
    <>
      {[38, 66, 94, 122].map((y, i) => (
        <g key={y}>
          <motion.rect variants={fade(0.1 + i * 0.16)} x={24} y={y - 3} width={[96, 72, 110, 84][i]} height={6} rx={3} fill={FAINT} stroke="none" />
          <motion.rect variants={fade(0.1 + i * 0.16)} x={184} y={y - 3} width={[52, 40, 58, 46][i]} height={6} rx={3} fill="rgba(255,255,255,0.4)" stroke="none" />
          <motion.path variants={draw(0.1 + i * 0.16, 0.6)} d={`M24 ${y + 13}H296`} stroke={FAINT} strokeWidth={0.8} />
          <motion.circle variants={pop(0.45 + i * 0.16)} style={box} cx={284} cy={y} r={8} stroke={GLINT} />
          <motion.path variants={draw(0.6 + i * 0.16, 0.4)} d={`M280 ${y}l3 3 5.5-6`} stroke={GLINT} strokeWidth={1.6} />
        </g>
      ))}
      <Label delay={1.3} x={24} y={160}>
        RECONCILED
      </Label>
      <motion.rect variants={fade(1.3)} x={184} y={151} width={62} height={7} rx={3.5} fill={GLINT} stroke="none" />
      <motion.path variants={draw(1.45, 0.6)} d="M184 164H296" stroke={LINE} />
      <motion.path variants={draw(1.55, 0.6)} d="M184 168H296" stroke={LINE} />
    </>
  ),
  // Proactive, not reactive: the issue flagged well ahead of the deadline
  proactive: (
    <>
      <motion.path variants={draw(0.1, 1.1)} d="M24 108H296" stroke={LINE} />
      {[24, 92, 160, 228, 296].map((x, i) => (
        <motion.path key={x} variants={fade(0.3 + i * 0.08)} d={`M${x} 103v10`} stroke={LINE} />
      ))}
      {["Q1", "Q2", "Q3", "Q4"].map((q, i) => (
        <Label key={q} delay={0.4 + i * 0.08} x={58 + i * 68} y={128} textAnchor="middle">
          {q}
        </Label>
      ))}
      <motion.path variants={draw(0.9, 0.5)} d="M262 108V52" stroke={LINE} strokeDasharray="3 4" />
      <motion.path variants={draw(1.1, 0.5)} d="M262 52h22l-5 6 5 6h-22" stroke={LINE} />
      <Label delay={1.2} x={262} y={42} textAnchor="middle">
        DEADLINE
      </Label>
      <motion.path variants={draw(1.4, 0.9)} d="M126 94Q194 30 256 92" stroke={GLINT} strokeDasharray="2 5" />
      <motion.circle variants={pop(1.3)} style={box} cx={126} cy={108} r={6} fill={GLINT} stroke="none" />
      <Pulse cx={126} cy={108} delay={1.8} />
      <Label delay={1.5} x={126} y={150} textAnchor="middle" fill={GLINT}>
        FLAGGED EARLY
      </Label>
    </>
  ),
  // Fixed, transparent fees: twelve even months under one agreed line
  fees: (
    <>
      <motion.path
        variants={draw(0.1, 1.2)}
        d="M24 112L60 64 96 124 132 44 170 118 208 58 248 128 296 38"
        stroke={FAINT}
        strokeDasharray="3 4"
      />
      {Array.from({ length: 12 }, (_, i) => (
        <motion.rect
          key={i}
          variants={grow(0.5 + i * 0.05)}
          style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
          x={24 + i * 23.4}
          y={84}
          width={14.6}
          height={58}
          rx={2}
          fill="rgba(255,255,255,0.22)"
          stroke="none"
        />
      ))}
      <motion.path variants={draw(1.2, 0.9)} d="M18 84H302" stroke={GLINT} strokeWidth={1.8} />
      <Label delay={1.5} x={24} y={74} fill={GLINT}>
        AGREED FEE
      </Label>
      <Label delay={0.6} x={24} y={160}>
        JAN
      </Label>
      <Label delay={0.6} x={296} y={160} textAnchor="end">
        DEC
      </Label>
    </>
  ),
  // Modern, cloud-based finance: three ledgers feeding one live picture
  cloud: (
    <>
      <motion.path
        variants={draw(0.1, 1.4)}
        d="M118 104H204a20 20 0 0 0 4-39.6a30 30 0 0 0-57-9a24 24 0 0 0-37 20a14.5 14.5 0 0 0 4 28.6z"
        stroke={LINE}
        strokeWidth={1.5}
      />
      <motion.circle variants={pop(1.2)} style={box} cx={150} cy={82} r={3.5} fill={GLINT} stroke="none" />
      <Pulse cx={150} cy={82} delay={1.8} />
      <Label delay={1.3} x={160} y={85} fill={GLINT}>
        LIVE
      </Label>
      {[
        ["M70 140C70 122 136 124 140 106", 70, "XERO"],
        ["M160 140V106", 160, "QUICKBOOKS"],
        ["M250 140C250 122 184 124 180 106", 250, "SAGE"],
      ].map(([d, x, name], i) => (
        <g key={name}>
          <motion.path variants={draw(0.9 + i * 0.15, 0.8)} d={d} stroke={GLINT} strokeDasharray="2 5" />
          <motion.circle variants={pop(0.7 + i * 0.15)} style={box} cx={x} cy={144} r={4.5} stroke={LINE} />
          <Label delay={0.8 + i * 0.15} x={x} y={164} textAnchor="middle">
            {name}
          </Label>
        </g>
      ))}
    </>
  ),
  // Discreet by default: the client's affairs behind a lock, inside the shield
  shield: (
    <>
      <motion.g variants={fade(0.2)}>
        <motion.circle
          cx={160}
          cy={92}
          r={84}
          stroke={FAINT}
          strokeDasharray="2 7"
          style={box}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        />
      </motion.g>
      <motion.circle variants={fade(0.3)} cx={160} cy={92} r={68} stroke={FAINT} strokeWidth={0.8} />
      <motion.path
        variants={draw(0.2, 1.4)}
        d="M160 28l50 17v44c0 31-21 53-50 65c-29-12-50-34-50-65V45z"
        stroke={LINE}
        strokeWidth={1.5}
      />
      <motion.rect variants={pop(1.1)} style={box} x={145} y={86} width={30} height={24} rx={4} fill="rgba(255,255,255,0.08)" stroke={GLINT} />
      <motion.path variants={draw(1.3, 0.6)} d="M151 86v-8a9 9 0 0 1 18 0v8" stroke={GLINT} />
      <motion.path variants={draw(1.6, 0.3)} d="M160 95v6" stroke={GLINT} strokeWidth={1.8} />
      <Pulse cx={160} cy={98} delay={2} />
    </>
  ),
};

// `bare` drops the lettering and thickens the line, for small sizes.
export default function ReasonArt({ name, bare = false, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 320 180"
      fill="none"
      strokeWidth={bare ? 2 : 1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      initial={reduce ? false : "hidden"}
      animate="show"
      className={`block h-auto w-full overflow-visible ${className}`}
    >
      <Bare.Provider value={bare}>{ART[name]}</Bare.Provider>
    </motion.svg>
  );
}
