"use server";

import { sendEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export async function sendMatchingListingAlerts() {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("user_id, preferred_listing_type, preferred_districts, max_budget, profiles ( email, full_name )")
    .eq("alerts_enabled", true);

  if (!prefs?.length) return { sent: 0 };

  const since = new Date();
  since.setHours(since.getHours() - 24);

  const { data: newListings } = await supabase
    .from("listings")
    .select("id, title, district, price, listing_type, property_type")
    .eq("status", "active")
    .gte("created_at", since.toISOString())
    .limit(50);

  if (!newListings?.length) return { sent: 0 };

  let sent = 0;

  for (const pref of prefs) {
    const profiles = pref.profiles as
      | { email: string | null; full_name: string | null }
      | { email: string | null; full_name: string | null }[]
      | null;
    const profile = Array.isArray(profiles) ? profiles[0] : profiles;
    const email = profile?.email;
    if (!email) continue;

    const districts = pref.preferred_districts ?? [];
    const type = pref.preferred_listing_type;

    const matches = newListings.filter((l) => {
      const districtOk =
        districts.length === 0 ||
        districts.some((d: string) => d.toLowerCase() === l.district.toLowerCase());
      const typeOk =
        !type ||
        type === "both" ||
        l.listing_type === type ||
        (type === "buy" && l.listing_type === "sale");
      const budgetOk = !pref.max_budget || Number(l.price) <= Number(pref.max_budget);
      return districtOk && typeOk && budgetOk;
    });

    if (!matches.length) continue;

    const already = await supabase
      .from("alert_notifications")
      .select("listing_id")
      .eq("user_id", pref.user_id)
      .in(
        "listing_id",
        matches.map((m) => m.id),
      );

    const sentIds = new Set((already.data ?? []).map((r) => r.listing_id));
    const toSend = matches.filter((m) => !sentIds.has(m.id)).slice(0, 3);
    if (!toSend.length) continue;

    const listHtml = toSend
      .map(
        (l) =>
          `<li><a href="${siteUrl}/en/listings/${l.id}">${l.title}</a> — ${l.district} — ${Number(l.price).toLocaleString()} RWF</li>`,
      )
      .join("");

    const ok = await sendEmail({
      to: email,
      subject: `${toSend.length} new listing${toSend.length > 1 ? "s" : ""} match your preferences on Amnii`,
      html: `<p>Hi ${profile?.full_name ?? "there"},</p><p>New properties matching your Amnii preferences:</p><ul>${listHtml}</ul><p>— Amnii Rwanda</p>`,
    });

    if (ok) {
      for (const l of toSend) {
        await supabase.from("alert_notifications").insert({
          user_id: pref.user_id,
          listing_id: l.id,
          channel: "email",
          sent_at: new Date().toISOString(),
        });
      }
      sent += 1;
    }
  }

  return { sent };
}
