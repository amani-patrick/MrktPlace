"use client";

import { useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import { approveAgent, rejectAgent } from "@/app/actions/agent-onboarding";
import { dismissPlatformFlag, runScamScan } from "@/app/actions/platform-flags";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  label: string;
  onClick: () => Promise<{ error?: string; success?: boolean }>;
  variant?: "approve" | "reject" | "default" | "outline";
}

function ActionButton({ label, onClick, variant = "default" }: ActionButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          void onClick();
        });
      }}
      className={cn(
        buttonVariants({ size: "sm", variant: variant === "outline" ? "outline" : "default" }),
        variant === "approve" && "gap-1 bg-emerald-600 text-white hover:bg-emerald-700",
        variant === "reject" && "gap-1 border-red-200 text-red-600 hover:bg-red-50",
        variant === "default" && "bg-slate-900 text-white",
      )}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {variant === "approve" ? <Check className="size-4" /> : null}
      {variant === "reject" ? <X className="size-4" /> : null}
      {label}
    </button>
  );
}

export function ApproveRejectListing({
  listingId,
  approve,
  reject,
}: {
  listingId: string;
  approve: (id: string) => Promise<{ error?: string }>;
  reject: (id: string) => Promise<{ error?: string }>;
}) {
  return (
    <div className="flex gap-2">
      <ActionButton label="Approve" variant="approve" onClick={() => approve(listingId)} />
      <ActionButton label="Reject" variant="reject" onClick={() => reject(listingId)} />
    </div>
  );
}

export function ReportActions({
  reportId,
  listingId,
  dismiss,
  suspendListing,
}: {
  reportId: string;
  listingId: string;
  dismiss: (id: string) => Promise<{ error?: string }>;
  suspendListing: (listingId: string, reportId: string) => Promise<{ error?: string }>;
}) {
  return (
    <div className="flex gap-2">
      <ActionButton
        label="Suspend listing"
        onClick={() => suspendListing(listingId, reportId)}
      />
      <ActionButton
        label="Dismiss"
        variant="outline"
        onClick={() => dismiss(reportId)}
      />
    </div>
  );
}

export function AgentReportActions({
  reportId,
  agentId,
  dismiss,
  suspendAgent,
  dismissLabel,
  suspendLabel,
}: {
  reportId: string;
  agentId: string;
  dismiss: (id: string) => Promise<{ error?: string }>;
  suspendAgent: (agentId: string, reportId: string) => Promise<{ error?: string }>;
  dismissLabel: string;
  suspendLabel: string;
}) {
  return (
    <div className="flex gap-2">
      <ActionButton
        label={suspendLabel}
        onClick={() => suspendAgent(agentId, reportId)}
      />
      <ActionButton
        label={dismissLabel}
        variant="outline"
        onClick={() => dismiss(reportId)}
      />
    </div>
  );
}

export function UserSuspendButton({
  userId,
  isSuspended,
  suspend,
  unsuspend,
}: {
  userId: string;
  isSuspended: boolean;
  suspend: (id: string) => Promise<{ error?: string }>;
  unsuspend: (id: string) => Promise<{ error?: string }>;
}) {
  return (
    <ActionButton
      label={isSuspended ? "Unban" : "Ban user"}
      variant={isSuspended ? "default" : "reject"}
      onClick={() => (isSuspended ? unsuspend(userId) : suspend(userId))}
    />
  );
}

export function ScamScanButton({ label }: { label: string }) {
  return <ActionButton label={label} onClick={() => runScamScan()} />;
}

export function FlagDismissButton({
  flagId,
  label,
}: {
  flagId: string;
  label: string;
}) {
  return (
    <ActionButton label={label} variant="outline" onClick={() => dismissPlatformFlag(flagId)} />
  );
}

export function AgentOnboardingActions({
  agentId,
  approveLabel,
  rejectLabel,
  rejectReason,
}: {
  agentId: string;
  approveLabel: string;
  rejectLabel: string;
  rejectReason: string;
}) {
  return (
    <div className="flex gap-2">
      <ActionButton label={approveLabel} variant="approve" onClick={() => approveAgent(agentId)} />
      <ActionButton
        label={rejectLabel}
        variant="reject"
        onClick={() => rejectAgent(agentId, rejectReason)}
      />
    </div>
  );
}
