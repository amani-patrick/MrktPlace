#!/usr/bin/env node
/**
 * Apply supabase/migrations/*.sql to your Supabase database.
 * Requires SUPABASE_DB_PASSWORD in .env.local (Dashboard → Settings → Database).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split("\n")
      .filter((l) => l && !l.startsWith("#"))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i), l.slice(i + 1)];
      }),
  );
}

const env = loadEnv();
const projectRef = env.NEXT_PUBLIC_SUPABASE_URL?.match(
  /https:\/\/([^.]+)\.supabase\.co/,
)?.[1];

const password = env.SUPABASE_DB_PASSWORD;
if (!projectRef || !password) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_DB_PASSWORD in .env.local",
  );
  console.error(
    "Get your database password from: Supabase Dashboard → Settings → Database",
  );
  process.exit(1);
}

const connectionString =
  env.DATABASE_URL ??
  `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;

const migrationsDir = path.join(root, "supabase", "migrations");
const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log("Connected to Supabase Postgres");

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`Applying ${file}...`);
    await client.query(sql);
    console.log(`  ✓ ${file}`);
  }

  console.log("All migrations applied.");
} catch (err) {
  console.error("Migration failed:", err.message);
  if (err.message.includes("ENOTFOUND") || err.message.includes("tenant")) {
    console.error(
      "\nTip: Set DATABASE_URL in .env.local using the connection string from",
    );
    console.error("Supabase Dashboard → Settings → Database → Connection string (URI)");
  }
  process.exit(1);
} finally {
  await client.end();
}
