"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  submitAgentOnboarding,
  type AgentOnboardingInput,
} from "@/app/actions/agent-onboarding";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/upload";
import { useToast } from "@/providers/toast-provider";

interface AgentOnboardingFormProps {
  initial?: Partial<AgentOnboardingInput> & {
    onboarding_status?: string;
    rejection_reason?: string | null;
  } | null;
}

export function AgentOnboardingForm({ initial }: AgentOnboardingFormProps) {
  const t = useTranslations("agentOnboarding");
  const tNotify = useTranslations("notifications");
  const { showToast } = useToast();
  const [form, setForm] = useState({
    agency: initial?.agency ?? "",
    district: initial?.district ?? "Gasabo",
    servesIn: initial?.servesIn?.join(", ") ?? "",
    languages: initial?.languages?.join(", ") ?? "Kinyarwanda, English",
    bio: initial?.bio ?? "",
    licenseNumber: initial?.licenseNumber ?? "",
    licenseDocUrl: initial?.licenseDocUrl ?? "",
    idDocUrl: initial?.idDocUrl ?? "",
    yearsExperience: initial?.yearsExperience ?? 1,
    whatsapp: initial?.whatsapp ?? "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const status = initial?.onboarding_status ?? "pending";

  if (status === "submitted") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-semibold">{t("pendingTitle")}</p>
        <p className="mt-2">{t("pendingDesc")}</p>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
        <p className="font-semibold">{t("approvedTitle")}</p>
        <p className="mt-2">{t("approvedDesc")}</p>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitAgentOnboarding({
        agency: form.agency,
        district: form.district,
        servesIn: form.servesIn.split(",").map((s) => s.trim()).filter(Boolean),
        languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
        bio: form.bio,
        licenseNumber: form.licenseNumber,
        licenseDocUrl: form.licenseDocUrl,
        idDocUrl: form.idDocUrl,
        yearsExperience: form.yearsExperience,
        whatsapp: form.whatsapp,
      });
      if (result.error) {
        setMessage(result.error);
        showToast("error", result.error);
        return;
      }
      showToast("success", t("submitted"));
      setMessage(t("submitted"));
      window.location.reload();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-2xl border border-border bg-white p-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-amnii-navy">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("desc")}</p>
        {status === "rejected" && initial?.rejection_reason ? (
          <p className="mt-2 text-sm text-red-600">{t("rejected", { reason: initial.rejection_reason })}</p>
        ) : null}
      </div>

      {(
        [
          ["agency", t("agency")],
          ["district", t("district")],
          ["whatsapp", t("whatsapp")],
          ["licenseNumber", t("licenseNumber")],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block space-y-1">
          <span className="text-sm font-medium">{label}</span>
          <input
            required={key !== "district"}
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="h-10 w-full rounded-lg border border-border px-3 text-sm"
          />
        </label>
      ))}

      <label className="block space-y-1">
        <span className="text-sm font-medium">{t("uploadLicense")}</span>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const { url, error } = await uploadFile(file, "agent-documents", "license");
            if (error || !url) {
              showToast("error", tNotify("uploadFailed"));
              return;
            }
            setForm((f) => ({ ...f, licenseDocUrl: url }));
            showToast("success", tNotify("uploadSuccess"));
          }}
          className="w-full text-sm"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">{t("uploadId")}</span>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const { url, error } = await uploadFile(file, "agent-documents", "id");
            if (error || !url) {
              showToast("error", tNotify("uploadFailed"));
              return;
            }
            setForm((f) => ({ ...f, idDocUrl: url }));
            showToast("success", tNotify("uploadSuccess"));
          }}
          className="w-full text-sm"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">{t("servesIn")}</span>
        <input
          value={form.servesIn}
          onChange={(e) => setForm((f) => ({ ...f, servesIn: e.target.value }))}
          placeholder="Kacyiru, Remera"
          className="h-10 w-full rounded-lg border border-border px-3 text-sm"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">{t("languages")}</span>
        <input
          value={form.languages}
          onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))}
          className="h-10 w-full rounded-lg border border-border px-3 text-sm"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">{t("bio")}</span>
        <textarea
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          rows={4}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          required
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">{t("yearsExperience")}</span>
        <input
          type="number"
          min={0}
          value={form.yearsExperience}
          onChange={(e) => setForm((f) => ({ ...f, yearsExperience: Number(e.target.value) }))}
          className="h-10 w-full rounded-lg border border-border px-3 text-sm"
        />
      </label>

      {message ? <p className="text-sm text-amnii-gold-dark">{message}</p> : null}

      <Button type="submit" disabled={pending} className="bg-amnii-gold font-semibold text-amnii-navy">
        {pending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
