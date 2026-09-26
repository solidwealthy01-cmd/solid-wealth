"use client";

import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lightbulb,
  Compass,
  Shield,
  Rocket,
  Scale,
  Anchor,
  Zap,
  Award,
  ArrowRight,
  UserCheck,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TopicStoryData } from "@/lib/course-stories";

interface InteractiveLessonStoryProps {
  storyData: TopicStoryData;
  topicName: string;
}

export function InteractiveLessonStory({
  storyData,
  topicName,
}: InteractiveLessonStoryProps) {
  const { story, analogy, funFact, interactiveDilemma } = storyData;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const getAnalogyIcon = (type: string) => {
    switch (type) {
      case "rocket":
        return <Rocket className="size-6 text-amber-500" />;
      case "shield":
        return <Shield className="size-6 text-blue-500" />;
      case "scale":
        return <Scale className="size-6 text-emerald-500" />;
      case "anchor":
        return <Anchor className="size-6 text-indigo-500" />;
      default:
        return <Compass className="size-6 text-wealth-accent" />;
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Real-World Story Card */}
      <section
        id="story-breakdown"
        className="scroll-mt-28 overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EE] to-[#FFF4E0] p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-200/60 pb-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-800">
            <Sparkles className="size-3.5 text-amber-600" />
            <span>Story Time: Real-Life Case</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900/80">
            <UserCheck className="size-4 text-amber-700" />
            <span>Featuring: {story.character}</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-display text-2xl font-extrabold text-[#1a2332] sm:text-3xl">
            {story.title}
          </h3>
          <p className="mt-3 text-base leading-7 text-gray-700">
            {story.context}
          </p>
        </div>

        {/* Narrative Flow Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Dilemma */}
          <div className="rounded-2xl border border-rose-200/70 bg-white/90 p-5 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-rose-700">
              <AlertCircle className="size-4 text-rose-500" />
              <span>The Dilemma Faced</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-800 font-medium">
              {story.dilemma}
            </p>
          </div>

          {/* Choice Made */}
          <div className="rounded-2xl border border-blue-200/70 bg-white/90 p-5 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Zap className="size-4 text-blue-500" />
              <span>The Strategy Executed</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-800 font-medium">
              {story.choiceMade}
            </p>
          </div>
        </div>

        {/* Outcome Box */}
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <TrendingUp className="size-4 text-emerald-600" />
            <span>The Financial Outcome</span>
          </div>
          <p className="mt-2 text-sm sm:text-base leading-7 text-emerald-950 font-semibold">
            {story.outcome}
          </p>
        </div>

        {/* Moral of the Story */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-amber-500/10 border border-amber-300/60 p-4">
          <Award className="size-5 shrink-0 text-amber-700 mt-0.5" />
          <p className="text-sm font-bold text-amber-950 leading-6">
            <span className="text-amber-800 uppercase tracking-wide text-xs block mb-0.5">
              The Golden Rule:
            </span>
            {story.moral}
          </p>
        </div>
      </section>

      {/* 2. The Simple Analogy (Metaphor Card) */}
      <section
        id="the-analogy"
        className="scroll-mt-28 rounded-3xl border border-wealth-border/80 bg-white p-6 sm:p-8 shadow-xs"
      >
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200/60">
            {getAnalogyIcon(analogy.iconType)}
          </div>
          <div className="space-y-1">
            <div className="text-xs font-extrabold uppercase tracking-widest text-wealth-accent">
              The Everyday Analogy
            </div>
            <h3 className="font-display text-xl font-bold text-[#1a2332] sm:text-2xl">
              {analogy.headline}
            </h3>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-[#FFFDF8] border border-wealth-border/60 p-5">
          <div className="text-xs font-bold uppercase text-gray-500">
            Mental Picture:
          </div>
          <div className="mt-1 text-base font-bold text-wealth-primary">
            &ldquo;{analogy.metaphor}&rdquo;
          </div>
          <p className="mt-3 text-sm sm:text-base leading-7 text-gray-700">
            {analogy.explanation}
          </p>
        </div>
      </section>

      {/* 3. Interactive Challenge: "What Would You Do?" */}
      <section
        id="interactive-dilemma"
        className="scroll-mt-28 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-sky-50/30 p-6 sm:p-8 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <HelpCircle className="size-5" />
          </span>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
              Interactive Decision Challenge
            </span>
            <h3 className="text-xl font-extrabold text-[#1a2332] sm:text-2xl">
              What Would You Do?
            </h3>
          </div>
        </div>

        <p className="mt-5 text-sm sm:text-base font-semibold text-gray-800">
          {interactiveDilemma.scenario}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {interactiveDilemma.question}
        </p>

        {/* Options */}
        <div className="mt-6 space-y-3">
          {interactiveDilemma.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const showOutcome = hasSubmitted;

            let cardStyle = "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20";
            if (showOutcome) {
              if (opt.isOptimal) {
                cardStyle = "border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-400";
              } else if (isSelected && !opt.isOptimal) {
                cardStyle = "border-rose-400 bg-rose-50/80 ring-2 ring-rose-300";
              } else {
                cardStyle = "border-gray-200 bg-white/60 opacity-60";
              }
            } else if (isSelected) {
              cardStyle = "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-400";
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedOption(idx);
                  setHasSubmitted(true);
                }}
                className={cn(
                  "w-full text-left rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer",
                  cardStyle
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border transition-colors mt-0.5",
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-gray-300 text-gray-600 bg-gray-50"
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-bold text-gray-900 leading-snug">
                      {opt.text}
                    </p>
                    {showOutcome && (isSelected || opt.isOptimal) && (
                      <div className="pt-2 border-t border-gray-200/70 flex items-start gap-2">
                        {opt.isOptimal ? (
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={cn(
                            "text-xs font-semibold leading-relaxed",
                            opt.isOptimal ? "text-emerald-900" : "text-rose-900"
                          )}
                        >
                          {opt.outcome}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {hasSubmitted && (
          <div className="mt-5 rounded-2xl bg-indigo-900/5 border border-indigo-100 p-4 text-xs sm:text-sm text-indigo-950 font-medium">
            <span className="font-bold text-indigo-700">💡 Lesson Insight: </span>
            {interactiveDilemma.explanation}
          </div>
        )}
      </section>

      {/* 4. "Did You Know?" Fact Box */}
      <section
        id="fun-facts"
        className="scroll-mt-28 rounded-3xl border border-wealth-border/80 bg-[#FFFDF8] p-6 sm:p-8 shadow-xs"
      >
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xs">
            <Flame className="size-5" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
              {funFact.tag} • Did You Know?
            </span>
            <p className="mt-2 text-base sm:text-lg font-bold text-[#1a2332] leading-relaxed">
              {funFact.fact}
            </p>
            {funFact.sourceOrStat && (
              <span className="mt-3 inline-block text-xs font-semibold text-gray-500">
                Source: {funFact.sourceOrStat}
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
