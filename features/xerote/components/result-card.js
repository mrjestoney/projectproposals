"use client";

import { AlertTriangle, Check, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { CR, fixPrompt } from "../data/build";

function Mark({ ok, warn }) {
  if (ok) return <Check className="mt-hair size-5 shrink-0 text-success" aria-hidden="true" />;
  if (warn) return <AlertTriangle className="mt-hair size-5 shrink-0 text-warning" aria-hidden="true" />;
  return <X className="mt-hair size-5 shrink-0 text-danger" aria-hidden="true" />;
}

function Row({ ok, warn = false, children, detail }) {
  return (
    <li className="flex gap-tight">
      <Mark ok={ok} warn={warn} />
      <div className="min-w-0">
        <p className="font-medium">
          <span className="sr-only">{ok ? "Passed: " : warn ? "Warning: " : "Failed: "}</span>
          {children}
        </p>
        {detail ? <p className="text-sm text-ink-soft">{detail}</p> : null}
      </div>
    </li>
  );
}

/** What the verification found: checks, code match, scope, files changed. For a problem it also shows the fix prompt. */
export function ResultCard({ task, kind, vf, crStatus, onCopy }) {
  const failed = vf.checks.filter((c) => !c.ok).length;
  const good = kind === "good";
  return (
    <Card as="section" aria-labelledby="result-title" className="grid grid-cols-[minmax(0,1fr)] gap-base p-group">
      <div className="flex flex-wrap items-center gap-tight">
        <h3 id="result-title" className="text-xl font-semibold">
          Verification result · {task.id}
        </h3>
        <Chip tone={good ? "success" : "danger"} className="text-base">
          {good ? "Passed" : `Needs changes · ${failed} check failed`}
        </Chip>
      </div>

      <div>
        <p className="mb-tight text-sm font-semibold text-ink-soft">Acceptance checks</p>
        <ol className="grid grid-cols-[minmax(0,1fr)] gap-tight">
          {vf.checks.map((c, i) => (
            <Row key={c.text} ok={c.ok} detail={c.evidence}>
              {i + 1}. {c.text}
            </Row>
          ))}
        </ol>
      </div>

      <ul className="grid grid-cols-[minmax(0,1fr)] gap-tight border-t border-line pt-base">
        <Row ok={vf.codeMatch.ok} warn={!vf.codeMatch.ok} detail={vf.codeMatch.detail}>
          {vf.codeMatch.text} {vf.codeMatch.ok ? "✓" : ""}
        </Row>
        <Row ok={vf.scope.ok} warn={!vf.scope.ok} detail={vf.scope.detail}>
          {vf.scope.text} {vf.scope.ok ? "✓" : ""}
        </Row>
      </ul>

      <div>
        <p className="mb-tight text-sm font-semibold text-ink-soft">Files changed in the real code (GitHub)</p>
        <div className="overflow-x-auto rounded-field border border-line" tabIndex={0} role="region" aria-label="Changed files, scrollable">
          <table className="w-full min-w-[20rem] border-collapse text-sm">
            <tbody>
              {vf.changes.map(([f, add, del]) => {
                const extra = !task.files.includes(f);
                return (
                  <tr key={f} className="border-t border-line first:border-0">
                    <td className="px-base py-tight font-mono text-[13px] break-all">
                      {f} {extra ? <Chip tone="warning">not in the plan</Chip> : null}
                    </td>
                    <td className="px-base py-tight text-right whitespace-nowrap tabular-nums">
                      <span className="text-success">+{add}</span> <span className="text-danger">−{del}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {!good ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-tight border-t border-line pt-base">
          <div className="flex flex-wrap items-center justify-between gap-tight">
            <h4 className="font-semibold">Fix prompt for your coding AI</h4>
            <Button variant="secondary" size="sm" onClick={() => onCopy(fixPrompt(task, crStatus), "Fix prompt copied")}>
              <Copy className="size-4" aria-hidden="true" />
              Copy fix prompt
            </Button>
          </div>
          <pre className="max-h-72 overflow-auto rounded-field border border-line bg-code p-base font-mono text-[13px] leading-6 whitespace-pre-wrap">{fixPrompt(task, crStatus)}</pre>
          <p className="text-sm text-ink-soft">A change request was created: {CR.title}</p>
        </div>
      ) : null}
    </Card>
  );
}
