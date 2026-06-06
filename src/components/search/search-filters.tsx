"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROPERTY_TYPES, LISTING_TYPES } from "@/config/constants";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [property, setProperty] = useState(searchParams.get("property") ?? "");
  const [district, setDistrict] = useState(searchParams.get("district") ?? "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") ?? "");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");

  function applyFilters(event?: React.FormEvent) {
    event?.preventDefault();
    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (type) params.set("type", type);
    if (property) params.set("property", property);
    if (district) params.set("district", district);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (verifiedOnly) params.set("verified", "true");

    const qs = params.toString();
    router.push(`/search${qs ? `?${qs}` : ""}`);
  }

  function clearFilters() {
    setQuery("");
    setType("");
    setProperty("");
    setDistrict("");
    setBedrooms("");
    setVerifiedOnly(false);
    router.push("/search");
  }

  return (
    <form
      onSubmit={applyFilters}
      className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-rw-blue" aria-hidden="true" />
        <h2 className="font-semibold">Refine search</h2>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Keyword, sector, or area"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Listing type</option>
            {LISTING_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          <select
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Property type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          <Input
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />

          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Bedrooms</option>
            <option value="1">1 bed</option>
            <option value="2">2 beds</option>
            <option value="3">3 beds</option>
            <option value="4">4+ beds</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="size-4 rounded border-input accent-rw-green"
          />
          Verified only
        </label>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1 bg-rw-blue hover:bg-rw-blue/90">
            Apply filters
          </Button>
          <Button type="button" variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-4">
        <span className="text-xs text-muted-foreground">Quick:</span>
        <Link
          href="/search?type=rent"
          className="rounded-full bg-rw-blue/10 px-2.5 py-0.5 text-xs font-medium text-rw-blue hover:bg-rw-blue/20"
        >
          Rent
        </Link>
        <Link
          href="/search?type=sale"
          className="rounded-full bg-rw-green/10 px-2.5 py-0.5 text-xs font-medium text-rw-green hover:bg-rw-green/20"
        >
          Buy
        </Link>
        <Link
          href="/search?verified=true"
          className="rounded-full bg-rw-yellow/20 px-2.5 py-0.5 text-xs font-medium hover:bg-rw-yellow/30"
        >
          Verified
        </Link>
      </div>
    </form>
  );
}
