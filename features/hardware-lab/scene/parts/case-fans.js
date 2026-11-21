"use client";

import { Part } from "../part";
import { Fan } from "./fan";

/** Three 120 mm case fans: two intake fans behind the front panel and one exhaust fan at the rear. */
export function CaseFans() {
  return (
    <Part id="fans" labelAt={[0, 0.07, 0.2]}>
      <group position={[0.0, 0.12, 0.196]}>
        <Fan size={0.12} blades={9} depth={0.025} glow="cyan" />
      </group>
      <group position={[0.0, -0.02, 0.196]}>
        <Fan size={0.12} blades={9} depth={0.025} glow="cyan" />
      </group>
      <group position={[0.0, 0.14, -0.2]} rotation={[0, Math.PI, 0]}>
        <Fan size={0.12} blades={7} depth={0.025} glow="magenta" />
      </group>
    </Part>
  );
}
