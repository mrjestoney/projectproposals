/** Centred message for empty or "coming soon" areas. `icon` is a rendered lucide icon, `action` an optional button. */
export function EmptyState({ icon, title, children, action, className = "" }) {
  return (
    <div className={`flex flex-col items-center px-base py-block text-center ${className}`}>
      {icon ? (
        <span aria-hidden="true" className="mb-base flex size-14 items-center justify-center rounded-full bg-accent-tint text-accent">
          {icon}
        </span>
      ) : null}
      <h2 className="text-xl font-medium text-ink">{title}</h2>
      {children ? <p className="mt-tight max-w-[32rem] text-ink-soft">{children}</p> : null}
      {action ? <div className="mt-group">{action}</div> : null}
    </div>
  );
}
