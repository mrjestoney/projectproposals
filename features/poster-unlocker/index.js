import { PrototypeFrame } from "@/components/prototype-frame";
import { PosterUnlocker } from "./poster-unlocker";

const HOW_TO = [
  "Press Unlock this poster to see the flat sample become an editable design.",
  "Tap any layer to select it. Drag it to move it, or double-tap text to type. Use the panel to change the font, size and colour.",
  "Fix the two warnings (the subtitle font and the phone number) with “Looks right ✓”.",
  "Smart tab: change the date, translate to Swahili, or switch to a square or story format.",
  "Use Undo and Redo, and “Before / after” to compare with the flat original.",
];

/** Poster Unlocker inside the shared PrototypeFrame. */
export function PosterUnlockerPrototype() {
  return (
    <PrototypeFrame title="Poster Unlocker" howTo={HOW_TO}>
      <PosterUnlocker />
    </PrototypeFrame>
  );
}
