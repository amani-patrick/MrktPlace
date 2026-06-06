import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { Badge } from "@/components/ui/badge";

const inquiries = [
  {
    id: "1",
    listing: "Modern 2BR Apartment in Remera",
    from: "Alice M.",
    phone: "+250 788 111 222",
    message: "Is this still available? Can I visit this weekend?",
    time: "1 hour ago",
    status: "new",
  },
  {
    id: "2",
    listing: "Family House in Kicukiro",
    from: "Eric K.",
    phone: "+250 788 333 444",
    message: "Interested in buying. What's the final price?",
    time: "Yesterday",
    status: "replied",
  },
];

export const metadata = { title: "Inquiries" };

export default function OwnerInquiriesPage() {
  return (
    <div>
      <PortalPageHeader
        title="Inquiries"
        description="Respond to people interested in your properties."
      />

      <div className="space-y-4">
        {inquiries.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border/80 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{item.from}</p>
                <p className="text-sm text-rw-green">{item.phone}</p>
              </div>
              <Badge variant={item.status === "new" ? "default" : "secondary"}>
                {item.status}
              </Badge>
            </div>
            <p className="mt-2 text-sm font-medium">{item.listing}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.message}</p>
            <p className="mt-3 text-xs text-muted-foreground">{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
