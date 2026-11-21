"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "../context";
import { getMaterials } from "../materials";
import { bladeGeometry, frameGeometry } from "./helpers";

/**
 * A computer fan looking along +z: square frame with a round opening, hub, curved blades (instanced), and a glowing
 * RGB ring that lights up when the PC is on. Spins when the PC is on. size = frame width in metres.
 */
export function Fan({ size = 0.12, blades = 9, depth = 0.025, glow = "cyan", frame = true }) {
  const ctx = useScene();
  const M = getMaterials();
  const spin = useRef(null);
  const inst = useRef(null);
  const holeR = size * 0.46;
  const frameGeo = useMemo(() => frameGeometry(size, holeR, depth), [size, holeR, depth]);
  const bladeGeo = useMemo(() => bladeGeometry(size * 0.1, holeR * 0.97), [size, holeR]);

  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    for (let i = 0; i < blades; i++) {
      o.rotation.set(0, 0, 0);
      o.rotateZ((i / blades) * Math.PI * 2);
      o.rotateX(0.5);
      o.position.set(0, 0, -0.0008);
      o.updateMatrix();
      inst.current.setMatrixAt(i, o.matrix);
    }
    inst.current.instanceMatrix.needsUpdate = true;
  }, [blades]);

  useFrame((_, dt) => {
    if (ctx.spin && spin.current) spin.current.rotation.z -= dt * (ctx.reduceMotion ? 3 : 16);
  });

  return (
    <group>
      {frame ? <mesh geometry={frameGeo} material={M.matte} castShadow /> : null}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[holeR * 1.01, size * 0.013, 8, 48]} />
        <primitive object={M[glow]} attach="material" />
      </mesh>
      <group ref={spin}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={M.gloss}>
          <cylinderGeometry args={[size * 0.1, size * 0.1, depth * 0.8, 24]} />
        </mesh>
        <instancedMesh ref={inst} args={[bladeGeo, M.gloss, blades]} castShadow />
      </group>
    </group>
  );
}
