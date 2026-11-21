// Mock scan: a handwritten 3-page exam, "Form 2 Biology Test — 2025" (made up).
// Text uses {{id}} markers for words Daftari is not sure it read correctly (see UNCERTAIN).

export const SCAN_TITLE = "Form 2 Biology Test — 2025";

/** kind: school | title | meta | section | instr | q | sub. no = question number or sub-label. */
export const PAGES = [
  {
    n: 1,
    lines: [
      { kind: "school", text: "MWANGAZA SECONDARY SCHOOL" },
      { kind: "title", text: "BIOLOGY TEST — FORM TWO — 2025" },
      { kind: "meta", text: "Time: 1 hr    Marks: 30    Teacher: {{neema}} Joseph" },
      { kind: "section", text: "SECTION A (12 marks)" },
      { kind: "instr", text: "Answer all questions in this section." },
      { kind: "q", no: "1.", text: "Define the term {{photosynthesis}}.", marks: "[2 marks]" },
      { kind: "q", no: "2.", text: "State one function of the {{chloroplast}} in a plant cell.", marks: "[2 marks]" },
      { kind: "q", no: "3.", text: "Name the part of a cell that controls all its activities.", marks: "[2 marks]" },
    ],
  },
  {
    n: 2,
    lines: [
      { kind: "q", no: "4.", text: "Define {{osmosis}}.", marks: "[2 marks]" },
      { kind: "q", no: "5.", text: "Give two differences between a plant cell and an animal cell.", marks: "[2 marks]" },
      {
        kind: "q",
        no: "6.",
        text: "Name the process by which food is broken down inside {{mitochondria}} to release energy.",
        marks: "[2 marks]",
      },
    ],
  },
  {
    n: 3,
    lines: [
      { kind: "section", text: "SECTION B (18 marks)" },
      { kind: "instr", text: "Answer both questions. Marks are shown in brackets." },
      { kind: "q", no: "7.", text: "" },
      {
        kind: "sub",
        no: "(a)",
        text: "Draw a labelled plant cell showing the cell wall, {{nucleus}} and vacuole.",
        marks: "{{m7a}}",
      },
      { kind: "sub", no: "(b)", text: "Explain why a plant cell does not burst in pure water.", marks: "[3 marks]" },
      { kind: "q", no: "8.", text: "" },
      {
        kind: "sub",
        no: "(a)",
        text: "Explain how {{diffusion}} helps a leaf to get carbon dioxide.",
        marks: "[4 marks]",
      },
      { kind: "sub", no: "(b)", text: "Name the three main food classes.", marks: "[3 marks]" },
      { kind: "sub", no: "(c)", text: "State the chemical test for starch.", marks: "[3 marks]" },
    ],
  },
];

/**
 * Words Daftari highlights. read = what it read; right = what the page really says; options = suggestions shown
 * (the right one is always among them, but not always first).
 */
export const UNCERTAIN = {
  neema: { read: "Nema", right: "Neema", options: ["Nema", "Neema", "Nina"] },
  photosynthesis: { read: "photosyntesis", right: "photosynthesis", options: ["photosynthesis", "photosyntheses", "photosyntasis"] },
  chloroplast: { read: "chlorplast", right: "chloroplast", options: ["chlorplast", "chloroplast", "chloroplasts"] },
  osmosis: { read: "osmusis", right: "osmosis", options: ["osmosis", "osmosys", "osmusis"] },
  mitochondria: { read: "mitocondria", right: "mitochondria", options: ["mitochondria", "mitochondrion", "mitocondria"] },
  nucleus: { read: "nucleas", right: "nucleus", options: ["nucleas", "nucleus", "nuclei"] },
  m7a: { read: "[S marks]", right: "[5 marks]", options: ["[5 marks]", "[3 marks]", "[S marks]"] },
  diffusion: { read: "difusion", right: "diffusion", options: ["diffusion", "defusion", "difusion"] },
};

export const UNCERTAIN_IDS = Object.keys(UNCERTAIN);
