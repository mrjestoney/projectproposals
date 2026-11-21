"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Bottom sheet on phones, centred dialog from 768px up. Built on the native <dialog>: traps focus, closes on Escape,
 * dims the page. A click on the dimmed area or the close button calls onClose. Props: open, onClose, title, children.
 */
export function Sheet({ open, onClose, title, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="animate-sheet m-0 mt-auto h-fit max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-field border-t border-line bg-field p-group pb-[calc(var(--spacing-group)+env(safe-area-inset-bottom))] md:animate-pop-in md:m-auto md:max-w-xl md:rounded-field md:border md:shadow-pop"
    >
      {open ? (
        <>
          <div className="flex items-start justify-between gap-base">
            <h2 className="text-xl leading-snug font-medium">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mt-tight -mr-tight flex size-11 shrink-0 items-center justify-center text-ink-soft hover:text-ink"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-base">{children}</div>
        </>
      ) : null}
    </dialog>
  );
}
