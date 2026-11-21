"use client";

import { AlignCenter, AlignLeft, AlignRight, Check, ImagePlus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { FONTS } from "../fonts";
import { layerDef, FLAGS } from "../data/layers";
import { FONT_WEIGHTS, PALETTE } from "../data/palette";
import { ILLUSTRATION_NAMES } from "./illustrations";

const selectClass = "h-11 w-full rounded-field border border-line bg-panel px-base text-base text-ink";

/** The properties of the selected layer: text, font, size, weight, colour, alignment; shape colour; replace image; flags. */
export function EditPanel({ doc, selected, palette, onText, onProp, onPropCommit, onArm, onReplaceImage, onClearFlag, onStartEdit }) {
  if (!selected) return <p className="rounded-field border border-dashed border-line-hover p-base text-ink-soft">Tap a layer on the poster or in the list to edit it.</p>;
  const def = layerDef(selected);
  const p = doc.props[selected];
  const isText = def.type === "text" || def.type === "pill";
  const content = doc.text[doc.lang][selected];
  const fillLabel = def.type === "text" ? "Text colour" : def.type === "pill" ? "Button colour" : def.type === "background" ? "Background colour" : "Colour";

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <div className="flex flex-wrap items-center justify-between gap-tight">
        <h3 className="text-lg font-semibold">{def.name}</h3>
        <Chip>{def.type === "pill" ? "shape + text" : def.type}</Chip>
      </div>

      {doc.flags[selected] ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-tight rounded-field border border-line border-l-[3px] border-l-warning bg-highlight p-base">
          <p className="font-medium">Needs checking</p>
          <p className="text-sm">{FLAGS[selected]}</p>
          <div>
            <Button size="sm" variant="secondary" onClick={() => onClearFlag(selected)}>
              <Check className="size-4" aria-hidden="true" />
              Looks right ✓
            </Button>
          </div>
        </div>
      ) : null}

      {def.note ? <p className="text-sm text-ink-soft">{def.note}: the AI filled in what was hidden behind the text and pictures.</p> : null}

      {isText ? (
        <>
          <label className="grid grid-cols-[minmax(0,1fr)] gap-tight text-sm font-semibold text-ink-soft">
            Text
            <textarea
              rows={2}
              value={content}
              disabled={p.locked}
              onFocus={onArm}
              onChange={(e) => onText(selected, e.target.value)}
              className="w-full rounded-field border border-line bg-panel p-tight text-base font-normal text-ink disabled:opacity-60"
            />
          </label>
          <div>
            <Button variant="secondary" size="sm" disabled={p.locked} onClick={() => onStartEdit(selected)}>
              <Pencil className="size-4" aria-hidden="true" />
              Edit on the poster
            </Button>
          </div>
          <label className="grid grid-cols-[minmax(0,1fr)] gap-tight text-sm font-semibold text-ink-soft">
            Font
            <select className={selectClass} value={p.font} onChange={(e) => onPropCommit(selected, { font: Number(e.target.value) })}>
              {FONTS.map((f, i) => (
                <option key={f.name} value={i}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid grid-cols-[minmax(0,1fr)] gap-tight text-sm font-semibold text-ink-soft">
            <span className="flex justify-between">
              Size <span className="font-normal text-ink tabular-nums">{p.size.toFixed(1)}</span>
            </span>
            <input type="range" min="2" max="16" step="0.2" value={p.size} onPointerDown={onArm} onKeyDown={onArm} onChange={(e) => onProp(selected, { size: Number(e.target.value) })} className="h-11 w-full accent-[var(--primary)]" />
          </label>
          <div>
            <p className="mb-tight text-sm font-semibold text-ink-soft">Weight</p>
            <SegmentedControl label="Weight" options={FONT_WEIGHTS} value={p.weight} onChange={(v) => onPropCommit(selected, { weight: v })} />
          </div>
          {def.type === "text" ? (
            <div>
              <p className="mb-tight text-sm font-semibold text-ink-soft">Alignment</p>
              <SegmentedControl
                label="Alignment"
                value={p.align}
                onChange={(v) => onPropCommit(selected, { align: v })}
                options={[
                  { value: "left", label: "Left", icon: <AlignLeft className="size-4" aria-hidden="true" /> },
                  { value: "center", label: "Centre", icon: <AlignCenter className="size-4" aria-hidden="true" /> },
                  { value: "right", label: "Right", icon: <AlignRight className="size-4" aria-hidden="true" /> },
                ]}
              />
            </div>
          ) : null}
        </>
      ) : null}

      {def.type === "image" ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-tight">
          <p className="text-sm text-ink-soft">Picture: {ILLUSTRATION_NAMES[doc.image]}</p>
          <div>
            <Button variant="secondary" onClick={onReplaceImage}>
              <ImagePlus className="size-4" aria-hidden="true" />
              Replace image
            </Button>
          </div>
        </div>
      ) : null}

      {def.type === "logo" ? <p className="text-sm text-ink-soft">The logo is kept sharp. You can move it, hide it or change its colour.</p> : null}

      <div>
        <p className="mb-tight text-sm font-semibold text-ink-soft">{fillLabel} · palette</p>
        <ul className="flex flex-wrap gap-tight">
          {palette.map((c) => (
            <li key={c.value}>
              <button
                type="button"
                aria-label={`${c.name} ${c.value}`}
                aria-pressed={p.color === c.value}
                onClick={() => onPropCommit(selected, { color: c.value })}
                className={`flex size-11 items-center justify-center rounded-full border-2 ${p.color === c.value ? "border-accent" : "border-line"}`}
                style={{ background: c.value }}
              >
                {p.color === c.value ? <Check className="size-4 text-on-primary mix-blend-difference" aria-hidden="true" /> : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
