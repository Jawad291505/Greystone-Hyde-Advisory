"use client";

import { Canvas, addAfterEffect, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const LABELS = ["TAX", "VAT", "PAYROLL", "CASH FLOW", "EXPENSES", "INVOICES", "REPORTING"];

const clamp = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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

function makeTexture(label, accent) {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, s, s);
  if (accent) {
    grad.addColorStop(0, "#316aa2");
    grad.addColorStop(1, "#243b6f");
  } else {
    grad.addColorStop(0, "#141c2b");
    grad.addColorStop(1, "#0a0f18");
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  g.strokeStyle = accent ? "rgba(200,225,255,0.55)" : "rgba(91,147,199,0.4)";
  g.lineWidth = 3;
  g.strokeRect(14, 14, s - 28, s - 28);
  g.fillStyle = accent ? "#ecebe6" : "rgba(236,235,230,0.82)";
  g.font = "600 30px ui-monospace, Menlo, monospace";
  g.textAlign = "center";
  g.textBaseline = "middle";
  const words = label.split(" ");
  if (words.length === 1) g.fillText(label, s / 2, s / 2);
  else words.forEach((w, i) => g.fillText(w, s / 2, s / 2 + (i - 0.5) * 38));
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Environment() {
  const gl = useThree((st) => st.gl);
  const env = useMemo(() => {
    try {
      const pmrem = new THREE.PMREMGenerator(gl);
      const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
      return tex;
    } catch {
      return null; // lights alone still light the cube
    }
  }, [gl]);
  useEffect(() => () => env?.dispose(), [env]);
  return env ? <primitive object={env} attach="environment" /> : null;
}

// Reports liveness: frames actually rendered, and whether pixels reached the canvas.
function Health({ health, progress }) {
  const gl = useThree((st) => st.gl);
  useEffect(() => {
    let n = 0;
    return addAfterEffect(() => {
      health.current.last = performance.now();
      n += 1;
      if ((n !== 40 && n % 600 !== 0) || progress.current < 0.2) return;
      const ctx = gl.getContext();
      if (ctx.isContextLost()) {
        health.current.blankCount = 99;
        return;
      }
      const w = ctx.drawingBufferWidth;
      const h = ctx.drawingBufferHeight;
      // A thin band through the middle is enough to tell blank from drawn, and cheap to read.
      const band = Math.min(24, h);
      const px = new Uint8Array(w * band * 4);
      ctx.readPixels(0, Math.floor((h - band) / 2), w, band, ctx.RGBA, ctx.UNSIGNED_BYTE, px);
      let any = false;
      for (let i = 3; i < px.length; i += 4 * 13) {
        if (px[i] > 0) {
          any = true;
          break;
        }
      }
      health.current.blankCount = any ? 0 : health.current.blankCount + 1;
    });
  }, [gl, health, progress]);
  return null;
}

function Cube({ n, progress }) {
  const group = useRef(null);
  const meshes = useRef([]);
  const { size } = useThree();

  const { geometry, cubies, plain } = useMemo(() => {
    const rand = rng(7);
    const geometry = new RoundedBoxGeometry(0.94, 0.94, 0.94, 3, 0.07);
    const plain = new THREE.MeshStandardMaterial({
      color: "#0c111b",
      metalness: 0.7,
      roughness: 0.45,
      envMapIntensity: 0.5,
    });
    const cache = new Map();
    const tile = (label, accent) => {
      const key = `${label}-${accent}`;
      if (!cache.has(key)) {
        cache.set(
          key,
          new THREE.MeshStandardMaterial({
            map: makeTexture(label, accent),
            metalness: 0.55,
            roughness: 0.4,
            emissive: accent ? "#316aa2" : "#000000",
            emissiveIntensity: accent ? 0.18 : 0,
            envMapIntensity: 0.5,
          }),
        );
      }
      return cache.get(key);
    };

    const half = (n - 1) / 2;
    const list = [];
    let idx = 0;
    for (let x = 0; x < n; x++)
      for (let y = 0; y < n; y++)
        for (let z = 0; z < n; z++) {
          const gx = x - half;
          const gy = y - half;
          const gz = z - half;
          const edge = (v) => Math.abs(v) === half;
          const mat = (outward, dir) => {
            if (!outward) return plain;
            const k = idx + dir;
            return tile(LABELS[k % LABELS.length], k % 5 === 0);
          };
          // +x -x +y -y +z -z
          const materials = [
            mat(gx === half, 0),
            mat(gx === -half, 1),
            mat(gy === half, 2),
            mat(gy === -half, 3),
            mat(gz === half, 4),
            mat(gz === -half, 5),
          ];
          void edge;
          const a = rand() * Math.PI * 2;
          const b = Math.acos(2 * rand() - 1);
          const r = 6 + rand() * 4;
          list.push({
            g: new THREE.Vector3(gx * 1.02, gy * 1.02, gz * 1.02),
            top: gy === half,
            scatter: new THREE.Vector3(
              r * Math.sin(b) * Math.cos(a),
              r * Math.sin(b) * Math.sin(a),
              r * Math.cos(b) - 2,
            ),
            spin: new THREE.Vector3(
              (rand() - 0.5) * Math.PI * 3,
              (rand() - 0.5) * Math.PI * 3,
              (rand() - 0.5) * Math.PI * 3,
            ),
            phase: rand() * 6.28,
            materials,
          });
          idx++;
        }
    return { geometry, cubies: list, plain };
  }, [n]);

  useEffect(
    () => () => {
      geometry.dispose();
      plain.dispose();
    },
    [geometry, plain],
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const p = progress.current;
    const time = clock.elapsedTime;
    const assemble = clamp(p / 0.55);
    const settle = ease(clamp((p - 0.15) / 0.8));
    const twist = (1 - ease(clamp((p - 0.55) / 0.3))) * (Math.PI / 2);
    const N = cubies.length;

    cubies.forEach((c, i) => {
      const m = meshes.current[i];
      if (!m) return;
      const local = ease(clamp((assemble - (i / N) * 0.35) / 0.65));
      // Top layer starts turned, then resolves: the "solve" beat.
      tmp.copy(c.g);
      let ry = 0;
      if (c.top && n > 1) {
        const cos = Math.cos(twist);
        const sin = Math.sin(twist);
        tmp.set(c.g.x * cos + c.g.z * sin, c.g.y, -c.g.x * sin + c.g.z * cos);
        ry = twist;
      }
      const drift = (1 - local) * 0.25;
      m.position.set(
        c.scatter.x + (tmp.x - c.scatter.x) * local + Math.sin(time * 0.35 + c.phase) * drift,
        c.scatter.y + (tmp.y - c.scatter.y) * local + Math.cos(time * 0.3 + c.phase) * drift,
        c.scatter.z + (tmp.z - c.scatter.z) * local,
      );
      m.rotation.set(
        c.spin.x * (1 - local),
        c.spin.y * (1 - local) + ry * local,
        c.spin.z * (1 - local),
      );
    });

    const g = group.current;
    if (g) {
      const wide = size.width / size.height > 1.15;
      g.rotation.y = 0.62 + (1 - settle) * Math.PI * 1.1;
      g.rotation.x = 0.42 - (1 - settle) * 0.25;
      g.position.x = wide ? 1.9 : 0;
      g.position.y = wide ? 0 : 1.3;
      const s = (n === 2 ? 1.35 : 1) * (wide ? 1 : 0.82);
      g.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      {cubies.map((c, i) => (
        <mesh
          key={i}
          ref={(el) => (meshes.current[i] = el)}
          geometry={geometry}
          material={c.materials}
        />
      ))}
    </group>
  );
}

export default function CubeScene({ progress, small, active, onFail }) {
  const [epoch, setEpoch] = useState(0);
  const health = useRef({ last: 0, blankCount: 0 });
  const strikes = useRef(0);
  const activeRef = useRef(active);

  useEffect(() => {
    health.current.last = performance.now();
  }, []);

  useEffect(() => {
    activeRef.current = active;
    if (active) health.current.last = performance.now();
  }, [active]);

  // Watchdog: rebuild the canvas if it stalls or stays blank; give up after 3 tries.
  useEffect(() => {
    const id = setInterval(() => {
      if (!activeRef.current) return;
      const h = health.current;
      if (performance.now() - h.last > 6000 || h.blankCount >= 2) {
        strikes.current += 1;
        h.last = performance.now();
        h.blankCount = 0;
        if (strikes.current > 2) onFail?.();
        else setEpoch((n) => n + 1);
      } else {
        strikes.current = 0;
      }
    }, 1000);
    return () => clearInterval(id);
  }, [onFail]);

  return (
    <Canvas
      key={epoch}
      onCreated={({ gl }) => {
        const el = gl.domElement;
        el.addEventListener("webglcontextlost", (e) => e.preventDefault());
        el.addEventListener("webglcontextrestored", () => setEpoch((n) => n + 1));
      }}
      dpr={[1, small ? 1.5 : 1.75]}
      camera={{ position: [0, 0, 9.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      frameloop="always"
    >
      <Environment />
      <Health health={health} progress={progress} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 6, 5]} intensity={2.4} color="#8cb4e1" />
      <directionalLight position={[-6, -2, -4]} intensity={1.1} color="#b99a5f" />
      <pointLight position={[0, 0, 7]} intensity={12} color="#5b93c7" />
      <Cube n={small ? 2 : 3} progress={progress} />
    </Canvas>
  );
}
