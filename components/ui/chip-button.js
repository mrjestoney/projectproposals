/** A small clickable chip (file names, part names). `file` switches to the code font. */
export function ChipButton({ file = false, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-9 items-center rounded-full border border-line bg-field px-base text-sm font-medium text-ink transition-colors hover:border-line-hover hover:bg-tint ${
        file ? "font-mono text-[13px]" : ""
      } ${className}`}
      {...props}
    />
  );
}

/** A button that reads like a link, for "Step 5 · Customers can now choose a room". */
export function TextButton({ className = "", ...props }) {
  return (
    <button
      type="button"
      className={`min-h-9 text-left text-base font-medium text-accent underline underline-offset-4 hover:decoration-2 ${className}`}
      {...props}
    />
  );
}
