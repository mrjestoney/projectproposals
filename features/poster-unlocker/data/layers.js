import { PALETTE } from "./palette";

// The 11 layers of the mock poster "Science Fair 2026", bottom to top. Flat mode and unlocked mode draw this same data.
// size = font size in "cqw" (percent of the poster's width); color = text colour (or fill, for shapes).
const [BLUE, TEAL, AMBER, WHITE, SKY] = PALETTE.map((p) => p.value);

export const LAYERS = [
  { id: "bg", type: "background", name: "Background", note: "Rebuilt by the AI", defaults: { color: TEAL } },
  { id: "band", type: "shape", name: "Diagonal band", defaults: { color: AMBER } },
  { id: "logo", type: "logo", name: "School logo", defaults: { color: WHITE, size: 3.1 } },
  { id: "title", type: "text", name: "Title", defaults: { color: WHITE, size: 12, weight: "800", font: 0, align: "left" } },
  { id: "subtitle", type: "text", name: "Subtitle", defaults: { color: SKY, size: 4.6, weight: "500", font: 0, align: "left" } },
  { id: "illustration", type: "image", name: "Illustration", defaults: { color: WHITE } },
  { id: "date", type: "text", name: "Date", defaults: { color: BLUE, size: 5.4, weight: "800", font: 0, align: "left" } },
  { id: "time", type: "text", name: "Time", defaults: { color: BLUE, size: 4.4, weight: "700", font: 0, align: "left" } },
  { id: "venue", type: "text", name: "Venue", defaults: { color: BLUE, size: 4.4, weight: "700", font: 0, align: "left" } },
  { id: "cta", type: "pill", name: "Call to action", defaults: { color: WHITE, size: 4.4, weight: "700", font: 0, align: "center" } },
  { id: "contact", type: "text", name: "Contact", defaults: { color: WHITE, size: 3.8, weight: "500", font: 0, align: "left" } },
];

/** Things the AI is not sure about. Cleared with "Looks right". */
export const FLAGS = {
  subtitle: "Font matched at 86%. Closest match: Poppins Medium.",
  contact: "One character is low-confidence (“000 000”). Check this number.",
};

export const TEXT_IDS = ["title", "subtitle", "date", "time", "venue", "cta", "contact"];
export const layerDef = (id) => LAYERS.find((l) => l.id === id);
