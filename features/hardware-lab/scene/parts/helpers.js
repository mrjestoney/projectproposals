import * as THREE from "three";

/** Board frame -> tower frame. The motherboard lies against the right wall, its parts facing the glass side. */
export const BOARD_ORIGIN = [0.066, 0.045, -0.015];
export const bpos = ([x, y, z]) => [BOARD_ORIGIN[0] - z, BOARD_ORIGIN[1] + y, BOARD_ORIGIN[2] + x];
export const BOARD_ROT = [0, -Math.PI / 2, 0];

/** A rectangle with a round hole, extruded: used for fan frames. */
export function frameGeometry(size, holeR, depth) {
  const s = new THREE.Shape();
  const h = size / 2;
  s.moveTo(-h, -h);
  s.lineTo(h, -h);
  s.lineTo(h, h);
  s.lineTo(-h, h);
  s.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, holeR, 0, Math.PI * 2, true);
  s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 32 });
  g.translate(0, 0, -depth / 2);
  return g;
}

/** One fan blade: a curved paddle from the hub to the tip. */
export function bladeGeometry(r0, r1) {
  const s = new THREE.Shape();
  const w0 = r0 * 0.5;
  const w1 = (r1 - r0) * 0.55;
  s.moveTo(r0, -w0 * 0.3);
  s.quadraticCurveTo((r0 + r1) / 2, -w1 * 0.2, r1, -w1 * 0.9);
  s.quadraticCurveTo(r1 * 1.02, w1 * 0.5, (r0 + r1) / 2, w1 * 0.7);
  s.quadraticCurveTo(r0 * 1.2, w0 * 0.6, r0, w0 * 0.3);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.0015, bevelEnabled: false, curveSegments: 10 });
  return g;
}
