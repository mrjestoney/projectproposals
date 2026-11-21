import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { ProjectIcon } from "@/components/project-icon";
import { accentStyle } from "@/lib/projects";

/** Name, tagline, tags, accent. The whole card is one link to the project landing page. */
export function ProjectCard({ project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      style={accentStyle(project.slug)}
      className="group press flex h-full flex-col rounded-field border border-line border-t-[3px] border-t-accent bg-field p-group transition-colors hover:border-line-hover hover:border-t-accent active:bg-accent-tint"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-12 items-center justify-center rounded-field bg-accent-tint text-accent">
          <ProjectIcon name={project.icon} className="size-6" />
        </span>
        <span className="text-sm font-medium text-hint tabular-nums">0{project.order}</span>
      </div>
      <h3 className="mt-base text-xl font-semibold tracking-tight text-ink">{project.name}</h3>
      <p className="mt-tight text-ink-soft">{project.tagline}</p>
      <ul className="mt-base flex flex-wrap gap-tight" aria-label="Tags">
        {project.tags.slice(0, 3).map((t) => (
          <li key={t}>
            <Chip>{t}</Chip>
          </li>
        ))}
      </ul>
      <span className="mt-auto flex items-center gap-tight pt-group font-medium text-accent">
        Open project
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-hair" aria-hidden="true" />
      </span>
    </Link>
  );
}
