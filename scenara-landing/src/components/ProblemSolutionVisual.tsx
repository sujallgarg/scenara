"use client";

import React from "react";
import ScenaraLogoMark from "./ScenaraLogoMark";

export default function ProblemSolutionVisual() {
  return (
    <section id="about" className="py-20 md:py-28 px-6 max-w-7xl mx-auto border-t border-zinc-200/60">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: Illustration of Guess & Launch vs Test & Explore bridged by Scenara */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-[520px] bg-gradient-to-b from-white to-[#F4F9F7] rounded-3xl border border-zinc-200/80 p-6 sm:p-7 flex flex-col justify-between shadow-sm overflow-hidden">
            {/* Soft background radial glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-zinc-200/40 rounded-full blur-2xl pointer-events-none" />

            {/* Visual Canvas Area with SVG and Floating Bridge Core */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/10.5] flex items-center justify-center">
              {/* SVG Landscape & Bridge */}
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 500 250"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="chasmGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#41514D" />
                    <stop offset="100%" stopColor="#111B19" />
                  </linearGradient>
                  <linearGradient id="lushGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D084" />
                    <stop offset="100%" stopColor="#028654" />
                  </linearGradient>
                  <linearGradient id="bridgeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6C8781" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#00D084" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#05D38A" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Left Cliff: Guess & Launch */}
                <path
                  d="M 0 250 L 0 155 C 35 150 70 146 110 142 C 128 140 136 150 140 180 C 143 205 138 230 142 250 Z"
                  fill="url(#chasmGrad)"
                />
                {/* Secondary left ridge */}
                <path
                  d="M 0 250 L 0 175 C 30 170 65 166 102 162 C 118 160 126 174 130 205 L 132 250 Z"
                  fill="#1B2825"
                  opacity="0.85"
                />

                {/* Lone silhouette standing on left peak looking across */}
                <g transform="translate(92, 118) scale(0.6)">
                  {/* Head */}
                  <circle cx="10" cy="5" r="4.5" fill="#0B1514" />
                  {/* Torso */}
                  <path
                    d="M 6 12 C 6 10 14 10 14 12 L 15 28 L 5 28 Z"
                    fill="#0B1514"
                  />
                  {/* Legs */}
                  <path d="M 7 28 L 6 42 M 13 28 L 14 42" stroke="#0B1514" strokeWidth="2.5" />
                </g>

                {/* Fog / Mist in the chasm */}
                <ellipse cx="230" cy="235" rx="85" ry="22" fill="#D6E7E2" opacity="0.45" />
                <ellipse cx="270" cy="242" rx="75" ry="18" fill="#EBF4F1" opacity="0.6" />

                {/* Right Plateau: Test & Explore */}
                <path
                  d="M 355 250 C 360 215 358 180 365 155 C 375 145 405 148 440 152 C 475 156 490 160 500 162 L 500 250 Z"
                  fill="url(#lushGrad)"
                />
                <path
                  d="M 375 250 C 380 225 382 198 388 172 C 405 164 445 168 500 174 L 500 250 Z"
                  fill="#00B370"
                  opacity="0.75"
                />

                {/* Dashed Bridge Arc */}
                <path
                  d="M 115 140 C 175 60 325 60 385 150"
                  stroke="url(#bridgeGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  filter="url(#softGlow)"
                />

                {/* Subtle animated green beacon on the bridge */}
                <circle cx="250" cy="82" r="3.5" fill="#00D084" className="animate-pulse" />
              </svg>

              {/* Floating Central Scenara Infinity Logo on the bridge apex */}
              <div className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white shadow-xl border border-emerald-300 flex items-center justify-center p-2 ring-4 ring-emerald-100/90 transition-transform duration-300 hover:scale-110">
                  <ScenaraLogoMark size={28} className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Labels at bottom of the visual - With dedicated spacing and clean padding */}
            <div className="relative z-10 flex justify-between items-center pt-2 px-1">
              <div className="text-left">
                <span className="inline-block px-3.5 py-1.5 rounded-lg bg-[#0B1514] text-white text-xs font-bold tracking-tight shadow-xs">
                  Guess & Launch
                </span>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[130px] leading-tight">
                  Blind real-world trial & error
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3.5 py-1.5 rounded-lg bg-[#00D084] text-white text-xs font-bold tracking-tight shadow-xs">
                  Test & Explore
                </span>
                <p className="text-[11px] text-emerald-800 mt-1 max-w-[140px] leading-tight font-medium">
                  Verified in a simulated world
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Text & Conversion Psychology Copy */}
        <div className="lg:col-span-6 space-y-8">
          {/* THE PROBLEM */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              THE PROBLEM
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D1817] tracking-tight leading-tight mb-3">
              Decisions in the real world are expensive.
            </h3>
            <p className="text-base text-[#556966] leading-relaxed">
              Surveys and isolated opinions can&apos;t capture how people influence
              each other, change their minds, or react over time. Once an idea launches
              into the real world, backtracking costs reputation, money, and time.
            </p>
          </div>

          {/* THE SCENARA WAY */}
          <div className="pt-2 border-t border-zinc-100">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
              THE SCENARA WAY
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D1817] tracking-tight leading-tight mb-3">
              Test your ideas in a living, interactive world.
            </h3>
            <p className="text-base text-[#556966] leading-relaxed">
              Simulate realistic human behavior, social dynamics, and second-order
              effects — before you invest real time, money, or capital. Observe how
              divergent groups form coalitions, air objections, and converge on outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
