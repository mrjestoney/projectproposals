"use client";

import { useCallback, useRef, useState } from "react";

const LIMIT = 60;

/**
 * Document state with Undo and Redo.
 *  commit(fn)  one step: apply fn and remember the previous state (a click on a swatch, a switch, a smart action).
 *  arm()       call at the start of a gesture (dragging, typing, a slider); the first change() after it is remembered.
 *  change(fn)  apply fn; it only adds an undo step if arm() was called before.
 */
export function useHistory(initial) {
  const [h, setH] = useState(() => ({ past: [], present: typeof initial === "function" ? initial() : initial, future: [] }));
  const armed = useRef(false);

  const commit = useCallback((fn) => {
    armed.current = false;
    setH((s) => ({ past: [...s.past.slice(-LIMIT), s.present], present: fn(s.present), future: [] }));
  }, []);
  const arm = useCallback(() => {
    armed.current = true;
  }, []);
  const disarm = useCallback(() => {
    armed.current = false;
  }, []);
  const change = useCallback((fn) => {
    const push = armed.current;
    armed.current = false;
    setH((s) => (push ? { past: [...s.past.slice(-LIMIT), s.present], present: fn(s.present), future: [] } : { ...s, present: fn(s.present) }));
  }, []);
  const undo = useCallback(() => setH((s) => (s.past.length ? { past: s.past.slice(0, -1), present: s.past.at(-1), future: [s.present, ...s.future] } : s)), []);
  const redo = useCallback(() => setH((s) => (s.future.length ? { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1) } : s)), []);

  return { doc: h.present, canUndo: h.past.length > 0, canRedo: h.future.length > 0, commit, arm, disarm, change, undo, redo };
}
