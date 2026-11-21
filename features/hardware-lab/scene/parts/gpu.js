"use client";

import { RoundedBox } from "@react-three/drei";
import { Part } from "../part";
import { getMaterials } from "../materials";
import { Fan } from "./fan";
import { BOARD_ROT, bpos } from "./helpers";

// Card frame (inside the board frame): x = length (the rear I/O bracket is at -x), y = thickness (fans face -y),
// z = height (up from the PCIe slot, towards the glass).

/** Graphics card: dark shroud, two fans, backplate with a light strip, PCIe bracket, gold contacts, power plug. */
export function Gpu() {
  const M = getMaterials();
  return (
    <Part id="gpu" position={bpos([0.026, -0.045, 0.0575])} rotation={BOARD_ROT} labelAt={[0, -0.04, 0.06]}>
      <mesh material={M.pcb} castShadow>
        <boxGeometry args={[0.28, 0.0016, 0.1]} />
      </mesh>
      <RoundedBox args={[0.29, 0.034, 0.108]} radius={0.005} smoothness={3} position={[0, -0.0185, 0]} material={M.matte} castShadow receiveShadow />
      <mesh position={[0, 0.0222, 0]} material={M.brushed} castShadow>
        <boxGeometry args={[0.29, 0.0028, 0.108]} />
      </mesh>
      <mesh position={[0, 0.0238, 0.052]} material={M.cyan}>
        <boxGeometry args={[0.12, 0.0016, 0.003]} />
      </mesh>
      {[-0.062, 0.062].map((x) => (
        <group key={x} position={[x, -0.0365, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh position={[0, 0, 0.0008]} material={M.chip}>
            <cylinderGeometry args={[0.046, 0.046, 0.002, 36]} />
          </mesh>
          <Fan size={0.092} blades={11} depth={0.006} glow="cyan" frame={false} />
        </group>
      ))}
      <mesh position={[-0.1455, 0, 0]} material={M.brushed} castShadow>
        <boxGeometry args={[0.0015, 0.044, 0.118]} />
      </mesh>
      {[-0.036, -0.012, 0.012, 0.036].map((z) => (
        <mesh key={z} position={[-0.1462, -0.006, z]} material={M.chip}>
          <boxGeometry args={[0.0014, 0.01, 0.016]} />
        </mesh>
      ))}
      <mesh position={[-0.05, 0, -0.0525]} material={M.gold}>
        <boxGeometry args={[0.092, 0.0014, 0.0085]} />
      </mesh>
      <mesh position={[0.118, 0.008, 0.0535]} material={M.chip} castShadow>
        <boxGeometry args={[0.04, 0.016, 0.014]} />
      </mesh>
    </Part>
  );
}
