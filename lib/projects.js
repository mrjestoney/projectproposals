// Single source of truth for project metadata. Used by home cards, landing pages, nav and prev/next links.
// Accent colours are CSS variables (see app/globals.css): --accent-<slug> and --accent-<slug>-tint.

export const projects = [
  {
    order: 1,
    slug: "build-replay",
    name: "Build Replay",
    tagline: "Watch how any software was built, step by step, with the why.",
    promise: "You vibecoded it. Now watch how it was built.",
    type: "Open-source developer tool",
    status: "Concept + prototype",
    icon: "PlayCircle",
    tags: ["Developer tool", "Open source", "AI-assisted"],
  },
  {
    order: 2,
    slug: "poster-unlocker",
    name: "Poster Unlocker",
    tagline: "Turn any flat poster into an editable design.",
    promise: "Any poster. Editable in seconds.",
    type: "AI-assisted design tool",
    status: "Concept + prototype",
    icon: "LayoutTemplate",
    tags: ["Design", "Web app", "Swahili + English"],
  },
  {
    order: 3,
    slug: "daftari",
    name: "Daftari",
    tagline: "Show it your paper. It remembers your work. It writes your documents.",
    promise: "Never type the same thing twice again.",
    type: "Web app for teachers, secretaries and freelancers",
    status: "Concept + prototype",
    icon: "NotebookPen",
    tags: ["Education", "Documents", "Mobile + desktop"],
  },
  {
    order: 4,
    slug: "xerote",
    name: "Xerote",
    tagline: "An AI engineer that interviews you, then instructs your coding AI and never drifts from the plan.",
    promise: "Tell it what you want once. It makes sure the AI builds exactly that.",
    type: "Web app that manages AI coding agents",
    status: "Concept + prototype",
    icon: "ClipboardCheck",
    tags: ["AI agents", "Spec-driven", "Verification"],
  },
  {
    order: 5,
    slug: "hardware-lab",
    name: "3D Hardware Lab",
    tagline: "Learn computer hardware by exploring, building and fixing a PC in 3D.",
    promise: "Open a computer without a screwdriver.",
    type: "Web app for learning computer hardware in 3D",
    status: "Concept + prototype",
    icon: "Cpu",
    tags: ["Education", "3D", "Works on phones"],
  },
];

export const projectSlugs = projects.map((p) => p.slug);

export function getProject(slug) {
  return projects.find((p) => p.slug === slug) ?? null;
}

/** Previous and next project in order (wraps around). */
export function getNeighbours(slug) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}

/** Inline style that sets the per-project accent variables for everything inside. */
export function accentStyle(slug) {
  return { "--accent": `var(--accent-${slug})`, "--accent-tint": `var(--accent-${slug}-tint)` };
}
