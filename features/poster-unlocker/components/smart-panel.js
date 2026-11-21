"use client";

import { useState } from "react";
import { CalendarDays, Languages, Loader2, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { FORMATS, FORMAT_IDS } from "../data/formats";

/** Smart actions (simulated AI): change the date everywhere, translate to Swahili, resize to another format. */
export function SmartPanel({ doc, busy, error, onChangeDate, onLanguage, onFormat }) {
  const [date, setDate] = useState("14 March 2027");
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <Card as="section" aria-labelledby="smart-date" className="grid grid-cols-[minmax(0,1fr)] gap-tight p-base">
        <h3 id="smart-date" className="flex items-center gap-tight font-semibold">
          <CalendarDays className="size-5 text-accent" aria-hidden="true" /> Change date
        </h3>
        <p className="text-sm text-ink-soft">“Change the event to…” updates every place the date appears, including the year in the title.</p>
        <form
          className="flex gap-tight"
          onSubmit={(e) => {
            e.preventDefault();
            onChangeDate(date);
          }}
        >
          <input value={date} onChange={(e) => setDate(e.target.value)} aria-label="New date" className="h-11 min-w-0 flex-1 rounded-field border border-line bg-panel px-base text-base" />
          <Button type="submit" disabled={busy === "date"}>
            {busy === "date" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Apply
          </Button>
        </form>
        {error ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
      </Card>

      <Card as="section" aria-labelledby="smart-lang" className="grid grid-cols-[minmax(0,1fr)] gap-tight p-base">
        <h3 id="smart-lang" className="flex items-center gap-tight font-semibold">
          <Languages className="size-5 text-accent" aria-hidden="true" /> Translate
        </h3>
        <p className="text-sm text-ink-soft">Translates all text and keeps the layout. Switch back any time.</p>
        <div className="flex items-center gap-tight">
          <SegmentedControl label="Language" value={doc.lang} onChange={onLanguage} options={[{ value: "en", label: "English" }, { value: "sw", label: "Swahili" }]} />
          {busy === "lang" ? <Loader2 className="size-4 animate-spin text-accent" aria-label="Translating" /> : null}
        </div>
      </Card>

      <Card as="section" aria-labelledby="smart-format" className="grid grid-cols-[minmax(0,1fr)] gap-tight p-base">
        <h3 id="smart-format" className="flex items-center gap-tight font-semibold">
          <Maximize className="size-5 text-accent" aria-hidden="true" /> Resize
        </h3>
        <p className="text-sm text-ink-soft">Re-flows the layers for another format.</p>
        <SegmentedControl label="Format" value={doc.format} onChange={onFormat} options={FORMAT_IDS.map((f) => ({ value: f, label: f }))} />
        <p className="text-sm text-ink-soft">{FORMATS[doc.format].label} · {FORMATS[doc.format].file.split(" · ")[1]}</p>
      </Card>
    </div>
  );
}
