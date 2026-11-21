// The 12 numbered tasks of the plan. status: done | current | pending. checks = the "done when…" list for each task.

import { RULE_TEXT } from "./interview";

const base = [
  {
    id: "T1", title: "Project setup", goal: "A running Next.js project with the agreed folders, lint and a home page.",
    files: ["package.json", "app/layout.js", "app/page.js", "lib/"],
    checks: ["npm run dev starts without errors", "npm run lint and npm run build pass", "The home page shows the app name", "Folders app/, components/ and lib/ exist"],
  },
  {
    id: "T2", title: "Database schema", goal: "Postgres tables for schools, classes, students, subjects, marks and report cards, with sample data.",
    files: ["db/schema.sql", "db/seed.sql", "lib/db.js"],
    checks: ["All six tables exist with the relationships in the plan", "The seed script creates 1 school, 3 classes and 30 students", "lib/db.js connects using an environment variable", "No real student data is committed"],
  },
  {
    id: "T3", title: "Authentication and roles", goal: "Login for Admin, Teacher and Parent, and a guard that limits each role.",
    files: ["app/login/page.js", "lib/auth.js", "middleware or proxy file"],
    checks: ["A user can log in and log out", "Each user has exactly one role", "A Parent cannot open Teacher or Admin pages", "Passwords are stored hashed, never as plain text"],
  },
  {
    id: "T4", title: "Marks entry screen", goal: "A teacher can enter and save marks for one subject of one class.",
    files: ["app/marks/page.js", "components/marks/marks-table.js", "lib/marks.js", "app/api/marks/route.js", "lib/marks.test.js"],
    checks: [
      "A teacher can open Marks entry for a class and subject they teach",
      "Marks are typed into a table, one row per student",
      "A mark must be a number from 0 to 100; anything else shows an error next to the row and is not saved",
      "Saved marks appear again after the page is reloaded",
      "Only Teacher and Admin can open the screen; a Parent cannot",
    ],
  },
  {
    id: "T5", title: "Grade calculation", goal: "Turn each mark into a grade using the agreed grading scale.",
    files: ["lib/grades.js", "lib/grades.test.js", "components/marks/grade-badge.js"],
    checks: ["Marks are converted to grades using the scale in the plan", "The edges of every band are tested (for example 74 and 75)", "A missing mark shows no grade, not a failing grade", "The scale lives in one file so it can be changed once"],
  },
  {
    id: "T6", title: "Class positions", goal: "Rank students in a class by total marks and average.",
    files: ["lib/positions.js", "lib/positions.test.js", "app/results/page.js"],
    checks: ["Students are ranked by total marks, highest first", "Students with equal totals share a position, and the next position is skipped", "Students with a missing subject are flagged, not ranked silently", "Ranking is recalculated when marks change"],
  },
  {
    id: "T7", title: "Head teacher approval", goal: "The head teacher approves a class's marks, which then follow the editing rule.",
    files: ["app/approve/page.js", "lib/approval.js", "db/migrations/approval.sql"],
    checks: ["Only an Admin (head teacher) can approve a class", "Approved marks follow the editing rule in the plan", "Approval and any later change are logged with who and when", "Approving needs all subjects of the class to have marks"],
  },
  {
    id: "T8", title: "Report card view", goal: "Show one student's report card on screen.",
    files: ["app/report-card/[studentId]/page.js", "components/report-card/report-card.js"],
    checks: ["Each subject shows mark, grade and position", "The card shows the school name and term", "A teacher comment can be added and saved", "The layout works on a 360px wide phone"],
  },
  {
    id: "T9", title: "Report card PDF", goal: "Download or print a report card as a PDF.",
    files: ["app/api/report-card/[studentId]/pdf/route.js", "lib/pdf.js"],
    checks: ["A PDF has the same content as the screen", "The PDF fits on one A4 page", "Only users allowed to see the report card can get its PDF", "Generating a class's PDFs does not time out"],
  },
  {
    id: "T10", title: "Parent portal", goal: "A parent logs in and sees only their own child's report card.",
    files: ["app/parent/page.js", "lib/parent-access.js"],
    checks: ["A parent sees only their own child", "Trying another student's address returns 'not found'", "The portal works on a phone with a slow connection", "A parent with two children can switch between them"],
  },
  {
    id: "T11", title: "Swahili and English", goal: "Every screen can be shown in Swahili or English.",
    files: ["lib/i18n.js", "messages/en.json", "messages/sw.json"],
    checks: ["A language switch is on every page", "No text is hard-coded outside the message files", "Both message files have the same keys", "The chosen language is remembered"],
  },
  {
    id: "T12", title: "Deploy", goal: "The app runs on Vercel with a Postgres database.",
    files: ["vercel.json", "README.md", "env example file"],
    checks: ["The production build passes on Vercel", "Environment variables are documented, with no secrets in the code", "A smoke test passes: log in, enter a mark, view a report card", "A short README explains how to run and deploy"],
  },
];

const INITIAL = { T1: "done", T2: "done", T3: "done", T4: "current" };

/** The task list as it stands when the plan is first locked. */
export const INITIAL_TASKS = base.map((t) => ({ ...t, status: INITIAL[t.id] ?? "pending" }));

/** A task added after the owner approves the change request. */
export const T13 = {
  id: "T13",
  title: "Delete student (admin only)",
  goal: "An admin can remove a student, after a confirmation.",
  files: ["components/admin/delete-student-button.js", "app/api/students/[id]/route.js"],
  checks: ["Only an Admin sees the button", "A confirmation dialog explains what will be deleted", "Marks and report cards of the student are removed or archived as agreed", "The deletion is logged"],
  status: "pending",
  added: true,
};

/** The wording of tasks that depend on the owner's answers. */
export function withDecisions(tasks, decisions) {
  return tasks.map((t) => {
    if (t.id === "T7" && decisions.approval) {
      const rule = RULE_TEXT.approval[decisions.approval] ?? `Editing rule: ${decisions.approval}.`;
      return { ...t, checks: t.checks.map((c, i) => (i === 1 ? `Approved marks follow the editing rule: ${rule}` : c)) };
    }
    if (t.id === "T9" && decisions.reportCards === "print") {
      return { ...t, title: "Report card print layout", goal: "Print a report card on one A4 page at school.", checks: t.checks.map((c, i) => (i === 0 ? "A printed card has the same content as the screen" : c)) };
    }
    return t;
  });
}
