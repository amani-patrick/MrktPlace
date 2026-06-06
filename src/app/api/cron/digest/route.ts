import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { getPlatformHealth } from "@/lib/data/analytics";
import { runScamDetection } from "@/lib/data/analytics";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const health = await getPlatformHealth();
  const flagged = await runScamDetection();
  const to = process.env.FOUNDER_DIGEST_EMAIL;

  if (to) {
    await sendEmail({
      to,
      subject: `Amnii weekly digest — ${health.activeListings} active listings`,
      html: `
        <h2>Amnii platform health (7 days)</h2>
        <ul>
          <li>Sign-ups: ${health.signups7d}</li>
          <li>Active listings: ${health.activeListings}</li>
          <li>Pending approvals: ${health.pendingListings}</li>
          <li>Contact clicks: ${health.contacts7d}</li>
          <li>Searches: ${health.searches7d}</li>
          <li>Agent reviews: ${health.reviews7d}</li>
          <li>Open reports: ${health.openReports}</li>
          <li>New scam flags: ${flagged}</li>
        </ul>
      `,
    });
  }

  return NextResponse.json({ health, flagged, emailed: Boolean(to) });
}
