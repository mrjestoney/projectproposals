// Which parts of the scene come from where. Every part is its own component in scene/parts/, so any one of them can
// be replaced by a real GLB model later without touching the others.
//
// In T6 no third-party model is used: the three free models evaluated (see docs/reports/T6-report.md) had only
// 84 to 808 triangles (plain boxes) and looked primitive next to the detailed parts, so every part is built in code.

export const PART_MAP = {
  monitor: { component: "scene/parts/monitor.js", source: "procedural" },
  keyboard: { component: "scene/parts/keyboard.js", source: "procedural" },
  mouse: { component: "scene/parts/mouse.js", source: "procedural" },
  case: { component: "scene/parts/pc-case.js", source: "procedural" },
  motherboard: { component: "scene/parts/motherboard.js", source: "procedural" },
  cpu: { component: "scene/parts/cpu.js", source: "procedural" },
  cooler: { component: "scene/parts/cooler.js", source: "procedural" },
  ram: { component: "scene/parts/ram.js", source: "procedural" },
  gpu: { component: "scene/parts/gpu.js", source: "procedural" },
  psu: { component: "scene/parts/psu.js", source: "procedural" },
  ssd: { component: "scene/parts/ssd.js", source: "procedural" },
  hdd: { component: "scene/parts/hdd.js", source: "procedural" },
  fans: { component: "scene/parts/case-fans.js", source: "procedural" },
  battery: { component: "scene/parts/battery.js", source: "procedural" },
};

/** Third-party models shipped with the app (title, author, licence, link). Empty: nothing is used. */
export const CREDITS = [];
