#!/usr/bin/env node
/**
 * Create or update the platform admin user (service role only).
 * Run once locally: npm run db:seed:admin
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error("Missing .env.local — copy .env.example and add Supabase keys.");
  }
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
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const ADMIN_EMAIL = env.ADMIN_EMAIL ?? "admin@amnii.rw";
const ADMIN_PASSWORD = env.ADMIN_PASSWORD ?? "ChangeMeAdmin123!";
const ADMIN_NAME = env.ADMIN_FULL_NAME ?? "Amnii Admin";

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  let page = 1;
  const perPage = 200;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function main() {
  let user = await findUserByEmail(ADMIN_EMAIL);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_NAME, role: "admin" },
    });
    if (error) throw new Error(`createUser: ${error.message}`);
    user = data.user;
    console.log(`Created admin user: ${ADMIN_EMAIL}`);
  } else {
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: ADMIN_PASSWORD,
      user_metadata: { full_name: ADMIN_NAME, role: "admin" },
    });
    if (error) throw new Error(`updateUser: ${error.message}`);
    console.log(`Admin user already exists — profile and password refreshed: ${ADMIN_EMAIL}`);
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: ADMIN_EMAIL,
      full_name: ADMIN_NAME,
      role: "admin",
    },
    { onConflict: "id" },
  );

  if (profileError) throw new Error(`profiles: ${profileError.message}`);

  console.log("Admin profile role set to admin.");
  console.log("");
  console.log("Sign in at /en/login (or /fr/login) with:");
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log("");
  console.log("After sign-in you will be redirected to /portal/admin.");
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
