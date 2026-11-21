import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import { DocViewer } from "@/components/doc-viewer";
import { getProposal } from "@/lib/content";
import { getProject, projectSlugs } from "@/lib/projects";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const project = getProject((await params).slug);
  return project ? pageMeta(`${project.name} · Proposal`, project.tagline) : {};
}

export default async function DocsPage({ params }) {
  const { slug } = await params;
  const markdown = getProject(slug) ? getProposal(slug) : null;
  if (!markdown) notFound();
  return <DocViewer slug={slug} markdown={markdown} />;
}
