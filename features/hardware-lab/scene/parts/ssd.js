"use client";

import { Part } from "../part";
import { getMaterials } from "../materials";
import { BOARD_ROT, bpos } from "./helpers";

/** M.2 SSD: a small stick lying on the motherboard with memory chips, a controller and a heatsink plate. */
export function Ssd() {
  const M = getMaterials();
  return (
    <Part id="ssd" position={bpos([0.012, 0.012, 0.0062])} rotation={BOARD_ROT} labelAt={[0, 0, 0.02]}>
      <mesh position={[0, 0, 0.0008]} material={M.greenBoard} castShadow>
        <boxGeometry args={[0.08, 0.022, 0.0016]} />
      </mesh>
      {[-0.026, 0.0, 0.026].map((x) => (
        <mesh key={x} position={[x, 0, 0.0027]} material={M.chip}>
          <boxGeometry args={[0.016, 0.013, 0.0013]} />
        </mesh>
      ))}
      <mesh position={[0.0, 0, 0.0042]} material={M.aluminium} castShadow>
        <boxGeometry args={[0.066, 0.0195, 0.0014]} />
      </mesh>
      <mesh position={[0.0, 0, 0.0051]} material={M.cyan}>
        <boxGeometry args={[0.03, 0.004, 0.0006]} />
      </mesh>
      <mesh position={[0.0405, 0, 0.0016]} material={M.gold}>
        <cylinderGeometry args={[0.003, 0.003, 0.0016, 12]} />
      </mesh>
    </Part>
  );
}
