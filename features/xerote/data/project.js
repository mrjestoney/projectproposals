// The locked plan for the made-up "School Results App": spec cards.

export const PROJECT = {
  name: "School Results App",
  purpose: "Teachers enter marks. The system calculates grades and positions. Parents view report cards.",
  tool: "Claude Code",
  hosting: "Vercel",
  stack: "Next.js + Postgres",
};

export const ROLES = {
  head: ["Permission", "Admin", "Teacher", "Parent"],
  rows: [
    ["Manage classes, students and teachers", "Yes", "No", "No"],
    ["Enter marks (own subjects)", "Yes", "Yes", "No"],
    ["Approve marks", "Yes", "No", "No"],
    ["View class results", "Yes", "Own classes", "No"],
    ["View a report card", "Yes", "Own classes", "Own child"],
  ],
};

export const FEATURES = [
  { name: "Marks entry", done: "A teacher can pick a class and subject, type marks from 0 to 100, and save. Invalid marks are refused." },
  { name: "Grades", done: "Every saved mark shows the right grade for the chosen grading scale." },
  { name: "Class positions", done: "Students are ranked in each class by total and average, with ties handled the same way every time." },
  { name: "Head teacher approval", done: "The head teacher can approve a class's marks; approved marks follow the editing rule." },
  { name: "Report cards", done: "A report card shows each subject's mark, grade, position and a comment." },
  { name: "Parent view", done: "A parent can see only their own child's report card." },
];

export const ENTITIES = [
  ["School", "has many Classes"],
  ["Class", "has many Students"],
  ["Student", "belongs to a Class"],
  ["Subject", "taught in many Classes"],
  ["Mark", "one Student, one Subject, one term"],
  ["ReportCard", "one Student, one term"],
];

export const SCREENS = ["Login", "Marks entry", "Class results", "Report card", "Admin: students", "Admin: teachers"];

export const CONSTRAINTS = ["Mobile first (works well on small phones)", "Swahili and English", "Works on slow connections", "Private by default: parents see only their own child"];
