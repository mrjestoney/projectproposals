import { Montserrat, Oswald, Playfair_Display, Poppins } from "next/font/google";

// The four fonts the editor offers. Poppins is the one the (made-up) poster "really" uses.
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700", "800"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });
const oswald = Oswald({ subsets: ["latin"], display: "swap" });

export const FONTS = [
  { name: "Poppins", family: poppins.style.fontFamily },
  { name: "Montserrat", family: montserrat.style.fontFamily },
  { name: "Playfair Display", family: playfair.style.fontFamily },
  { name: "Oswald", family: oswald.style.fontFamily },
];
