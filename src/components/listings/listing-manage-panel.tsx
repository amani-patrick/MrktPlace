"use client";

import { useRouter } from "@/i18n/navigation";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  EyeOff,
  Home,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  deleteListing,
  updateListingDescription,
  updateListingStatus,
} from "@/app/actions/listing-management";
import { ListingStatusBadge } from "@/components/listings/listing-status-badge";
import { Button } from "@/components/ui/button";
import { friendlyError } from "@/lib/notify";
import { useToast } from "@/providers/toast-provider";
import type { ListingStatus, ListingType } from "@/types";
import { cn } from "@/lib/utils";

interface ListingManagePanelProps {
  listingId: string;
  title: string;
  description: string;
  status: ListingStatus;
  listingType: ListingType;
  managerRole: "owner" | "agent";
  className?: string;
  /** After delete, redirect here (portal page). */
  redirectAfterDelete?: string;
}

export function ListingManagePanel({
  listingId,
  title,
  description,
  status,
  listingType,
  managerRole,
  className,
  redirectAfterDelete = "/portal/owner/listings",
}: ListingManagePanelProps) {
  const t = useTranslations("listingManage");
  const tNotify = useTranslations("notifications");
  const { showToast } = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [draftDescription, setDraftDescription] = useState(description);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const isSale = listingType === "sale";
  const canMarkRented = status === "active";
  const canUnlist = status === "active";
  const canRelist = status === "unlisted" || status === "rented" || status === "paused";

  function runStatus(next: "active" | "rented" | "unlisted") {
    startTransition(async () => {
      const result = await updateListingStatus(listingId, next);
      if (result.error) {
        showToast("error", friendlyError(tNotify, String(result.error)));
        return;
      }
      showToast("success", t("statusUpdated"));
      router.refresh();
    });
  }

  function saveDescription() {
    startTransition(async () => {
      const result = await updateListingDescription(listingId, draftDescription);
      if (result.error) {
        showToast("error", friendlyError(tNotify, String(result.error)));
        return;
      }
      showToast("success", t("descriptionUpdated"));
      setEditOpen(false);
      router.refresh();
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteListing(listingId, deleteConfirm);
      if (result.error) {
        showToast("error", friendlyError(tNotify, String(result.error)));
        return;
      }
      showToast("success", t("listingDeleted"));
      setDeleteOpen(false);
      router.push(redirectAfterDelete);
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-white p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {t("manageTitle")}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {managerRole === "agent" ? t("managingAsAgent") : t("managingAsOwner")}
          </p>
        </div>
        <ListingStatusBadge status={status} listingType={listingType} />
      </div>

      {status !== "active" ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {status === "pending"
            ? t("pendingHint")
            : status === "rejected"
              ? t("rejectedHint")
              : t("offMarketHint")}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {canMarkRented ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => runStatus("rented")}
            className="gap-1.5"
          >
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            {isSale ? t("markSold") : t("markRented")}
          </Button>
        ) : null}
        {canUnlist ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => runStatus("unlisted")}
            className="gap-1.5"
          >
            <EyeOff className="size-3.5" aria-hidden="true" />
            {t("markUnlisted")}
          </Button>
        ) : null}
        {canRelist ? (
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() => runStatus("active")}
            className="gap-1.5 bg-amnii-gold font-semibold text-amnii-navy hover:bg-amnii-gold-dark hover:text-white"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {t("relist")}
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => {
            setDraftDescription(description);
            setEditOpen(true);
          }}
          className="gap-1.5"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          {t("editDescription")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => {
            setDeleteConfirm("");
            setDeleteOpen(true);
          }}
          className="gap-1.5 border-red-200 text-red-700 hover:bg-red-50"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          {t("deleteListing")}
        </Button>
      </div>

      {editOpen ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label={t("close")}
            className="absolute inset-0 bg-black/40"
            onClick={() => setEditOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="font-heading text-lg font-bold text-amnii-navy">
              {t("editDescription")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("editDescriptionHint")}</p>
            <textarea
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              rows={6}
              maxLength={5000}
              className="mt-4 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                {t("cancel")}
              </Button>
              <Button
                type="button"
                disabled={pending || !draftDescription.trim()}
                onClick={saveDescription}
                className="bg-amnii-navy text-white hover:bg-amnii-navy/90"
              >
                {pending ? t("saving") : t("saveDescription")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteOpen ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label={t("close")}
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                <Trash2 className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-amnii-navy">
                  {t("deleteTitle")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{t("deleteWarning")}</p>
              </div>
            </div>
            <label className="mt-4 block space-y-1.5">
              <span className="text-sm font-medium text-amnii-navy">
                {t("deleteConfirmLabel", { title })}
              </span>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={title}
                className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
                {t("cancel")}
              </Button>
              <Button
                type="button"
                disabled={pending || deleteConfirm.trim().toLowerCase() !== title.trim().toLowerCase()}
                onClick={confirmDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {pending ? t("deleting") : t("confirmDelete")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {status === "rented" || status === "unlisted" ? (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Home className="size-3.5 shrink-0" aria-hidden="true" />
          {t("hiddenFromSearch")}
        </p>
      ) : null}
    </div>
  );
}
