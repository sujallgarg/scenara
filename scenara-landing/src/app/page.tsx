"use client";

import React, { useState } from "react";
import Image from "next/image";
import HeroAgentNetwork from "@/components/HeroAgentNetwork";
import SimulationPreview from "@/components/SimulationPreview";
import ProblemSolutionVisual from "@/components/ProblemSolutionVisual";
import HowItWorksAndDifferentiators from "@/components/HowItWorksAndDifferentiators";
import UseCasesSection from "@/components/UseCasesSection";
import WaitlistForm from "@/components/WaitlistForm";
import {
  ArrowRight,
  Play,
  Zap,
  Network,
  BarChart3,
  Menu,
  X,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#FAFCFB] text-[#0D1817] overflow-x-hidden selection:bg-[#00D084] selection:text-[#041A13]">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-radial from-emerald-100/35 via-emerald-50/10 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 bg-white/85 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <Image
              src="/scenara-logo.png"
              alt="Scenara"
              width={140}
              height={44}
              priority
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a
              href="#about"
              className="hover:text-zinc-900 transition-colors"
            >
              What is Scenara
            </a>
            <a
              href="#how-it-works"
              className="hover:text-zinc-900 transition-colors"
            >
              How it works
            </a>
            <a
              href="#preview"
              className="hover:text-zinc-900 transition-colors"
            >
              Simulation Preview
            </a>
            <a
              href="#use-cases"
              className="hover:text-zinc-900 transition-colors"
            >
              Use Cases
            </a>
            <a
              href="#learn"
              className="hover:text-zinc-900 transition-colors"
            >
              Learn
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#waitlist"
              className="px-5 py-2.5 rounded-xl bg-[#0B1514] hover:bg-[#152724] text-white text-xs font-semibold tracking-tight transition-all duration-200 shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Early Access</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-700 hover:text-zinc-900"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-200 bg-white/95 px-6 py-5 space-y-4">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-700 hover:text-emerald-700"
            >
              What is Scenara
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-700 hover:text-emerald-700"
            >
              How it works
            </a>
            <a
              href="#preview"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-700 hover:text-emerald-700"
            >
              Simulation Preview
            </a>
            <a
              href="#use-cases"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-700 hover:text-emerald-700"
            >
              Use Cases
            </a>
            <a
              href="#learn"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-700 hover:text-emerald-700"
            >
              Learn
            </a>
            <a
              href="#waitlist"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 rounded-xl bg-[#0B1514] text-white text-center text-xs font-bold"
            >
              Get Early Access
            </a>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          {/* Hero Left Column: Copy & CTAs */}
          <div className="lg:col-span-6">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1F5F4] border border-[#E2EBE8] text-xs font-semibold text-[#13302B] mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#00D084] animate-pulse" />
              <span>Multi-Agent World Simulation Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[50px] xl:text-[54px] font-extrabold tracking-tight text-[#0D1817] leading-[1.12] mb-6">
              What if you could see how the world reacts{" "}
              <span className="text-[#05D38A]">before you make</span> your move?
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#556966] leading-relaxed max-w-lg font-normal mb-8">
              Scenara creates realistic, AI-powered societies to test ideas,
              strategies, and policies in a simulated world — so you can explore
              outcomes, spot risks, and make smarter, more confident decisions.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <a
                href="#waitlist"
                className="px-7 py-3.5 rounded-xl bg-[#0B1514] hover:bg-[#152724] text-white text-sm font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-2 shadow-sm group"
              >
                <span>Get Early Access</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#preview"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#F6FAF8] text-[#1A2D2A] border border-[#D6E3DF] text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                <span>Explore the Simulation</span>
              </a>
            </div>

            {/* 3 Value Pillars */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-2 text-xs sm:text-sm text-zinc-700 font-medium">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span>Test ideas early</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-emerald-500" />
                <span>See real interactions</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <span>Explore multiple outcomes</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Animated Persona Network */}
          <div className="lg:col-span-6 flex justify-center">
            <HeroAgentNetwork />
          </div>
        </div>
      </section>

      {/* SECTION: INTERACTIVE SIMULATION PREVIEW */}
      <SimulationPreview />

      {/* SECTION: PROBLEM & SOLUTION */}
      <ProblemSolutionVisual />

      {/* SECTION: HOW IT WORKS & WHAT MAKES SCENARA DIFFERENT */}
      <HowItWorksAndDifferentiators />

      {/* SECTION: USE CASES */}
      <UseCasesSection />

      {/* SECTION: LEARN / METHODOLOGY */}
      <section id="learn" className="py-20 md:py-28 px-6 max-w-7xl mx-auto border-t border-zinc-200/60">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>THE SCIENCE OF AGENT SOCIETIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1817] tracking-tight leading-tight mb-4">
              Why static surveys fail where multi-agent worlds succeed.
            </h2>
            <p className="text-base text-[#556966] leading-relaxed mb-6">
              When humans answer a survey question, they speak in isolation. In reality, human belief formation is highly social: one objection sparks doubt in another, coalitions form, and initial gut reactions morph into unexpected consensus.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm text-zinc-700">
                  <strong className="text-zinc-900 font-semibold">Dynamic Information Cascades:</strong> Agents share arguments, critique peers, and adapt stances across discrete rounds.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm text-zinc-700">
                  <strong className="text-zinc-900 font-semibold">Persona Anchoring:</strong> Each agent maintains memory, professional incentives, and risk thresholds throughout the debate.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm text-zinc-700">
                  <strong className="text-zinc-900 font-semibold">Auditable Rationales:</strong> Every opinion shift produces an explainable reasoning trail, showing exactly why consensus moved.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-[#F4F9F7] rounded-3xl p-8 border border-zinc-200/90 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">
              Key Simulation Capabilities
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
                <div className="text-xs font-bold text-emerald-700 mb-1">
                  Synthetic Audience Generation
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Synthesize demographic distributions, organizational roles, and behavioral profiles matched to target populations.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
                <div className="text-xs font-bold text-emerald-700 mb-1">
                  Second-Order Effect Discovery
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Reveal hidden friction points, regulatory pushback, and unintended downstream consequences before launch.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
                <div className="text-xs font-bold text-emerald-700 mb-1">
                  Sensitivity & Counterfactual Testing
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Tweak pricing variables, rollout timelines, or terms to see what unlocks agreement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: WAITLIST CTA */}
      <WaitlistForm />

      {/* FOOTER */}
      <footer className="border-t border-zinc-200/70 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Image
              src="/scenara-logo.png"
              alt="Scenara"
              width={120}
              height={38}
              className="h-7 w-auto object-contain"
            />
            <span className="hidden sm:inline text-zinc-300">|</span>
            <span className="text-xs text-zinc-500">
              Test the future before it happens.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
            <a href="#about" className="hover:text-zinc-900 transition-colors">
              What is Scenara
            </a>
            <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">
              How it works
            </a>
            <a href="#preview" className="hover:text-zinc-900 transition-colors">
              Simulation Preview
            </a>
            <a href="#use-cases" className="hover:text-zinc-900 transition-colors">
              Use Cases
            </a>
            <a href="#waitlist" className="hover:text-zinc-900 transition-colors">
              Waitlist
            </a>
          </div>

          <div className="text-xs text-zinc-400">
            © 2026 Scenara. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
