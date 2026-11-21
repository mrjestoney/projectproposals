import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { pageMeta } from "@/lib/meta";
import { CREDITS } from "@/features/hardware-lab/data/part-map";

export const metadata = pageMeta("About", "What this collection is and how to use it.");

const steps = [
  ["Pick a project", "Open any of the five projects from the home page."],
  ["Read the proposal", "The Proposal tab explains the problem, the idea, how it would be built, and the risks."],
  ["Try the prototype", "The Prototype tab is a clickable demo. Use “How to use this demo” at the top, and “Reset demo” to start over."],
];

export default function About() {
  return (
    <div className="max-w-3xl py-section md:py-block">
      <h1 className="text-[2rem] leading-tight font-medium tracking-tight text-brand sm:text-4xl">About this collection</h1>
      <p className="mt-base text-lg text-ink-soft">
        This is a small set of five software project proposals, each with a written proposal and a working prototype, made to
        be read and tried on a phone or a computer.
      </p>

      <h2 className="mt-section text-2xl font-semibold tracking-tight">How to use it</h2>
      <ol className="mt-base space-y-base">
        {steps.map(([title, text], i) => (
          <li key={title} className="flex gap-base">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tint text-sm font-semibold text-brand tabular-nums">
              {i + 1}
            </span>
            <p>
              <strong className="font-semibold">{title}.</strong> <span className="text-ink-soft">{text}</span>
            </p>
          </li>
        ))}
      </ol>

      <Card className="mt-section border-l-[3px] border-l-warning">
        <h2 className="text-lg font-semibold">The prototypes use mock data</h2>
        <p className="mt-tight text-ink-soft">
          There is no backend, no database and no real AI. Where a prototype shows an “AI” step, it is a short simulated
          delay followed by a pre-written result. Nothing you type is stored or sent anywhere.
        </p>
      </Card>

      <h2 className="mt-section text-2xl font-semibold tracking-tight">Credits &amp; notes</h2>
      <p className="mt-base text-ink-soft">
        The 3D Hardware Lab is drawn in the browser with{" "}
        <a href="https://threejs.org" target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-4">
          three.js
        </a>{" "}
        (MIT licence) and{" "}
        <a href="https://github.com/pmndrs/react-three-fiber" target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-4">
          React Three Fiber
        </a>
        .{" "}
        {CREDITS.length
          ? "3D models: "
          : "Every part of the PC, the monitor, the keyboard and the mouse is built in code. No 3D models from other authors are used."}
      </p>
      <p className="mt-base text-ink-soft">
        The Biology questions and answers in the Daftari prototype are sample content. They are written to Form 2 level but have not been reviewed by a Biology teacher yet.
      </p>
      {CREDITS.length ? (
        <ul className="mt-tight list-disc pl-group text-ink-soft">
          {CREDITS.map((c) => (
            <li key={c.url}>
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-4">
                {c.title}
              </a>{" "}
              by {c.author}, {c.licence}
            </li>
          ))}
        </ul>
      ) : null}

      <ButtonLink href="/" size="lg" className="mt-section">
        See the projects
      </ButtonLink>
    </div>
  );
}
