"use client";

import { RoundedBox } from "@react-three/drei";
import { Part } from "../part";
import { getMaterials } from "../materials";

/** 27-inch monitor: thin bezel, glossy screen showing a desktop when the PC is on, slim neck and a flat metal base. */
export function Monitor({ position = [0, 0, 0] }) {
  const M = getMaterials();
  return (
    <Part id="monitor" position={position} labelAt={[0, 0.5, 0.02]}>
      <RoundedBox args={[0.62, 0.37, 0.02]} radius={0.006} smoothness={3} position={[0, 0.315, -0.005]} material={M.matte} castShadow receiveShadow />
      <mesh position={[0, 0.315, 0.0052]} material={M.gloss}>
        <boxGeometry args={[0.62, 0.37, 0.001]} />
      </mesh>
      <mesh position={[0, 0.322, 0.0063]} material={M.screen}>
        <planeGeometry args={[0.604, 0.34]} />
      </mesh>
      <mesh position={[0, 0.1, -0.034]} material={M.steel} castShadow>
        <boxGeometry args={[0.05, 0.2, 0.02]} />
      </mesh>
      <mesh position={[0, 0.19, -0.02]} material={M.darkMetal} castShadow>
        <boxGeometry args={[0.07, 0.07, 0.03]} />
      </mesh>
      <RoundedBox args={[0.3, 0.012, 0.2]} radius={0.005} smoothness={3} position={[0, 0.006, -0.01]} material={M.aluminium} castShadow receiveShadow />
      <mesh position={[0, 0.133, 0.0058]} material={M.cyan}>
        <circleGeometry args={[0.0022, 12]} />
      </mesh>
    </Part>
  );
}
