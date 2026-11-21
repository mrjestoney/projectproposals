import { handwriting } from "../fonts";
import { PAGES, UNCERTAIN } from "../data/pages";

const ruled = {
  backgroundImage: "repeating-linear-gradient(transparent 0, transparent 27px, color-mix(in srgb, var(--paper-ink) 16%, transparent) 27px, color-mix(in srgb, var(--paper-ink) 16%, transparent) 28px)",
  backgroundPositionY: "6px",
};

/** The true text of a line (what the paper really says): {{id}} markers are replaced by the right word. */
export const trueText = (text) => text.replace(/\{\{(\w+)\}\}/g, (_, id) => UNCERTAIN[id].right);

function Line({ line }) {
  const t = trueText(line.text ?? "");
  const m = line.marks ? trueText(line.marks) : null;
  switch (line.kind) {
    case "school":
      return <p className="text-center text-xl font-bold tracking-wide">{t}</p>;
    case "title":
      return <p className="text-center text-lg font-bold underline">{t}</p>;
    case "meta":
      return <p className="text-lg">{t}</p>;
    case "section":
      return <p className="mt-tight text-lg font-bold">{t}</p>;
    case "instr":
      return <p className="text-lg italic">{t}</p>;
    case "q":
      return (
        <p className="flex gap-tight text-lg">
          <span className="w-6 shrink-0">{line.no}</span>
          <span>
            {t} {m}
          </span>
        </p>
      );
    default:
      return (
        <p className="flex gap-tight pl-group text-lg">
          <span className="w-8 shrink-0">{line.no}</span>
          <span>
            {t} {m}
          </span>
        </p>
      );
  }
}

/** One page of the handwritten exam: lined paper, handwriting font. Looks like a photo of real paper in both themes. */
export function HandwrittenPage({ n, className = "" }) {
  const page = PAGES[n - 1];
  return (
    <div
      className={`${handwriting.className} rounded-field bg-paper px-base py-base leading-7 text-paper-ink ${className}`}
      style={ruled}
    >
      {page.lines.map((line, i) => (
        <Line key={i} line={line} />
      ))}
    </div>
  );
}
