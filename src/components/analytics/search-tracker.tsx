"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/app/actions/events";

export function SearchTracker() {
  const searchParams = useSearchParams();
  const lastKey = useRef("");

  useEffect(() => {
    const key = searchParams.toString();
    if (!key || key === lastKey.current) return;
    lastKey.current = key;

    void trackEvent("search_performed", {
      metadata: {
        district: searchParams.get("district") ?? "",
        type: searchParams.get("type") ?? "",
        property: searchParams.get("property") ?? "",
        q: searchParams.get("q") ?? "",
        minPrice: searchParams.get("minPrice") ?? "",
        maxPrice: searchParams.get("maxPrice") ?? "",
      },
    });
  }, [searchParams]);

  return null;
}
