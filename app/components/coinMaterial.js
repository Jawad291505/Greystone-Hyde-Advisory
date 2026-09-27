"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { getFaceCanvas, getPlainCanvas, getEdgeCanvas } from "./coinTextures";

// Shared coin geometry + materials for every WebGL coin scene (GbpCoinsGL,
// SpiralCoins). Built once per scene and disposed on unmount.
export function useCoinAssets() {
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.5, 0.5, 0.09, 56, 1), []);

  const assets = useMemo(() => {
    const faceTex = new THREE.CanvasTexture(getFaceCanvas());
    const plainTex = new THREE.CanvasTexture(getPlainCanvas());
    const edgeTex = new THREE.CanvasTexture(getEdgeCanvas());
    edgeTex.wrapS = THREE.RepeatWrapping;
    edgeTex.repeat.set(6, 1);

    const base = { color: new THREE.Color("#caa14c"), metalness: 1, roughness: 0.32 };
    return {
      faceMat: new THREE.MeshStandardMaterial({ ...base, bumpMap: faceTex, bumpScale: 0.018 }),
      plainMat: new THREE.MeshStandardMaterial({ ...base, bumpMap: plainTex, bumpScale: 0.014, color: "#b8924a" }),
      edgeMat: new THREE.MeshStandardMaterial({ ...base, bumpMap: edgeTex, bumpScale: 0.01, roughness: 0.4, color: "#a9843f" }),
    };
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      [assets.faceMat, assets.plainMat, assets.edgeMat].forEach((m) => {
        m.bumpMap?.dispose();
        m.dispose();
      });
    },
    [geometry, assets]
  );

  const materials = useMemo(() => [assets.edgeMat, assets.faceMat, assets.plainMat], [assets]);

  return { geometry, materials };
}
