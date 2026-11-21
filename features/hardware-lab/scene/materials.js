import * as THREE from "three";

// Shared PBR materials. Colours here are physical material colours (metal, plastic, glass...), not UI colours.
// Materials with userData.noClone are shared by every part (glass and glowing things); all others are cloned per
// part so that highlighting one part never tints another.

let cache = null;

function makeTraceTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#0e1215";
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "#1b2329";
  g.lineWidth = 2;
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 90; i++) {
    let x = rnd() * 512;
    let y = rnd() * 512;
    g.beginPath();
    g.moveTo(x, y);
    for (let k = 0; k < 4; k++) {
      if (rnd() > 0.5) x += (rnd() - 0.5) * 220;
      else y += (rnd() - 0.5) * 220;
      g.lineTo(x, y);
    }
    g.stroke();
  }
  g.fillStyle = "#2a343b";
  for (let i = 0; i < 160; i++) g.fillRect(rnd() * 512, rnd() * 512, 3, 3);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

function makeWallpaper() {
  const c = document.createElement("canvas");
  c.width = 1280;
  c.height = 720;
  const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, 1280, 720);
  grad.addColorStop(0, "#0b1f3a");
  grad.addColorStop(0.55, "#16647c");
  grad.addColorStop(1, "#6fd1c2");
  g.fillStyle = grad;
  g.fillRect(0, 0, 1280, 720);
  g.fillStyle = "rgba(255,255,255,0.07)";
  for (const [x, y, r] of [[300, 200, 260], [980, 160, 180], [760, 520, 320]]) {
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  // a window and a taskbar, so it reads as a working desktop
  g.fillStyle = "rgba(245,247,250,0.94)";
  g.fillRect(250, 150, 560, 340);
  g.fillStyle = "#2b6cb0";
  g.fillRect(250, 150, 560, 38);
  g.fillStyle = "#cfd8e3";
  for (let i = 0; i < 7; i++) g.fillRect(280, 215 + i * 36, 300 + ((i * 97) % 200), 12);
  g.fillStyle = "rgba(10,14,20,0.85)";
  g.fillRect(0, 680, 1280, 40);
  g.fillStyle = "#6fd1c2";
  g.fillRect(14, 690, 24, 20);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function getMaterials() {
  if (cache) return cache;
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const glow = (color) => {
    const m = std({ color: "#101214", emissive: color, emissiveIntensity: 0, roughness: 0.4 });
    m.userData.noClone = true;
    return m;
  };
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#7f96a6", metalness: 0, roughness: 0.04, transparent: true, opacity: 0.12,
    side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.6, clearcoat: 1,
  });
  glass.userData.noClone = true;
  const screenGlass = std({ color: "#0a0c0f", roughness: 0.08, metalness: 0.1 });
  const screen = std({ color: "#000000", emissive: "#ffffff", emissiveMap: makeWallpaper(), emissiveIntensity: 0, roughness: 0.15 });
  screen.userData.noClone = true;
  const pcb = std({ color: "#ffffff", map: makeTraceTexture(), roughness: 0.5, metalness: 0.15 });
  pcb.map.repeat.set(2, 2);
  cache = {
    aluminium: std({ color: "#c3c7cc", metalness: 1, roughness: 0.32 }),
    brushed: std({ color: "#8e949b", metalness: 1, roughness: 0.5 }),
    steel: std({ color: "#33373c", metalness: 0.9, roughness: 0.42 }),
    darkMetal: std({ color: "#15171a", metalness: 0.85, roughness: 0.45 }),
    gold: std({ color: "#d9b44a", metalness: 1, roughness: 0.25 }),
    copper: std({ color: "#c27a44", metalness: 1, roughness: 0.28 }),
    matte: std({ color: "#1a1c20", roughness: 0.78 }),
    gloss: std({ color: "#0b0c0e", roughness: 0.2, metalness: 0.1 }),
    grey: std({ color: "#4a4e55", roughness: 0.6 }),
    white: std({ color: "#e8eaed", roughness: 0.6 }),
    pcb,
    chip: std({ color: "#08090a", roughness: 0.35, metalness: 0.2 }),
    keycap: std({ color: "#2c3037", roughness: 0.55 }),
    greenBoard: std({ color: "#1f6b3a", roughness: 0.5, metalness: 0.1 }),
    rubber: std({ color: "#0e0f11", roughness: 0.95 }),
    wood: std({ color: "#94714f", roughness: 0.6 }),
    floor: std({ color: "#4a4f57", roughness: 0.9 }),
    dust: new THREE.MeshStandardMaterial({ color: "#6e675d", roughness: 1, transparent: true, opacity: 0.5, depthWrite: false }),
    dustClump: std({ color: "#9b958a", roughness: 1 }),
    glass,
    screenGlass,
    screen,
    cyan: glow("#27d3ff"),
    magenta: glow("#ff3fb4"),
    green: glow("#33ff77"),
    red: glow("#ff3b3b"),
  };
  return cache;
}

/** Turn the glowing materials (fans, LEDs, screen) on or off. */
export function setPower(on) {
  const m = getMaterials();
  for (const k of ["cyan", "magenta", "green", "red"]) m[k].emissiveIntensity = on ? 2.2 : 0;
  m.screen.emissiveIntensity = on ? 1 : 0;
}
