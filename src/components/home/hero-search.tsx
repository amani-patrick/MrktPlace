"use client";

import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HERO_SEARCH_TABS, POPULAR_DISTRICTS } from "@/config/constants";
import { HERO_IMAGE } from "@/lib/images";
import { cn } from "@/lib/utils";

export function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof HERO_SEARCH_TABS)[number]["id"]>("rent");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set("type", activeTab === "agents" ? "rent" : activeTab);
    if (location.trim()) params.set("q", location.trim());
    if (propertyType) params.set("property", propertyType);
    if (bedrooms) params.set("bedrooms", bedrooms);

    if (activeTab === "agents") {
      router.push("/agents");
      return;
    }

    router.push(`/search?${params.toString()}`);
  }

  return (
    <section className="relative isolate min-h-[min(92vh,720px)] overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt="Kigali cityscape"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/80" />
      <div className="absolute inset-0 bg-gradient-to-br from-rw-blue/30 via-transparent to-rw-green/20" />

      <div className="relative mx-auto flex min-h-[min(92vh,720px)] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl text-center">
          <p className="mb-4 text-sm font-medium tracking-wide text-white/80 uppercase">
            Rwanda&apos;s trusted housing marketplace
          </p>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your home search
            <span className="block bg-gradient-to-r from-rw-blue via-rw-yellow to-rw-green bg-clip-text text-transparent">
              starts here
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
            Find properties to rent, buy, or short-stay across Kigali and all 30
            districts. Contact owners directly — always free, never hidden.
          </p>
        </div>

        <div className="mx-auto mt-10 w-full max-w-4xl">
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/20 ring-1 ring-white/10">
            <div
              className="flex overflow-x-auto border-b border-border/80"
              role="tablist"
              aria-label="Search type"
            >
              {HERO_SEARCH_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "min-w-[88px] flex-1 px-4 py-3.5 text-sm font-semibold transition-colors sm:min-w-0",
                    activeTab === tab.id
                      ? "border-b-2 border-primary bg-primary/5 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="p-4 sm:p-5" role="search">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative sm:col-span-2 lg:col-span-1">
                  <label htmlFor="hero-location" className="sr-only">
                    Location
                  </label>
                  <MapPin
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="hero-location"
                    type="search"
                    placeholder="District, sector, or area"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="h-11 bg-muted/40 pl-10"
                  />
                </div>

                <div>
                  <label htmlFor="hero-property" className="sr-only">
                    Property type
                  </label>
                  <select
                    id="hero-property"
                    value={propertyType}
                    onChange={(event) => setPropertyType(event.target.value)}
                    className="flex h-11 w-full rounded-lg border border-input bg-muted/40 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">Property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="room">Room</option>
                    <option value="studio">Studio</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="hero-beds" className="sr-only">
                    Bedrooms
                  </label>
                  <select
                    id="hero-beds"
                    value={bedrooms}
                    onChange={(event) => setBedrooms(event.target.value)}
                    className="flex h-11 w-full rounded-lg border border-input bg-muted/40 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">Beds</option>
                    <option value="1">1 bed</option>
                    <option value="2">2 beds</option>
                    <option value="3">3 beds</option>
                    <option value="4">4+ beds</option>
                  </select>
                </div>

                <Button type="submit" size="lg" className="h-11 gap-2 font-semibold">
                  <Search className="size-4" aria-hidden="true" />
                  Search
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                  Popular areas:
                </span>
                {POPULAR_DISTRICTS.slice(0, 5).map((district) => (
                  <Link
                    key={district.slug}
                    href={`/search?district=${district.slug}&type=${activeTab}`}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    {district.name}
                  </Link>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
