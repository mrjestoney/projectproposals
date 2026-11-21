import { notFound } from "next/navigation";
import { PrototypeLoader } from "@/components/prototype-loader";
import { pageMeta } from "@/lib/meta";
import { getProject, projectSlugs } from "@/lib/projects";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const project = getProject((await params).slug);
  return project ? pageMeta(`${project.name} · Prototype`, `Try the ${project.name} prototype (mock data).`) : {};
}

export default async function PrototypePage({ params }) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return <PrototypeLoader slug={slug} />;
}
