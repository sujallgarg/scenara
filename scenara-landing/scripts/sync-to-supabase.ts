import fs from "fs";
import path from "path";

async function main() {
  const supabaseUrl =
    process.env.SUPABASE_URL || "https://sqiekgmswldgiqfpjdxf.supabase.co";
  const supabaseKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    console.error("❌ SUPABASE_SECRET_KEY or SUPABASE_PUBLISHABLE_KEY must be set in environment variables.");
    process.exit(1);
  }

  console.log(`Checking Supabase connection at: ${supabaseUrl}...`);

  const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/waitlist`;

  // 1. Check table existence
  const checkRes = await fetch(`${endpoint}?select=*&limit=1`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (checkRes.status === 404) {
    console.error(`\n❌ Table 'waitlist' does not exist in Supabase yet.`);
    console.log(`\nTo create it, open your Supabase SQL Editor and run:`);
    console.log(`
CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text,
  use_case text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public waitlist inserts" 
ON public.waitlist FOR INSERT TO anon, authenticated, service_role 
WITH CHECK (true);

CREATE POLICY "Allow service role read" 
ON public.waitlist FOR SELECT TO service_role 
USING (true);
`);
    process.exit(1);
  }

  if (!checkRes.ok) {
    const text = await checkRes.text();
    console.error(`❌ Supabase error (${checkRes.status}):`, text);
    process.exit(1);
  }

  console.log(`✅ Table 'waitlist' exists and is ready!`);

  // 2. Read local entries
  const localFile = path.join(__dirname, "../data/waitlist.json");
  if (!fs.existsSync(localFile)) {
    console.log("No local entries to sync.");
    return;
  }

  const entries = JSON.parse(fs.readFileSync(localFile, "utf-8") || "[]");
  console.log(`Found ${entries.length} local entries to sync...`);

  let synced = 0;
  for (const entry of entries) {
    const postRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        email: entry.email,
        role: entry.role || "Other",
        use_case: entry.useCase || "",
        created_at: entry.createdAt || new Date().toISOString(),
      }),
    });

    if (postRes.ok || postRes.status === 409) {
      synced++;
      console.log(`  ✓ Synced: ${entry.email} ${postRes.status === 409 ? "(already present)" : ""}`);
    } else {
      const err = await postRes.text();
      console.warn(`  ⚠ Could not sync ${entry.email}:`, err);
    }
  }

  console.log(`\n🎉 Sync complete! ${synced}/${entries.length} entries in Supabase.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

