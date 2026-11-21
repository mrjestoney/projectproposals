"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { Part } from "../part";
import { getMaterials } from "../materials";

const PITCH = 0.0185;
// Key widths per row, in key units (negative = a gap). A tenkeyless layout: 87 keys.
const ROWS = [
  [1, -0.5, 1, 1, 1, 1, -0.5, 1, 1, 1, 1, -0.5, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75],
  [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25],
];

function layout() {
  const keys = [];
  ROWS.forEach((row, r) => {
    let x = 0;
    for (const u of row) {
      if (u < 0) x += -u * PITCH;
      else {
        keys.push({ x: x + (u * PITCH) / 2, r, w: u * PITCH - 0.0022 });
        x += u * PITCH;
      }
    }
  });
  const total = Math.max(...ROWS.map((row) => row.reduce((a, u) => a + Math.abs(u), 0))) * PITCH;
  return { keys, total };
}

/** Tenkeyless keyboard: dark case, 87 individual keycaps (instanced), a tilt, and a light strip when the PC is on. */
export function Keyboard({ position = [0, 0, 0] }) {
  const M = getMaterials();
  const { keys, total } = useMemo(() => layout(), []);
  const inst = useRef(null);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    keys.forEach((k, i) => {
      o.position.set(k.x - total / 2, 0.0185 + (5 - k.r) * 0.0004, -0.0555 + 0.012 + k.r * PITCH);
      o.scale.set(k.w, 1, 0.0163);
      o.updateMatrix();
      inst.current.setMatrixAt(i, o.matrix);
    });
    inst.current.instanceMatrix.needsUpdate = true;
  }, [keys, total]);

  return (
    <Part id="keyboard" position={position} labelAt={[0, 0.05, 0]}>
      <group rotation={[-0.09, 0, 0]}>
        <RoundedBox args={[total + 0.016, 0.014, 0.135]} radius={0.004} smoothness={3} position={[0, 0.007, 0]} material={M.matte} castShadow receiveShadow />
        <instancedMesh ref={inst} args={[undefined, M.keycap, keys.length]} castShadow receiveShadow>
          <boxGeometry args={[1, 0.0085, 1]} />
        </instancedMesh>
        <mesh position={[0, 0.0145, -0.0645]} material={M.cyan}>
          <boxGeometry args={[total * 0.9, 0.001, 0.0016]} />
        </mesh>
      </group>
    </Part>
  );
}
