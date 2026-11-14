"use client";

import React from "react";
import {
  FileEdit,
  Users2,
  PlayCircle,
  BarChart4,
  ArrowRight,
  Sparkles,
  GitFork,
  RefreshCw,
  Network,
} from "lucide-react";

export default function HowItWorksAndDifferentiators() {
  const steps = [
    {
      num: 1,
      icon: FileEdit,
      title: "Define a Scenario",
      desc: "Describe your idea, decision, or policy.",
    },
    {
      num: 2,
      icon: Users2,
      title: "Build an AI Society",
      desc: "Create a diverse group of realistic AI agents.",
    },
    {
      num: 3,
      icon: PlayCircle,
      title: "Run the Simulation",
      desc: "Let agents interact, debate, and evolve their views.",
    },
    {
      num: 4,
      icon: BarChart4,
      title: "Explore Outcomes",
      desc: "See patterns, risks, and different possible outcomes.",
    },
  ];

  const differentiators = [
    {
      icon: Users2,
      title: "Diverse Agent Societies",
      desc: "Simulate varied perspectives, roles, and motivations.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
    },
    {
      icon: Network,
      title: "Real Interactions",
      desc: "Agents influence, challenge, and change each other's views.",
      color: "bg-teal-50 text-teal-600 border-teal-200/80",
    },
    {
      icon: RefreshCw,
      title: "Evolving Opinions",
      desc: "Watch beliefs shift across multiple rounds.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
    },
    {
      icon: Sparkles,
      title: "Explainable Outcomes",
      desc: "Get clear, concise rationales for every major change.",
      color: "bg-cyan-50 text-cyan-600 border-cyan-200/80",
    },
  ];

  return (
    <div className="space-y-24 md:space-y-32">
      {/* SECTION: HOW SCENARA WORKS */}
      <section id="how-it-works" className="py-12 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#0D1817] tracking-tight leading-tight mb-3">
            How Scenara Works
          </h2>
          <p className="text-base sm:text-lg text-[#556966]">
            From your idea to a simulated society in minutes.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative flex flex-col">
                <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Top row with step number and icon */}
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {step.num}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#556966] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Connecting Arrow for desktop (not on last item) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 text-zinc-300 pointer-events-none">
                    <ArrowRight className="w-5 h-5 text-emerald-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: WHAT MAKES SCENARA DIFFERENT */}
      <section className="py-6 px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1817] tracking-tight leading-tight">
            What Makes Scenara Different
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {differentiators.map((diff, index) => {
            const Icon = diff.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 border ${diff.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-2">
                  {diff.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#556966] leading-relaxed">
                  {diff.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

