import { notFound } from "next/navigation";
import { Hammer } from "lucide-react";
import { BuildReplayPrototype } from "@/features/build-replay";
import { PrototypeFrame } from "@/components/prototype-frame";
import { EmptyState } from "@/components/ui/empty-state";
import { getProject, projectSlugs } from "@/lib/projects";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const project = getProject((await params).slug);
  return project ? { title: `${project.name} · Prototype`, description: `Try the ${project.name} prototype (mock data).` } : {};
}

export default async function PrototypePage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  if (slug === "build-replay") return <BuildReplayPrototype />;
  return (
    <PrototypeFrame title={project.name}>
      <EmptyState icon={<Hammer className="size-7" />} title="Prototype coming in the next task">
        The {project.name} prototype is not built yet. You can read the proposal in the meantime.
      </EmptyState>
    </PrototypeFrame>
  );
}
