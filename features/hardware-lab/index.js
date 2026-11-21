import { PrototypeFrame } from "@/components/prototype-frame";
import { HardwareLab } from "./hardware-lab";
import { CREDITS } from "./data/part-map";

// Selection glow in the 3D scene: amber, so it never looks like the red (wrong) or green (right) feedback colours.
const HIGHLIGHT = "#ffb703";

const HOW_TO = [
  "Drag to turn the desk, pinch or scroll to zoom, and tap any part (the monitor, keyboard, mouse or the PC) to learn about it.",
  "Press Open case to see inside, and Explode to pull the parts apart with labels. Press Power on to spin the fans.",
  "Build: follow 8 steps. Tap the glowing part (or press Place part) to put it in.",
  "Fix: tap parts to inspect them, then choose the fault. Quiz: tap the right part in 3D, or pick from the list.",
];

/** The 3D Hardware Lab inside the shared PrototypeFrame, with the credits for any third-party models. */
export function HardwareLabPrototype() {
  return (
    <PrototypeFrame title="3D Hardware Lab" howTo={HOW_TO}>
      <HardwareLab accent={HIGHLIGHT} />
      <p className="border-t border-line px-base py-tight text-xs text-hint md:px-group">
        {CREDITS.length ? (
          <>
            3D models:{" "}
            {CREDITS.map((c) => (
              <span key={c.url}>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline">
                  {c.title}
                </a>{" "}
                by {c.author} ({c.licence}).{" "}
              </span>
            ))}
          </>
        ) : (
          "3D models: none from other authors. Every part of this scene is built in code with three.js."
        )}
      </p>
    </PrototypeFrame>
  );
}
