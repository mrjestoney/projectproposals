"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { FONTS } from "../fonts";
import { LAYERS } from "../data/layers";
import { FORMATS } from "../data/formats";
import { LOGO_TEXT } from "../data/texts";
import { PALETTE, readableOn } from "../data/palette";
import { Emblem, Illustration } from "./illustrations";

const [BLUE, TEAL] = PALETTE.map((p) => p.value);
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const pct = (v, total) => `${(v / total) * 100}%`;

/**
 * The poster, drawn from layer data. mode "flat": one picture (nothing can be touched, slightly soft, with a grain).
 * mode "edit": layers can be selected, dragged and edited. `fill` makes it fill its parent instead of using its own
 * aspect ratio (used for the before/after overlay). Text sizes use container units, so the poster scales as a whole.
 */
export function Poster({
  doc, mode = "edit", fill = false, selected = null, editingId = null, flashIds = [], reduceMotion = false,
  onSelect, onDragStart, onDrag, onDragEnd, onNudge, onEditStart, onEditEnd,
}) {
  const fmt = FORMATS[doc.format];
  const root = useRef(null);
  const drag = useRef(null);
  const lastTap = useRef({ id: null, t: 0 });
  const edit = mode === "edit";
  const move = reduceMotion ? "none" : "left .45s ease, top .45s ease, width .45s ease, height .45s ease, font-size .45s ease";
  const bg = doc.props.bg.color;

  const box = (id) => {
    const m = fmt.map[id];
    const o = doc.pos[doc.format][id];
    const x = o?.x ?? m.x;
    const y = o?.y ?? m.y;
    return { m, x, y, style: { left: pct(x, fmt.w), top: pct(y, fmt.h), width: pct(m.w, fmt.w), height: m.h ? pct(m.h, fmt.h) : undefined } };
  };

  const down = (e, def) => {
    if (!edit) return;
    onSelect(def.id);
    const p = doc.props[def.id];
    const now = e.timeStamp;
    if (def.type === "text" || def.type === "pill") {
      if (lastTap.current.id === def.id && now - lastTap.current.t < 350 && !p.locked) {
        onEditStart(def.id);
        lastTap.current = { id: null, t: 0 };
        return;
      }
      lastTap.current = { id: def.id, t: now };
    }
    if (def.type === "background" || p.locked || editingId === def.id) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = box(def.id);
    drag.current = { id: def.id, sx: e.clientX, sy: e.clientY, x, y, moved: false };
  };
  const moveEv = (e) => {
    const d = drag.current;
    if (!d || !root.current) return;
    const rect = root.current.getBoundingClientRect();
    const dx = ((e.clientX - d.sx) / rect.width) * fmt.w;
    const dy = ((e.clientY - d.sy) / rect.width) * fmt.w;
    if (!d.moved && Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy) < 3) return;
    if (!d.moved) onDragStart();
    d.moved = true;
    const w = fmt.map[d.id].w;
    onDrag(d.id, Math.min(fmt.w - w / 2, Math.max(-w / 2, d.x + dx)), Math.min(fmt.h - 4, Math.max(-4, d.y + dy)));
  };
  const up = () => {
    if (drag.current?.moved) onDragEnd();
    drag.current = null;
  };

  const props = (id) => doc.props[id];
  const font = (id) => FONTS[props(id).font]?.family;
  const text = (id) => doc.text[doc.lang][id];

  const layers = LAYERS.map((def) => {
    const p = props(def.id);
    if (p.hidden) return null;
    const { m, style } = box(def.id);
    const isSel = edit && selected === def.id;
    const flagged = edit && doc.flags[def.id];
    const flash = flashIds.includes(def.id);
    const common = {
      key: def.id,
      "data-layer": def.id,
      className: `absolute ${edit && def.type !== "background" ? "cursor-move" : ""} ${flash ? "poster-flash" : ""}`,
      style: { ...style, transition: move, touchAction: edit && def.type !== "background" ? "none" : undefined, outline: isSel ? "2px solid var(--accent)" : undefined, outlineOffset: isSel ? 3 : undefined },
      ...(edit
        ? {
            role: "button", tabIndex: 0, "aria-pressed": isSel,
            "aria-label": `${def.name}${flagged ? " (needs checking)" : ""}${p.locked ? " (locked)" : ""}`,
            onPointerDown: (e) => down(e, def), onPointerMove: moveEv, onPointerUp: up, onPointerCancel: up,
            onKeyDown: (e) => {
              if (e.target !== e.currentTarget) return;
              if (e.key === "Enter" || e.key === " ") (e.preventDefault(), onSelect(def.id));
              const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
              if (d && !p.locked && def.type !== "background") (e.preventDefault(), onNudge(def.id, d[0], d[1], box(def.id)));
            },
          }
        : {}),
    };
    const badge = flagged ? (
      <span className="absolute -top-4 -right-5 z-30 flex size-6 items-center justify-center rounded-full bg-warning text-white shadow-pop" style={{ fontSize: 0 }}>
        <AlertTriangle className="size-3.5" aria-hidden="true" />
      </span>
    ) : null;
    const handles = isSel ? (
      <>
        {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((c) => (
          <span key={c} aria-hidden="true" className={`absolute ${c} size-2 rounded-[2px] border border-accent bg-white`} />
        ))}
      </>
    ) : null;

    switch (def.type) {
      case "background":
        return (
          <div {...common} style={{ ...common.style, background: `linear-gradient(160deg, ${BLUE} 0%, ${bg} 100%)` }}>
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 80% 15%, #ffffff 0, transparent 45%)" }} />
          </div>
        );
      case "shape":
        return (
          <div {...common} style={{ ...common.style, background: p.color, transform: `rotate(${m.r}deg)`, boxShadow: "0 0.6cqw 2cqw rgba(0,0,0,0.25)" }}>
            {badge}
            {handles}
          </div>
        );
      case "logo": {
        const fs = `${p.size}cqw`;
        return (
          <div {...common} style={{ ...common.style, color: p.color, display: "flex", alignItems: "center", gap: "1.4cqw", fontFamily: font("title") }}>
            <span style={{ width: pct(m.h * 0.95, fmt.w), aspectRatio: "1", flexShrink: 0 }}>
              <Emblem color={p.color} />
            </span>
            <span style={{ fontSize: fs, lineHeight: 1.1, fontWeight: 800, letterSpacing: "0.05em" }}>
              {LOGO_TEXT[0]}
              <br />
              <span style={{ fontWeight: 500, fontSize: "0.72em" }}>{LOGO_TEXT[1]}</span>
            </span>
            {badge}
            {handles}
          </div>
        );
      }
      case "image":
        return (
          <div {...common}>
            <Illustration variant={doc.image} color={p.color} />
            {badge}
            {handles}
          </div>
        );
      case "pill": {
        const editing = editingId === def.id;
        return (
          <div {...common} style={{ ...common.style, background: p.color, borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0.5cqw 1.6cqw rgba(0,0,0,0.25)" }}>
            <Editable id={def.id} editing={editing} value={text(def.id)} onEnd={onEditEnd}
              style={{ fontFamily: font(def.id), fontSize: `${p.size * m.s}cqw`, fontWeight: p.weight, color: readableOn(p.color), textAlign: "center", padding: "0 2cqw", lineHeight: 1.1 }} />
            {badge}
            {handles}
          </div>
        );
      }
      default: {
        const editing = editingId === def.id;
        return (
          <div {...common} style={{ ...common.style, height: undefined, width: p.align === "left" ? "fit-content" : common.style.width, maxWidth: common.style.width }}>
            <Editable id={def.id} editing={editing} value={text(def.id)} onEnd={onEditEnd}
              style={{ fontFamily: font(def.id), fontSize: `${p.size * m.s}cqw`, fontWeight: p.weight, color: p.color, textAlign: p.align, lineHeight: 1.1, transition: move }} />
            {badge}
            {handles}
          </div>
        );
      }
    }
  });

  return (
    <div
      ref={root}
      className={`relative overflow-hidden ${fill ? "size-full" : ""}`}
      style={{
        containerType: "inline-size",
        aspectRatio: fill ? undefined : `${fmt.w} / ${fmt.h}`,
        pointerEvents: edit ? undefined : "none",
        filter: edit ? undefined : "blur(0.25px) saturate(0.96)",
      }}
    >
      {layers}
      {!edit ? <div className="absolute inset-0" style={{ backgroundImage: NOISE, opacity: 0.18, mixBlendMode: "overlay" }} /> : null}
    </div>
  );
}

/** Text that can be edited in place. While editing, the browser owns the text; it is saved when you leave the box. */
function Editable({ id, editing, value, onEnd, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const r = document.createRange();
      r.selectNodeContents(ref.current);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    }
  }, [editing]);
  return (
    <span
      ref={ref}
      contentEditable={editing}
      suppressContentEditableWarning
      spellCheck={false}
      aria-label={editing ? `Editing ${id}` : undefined}
      onPointerDown={editing ? (e) => e.stopPropagation() : undefined}
      onBlur={editing ? () => onEnd(id, ref.current.innerText.replace(/\n+/g, " ").trim()) : undefined}
      onKeyDown={editing ? (e) => { if (e.key === "Enter" || e.key === "Escape") (e.preventDefault(), ref.current.blur()); e.stopPropagation(); } : undefined}
      style={{ display: "block", width: "100%", outline: "none", cursor: editing ? "text" : undefined, userSelect: editing ? "text" : "none", ...style }}
    >
      {value}
    </span>
  );
}

