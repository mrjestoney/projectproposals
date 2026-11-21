"use client";

import { useCallback } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCAN_TITLE } from "../data/pages";
import { HandwrittenPage } from "./handwritten-page";
import { Review } from "./review";
import { CameraFrame, ScanSimulation } from "./scan-simulation";

/** Capture: "flip and go" scanning, then review. cap = { phase: idle|scanning|review, resolved, saved }. */
export function Capture({ cap, setCap, onSave, onOpenBrain }) {
  const finishScan = useCallback(() => setCap((c) => ({ ...c, phase: "review" })), [setCap]);
  if (cap.phase === "scanning") {
    return <ScanSimulation onDone={finishScan} />;
  }
  if (cap.phase === "review") {
    return (
      <Review
        resolved={cap.resolved}
        onResolve={(id, value) => setCap((c) => ({ ...c, resolved: { ...c.resolved, [id]: value } }))}
        saved={cap.saved}
        onSave={onSave}
        onOpenBrain={onOpenBrain}
        onRescan={() => setCap((c) => ({ ...c, phase: "idle", resolved: {}, saved: c.saved }))}
      />
    );
  }
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Flip your pages</h2>
        <p className="mt-tight text-ink-soft">
          Point the camera at your paper and turn the pages. Daftari captures each one by itself. Sample: “{SCAN_TITLE}” (3 handwritten pages).
        </p>
      </div>
      <CameraFrame>
        <HandwrittenPage n={1} />
      </CameraFrame>
      <div className="mx-auto">
        <Button size="lg" onClick={() => setCap((c) => ({ ...c, phase: "scanning" }))}>
          <Camera className="size-5" aria-hidden="true" />
          Start scanning
        </Button>
      </div>
    </div>
  );
}
