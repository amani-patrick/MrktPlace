import { NextResponse } from "next/server";
import { sendMatchingListingAlerts } from "@/app/actions/alerts";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await sendMatchingListingAlerts();
  return NextResponse.json(result);
}
