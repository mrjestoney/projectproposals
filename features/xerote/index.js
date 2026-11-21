import { PrototypeFrame } from "@/components/prototype-frame";
import { Xerote } from "./xerote";

const HOW_TO = [
  "Interview: answer the two open questions with the quick replies, and resolve the contradiction. Then press Lock the plan.",
  "Plan: read the locked plan and open a task to see its “done when…” checks.",
  "Build: copy the prompt, then press “Use sample good report” (or “…with a problem”) and Verify.",
  "If the check finds a problem, read the fix prompt and approve or reject the change request.",
  "Try Level 2 (Connected, MCP) and the Dashboard.",
];

/** Xerote inside the shared PrototypeFrame. */
export function XerotePrototype() {
  return (
    <PrototypeFrame title="Xerote" howTo={HOW_TO}>
      <Xerote />
    </PrototypeFrame>
  );
}
