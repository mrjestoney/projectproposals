/** A flat bordered box. `as` lets it be an <article>, <section>, etc. */
export function Card({ as: Tag = "div", className = "", ...props }) {
  return <Tag className={`rounded-field border border-line bg-field p-base ${className}`} {...props} />;
}
