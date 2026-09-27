"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SceneEnvironment from "./SceneEnvironment";
import { useCoinAssets } from "./coinMaterial";

// Coins trace a rising spiral, but — unlike the homepage's tumbling stack —
// they stay face-on to the camera at rest: rotation.y always resolves to 0,
// so the £ engraving stays legible instead of catching an edge. Entrance
// keeps a little tumble for life; the settled spiral doesn't.
const COUNT = 9;

const clamp = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildCoins() {
  const rand = rng(29);
  const out = [];
  const turns = 2.1;
  const rStart = 0.35;
  const rEnd = 3.1;

  for (let i = 0; i < COUNT; i++) {
    const t = i / (COUNT - 1);
    const angle = t * turns * Math.PI * 2;
    const radius = rStart + t * (rEnd - rStart);

    const sAngle = rand() * Math.PI * 2;
    const sRadius = 4.6 + rand() * 2.2;

    out.push({
      // resolved spiral slot — rising and widening outward, "value, growing"
      fx: Math.cos(angle) * radius,
      fy: Math.sin(angle) * radius * 0.58 + (t - 0.5) * 1.7,
      fz: t * 1.3 - 0.6,
      scale: 0.55 + t * 0.5,
      restRotZ: ((rand() - 0.5) * 10 * Math.PI) / 180,
      // scattered entry, off to the sides and behind
      sx: Math.cos(sAngle) * sRadius,
      sy: (rand() - 0.5) * 4,
      sz: -3 - rand() * 2,
      sRotY: (rand() - 0.5) * Math.PI * 1.3,
      sRotZ: (rand() - 0.5) * 1.1,
      phase: rand() * Math.PI * 2,
      delay: t * 0.55,
    });
  }
  return out;
}

function SpiralGroup({ progress }) {
  const coins = useMemo(() => buildCoins(), []);
  const meshRefs = useRef([]);
  const reduceRef = useRef(false);
  const { geometry, materials } = useCoinAssets();

  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useFrame((state) => {
    const p = progress.current;
    const reduce = reduceRef.current;
    const t = reduce ? 0 : state.clock.elapsedTime;
    const assemble = clamp(p / 0.7);

    coins.forEach((c, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      const local = ease(clamp((assemble - c.delay * 0.35) / 0.65));
      const idle = reduce ? 0 : 1 - local;

      const driftX = Math.sin(t * 0.45 + c.phase) * 0.05 * idle;
      const driftY = Math.cos(t * 0.38 + c.phase * 1.5) * 0.06 * idle;
      const restWobbleZ = reduce ? 0 : Math.sin(t * 0.3 + c.phase) * 0.05 * local;

      mesh.position.x = lerp(c.sx, c.fx, local) + driftX;
      mesh.position.y = lerp(c.sy, c.fy, local) + driftY;
      mesh.position.z = lerp(c.sz, c.fz, local);

      // always resolves to face-on (0) — the coin never rotates away from camera
      mesh.rotation.y = lerp(c.sRotY, 0, local);
      mesh.rotation.z = lerp(c.sRotZ, c.restRotZ, local) + restWobbleZ;
      mesh.rotation.x = Math.sin(t * 0.2 + c.phase) * 0.04 * idle;

      const s = lerp(0.38, c.scale, local);
      mesh.scale.setScalar(s);
    });
  });

  return (
    <>
      {coins.map((c, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={geometry}
          material={materials}
        />
      ))}
    </>
  );
}

export default function SpiralCoins({ progress, onContextLost }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleLost = (e) => {
      e.preventDefault();
      onContextLost?.();
    };
    canvas.addEventListener("webglcontextlost", handleLost, false);
    return () => canvas.removeEventListener("webglcontextlost", handleLost);
  }, [onContextLost]);

  return (
    <Canvas
      ref={canvasRef}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "default", preserveDrawingBuffer: false }}
      camera={{ position: [0, 0, 8.6], fov: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <SceneEnvironment />
      <ambientLight intensity={0.22} />
      <directionalLight position={[3, 4, 6]} intensity={1.15} />
      <directionalLight position={[-4, -1, 3]} intensity={0.3} />
      <SpiralGroup progress={progress} />
    </Canvas>
  );
}
