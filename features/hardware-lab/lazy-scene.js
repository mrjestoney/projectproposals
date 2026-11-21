"use client";

import dynamic from "next/dynamic";

// The 3D scene (three.js) is loaded only here, in the browser, so no other page pays for it.
const Scene = dynamic(() => import("./scene/scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center" role="status">
      <p className="text-ink-soft">Loading the 3D scene…</p>
    </div>
  ),
});

export default Scene;
