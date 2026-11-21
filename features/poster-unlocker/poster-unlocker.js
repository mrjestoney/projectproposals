"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StagedProgress } from "@/components/staged-progress";
import { useToast } from "@/components/ui/toast";
import { copyText } from "@/lib/copy-text";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { TEXT_IDS } from "./data/layers";
import { formatDate, parseDate } from "./data/texts";
import { makeInitialDoc } from "./lib/doc";
import { useHistory } from "./lib/use-history";
import { Editor } from "./components/editor";
import { StartCard, SummaryCard, UNLOCK_STAGES } from "./components/start-screen";

const setText = (d, id, value, lang = d.lang) => ({ ...d, text: { ...d.text, [lang]: { ...d.text[lang], [id]: value } } });
const setProps = (d, id, patch) => ({ ...d, props: { ...d.props, [id]: { ...d.props[id], ...patch } } });

/**
 * The Poster Unlocker prototype. Opens on the flat sample poster; "Unlock" runs a simulated analysis and opens the
 * editor. The poster is plain data (layers, texts, positions per format), so Undo and Redo just move between copies.
 */
export function PosterUnlocker() {
  const toast = useToast();
  const reduceMotion = useReducedMotion();
  const h = useHistory(makeInitialDoc);
  const original = useMemo(() => makeInitialDoc(), []);
  const [phase, setPhase] = useState("start"); // start → working → summary → editor
  const [selected, setSelected] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [flashIds, setFlashIds] = useState([]);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [compare, setCompare] = useState(false);
  const timers = useRef([]);
  const { doc, undo, redo } = h;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => {
    if (reduceMotion || ms === 0) return fn();
    timers.current.push(setTimeout(fn, ms));
  };
  const flash = (ids) => {
    setFlashIds(ids);
    timers.current.push(setTimeout(() => setFlashIds([]), 1300));
  };

  // Ctrl/Cmd+Z undoes, Ctrl/Cmd+Shift+Z or Ctrl+Y redoes (not while typing).
  useEffect(() => {
    if (phase !== "editor") return;
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.target.closest?.("input, textarea, select, [contenteditable=true]")) return;
      const k = e.key.toLowerCase();
      if (k === "z") (e.preventDefault(), e.shiftKey ? redo() : undo());
      if (k === "y") (e.preventDefault(), redo());
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [phase, undo, redo]);

  const finishUnlock = useCallback(() => setPhase("summary"), []);

  const actions = {
    select: (id) => setSelected(id),
    drag: (id, x, y) => h.change((d) => ({ ...d, pos: { ...d.pos, [d.format]: { ...d.pos[d.format], [id]: { x, y } } } })),
    nudge: (id, dx, dy, { x, y }) => h.commit((d) => ({ ...d, pos: { ...d.pos, [d.format]: { ...d.pos[d.format], [id]: { x: x + dx, y: y + dy } } } })),
    text: (id, value) => h.change((d) => setText(d, id, value)),
    prop: (id, patch) => h.change((d) => setProps(d, id, patch)),
    propCommit: (id, patch) => h.commit((d) => setProps(d, id, patch)),
    toggle: (id, key) => h.commit((d) => setProps(d, id, { [key]: !d.props[id][key] })),
    replaceImage: () => h.commit((d) => ({ ...d, image: (d.image + 1) % 3 })),
    clearFlag: (id) =>
      h.commit((d) => {
        const flags = { ...d.flags };
        delete flags[id];
        return { ...d, flags };
      }),
    startEdit: (id) => {
      setSelected(id);
      setEditingId(id);
      h.arm();
    },
    endEdit: (id, value) => {
      setEditingId(null);
      if (value && value !== doc.text[doc.lang][id]) h.change((d) => setText(d, id, value));
      else h.disarm();
    },
    setCompare,
    format: (f) => h.commit((d) => ({ ...d, format: f })),
    language: (lang) => {
      if (lang === doc.lang) return;
      setBusy("lang");
      later(() => {
        h.commit((d) => ({ ...d, lang }));
        setBusy(null);
        flash(TEXT_IDS);
      }, 700);
    },
    changeDate: (input) => {
      const date = parseDate(input);
      if (!date) {
        setError("Try a date like 14 March 2027.");
        return;
      }
      setError("");
      setBusy("date");
      later(() => {
        h.commit((d) => {
          let n = d;
          for (const lang of ["en", "sw"]) {
            n = setText(n, "date", formatDate(date, lang), lang);
            n = setText(n, "title", n.text[lang].title.replace(/\d{4}/, String(date.year)), lang);
          }
          return n;
        });
        setBusy(null);
        flash(["date", "title"]);
      }, 800);
    },
    copyText: () => {
      const t = doc.text[doc.lang];
      copyText(["MWANGAZA SECONDARY SCHOOL", ...TEXT_IDS.map((id) => t[id])].join("\n"), toast, "All text copied");
    },
  };

  if (phase === "working") return <div className="p-base md:p-group"><StagedProgress title="Unlocking the poster…" stages={UNLOCK_STAGES} onDone={finishUnlock} titleId="unlock-title" /></div>;
  if (phase === "summary") return <div className="p-base md:p-group"><SummaryCard onOpen={() => setPhase("editor")} onBack={() => setPhase("start")} /></div>;
  if (phase === "start") return <div className="p-base md:p-group"><StartCard doc={original} onUnlock={() => setPhase("working")} /></div>;

  return (
    <div className="p-base md:p-group">
      <Editor h={h} original={{ ...original, format: doc.format }} ui={{ selected, editingId, flashIds, busy, error, compare, reduceMotion }} actions={actions} />
    </div>
  );
}
