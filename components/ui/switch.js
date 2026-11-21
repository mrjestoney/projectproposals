"use client";

/** On/off switch with a visible label (or a hidden one for compact rows: hideLabel). */
export function Switch({ checked, onChange, label, hideLabel = false, className = "" }) {
  return (
    <label className={`inline-flex min-h-11 cursor-pointer items-center gap-tight ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-line-hover"}`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-hair left-hair size-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`}
        />
        <span className="sr-only">{label}</span>
      </button>
      {hideLabel ? null : <span className="text-sm font-medium text-ink">{label}</span>}
    </label>
  );
}
