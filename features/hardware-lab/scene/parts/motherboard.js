"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { Part } from "../part";
import { getMaterials } from "../materials";
import { BOARD_ROT, bpos } from "./helpers";

// Board frame: x across the board (the rear I/O side is -x), y up the board, z out of the board towards the glass.
function B({ s, p, m, cast = true }) {
  return (
    <mesh position={p} material={m} castShadow={cast} receiveShadow>
      <boxGeometry args={s} />
    </mesh>
  );
}

function Capacitors() {
  const M = getMaterials();
  const ref = useRef(null);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    let i = 0;
    for (const [x0, y0, nx, ny] of [[-0.104, 0.105, 1, 8], [-0.094, 0.14, 7, 1]]) {
      for (let a = 0; a < nx; a++)
        for (let b = 0; b < ny; b++) {
          o.position.set(x0 + a * 0.013, y0 + b * 0.0125, 0.0066);
          o.updateMatrix();
          ref.current.setMatrixAt(i++, o.matrix);
        }
    }
    ref.current.count = i;
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, M.aluminium, 16]} castShadow>
      <cylinderGeometry args={[0.0042, 0.0042, 0.0095, 14]} />
    </instancedMesh>
  );
}

/** The motherboard: PCB, CPU socket, RAM slots, PCIe slots, M.2 slot, VRM and chipset heatsinks, ports, connectors. */
export function Motherboard() {
  const M = getMaterials();
  return (
    <Part id="motherboard" position={bpos([0, 0, 0])} rotation={BOARD_ROT} labelAt={[0, -0.16, 0.02]}>
      <B s={[0.244, 0.305, 0.0016]} p={[0, 0, 0.0008]} m={M.pcb} />
      {/* rear I/O cover and ports */}
      <B s={[0.05, 0.1, 0.03]} p={[-0.097, 0.088, 0.016]} m={M.matte} />
      <B s={[0.006, 0.1, 0.03]} p={[-0.12, 0.088, 0.016]} m={M.brushed} cast={false} />
      {[0.055, 0.075, 0.095, 0.115, 0.135].map((y, i) => (
        <B key={y} s={[0.004, 0.012, 0.012]} p={[-0.1225, y, 0.016]} m={i % 3 === 0 ? M.cyan : M.chip} cast={false} />
      ))}
      {/* CPU socket with retention frame */}
      <B s={[0.05, 0.05, 0.003]} p={[-0.02, 0.07, 0.0031]} m={M.steel} />
      {/* VRM heatsinks (left of and above the CPU) with fins */}
      {[[-0.071, 0.07, 0.026, 0.078], [-0.02, 0.124, 0.075, 0.026]].map(([x, y, sx, sy]) => (
        <group key={x}>
          <B s={[sx, sy, 0.012]} p={[x, y, 0.0075]} m={M.aluminium} />
          {Array.from({ length: 5 }).map((_, i) => (
            <B key={i} s={[sx > sy ? 0.0016 : sx, sx > sy ? sy : 0.0016, 0.0125]} p={[sx > sy ? x - sx / 2 + (i + 0.5) * (sx / 5) : x, sx > sy ? y : y - sy / 2 + (i + 0.5) * (sy / 5), 0.0075]} m={M.chip} cast={false} />
          ))}
        </group>
      ))}
      <Capacitors />
      {/* four RAM slots and their latches */}
      {[0.062, 0.078, 0.094, 0.11].map((x) => (
        <group key={x}>
          <B s={[0.0075, 0.133, 0.0085]} p={[x, 0.07, 0.0059]} m={M.matte} />
          <B s={[0.0075, 0.007, 0.012]} p={[x, 0.139, 0.0075]} m={M.grey} cast={false} />
        </group>
      ))}
      {/* PCIe slots with steel reinforcement */}
      <B s={[0.092, 0.0075, 0.0085]} p={[-0.024, -0.045, 0.0059]} m={M.matte} />
      <B s={[0.098, 0.0016, 0.0092]} p={[-0.024, -0.0505, 0.0062]} m={M.steel} cast={false} />
      <B s={[0.03, 0.0075, 0.0085]} p={[-0.055, -0.118, 0.0059]} m={M.matte} />
      {/* M.2 slot, chipset heatsink */}
      <B s={[0.014, 0.012, 0.0035]} p={[0.057, 0.012, 0.0035]} m={M.matte} cast={false} />
      <B s={[0.042, 0.042, 0.012]} p={[0.058, -0.118, 0.0075]} m={M.darkMetal} />
      <B s={[0.03, 0.004, 0.0125]} p={[0.058, -0.118, 0.0075]} m={M.cyan} cast={false} />
      {/* power connectors: 24-pin (right edge) and 8-pin CPU power (top) */}
      <B s={[0.012, 0.052, 0.013]} p={[0.114, 0.045, 0.0075]} m={M.chip} />
      <B s={[0.03, 0.01, 0.012]} p={[-0.05, 0.146, 0.0075]} m={M.chip} />
      {/* SATA ports, fan headers, screws */}
      {[0, 1, 2, 3].map((i) => (
        <B key={i} s={[0.014, 0.008, 0.0075]} p={[0.108, -0.11 + i * 0.011, 0.0055]} m={M.chip} cast={false} />
      ))}
      {[[-0.1, -0.14], [0.0, -0.14], [0.1, -0.146], [-0.1, 0.0], [0.11, 0.14], [-0.11, 0.145]].map(([x, y]) => (
        <mesh key={`${x}${y}`} position={[x, y, 0.0026]} rotation={[Math.PI / 2, 0, 0]} material={M.gold}>
          <cylinderGeometry args={[0.0042, 0.0042, 0.0016, 12]} />
        </mesh>
      ))}
    </Part>
  );
}
