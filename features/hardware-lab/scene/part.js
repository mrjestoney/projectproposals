"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { partById } from "../data/parts";
import { useScene } from "./context";

const GOOD = new THREE.Color("#2fbf71");
const BAD = new THREE.Color("#e5484d");

/**
 * Wraps one selectable part. It handles hover and tap, the highlight (emissive tint), the explode / floating offsets
 * (smooth), the name label in explode view, and optional warning tags. position and rotation are in the parent
 * (tower) frame; children are built around the part's own origin.
 */
export function Part({ id, position = [0, 0, 0], rotation = [0, 0, 0], children, labelAt = [0, 0, 0], tag }) {
  const ctx = useScene();
  const ref = useRef(null);
  const offset = useRef(new THREE.Vector3());
  const invalidate = useThree((s) => s.invalidate);
  const info = partById(id);
  const state = ctx.partState(id); // placed | floating | hidden

  const target = useMemo(() => {
    const explode = info?.explode ?? [0, 0, 0];
    const t = new THREE.Vector3();
    if (ctx.explode) t.set(...explode);
    if (state === "floating") t.add(new THREE.Vector3(...(explode.some(Boolean) ? explode : [-0.3, 0.05, 0.1])).add(new THREE.Vector3(-0.08, 0.06, 0.14)));
    return t;
  }, [ctx.explode, state, info]);

  useEffect(() => {
    ctx.register(id, ref);
    return () => ctx.unregister(id);
  }, [ctx, id]);

  // Each part gets its own copy of the materials, so highlighting it does not tint other parts.
  useLayoutEffect(() => {
    ref.current.traverse((o) => {
      if (o.isMesh && o.material && !o.material.userData.noClone && !o.material.userData.owned) {
        o.material = o.material.clone();
        o.material.userData.owned = true;
      }
    });
  }, []);

  const tint = ctx.tints[id];
  const level = ctx.selected === id ? 0.38 : ctx.hovered === id ? 0.16 : 0;
  useEffect(() => {
    const color = tint === "good" ? GOOD : tint === "bad" ? BAD : ctx.accent;
    ref.current.traverse((o) => {
      if (!o.isMesh || !o.material?.userData.owned) return;
      const m = o.material;
      m.userData.base ??= { c: m.emissive.clone(), i: m.emissiveIntensity };
      if (level > 0 || tint) {
        m.emissive.copy(color);
        m.emissiveIntensity = Math.max(level, tint ? 0.45 : 0);
      } else {
        m.emissive.copy(m.userData.base.c);
        m.emissiveIntensity = m.userData.base.i;
      }
    });
    invalidate();
  }, [level, tint, ctx.accent, invalidate]);

  useEffect(() => invalidate(), [target, state, invalidate]);

  useFrame((_, dt) => {
    const g = ref.current;
    const v = offset.current;
    const moving = v.distanceToSquared(target) > 1e-7;
    if (moving) {
      v.lerp(target, ctx.reduceMotion ? 1 : 1 - Math.exp(-dt * 7));
      invalidate();
    } else v.copy(target);
    g.position.set(position[0] + v.x, position[1] + v.y, position[2] + v.z);
  });

  const selectable = ctx.selectable(id);
  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      visible={state !== "hidden"}
      onPointerOver={selectable ? (e) => (e.stopPropagation(), ctx.hover(id)) : undefined}
      onPointerOut={selectable ? () => ctx.hover(null) : undefined}
      onClick={selectable ? (e) => (e.stopPropagation(), ctx.pick(id)) : undefined}
    >
      {children}
      {(ctx.explode && ctx.labels && info && state !== "hidden") || tag || ctx.tags[id] ? (
        <Html position={labelAt} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          {tag || ctx.tags[id] ? (
            <span className="rounded-full bg-warning px-tight py-hair text-xs font-semibold whitespace-nowrap text-paper-ink shadow-pop">{tag ?? ctx.tags[id]}</span>
          ) : (
            <span
              className="block rounded-full bg-field px-tight py-hair text-[9px] font-semibold whitespace-nowrap text-ink shadow-pop max-md:translate-x-[var(--dx)] max-md:translate-y-[var(--dy)] md:text-xs"
              style={{ "--dx": `${info.shift?.[0] ?? 0}px`, "--dy": `${info.shift?.[1] ?? 0}px` }}
            >
              {/* Phones: a short name (the full name for the selected part); larger screens: the full name. */}
              <span className="max-md:hidden">{info.name}</span>
              <span className="md:hidden">{ctx.selected === id ? info.name.split(" (")[0] : info.short}</span>
            </span>
          )}
        </Html>
      ) : null}
    </group>
  );
}
