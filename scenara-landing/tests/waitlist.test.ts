import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { NextRequest } from "next/server";
import { POST as waitlistHandler, GET as getWaitlistHandler } from "../src/app/api/waitlist/route";

describe("Waitlist API", () => {
  const uniqueTestEmail = `test.waitlist.${Date.now()}@example.com`;

  it("Rejects missing email with 400", async () => {
    const req = new NextRequest("http://localhost:3001/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await waitlistHandler(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error.includes("Email address is required"));
  });

  it("Rejects invalid email format with 400", async () => {
    const req = new NextRequest("http://localhost:3001/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid-email-address" }),
    });
    const res = await waitlistHandler(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error.includes("valid email"));
  });

  it("Accepts valid email and adds to waitlist with 201", async () => {
    const req = new NextRequest("http://localhost:3001/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: uniqueTestEmail,
        role: "Founder / Executive",
        useCase: "Simulating tokenomics adoption",
      }),
    });
    const res = await waitlistHandler(req);
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.email, uniqueTestEmail);
  });

  it("Prevents duplicate waitlist submissions with 409", async () => {
    const req = new NextRequest("http://localhost:3001/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: uniqueTestEmail,
        role: "Investor",
      }),
    });
    const res = await waitlistHandler(req);
    assert.equal(res.status, 409);
    const data = await res.json();
    assert.ok(data.error.includes("already on the"));
  });

  it("Returns all waitlist entries via GET /api/waitlist", async () => {
    const res = await getWaitlistHandler();
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(Array.isArray(data.entries));
    assert.ok(data.totalWaitlistCount >= 1);
  });
});

