"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProjectIcon } from "@/components/project-icon";

/** Back link, project name, and the two tabs: Proposal | Prototype. */
export function ProjectSubNav({ project }) {
  const pathname = usePathname();
  const base = `/projects/${project.slug}`;
  const Heading = pathname === base ? "p" : "h1";
  const tabs = [
    { href: `${base}/docs`, label: "Proposal" },
    { href: `${base}/prototype`, label: "Prototype" },
  ];
  return (
    <div className="border-b border-line pt-base">
      <Link href="/" className="-ml-tight inline-flex min-h-11 items-center gap-tight rounded-full px-tight text-sm font-medium text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" />
        All projects
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-x-group">
        {/* The project name is the page heading on the docs and prototype pages (the landing page has its own). */}
        <Heading className="pb-tight text-2xl font-semibold tracking-tight">
          <Link href={base} className="flex items-center gap-tight text-ink">
          <span className="flex size-9 items-center justify-center rounded-field bg-accent-tint text-accent">
            <ProjectIcon name={project.icon} className="size-5" />
          </span>
          {project.name}
        </Link>
        </Heading>
        <nav aria-label={`${project.name} sections`} className="flex">
          {tabs.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`-mb-px flex min-h-11 items-center border-b-2 px-base text-base font-medium transition-colors ${
                  active ? "border-accent text-accent" : "border-transparent text-ink-soft hover:text-ink"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
