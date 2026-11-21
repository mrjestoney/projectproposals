"use client";

import { useId } from "react";
import { EDGES, NODES } from "../data";

// Coordinates are the reference's (viewBox 560x400). Half width/height of each box:
const boxSize = (id) => (NODES[id].kind === "pkg" ? [52, 20] : [64, 25]);

/** Where the line from box a to box b leaves a's edge, so arrowheads stop at the box border. */
function clip(a, b) {
  const [w, h] = boxSize(a);
  const A = NODES[a];
  const B = NODES[b];
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const t = Math.min(dx ? w / Math.abs(dx) : Infinity, dy ? h / Math.abs(dy) : Infinity);
  return [A.x + dx * t, A.y + dy * t];
}

/**
 * The growing system diagram. nodeIds/edgeIds: what is shown. fresh*: highlighted as NEW. sel: {type, id} or null.
 * onPick({type, id}). Boxes and lines are keyboard-focusable buttons (Enter or Space selects). The SVG scales with its
 * container; on very narrow screens it keeps a minimum width and scrolls inside its own box.
 */
export function Diagram({ nodeIds, edgeIds, freshNodes = [], freshEdges = [], sel, onPick, label }) {
  const uid = useId().replace(/:/g, "");
  const arrow = (suffix, cls) => (
    <marker id={`${uid}-${suffix}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path className={cls} d="M0,0 L10,5 L0,10 z" />
    </marker>
  );
  const activate = (item) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPick(item);
    }
  };

  return (
    <div className="overflow-x-auto rounded-field border border-line bg-field">
      <svg viewBox="0 0 560 400" role="group" aria-label={label} className="block h-auto w-full min-w-[22rem]">
        <defs>
          {arrow("n", "fill-ink-soft")}
          {arrow("f", "fill-accent")}
          {arrow("s", "fill-brand")}
        </defs>

        {EDGES.filter((e) => edgeIds.includes(e.id)).map((e) => {
          const [x1, y1] = clip(e.from, e.to);
          const [x2, y2] = clip(e.to, e.from);
          const selected = sel?.type === "edge" && sel.id === e.id;
          const fresh = freshEdges.includes(e.id);
          const item = { type: "edge", id: e.id };
          return (
            <g
              key={e.id}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`Why are ${NODES[e.from].label} and ${NODES[e.to].label} connected?${fresh ? " New in this step." : ""}`}
              className="cursor-pointer"
              onClick={() => onPick(item)}
              onKeyDown={activate(item)}
            >
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={selected ? "stroke-brand" : fresh ? "stroke-accent" : "stroke-ink-soft"}
                strokeWidth={selected || fresh ? 3 : 1.75}
                markerEnd={`url(#${uid}-${selected ? "s" : fresh ? "f" : "n"})`}
              />
              <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-transparent" strokeWidth="24" pointerEvents="stroke" />
            </g>
          );
        })}

        {Object.keys(NODES)
          .filter((k) => nodeIds.includes(k))
          .map((k) => {
            const n = NODES[k];
            const [w, h] = boxSize(k);
            const selected = sel?.type === "node" && sel.id === k;
            const fresh = freshNodes.includes(k);
            const item = { type: "node", id: k };
            return (
              <g
                key={k}
                role="button"
                tabIndex={0}
                aria-pressed={selected}
                aria-label={`${n.label}${n.kind === "pkg" ? " (outside package)" : ""}${fresh ? ". New in this step." : ""}`}
                className="cursor-pointer"
                onClick={() => onPick(item)}
                onKeyDown={activate(item)}
              >
                <rect
                  x={n.x - w}
                  y={n.y - h}
                  width={w * 2}
                  height={h * 2}
                  rx="9"
                  strokeDasharray={n.kind === "pkg" ? "6 4" : undefined}
                  strokeWidth={selected || fresh ? 3 : 1.5}
                  className={`${selected ? "fill-tint stroke-brand" : fresh ? "fill-field stroke-accent" : "fill-field stroke-line-hover"}`}
                />
                <text x={n.x} y={n.y + (n.kind === "pkg" ? -1 : -2)} textAnchor="middle" className="fill-ink text-[17px] font-semibold">
                  {n.label}
                </text>
                <text x={n.x} y={n.y + (n.kind === "pkg" ? 14 : 16)} textAnchor="middle" className="fill-ink-soft text-[12px]">
                  {n.kind === "pkg" ? "package" : n.files[0]}
                </text>
                {fresh ? (
                  <text x={n.x + w - 8} y={n.y - h + 15} textAnchor="end" className="fill-accent text-[11px] font-bold">
                    NEW
                  </text>
                ) : null}
              </g>
            );
          })}
      </svg>
      <p className="border-t border-line px-base py-tight text-xs text-hint sm:hidden">Swipe sideways to see the whole diagram.</p>
    </div>
  );
}
