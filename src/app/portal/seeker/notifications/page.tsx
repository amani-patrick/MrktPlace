import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    id: "1",
    title: "Price drop on Remera apartment",
    body: "Modern 2BR Apartment in Remera is now 450,000 RWF/month.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    title: "New listing in Kimironko",
    body: "A room matching your saved search is now available.",
    time: "1 day ago",
    unread: true,
  },
  {
    id: "3",
    title: "Verified property added in Gasabo",
    body: "A new verified house was posted in your preferred district.",
    time: "3 days ago",
    unread: false,
  },
];

export const metadata = { title: "Notifications" };

export default function SeekerNotificationsPage() {
  return (
    <div>
      <PortalPageHeader
        title="Notifications"
        description="Price changes, new listings, and updates on saved properties."
      />

      <div className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border/80 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">{item.time}</p>
              </div>
              {item.unread ? (
                <Badge className="bg-rw-blue text-white">New</Badge>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
