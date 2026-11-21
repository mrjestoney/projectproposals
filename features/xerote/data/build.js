// Mock content of the build loop: the prompt Xerote writes, the two sample reports for T4 (one good, one with a
// problem), what the verification finds, the fix prompt, the change request and the MCP log. Prompts and reports are
// written to look like the real thing.

import { PROJECT } from "./project";
import { RULE_TEXT } from "./interview";

export const T4_ID = "T4";

/** The decisions the owner made in the interview, as short sentences. */
export function decisionLines(d) {
  return [
    `Grading scale: ${d.grading === "Custom" ? "custom scale (to be defined by the owner)" : (d.grading ?? "not decided yet")}`,
    `Editing approved marks: ${d.approval ? RULE_TEXT.approval[d.approval] ?? d.approval : "not decided yet"}`,
    `Report cards: ${d.reportCards ? RULE_TEXT.reportCards[d.reportCards] : "not decided yet"}`,
  ];
}

/** The prompt Xerote gives the coding AI for one task. Only this task's context goes in, plus the report format. */
export function buildPrompt(task, doneTasks, version, d) {
  const done = doneTasks.length ? doneTasks.map((t) => `${t.id} ${t.title}`).join(", ") : "none yet";
  return `You are building the "${PROJECT.name}" with me, one task at a time.
Work on ONE task only: ${task.id} — ${task.title}.

## Project context (locked plan, version ${version})
- Purpose: ${PROJECT.purpose}
- Roles: Admin, Teacher, Parent.
- Stack: ${PROJECT.stack}, hosted on ${PROJECT.hosting}. Mobile first. Swahili and English.
- Already done: ${done}.
- Decisions made by the owner:
${decisionLines(d).map((l) => `  - ${l}`).join("\n")}

## Task ${task.id} — ${task.title}
Goal: ${task.goal}
Relevant files (create or change only these):
${task.files.map((f) => `  - ${f}`).join("\n")}

## Acceptance checks (every one must be true)
${task.checks.map((c, i) => `${i + 1}. ${c}`).join("\n")}

## Rules
- Build exactly what the checks ask for. Do not add features, buttons, pages or dependencies that are not in the plan.
- If you think something is missing, put it under "Suggestions" in your report. Do not build it.
- Do not change files outside the list above. If a check cannot pass without it, say so in the report.
- Run npm run lint and npm run build before you finish. Both must pass.

## Required report (write docs/reports/${task.id}-report.md and paste the same text in chat)
Use exactly these headings: Status, What I built, Files changed, Acceptance checks (✅ or ❌ for each check, with evidence), Deviations, Suggestions, Questions for the owner.`;
}

// ---------------------------------------------------------------------------------------------------------------
// T4 sample reports
// ---------------------------------------------------------------------------------------------------------------

export const T4_GOOD_REPORT = `# Report T4 — Marks entry screen

## Status
DONE — all 5 acceptance checks pass; lint and build pass.

## What I built
- Marks entry page at /marks: the teacher picks one of their classes and subjects, then sees one row per student.
- A marks table with a number input per student and a Save button.
- validateMark() in lib/marks.js: accepts whole or decimal numbers from 0 to 100 only.
- POST /api/marks saves marks to the Mark table; the page loads saved marks again on reload.
- Role guard: Teacher and Admin only. A Parent gets 403.

## Files changed
- app/marks/page.js (new)
- components/marks/marks-table.js (new)
- lib/marks.js (new)
- app/api/marks/route.js (new)
- lib/marks.test.js (new)

## Acceptance checks
1. ✅ A teacher can open Marks entry for a class and subject they teach — the lists come from the teacher's assignments (app/marks/page.js).
2. ✅ Marks are typed into a table, one row per student — components/marks/marks-table.js.
3. ✅ A mark must be a number from 0 to 100 — validateMark() rejects -1, 101, "abc" and empty; the error shows next to the row and nothing is saved (lib/marks.test.js, 6 cases pass).
4. ✅ Saved marks appear again after reload — checked with 30 seeded students.
5. ✅ Only Teacher and Admin can open the screen — a Parent request returns 403.

## Deviations
None.

## Suggestions
- Later (not built): remember the last chosen class and subject.

## Questions for the owner
None.

npm run lint: passed. npm run build: passed.`;

export const T4_PROBLEM_REPORT = `# Report T4 — Marks entry screen

## Status
DONE — everything works as specified; lint and build pass.

## What I built
- Marks entry page at /marks with a class and subject picker.
- A marks table with one row per student and a Save button.
- validateMark() in lib/marks.js.
- POST /api/marks to save marks; marks are loaded again on reload.
- Role guard for Teacher and Admin.

## Files changed
- app/marks/page.js (new)
- components/marks/marks-table.js (new)
- lib/marks.js (new)
- app/api/marks/route.js (new)
- lib/marks.test.js (new)

## Acceptance checks
1. ✅ Teacher can open Marks entry for their class and subject.
2. ✅ One row per student in the table.
3. ✅ Marks are validated — invalid marks show an error and are not saved.
4. ✅ Saved marks appear after reload.
5. ✅ Parent cannot open the screen.

## Deviations
None.

## Suggestions
None.

## Questions for the owner
None.

npm run lint: passed. npm run build: passed.`;

/** Changed files per sample (what "GitHub" shows). */
export const T4_DIFF_GOOD = [
  ["app/marks/page.js", 46, 0],
  ["components/marks/marks-table.js", 98, 0],
  ["lib/marks.js", 31, 0],
  ["app/api/marks/route.js", 54, 0],
  ["lib/marks.test.js", 40, 0],
];
export const T4_DIFF_PROBLEM = [
  ["app/marks/page.js", 46, 0],
  ["components/marks/marks-table.js", 128, 0],
  ["lib/marks.js", 19, 0],
  ["app/api/marks/route.js", 54, 0],
  ["lib/marks.test.js", 12, 0],
  ["components/marks/delete-student-button.js", 22, 0],
];

const T4_EVIDENCE_GOOD = [
  "app/marks/page.js lists only the classes and subjects assigned to the logged-in teacher.",
  "components/marks/marks-table.js renders one row per student with a number input.",
  "lib/marks.js validateMark() rejects values below 0, above 100 and non-numbers; the table shows the error beside the row.",
  "app/api/marks/route.js writes to the Mark table; the page loads the saved marks on reload.",
  "The route guard allows Teacher and Admin only; a Parent request gets 403.",
];
const T4_EVIDENCE_PROBLEM = [
  T4_EVIDENCE_GOOD[0],
  T4_EVIDENCE_GOOD[1],
  "lib/marks.js validateMark() only checks that the value is a number. A test entry of 150 was accepted and saved.",
  T4_EVIDENCE_GOOD[3],
  T4_EVIDENCE_GOOD[4],
];

/** A report for any task other than the T4 samples (same format). */
export function genericReport(task) {
  return `# Report ${task.id} — ${task.title}

## Status
DONE — all ${task.checks.length} acceptance checks pass; lint and build pass.

## What I built
- ${task.goal}

## Files changed
${task.files.map((f) => `- ${f}`).join("\n")}

## Acceptance checks
${task.checks.map((c, i) => `${i + 1}. ✅ ${c}`).join("\n")}

## Deviations
None.

## Suggestions
None.

## Questions for the owner
None.

npm run lint: passed. npm run build: passed.`;
}

function hash(s) {
  let h = 7;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 997;
  return h;
}

/**
 * What the verification finds for a task and a kind of report ("good" or "problem").
 * Returns { checks: [{ text, ok, evidence }], changes: [[file, +, -]], codeMatch: { ok, text }, scope: { ok, text, detail } }.
 */
export function verification(task, kind) {
  if (task.id === T4_ID) {
    const problem = kind === "problem";
    const ev = problem ? T4_EVIDENCE_PROBLEM : T4_EVIDENCE_GOOD;
    return {
      checks: task.checks.map((text, i) => ({ text, ok: !(problem && i === 2), evidence: ev[i] })),
      changes: problem ? T4_DIFF_PROBLEM : T4_DIFF_GOOD,
      codeMatch: problem
        ? { ok: false, text: "Code changes do not fully match the report", detail: "The report lists 5 files. The real changes touch 6." }
        : { ok: true, text: "Code changes match the report", detail: "5 files in the report, 5 files changed." },
      scope: problem
        ? { ok: false, text: "Out of scope: the agent added a “Delete student” button (not in the plan)", detail: "components/marks/delete-student-button.js adds a Delete student button to every row. It is not in the plan and the report does not mention it." }
        : { ok: true, text: "No out-of-scope changes", detail: "Every changed file is in the task's file list." },
    };
  }
  return {
    checks: task.checks.map((text, i) => ({ text, ok: true, evidence: `Found in ${task.files[i % task.files.length]}.` })),
    changes: task.files.map((f) => [f, 20 + (hash(f) % 80), 0]),
    codeMatch: { ok: true, text: "Code changes match the report", detail: `${task.files.length} files in the report, ${task.files.length} files changed.` },
    scope: { ok: true, text: "No out-of-scope changes", detail: "Every changed file is in the task's file list." },
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Fix prompt and change request
// ---------------------------------------------------------------------------------------------------------------

export const CR = {
  id: "CR-1",
  title: "Agent added a “Delete student” button. Not in the plan.",
  detail: "Found in components/marks/delete-student-button.js while checking T4. Nobody asked for it, and deleting a student also affects marks and report cards.",
  approveLabel: "Approve (add to plan as T13)",
  rejectLabel: "Reject (the fix prompt will remove it)",
};

/** Prompt that fixes the failed check, and removes the extra button unless the owner approved it. */
export function fixPrompt(task, crStatus) {
  const third =
    crStatus === "approved"
      ? `2. The “Delete student” button is now approved as task T13, so do not remove it, and do not extend it. Leave it exactly as it is until T13 becomes the current task.`
      : `2. Remove the “Delete student” button: delete components/marks/delete-student-button.js and every place that imports it. It is not part of ${task.id}.${crStatus === "open" ? "\n   (The owner has not decided yet. Wait for the decision before you remove it.)" : ""}`;
  return `Fix for ${task.id} — ${task.title}. Do only these fixes, nothing else:

1. Check 3 failed: marks above 100 are accepted. In lib/marks.js, validateMark() must accept only numbers from 0 to 100. Add test cases for 100 (accepted), 101 (refused) and 150 (refused), and show the error next to the row.
${third}

Then run npm run lint and npm run build, and send an updated report (docs/reports/${task.id}-report.md, overwrite) in the same format. List the report's "Files changed" from the real changes, including anything outside the task's file list.`;
}

// ---------------------------------------------------------------------------------------------------------------
// Level 2 (MCP) log
// ---------------------------------------------------------------------------------------------------------------

export const VERIFY_STAGES = ["Reading report…", "Checking acceptance checks…", "Comparing with real code changes (GitHub)…", "Checking scope…"];

export const MCP_TOOLS = ["get_next_task", "submit_report", "request_change"];

export function mcpLines(task) {
  return [
    "→ get_next_task()",
    `← ${task.id} · ${task.title}`,
    `→ submit_report(${task.id})`,
    "← report received",
  ];
}

// ---------------------------------------------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------------------------------------------

/** Parts of the system diagram and the tasks that build each one. */
export const SYSTEM_PARTS = [
  { id: "web", label: "Web app", tasks: ["T1"], x: 210, y: 40 },
  { id: "auth", label: "Auth", tasks: ["T3"], x: 52, y: 130 },
  { id: "marks", label: "Marks", tasks: ["T4", "T7"], x: 157, y: 130 },
  { id: "grades", label: "Grades", tasks: ["T5", "T6"], x: 262, y: 130 },
  { id: "reports", label: "Report cards", tasks: ["T8", "T9", "T10"], x: 367, y: 130 },
  { id: "db", label: "Database", tasks: ["T2"], x: 210, y: 220 },
];
export const SYSTEM_LINKS = [
  ["web", "auth"], ["web", "marks"], ["web", "grades"], ["web", "reports"],
  ["auth", "db"], ["marks", "db"], ["grades", "db"], ["reports", "db"],
];

export const INITIAL_ACTIVITY = [
  { id: "a4", when: "Yesterday 16:40", text: "T3 done: Authentication and roles" },
  { id: "a3", when: "Yesterday 11:05", text: "T2 done: Database schema" },
  { id: "a2", when: "Yesterday 09:30", text: "T1 done: Project setup" },
  { id: "a1", when: "Yesterday 09:12", text: "Plan locked (version 1), approved by you" },
];

export const INITIAL_WARNINGS = ["Swahili text has not been reviewed by a Swahili speaker yet (needed before T11)."];
