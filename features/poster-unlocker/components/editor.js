"use client";

import { useState } from "react";
import { Copy, FileDown, Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { FORMATS } from "../data/formats";
import { PALETTE } from "../data/palette";
import { EditPanel } from "./edit-panel";
import { LayersPanel } from "./layers-panel";
import { Poster } from "./poster";
import { SmartPanel } from "./smart-panel";

/**
 * The editor: desktop = layers (left), canvas (centre), properties and smart actions (right);
 * mobile = canvas on top, then tabs Layers / Edit / Smart below it.
 */
export function Editor({ h, original, ui, actions }) {
  const { doc } = h;
  const [tab, setTab] = useState("edit");
  const [mtab, setMtab] = useState("edit");
  const [compareAt, setCompareAt] = useState(50);
  const [exportOpen, setExportOpen] = useState(false);
  const fmt = FORMATS[doc.format];

  const edit = (
    <EditPanel
      doc={doc}
      selected={ui.selected}
      palette={PALETTE}
      onText={actions.text}
      onProp={actions.prop}
      onPropCommit={actions.propCommit}
      onArm={h.arm}
      onReplaceImage={actions.replaceImage}
      onClearFlag={actions.clearFlag}
      onStartEdit={actions.startEdit}
    />
  );
  const layers = <LayersPanel doc={doc} selected={ui.selected} onSelect={actions.select} onToggle={actions.toggle} />;
  const smart = <SmartPanel doc={doc} busy={ui.busy} error={ui.error} onChangeDate={actions.changeDate} onLanguage={actions.language} onFormat={actions.format} />;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <div className="flex flex-wrap items-center justify-between gap-tight">
        <div className="flex flex-wrap items-center gap-tight" role="group" aria-label="History">
          <Button variant="secondary" size="sm" onClick={h.undo} disabled={!h.canUndo}>
            <Undo2 className="size-4" aria-hidden="true" />
            Undo
          </Button>
          <Button variant="secondary" size="sm" onClick={h.redo} disabled={!h.canRedo}>
            <Redo2 className="size-4" aria-hidden="true" />
            Redo
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-x-base">
          <Switch checked={ui.compare} onChange={actions.setCompare} label="Before / after" />
          <Button size="sm" onClick={() => setExportOpen(true)}>
            <FileDown className="size-4" aria-hidden="true" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-base lg:grid-cols-[13.5rem_minmax(0,1fr)_19rem]">
        <section aria-label="Layers" className="hidden lg:block">
          <h3 className="mb-tight text-sm font-semibold text-ink-soft">Layers</h3>
          {layers}
        </section>

        <div className="min-w-0">
          <div className="mx-auto" style={{ width: `min(100%, ${(34 * fmt.w) / fmt.h}rem)` }}>
            <div className="relative overflow-hidden rounded-field border border-line shadow-pop">
              <Poster
                doc={doc}
                selected={ui.selected}
                editingId={ui.editingId}
                flashIds={ui.flashIds}
                reduceMotion={ui.reduceMotion}
                onSelect={actions.select}
                onDragStart={h.arm}
                onDrag={actions.drag}
                onDragEnd={() => {}}
                onNudge={actions.nudge}
                onEditStart={actions.startEdit}
                onEditEnd={actions.endEdit}
              />
              {ui.compare ? (
                <>
                  <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - compareAt}% 0 0)` }}>
                    <Poster doc={original} mode="flat" fill />
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-paper shadow-pop" style={{ left: `${compareAt}%` }} aria-hidden="true" />
                </>
              ) : null}
            </div>
            {ui.compare ? (
              <label className="mt-tight grid grid-cols-[minmax(0,1fr)] gap-hair text-sm font-medium text-ink-soft">
                <span className="flex justify-between">
                  <span>← Original (flat)</span>
                  <span>Unlocked →</span>
                </span>
                <input type="range" min="0" max="100" value={compareAt} onChange={(e) => setCompareAt(Number(e.target.value))} className="h-11 w-full accent-[var(--primary)]" aria-label="Compare the flat original with the edited poster" />
              </label>
            ) : (
              <p className="mt-tight text-center text-xs text-hint">Tap to select · drag to move · double-tap text to edit · arrow keys nudge</p>
            )}
          </div>
        </div>

        <section aria-label="Properties and smart actions" className="hidden lg:block">
          <Tabs
            label="Properties"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: "edit", label: "Edit", content: edit },
              { id: "smart", label: "Smart", content: smart },
            ]}
          />
        </section>

        <section aria-label="Editing panel" className="lg:hidden">
          <Tabs
            label="Editing"
            value={mtab}
            onChange={setMtab}
            tabs={[
              { id: "layers", label: "Layers", content: layers },
              { id: "edit", label: "Edit", content: edit },
              { id: "smart", label: "Smart", content: smart },
            ]}
          />
        </section>
      </div>

      <Sheet open={exportOpen} onClose={() => setExportOpen(false)} title="Export">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-tight">
          {["PNG image", "PDF", "Project file (editable)"].map((f) => (
            <li key={f} className="flex items-center justify-between gap-base rounded-field border border-line p-base">
              <span className="font-medium">{f}</span>
              <span className="text-sm text-ink-soft">Available in the full version</span>
            </li>
          ))}
          <li>
            <Button
              variant="secondary"
              full
              onClick={() => {
                actions.copyText();
                setExportOpen(false);
              }}
            >
              <Copy className="size-5" aria-hidden="true" />
              Copy all text
            </Button>
          </li>
        </ul>
      </Sheet>
    </div>
  );
}
