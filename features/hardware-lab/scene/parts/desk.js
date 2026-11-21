"use client";

import { RoundedBox } from "@react-three/drei";
import { getMaterials } from "../materials";

/** The desk top (a plinth for the whole setup) and a desk mat under the keyboard and mouse. Not selectable. */
export function Desk() {
  const M = getMaterials();
  return (
    <group>
      <RoundedBox args={[1.9, 0.05, 0.9]} radius={0.012} smoothness={3} position={[0, -0.025, 0.02]} material={M.wood} receiveShadow castShadow raycast={() => null} />
      <RoundedBox args={[0.8, 0.003, 0.36]} radius={0.002} smoothness={2} position={[-0.02, 0.0016, 0.24]} material={M.rubber} receiveShadow raycast={() => null} />
      <mesh position={[-0.02, 0.0034, 0.065]} material={M.cyan} raycast={() => null}>
        <boxGeometry args={[0.8, 0.0006, 0.002]} />
      </mesh>
    </group>
  );
}
