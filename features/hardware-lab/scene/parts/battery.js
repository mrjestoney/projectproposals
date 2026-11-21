"use client";

import { Part } from "../part";
import { getMaterials } from "../materials";
import { BOARD_ROT, bpos } from "./helpers";

/** CMOS battery: a silver coin cell in a round holder on the motherboard. */
export function Battery() {
  const M = getMaterials();
  return (
    <Part id="battery" position={bpos([0.098, -0.078, 0.0036])} rotation={BOARD_ROT} labelAt={[0, 0, 0.02]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.0016]} material={M.steel} castShadow>
        <cylinderGeometry args={[0.0125, 0.0125, 0.0036, 28]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.0043]} material={M.aluminium} castShadow>
        <cylinderGeometry args={[0.0102, 0.0102, 0.0032, 28]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.0061]} material={M.brushed}>
        <cylinderGeometry args={[0.0045, 0.0045, 0.0006, 20]} />
      </mesh>
    </Part>
  );
}
