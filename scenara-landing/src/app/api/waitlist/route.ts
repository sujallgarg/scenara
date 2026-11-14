import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// RFC 5322 compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export interface WaitlistSubmission {
  email: string;
  role?: string;
  useCase?: string;
  createdAt: string;
  userAgent?: string;
}

// In-memory set for fast duplicate checking during runtime
const memoryWaitlist = new Set<string>();

function saveToLocalStorage(submission: WaitlistSubmission): { isDuplicate: boolean } {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "waitlist.json");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  let entries: WaitlistSubmission[] = [];
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      entries = JSON.parse(fileContent || "[]");
    } catch {
      entries = [];
    }
  }

  const isDuplicate = entries.some((e) => e.email.toLowerCase() === submission.email.toLowerCase());
  if (isDuplicate) {
    return { isDuplicate: true };
  }

  entries.push(submission);
  fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), "utf-8");
  memoryWaitlist.add(submission.email);
  return { isDuplicate: false };
}

// GET /api/waitlist - View all captured waitlist entries
export async function GET() {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "waitlist.json");

  let localEntries: WaitlistSubmission[] = [];
  if (fs.existsSync(filePath)) {
    try {
      localEntries = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
    } catch {
      localEntries = [];
    }
  }

  return NextResponse.json({
    status: "ok",
    totalWaitlistCount: localEntries.length,
    entries: localEntries,
  });
}

// POST /api/waitlist - Submit to waitlist
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { email, role, useCase } = body as { email?: string; role?: string; useCase?: string };

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(sanitizedEmail) || sanitizedEmail.length > 254) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    }

    const submission: WaitlistSubmission = {
      email: sanitizedEmail,
      role: typeof role === "string" ? role.slice(0, 100) : "Other",
      useCase: typeof useCase === "string" ? useCase.slice(0, 500) : "",
      createdAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent")?.slice(0, 200) || "Unknown",
    };

    // Fast memory duplicate check
    if (memoryWaitlist.has(sanitizedEmail)) {
      return NextResponse.json(
        { error: "You're already on the Scenara waitlist! We'll notify you soon." },
        { status: 409 }
      );
    }

    // Always ensure it's saved locally first so data is NEVER lost
    const localResult = saveToLocalStorage(submission);
    if (localResult.isDuplicate) {
      memoryWaitlist.add(sanitizedEmail);
      return NextResponse.json(
        { error: "You're already on the Scenara waitlist! We'll notify you soon." },
        { status: 409 }
      );
    }

    // Attempt Supabase database write if configured
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/waitlist`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            email: submission.email,
            role: submission.role,
            use_case: submission.useCase,
            created_at: submission.createdAt,
          }),
        });

        if (res.status === 409 || res.status === 422) {
          return NextResponse.json(
            { error: "You're already on the Scenara waitlist! We'll notify you as soon as access opens." },
            { status: 409 }
          );
        }

        if (res.ok) {
          console.log(`[Waitlist] Synced to Supabase: ${sanitizedEmail}`);
        } else {
          console.warn(`[Waitlist] Supabase status ${res.status}: Saved to local database storage.`);
        }
      } catch (sbErr) {
        console.warn("[Waitlist] Supabase connection failed: Saved to local database storage.", sbErr);
      }
    }

    // Always succeed cleanly for the user
    return NextResponse.json(
      {
        success: true,
        message: "You have been added to the Scenara early access waitlist.",
        email: sanitizedEmail,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Waitlist API Error]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
