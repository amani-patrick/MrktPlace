"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { POPULAR_DISTRICTS } from "@/config/constants";

const propertyTypes = [
  { value: "", label: "All types" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "room", label: "Room" },
  { value: "studio", label: "Studio" },
  { value: "office", label: "Office" },
  { value: "land", label: "Land" },
];

const bedroomOptions = ["", "1", "2", "3", "4+"];

export function AmniiSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/search?${params.toString()}`);
  }

  const current = {
    type: searchParams.get("type") ?? "",
    property: searchParams.get("property") ?? "",
    district: searchParams.get("district") ?? "",
    bedrooms: searchParams.get("bedrooms") ?? "",
    verified: searchParams.get("verified") ?? "",
    q: searchParams.get("q") ?? "",
  };

  return (
    <aside className="space-y-6 rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-heading text-lg font-bold text-amnii-navy">Filters</h2>
        <p className="text-sm text-muted-foreground">Refine your search</p>
      </div>

      <div className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">Location</span>
          <input
            type="text"
            defaultValue={current.q}
            placeholder="Sector or area..."
            onBlur={(e) => update("q", e.target.value)}
            className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">Listing type</span>
          <select
            value={current.type}
            onChange={(e) => update("type", e.target.value)}
            className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
          >
            <option value="">All</option>
            <option value="rent">Rent</option>
            <option value="sale">Buy</option>
            <option value="commercial_rent">Commercial</option>
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">District</span>
          <select
            value={current.district}
            onChange={(e) => update("district", e.target.value)}
            className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
          >
            <option value="">All districts</option>
            {POPULAR_DISTRICTS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">Property type</span>
          <select
            value={current.property}
            onChange={(e) => update("property", e.target.value)}
            className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
          >
            {propertyTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">Bedrooms</span>
          <select
            value={current.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
            className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
          >
            {bedroomOptions.map((b) => (
              <option key={b} value={b}>
                {b ? `${b} bedroom${b === "1" ? "" : "s"}` : "Any"}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={current.verified === "true"}
            onChange={(e) => update("verified", e.target.checked ? "true" : "")}
            className="size-4 rounded border-border accent-amnii-gold"
          />
          <span className="text-sm font-medium text-amnii-navy">Verified only</span>
        </label>
      </div>

      <button
        type="button"
        onClick={() => router.push("/search")}
        className="w-full rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
      >
        Clear all filters
      </button>
    </aside>
  );
}
