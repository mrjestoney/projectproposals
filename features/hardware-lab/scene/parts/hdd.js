"use client";

import { Part } from "../part";
import { getMaterials } from "../materials";

/** 3.5" hard drive standing in a drive bay near the front: metal case with a label, circuit board and connectors. */
export function Hdd() {
  const M = getMaterials();
  return (
    <Part id="hdd" position={[0.028, -0.105, 0.105]} labelAt={[0, 0.07, 0]}>
      <mesh material={M.aluminium} castShadow receiveShadow>
        <boxGeometry args={[0.026, 0.1, 0.147]} />
      </mesh>
      <mesh position={[-0.0132, 0.0, 0.0]} material={M.white}>
        <boxGeometry args={[0.0004, 0.07, 0.11]} />
      </mesh>
      <mesh position={[-0.0136, 0.02, 0.0]} material={M.cyan}>
        <boxGeometry args={[0.0004, 0.008, 0.07]} />
      </mesh>
      <mesh position={[0.0138, 0.0, 0.0]} material={M.greenBoard}>
        <boxGeometry args={[0.0014, 0.09, 0.13]} />
      </mesh>
      <mesh position={[0.012, 0.0, -0.0745]} material={M.chip}>
        <boxGeometry args={[0.014, 0.05, 0.003]} />
      </mesh>
      {[-0.0, 0.032].map((y) => (
        <mesh key={y} position={[0.0, y - 0.016, -0.0752]} material={M.gold}>
          <boxGeometry args={[0.008, 0.012, 0.002]} />
        </mesh>
      ))}
      {[[-0.05, -0.06], [0.05, -0.06], [-0.05, 0.06], [0.05, 0.06]].map(([y, z]) => (
        <mesh key={`${y}${z}`} position={[-0.0135, y, z]} rotation={[0, 0, Math.PI / 2]} material={M.steel}>
          <cylinderGeometry args={[0.003, 0.003, 0.002, 10]} />
        </mesh>
      ))}
      {/* the drive bay: two steel rails */}
      {[-0.054, 0.054].map((y) => (
        <mesh key={y} position={[0.0, y - 0.003, 0.0]} material={M.steel} castShadow>
          <boxGeometry args={[0.032, 0.004, 0.16]} />
        </mesh>
      ))}
    </Part>
  );
}
