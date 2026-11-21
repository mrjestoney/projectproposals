"use client";

import dynamic from "next/dynamic";
import { PrototypeFrame } from "@/components/prototype-frame";

// Each prototype is fetched only when its own page is opened, so the other four are never downloaded.
const loading = (title) =>
  function Loading() {
    return (
      <PrototypeFrame title={title}>
        <p role="status" className="p-group text-ink-soft">
          Loading the prototype…
        </p>
      </PrototypeFrame>
    );
  };

const prototypes = {
  "build-replay": dynamic(() => import("@/features/build-replay").then((m) => m.BuildReplayPrototype), { ssr: false, loading: loading("Build Replay") }),
  "poster-unlocker": dynamic(() => import("@/features/poster-unlocker").then((m) => m.PosterUnlockerPrototype), { ssr: false, loading: loading("Poster Unlocker") }),
  daftari: dynamic(() => import("@/features/daftari").then((m) => m.DaftariPrototype), { ssr: false, loading: loading("Daftari") }),
  xerote: dynamic(() => import("@/features/xerote").then((m) => m.XerotePrototype), { ssr: false, loading: loading("Xerote") }),
  "hardware-lab": dynamic(() => import("@/features/hardware-lab").then((m) => m.HardwareLabPrototype), { ssr: false, loading: loading("3D Hardware Lab") }),
};

export const hasPrototype = (slug) => slug in prototypes;

export function PrototypeLoader({ slug }) {
  const Prototype = prototypes[slug];
  return Prototype ? <Prototype /> : null;
}
