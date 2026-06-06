"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HERO_BG = "/images/placeholders/hero.svg";

export function AmniiHero() {
  const router = useRouter();
  const [mode, setMode] = useState<"rent" | "sale">("rent");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("type", mode === "rent" ? "rent" : "sale");
    if (location) params.set("q", location);
    if (propertyType) params.set("property", propertyType);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <section className="relative min-h-[520px] overflow-hidden bg-amnii-navy lg:min-h-[580px]">
      <Image
        src={HERO_BG}
        alt="Kigali cityscape at dusk"
        fill
        priority
        className="object-cover opacity-40"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-amnii-navy/80 via-amnii-navy/60 to-amnii-navy/90" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amnii-gold/30 bg-amnii-gold/10 px-4 py-1.5 text-sm font-medium text-amnii-gold">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Verified listings across Rwanda
        </div>

        <h1 className="max-w-3xl font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
          Discover your next home in Rwanda
        </h1>
        <p className="mt-4 max-w-xl text-base text-white/70 sm:text-lg">
          Search apartments, houses, and rooms across Kigali and all 30 districts.
          Contact owners directly — always free.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-10 w-full max-w-3xl rounded-2xl bg-white p-2 shadow-2xl shadow-black/20"
        >
          <div className="mb-2 flex rounded-xl bg-muted p-1">
            {(["rent", "sale"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={cn(
                  "flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all",
                  mode === tab
                    ? "bg-amnii-navy text-white shadow-sm"
                    : "text-muted-foreground hover:text-amnii-navy",
                )}
              >
                {tab === "rent" ? "Rent" : "Buy"}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <MapPin
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="District, sector, or area..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-white pr-4 pl-10 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
              />
            </div>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="h-12 rounded-xl border border-border bg-white px-4 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20 sm:w-44"
            >
              <option value="">All types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="room">Room</option>
              <option value="studio">Studio</option>
              <option value="office">Office</option>
            </select>
            <Button
              type="submit"
              className="h-12 gap-2 rounded-xl bg-amnii-gold px-6 font-semibold text-amnii-navy hover:bg-amnii-gold-dark hover:text-white"
            >
              <Search className="size-4" aria-hidden="true" />
              Search
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
