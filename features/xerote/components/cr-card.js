"use client";

import { AlertTriangle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { CR } from "../data/build";

/** The change request: approve it (adds task T13, plan becomes v2) or reject it. */
export function CrCard({ status, onApprove, onReject }) {
  return (
    <Card as="section" aria-labelledby="cr-title" className="border-l-[3px] border-l-warning p-group">
      <div className="flex flex-wrap items-center gap-tight">
        <h3 id="cr-title" className="flex items-center gap-tight text-lg font-semibold">
          <AlertTriangle className="size-5 text-warning" aria-hidden="true" />
          Change request {CR.id}
        </h3>
        {status === "open" ? <Chip tone="warning">Waiting for your decision</Chip> : null}
        {status === "approved" ? (
          <Chip tone="success">
            <Check className="size-3.5" aria-hidden="true" /> Approved: added as T13 (plan v2)
          </Chip>
        ) : null}
        {status === "rejected" ? (
          <Chip>
            <X className="size-3.5" aria-hidden="true" /> Rejected: the fix prompt removes it
          </Chip>
        ) : null}
      </div>
      <p className="mt-tight font-medium">{CR.title}</p>
      <p className="mt-hair text-ink-soft">{CR.detail}</p>
      {status === "open" ? (
        <div className="mt-base flex flex-wrap gap-tight">
          <Button onClick={onApprove} className="h-auto! min-h-11 py-tight text-center whitespace-normal!">
            {CR.approveLabel}
          </Button>
          <Button variant="secondary" onClick={onReject} className="h-auto! min-h-11 py-tight text-center whitespace-normal!">
            {CR.rejectLabel}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
