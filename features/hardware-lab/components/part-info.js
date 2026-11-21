"use client";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { partById } from "../data/parts";

/** What a part is, what it does, an everyday comparison, what it connects to, and common faults and signs. */
export function PartInfo({ id }) {
  const p = partById(id);
  if (!p) return null;
  return (
    <Card as="article" aria-labelledby="part-name" className="grid grid-cols-[minmax(0,1fr)] gap-base p-group">
      <div className="flex flex-wrap items-center gap-tight">
        <h3 id="part-name" className="text-xl font-semibold tracking-tight">
          {p.name}
        </h3>
        <Chip>{p.group}</Chip>
      </div>
      <dl className="grid grid-cols-[minmax(0,1fr)] gap-tight">
        {[
          ["What it is", p.what],
          ["What it does", p.does],
          ["Like…", p.comparison],
          ["Connects to", p.connects],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-sm font-semibold text-ink-soft">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div>
        <p className="text-sm font-semibold text-ink-soft">Common faults and signs</p>
        <ul className="mt-hair grid grid-cols-[minmax(0,1fr)] gap-tight">
          {p.faults.map(([sign, cause]) => (
            <li key={sign} className="rounded-field border border-line bg-panel p-tight">
              <p className="font-medium">{sign}</p>
              <p className="text-sm text-ink-soft">{cause}</p>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
