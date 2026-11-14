"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ScenaraLogoMark from "./ScenaraLogoMark";

interface AgentBubble {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  ringColor: string;
  pulseColor: string;
}

const AGENTS: AgentBubble[] = [
  // LEFT COLUMN (Top to Bottom)
  {
    id: 1,
    name: "Aarav Patel",
    role: "Product Lead & Early Adopter",
    quote: "Love this! I'd use it. 🚀",
    avatar: "/avatars/agent-1.jpg",
    ringColor: "ring-emerald-400/80 border-emerald-100",
    pulseColor: "bg-emerald-500",
  },
  {
    id: 3,
    name: "Marcus Vance",
    role: "Tech Lead & Developer",
    quote: "Good idea, but the timing feels off.",
    avatar: "/avatars/agent-3.jpg",
    ringColor: "ring-amber-400/80 border-amber-100",
    pulseColor: "bg-amber-500",
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "SaaS Founder",
    quote: "I'd pay for this. Definitely a need.",
    avatar: "/avatars/agent-5.jpg",
    ringColor: "ring-emerald-400/80 border-emerald-100",
    pulseColor: "bg-emerald-500",
  },

  // RIGHT COLUMN (Top to Bottom)
  {
    id: 2,
    name: "Elena Rostova",
    role: "Senior Enterprise Buyer",
    quote: "I'm not convinced. What's the real value?",
    avatar: "/avatars/agent-2.jpg",
    ringColor: "ring-rose-300/90 border-rose-100",
    pulseColor: "bg-rose-500",
  },
  {
    id: 4,
    name: "Devin Zhao",
    role: "Growth Strategist",
    quote: "This could work if you fix a few things.",
    avatar: "/avatars/agent-4.jpg",
    ringColor: "ring-sky-400/80 border-sky-100",
    pulseColor: "bg-sky-500",
  },
  {
    id: 6,
    name: "Karan Mehta",
    role: "Risk & Policy Analyst",
    quote: "Interesting, but I'd explore an alternative.",
    avatar: "/avatars/agent-6.jpg",
    ringColor: "ring-amber-400/80 border-amber-100",
    pulseColor: "bg-amber-500",
  },
];

export default function HeroAgentNetwork() {
  const [activeAgent, setActiveAgent] = useState<number | null>(null);
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % AGENTS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[620px] aspect-[1/0.95] sm:aspect-square select-none flex items-center justify-center p-2 sm:p-4 overflow-visible">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-radial from-emerald-100/50 via-emerald-50/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Outer & Inner Concentric Orbit Rings */}
      <div className="absolute w-[86%] h-[86%] rounded-full border border-dashed border-emerald-200/60 pointer-events-none" />
      <div className="absolute w-[58%] h-[58%] rounded-full border border-emerald-100/80 pointer-events-none" />

      {/* SVG Connecting Dashed Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
        {/* Lines from Center (50%, 50%) to each agent avatar */}
        {/* Left Column Avatars */}
        <line
          x1="50%"
          y1="50%"
          x2="10%"
          y2="14%"
          stroke="#A7F3D0"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line
          x1="50%"
          y1="50%"
          x2="7%"
          y2="50%"
          stroke="#A7F3D0"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line
          x1="50%"
          y1="50%"
          x2="10%"
          y2="86%"
          stroke="#A7F3D0"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Right Column Avatars */}
        <line
          x1="50%"
          y1="50%"
          x2="57%"
          y2="14%"
          stroke="#A7F3D0"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line
          x1="50%"
          y1="50%"
          x2="60%"
          y2="50%"
          stroke="#A7F3D0"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line
          x1="50%"
          y1="50%"
          x2="57%"
          y2="86%"
          stroke="#A7F3D0"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Central Scenara Core Node with Breathing Room */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none">
        {/* Pulsing halo */}
        <div className="absolute w-28 h-28 rounded-full bg-emerald-400/20 animate-ping opacity-30" />
        <div className="absolute w-24 h-24 rounded-full bg-emerald-300/30 blur-md" />

        {/* Center circular badge */}
        <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-white border border-emerald-200/90 shadow-xl flex items-center justify-center p-2.5">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-50 to-white flex items-center justify-center p-2 border border-emerald-100">
            <ScenaraLogoMark size={40} className="w-10 h-10 drop-shadow-xs" />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* LEFT COLUMN: 3 AGENTS (Avatar on Left -> Speech Bubble to Right) */}
      {/* ============================================================== */}

      {/* 1. TOP LEFT: Aarav */}
      <div
        className="absolute top-[6%] left-[1%] sm:left-[3%] z-30 flex items-center gap-2 group cursor-pointer transition-all duration-200"
        onMouseEnter={() => setActiveAgent(1)}
        onMouseLeave={() => setActiveAgent(null)}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 bg-white shadow-md ring-2 transition-transform group-hover:scale-110 ${AGENTS[0].ringColor}`}
          >
            <Image
              src={AGENTS[0].avatar}
              alt={AGENTS[0].name}
              width={52}
              height={52}
              className="w-full h-full object-cover"
            />
          </div>
          {pulseIndex === 0 && (
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse ${AGENTS[0].pulseColor}`}
            />
          )}
        </div>

        {/* Speech Bubble */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-md border border-zinc-200/80 max-w-[130px] sm:max-w-[155px] text-[11px] sm:text-xs transition-transform group-hover:scale-105 group-hover:border-emerald-300">
          <p className="font-semibold text-zinc-900 leading-snug">
            {AGENTS[0].quote}
          </p>
          {activeAgent === 1 && (
            <p className="text-[10px] text-emerald-700 mt-0.5 font-medium truncate">
              {AGENTS[0].role}
            </p>
          )}
        </div>
      </div>

      {/* 2. MIDDLE LEFT: Marcus */}
      <div
        className="absolute top-[43%] left-0 sm:left-[1%] z-30 flex items-center gap-2 group cursor-pointer transition-all duration-200"
        onMouseEnter={() => setActiveAgent(3)}
        onMouseLeave={() => setActiveAgent(null)}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 bg-white shadow-md ring-2 transition-transform group-hover:scale-110 ${AGENTS[1].ringColor}`}
          >
            <Image
              src={AGENTS[1].avatar}
              alt={AGENTS[1].name}
              width={52}
              height={52}
              className="w-full h-full object-cover"
            />
          </div>
          {pulseIndex === 1 && (
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse ${AGENTS[1].pulseColor}`}
            />
          )}
        </div>

        {/* Speech Bubble */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-md border border-zinc-200/80 max-w-[130px] sm:max-w-[155px] text-[11px] sm:text-xs transition-transform group-hover:scale-105 group-hover:border-amber-300">
          <p className="font-semibold text-zinc-900 leading-snug">
            {AGENTS[1].quote}
          </p>
          {activeAgent === 3 && (
            <p className="text-[10px] text-amber-700 mt-0.5 font-medium truncate">
              {AGENTS[1].role}
            </p>
          )}
        </div>
      </div>

      {/* 3. BOTTOM LEFT: Priya */}
      <div
        className="absolute bottom-[6%] left-[1%] sm:left-[3%] z-30 flex items-center gap-2 group cursor-pointer transition-all duration-200"
        onMouseEnter={() => setActiveAgent(5)}
        onMouseLeave={() => setActiveAgent(null)}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 bg-white shadow-md ring-2 transition-transform group-hover:scale-110 ${AGENTS[2].ringColor}`}
          >
            <Image
              src={AGENTS[2].avatar}
              alt={AGENTS[2].name}
              width={52}
              height={52}
              className="w-full h-full object-cover"
            />
          </div>
          {pulseIndex === 2 && (
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse ${AGENTS[2].pulseColor}`}
            />
          )}
        </div>

        {/* Speech Bubble */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-md border border-zinc-200/80 max-w-[130px] sm:max-w-[155px] text-[11px] sm:text-xs transition-transform group-hover:scale-105 group-hover:border-emerald-300">
          <p className="font-semibold text-zinc-900 leading-snug">
            {AGENTS[2].quote}
          </p>
          {activeAgent === 5 && (
            <p className="text-[10px] text-emerald-700 mt-0.5 font-medium truncate">
              {AGENTS[2].role}
            </p>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: 3 AGENTS (Avatar on Left -> Speech Bubble to Right) */}
      {/* ============================================================== */}

      {/* 4. TOP RIGHT: Elena */}
      <div
        className="absolute top-[6%] left-[54%] sm:left-[53%] z-30 flex items-center gap-2 group cursor-pointer transition-all duration-200"
        onMouseEnter={() => setActiveAgent(2)}
        onMouseLeave={() => setActiveAgent(null)}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 bg-white shadow-md ring-2 transition-transform group-hover:scale-110 ${AGENTS[3].ringColor}`}
          >
            <Image
              src={AGENTS[3].avatar}
              alt={AGENTS[3].name}
              width={52}
              height={52}
              className="w-full h-full object-cover"
            />
          </div>
          {pulseIndex === 3 && (
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse ${AGENTS[3].pulseColor}`}
            />
          )}
        </div>

        {/* Speech Bubble */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-md border border-zinc-200/80 max-w-[135px] sm:max-w-[165px] text-[11px] sm:text-xs transition-transform group-hover:scale-105 group-hover:border-rose-300">
          <p className="font-semibold text-zinc-900 leading-snug">
            {AGENTS[3].quote}
          </p>
          {activeAgent === 2 && (
            <p className="text-[10px] text-rose-700 mt-0.5 font-medium truncate">
              {AGENTS[3].role}
            </p>
          )}
        </div>
      </div>

      {/* 5. MIDDLE RIGHT: Devin */}
      <div
        className="absolute top-[43%] left-[56%] sm:left-[55%] z-30 flex items-center gap-2 group cursor-pointer transition-all duration-200"
        onMouseEnter={() => setActiveAgent(4)}
        onMouseLeave={() => setActiveAgent(null)}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 bg-white shadow-md ring-2 transition-transform group-hover:scale-110 ${AGENTS[4].ringColor}`}
          >
            <Image
              src={AGENTS[4].avatar}
              alt={AGENTS[4].name}
              width={52}
              height={52}
              className="w-full h-full object-cover"
            />
          </div>
          {pulseIndex === 4 && (
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse ${AGENTS[4].pulseColor}`}
            />
          )}
        </div>

        {/* Speech Bubble */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-md border border-zinc-200/80 max-w-[135px] sm:max-w-[165px] text-[11px] sm:text-xs transition-transform group-hover:scale-105 group-hover:border-sky-300">
          <p className="font-semibold text-zinc-900 leading-snug">
            {AGENTS[4].quote}
          </p>
          {activeAgent === 4 && (
            <p className="text-[10px] text-sky-700 mt-0.5 font-medium truncate">
              {AGENTS[4].role}
            </p>
          )}
        </div>
      </div>

      {/* 6. BOTTOM RIGHT: Karan */}
      <div
        className="absolute bottom-[6%] left-[54%] sm:left-[53%] z-30 flex items-center gap-2 group cursor-pointer transition-all duration-200"
        onMouseEnter={() => setActiveAgent(6)}
        onMouseLeave={() => setActiveAgent(null)}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 bg-white shadow-md ring-2 transition-transform group-hover:scale-110 ${AGENTS[5].ringColor}`}
          >
            <Image
              src={AGENTS[5].avatar}
              alt={AGENTS[5].name}
              width={52}
              height={52}
              className="w-full h-full object-cover"
            />
          </div>
          {pulseIndex === 5 && (
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse ${AGENTS[5].pulseColor}`}
            />
          )}
        </div>

        {/* Speech Bubble */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-md border border-zinc-200/80 max-w-[135px] sm:max-w-[165px] text-[11px] sm:text-xs transition-transform group-hover:scale-105 group-hover:border-amber-300">
          <p className="font-semibold text-zinc-900 leading-snug">
            {AGENTS[5].quote}
          </p>
          {activeAgent === 6 && (
            <p className="text-[10px] text-amber-700 mt-0.5 font-medium truncate">
              {AGENTS[5].role}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
