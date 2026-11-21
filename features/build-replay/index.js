import { PrototypeFrame } from "@/components/prototype-frame";
import { BuildReplay } from "./build-replay";

const HOW_TO = [
  "Press Reconstruct (or Skip intro) to load the sample project. The link you type does not matter.",
  "Press Next, or use the ← and → keys, to walk through how the app was built.",
  "Switch between Level 1 · Story and Level 2 · Code to see the exact code of each step.",
  "Tap any box or line in the diagram to see what it is and why it exists.",
  "Try the System and Files views. Their links jump back to the step where something first appeared.",
];

/** Build Replay inside the shared PrototypeFrame. */
export function BuildReplayPrototype() {
  return (
    <PrototypeFrame title="Build Replay" howTo={HOW_TO}>
      <BuildReplay />
    </PrototypeFrame>
  );
}
