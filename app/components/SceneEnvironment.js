"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Procedurally generated interior lighting environment (no HDR download)
// for real metal reflections on any coin scene. Shared by GbpCoinsGL and
// SpiralCoins rather than duplicated per scene.
export default function SceneEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.045).texture;
    // three.js Scene is a live mutable object by design (the standard r3f
    // pattern for an environment map, same as drei's <Environment>).
    // eslint-disable-next-line react-hooks/immutability
    scene.environment = envTex;
    return () => {
      scene.environment = null;
      envTex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}
