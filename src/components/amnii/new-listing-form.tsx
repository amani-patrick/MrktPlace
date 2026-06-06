"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Building2,
  Camera,
  Check,
  FileText,
  MapPin,
  UserCheck,
} from "lucide-react";
import { createListing, type CreateListingInput } from "@/app/actions/listings";
import { Button } from "@/components/ui/button";
import type { AgentOption } from "@/lib/data/listings";
import type { ContactDisplay, ListingSource } from "@/types";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Listing type", icon: UserCheck },
  { id: 2, label: "Property Info", icon: Building2 },
  { id: 3, label: "Location", icon: MapPin },
  { id: 4, label: "Description", icon: FileText },
] as const;

interface NewListingFormProps {
  agents: AgentOption[];
}

export function NewListingForm({ agents }: NewListingFormProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    listingSource: "owner_direct" as ListingSource,
    agentId: "",
    contactDisplay: "agent" as ContactDisplay,
    title: "",
    type: "rent" as CreateListingInput["listingType"],
    propertyType: "apartment" as CreateListingInput["propertyType"],
    price: "",
    bedrooms: "",
    district: "Gasabo",
    sector: "",
    description: "",
    contactPhone: "",
    whatsappNumber: "",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  });

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePublish() {
    setError(null);
    startTransition(async () => {
      const result = await createListing({
        title: form.title,
        description: form.description,
        listingType: form.type,
        propertyType: form.propertyType,
        price: Number(form.price),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        district: form.district,
        sector: form.sector,
        listingSource: form.listingSource,
        agentId: form.listingSource === "agent_managed" ? form.agentId : null,
        contactDisplay: form.contactDisplay,
        contactPhone: form.contactPhone,
        whatsappNumber: form.whatsappNumber || undefined,
        imageUrl: form.imageUrl,
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav aria-label="Listing steps" className="mb-8">
        <ol className="flex items-center justify-between">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <li key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full border-2 transition-colors",
                      isDone
                        ? "border-amnii-gold bg-amnii-gold text-amnii-navy"
                        : isActive
                          ? "border-amnii-navy bg-amnii-navy text-white"
                          : "border-border bg-white text-muted-foreground",
                    )}
                  >
                    {isDone ? (
                      <Check className="size-5" aria-hidden="true" />
                    ) : (
                      <Icon className="size-4" aria-hidden="true" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden text-xs font-medium sm:block",
                      isActive ? "text-amnii-navy" : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 ? (
                  <div
                    className={cn(
                      "mx-2 h-0.5 flex-1",
                      step > s.id ? "bg-amnii-gold" : "bg-border",
                    )}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        {step === 1 ? (
          <div className="space-y-5">
            <h2 className="font-heading text-xl font-bold text-amnii-navy">
              How are you listing?
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    value: "owner_direct" as const,
                    title: "I manage it myself",
                    desc: "Seekers contact you directly. Best for landlords.",
                  },
                  {
                    value: "agent_managed" as const,
                    title: "I have an agent",
                    desc: "Link a verified Amnii agent. Seekers contact them.",
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update("listingSource", opt.value)}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-colors",
                    form.listingSource === opt.value
                      ? "border-amnii-gold bg-amnii-gold/5"
                      : "border-border hover:border-amnii-gold/40",
                  )}
                >
                  <p className="font-semibold text-amnii-navy">{opt.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{opt.desc}</p>
                </button>
              ))}
            </div>

            {form.listingSource === "agent_managed" ? (
              <div className="space-y-3">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">Select your agent</span>
                  <select
                    value={form.agentId}
                    onChange={(e) => update("agentId", e.target.value)}
                    required
                    className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
                  >
                    <option value="">Choose agent…</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                        {a.agency ? ` — ${a.agency}` : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">Who should seekers contact?</span>
                  <select
                    value={form.contactDisplay}
                    onChange={(e) =>
                      update("contactDisplay", e.target.value as ContactDisplay)
                    }
                    className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
                  >
                    <option value="agent">Agent only</option>
                    <option value="both">Both agent and owner</option>
                  </select>
                </label>
              </div>
            ) : null}

            <div className="relative aspect-video overflow-hidden rounded-xl border border-dashed border-border">
              <Image src={form.imageUrl} alt="Listing preview" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                <Camera className="size-8 text-white" aria-hidden="true" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Photo upload to storage coming soon. A default image is used for now.
            </p>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-amnii-navy">
              Property details
            </h2>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Title</span>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Modern 2BR Apartment in Remera"
                className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Listing type</span>
                <select
                  value={form.type}
                  onChange={(e) =>
                    update("type", e.target.value as CreateListingInput["listingType"])
                  }
                  className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Property type</span>
                <select
                  value={form.propertyType}
                  onChange={(e) =>
                    update(
                      "propertyType",
                      e.target.value as CreateListingInput["propertyType"],
                    )
                  }
                  className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="room">Room</option>
                  <option value="studio">Studio</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Price (RWF)</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="850000"
                  className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Bedrooms</span>
                <input
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => update("bedrooms", e.target.value)}
                  placeholder="2"
                  className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
                />
              </label>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-amnii-navy">Location</h2>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">District</span>
              <select
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
                className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
              >
                <option value="Gasabo">Gasabo</option>
                <option value="Kicukiro">Kicukiro</option>
                <option value="Nyarugenge">Nyarugenge</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Sector</span>
              <input
                value={form.sector}
                onChange={(e) => update("sector", e.target.value)}
                placeholder="e.g. Remera, Kacyiru"
                className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
              />
            </label>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-amnii-navy">
              Description
            </h2>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={5}
              placeholder="Describe your property, amenities, and neighborhood..."
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-amnii-gold"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Contact phone *</span>
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => update("contactPhone", e.target.value)}
                  placeholder="0788 000 000"
                  required
                  className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">WhatsApp (optional)</span>
                <input
                  type="tel"
                  value={form.whatsappNumber}
                  onChange={(e) => update("whatsappNumber", e.target.value)}
                  placeholder="Same as phone"
                  className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
                />
              </label>
            </div>
            <p className="rounded-lg bg-amnii-cream px-4 py-3 text-sm text-muted-foreground">
              This number appears on your listing. Seekers contact you directly — free,
              no unlock fees.
            </p>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

        <div className="mt-8 flex justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={step === 1 || isPending}
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </Button>
          {step < 4 ? (
            <Button
              type="button"
              className="bg-amnii-gold font-semibold text-amnii-navy hover:bg-amnii-gold-dark hover:text-white"
              onClick={() => setStep((s) => s + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              disabled={
                isPending ||
                !form.title ||
                !form.price ||
                !form.sector ||
                !form.contactPhone
              }
              className="bg-amnii-navy font-semibold text-white hover:bg-amnii-navy/90"
              onClick={handlePublish}
            >
              {isPending ? "Publishing…" : "Publish listing"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
