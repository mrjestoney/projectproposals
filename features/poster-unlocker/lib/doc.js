import { LAYERS, FLAGS } from "../data/layers";
import { EN, SW } from "../data/texts";
import { FORMAT_IDS } from "../data/formats";

/** The whole poster as plain data: this is what Undo and Redo move between. */
export function makeInitialDoc() {
  const props = {};
  for (const l of LAYERS) props[l.id] = { hidden: false, locked: false, ...l.defaults };
  return {
    lang: "en",
    format: "4:5",
    text: { en: { ...EN }, sw: { ...SW } },
    props,
    pos: Object.fromEntries(FORMAT_IDS.map((f) => [f, {}])),
    flags: { ...FLAGS },
    image: 0,
  };
}
