"use client";

// three.js objects (materials, uniforms, cameras, geometries) are mutable by
// design and are updated every frame in useFrame — the standard r3f pattern,
// which the React Compiler immutability rule doesn't model.
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import SceneEnvironment from "./SceneEnvironment";
import {
  makeCardBackTexture,
  makeCardFaceTexture,
  makeLedgerTexture,
  makeTaxTexture,
} from "./servicesTextures";

// One continuous 3D environment for the /services page. Scroll drives a
// single "stage" value (0 intro → 1 ledger → 2 tax → 3 advisory → 4 card),
// and every object below derives its pose from that value, so the page reads
// as one evolving scene rather than separate sections swapping in and out:
//
//   ledger sheets fan out → flip over into filed VAT returns and get
//   stamped → are filed away as bars rise into a growth chart → the chart
//   folds down as the payment card rises into place.
//
// A shared data-point field morphs between a layout per chapter underneath
// it all (ledger rows → compliance ring → forecast cone → card orbit).

const STAGES = 4;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

// Holds each chapter's pose while its copy is centred on screen; the
// transition happens while the copy is scrolling between chapters.
const plateau = (s) => {
  const c = Math.min(Math.max(s, 0), STAGES);
  const k = Math.floor(c);
  return k + smoothstep(0.12, 0.88, c - k);
};

// Interpolates between per-stage keyframes. `delay` (0..spread) staggers
// objects within a transition so they move progressively, not in lockstep.
function keyframe(frames, e, delay = 0, spread = 0.35) {
  const last = frames.length - 1;
  const k = Math.min(Math.floor(e), last);
  if (k >= last) return [frames[last], frames[last], 0];
  const t = smoothstep(0, 1, clamp01((e - k - delay) / (1 - spread)));
  return [frames[k], frames[k + 1], t];
}

function applyPose(obj, a, b, t) {
  obj.position.set(lerp(a.p[0], b.p[0], t), lerp(a.p[1], b.p[1], t), lerp(a.p[2], b.p[2], t));
  obj.rotation.set(lerp(a.r[0], b.r[0], t), lerp(a.r[1], b.r[1], t), lerp(a.r[2], b.r[2], t));
  obj.scale.setScalar(Math.max(0.0001, lerp(a.s, b.s, t)));
}

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

function useDisposable(factory) {
  const value = useMemo(() => factory(), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(
    () => () => {
      [value].flat().forEach((v) => v?.dispose?.());
    },
    [value],
  );
  return value;
}

/* ------------------------------------------------------------------ */
/* Data field                                                          */
/* ------------------------------------------------------------------ */

const fieldVertex = /* glsl */ `
  uniform float uStage;
  uniform float uTime;
  uniform float uSize;
  attribute vec3 p1;
  attribute vec3 p2;
  attribute vec3 p3;
  attribute vec3 p4;
  attribute float aSeed;
  attribute float aSize;
  varying float vAlpha;
  varying float vGold;

  float stepAt(float x) {
    float t = clamp(x * 1.35 - aSeed * 0.35, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  vec3 rotY(vec3 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }

  void main() {
    vec3 pos = position;
    pos = mix(pos, p1, stepAt(uStage));
    pos = mix(pos, p2, stepAt(uStage - 1.0));
    pos = mix(pos, p3, stepAt(uStage - 2.0));
    pos = mix(pos, rotY(p4, uTime * 0.12), stepAt(uStage - 3.0));

    // Points billow slightly in depth mid-transition, so the field flows
    // from one structure to the next instead of sliding in straight lines.
    float f = fract(min(uStage, 3.999));
    pos.z += sin(3.14159 * f) * (aSeed - 0.5) * 0.9;
    pos += 0.03 * vec3(sin(uTime * 0.6 + aSeed * 40.0), cos(uTime * 0.5 + aSeed * 25.0), 0.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSize / -mv.z;
    vAlpha = 0.35 + 0.45 * aSize;
    vGold = step(0.9, aSeed);
  }
`;

const fieldFragment = /* glsl */ `
  uniform vec3 uBlue;
  uniform vec3 uGold;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vGold;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(mix(uBlue, uGold, vGold), a * a * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

function buildField(count) {
  const rand = rng(7);
  const layouts = Array.from({ length: 5 }, () => new Float32Array(count * 3));
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const set = (l, i, x, y, z) => {
    layouts[l][i * 3] = x;
    layouts[l][i * 3 + 1] = y;
    layouts[l][i * 3 + 2] = z;
  };
  const ROWS = 18;
  const SLOTS = 28;

  for (let i = 0; i < count; i++) {
    seeds[i] = rand();
    sizes[i] = 0.55 + rand() * 0.9;

    // 0 · intro — loose, unstructured scatter ("complexity")
    const sx = (rand() - 0.5) * 15;
    const sy = (rand() - 0.5) * 8;
    const sz = -6 + rand() * 7;
    set(0, i, sx, sy, sz);

    // 1 · ledger — columns of figures, grouped like debit/credit columns
    if (i < ROWS * SLOTS) {
      const row = i % ROWS;
      const slot = Math.floor(i / ROWS);
      const group = Math.floor(slot / 7);
      const digit = slot % 7;
      set(1, i, -3.9 + group * 2.05 + digit * 0.2, 2.2 - row * 0.26, -2.2);
    } else {
      set(1, i, sx * 0.9, sy * 0.9, -4 - rand() * 3);
    }

    // 2 · tax — a compliance ring around the filed stack, over a lattice
    if (i % 5 < 3) {
      const a = rand() * Math.PI * 2;
      const r = 2.45 + (rand() - 0.5) * 0.12;
      set(2, i, Math.cos(a) * r, Math.sin(a) * r * 0.92, -0.6 + Math.sin(a * 3) * 0.12);
    } else {
      const gx = i % 22;
      const gy = Math.floor(i / 22) % 13;
      set(2, i, -3.8 + gx * 0.36, -2.2 + gy * 0.36, -3);
    }

    // 3 · advisory — a widening forecast cone past the last bar, plus a floor
    if (i % 20 < 11) {
      const t = rand();
      const spread = 0.04 + t * 0.75;
      set(
        3,
        i,
        1.15 + t * 2.4,
        1.05 + t * 1.0 + t * t * 0.3 + (rand() - 0.5) * spread * 2,
        -0.9 - t * 0.9 + (rand() - 0.5) * spread * 1.4,
      );
    } else {
      set(3, i, (rand() - 0.5) * 10, -1.3 + (rand() - 0.5) * 0.04, -3.5 + rand() * 4.5);
    }

    // 4 · card — an orbit ring around the card ("secure network")
    if (i % 5 < 4) {
      const a = rand() * Math.PI * 2;
      const r = 2.7 + (rand() + rand() - 1) * 0.25;
      // Tilted so the near half of the ring passes under the card, not across its face
      set(4, i, Math.cos(a) * r * 1.15, -Math.sin(a) * r * 0.3 - 0.2 + (rand() - 0.5) * 0.08, Math.sin(a) * r * 0.75);
    } else {
      set(4, i, sx * 0.8, sy * 0.8, sz - 1.5);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(layouts[0], 3));
  geometry.setAttribute("p1", new THREE.BufferAttribute(layouts[1], 3));
  geometry.setAttribute("p2", new THREE.BufferAttribute(layouts[2], 3));
  geometry.setAttribute("p3", new THREE.BufferAttribute(layouts[3], 3));
  geometry.setAttribute("p4", new THREE.BufferAttribute(layouts[4], 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  // Positions morph in the shader; a generous fixed bound avoids per-frame recompute
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 14);
  return geometry;
}

function DataField({ journey, reduce, count, light }) {
  const geometry = useDisposable(() => buildField(count));
  const material = useDisposable(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fieldVertex,
        fragmentShader: fieldFragment,
        transparent: true,
        depthWrite: false,
        // Additive glow needs a dark backdrop; on a light page it just greys out,
        // so the light theme draws deeper-toned points with normal blending
        blending: light ? THREE.NormalBlending : THREE.AdditiveBlending,
        uniforms: {
          uStage: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: 40 },
          uOpacity: { value: 1 },
          uBlue: { value: new THREE.Color(light ? "#316aa2" : "#6ba0d6") },
          uGold: { value: new THREE.Color(light ? "#a8843f" : "#b99a5f") },
        },
      }),
  );
  const { size, viewport } = useThree();

  useFrame((state) => {
    const u = material.uniforms;
    u.uStage.value = plateau(journey.current.stage);
    u.uTime.value = reduce ? 0 : state.clock.elapsedTime;
    // World-size points: scale with canvas height so density reads the same on every screen
    u.uSize.value = 0.075 * (size.height / 2) * viewport.dpr;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/* ------------------------------------------------------------------ */
/* Ledger sheets → VAT returns                                         */
/* ------------------------------------------------------------------ */

const SHEETS = 5;

const sheetFrames = Array.from({ length: SHEETS }, (_, i) => {
  const c = i - 2;
  return [
    // 0 · distant, drifting
    { p: [2.2 + c * 1.1, -0.4 + c * 0.35, -7 - i * 0.5], r: [0.3, -0.7, 0.12 * c], s: 0.75, o: 0.3 },
    // 1 · ledger pages fanned out, face-up
    { p: [-1.05 + i * 0.52, 0.32 - i * 0.14, -i * 0.3], r: [-0.04, -0.36, -0.02 * c], s: 1, o: 1 },
    // 2 · turned over into a squared-up stack of filed returns
    { p: [c * 0.03, 0.05 + c * 0.025, -0.35 + i * 0.03], r: [-0.06, Math.PI - 0.3, c * 0.022], s: 1, o: 1 },
    // 3 · filed away, up and back out of frame
    { p: [-2 + c * 0.8, 4.2 + i * 0.35, -6 - i * 0.6], r: [0.6, Math.PI - 0.7, 0.2 * c], s: 0.6, o: 0 },
    { p: [-2 + c * 0.8, 4.2 + i * 0.35, -6 - i * 0.6], r: [0.6, Math.PI - 0.7, 0.2 * c], s: 0.6, o: 0 },
  ];
});

function Sheets({ journey, maxAnisotropy, light }) {
  const ledger = useDisposable(() => makeLedgerTexture(light).tex);
  const tax = useDisposable(() => makeTaxTexture(light).tex);
  const geometry = useDisposable(() => new THREE.PlaneGeometry(1.9, 2.69));
  const materials = useDisposable(() =>
    Array.from({ length: SHEETS }, () =>
      [ledger, tax].map(
        (map) =>
          new THREE.MeshStandardMaterial({
            map,
            transparent: true,
            alphaTest: 0.02, // drop the rounded corners so they don't occlude sheets behind
            roughness: light ? 0.6 : 0.5,
            metalness: light ? 0 : 0.15,
            // Less room-environment reflection on light, which otherwise greys the navy
            envMapIntensity: light ? 0.15 : 0.5,
          }),
      ),
    ).flat(),
  );
  const refs = useRef([]);

  useEffect(() => {
    ledger.anisotropy = tax.anisotropy = maxAnisotropy;
  }, [ledger, tax, maxAnisotropy]);

  useFrame(() => {
    const e = plateau(journey.current.stage);
    refs.current.forEach((g, i) => {
      if (!g) return;
      const [a, b, t] = keyframe(sheetFrames[i], e, i * 0.065, 0.3);
      applyPose(g, a, b, t);
      const o = lerp(a.o, b.o, t);
      materials[i * 2].opacity = materials[i * 2 + 1].opacity = o;
      g.visible = o > 0.01;
    });
  });

  return (
    <>
      {sheetFrames.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <mesh geometry={geometry} material={materials[i * 2]} />
          <mesh geometry={geometry} material={materials[i * 2 + 1]} rotation={[0, Math.PI, 0]} />
        </group>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Compliance seal — stamps onto the stack                             */
/* ------------------------------------------------------------------ */

const sealFrames = [
  { p: [0.72, -0.72, 3], r: [0, 0, -0.8], s: 0 },
  { p: [0.72, -0.72, 3], r: [0, 0, -0.8], s: 0 },
  { p: [0.6, -0.82, 0.12], r: [-0.06, -0.3, 0.14], s: 1 },
  { p: [0.9, 2.8, -2.5], r: [0.5, -0.6, 0.4], s: 0 },
  { p: [0.9, 2.8, -2.5], r: [0.5, -0.6, 0.4], s: 0 },
];

function Seal({ journey }) {
  const [ring, disc, check] = useDisposable(() => {
    const path = new THREE.CurvePath();
    path.add(new THREE.LineCurve3(new THREE.Vector3(-0.14, 0.0, 0.03), new THREE.Vector3(-0.035, -0.1, 0.03)));
    path.add(new THREE.LineCurve3(new THREE.Vector3(-0.035, -0.1, 0.03), new THREE.Vector3(0.15, 0.12, 0.03)));
    return [
      new THREE.TorusGeometry(0.34, 0.03, 16, 72),
      new THREE.CylinderGeometry(0.32, 0.32, 0.03, 56).rotateX(Math.PI / 2),
      new THREE.TubeGeometry(path, 24, 0.03, 10),
    ];
  });
  const [gold, navy] = useDisposable(() => [
    new THREE.MeshStandardMaterial({ color: "#d4b57a", metalness: 1, roughness: 0.26 }),
    new THREE.MeshPhysicalMaterial({ color: "#1b3157", metalness: 0.4, roughness: 0.35, clearcoat: 1 }),
  ]);
  const ref = useRef(null);

  useFrame(() => {
    const e = plateau(journey.current.stage);
    const [a, b, t] = keyframe(sealFrames, e, 0.28, 0.35);
    applyPose(ref.current, a, b, t);
    ref.current.visible = ref.current.scale.x > 0.01;
  });

  return (
    <group ref={ref}>
      <mesh geometry={disc} material={navy} />
      <mesh geometry={ring} material={gold} />
      <mesh geometry={check} material={gold} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Advisory — growth chart with a projection                          */
/* ------------------------------------------------------------------ */

const HEIGHTS = [0.55, 0.72, 0.64, 0.9, 1.06, 0.98, 1.3, 1.52, 1.78, 2.02, 2.3];
const ACTUALS = 8;
const BASE_Y = -1.3;
const barX = (i) => (i - (HEIGHTS.length - 1) / 2) * 0.36;

function Chart({ journey }) {
  const group = useRef(null);
  const actual = useRef(null);
  const forecast = useRef(null);
  const nodes = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const [barGeo, nodeGeo, lineGeo] = useDisposable(() => {
    const curve = new THREE.CatmullRomCurve3(
      HEIGHTS.map((h, i) => new THREE.Vector3(barX(i), BASE_Y + h + 0.12, 0)),
    );
    return [
      new THREE.BoxGeometry(0.2, 1, 0.2).translate(0, 0.5, 0),
      new THREE.SphereGeometry(0.05, 16, 12),
      new THREE.TubeGeometry(curve, 160, 0.016, 8),
    ];
  });
  const [barMat, forecastMat, goldMat, grid] = useDisposable(() => {
    const g = new THREE.GridHelper(5.2, 13, "#6ba0d6", "#6ba0d6");
    g.material.transparent = true;
    g.material.depthWrite = false;
    return [
      new THREE.MeshPhysicalMaterial({ color: "#316aa2", metalness: 0.35, roughness: 0.32, clearcoat: 0.8 }),
      new THREE.MeshPhysicalMaterial({
        color: "#6ba0d6",
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      }),
      new THREE.MeshStandardMaterial({ color: "#d4b57a", metalness: 1, roughness: 0.25 }),
      g,
    ];
  });
  const lineIndexCount = lineGeo.index.count;

  useFrame(() => {
    const e = plateau(journey.current.stage);
    const k = Math.floor(e);
    const visible = e > 2 && e < 4;
    group.current.visible = visible;
    if (!visible) return;

    // Bars rise left→right on the way in, fold down right→left on the way out
    let reached = 0;
    HEIGHTS.forEach((h, i) => {
      const delay = (k === 2 ? i : HEIGHTS.length - 1 - i) * 0.022;
      const grow = k === 2 ? smoothstep(0, 1, clamp01((e - 2 - delay) / 0.7)) : 1 - smoothstep(0, 1, clamp01((e - 3 - delay) / 0.7));
      dummy.position.set(barX(i), BASE_Y, 0);
      dummy.scale.set(1, Math.max(0.001, h * grow), 1);
      dummy.updateMatrix();
      if (i < ACTUALS) actual.current.setMatrixAt(i, dummy.matrix);
      else forecast.current.setMatrixAt(i - ACTUALS, dummy.matrix);
      reached += grow;
    });
    actual.current.instanceMatrix.needsUpdate = true;
    forecast.current.instanceMatrix.needsUpdate = true;

    // Trend line draws once the bars are mostly up and retracts first on exit
    const line = k === 2 ? smoothstep(0.35, 0.95, e - 2) : 1 - smoothstep(0, 0.35, e - 3);
    // TubeGeometry indices run segment by segment: 8 radial quads × 6 indices each
    lineGeo.setDrawRange(0, Math.min(lineIndexCount, Math.floor(line * 160) * 8 * 6));

    HEIGHTS.forEach((h, i) => {
      const at = clamp01((line * (HEIGHTS.length - 1) - i) * 2 + 1);
      dummy.position.set(barX(i), BASE_Y + h + 0.12, 0);
      dummy.scale.setScalar(Math.max(0.001, at));
      dummy.updateMatrix();
      nodes.current.setMatrixAt(i, dummy.matrix);
    });
    nodes.current.instanceMatrix.needsUpdate = true;

    grid.material.opacity = 0.16 * (reached / HEIGHTS.length);
  });

  return (
    <group ref={group} position={[-0.3, 0.1, 0]} rotation={[0, -0.4, 0]} scale={0.86} visible={false}>
      <primitive object={grid} position={[0, BASE_Y, 0]} />
      <instancedMesh ref={actual} args={[barGeo, barMat, ACTUALS]} />
      <instancedMesh ref={forecast} args={[barGeo, forecastMat, HEIGHTS.length - ACTUALS]} />
      <instancedMesh ref={nodes} args={[nodeGeo, goldMat, HEIGHTS.length]} />
      <mesh geometry={lineGeo} material={goldMat} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Payment card                                                        */
/* ------------------------------------------------------------------ */

const CARD_W = 3.2;
const CARD_H = CARD_W / 1.585;
const CARD_R = 0.17;
const CARD_D = 0.03;
const BEVEL = 0.008;

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function faceGeometry(shape) {
  const g = new THREE.ShapeGeometry(shape, 12);
  // ShapeGeometry UVs are in shape units; remap to 0..1 across the card
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / CARD_W + 0.5, pos.getY(i) / CARD_H + 0.5);
  }
  return g;
}

const cardFrames = [
  { p: [1.8, -4.8, -3], r: [1.3, -2.8, 0.6], s: 0.55 },
  { p: [1.8, -4.8, -3], r: [1.3, -2.8, 0.6], s: 0.55 },
  { p: [1.8, -4.8, -3], r: [1.3, -2.8, 0.6], s: 0.55 },
  { p: [1.8, -4.8, -3], r: [1.3, -2.8, 0.6], s: 0.55 },
  { p: [-0.45, 0.1, 0.4], r: [-0.12, -0.42, 0.06], s: 0.8 },
];

function Card({ journey, mouse, reduce, maxAnisotropy }) {
  const rig = useRef(null);
  const tilt = useRef(null);
  const faceZ = CARD_D / 2 + BEVEL + 0.0006;

  const [body, face, chip] = useDisposable(() => {
    const shape = roundedRect(CARD_W, CARD_H, CARD_R);
    return [
      new THREE.ExtrudeGeometry(shape, {
        depth: CARD_D,
        bevelEnabled: true,
        bevelThickness: BEVEL,
        bevelSize: BEVEL,
        bevelSegments: 3,
        curveSegments: 12,
      }).translate(0, 0, -CARD_D / 2),
      faceGeometry(shape),
      new THREE.BoxGeometry(0.42, 0.32, 0.014),
    ];
  });
  const [faceTex, backTex] = useDisposable(() => [
    makeCardFaceTexture(maxAnisotropy).tex,
    makeCardBackTexture(maxAnisotropy).tex,
  ]);
  const [edgeMat, faceMat, backMat, chipMat] = useDisposable(() => {
    const surface = (map) =>
      new THREE.MeshPhysicalMaterial({
        map,
        metalness: 0.35,
        roughness: 0.36,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      });
    return [
      new THREE.MeshPhysicalMaterial({ color: "#9fb6d3", metalness: 0.9, roughness: 0.28 }),
      surface(faceTex),
      surface(backTex),
      new THREE.MeshStandardMaterial({ color: "#e2c78f", metalness: 1, roughness: 0.2 }),
    ];
  });
  const spin = useRef({ vel: 0, x: 0, y: 0 });

  useFrame((state, dt) => {
    const { stage, vel } = journey.current;
    const e = plateau(stage);
    const [a, b, t] = keyframe(cardFrames, e, 0, 0.2);
    applyPose(rig.current, a, b, t);
    rig.current.visible = e > 3;

    // Keeps turning with the scroll while it's the focus, plus a gentle float
    const settled = smoothstep(3.5, 4, e);
    rig.current.rotation.y += (Math.min(stage, 4.6) - 4) * 0.55 * settled;
    if (!reduce) rig.current.position.y += Math.sin(state.clock.elapsedTime * 0.8) * 0.045 * settled;

    // Scroll velocity leans the card; the pointer tilts it toward the cursor
    const k = 1 - Math.exp(-dt * 5);
    const s = spin.current;
    s.vel = lerp(s.vel, reduce ? 0 : THREE.MathUtils.clamp(vel * 0.35, -0.35, 0.35), k);
    s.x = lerp(s.x, -mouse.current.y * 0.22, k);
    s.y = lerp(s.y, mouse.current.x * 0.32, k);
    tilt.current.rotation.set(s.x + s.vel, s.y, 0);
  });

  return (
    <group ref={rig} visible={false}>
      <group ref={tilt}>
        <mesh geometry={body} material={edgeMat} />
        <mesh geometry={face} material={faceMat} position={[0, 0, faceZ]} />
        <mesh geometry={face} material={backMat} position={[0, 0, -faceZ]} rotation={[0, Math.PI, 0]} />
        <mesh geometry={chip} material={chipMat} position={[-CARD_W / 2 + 0.6, 0.12, faceZ + 0.007]} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Camera, layout and lights                                           */
/* ------------------------------------------------------------------ */

const cameraFrames = [
  { p: [0, 0.2, 10.5], l: [0, 0, 0] },
  { p: [-0.5, 0.35, 8.3], l: [0, 0, 0] },
  { p: [0.55, 0.8, 7.5], l: [0, 0, 0] },
  { p: [-0.7, 2.0, 8.1], l: [0, 0.2, 0] },
  { p: [0, 0.15, 7.1], l: [0, 0, 0] },
];

function Rig({ journey, mouse, reduce, root, keyLight }) {
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const aspect = size.width / size.height;
  const wide = aspect > 1.05;

  useEffect(() => {
    // Portrait screens get a wider lens so the card and ledger still fit
    camera.fov = wide ? 35 : 52;
    camera.updateProjectionMatrix();
    // Desktop: compose objects into the right-hand side, clear of the copy.
    // Mobile: lift them into the top half, above the copy.
    root.current.position.set(wide ? THREE.MathUtils.clamp((aspect - 1) * 2.4, 0.9, 1.9) : 0, wide ? 0 : 1.05, 0);
    root.current.scale.setScalar(wide ? 1 : 0.72);
  }, [camera, wide, aspect, root]);

  useFrame((state, dt) => {
    const e = plateau(journey.current.stage);
    const [a, b, t] = keyframe(cameraFrames, e);
    const m = mouse.current;
    const k = 1 - Math.exp(-dt * 3);
    m.sx = lerp(m.sx, reduce ? 0 : m.x, k);
    m.sy = lerp(m.sy, reduce ? 0 : m.y, k);
    camera.position.set(
      lerp(a.p[0], b.p[0], t) + m.sx * 0.45,
      lerp(a.p[1], b.p[1], t) - m.sy * 0.28,
      lerp(a.p[2], b.p[2], t),
    );
    look.set(lerp(a.l[0], b.l[0], t), lerp(a.l[1], b.l[1], t), lerp(a.l[2], b.l[2], t));
    camera.lookAt(look);

    // Key light sweeps with the story so highlights travel across surfaces
    keyLight.current.position.set(3.5 * Math.cos(e * 0.7), 4, 5 + Math.sin(e * 0.7) * 1.5);
  });

  return null;
}

function Scene({ journey, reduce, mobile, light }) {
  const root = useRef(null);
  const keyLight = useRef(null);
  const mouse = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const { gl } = useThree();
  const maxAnisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  return (
    <>
      <SceneEnvironment />
      <ambientLight intensity={0.3} />
      <directionalLight ref={keyLight} position={[3, 4, 6]} intensity={1.3} />
      <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#8fb6e0" />
      <Rig journey={journey} mouse={mouse} reduce={reduce} root={root} keyLight={keyLight} />
      <group ref={root}>
        <DataField journey={journey} reduce={reduce} count={mobile ? 650 : 1400} light={light} />
        <Sheets journey={journey} maxAnisotropy={maxAnisotropy} light={light} />
        <Seal journey={journey} />
        <Chart journey={journey} />
        <Card journey={journey} mouse={mouse} reduce={reduce} maxAnisotropy={maxAnisotropy} />
      </group>
    </>
  );
}

export default function ServicesScene({ journey, reduce, onContextLost }) {
  const canvasRef = useRef(null);
  const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  // The site is now light everywhere, so the scene always uses its light palette.
  const light = true;

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
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, 10.5], fov: 35, near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = light ? 1 : 1.1;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <Scene journey={journey} reduce={reduce} mobile={mobile} light={light} />
    </Canvas>
  );
}
