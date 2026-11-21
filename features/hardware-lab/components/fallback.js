"use client";

import { partById } from "../data/parts";

// A simple flat picture of the tower, used when the browser cannot show 3D. Every box is tappable.
// [part id, label, x, y, width, height]
const BOXES = [
  ["motherboard", "Motherboard", 96, 38, 150, 196],
  ["cpu", "CPU", 106, 54, 40, 40],
  ["cooler", "Cooler", 150, 54, 28, 70],
  ["ram", "RAM", 184, 54, 20, 70],
  ["ssd", "SSD", 106, 104, 40, 18],
  ["gpu", "GPU", 104, 140, 136, 26],
  ["battery", "CMOS", 214, 182, 26, 26],
  ["fans", "Fans", 262, 54, 30, 112],
  ["hdd", "HDD", 40, 150, 46, 62],
  ["psu", "Power supply", 80, 242, 200, 32],
];

export function Fallback({ selected, onPick }) {
  const act = (id) => (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onPick(id));
  return (
    <div className="flex h-full flex-col items-center justify-center gap-base p-base text-center">
      <p className="max-w-sm text-ink-soft">3D is not available in this browser. Here is a flat picture of the PC instead. Tap a part to learn about it.</p>
      <svg viewBox="0 0 330 290" className="h-auto w-full max-w-md" role="group" aria-label="Flat picture of the PC">
        <g role="button" tabIndex={0} aria-label="Case" aria-pressed={selected === "case"} className="cursor-pointer" onClick={() => onPick("case")} onKeyDown={act("case")}>
          <rect x="30" y="20" width="272" height="262" rx="8" className={selected === "case" ? "fill-accent-tint stroke-accent" : "fill-field stroke-line-hover"} strokeWidth="2" />
          <text x="40" y="34" className="fill-hint text-[10px] font-medium">
            Case
          </text>
        </g>
        {BOXES.map(([id, label, x, y, w, h]) => (
          <g key={id} role="button" tabIndex={0} aria-label={partById(id).name} aria-pressed={selected === id} className="cursor-pointer" onClick={() => onPick(id)} onKeyDown={act(id)}>
            <rect x={x} y={y} width={w} height={h} rx="4" className={selected === id ? "fill-accent-tint stroke-accent" : "fill-panel stroke-line-hover"} strokeWidth={selected === id ? 2.5 : 1.5} />
            <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" className="fill-ink text-[10px] font-medium">
              {label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
