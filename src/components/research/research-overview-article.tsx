"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers,
  Sparkles,
  Target,
  Compass,
  TrendingUp,
  ShieldCheck,
  PieChart,
  IndianRupee,
} from "lucide-react";
import {
  courseCurriculum,
  courseLevels,
  getModulesForLevel,
  getTopicHref,
} from "@/lib/course-curriculum";
import { ResearchDocsLayout } from "@/components/research/research-docs-layout";
import { type ResearchArticleTocItem } from "@/components/research/research-article-toc";

const overviewToc: ResearchArticleTocItem[] = [
  { id: "overview", label: "Course Overview" },
  { id: "visual-guide", label: "Visual Learning Guide" },
  { id: "architecture", label: "Curriculum Architecture" },
  { id: "framework-snippet", label: "Asset Allocation Model" },
  { id: "roadmap", label: "8-Level Roadmap" },
  { id: "how-to-study", label: "How to Study" },
  { id: "start-journey", label: "Start Learning" },
];

export function ResearchOverviewArticle() {
  const totalTopics = courseCurriculum.reduce(
    (acc, mod) => acc + mod.topics.length,
    0
  );

  return (
    <ResearchDocsLayout
      tocItems={overviewToc}
      currentLevelId="start"
      breadcrumbs={[{ label: "Overview" }]}
    >
      <article className="min-w-0 pb-16">
        {/* Main H1 Title */}
        <header id="overview" className="scroll-mt-28 pb-6 border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#fe9800] mb-3">
            <Sparkles className="size-4" />
            <span>Solid Wealth Investment Education</span>
            <span>·</span>
            <span>8 Levels · 26 Modules · {totalTopics}+ Lessons</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-[42px] lg:leading-[1.18] break-words">
            Mutual Fund Investment Mastery
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
            A comprehensive, institution-grade curriculum designed to take you from foundational financial concepts to rigorous fund analysis, portfolio construction, tax efficiency, and disciplined execution.
          </p>
        </header>

        {/* Section: Educational Infographic / Visual Guide */}
        <section id="visual-guide" className="scroll-mt-28 my-6">
          <figure className="overflow-hidden rounded-2xl border border-slate-200/90 bg-[#fffdf8] shadow-xs">
            <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[2/1] bg-slate-50">
              <Image
                src="/research/lesson-portfolio-construction.png"
                alt="Educational illustration showing asset allocation connected to risk, goals, cash flows, and periodic portfolio review"
                fill
                className="object-cover transition-transform duration-500 hover:scale-[1.01]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 840px"
                priority
              />
            </div>
            <figcaption className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-t border-slate-200/80 bg-white px-4 py-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#fe9800]" />
                Curriculum Overview: Modern Portfolio Construction
              </span>
              <span className="text-[11px] text-slate-400 capitalize">
                Asset allocation connected to risk, goals, cash flows, and periodic portfolio review
              </span>
            </figcaption>
          </figure>
        </section>

        {/* Section: Curriculum Architecture */}
        <section id="architecture" className="scroll-mt-28 py-8 border-b border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#fe9800]">
            <span>Systematic Progression</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            The Curriculum Architecture
          </h2>
          <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-600">
            Investing success is built on clear mental models, not speculation. The Solid Wealth education program is structured into 8 progressive tiers, each building upon the concepts, analytical metrics, and decision rules established in the preceding levels:
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                <Target className="size-4 text-[#fe9800]" />
                <span>Evidence-Based Frameworks</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Learn to evaluate schemes using standard deviation, Sharpe ratio, Sortino, rolling returns, and category percentiles rather than short-term star ratings.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Behavioral Resilience</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Understand investor psychology, overcome recency and loss-aversion biases, and navigate market drawdowns with automated rebalancing rules.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Visual 3-Bucket Asset Allocation Card (Real Financial Plan - NO CODE) */}
        <section id="framework-snippet" className="scroll-mt-28 py-8 border-b border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#fe9800]">
            <span>Portfolio Blueprint</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Systematic 3-Bucket Asset Allocation Model
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            A practical implementation of the multi-bucket allocation strategy taught across Modules 10–14 for a ₹50,000/month investor:
          </p>

          {/* Visual Financial Card */}
          <div className="my-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
            <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#fe9800]">
                  Model Portfolio Allocation
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Monthly Systematic SIP Allocation: ₹50,000 / month
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-[#fe9800] px-3 py-1 text-xs font-bold">
                Moderate-Aggressive (15+ Years)
              </span>
            </div>

            <div className="p-5 space-y-5">
              {/* Bucket 1: Equity */}
              <div className="rounded-xl border border-slate-200/70 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500" />
                    <span>Bucket 1: Long-Term Equity Growth (70%)</span>
                  </div>
                  <span className="text-blue-700 font-extrabold">₹35,000 / mo</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden mb-3">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "70%" }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                  <div className="bg-white rounded-lg p-2 border border-slate-200/60">
                    <span className="font-semibold text-slate-800 block">NIFTY 50 Index (35%)</span>
                    <span>₹17,500 · Large Cap Anchor</span>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-slate-200/60">
                    <span className="font-semibold text-slate-800 block">Flexi Cap Fund (20%)</span>
                    <span>₹10,000 · Bottom-Up Alpha</span>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-slate-200/60">
                    <span className="font-semibold text-slate-800 block">Mid Cap Growth (15%)</span>
                    <span>₹7,500 · High Growth Engine</span>
                  </div>
                </div>
              </div>

              {/* Bucket 2: Debt */}
              <div className="rounded-xl border border-slate-200/70 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span>Bucket 2: Capital Preservation & Dry Powder (20%)</span>
                  </div>
                  <span className="text-emerald-700 font-extrabold">₹10,000 / mo</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden mb-3">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "20%" }} />
                </div>
                <div className="text-xs text-slate-600 bg-white rounded-lg p-2.5 border border-slate-200/60">
                  <span className="font-semibold text-slate-800">Short Duration & Liquid Gilt Funds: </span>
                  Provides stable returns with near-zero credit risk, buffering your portfolio against equity market downturns.
                </div>
              </div>

              {/* Bucket 3: Hedge */}
              <div className="rounded-xl border border-slate-200/70 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-500" />
                    <span>Bucket 3: Inflation & Currency Hedge (10%)</span>
                  </div>
                  <span className="text-amber-700 font-extrabold">₹5,000 / mo</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden mb-3">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "10%" }} />
                </div>
                <div className="text-xs text-slate-600 bg-white rounded-lg p-2.5 border border-slate-200/60">
                  <span className="font-semibold text-slate-800">Sovereign Gold Bonds / Gold ETFs: </span>
                  Historical non-correlated asset class that preserves purchasing power when equities experience prolonged sideways cycles.
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-[#fffdf8] p-4 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
              <ShieldCheck className="size-4 shrink-0 text-[#fe9800] mt-0.5" />
              <span>
                <strong>Annual Review Rule:</strong> Rebalance only when an asset bucket drifts by more than ±5% from its target allocation to lock in gains and buy undervalued assets.
              </span>
            </div>
          </div>
        </section>

        {/* Section: 8-Level Roadmap */}
        <section id="roadmap" className="scroll-mt-28 py-8 border-b border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#fe9800]">
            <span>Curriculum Tiers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            8 Levels of Mastery
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Browse through the curriculum levels or dive directly into any module:
          </p>

          <div className="mt-6 space-y-3">
            {courseLevels.map((lvl) => {
              const modules = getModulesForLevel(lvl);
              const firstTopic = modules[0]?.topics[0];
              const firstTopicHref = firstTopic && modules[0] ? getTopicHref(modules[0], firstTopic) : `/research/${lvl.id}`;

              return (
                <div
                  key={lvl.id}
                  className="rounded-xl border border-slate-200/90 bg-white p-4 transition-all hover:border-[#fe9800]/40 hover:shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-orange-100 px-2 py-0.5 font-mono text-[11px] font-bold text-[#fe9800]">
                          Level {lvl.levelNumber}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {lvl.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-600">
                        {lvl.focus} · Modules {lvl.moduleRange[0]}–{lvl.moduleRange[1]} ({modules.length} modules)
                      </p>
                    </div>

                    <Link
                      href={firstTopicHref}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#fe9800] hover:text-amber-700 shrink-0"
                    >
                      <span>Explore Lessons</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: How to Study */}
        <section id="how-to-study" className="scroll-mt-28 py-8 border-b border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#fe9800]">
            <span>Methodology</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            How to Get the Most from This Course
          </h2>

          <div className="mt-5 space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#fe9800]">
                1
              </span>
              <div>
                <strong className="text-xs sm:text-sm font-semibold text-slate-900">
                  Engage with Decision Challenges
                </strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Each topic contains real-world dilemmas where you pick your investment strategy and receive instant institutional feedback.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#fe9800]">
                2
              </span>
              <div>
                <strong className="text-xs sm:text-sm font-semibold text-slate-900">
                  Analyze Real Rupee Case Studies
                </strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Review practical financial calculations covering inflation impact, SIP compounding, and downside protection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#fe9800]">
                3
              </span>
              <div>
                <strong className="text-xs sm:text-sm font-semibold text-slate-900">
                  Complete the Capstone Project (Level 8)
                </strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Synthesize your learning by constructing a full end-to-end investment plan with asset allocation, fund picks, and rebalancing rules.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Start Your Journey CTA */}
        <section id="start-journey" className="scroll-mt-28 pt-8">
          <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#fe9800]">
                Ready to begin?
              </span>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Start with Level 1: Introduction to Investing
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl">
                Master the core foundational concepts of wealth creation, the true impact of inflation, compounding, and establishing an emergency fund.
              </p>
            </div>

            <Link
              href="/research/foundation/module-1/what-is-investing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fe9800] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-amber-600 transition-all shrink-0 hover:-translate-y-0.5"
            >
              <span>Begin Lesson 1</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </article>
    </ResearchDocsLayout>
  );
}
