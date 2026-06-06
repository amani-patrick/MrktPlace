"use client";

import { useEffect } from "react";
import { recordListingView } from "@/app/actions/listing-views";

export function RecordListingView({ listingId }: { listingId: string }) {
  useEffect(() => {
    void recordListingView(listingId);
  }, [listingId]);

  return null;
}
