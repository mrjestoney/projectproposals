import Link from "next/link";

const base =
  "press inline-flex items-center justify-center gap-tight rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-60 whitespace-nowrap";
const variants = {
  primary: "btn-primary",
  secondary: "border border-line bg-field text-ink hover:border-line-hover active:bg-tint",
  ghost: "text-ink-soft hover:bg-tint hover:text-ink",
};
const sizes = {
  md: "h-11 px-group text-base",
  lg: "h-12 px-section text-base",
  sm: "h-9 px-base text-sm",
};

export function buttonClass({ variant = "primary", size = "md", full = false, className = "" } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${className}`.trim();
}

/** A button. Variants: primary (green pill), secondary (bordered), ghost. */
export function Button({ variant, size, full, className, type = "button", ...props }) {
  return <button type={type} className={buttonClass({ variant, size, full, className })} {...props} />;
}

/** A link that looks like a button. */
export function ButtonLink({ variant, size, full, className, ...props }) {
  return <Link className={buttonClass({ variant, size, full, className })} {...props} />;
}
