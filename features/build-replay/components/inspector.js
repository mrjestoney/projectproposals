import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EDGES, NODES, edgeById, stepTitle } from "../data";
import { ChipButton, TextButton } from "./chip-button";
import { Snippet } from "./code-block";

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-hair">
      <dt className="text-sm font-semibold text-ink-soft">{label}</dt>
      <dd className="flex flex-wrap items-center gap-tight">{children}</dd>
    </div>
  );
}

const nothing = <span className="text-hint">Nothing yet</span>;

/**
 * Explains the selected box or line. limitStep hides connections that do not exist yet (walkthrough).
 * Callbacks: onPickNode(id), onOpenFile(name), onJump(step), onShowCode().
 */
export function Inspector({ sel, limitStep = null, depth, onPickNode, onOpenFile, onJump, onShowCode }) {
  const visible = (e) => !limitStep || e.step <= limitStep;

  let body;
  if (!sel) {
    body = (
      <p className="text-ink-soft">
        Tap any box to ask <strong className="font-semibold text-ink">what it is</strong>, or any line to ask{" "}
        <strong className="font-semibold text-ink">why two parts are connected</strong>.
      </p>
    );
  } else if (sel.type === "node") {
    const n = NODES[sel.id];
    const uses = EDGES.filter((e) => e.from === sel.id && visible(e));
    const usedBy = EDGES.filter((e) => e.to === sel.id && visible(e));
    body = (
      <>
        <h3 className="text-xl font-semibold">{n.label}</h3>
        <dl className="mt-base grid grid-cols-[minmax(0,1fr)] gap-base">
          <Row label="What is it?">
            <span>{n.what}</span>
          </Row>
          <Row label="Why?">
            <span>{n.why}</span>
          </Row>
          <Row label="Files">
            {n.files.map((f) => (
              <ChipButton key={f} file onClick={() => onOpenFile(f)}>
                {f}
              </ChipButton>
            ))}
          </Row>
          <Row label="Uses">
            {uses.length ? uses.map((e) => <ChipButton key={e.id} onClick={() => onPickNode(e.to)}>{NODES[e.to].label}</ChipButton>) : nothing}
          </Row>
          <Row label="Used by">
            {usedBy.length ? usedBy.map((e) => <ChipButton key={e.id} onClick={() => onPickNode(e.from)}>{NODES[e.from].label}</ChipButton>) : nothing}
          </Row>
          <Row label="Appeared">
            <TextButton onClick={() => onJump(n.step)}>
              Step {n.step} · {stepTitle(n.step)}
            </TextButton>
          </Row>
        </dl>
      </>
    );
  } else {
    const e = edgeById(sel.id);
    body = (
      <>
        <h3 className="text-xl font-semibold">
          {NODES[e.from].label} → {NODES[e.to].label}
        </h3>
        <dl className="mt-base grid grid-cols-[minmax(0,1fr)] gap-base">
          <Row label="Why connected?">
            <span>{e.why}</span>
          </Row>
          <Row label="Created">
            <TextButton onClick={() => onJump(e.step)}>
              Step {e.step} · {stepTitle(e.step)}
            </TextButton>
          </Row>
        </dl>
        {depth === "code" ? (
          <div className="mt-base">
            <Snippet file={e.file} code={e.code} />
          </div>
        ) : null}
        <div className="mt-base flex flex-wrap gap-tight">
          {depth === "story" ? (
            <Button variant="secondary" size="sm" onClick={onShowCode}>
              Show the exact code
            </Button>
          ) : null}
          <Button variant="secondary" size="sm" onClick={() => onOpenFile(e.file)}>
            Open {e.file}
          </Button>
        </div>
      </>
    );
  }

  return (
    <Card aria-live="polite" className="p-group">
      {body}
    </Card>
  );
}
