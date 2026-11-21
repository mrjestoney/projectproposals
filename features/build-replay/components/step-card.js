import { AlertTriangle, History, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { STEPS, edgeById, NODES } from "../data";
import { ChipButton } from "./chip-button";
import { DiffBlock, MapBlock, Terminal } from "./code-block";

function Block({ title, children, className = "" }) {
  return (
    <section className={className}>
      <h3 className="mb-tight text-sm font-semibold text-ink-soft">{title}</h3>
      {children}
    </section>
  );
}

const none = (text) => <span className="text-hint">{text}</span>;

/** One step of the replay: what happened, why, what it touched, and (in Code level) the exact diff. */
export function StepCard({ step: s, depth, onShowCode, onOpenFile, onPickEdge }) {
  const fromHistory = s.source === "From history";
  return (
    <Card as="article" aria-labelledby="step-title" className="p-group">
      <div className="flex flex-wrap items-center gap-tight text-sm text-ink-soft">
        <Chip tone="accent">{s.type}</Chip>
        <span className="font-medium tabular-nums">
          Step {s.n} of {STEPS.length}
        </span>
        <span aria-hidden="true">·</span>
        <span>{s.when}</span>
        <Chip
          tone={fromHistory ? "neutral" : "warning"}
          title={fromHistory ? "Taken from the real commit order." : "Rebuilt by the tool because the history did not show this clearly."}
        >
          {fromHistory ? <History className="size-3.5" aria-hidden="true" /> : <Sparkles className="size-3.5" aria-hidden="true" />}
          {s.source}
        </Chip>
      </div>
      <h2 id="step-title" className="mt-base text-2xl leading-tight font-semibold tracking-tight">
        {s.title}
      </h2>

      <div className="mt-group grid grid-cols-[minmax(0,1fr)] gap-group">
        <Block title="What happened?">
          <p>{s.what}</p>
          {s.command ? <Terminal command={s.command} output={s.output} /> : null}
        </Block>

        <Block title="Why?" className="rounded-field border-l-[3px] border-accent bg-accent-tint p-base">
          <p>{s.why}</p>
        </Block>

        {s.risk ? (
          <div className="flex gap-tight rounded-field border border-line border-l-[3px] border-l-warning bg-highlight p-base">
            <AlertTriangle className="mt-hair size-5 shrink-0 text-warning" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold">Watch out</h3>
              <p>{s.risk}</p>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-[minmax(0,1fr)] gap-group sm:grid-cols-2">
          <Block title="This step created">
            <div className="flex flex-wrap gap-tight">
              {s.created.length
                ? s.created.map((f) => (
                    <ChipButton key={f} file onClick={() => onOpenFile(f)}>
                      {f}
                    </ChipButton>
                  ))
                : none("No new files")}
            </div>
          </Block>
          <Block title="This step changed">
            <div className="flex flex-wrap gap-tight">
              {s.changed.length
                ? s.changed.map((f) => (
                    <ChipButton key={f} file onClick={() => onOpenFile(f)}>
                      {f}
                    </ChipButton>
                  ))
                : none("Nothing existing")}
            </div>
          </Block>
        </div>

        {s.newEdges.length ? (
          <Block title="New connections">
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-tight">
              {s.newEdges.map((id) => {
                const e = edgeById(id);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onPickEdge(id)}
                      className="press w-full rounded-field border border-line bg-field p-base text-left hover:border-line-hover active:bg-tint"
                    >
                      <span className="font-semibold">
                        {NODES[e.from].label} → {NODES[e.to].label}
                      </span>
                      <span className="mt-hair block text-sm text-ink-soft">{e.why}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Block>
        ) : null}

        {depth === "story" ? (
          <button
            type="button"
            onClick={onShowCode}
            className="press min-h-12 rounded-field border border-dashed border-line-hover px-base text-base font-medium text-accent hover:bg-accent-tint"
          >
            Show the code for this step
          </button>
        ) : (
          <Block title="The actual construction">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
              {s.map ? <MapBlock text={s.map} /> : null}
              {Object.entries(s.diffs).map(([f, t]) => (
                <DiffBlock key={f} file={f} text={t} isNew={s.created.includes(f)} />
              ))}
            </div>
          </Block>
        )}
      </div>
    </Card>
  );
}
