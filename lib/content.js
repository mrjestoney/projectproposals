import fs from "node:fs";
import path from "node:path";

// Proposal text lives in content/projects/<slug>.md. Read once at module scope (the files never change at runtime).
const dir = path.join(process.cwd(), "content", "projects");
const cache = new Map();

export function getProposal(slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  if (!cache.has(slug)) {
    try {
      cache.set(slug, fs.readFileSync(path.join(dir, `${slug}.md`), "utf8"));
    } catch {
      cache.set(slug, null);
    }
  }
  return cache.get(slug);
}

/** First paragraph after the "## Summary" heading, with markdown emphasis removed. */
export function getSummary(markdown) {
  const m = markdown.match(/^## Summary\s*\n+([\s\S]*?)(?:\n\s*\n|$)/m);
  return m ? m[1].replace(/\*\*|\*|`/g, "").replace(/\s*\n\s*/g, " ").trim() : "";
}

/** Same algorithm as rehype-slug (github-slugger): lowercase, drop punctuation, spaces to hyphens, number duplicates. */
function makeSlugger() {
  const seen = new Map();
  return (text) => {
    const base = text
      .toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}\p{Pc} \-]/gu, "")
      .replace(/ /g, "-");
    let slug = base;
    if (seen.has(slug)) {
      do {
        seen.set(base, seen.get(base) + 1);
        slug = `${base}-${seen.get(base)}`;
      } while (seen.has(slug));
    }
    seen.set(slug, 0);
    return slug;
  };
}

/** Headings (## and ###) for the table of contents. Skips fenced code blocks. */
export function getHeadings(markdown) {
  const slug = makeSlugger();
  const out = [];
  let fenced = false;
  for (const line of markdown.split("\n")) {
    if (line.startsWith("```")) fenced = !fenced;
    if (fenced) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*$/);
    if (!m) continue;
    const text = m[2].replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\*\*|\*|`/g, "");
    out.push({ level: m[1].length, text, id: slug(text) });
  }
  return out;
}
