import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { POPULAR_DISTRICTS } from "@/config/constants";
import { getDistrictImage } from "@/lib/images";

const tagColors = [
  "bg-rw-blue/90",
  "bg-rw-green/90",
  "bg-rw-yellow/90 text-foreground",
] as const;

export function PopularDistricts() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {POPULAR_DISTRICTS.map((district, index) => (
        <Link
          key={district.slug}
          href={`/search?district=${district.slug}`}
          className="group relative isolate overflow-hidden rounded-2xl shadow-md ring-1 ring-border/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-primary/30"
        >
          <div className="relative aspect-[16/10]">
            <Image
              src={getDistrictImage(district.slug)}
              alt={`Properties in ${district.name}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-rw-blue/20" />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <span
              className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${tagColors[index % tagColors.length]}`}
            >
              {district.tag}
            </span>
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="font-heading text-xl font-bold">{district.name}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-white/85">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {district.listingCount.toLocaleString()} listings
                </p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rw-yellow text-foreground transition-transform group-hover:scale-110">
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
