"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, Check, Loader2, ShieldCheck, Sparkles } from "lucide-react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Other");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [message, setMessage] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const maskEmailAddress = (rawEmail: string) => {
    const parts = rawEmail.split("@");
    if (parts.length !== 2) return rawEmail;
    const [name, domain] = parts;
    if (name.length <= 2) return `${name[0]}*@${domain}`;
    return `${name[0]}${"*".repeat(Math.min(name.length - 2, 4))}${name[name.length - 1]}@${domain}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid work or personal email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          role: role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 201 || res.status === 200) {
        setMaskedEmail(maskEmailAddress(email.trim().toLowerCase()));
        setStatus("success");
        setMessage(
          data.message ||
            "You're on the list! We'll notify you as soon as new simulation cohorts open."
        );
        setEmail("");
      } else if (res.status === 409) {
        setMaskedEmail(maskEmailAddress(email.trim().toLowerCase()));
        setStatus("duplicate");
        setMessage(
          data.error ||
            "You're already on the waitlist! We have reserved your early access spot."
        );
      } else {
        setStatus("error");
        setMessage(data.error || "Unable to join waitlist. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network connection interrupted. Please try again.");
    }
  };

  return (
    <section id="waitlist" className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
      {/* Dark Charcoal / Forest Green Container */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#091D18] via-[#071612] to-[#040E0C] text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl border border-emerald-900/40">
        {/* Subtle Wave / Contour SVG Lines in background */}
        <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M -100 400 C 200 350 400 200 700 280 C 900 330 1000 220 1200 250"
              stroke="#00D084"
              strokeWidth="1.5"
            />
            <path
              d="M -100 400 C 150 280 450 320 800 200 C 1000 130 1100 260 1200 300"
              stroke="#05D38A"
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />
            <path
              d="M -100 400 C 300 240 600 380 900 150 C 1050 100 1150 180 1200 200"
              stroke="#34D399"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
          </svg>
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Be the first to test your world.
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-8 max-w-lg mx-auto">
            Join the Scenara waitlist and get early access to the simulation platform.
          </p>

          {/* Form */}
          {status !== "success" && status !== "duplicate" ? (
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-6">
              <div className="relative flex flex-col sm:flex-row items-center bg-white rounded-2xl p-1.5 shadow-xl border border-emerald-300/30 gap-2">
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 w-full">
                  <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={status === "loading"}
                    className="w-full bg-transparent text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00D084] hover:bg-[#05b875] text-[#041A13] font-bold text-xs sm:text-sm tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5 shrink-0 shadow-sm disabled:opacity-70 cursor-pointer"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Securing...</span>
                    </>
                  ) : (
                    <>
                      <span>Join the Waitlist</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {status === "error" && (
                <p className="mt-3 text-xs text-rose-300 font-medium">{message}</p>
              )}
            </form>
          ) : (
            <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-6 mb-6 max-w-md mx-auto backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {status === "duplicate" ? "Already on the list!" : "You're on the waitlist!"}
              </h3>
              <p className="text-xs text-zinc-300 mb-3 leading-relaxed">
                Reserved for <strong className="text-emerald-400 font-semibold">{maskedEmail}</strong>.
              </p>
              <p className="text-[11px] text-zinc-400">
                We review cohort invites weekly. Keep an eye on your inbox for your access key.
              </p>
            </div>
          )}

          {/* 3 Trust Indicators with checkmarks */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-zinc-300 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span>Early access</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span>Product updates</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span>Behind-the-scenes builds</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
