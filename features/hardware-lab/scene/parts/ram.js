"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Part } from "../part";
import { useScene } from "../context";
import { getMaterials } from "../materials";
import { BOARD_ROT, bpos } from "./helpers";

function Chips() {
  const M = getMaterials();
  const ref = useRef(null);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    let i = 0;
    for (const side of [-1, 1])
      for (let k = 0; k < 8; k++) {
        o.position.set(side * 0.0016, -0.0575 + k * 0.0165, 0.0155);
        o.updateMatrix();
        ref.current.setMatrixAt(i++, o.matrix);
      }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, M.chip, 16]} castShadow>
      <boxGeometry args={[0.0012, 0.013, 0.011]} />
    </instancedMesh>
  );
}

/** One memory stick: PCB, two rows of chips, aluminium heat spreaders (with a window) and an RGB light bar. */
function Stick({ x, unseatable = false }) {
  const ctx = useScene();
  const M = getMaterials();
  const g = useRef(null);
  const seat = useRef(1);
  const invalidate = useThree((s) => s.invalidate);

  useFrame((_, dt) => {
    const t = unseatable && ctx.ramUnseated ? 0 : 1;
    if (Math.abs(seat.current - t) > 0.002) {
      seat.current = ctx.reduceMotion ? t : THREE.MathUtils.damp(seat.current, t, 4, dt);
      invalidate();
    } else seat.current = t;
    if (g.current) {
      g.current.position.z = (1 - seat.current) * 0.014;
      g.current.rotation.y = (1 - seat.current) * 0.16;
    }
  });

  return (
    <group position={[x, 0, 0]}>
      <group ref={g}>
        <mesh position={[0, 0, 0.0155]} material={M.pcb} castShadow>
          <boxGeometry args={[0.0016, 0.133, 0.031]} />
        </mesh>
        <Chips />
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.0026, 0, 0.0262]} material={M.aluminium} castShadow>
              <boxGeometry args={[0.0022, 0.133, 0.0095]} />
            </mesh>
            <mesh position={[s * 0.0026, 0, 0.0045]} material={M.aluminium} castShadow>
              <boxGeometry args={[0.0022, 0.133, 0.008]} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0, 0.0322]} material={M.magenta}>
          <boxGeometry args={[0.0052, 0.12, 0.002]} />
        </mesh>
        <mesh position={[0, 0, 0.0005]} material={M.gold}>
          <boxGeometry args={[0.0012, 0.125, 0.0012]} />
        </mesh>
      </group>
    </group>
  );
}

/** Two RAM sticks in slots 2 and 4. In the "RAM not seated" fix scenario, the second stick is raised and tilted. */
export function Ram() {
  return (
    <Part id="ram" position={bpos([0.078, 0.07, 0.0035])} rotation={BOARD_ROT} labelAt={[0, 0.09, 0.04]}>
      <Stick x={0} />
      <Stick x={0.032} unseatable />
    </Part>
  );
}
