"use client";

import { useId } from "react";

/**
 * Pill-shaped single choice: options = [{ value, label, icon? }]. Works like a radio group (arrow keys move the choice).
 * Controlled: value + onChange(value).
 */
export function SegmentedControl({ options, value, onChange, label, className = "" }) {
  const name = useId();
  return (
    <div role="radiogroup" aria-label={label} className={`inline-flex max-w-full overflow-x-auto rounded-full border border-line bg-field p-hair ${className}`}>
      {options.map((o) => (
        <label
          key={o.value}
          className="relative cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand rounded-full"
        >
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="peer sr-only"
          />
          <span className="flex min-h-9 items-center gap-hair rounded-full px-base text-sm font-medium whitespace-nowrap text-ink-soft transition-colors peer-checked:bg-primary peer-checked:text-white hover:text-ink peer-checked:hover:text-white">
            {o.icon}
            {o.label}
          </span>
        </label>
      ))}
    </div>
  );
}
