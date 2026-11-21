"use client";

import { Part } from "../part";
import { getMaterials } from "../materials";
import { BOARD_ROT, bpos } from "./helpers";

/** The processor: green substrate with a nickel heat spreader. It sits in the socket, under the cooler. */
export function Cpu() {
  const M = getMaterials();
  return (
    <Part id="cpu" position={bpos([-0.02, 0.07, 0.0047])} rotation={BOARD_ROT} labelAt={[0, 0, 0.01]}>
      <mesh position={[0, 0, 0.0008]} material={M.greenBoard} castShadow>
        <boxGeometry args={[0.045, 0.045, 0.0016]} />
      </mesh>
      <mesh position={[0, 0, 0.0036]} material={M.aluminium} castShadow>
        <boxGeometry args={[0.036, 0.036, 0.0034]} />
      </mesh>
      {[[-0.021, -0.021], [0.021, -0.021], [0.021, 0.021]].map(([x, y]) => (
        <mesh key={`${x}${y}`} position={[x, y, 0.0017]} material={M.gold}>
          <boxGeometry args={[0.002, 0.002, 0.0006]} />
        </mesh>
      ))}
    </Part>
  );
}
