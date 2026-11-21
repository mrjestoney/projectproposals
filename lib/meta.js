/** Page metadata with matching Open Graph (link preview) title and description. */
export function pageMeta(title, description) {
  return { title, description, openGraph: { title, description, type: "website" } };
}
