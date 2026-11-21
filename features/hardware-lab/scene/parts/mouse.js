"use client";

import { Part } from "../part";
import { getMaterials } from "../materials";

/** Mouse: a smooth glossy body, two buttons, a scroll wheel and a light strip. It points away from you. */
export function Mouse({ position = [0, 0, 0] }) {
  const M = getMaterials();
  return (
    <Part id="mouse" position={position} labelAt={[0, 0.05, 0]}>
      <mesh scale={[0.033, 0.021, 0.058]} position={[0, 0.0015, 0]} material={M.gloss} castShadow receiveShadow>
        <sphereGeometry args={[1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh position={[0, 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.033, 0.058, 1]} material={M.matte}>
        <circleGeometry args={[1, 40]} />
      </mesh>
      <mesh position={[0, 0.0195, -0.022]} material={M.chip}>
        <boxGeometry args={[0.0012, 0.0016, 0.04]} />
      </mesh>
      <mesh position={[0, 0.0207, -0.026]} rotation={[0, 0, Math.PI / 2]} material={M.rubber}>
        <cylinderGeometry args={[0.0055, 0.0055, 0.0045, 16]} />
      </mesh>
      <mesh position={[0, 0.0115, 0.0555]} rotation={[0.55, 0, 0]} material={M.cyan}>
        <boxGeometry args={[0.02, 0.0022, 0.0012]} />
      </mesh>
    </Part>
  );
}
