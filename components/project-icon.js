import { ClipboardCheck, Cpu, LayoutTemplate, NotebookPen, PlayCircle } from "lucide-react";

const icons = { PlayCircle, LayoutTemplate, NotebookPen, ClipboardCheck, Cpu };

/** The lucide icon named in lib/projects.js. */
export function ProjectIcon({ name, className = "size-6" }) {
  const Icon = icons[name] ?? PlayCircle;
  return <Icon className={className} aria-hidden="true" />;
}
