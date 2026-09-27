"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SceneEnvironment from "./SceneEnvironment";
import { useCoinAssets } from "./coinMaterial";

// Real geometry: a CylinderGeometry gives the coin an actual edge, so —
// unlike the CSS/SVG version — it looks correct from any angle and can
// tumble freely without ever going edge-on-to-nothing.
const COUNT = 6;

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
  const rand = rng(11);
  const out = [];
  for (let i = 0; i < COUNT; i++) {
    const a = rand() * Math.PI * 2;
    const r = 2.1 + rand() * 1.7;
    out.push({
      sx: Math.cos(a) * r,
      sy: (rand() - 0.5) * 2.4 - 0.2,
      sz: (rand() - 0.5) * 3.2,
      sRotY: rand() * Math.PI * 4 - Math.PI * 2,
      sRotZ: (rand() - 0.5) * 0.6,
      // ascending stair, bottom-left to top-right — value, compounding upward
      fx: -1.9 + i * 0.78,
      fy: -1.1 + i * 0.46,
      fz: i * 0.12,
      fRotZ: (-5 + i * 1.4) * (Math.PI / 180),
      scale: 0.5 + i * 0.032,
      phase: rand() * Math.PI * 2,
      delay: i / COUNT,
    });
  }
  return out;
}

function Coins({ progress }) {
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
    const assemble = clamp(p / 0.62);

    coins.forEach((c, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      const local = ease(clamp((assemble - c.delay * 0.3) / 0.7));
      const arc = Math.sin(local * Math.PI) * 0.42;
      const idle = reduce ? 0 : 1 - local;

      const driftX = Math.sin(t * 0.5 + c.phase) * 0.045 * idle;
      const driftY = Math.cos(t * 0.4 + c.phase * 1.6) * 0.055 * idle;
      const restWobble = reduce ? 0 : Math.sin(t * 0.3 + c.phase) * 0.16 * local;

      mesh.position.x = lerp(c.sx, c.fx, local) + driftX;
      mesh.position.y = lerp(c.sy, c.fy, local) + arc + driftY;
      mesh.position.z = lerp(c.sz, c.fz, local);
      mesh.rotation.y = lerp(c.sRotY, restWobble, local);
      mesh.rotation.z = lerp(c.sRotZ, c.fRotZ, local);
      mesh.rotation.x = Math.sin(t * 0.22 + c.phase) * 0.05 * idle;
      const s = lerp(0.42, c.scale, local);
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

export default function GbpCoinsGL({ progress, onContextLost }) {
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
      camera={{ position: [0, 0, 6.2], fov: 32 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <SceneEnvironment />
      <ambientLight intensity={0.22} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <directionalLight position={[-4, -2, 2]} intensity={0.25} />
      <Coins progress={progress} />
    </Canvas>
  );
}
