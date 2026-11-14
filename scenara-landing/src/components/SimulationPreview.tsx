"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, AlertTriangle, Radio, Sparkles } from "lucide-react";
import ScenaraLogoMark from "./ScenaraLogoMark";

interface RoundData {
  round: number;
  label: string;
  consensus: string;
  supportive: number;
  neutral: number;
  opposed: number;
  frictionPoint: string;
  phase: string;
  agentName: string;
  agentRole: string;
  agentInitial: string;
  agentQuote: string;
  rationale: string;
}

const ROUNDS: RoundData[] = [
  {
    round: 1,
    label: "Round 1",
    consensus: "32% Alignment",
    supportive: 28,
    neutral: 34,
    opposed: 38,
    frictionPoint:
      "High upfront infrastructure cost triggers strong resistance from regional operators.",
    phase: "Initial Proposal & Persona Assessment",
    agentName: "Marcus Vance",
    agentRole: "Regional Fleet Operator",
    agentInitial: "M",
    agentQuote:
      "Without capital subsidies or tiered transition options, this rollout will immediately stall at next Tuesday's transit board.",
    rationale:
      "Severe capital expenditure barrier identified before operational efficiency is proven.",
  },
  {
    round: 2,
    label: "Round 2",
    consensus: "48% Alignment",
    supportive: 45,
    neutral: 26,
    opposed: 29,
    frictionPoint:
      "Data telemetry sharing model causes enterprise security and compliance concerns.",
    phase: "Dyadic Debate & Incentive Restructuring",
    agentName: "Elena Rostova",
    agentRole: "Enterprise Procurement VP",
    agentInitial: "E",
    agentQuote:
      "If tiered data anonymization is guaranteed, our compliance committee can shift this from rejected to conditional approval.",
    rationale:
      "Data sovereignty guarantees introduced to unlock enterprise buyer acceptance.",
  },
  {
    round: 3,
    label: "Round 3",
    consensus: "+65% Consensus",
    supportive: 65,
    neutral: 18,
    opposed: 17,
    frictionPoint:
      "Licensing fee tiering sparks debate between enterprise buyers and small operators.",
    phase: "Public Broadcast & Stance Convergence",
    agentName: "Sarah Lin",
    agentRole: "Policy Advisor • Regulator",
    agentInitial: "S",
    agentQuote:
      "The revised oversight clause satisfies regional safety mandates. We recommend provisional sandbox approval.",
    rationale:
      "Formal regulatory alignment reached following inclusion of emergency kill-switch audits.",
  },
  {
    round: 4,
    label: "Round 4",
    consensus: "+78% Consensus",
    supportive: 78,
    neutral: 12,
    opposed: 10,
    frictionPoint:
      "Residual timeline constraints from regional labor associations.",
    phase: "Coalition Consolidation & Nuance Resolution",
    agentName: "Devin Zhao",
    agentRole: "Fleet Growth Strategist",
    agentInitial: "D",
    agentQuote:
      "The graduated 6-month transition window addresses the majority of labor concerns. Staged pilot deployment is now viable.",
    rationale:
      "Timeline adjustment built overwhelming support among cautious stakeholder groups.",
  },
  {
    round: 5,
    label: "Round 5",
    consensus: "+84% Consensus",
    supportive: 84,
    neutral: 9,
    opposed: 7,
    frictionPoint:
      "Edge-case insurance liability under extreme weather scenarios.",
    phase: "Equilibrium Reached & Decision Blueprint",
    agentName: "Aarav Patel",
    agentRole: "Strategic Operations VP",
    agentInitial: "A",
    agentQuote:
      "The simulated society has reached stable consensus. Proceed with rollout using the verified 90-day sandbox framework.",
    rationale:
      "Optimal policy discovered through 5 rounds of synthetic debate without risking real capital.",
  },
];

export default function SimulationPreview() {
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(2); // Default to Round 3 as shown in design
  const current = ROUNDS[selectedRoundIndex];

  return (
    <section id="preview" className="py-20 md:py-28 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Heading, intro & value checklist */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">
            <span className="text-emerald-500 font-bold">—</span>
            <span>INTERACTIVE PREVIEW</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#0D1817] tracking-tight leading-[1.15] mb-5">
            See a simulation in action
          </h2>

          <p className="text-[#556966] text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
            Watch how AI agents discuss, disagree, change opinions, and reach a
            collective outcome over multiple rounds.
          </p>

          {/* Checklist */}
          <ul className="space-y-4">
            {[
              "Realistic agent personas",
              "Multi-round interactions",
              "Evolving opinions",
              "Concise decision rationales",
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                </span>
                <span className="text-sm sm:text-base font-semibold text-zinc-800">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Simulation Dashboard Card */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-zinc-200/90 shadow-2xl bg-white overflow-hidden transition-all duration-300">
            {/* Dark Top Bar */}
            <div className="bg-[#0B1514] text-white px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center p-0.5">
                  <ScenaraLogoMark size={14} className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-100">
                  Simulation: Fleet Rollout Strategy
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">
                  Live Preview
                </span>
              </div>

              <span className="text-[11px] text-zinc-400 font-normal">
                Illustrative results • Not real predictions
              </span>
            </div>

            {/* Inner Content Area */}
            <div className="p-5 sm:p-7 bg-[#FCFDFD]">
              {/* Round Selector Bar */}
              <div className="flex items-center justify-end gap-1.5 sm:gap-2 mb-6 border-b border-zinc-100 pb-4 overflow-x-auto">
                {ROUNDS.map((r, index) => {
                  const isActive = index === selectedRoundIndex;
                  return (
                    <button
                      key={r.round}
                      onClick={() => setSelectedRoundIndex(index)}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-[#00D084] text-white shadow-xs"
                          : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/70"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>

              {/* 2-Column Grid inside the preview */}
              <div className="grid md:grid-cols-12 gap-6">
                {/* Left Mini Column: Belief Spectrum & Diagnostics */}
                <div className="md:col-span-5 space-y-4">
                  {/* Belief Spectrum Box */}
                  <div className="bg-white rounded-xl p-4 border border-zinc-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-zinc-900">
                        Belief Spectrum ({current.label})
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800">
                        {current.consensus}
                      </span>
                    </div>

                    {/* Segmented bar */}
                    <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-100 mb-3 shadow-inner">
                      <div
                        className="bg-emerald-500 transition-all duration-500 ease-out"
                        style={{ width: `${current.supportive}%` }}
                      />
                      <div
                        className="bg-zinc-300 transition-all duration-500 ease-out"
                        style={{ width: `${current.neutral}%` }}
                      />
                      <div
                        className="bg-rose-400 transition-all duration-500 ease-out"
                        style={{ width: `${current.opposed}%` }}
                      />
                    </div>

                    {/* Stats Breakdown */}
                    <div className="grid grid-cols-3 text-center text-[11px]">
                      <div>
                        <div className="font-bold text-zinc-900">
                          {current.supportive}%
                        </div>
                        <div className="text-emerald-700 font-medium text-[10px]">
                          Supportive
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900">
                          {current.neutral}%
                        </div>
                        <div className="text-zinc-500 font-medium text-[10px]">
                          Neutral
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900">
                          {current.opposed}%
                        </div>
                        <div className="text-rose-600 font-medium text-[10px]">
                          Opposed
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Friction Point Box */}
                  <div className="bg-[#FFFDF5] rounded-xl p-3.5 border border-amber-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Detected Friction Point</span>
                    </div>
                    <p className="text-xs text-amber-950/80 leading-relaxed font-normal">
                      {current.frictionPoint}
                    </p>
                  </div>

                  {/* Round Phase Box */}
                  <div className="bg-white rounded-xl p-3.5 border border-zinc-200/80">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 mb-1">
                      <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                      <span>Round Phase</span>
                    </div>
                    <p className="text-xs font-bold text-zinc-900 leading-snug">
                      {current.phase}
                    </p>
                  </div>
                </div>

                {/* Right Mini Column: Key Deliberation & Rationale */}
                <div className="md:col-span-7 flex flex-col justify-between">
                  <div className="bg-white rounded-xl p-5 border border-zinc-200/80 shadow-xs h-full flex flex-col justify-between">
                    <div>
                      {/* Sub-header */}
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
                        <span className="text-xs font-bold text-zinc-900">
                          Key Deliberation ({current.label})
                        </span>
                        <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                          Dyadic & Public Dialogue
                        </span>
                      </div>

                      {/* Agent Info */}
                      <div className="flex items-center gap-3 mb-3.5">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {current.agentInitial}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900 leading-tight">
                            {current.agentName}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-medium">
                            {current.agentRole}
                          </div>
                        </div>
                      </div>

                      {/* Agent Quote Bubble */}
                      <div className="bg-[#F8FAF9] rounded-xl p-4 border-l-4 border-emerald-500 border-zinc-200/70 mb-4 text-xs sm:text-sm text-zinc-800 italic leading-relaxed">
                        &ldquo;{current.agentQuote}&rdquo;
                      </div>
                    </div>

                    {/* Decision Rationale */}
                    <div className="pt-3 border-t border-zinc-100">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-zinc-700 leading-relaxed">
                          <strong className="text-zinc-900 font-semibold">
                            Decision Rationale:
                          </strong>{" "}
                          {current.rationale}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
