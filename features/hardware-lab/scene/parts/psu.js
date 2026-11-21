"use client";

import { Part } from "../part";
import { getMaterials } from "../materials";

/** Power supply: black box with a fan grille underneath, a label on the glass side and a column of cable sockets. */
export function Psu() {
  const M = getMaterials();
  return (
    <Part id="psu" position={[0.0, -0.195, -0.115]} labelAt={[-0.1, 0, 0.07]}>
      <mesh material={M.matte} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.086, 0.14]} />
      </mesh>
      <mesh position={[-0.0755, 0, 0]} material={M.white}>
        <boxGeometry args={[0.0008, 0.05, 0.09]} />
      </mesh>
      {[0.015, 0.0, -0.015].map((y) => (
        <mesh key={y} position={[-0.0761, y, 0]} material={M.grey}>
          <boxGeometry args={[0.0004, 0.004, 0.07]} />
        </mesh>
      ))}
      {/* fan grille under the unit: three rings and eight spokes */}
      {[0.018, 0.034, 0.05].map((r) => (
        <mesh key={r} position={[0, -0.0435, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.brushed}>
          <torusGeometry args={[r, 0.0014, 6, 40]} />
        </mesh>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, -0.0435, 0]} rotation={[0, (i * Math.PI) / 4, 0]} material={M.brushed}>
          <boxGeometry args={[0.1, 0.0016, 0.0016]} />
        </mesh>
      ))}
      <mesh position={[0, -0.0436, 0]} material={M.chip}>
        <cylinderGeometry args={[0.01, 0.01, 0.002, 16]} />
      </mesh>
      {/* front: modular sockets */}
      {[-0.045, -0.015, 0.015, 0.045].map((x) => (
        <mesh key={x} position={[x, 0.012, 0.0705]} material={M.chip}>
          <boxGeometry args={[0.024, 0.018, 0.002]} />
        </mesh>
      ))}
      {/* rear: switch and socket */}
      <mesh position={[0.03, 0, -0.0705]} material={M.chip}>
        <boxGeometry args={[0.04, 0.026, 0.002]} />
      </mesh>
      <mesh position={[-0.03, 0.01, -0.0705]} material={M.red}>
        <boxGeometry args={[0.012, 0.008, 0.003]} />
      </mesh>
    </Part>
  );
}
