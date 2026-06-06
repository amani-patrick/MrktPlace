#!/usr/bin/env node
/**
 * Weekly founder digest — run via cron:
 * curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain/api/cron/digest
 *
 * Or locally: CRON_SECRET=xxx node scripts/weekly-digest.mjs
 */
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const secret = process.env.CRON_SECRET;

if (!secret) {
  console.error("Set CRON_SECRET");
  process.exit(1);
}

const res = await fetch(`${base}/api/cron/digest`, {
  headers: { Authorization: `Bearer ${secret}` },
});

console.log(await res.json());
