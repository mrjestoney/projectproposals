"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CameraRig, HOME } from "./camera-rig";
import { SceneCtx } from "./context";
import { getMaterials, setPower } from "./materials";
import { Battery } from "./parts/battery";
import { CaseFans } from "./parts/case-fans";
import { Cables } from "./parts/cables";
import { Cooler } from "./parts/cooler";
import { Cpu } from "./parts/cpu";
import { Desk } from "./parts/desk";
import { Gpu } from "./parts/gpu";
import { Hdd } from "./parts/hdd";
import { Keyboard } from "./parts/keyboard";
import { Monitor } from "./parts/monitor";
import { Motherboard } from "./parts/motherboard";
import { Mouse } from "./parts/mouse";
import { PcCase } from "./parts/pc-case";
import { Psu } from "./parts/psu";
import { Ram } from "./parts/ram";
import { Ssd } from "./parts/ssd";

/** A soft indoor reflection environment built in code (no image download). */
function RoomEnv() {
  const get = useThree((s) => s.get);
  useEffect(() => {
    const { gl, scene, invalidate } = get();
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const tex = pmrem.fromScene(room, 0.04).texture;
    scene.environment = tex;
    scene.environmentIntensity = 0.85;
    invalidate();
    return () => {
      scene.environment = null;
      tex.dispose();
      pmrem.dispose();
    };
  }, [get]);
  return null;
}

/** While the PC is on, the fans spin, so keep drawing frames. When it is off the scene only redraws on change. */
function SpinDriver({ spin }) {
  const invalidate = useThree((s) => s.invalidate);
  useFrame(() => spin && invalidate());
  return null;
}

/** Let every solid object cast and receive shadows (glass does not). */
function Shadows() {
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const M = getMaterials();
    scene.traverse((o) => {
      if (!o.isMesh) return;
      const m = o.material;
      if (m === M.glass || m.transparent) return;
      o.castShadow = true;
      o.receiveShadow = true;
    });
    invalidate();
  }, [scene, invalidate]);
  return null;
}

/** On a tall, narrow screen (a phone held upright) widen the view so the whole desk still fits. */
function FitView() {
  const size = useThree((s) => s.size);
  const get = useThree((s) => s.get);
  useEffect(() => {
    const { camera, invalidate } = get();
    camera.fov = size.width / size.height < 1 ? 66 : 38;
    camera.updateProjectionMatrix();
    invalidate();
  }, [size, get]);
  return null;
}

function PowerSync({ powered }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    setPower(powered);
    invalidate();
  }, [powered, invalidate]);
  return null;
}

const TOWER = [0.55, 0.252, -0.05];

/**
 * The whole 3D scene: a desk with a monitor, keyboard, mouse and a PC tower with detailed internals. `ui` carries the
 * state from the page: selection, explode, open case, power, build and fix state. Only draws when something changes.
 */
export default function Scene({ ui }) {
  const [hovered, setHovered] = useState(null);
  const regs = useRef({});
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;

  const value = useMemo(
    () => ({
      mode: ui.mode,
      selected: ui.selected,
      hovered,
      hover: (id) => {
        setHovered(id);
        if (typeof document !== "undefined") document.body.style.cursor = id ? "pointer" : "auto";
      },
      pick: ui.onPick,
      explode: ui.explode,
      labels: ui.labels,
      spin: ui.powered,
      caseOpen: ui.caseOpen,
      accent: new THREE.Color(ui.accent),
      tints: ui.tints,
      tags: ui.tags,
      dust: ui.flags.dust,
      ramUnseated: ui.flags.ramUnseated,
      cablesMissing: ui.flags.cablesMissing,
      reduceMotion: ui.reduceMotion,
      partState: (id) => ui.partStates[id] ?? "placed",
      selectable: (id) => ui.selectable(id),
      register: (id, ref) => (regs.current[id] = ref),
      unregister: (id) => delete regs.current[id],
    }),
    [ui, hovered],
  );

  useEffect(() => () => void (document.body.style.cursor = "auto"), []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: HOME.pos.toArray(), fov: 38, near: 0.02, far: 12 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      onPointerMissed={() => ui.onPick(null)}
      aria-label="3D desk setup with a PC tower"
    >
      <SceneCtx.Provider value={value}>
        <RoomEnv />
        <FitView />
        <PowerSync powered={ui.powered} />
        <SpinDriver spin={ui.powered} />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[1.2, 2.0, 1.6]}
          intensity={2.1}
          castShadow
          shadow-mapSize={mobile ? [512, 512] : [1536, 1536]}
          shadow-camera-left={-1.3}
          shadow-camera-right={1.3}
          shadow-camera-top={1.3}
          shadow-camera-bottom={-0.8}
          shadow-camera-near={0.3}
          shadow-camera-far={5}
          shadow-bias={-0.0004}
          shadow-radius={4}
        />
        <directionalLight position={[-1.5, 1.0, -0.5]} intensity={0.6} />

        <Desk />
        <Monitor position={[-0.15, 0, -0.22]} />
        <Keyboard position={[-0.15, 0, 0.22]} />
        <Mouse position={[0.2, 0, 0.22]} />

        <group position={TOWER}>
          <pointLight position={[-0.03, 0.1, 0.1]} intensity={0.7} distance={0.8} color="#cfe9ff" />
          <pointLight position={[-0.03, -0.1, -0.05]} intensity={0.35} distance={0.6} color="#ffffff" />
          <PcCase />
          <Motherboard />
          <Cpu />
          <Cooler />
          <Ram />
          <Gpu />
          <Psu />
          <Ssd />
          <Hdd />
          <Battery />
          <CaseFans />
          <Cables />
        </group>

        <ContactShadows position={[0, 0.002, 0.05]} opacity={0.55} scale={2.6} blur={2.6} far={0.9} resolution={mobile ? 512 : 1024} frames={1} />
        <Shadows />
        <OrbitControls makeDefault enableDamping dampingFactor={0.09} minDistance={0.14} maxDistance={3} maxPolarAngle={1.5} target={HOME.target.toArray()} />
        <CameraRig focusId={ui.focusId} nonce={ui.nonce} regs={regs} reduceMotion={ui.reduceMotion} />
      </SceneCtx.Provider>
    </Canvas>
  );
}
