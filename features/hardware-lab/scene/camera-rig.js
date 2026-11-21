"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { partById } from "../data/parts";

export const HOME = { pos: new THREE.Vector3(-0.78, 0.54, 1.42), target: new THREE.Vector3(0.1, 0.25, 0) };
const EXPLODE_VIEW = { pos: new THREE.Vector3(-0.55, 0.62, 1.55), target: new THREE.Vector3(0.28, 0.27, 0.02) };
// Where the camera stands, as a direction from the part: inside parts are seen through the glass side.
const DIR_INSIDE = new THREE.Vector3(-0.85, 0.28, 0.55).normalize();
const DIR_FRONT = new THREE.Vector3(-0.2, 0.25, 1).normalize();
const box = new THREE.Box3();
const dir = new THREE.Vector3();
const center = new THREE.Vector3();

/**
 * Moves the camera smoothly to look at the focused part (or back home). Dragging cancels the move. With reduced
 * motion the camera jumps. Needs OrbitControls registered as the default controls.
 */
export function CameraRig({ focusId, nonce, regs, reduceMotion }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const invalidate = useThree((s) => s.invalidate);
  const size = useThree((s) => s.size);
  const goal = useRef(null);

  useEffect(() => {
    if (!controls) return;
    const stop = () => (goal.current = null);
    controls.addEventListener("start", stop);
    return () => controls.removeEventListener("start", stop);
  }, [controls]);

  useEffect(() => {
    if (!controls) return;
    // On a tall, narrow screen the camera stands a little closer, so the scene is not tiny.
    const k = size.width / size.height < 1 ? 0.8 : 1;
    const at = (v) => ({ pos: v.target.clone().add(v.pos.clone().sub(v.target).multiplyScalar(k)), target: v.target.clone() });
    if (!focusId) {
      goal.current = at(HOME);
    } else if (focusId === "__explode") {
      goal.current = at(EXPLODE_VIEW);
    } else {
      const g = regs.current[focusId]?.current;
      if (!g) return;
      box.setFromObject(g);
      box.getCenter(center);
      const info = partById(focusId);
      dir.copy(info?.group === "Outside" ? DIR_FRONT : DIR_INSIDE);
      const dist = info?.dist ?? 0.6;
      goal.current = { pos: center.clone().addScaledVector(dir, dist), target: center.clone() };
    }
    if (reduceMotion && goal.current) {
      camera.position.copy(goal.current.pos);
      controls.target.copy(goal.current.target);
      controls.update();
      goal.current = null;
    }
    invalidate();
  }, [focusId, nonce]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, dt) => {
    const g = goal.current;
    if (!g || !controls) return;
    const k = 1 - Math.exp(-dt * 5);
    camera.position.lerp(g.pos, k);
    controls.target.lerp(g.target, k);
    controls.update();
    if (camera.position.distanceToSquared(g.pos) < 1e-6 && controls.target.distanceToSquared(g.target) < 1e-6) goal.current = null;
    invalidate();
  });
  return null;
}
