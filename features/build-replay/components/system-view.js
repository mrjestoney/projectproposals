"use client";

import { EDGES, NODES } from "../data";
import { Diagram } from "./diagram";
import { Inspector } from "./inspector";

/** The finished architecture. Every box and line is clickable; the inspector sits on the right (below on phones). */
export function SystemView({ sel, depth, onPick, onPickNode, onOpenFile, onJump, onShowCode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-base lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-tight">
        <h2 className="text-xl font-semibold">The finished system</h2>
        <Diagram
          label="Finished system diagram"
          nodeIds={Object.keys(NODES)}
          edgeIds={EDGES.map((e) => e.id)}
          sel={sel}
          onPick={onPick}
        />
      </div>
      <Inspector
        sel={sel}
        depth={depth}
        onPickNode={onPickNode}
        onOpenFile={onOpenFile}
        onJump={onJump}
        onShowCode={onShowCode}
      />
    </div>
  );
}
