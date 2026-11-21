"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { Part } from "../part";
import { useScene } from "../context";
import { getMaterials } from "../materials";
import { Fan } from "./fan";
import { BOARD_ROT, bpos } from "./helpers";

const FINS = 48;

/** Tower CPU cooler: copper base, four heat pipes, 48 thin aluminium fins, a top cap and a 120 mm fan. */
export function Cooler() {
  const ctx = useScene();
  const M = getMaterials();
  const fins = useRef(null);
  const clumps = useRef(null);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    for (let i = 0; i < FINS; i++) {
      o.position.set(0, 0.025, 0.0084 + i * 0.0025);
      o.updateMatrix();
      fins.current.setMatrixAt(i, o.matrix);
    }
    fins.current.instanceMatrix.needsUpdate = true;
    // grey dust bunnies on the top cap and along the fins (shown only in the "shuts down while gaming" scenario)
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 40; i++) {
      o.position.set((rnd() - 0.5) * 0.04, 0.025 + (rnd() - 0.5) * 0.14, i < 24 ? 0.137 : 0.01 + rnd() * 0.12);
      if (i >= 24) o.position.x = rnd() > 0.5 ? 0.024 : -0.024;
      o.scale.setScalar(0.6 + rnd() * 1.1);
      o.updateMatrix();
      clumps.current.setMatrixAt(i, o.matrix);
    }
    clumps.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <Part id="cooler" position={bpos([-0.02, 0.07, 0.0066])} rotation={BOARD_ROT} labelAt={[0, 0.1, 0.07]}>
      <mesh position={[0, 0, 0.003]} material={M.copper} castShadow>
        <boxGeometry args={[0.046, 0.046, 0.006]} />
      </mesh>
      {[-0.0165, -0.0055, 0.0055, 0.0165].map((x) => (
        <mesh key={x} position={[x, 0.052, 0.0095]} material={M.copper} castShadow>
          <cylinderGeometry args={[0.0032, 0.0032, 0.125, 12]} />
        </mesh>
      ))}
      <instancedMesh ref={fins} args={[undefined, M.aluminium, FINS]} castShadow receiveShadow>
        <boxGeometry args={[0.045, 0.15, 0.0006]} />
      </instancedMesh>
      <mesh position={[0, 0.025, 0.133]} material={M.brushed} castShadow>
        <boxGeometry args={[0.047, 0.152, 0.003]} />
      </mesh>
      <mesh position={[0, 0.025, 0.1345]} material={M.cyan}>
        <boxGeometry args={[0.008, 0.1, 0.0008]} />
      </mesh>
      <group position={[-0.036, 0.025, 0.0684]} rotation={[0, Math.PI / 2, 0]}>
        <Fan size={0.12} blades={9} depth={0.024} glow="magenta" />
      </group>
      <group visible={ctx.dust}>
        <mesh position={[0, 0.025, 0.0684]} material={M.dust}>
          <boxGeometry args={[0.047, 0.152, 0.124]} />
        </mesh>
        <instancedMesh ref={clumps} args={[undefined, M.dustClump, 40]}>
          <icosahedronGeometry args={[0.0075, 1]} />
        </instancedMesh>
      </group>
    </Part>
  );
}
