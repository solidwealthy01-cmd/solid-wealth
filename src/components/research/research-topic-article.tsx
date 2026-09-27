"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import type {
  CourseLevel,
  CourseModule,
  CourseTopicEntry,
} from "@/lib/course-curriculum";
import {
  createTopicSlug,
  getTopicHref,
} from "@/lib/course-curriculum";
import { getCourseTopicLesson } from "@/lib/course-topic-explanations";
import { type ResearchArticleTocItem } from "@/components/research/research-article-toc";
import { getStoryForTopic } from "@/lib/course-stories";
import { InteractiveLessonStory } from "@/components/research/interactive-lesson-story";
import { ResearchDocsLayout } from "@/components/research/research-docs-layout";
import { WorkedFinancialExample } from "@/components/research/worked-financial-example";

type ResearchTopicArticleProps = {
  level: CourseLevel;
  courseModule: CourseModule;
  topic: string;
  topicIndex: number;
  previousTopic?: CourseTopicEntry;
  nextTopic?: CourseTopicEntry;
};

const tableOfContents: ResearchArticleTocItem[] = [
  { id: "overview", label: "Topic Overview" },
  { id: "visual-guide", label: "Visual Learning Guide" },
  { id: "the-concept", label: "Core Concept & Principles" },
  { id: "worked-example", label: "Practical Financial Example" },
  { id: "story-breakdown", label: "Real-Life Case Story" },
  { id: "the-analogy", label: "Everyday Analogy" },
  { id: "interactive-dilemma", label: "Decision Challenge" },
  { id: "evaluation-framework", label: "Evaluation Framework" },
  { id: "common-mistakes", label: "Common Pitfalls" },
  { id: "key-takeaways", label: "Key Takeaways" },
];

const lessonVisuals = {
  foundations: {
    src: "/research/lesson-foundations.png",
    description: "gradual investing growth, financial protection, and progress toward a goal",
  },
  fundMechanics: {
    src: "/research/lesson-fund-mechanics.png",
    description: "pooled investments, diversification, fund documents, and regulated oversight",
  },
  analysis: {
    src: "/research/lesson-analysis.png",
    description: "fund comparison, risk-return evaluation, portfolio evidence, and diversification",
  },
  planning: {
    src: "/research/lesson-planning.png",
    description: "financial goals, asset allocation, rebalancing, and disciplined long-term planning",
  },
  financialMarkets: {
    src: "/research/lesson-financial-markets.png",
    description: "capital-market participants, primary and secondary activity, and distinct asset classes",
  },
  fundCategories: {
    src: "/research/lesson-fund-categories.png",
    description: "pooled money branching into equity, debt, hybrid, index, and international fund categories",
  },
  investmentMethods: {
    src: "/research/lesson-investment-methods.png",
    description: "recurring, lump-sum, and staged contributions entering a diversified portfolio",
  },
  portfolioConstruction: {
    src: "/research/lesson-portfolio-construction.png",
    description: "asset allocation connected to risk, goals, cash flows, and periodic portfolio review",
  },
  advancedStrategies: {
    src: "/research/lesson-advanced-strategies.png",
    description: "core-satellite design, factor filters, global diversification, and advanced allocation tools",
  },
  taxation: {
    src: "/research/lesson-taxation.png",
    description: "holding periods, taxable events, investor classification, records, and compliant filing",
  },
  behavioralFinance: {
    src: "/research/lesson-behavioral-finance.png",
    description: "fear and greed cycles, herd behaviour, recency, overconfidence, and disciplined decisions",
  },
  platformsCompliance: {
    src: "/research/lesson-platforms-compliance.png",
    description: "secure investment platforms, identity verification, holding choices, and compliance checks",
  },
  researchTools: {
    src: "/research/lesson-research-tools.png",
    description: "factsheets, calculators, portfolio tracking, goal planning, and evidence-based review tools",
  },
  equityFunds: {
    src: "/research/lesson-equity-funds.png",
    description: "equity portfolios grouped by company size, concentration, sector, and investment style",
  },
  debtFunds: {
    src: "/research/lesson-debt-funds.png",
    description: "debt instruments organized by maturity, credit quality, liquidity, and interest-rate sensitivity",
  },
  hybridFunds: {
    src: "/research/lesson-hybrid-funds.png",
    description: "hybrid portfolios combining equity, debt, and other assets in different proportions",
  },
  passiveGlobalFunds: {
    src: "/research/lesson-passive-global-funds.png",
    description: "benchmark tracking, exchange-traded units, and diversified international exposure",
  },
} as const;

const specificTopicVisuals: Record<string, { src: string; description: string }> = {
  "What is investing?": {
    src: "/research/topic-what-is-investing.png",
    description: "savings being put to work across productive and diversified assets",
  },
  "Why investing is important": {
    src: "/research/topic-why-investing-is-important.png",
    description: "a bridge from present resources to education, a home, and retirement goals",
  },
  "Inflation and purchasing power": {
    src: "/research/topic-inflation-and-purchasing-power.png",
    description: "the same reserve purchasing fewer everyday goods as prices rise over time",
  },
  "Saving vs Investing": {
    src: "/research/topic-saving-vs-investing.png",
    description: "a protected savings reserve alongside a diversified path for long-term growth",
  },
  "Risk vs Reward": {
    src: "/research/topic-risk-vs-reward.png",
    description: "risk and return trade-offs across different financial instruments",
  },
  "Time value of money": {
    src: "/research/topic-time-value-of-money.png",
    description: "how money today has greater value than the same nominal amount in the future",
  },
  "Compounding (The 8th Wonder)": {
    src: "/research/topic-compounding.png",
    description: "exponential wealth accumulation through reinvestment of returns over time",
  },
  "Financial goals and planning": {
    src: "/research/topic-financial-goals-and-planning.png",
    description: "mapping financial objectives to defined timelines, corpus targets, and asset classes",
  },
  "Emergency fund": {
    src: "/research/topic-emergency-fund.png",
    description: "maintaining a liquid reserve to safeguard long-term wealth against unforeseen expenses",
  },
  "Wealth creation mindset": {
    src: "/research/topic-wealth-creation-mindset.png",
    description: "long-term discipline, patience, and consistency over speculative short-term trading",
  },
};

function getLessonVisual(courseModule: CourseModule, topic: string) {
  // Check exact topic illustration first
  if (specificTopicVisuals[topic]) {
    return specificTopicVisuals[topic];
  }

  // Check module category
  if (courseModule.moduleNumber <= 4) return lessonVisuals.foundations;
  if (courseModule.moduleNumber === 5) return lessonVisuals.fundCategories;
  if (courseModule.moduleNumber <= 9) return lessonVisuals.fundMechanics;
  if (courseModule.moduleNumber <= 13) return lessonVisuals.investmentMethods;
  if (courseModule.moduleNumber <= 17) return lessonVisuals.planning;
  if (courseModule.moduleNumber <= 19) return lessonVisuals.behavioralFinance;
  if (courseModule.moduleNumber <= 23) return lessonVisuals.analysis;
  return lessonVisuals.researchTools;
}

function estimateReadingTime(parts: string[]) {
  const wordCount = parts.join(" ").trim().split(/\s+/).length;
  return Math.max(5, Math.ceil(wordCount / 180));
}

export function ResearchTopicArticle({
  level,
  courseModule,
  topic,
  topicIndex,
  previousTopic,
  nextTopic,
}: ResearchTopicArticleProps) {
  const lesson = getCourseTopicLesson(courseModule, topic);
  const storyData = getStoryForTopic(
    topic,
    courseModule.title,
    courseModule.moduleNumber
  );

  const readingTime = estimateReadingTime([
    lesson.explanation,
    lesson.whyItMatters,
    lesson.practicalApplication,
    lesson.workedExample,
    ...lesson.detailedExplanation,
    ...lesson.keyTakeaways,
  ]);

  const currentTopicSlug = createTopicSlug(topic);
  const visual = getLessonVisual(courseModule, topic);

  const breadcrumbs = [
    { label: `Level ${level.levelNumber}`, href: `/research/${level.id}` },
    { label: `Module ${courseModule.moduleNumber}`, href: `/research/${level.id}#${courseModule.id}` },
    { label: topic },
  ];

  return (
    <ResearchDocsLayout
      tocItems={tableOfContents}
      currentLevelId={level.id}
      currentModuleId={courseModule.id}
      currentTopicSlug={currentTopicSlug}
      breadcrumbs={breadcrumbs}
    >
      <article className="min-w-0 pb-16">
        {/* Topic Title */}
        <header id="overview" className="scroll-mt-28 pb-6 border-b border-slate-200/80">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-500 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[#fe9800]">
              <GraduationCap className="size-4" />
              Level {level.levelNumber}: {level.shortTitle}
            </span>
            <span>·</span>
            <span>Module {courseModule.moduleNumber}: {courseModule.title}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" />
              {readingTime} min read
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-[42px] lg:leading-[1.18] break-words">
            {topic}
          </h1>

          {/* Lead Paragraph */}
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
            {lesson.explanation}
          </p>
        </header>

        {/* Section: Educational Infographic / Visual Guide */}
        <section id="visual-guide" className="scroll-mt-28 my-6">
          <figure className="overflow-hidden rounded-2xl border border-slate-200/90 bg-[#fffdf8] shadow-xs">
            <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[2/1] bg-slate-50">
              <Image
                src={visual.src}
                alt={`Educational visual guide for ${topic}: ${visual.description}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-[1.01]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 840px"
                priority
              />
            </div>
            <figcaption className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-t border-slate-200/80 bg-white px-4 py-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#fe9800]" />
                Visual Learning Guide: {topic}
              </span>
              <span className="text-[11px] text-slate-400 capitalize">
                {visual.description}
              </span>
            </figcaption>
          </figure>
        </section>

        {/* Section: Core Concept & Deep Dive */}
        <section id="the-concept" className="scroll-mt-28 py-8 border-b border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#fe9800]">
            <span>Core Principles</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Understanding {topic} in Practice
          </h2>

          <div className="mt-4 space-y-4 text-sm sm:text-[15px] leading-relaxed text-slate-600">
            {lesson.detailedExplanation.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Quick Concept Badges & Breakdown */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {lesson.conceptBreakdown.map((item, index) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-md bg-white border border-slate-200 text-xs font-bold text-[#fe9800] shadow-2xs">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Practical Financial Example (Financial Card with Real Numbers - NO CODE) */}
        <section id="worked-example" className="scroll-mt-28 py-8 border-b border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#fe9800]">
            <span>Real-World Scenario</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Practical Financial Example & Calculation
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Here is how this financial principle translates into real rupee numbers, returns, and portfolio decisions:
          </p>

          <WorkedFinancialExample
            topic={topic}
            moduleTitle={courseModule.title}
            moduleNumber={courseModule.moduleNumber}
            workedExample={lesson.workedExample}
            practicalApplication={lesson.practicalApplication}
          />
        </section>

        {/* Section: Story & Analogy */}
        <section id="story-breakdown" className="scroll-mt-28 py-8 border-b border-slate-200/80">
          <InteractiveLessonStory
            storyData={storyData}
            topicName={topic}
          />
        </section>

        {/* Section: Evaluation Framework */}
        <section id="evaluation-framework" className="scroll-mt-28 py-8 border-b border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#fe9800]">
            <span>Due Diligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Systematic Evaluation Framework
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Follow this step-by-step checklist when researching and selecting schemes:
          </p>

          <div className="mt-5 space-y-3">
            {lesson.evaluationSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#fe9800]">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 pt-0.5">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Common Pitfalls */}
        <section id="common-mistakes" className="scroll-mt-28 py-8 border-b border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-rose-600">
            <span>Watch Out</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Common Mistakes to Avoid
          </h2>

          <div className="mt-4 space-y-3">
            {lesson.commonMistakes.map((mistake, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-rose-200/80 bg-rose-50/40 p-4"
              >
                <ShieldAlert className="size-5 shrink-0 text-rose-600 mt-0.5" />
                <p className="text-xs sm:text-sm leading-relaxed text-rose-950 font-medium">
                  {mistake}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Key Takeaways */}
        <section id="key-takeaways" className="scroll-mt-28 py-8 border-b border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#fe9800]">
            <span>Executive Summary</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Key Takeaways
          </h2>

          <div className="mt-4 space-y-2.5">
            {lesson.keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-1" />
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                  {takeaway}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer / Regulatory Note */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-500">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="size-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              <strong className="font-semibold text-slate-700">Educational note:</strong> Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Historical performance is not indicative of future returns.
            </p>
          </div>
        </div>

        {/* Bottom Pagination */}
        <nav
          aria-label="Previous and Next Lessons"
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          {previousTopic ? (
            <Link
              href={getTopicHref(previousTopic.courseModule, previousTopic.topic)}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 p-4 transition-all duration-150 hover:border-[#fe9800]/50 hover:bg-slate-50 hover:shadow-sm"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-[#fe9800]">
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                Previous Lesson
              </span>
              <span className="mt-2 text-sm font-bold text-slate-900 group-hover:text-[#fe9800]">
                {previousTopic.topic}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextTopic ? (
            <Link
              href={getTopicHref(nextTopic.courseModule, nextTopic.topic)}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 p-4 text-right transition-all duration-150 hover:border-[#fe9800]/50 hover:bg-slate-50 hover:shadow-sm sm:col-start-2"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-[#fe9800]">
                Next Lesson
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="mt-2 text-sm font-bold text-slate-900 group-hover:text-[#fe9800]">
                {nextTopic.topic}
              </span>
            </Link>
          ) : (
            <Link
              href="/research"
              className="group flex flex-col justify-between rounded-xl border border-[#fe9800]/40 bg-orange-50/60 p-4 text-right transition-all hover:bg-orange-100/60 sm:col-start-2"
            >
              <span className="text-xs font-semibold text-[#fe9800]">
                Curriculum Complete
              </span>
              <span className="mt-2 text-sm font-bold text-slate-900">
                Back to Curriculum Overview →
              </span>
            </Link>
          )}
        </nav>
      </article>
    </ResearchDocsLayout>
  );
}
