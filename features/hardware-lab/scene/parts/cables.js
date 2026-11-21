"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Part } from "../part";
import { useScene } from "../context";
import { getMaterials } from "../materials";

const path = (pts) => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.4);

// Sleeved cables from the power supply to the motherboard (24-pin and 8-pin) and to the graphics card (8-pin).
const ROUTES = [
  { pts: [[0.04, -0.17, -0.045], [0.075, -0.15, 0.12], [0.08, 0.0, 0.14], [0.066, 0.09, 0.1]], r: 0.0065 },
  { pts: [[-0.01, -0.17, -0.04], [-0.04, -0.15, 0.14], [-0.052, -0.05, 0.15], [-0.0455, 0.012, 0.131]], r: 0.0055 },
  { pts: [[0.06, -0.15, -0.1], [0.09, 0.0, -0.19], [0.09, 0.19, -0.19], [0.062, 0.195, -0.066]], r: 0.0055 },
];

/** The power cable bundle (hidden in Fix scenario 3, where the main power cable is missing). */
export function Cables() {
  const ctx = useScene();
  const M = getMaterials();
  const tubes = useMemo(() => ROUTES.map((r) => new THREE.TubeGeometry(path(r.pts), 48, r.r, 10, false)), []);
  return (
    <Part id="cables" labelAt={[0.07, -0.1, 0.14]} tag={ctx.cablesMissing ? "Main power cable unplugged" : undefined}>
      <group visible={!ctx.cablesMissing}>
        {tubes.map((g, i) => (
          <mesh key={i} geometry={g} material={M.rubber} castShadow />
        ))}
        {ROUTES.map((r, i) => {
          const e = r.pts.at(-1);
          return (
            <mesh key={i} position={e} material={M.chip}>
              <boxGeometry args={[0.012, 0.012, 0.012]} />
            </mesh>
          );
        })}
      </group>
    </Part>
  );
}
