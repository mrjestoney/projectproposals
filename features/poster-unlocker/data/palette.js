// Colours of the mock poster ("detected" from the flat image). These are artwork colours, not interface colours.

export const PALETTE = [
  { name: "Deep blue", value: "#0b2a4a" },
  { name: "Teal", value: "#16a39a" },
  { name: "Amber", value: "#ffb703" },
  { name: "White", value: "#ffffff" },
  { name: "Sky", value: "#bdeff0" },
];

export const FONT_WEIGHTS = [
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra bold" },
];

/** Text on the amber pill and band stays dark; on dark colours it turns white. */
export const readableOn = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.6 ? "#0b2a4a" : "#ffffff";
};
