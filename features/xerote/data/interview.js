// Mock interview for a made-up "School Results App" (teachers enter marks; the system calculates grades and
// positions; parents view report cards). 12 answered questions, 2 open questions, and 1 contradiction to resolve.

export const CATEGORIES = ["Purpose", "Users", "Features", "Data", "Screens", "Rules", "Tools"];

/** Answered questions (shown as chat bubbles). */
export const ANSWERED = [
  { id: "q1", cat: "Purpose", q: "What problem should this app solve, and for whom?", a: "Teachers at our secondary school lose days calculating grades and positions by hand. I want teachers to enter marks once and the system to do the rest, and parents to see report cards." },
  { id: "q2", cat: "Purpose", q: "How will you know it is working well?", a: "Report cards for a whole class are ready within an hour of the last marks being entered, with no calculation mistakes." },
  { id: "q3", cat: "Users", q: "Who will use it, and what can each person do?", a: "Three roles. Admin manages classes, students and teachers. Teachers enter marks for their own subjects. Parents only view their own child's report card." },
  { id: "q4", cat: "Users", q: "How many people will use it, and on what devices?", a: "About 40 teachers and 900 students, so around 900 parent accounts. Most people use phones with limited data." },
  { id: "q5", cat: "Features", q: "List the features in the order you need them.", a: "Marks entry, grades, class positions, head teacher approval, report cards, and a parent view." },
  { id: "q6", cat: "Features", q: "What does “done” mean for marks entry?", a: "A teacher picks a class and a subject, types the marks in a table, and saves. Marks must be from 0 to 100." },
  { id: "q7", cat: "Features", q: "What should happen if a teacher types a mark above 100, or a letter?", a: "Show an error next to that row and do not save it." },
  { id: "q8", cat: "Data", q: "What information must the app store?", a: "Schools, classes, students, subjects, marks, and report cards." },
  { id: "q9", cat: "Data", q: "Is student information private?", a: "Yes. A parent must only ever see their own child. Teachers only see the classes they teach. Report cards are only printed at school and handed to parents at the end of term." },
  { id: "q10", cat: "Screens", q: "Which screens do you need?", a: "Login, marks entry, class results, the report card (parents can download it on their phone), and admin lists of students and teachers." },
  { id: "q11", cat: "Tools", q: "Which coding AI will you use, and where will the app be hosted?", a: "Claude Code. Hosting on Vercel with a Postgres database." },
  { id: "q12", cat: "Tools", q: "Is there any existing code?", a: "No. We start from an empty Next.js project." },
];

/** Open questions with quick replies. allowCustom = also show a text box. */
export const OPEN = [
  {
    id: "q13",
    cat: "Rules",
    q: "Can a teacher edit marks after the head teacher approves them?",
    chips: ["No, locked", "Yes, with a reason logged", "Only the admin can"],
  },
  {
    id: "q14",
    cat: "Rules",
    q: "Which grading scale should be used?",
    chips: ["NECTA A–F (A=75–100, B=65–74, C=45–64, D=30–44, F=0–29)", "Custom"],
    custom: true,
  },
];

/** Two earlier answers that disagree. */
export const CONTRADICTION = {
  cat: "Screens",
  said: [
    "“Report cards are only printed at school and handed to parents.” (your answer about privacy)",
    "“The report card (parents can download it on their phone).” (your answer about screens)",
  ],
  question: "Which one is right?",
  options: [
    { id: "download", label: "Parents can download report cards" },
    { id: "print", label: "Report cards are only printed at school" },
  ],
};

export const RULE_TEXT = {
  approval: {
    "No, locked": "Once the head teacher approves a class's marks, they are locked. Nobody can edit them.",
    "Yes, with a reason logged": "A teacher can edit approved marks only by entering a reason. Every change is logged.",
    "Only the admin can": "Only an admin can change approved marks. Every change is logged.",
  },
  reportCards: {
    download: "Parents can download their child's report card as a PDF on their phone.",
    print: "Report cards are printed at school only. Parents cannot download them.",
  },
};
