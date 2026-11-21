import { PrototypeFrame } from "@/components/prototype-frame";
import { Daftari } from "./daftari";

const HOW_TO = [
  "Capture: press Start scanning to watch three handwritten pages get captured. Then tap each yellow word and fix it.",
  "Press Save to Brain. The scan appears in the Brain tab under Formats.",
  "Brain: open a folder, switch items on or off, and edit a fact (for example the headteacher).",
  "Create: follow the three steps, press Generate, then swap questions, switch to Version B, or open the marking scheme.",
  "Export lets you print the exam or copy it as text.",
];

/** Daftari inside the shared PrototypeFrame. */
export function DaftariPrototype() {
  return (
    <PrototypeFrame title="Daftari" howTo={HOW_TO}>
      <Daftari />
    </PrototypeFrame>
  );
}
