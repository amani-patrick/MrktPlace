"use client";

import { trackEvent } from "@/app/actions/events";

interface TrackContactLinkProps {
  listingId: string;
  type: "contact_phone" | "contact_whatsapp";
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function TrackContactLink({
  listingId,
  type,
  href,
  className,
  children,
}: TrackContactLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        void trackEvent(type, { listingId });
      }}
    >
      {children}
    </a>
  );
}
