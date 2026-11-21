"use client";

import { useId, useRef } from "react";

/**
 * Underlined tabs. tabs = [{ id, label, content }]. Controlled: value + onChange(id). Arrow keys, Home and End move
 * between tabs. The panel for the active tab is rendered below.
 */
export function Tabs({ tabs, value, onChange, label, className = "" }) {
  const uid = useId();
  const refs = useRef({});
  const idx = tabs.findIndex((t) => t.id === value);

  function onKeyDown(e) {
    const keys = { ArrowRight: 1, ArrowLeft: -1 };
    let next = null;
    if (e.key in keys) next = (idx + keys[e.key] + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[tabs[next].id]?.focus();
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex overflow-x-auto overflow-y-hidden border-b border-line">
        {tabs.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              ref={(el) => (refs.current[t.id] = el)}
              role="tab"
              id={`${uid}-tab-${t.id}`}
              aria-selected={active}
              aria-controls={`${uid}-panel-${t.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(t.id)}
              className={`-mb-px min-h-11 shrink-0 border-b-2 px-base text-base font-medium whitespace-nowrap transition-colors ${
                active ? "border-accent text-accent" : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t) =>
        t.id === value ? (
          <div key={t.id} role="tabpanel" id={`${uid}-panel-${t.id}`} aria-labelledby={`${uid}-tab-${t.id}`} tabIndex={0} className="pt-base">
            {t.content}
          </div>
        ) : null,
      )}
    </div>
  );
}
