import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DocTocDesktop, DocTocMobile } from "@/components/doc-toc";
import { getHeadings } from "@/lib/content";
import { accentStyle, getNeighbours, projects } from "@/lib/projects";

const components = {
  // External links open in a new tab; in-page (#...) and app links stay.
  a({ href = "", children, node, ...props }) {
    const external = /^https?:\/\//.test(href);
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    ) : (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
  // Wide tables scroll inside their own box (and can be scrolled with the keyboard).
  table({ children, node, ...props }) {
    return (
      <div className="table-wrap" tabIndex={0} role="region" aria-label="Table, scrollable">
        <table {...props}>{children}</table>
      </div>
    );
  },
};

/**
 * Renders a proposal (markdown string) with: left project sidebar and right "On this page" list on desktop,
 * a collapsible "On this page" on mobile, and previous/next project links at the bottom.
 */
export function DocViewer({ slug, markdown }) {
  const headings = getHeadings(markdown);
  const { prev, next } = getNeighbours(slug);

  return (
    <div style={accentStyle(slug)} className="grid gap-x-section py-group lg:grid-cols-[13rem_minmax(0,1fr)_14rem] lg:py-section xl:grid-cols-[14rem_minmax(0,1fr)_15rem]">
      <nav aria-label="Projects" className="sticky top-20 hidden self-start lg:col-start-1 lg:row-start-1 lg:block">
        <p className="mb-tight text-xs font-semibold tracking-wide text-hint uppercase">Projects</p>
        <ul className="space-y-hair">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/projects/${p.slug}/docs`}
                aria-current={p.slug === slug ? "page" : undefined}
                className={`block rounded-field px-tight py-tight text-sm leading-snug transition-colors ${
                  p.slug === slug ? "bg-accent-tint font-medium text-accent" : "text-ink-soft hover:bg-tint hover:text-ink"
                }`}
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 lg:col-start-2 lg:row-start-1">
        <DocTocMobile headings={headings} />
        <article className="prose-doc">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
            {markdown}
          </ReactMarkdown>
        </article>

        <nav aria-label="Other proposals" className="mt-block grid gap-base border-t border-line pt-group sm:grid-cols-2">
          {[
            { p: prev, dir: "Previous", Icon: ArrowLeft },
            { p: next, dir: "Next", Icon: ArrowRight },
          ].map(({ p, dir, Icon }) => (
            <Link
              key={dir}
              href={`/projects/${p.slug}/docs`}
              style={accentStyle(p.slug)}
              className={`press flex items-center gap-base rounded-field border border-line bg-field p-base hover:border-line-hover ${
                dir === "Next" ? "flex-row-reverse text-right sm:col-start-2" : ""
              }`}
            >
              <Icon className="size-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-sm text-hint">{dir} proposal</span>
                <span className="block truncate font-semibold text-ink">{p.name}</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <DocTocDesktop headings={headings} />
    </div>
  );
}
