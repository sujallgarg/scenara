"use client";

import React from "react";
import { TrendingUp, Rocket, Scale, Megaphone, ArrowUpRight } from "lucide-react";

export default function UseCasesSection() {
  const useCases = [
    {
      icon: Rocket,
      title: "Product & Go-To-Market Launches",
      description:
        "Simulate adoption curves, feature skepticism, and word-of-mouth spread across target customer personas before writing a single line of code.",
      badge: "Market Validation",
    },
    {
      icon: TrendingUp,
      title: "Pricing & Tiering Restructuring",
      description:
        "Discover churn risks, willingness-to-pay elasticity, and tiering friction points between enterprise buyers and small operators.",
      badge: "Revenue Strategy",
    },
    {
      icon: Scale,
      title: "Policy & Regulatory Governance",
      description:
        "Model how compliance mandates, safety constraints, and stakeholder factions respond across iterative deliberation rounds.",
      badge: "Policy Planning",
    },
    {
      icon: Megaphone,
      title: "Brand Narratives & PR Positioning",
      description:
        "Identify polarization traps and brand sensitivity points in synthetic social networks before launching public campaigns.",
      badge: "Risk Mitigation",
    },
  ];

  return (
    <section id="use-cases" className="py-20 md:py-28 px-6 max-w-7xl mx-auto border-t border-zinc-200/60">
      <div className="max-w-2xl mb-14">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-2">
          APPLICATIONS
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1817] tracking-tight leading-tight mb-3">
          Simulate high-stakes decisions across industries.
        </h2>
        <p className="text-base text-[#556966] leading-relaxed">
          From venture-backed startups to enterprise strategy teams, Scenara replaces blind guesswork with observable multi-agent dynamics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {useCases.map((uc, i) => {
          const Icon = uc.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {uc.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {uc.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#556966] leading-relaxed">
                  {uc.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                <span>Explore dynamics</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

