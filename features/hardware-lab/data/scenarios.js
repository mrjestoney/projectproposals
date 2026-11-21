// Fix mode: scenario 1 is a full interactive one (inspect parts in 3D); scenarios 2 and 3 are short multiple choice.

export const SCENARIOS = [
  {
    id: "ram", full: true,
    title: "No picture on the screen",
    symptom: "The PC turns on, the fans spin and it beeps three times, but the screen stays black.",
    clues: ["Three beeps in a row at start-up", "Fans spin and the lights are on", "The monitor says “No signal”"],
    inspect: {
      ram: { ok: false, text: "One stick is raised and tilted. It is not fully inserted into its slot.", tag: "Not fully inserted" },
      gpu: { ok: true, text: "Looks fine. The card is seated and the fans are not blocked." },
      psu: { ok: true, text: "Looks fine. The cables are connected and the fan turns." },
      cpu: { ok: true, text: "Looks fine. It is covered by the cooler and cool to the touch." },
      cooler: { ok: true, text: "Looks fine. Clean fins, fan spinning." },
      motherboard: { ok: true, text: "Looks fine. No burn marks or swollen parts." },
      ssd: { ok: true, text: "Looks fine." },
      hdd: { ok: true, text: "Looks fine." },
      fans: { ok: true, text: "Looks fine. All three fans turn." },
      battery: { ok: true, text: "Looks fine." },
    },
    options: ["RAM is not seated", "Graphics card is broken", "Power supply failed", "Hard drive failed"],
    correct: 0,
    explain: "Beeps with a black screen and spinning fans point to memory: the computer cannot start without working RAM. The raised stick is the clue. Pressing it down firmly until both clips click fixes it.",
  },
  {
    id: "heat", full: false,
    title: "Shuts down while gaming",
    symptom: "The PC shuts down by itself after about 10 minutes of gaming. When you touch the case, it is very warm.",
    visual: "dust",
    options: ["The cooler is full of dust, or the thermal paste is dry", "The keyboard is broken", "The monitor cable is loose", "The hard drive is full"],
    correct: 0,
    explain: "Heat is the clue. A dusty cooler (look at the grey fluff between the fins) or dried thermal paste stops the CPU from cooling, and the computer shuts down to protect itself. Clean the fins and replace the paste.",
  },
  {
    id: "power", full: false,
    title: "Nothing happens at all",
    symptom: "You press the power button and nothing happens: no fans, no lights, no sound.",
    visual: "cable",
    options: ["The power supply or its power cable", "The graphics card", "The RAM", "The mouse"],
    correct: 0,
    explain: "No fans and no lights means no power is reaching the computer. Check the power cable at the wall, the switch on the power supply, and the main power cable to the motherboard. If those are fine, the power supply has failed.",
  },
];
