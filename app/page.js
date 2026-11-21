import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <div className="py-section md:py-block">
      <section className="max-w-3xl">
        <h1 className="text-[2rem] leading-tight font-medium tracking-tight text-balance text-brand sm:text-4xl lg:text-5xl">
          Five project proposals. Read each one, then try its prototype.
        </h1>
        <p className="mt-base text-lg text-ink-soft">
          Pick a project, read the proposal, then open the clickable prototype to see the idea working.
        </p>
        <p className="mt-tight text-sm text-hint">All prototypes use mock data. Nothing is sent anywhere.</p>
      </section>
      <section aria-labelledby="projects-heading" className="mt-section md:mt-block">
        <h2 id="projects-heading" className="sr-only">
          Projects
        </h2>
        <ul className="grid gap-base sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
