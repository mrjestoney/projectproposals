"use client";

import { Check, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { useToast } from "@/components/ui/toast";
import { FORMATS } from "../data/formats";
import { Poster } from "./poster";

export const UNLOCK_STAGES = ["Reading text…", "Separating images and logos…", "Rebuilding the background…", "Matching fonts…"];

/** B1: the flat sample poster (it looks like one picture), a disabled-looking upload box and "Unlock this poster". */
export function StartCard({ doc, onUnlock }) {
  const toast = useToast();
  return (
    <Card as="section" aria-labelledby="start-title" className="mx-auto grid max-w-3xl grid-cols-[minmax(0,1fr)] items-start gap-group p-group md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
      <div>
        <div className="overflow-hidden rounded-field border border-line shadow-pop">
          <Poster doc={doc} mode="flat" />
        </div>
        <p className="mt-tight text-center text-sm text-ink-soft">
          Sample: Science Fair poster ({FORMATS[doc.format].file.split(" · ")[0]}) · <span className="tabular-nums">{FORMATS[doc.format].file.split(" · ")[1]}</span>
        </p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
        <div>
          <h2 id="start-title" className="text-2xl font-semibold tracking-tight">
            A flat picture, like the ones people send on WhatsApp
          </h2>
          <p className="mt-tight text-ink-soft">You cannot change the date, the words or the colours. Unlock it and every piece becomes editable.</p>
        </div>
        <label className="flex cursor-pointer flex-col items-center gap-tight rounded-field border border-dashed border-line-hover bg-panel p-group text-center text-ink-soft hover:border-ink-soft">
          <UploadCloud className="size-7" aria-hidden="true" />
          <span className="font-medium">Upload your own poster</span>
          <span className="text-sm">Available in the full version</span>
          <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={() => toast("This prototype uses the sample poster. Uploading is in the full version.")} />
        </label>
        <Button size="lg" onClick={onUnlock}>
          Unlock this poster
        </Button>
      </div>
    </Card>
  );
}

/** What the "AI" found, shown after the staged progress. */
export function SummaryCard({ onOpen, onBack }) {
  const found = ["8 text blocks", "1 image", "1 logo", "2 shapes", "background rebuilt", "2 items to check"];
  return (
    <Card as="section" aria-labelledby="summary-title" className="mx-auto grid max-w-xl grid-cols-[minmax(0,1fr)] gap-base p-group md:p-section">
      <h2 id="summary-title" className="flex items-center gap-tight text-2xl font-semibold tracking-tight">
        <Check className="size-6 text-success" aria-hidden="true" /> Poster unlocked
      </h2>
      <ul className="flex flex-wrap gap-tight" aria-label="What was found">
        {found.map((f, i) => (
          <li key={f}>
            <Chip tone={i === found.length - 1 ? "warning" : "neutral"} className="text-base">
              {f}
            </Chip>
          </li>
        ))}
      </ul>
      <p className="text-ink-soft">Two things are marked with a warning, because the tool is not sure about them. You can check them in the editor.</p>
      <div className="flex flex-wrap gap-tight">
        <Button size="lg" onClick={onOpen}>
          Open the editor
        </Button>
        <Button variant="ghost" onClick={onBack}>
          Back to the flat poster
        </Button>
      </div>
    </Card>
  );
}
