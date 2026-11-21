/** Three simple line illustrations: stand-ins for a photo. "Replace image" cycles through them. Drawn in the layer's colour. */
export const ILLUSTRATION_NAMES = ["Flask", "Atom", "Microscope"];

export function Illustration({ variant, color }) {
  const common = { fill: "none", stroke: color, strokeWidth: 4, strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
      {variant === 0 ? (
        <g {...common}>
          <path d="M40 12h20M44 12v26L22 80a8 8 0 0 0 7 12h42a8 8 0 0 0 7-12L56 38V12" />
          <path d="M31 66h38" />
          <circle cx="46" cy="76" r="3" fill={color} />
          <circle cx="58" cy="72" r="2" fill={color} />
        </g>
      ) : null}
      {variant === 1 ? (
        <g {...common}>
          <circle cx="50" cy="50" r="6" fill={color} />
          <ellipse cx="50" cy="50" rx="40" ry="15" />
          <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(120 50 50)" />
        </g>
      ) : null}
      {variant === 2 ? (
        <g {...common}>
          <path d="M42 14l16 8-6 14-16-8z" />
          <path d="M47 33l-8 24" />
          <path d="M30 62a22 22 0 0 0 38 6" />
          <path d="M24 86h52M50 70v16" />
          <circle cx="60" cy="40" r="2" fill={color} />
        </g>
      ) : null}
    </svg>
  );
}

/** The made-up school emblem: a round badge with a sun. */
export function Emblem({ color }) {
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="6" />
      <circle cx="50" cy="56" r="16" fill={color} />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d="M50 22V10" stroke={color} strokeWidth="6" strokeLinecap="round" transform={`rotate(${i * 45 - 90 + 45} 50 56)`} />
      ))}
    </svg>
  );
}
