"use client";

import { useLayoutEffect, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Part } from "../part";
import { useScene } from "../context";
import { getMaterials } from "../materials";

export const CASE = { w: 0.22, h: 0.48, d: 0.46 };

function Box({ s, p = [0, 0, 0], m, cast = true }) {
  return (
    <mesh position={p} material={m} castShadow={cast} receiveShadow>
      <boxGeometry args={s} />
    </mesh>
  );
}

/** Slots in the front intake: a column of thin dark bars. */
function FrontMesh() {
  const M = getMaterials();
  const ref = useRef(null);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    for (let i = 0; i < 36; i++) {
      o.position.set(0, -0.2 + i * 0.0115, 0);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return <instancedMesh ref={ref} args={[undefined, M.chip, 36]} position={[0.0, 0, 0.0068]}><boxGeometry args={[0.17, 0.0045, 0.002]} /></instancedMesh>;
}

/**
 * The tower case: solid steel right side, floor, top with vents, front panel (mesh, power button with LED, USB),
 * rear panel (I/O shield, slot covers, fan opening) and a tempered-glass left panel on a hinge that swings open.
 */
export function PcCase() {
  const ctx = useScene();
  const M = getMaterials();
  const { w, h, d } = CASE;
  const door = useRef(null);
  const open = useRef(0);
  const invalidate = useThree((s) => s.invalidate);

  useFrame((_, dt) => {
    const t = ctx.caseOpen ? 1 : 0;
    if (Math.abs(open.current - t) > 0.001) {
      open.current = ctx.reduceMotion ? t : THREE.MathUtils.damp(open.current, t, 5, dt);
      invalidate();
    } else open.current = t;
    if (door.current) door.current.rotation.y = -open.current * 1.95;
  });

  return (
    <Part id="case" labelAt={[0.0, 0.27, 0.0]}>
      {/* steel body */}
      <Box s={[0.004, h, d]} p={[w / 2 - 0.002, 0, 0]} m={M.matte} />
      <Box s={[0.1, 0.002, d - 0.03]} p={[0.0, -h / 2 + 0.001, 0]} m={M.matte} />
      <Box s={[w, 0.004, d]} p={[0, -h / 2 + 0.002, 0]} m={M.matte} />
      <Box s={[w, 0.004, d]} p={[0, h / 2 - 0.002, 0]} m={M.matte} />
      <Box s={[0.12, 0.0015, 0.28]} p={[0, h / 2 - 0.0045, -0.05]} m={M.chip} cast={false} />
      <Box s={[w, h, 0.004]} p={[0, 0, -d / 2 + 0.002]} m={M.matte} />
      {/* motherboard tray */}
      <Box s={[0.003, h - 0.02, d - 0.05]} p={[w / 2 - 0.0075, 0, -0.01]} m={M.darkMetal} />
      {/* feet */}
      {[[-0.085, -0.19], [0.085, -0.19], [-0.085, 0.19], [0.085, 0.19]].map(([x, z]) => (
        <Box key={`${x}${z}`} s={[0.03, 0.012, 0.03]} p={[x, -h / 2 - 0.006, z]} m={M.rubber} />
      ))}

      {/* front panel */}
      <RoundedBox args={[w, h, 0.016]} radius={0.004} smoothness={3} position={[0, 0, d / 2 - 0.004]} material={M.gloss} castShadow receiveShadow />
      <group position={[0, -0.02, d / 2 + 0.0]}>
        <FrontMesh />
      </group>
      <mesh position={[0.0, h / 2 - 0.028, d / 2 + 0.0045]} rotation={[Math.PI / 2, 0, 0]} material={M.aluminium}>
        <cylinderGeometry args={[0.0095, 0.0095, 0.004, 28]} />
      </mesh>
      <mesh position={[0.0, h / 2 - 0.028, d / 2 + 0.0068]}>
        <torusGeometry args={[0.0062, 0.0011, 8, 28]} />
        <primitive object={M.green} attach="material" />
      </mesh>
      <Box s={[0.012, 0.005, 0.003]} p={[-0.05, h / 2 - 0.028, d / 2 + 0.0045]} m={M.chip} cast={false} />
      <Box s={[0.012, 0.005, 0.003]} p={[-0.032, h / 2 - 0.028, d / 2 + 0.0045]} m={M.chip} cast={false} />
      <mesh position={[0.05, h / 2 - 0.028, d / 2 + 0.0045]} rotation={[Math.PI / 2, 0, 0]} material={M.chip}>
        <cylinderGeometry args={[0.0035, 0.0035, 0.003, 14]} />
      </mesh>

      {/* rear I/O shield, slot covers and PSU opening */}
      <Box s={[0.0035, 0.1, 0.045]} p={[0.0, 0.0, 0]} m={M.brushed} cast={false} />
      <group position={[0.0, 0.12, -d / 2 - 0.0005]}>
        <Box s={[0.1, 0.075, 0.003]} p={[0.0, 0.0, 0]} m={M.brushed} cast={false} />
        {[-0.036, -0.018, 0.0, 0.018].map((x, i) => (
          <Box key={x} s={[0.012, 0.008, 0.004]} p={[x, 0.022 - (i % 2) * 0.012, -0.002]} m={i % 2 ? M.cyan : M.chip} cast={false} />
        ))}
        <mesh position={[0.036, 0.0, -0.002]} rotation={[Math.PI / 2, 0, 0]} material={M.green}>
          <cylinderGeometry args={[0.003, 0.003, 0.004, 10]} />
        </mesh>
      </group>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Box key={i} s={[0.1, 0.0045, 0.003]} p={[0.0, -0.002 - i * 0.0085, -d / 2 - 0.0005]} m={M.chip} cast={false} />
      ))}
      <Box s={[0.15, 0.086, 0.003]} p={[0.0, -0.195, -d / 2 - 0.0005]} m={M.chip} cast={false} />

      {/* tempered-glass side panel, hinged at the rear edge */}
      <group ref={door} position={[-w / 2 + 0.002, 0, -d / 2 + 0.006]}>
        <mesh position={[0, 0, (d - 0.012) / 2]} material={M.glass} raycast={() => null}>
          <boxGeometry args={[0.004, h - 0.01, d - 0.012]} />
        </mesh>
        {[[0, (h - 0.01) / 2, d - 0.012, 0.008, 0], [0, -(h - 0.01) / 2, d - 0.012, 0.008, 0]].map(([x, y, len]) => (
          <Box key={y} s={[0.006, 0.01, len]} p={[x, y, len / 2]} m={M.matte} cast={false} />
        ))}
        <Box s={[0.006, h - 0.01, 0.01]} p={[0, 0, 0.005]} m={M.matte} cast={false} />
        <Box s={[0.006, h - 0.01, 0.01]} p={[0, 0, d - 0.017]} m={M.matte} cast={false} />
        {[[0.2, 0.21], [-0.2, 0.21], [0.2, 0.43], [-0.2, 0.43]].map(([y, z]) => (
          <mesh key={`${y}${z}`} position={[-0.004, y, z]} rotation={[0, 0, Math.PI / 2]} material={M.aluminium}>
            <cylinderGeometry args={[0.0045, 0.0045, 0.004, 14]} />
          </mesh>
        ))}
      </group>
    </Part>
  );
}
