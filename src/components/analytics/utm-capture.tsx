"use client";

import { useEffect } from "react";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

/** Persist UTM params from URL for sign-up attribution */
export function UtmCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const v = params.get(key);
      if (v) utm[key] = v;
    }
    if (Object.keys(utm).length > 0) {
      sessionStorage.setItem("amnii_utm", JSON.stringify(utm));
    }
  }, []);

  return null;
}

export function getStoredUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("amnii_utm") ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}
