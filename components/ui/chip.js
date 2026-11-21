/** A small label. tone: neutral | accent | success | warning | danger. */
const tones = {
  neutral: "border-line bg-field text-ink-soft",
  accent: "border-transparent bg-accent-tint text-accent",
  success: "border-transparent bg-tint text-success",
  warning: "border-transparent bg-highlight text-ink",
  danger: "border-transparent bg-tint text-danger",
};

export function Chip({ tone = "neutral", className = "", ...props }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-hair rounded-full border px-tight py-hair text-sm leading-tight font-medium ${tones[tone]} ${className}`}
      {...props}
    />
  );
}
