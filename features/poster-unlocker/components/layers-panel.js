"use client";

import { AlertTriangle, Eye, EyeOff, Image as ImageIcon, Layers, Lock, LockOpen, Square, Type, BadgeCheck } from "lucide-react";
import { LAYERS } from "../data/layers";

const ICONS = { background: Layers, shape: Square, logo: BadgeCheck, text: Type, image: ImageIcon, pill: Square };

/** The layer list, top layer first: select, hide (eye), lock, and a warning icon on layers that need checking. */
export function LayersPanel({ doc, selected, onSelect, onToggle }) {
  const rows = [...LAYERS].reverse();
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-hair" aria-label="Layers">
      {rows.map((l) => {
        const Icon = ICONS[l.type];
        const p = doc.props[l.id];
        const active = selected === l.id;
        const flagged = Boolean(doc.flags[l.id]);
        return (
          <li key={l.id} className={`flex items-center rounded-field border ${active ? "border-accent bg-accent-tint" : "border-line bg-field"}`}>
            <button type="button" aria-pressed={active} onClick={() => onSelect(l.id)} className={`flex min-h-11 min-w-0 flex-1 items-center gap-tight px-tight text-left ${p.hidden ? "opacity-50" : ""}`}>
              <Icon className="size-4 shrink-0 text-ink-soft" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate font-medium">{l.name}</span>
              {flagged ? (
                <span title="Needs checking" className="flex shrink-0 items-center text-warning">
                  <AlertTriangle className="size-4" aria-hidden="true" />
                  <span className="sr-only">Needs checking</span>
                </span>
              ) : null}
            </button>
            <button type="button" onClick={() => onToggle(l.id, "hidden")} aria-label={`${p.hidden ? "Show" : "Hide"} ${l.name}`} aria-pressed={p.hidden} className="flex size-11 shrink-0 items-center justify-center text-ink-soft hover:text-ink">
              {p.hidden ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
            </button>
            {l.type !== "background" ? (
              <button type="button" onClick={() => onToggle(l.id, "locked")} aria-label={`${p.locked ? "Unlock" : "Lock"} ${l.name}`} aria-pressed={p.locked} className="flex size-11 shrink-0 items-center justify-center text-ink-soft hover:text-ink">
                {p.locked ? <Lock className="size-4" aria-hidden="true" /> : <LockOpen className="size-4" aria-hidden="true" />}
              </button>
            ) : (
              <span className="size-11 shrink-0" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
