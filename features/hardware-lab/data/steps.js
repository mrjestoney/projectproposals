// Build mode: 8 guided steps. parts = the parts that float beside the case and must be placed this step
// (the "cables" bundle is not a selectable part, but it is placed like one).

export const BUILD_START = ["motherboard", "fans", "battery"]; // already in the case at the start

export const BUILD_STEPS = [
  { id: "psu", title: "Install the power supply", parts: ["psu"], why: "Everything needs power, so the power supply goes in first.", hint: "The power supply is the box with the fan. Place it at the bottom of the case." },
  { id: "cpu", title: "Place the CPU in the socket", parts: ["cpu"], why: "The CPU is the brain of the computer. Line up the small triangle on the chip with the triangle on the socket. Never use force.", hint: "The CPU is the small square chip." },
  { id: "cooler", title: "Add thermal paste and mount the cooler", parts: ["cooler"], why: "The CPU gets hot. Thermal paste helps the heat flow into the cooler, which blows it away.", hint: "The cooler is the tower of metal fins with a fan." },
  { id: "ram", title: "Insert the RAM", parts: ["ram"], why: "RAM is fast working memory for the CPU. Push each stick down until both clips click.", hint: "RAM sticks are the two thin sticks with chips." },
  { id: "storage", title: "Install the storage", parts: ["ssd", "hdd"], why: "Storage keeps your files and the operating system, even when the power is off. Place both drives.", hint: "Storage is the small M.2 stick and the metal hard drive." },
  { id: "gpu", title: "Insert the graphics card", parts: ["gpu"], why: "The graphics card draws what you see on the screen.", hint: "The graphics card is the long card with two fans." },
  { id: "cables", title: "Connect the power cables", parts: ["cables"], why: "Each part needs its own power. The cables bring power from the power supply to the motherboard and the graphics card.", hint: "The cables are the bundle of wires from the power supply." },
  { id: "power", title: "Close the case and power on", parts: [], why: "Close the glass panel and press the power button. The fans spin and the lights glow when everything is right.", hint: "Press the “Close case and power on” button." },
];
