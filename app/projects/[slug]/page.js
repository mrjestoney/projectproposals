import { notFound } from "next/navigation";
import { BookOpen, FlaskConical } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { getProposal, getSummary } from "@/lib/content";
import { getProject, projectSlugs } from "@/lib/projects";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const project = getProject((await params).slug);
  return project ? { title: project.name, description: project.tagline } : {};
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  const markdown = project ? getProposal(slug) : null;
  if (!project || !markdown) notFound();
  const summary = getSummary(markdown);

  return (
    <div className="max-w-3xl py-section md:py-block">
      <h1 className="text-[2rem] leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">{project.name}</h1>
      <p className="mt-base border-l-[3px] border-accent pl-base text-xl text-ink">{project.promise}</p>
      <p className="mt-group text-lg text-ink-soft">{summary}</p>

      <ul className="mt-group flex flex-wrap gap-tight" aria-label="Key facts">
        <li>
          <Chip tone="accent">{project.type}</Chip>
        </li>
        <li>
          <Chip>{project.status}</Chip>
        </li>
        {project.tags.map((t) => (
          <li key={t}>
            <Chip>{t}</Chip>
          </li>
        ))}
      </ul>

      <div className="mt-section flex flex-col gap-base sm:flex-row">
        <ButtonLink href={`/projects/${slug}/docs`} size="lg" className="sm:min-w-64">
          <BookOpen className="size-5" aria-hidden="true" />
          Read the proposal
        </ButtonLink>
        <ButtonLink href={`/projects/${slug}/prototype`} variant="secondary" size="lg" className="sm:min-w-64">
          <FlaskConical className="size-5" aria-hidden="true" />
          Try the prototype
        </ButtonLink>
      </div>
    </div>
  );
}
