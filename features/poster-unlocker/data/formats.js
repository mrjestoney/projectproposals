// Position maps for the three poster formats. Units: the poster is W units wide and H units tall (W = 100).
// x, y = top-left corner; w, h = size (text boxes only need w); s = multiplier for the text size; r = rotation (degrees).

export const FORMATS = {
  "4:5": {
    label: "Poster 4:5", w: 100, h: 125, file: "JPG · 1080×1350",
    map: {
      bg: { x: 0, y: 0, w: 100, h: 125 },
      band: { x: -12, y: 71, w: 124, h: 26, r: -6 },
      logo: { x: 6, y: 5, w: 52, h: 10 },
      title: { x: 6, y: 19, w: 88, s: 1 },
      subtitle: { x: 6, y: 46, w: 62, s: 1 },
      illustration: { x: 57, y: 50, w: 38, h: 34 },
      date: { x: 6, y: 76, w: 70, s: 1 },
      time: { x: 6, y: 85, w: 70, s: 1 },
      venue: { x: 6, y: 92, w: 84, s: 0.94 },
      cta: { x: 6, y: 105, w: 56, h: 9, s: 1 },
      contact: { x: 6, y: 117, w: 80, s: 1 },
    },
  },
  "1:1": {
    label: "Square 1:1", w: 100, h: 100, file: "JPG · 1080×1080",
    map: {
      bg: { x: 0, y: 0, w: 100, h: 100 },
      band: { x: -12, y: 57.5, w: 124, h: 21, r: -5 },
      logo: { x: 5, y: 4, w: 50, h: 9 },
      title: { x: 5, y: 15, w: 90, s: 0.88 },
      subtitle: { x: 5, y: 36, w: 56, s: 0.92 },
      illustration: { x: 63, y: 36, w: 32, h: 28 },
      date: { x: 5, y: 63.5, w: 66, s: 0.95 },
      time: { x: 5, y: 70, w: 66, s: 0.95 },
      venue: { x: 5, y: 76, w: 86, s: 0.88 },
      cta: { x: 5, y: 85, w: 50, h: 8, s: 0.95 },
      contact: { x: 5, y: 95, w: 80, s: 0.9 },
    },
  },
  "9:16": {
    label: "Story 9:16", w: 100, h: 177.8, file: "JPG · 1080×1920",
    map: {
      bg: { x: 0, y: 0, w: 100, h: 177.8 },
      band: { x: -12, y: 121, w: 124, h: 30, r: -6 },
      logo: { x: 6, y: 7, w: 56, h: 11 },
      title: { x: 6, y: 25, w: 88, s: 1.12 },
      subtitle: { x: 6, y: 64, w: 70, s: 1.05 },
      illustration: { x: 22, y: 78, w: 56, h: 38 },
      date: { x: 6, y: 127, w: 88, s: 1.05 },
      time: { x: 6, y: 138, w: 88, s: 1.05 },
      venue: { x: 6, y: 147, w: 90, s: 1 },
      cta: { x: 6, y: 160, w: 62, h: 10, s: 1.1 },
      contact: { x: 6, y: 173, w: 86, s: 1 },
    },
  },
};

export const FORMAT_IDS = Object.keys(FORMATS);
