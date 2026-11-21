const ADD = "bg-[color-mix(in_srgb,var(--success)_16%,transparent)]";
const DEL = "bg-[color-mix(in_srgb,var(--danger)_16%,transparent)]";

/** Added/removed lines of one file in one step. Lines start with "+", "-" or a space. */
export function DiffBlock({ file, text, isNew }) {
  return (
    <div className="overflow-hidden rounded-field border border-line bg-code">
      <div className="flex items-center justify-between gap-tight border-b border-line px-base py-tight">
        <span className="min-w-0 truncate font-mono text-[13px] font-medium">{file}</span>
        <span className="shrink-0 text-xs font-semibold tracking-wide text-hint">{isNew ? "NEW FILE" : "CHANGED"}</span>
      </div>
      <pre className="overflow-x-auto py-tight font-mono text-[13px] leading-6">
        <code className="block min-w-max">
          {text.split("\n").map((line, i) => {
            const c = line[0];
            return (
              <span key={i} className={`flex pr-base ${c === "+" ? ADD : c === "-" ? DEL : ""}`}>
                <span aria-hidden="true" className="w-8 shrink-0 text-center text-hint select-none">
                  {c === "+" ? "+" : c === "-" ? "−" : ""}
                </span>
                {c === "+" || c === "-" ? <span className="sr-only">{c === "+" ? "Added: " : "Removed: "}</span> : null}
                <span className="whitespace-pre">{line.slice(1) || " "}</span>
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

/** A whole file with line numbers. */
export function FullCode({ code }) {
  return (
    <pre className="overflow-x-auto rounded-field border border-line bg-code py-tight font-mono text-[13px] leading-6">
      <code className="block min-w-max">
        {code.split("\n").map((line, i) => (
          <span key={i} className="flex pr-base">
            <span aria-hidden="true" className="w-10 shrink-0 pr-tight text-right text-hint select-none">
              {i + 1}
            </span>
            <span className="whitespace-pre">{line || " "}</span>
          </span>
        ))}
      </code>
    </pre>
  );
}

/** A single snippet (used for connections). */
export function Snippet({ file, code }) {
  return (
    <div className="overflow-hidden rounded-field border border-line bg-code">
      <div className="border-b border-line px-base py-tight font-mono text-[13px] font-medium">{file}</div>
      <pre className="overflow-x-auto p-base font-mono text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/** The tree-like "How it connects" map. */
export function MapBlock({ text }) {
  return (
    <div>
      <p className="mb-tight text-sm font-semibold text-ink-soft">How it connects</p>
      <pre className="overflow-x-auto rounded-field border border-line bg-code p-base font-mono text-[13px] leading-6">{text}</pre>
    </div>
  );
}

/** A fake terminal for command steps. */
export function Terminal({ command, output }) {
  return (
    <pre className="mt-tight overflow-x-auto rounded-field border border-line bg-code p-base font-mono text-[13px] leading-6">
      <span className="text-hint select-none">$ </span>
      {command}
      {"\n"}
      <span className="text-ink-soft">{output}</span>
    </pre>
  );
}
