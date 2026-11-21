// English and Swahili texts of the poster, and the date helpers behind "Change date".

export const EN = {
  title: "SCIENCE FAIR 2026",
  subtitle: "Ideas that change our community",
  date: "Friday, 13 March 2026",
  time: "9:00 AM – 3:00 PM",
  venue: "School Main Hall, Dar es Salaam",
  cta: "Everyone is welcome!",
  contact: "Info: +255 700 000 000",
};

export const SW = {
  title: "MAONESHO YA SAYANSI 2026",
  subtitle: "Mawazo yanayobadilisha jamii yetu",
  date: "Ijumaa, 13 Machi 2026",
  time: "Saa 3:00 asubuhi – 9:00 alasiri",
  venue: "Ukumbi Mkuu wa Shule, Dar es Salaam",
  cta: "Wote mnakaribishwa!",
  contact: "Maelezo: +255 700 000 000",
};

export const LOGO_TEXT = ["MWANGAZA", "SECONDARY SCHOOL"];

const MONTHS = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  sw: ["Januari", "Februari", "Machi", "Aprili", "Mei", "Juni", "Julai", "Agosti", "Septemba", "Oktoba", "Novemba", "Desemba"],
};
const DAYS = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  sw: ["Jumapili", "Jumatatu", "Jumanne", "Jumatano", "Alhamisi", "Ijumaa", "Jumamosi"],
};

/** Reads "14 March 2027" (English or Swahili month). Returns { day, month, year } or null. */
export function parseDate(input) {
  const m = input.trim().match(/^(\d{1,2})\s+([A-Za-zÀ-ÿ]+)\s+(\d{4})$/);
  if (!m) return null;
  const name = m[2].toLowerCase();
  const idx = [...MONTHS.en, ...MONTHS.sw].findIndex((x) => x.toLowerCase() === name);
  if (idx < 0) return null;
  const month = idx % 12;
  const day = Number(m[1]);
  const year = Number(m[3]);
  const d = new Date(Date.UTC(year, month, day, 12));
  if (d.getUTCMonth() !== month || d.getUTCDate() !== day) return null;
  return { day, month, year, weekday: d.getUTCDay() };
}

/** "Sunday, 14 March 2027" or "Jumapili, 14 Machi 2027". */
export const formatDate = ({ day, month, year, weekday }, lang) => `${DAYS[lang][weekday]}, ${day} ${MONTHS[lang][month]} ${year}`;
