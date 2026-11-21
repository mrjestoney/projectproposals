import { notFound } from "next/navigation";
import { ProjectSubNav } from "@/components/project-sub-nav";
import { accentStyle, getProject, projectSlugs } from "@/lib/projects";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export default async function ProjectLayout({ children, params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <div style={accentStyle(slug)}>
      <ProjectSubNav project={project} />
      {children}
    </div>
  );
}
