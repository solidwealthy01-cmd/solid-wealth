import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers3,
  Lightbulb,
  ListChecks,
  ShieldCheck,
  Target,
} from "lucide-react";

import type {
  CourseLevel,
  CourseModule,
  CourseTopicEntry,
} from "@/lib/course-curriculum";
import { getTopicHref } from "@/lib/course-curriculum";
import {
  courseReferenceSources,
  getCourseTopicLesson,
} from "@/lib/course-topic-explanations";
import {
  ResearchArticleToc,
  type ResearchArticleTocItem,
} from "@/components/research/research-article-toc";
import { getStoryForTopic } from "@/lib/course-stories";
import { InteractiveLessonStory } from "@/components/research/interactive-lesson-story";

type ResearchTopicArticleProps = {
  level: CourseLevel;
  courseModule: CourseModule;
  topic: string;
  topicIndex: number;
  previousTopic?: CourseTopicEntry;
  nextTopic?: CourseTopicEntry;
};

const tableOfContents: ResearchArticleTocItem[] = [
  { id: "overview", label: "Topic overview" },
  { id: "story-breakdown", label: "Real-life story" },
  { id: "the-analogy", label: "Everyday analogy" },
  { id: "deep-dive", label: "Detailed explanation" },
  { id: "interactive-dilemma", label: "Decision challenge" },
  { id: "fun-facts", label: "Did you know?" },
  { id: "learning-objectives", label: "What you will learn" },
  { id: "why-it-matters", label: "Why it matters" },
  { id: "evaluation-framework", label: "Evaluation framework" },
  { id: "worked-example", label: "Worked example" },
  { id: "review-table", label: "Review table" },
  { id: "common-mistakes", label: "Common mistakes" },
  { id: "practical-exercise", label: "Practical exercise" },
  { id: "key-takeaways", label: "Key takeaways" },
];

const lessonVisuals = {
  foundations: {
    src: "/research/lesson-foundations.png",
    description:
      "gradual investing growth, financial protection, and progress toward a goal",
  },
  fundMechanics: {
    src: "/research/lesson-fund-mechanics.png",
    description:
      "pooled investments, diversification, fund documents, and regulated oversight",
  },
  analysis: {
    src: "/research/lesson-analysis.png",
    description:
      "fund comparison, risk-return evaluation, portfolio evidence, and diversification",
  },
  planning: {
    src: "/research/lesson-planning.png",
    description:
      "financial goals, asset allocation, rebalancing, and disciplined long-term planning",
  },
  financialMarkets: {
    src: "/research/lesson-financial-markets.png",
    description:
      "capital-market participants, primary and secondary activity, and distinct asset classes",
  },
  fundCategories: {
    src: "/research/lesson-fund-categories.png",
    description:
      "pooled money branching into equity, debt, hybrid, index, and international fund categories",
  },
  investmentMethods: {
    src: "/research/lesson-investment-methods.png",
    description:
      "recurring, lump-sum, and staged contributions entering a diversified portfolio",
  },
  portfolioConstruction: {
    src: "/research/lesson-portfolio-construction.png",
    description:
      "asset allocation connected to risk, goals, cash flows, and periodic portfolio review",
  },
  advancedStrategies: {
    src: "/research/lesson-advanced-strategies.png",
    description:
      "core-satellite design, factor filters, global diversification, and advanced allocation tools",
  },
  taxation: {
    src: "/research/lesson-taxation.png",
    description:
      "holding periods, taxable events, investor classification, records, and compliant filing",
  },
  behavioralFinance: {
    src: "/research/lesson-behavioral-finance.png",
    description:
      "fear and greed cycles, herd behaviour, recency, overconfidence, and disciplined decisions",
  },
  platformsCompliance: {
    src: "/research/lesson-platforms-compliance.png",
    description:
      "secure investment platforms, identity verification, holding choices, and compliance checks",
  },
  researchTools: {
    src: "/research/lesson-research-tools.png",
    description:
      "factsheets, calculators, portfolio tracking, goal planning, and evidence-based review tools",
  },
  equityFunds: {
    src: "/research/lesson-equity-funds.png",
    description:
      "equity portfolios grouped by company size, concentration, sector, and investment style",
  },
  debtFunds: {
    src: "/research/lesson-debt-funds.png",
    description:
      "debt instruments organized by maturity, credit quality, liquidity, and interest-rate sensitivity",
  },
  hybridFunds: {
    src: "/research/lesson-hybrid-funds.png",
    description:
      "hybrid portfolios combining equity, debt, and other assets in different proportions",
  },
  passiveGlobalFunds: {
    src: "/research/lesson-passive-global-funds.png",
    description:
      "benchmark tracking, exchange-traded units, and diversified international exposure",
  },
  returnMetrics: {
    src: "/research/lesson-return-metrics.png",
    description:
      "investment returns measured across time periods, cash flows, rolling windows, and risk",
  },
  fundRisks: {
    src: "/research/lesson-fund-risks.png",
    description:
      "market, credit, rate, liquidity, concentration, currency, inflation, and drawdown risks",
  },
  fundDocuments: {
    src: "/research/lesson-fund-documents.png",
    description:
      "scheme documents, factsheets, disclosures, and annual reports connected to evidence checks",
  },
  fundSelection: {
    src: "/research/lesson-fund-selection.png",
    description:
      "candidate funds passing through manager, consistency, cost, risk, portfolio, and peer filters",
  },
  fundOperations: {
    src: "/research/lesson-fund-operations.png",
    description:
      "pooled investor money, fund units, valuation, safekeeping, records, and separated oversight roles",
  },
  retirementPlanning: {
    src: "/research/lesson-retirement-planning.png",
    description:
      "retirement accumulation, age-based allocation, inflation, longevity, and controlled withdrawals",
  },
  goalBasedInvesting: {
    src: "/research/lesson-goal-based-investing.png",
    description:
      "separate investment paths matched to the time horizon and needs of different life goals",
  },
  caseStudies: {
    src: "/research/lesson-case-studies.png",
    description:
      "dated investment journeys, market recovery, goal outcomes, and evidence-based portfolio reviews",
  },
  portfolioAnalysis: {
    src: "/research/lesson-portfolio-analysis.png",
    description:
      "portfolio overlap, correlation, concentration, aggregate risk, return, and rebalancing",
  },
} as const;

const moduleLessonVisuals: Partial<
  Record<number, { src: string; description: string }>
> = {
  1: lessonVisuals.foundations,
  2: lessonVisuals.financialMarkets,
  3: lessonVisuals.fundOperations,
  4: lessonVisuals.fundOperations,
  5: lessonVisuals.fundCategories,
  6: lessonVisuals.returnMetrics,
  7: lessonVisuals.fundRisks,
  8: lessonVisuals.returnMetrics,
  9: lessonVisuals.fundDocuments,
  10: lessonVisuals.fundSelection,
  11: lessonVisuals.portfolioAnalysis,
  12: lessonVisuals.investmentMethods,
  13: lessonVisuals.investmentMethods,
  14: lessonVisuals.advancedStrategies,
  15: lessonVisuals.taxation,
  16: lessonVisuals.retirementPlanning,
  17: lessonVisuals.goalBasedInvesting,
  18: lessonVisuals.behavioralFinance,
  19: lessonVisuals.platformsCompliance,
  20: lessonVisuals.analysis,
  21: lessonVisuals.portfolioConstruction,
  22: lessonVisuals.behavioralFinance,
  23: lessonVisuals.caseStudies,
  24: lessonVisuals.advancedStrategies,
  25: lessonVisuals.researchTools,
  26: lessonVisuals.portfolioConstruction,
};

const equityFundTopics = new Set([
  "Large Cap",
  "Mid Cap",
  "Small Cap",
  "Multi Cap",
  "Flexi Cap",
  "ELSS",
  "Focused Fund",
  "Sector Funds",
  "Thematic Funds",
  "Value Fund",
  "Contra Fund",
  "Dividend Yield Fund",
]);

const debtFundTopics = new Set([
  "Liquid Fund",
  "Overnight Fund",
  "Ultra Short Duration",
  "Low Duration",
  "Money Market",
  "Short Duration",
  "Medium Duration",
  "Long Duration",
  "Corporate Bond Fund",
  "Banking & PSU Fund",
  "Credit Risk Fund",
  "Dynamic Bond Fund",
  "Gilt Fund",
]);

const hybridFundTopics = new Set([
  "Aggressive Hybrid",
  "Conservative Hybrid",
  "Balanced Advantage",
  "Dynamic Asset Allocation",
  "Multi Asset",
  "Arbitrage Fund",
  "Equity Savings",
]);

const passiveGlobalFundTopics = new Set([
  "Index Fund",
  "ETF",
  "International Funds",
]);

const cashFlowMethodTopics = new Set(["SIP", "STP", "SWP"]);

const passiveStrategyTopics = new Set([
  "Passive vs Active Funds",
  "International Diversification",
  "Smart Beta ETFs",
]);

function getTopicSpecificVisual(courseModule: CourseModule, topic: string) {
  if (courseModule.moduleNumber === 5) {
    if (equityFundTopics.has(topic)) return lessonVisuals.equityFunds;
    if (debtFundTopics.has(topic)) return lessonVisuals.debtFunds;
    if (hybridFundTopics.has(topic)) return lessonVisuals.hybridFunds;
    if (passiveGlobalFundTopics.has(topic)) {
      return lessonVisuals.passiveGlobalFunds;
    }
  }

  if (
    courseModule.moduleNumber === 6 &&
    cashFlowMethodTopics.has(topic)
  ) {
    return lessonVisuals.investmentMethods;
  }

  if (courseModule.moduleNumber === 20 && topic === "Reading a factsheet") {
    return lessonVisuals.fundDocuments;
  }

  if (courseModule.moduleNumber === 24) {
    if (passiveStrategyTopics.has(topic)) {
      return lessonVisuals.passiveGlobalFunds;
    }

    if (topic === "Interest Rate Cycles and Debt Funds") {
      return lessonVisuals.debtFunds;
    }

    if (topic === "Scheme Categorization (SEBI)") {
      return lessonVisuals.fundCategories;
    }

    if (topic === "Portfolio Rebalancing Techniques") {
      return lessonVisuals.portfolioAnalysis;
    }
  }

  return undefined;
}

const moduleOneLessonVisuals: Record<
  string,
  { src: string; description: string }
> = {
  "What is investing?": {
    src: "/research/topic-what-is-investing.png",
    description:
      "savings being put to work across productive and diversified assets",
  },
  "Why investing is important": {
    src: "/research/topic-why-investing-is-important.png",
    description:
      "a bridge from present resources to education, a home, and retirement goals",
  },
  "Inflation and purchasing power": {
    src: "/research/topic-inflation-and-purchasing-power.png",
    description:
      "the same reserve purchasing fewer everyday goods as prices rise over time",
  },
  "Saving vs Investing": {
    src: "/research/topic-saving-vs-investing.png",
    description:
      "a protected savings reserve alongside a diversified path for long-term growth",
  },
  "Risk vs Reward": {
    src: "/research/topic-risk-vs-reward.png",
    description:
      "a balance between capital protection, uncertainty, and potential growth",
  },
  "Time value of money": {
    src: "/research/topic-time-value-of-money.png",
    description:
      "an early contribution growing through successive stages as time passes",
  },
  "Compounding (The 8th Wonder)": {
    src: "/research/topic-compounding.png",
    description:
      "small returns producing further returns and expanding into a mature growth tree",
  },
  "Financial goals and planning": {
    src: "/research/topic-financial-goals-and-planning.png",
    description:
      "a planned route connecting savings and investments to several life goals",
  },
  "Emergency fund": {
    src: "/research/topic-emergency-fund.png",
    description:
      "a liquid reserve protected from unexpected household, health, and weather costs",
  },
  "Wealth creation mindset": {
    src: "/research/topic-wealth-creation-mindset.png",
    description:
      "patient habits, recurring contributions, protection, and steady progress toward a goal",
  },
};

function getLessonVisual(courseModule: CourseModule, topic: string) {
  if (courseModule.moduleNumber === 1 && moduleOneLessonVisuals[topic]) {
    return moduleOneLessonVisuals[topic];
  }

  const topicVisual = getTopicSpecificVisual(courseModule, topic);

  if (topicVisual) {
    return topicVisual;
  }

  const moduleVisual = moduleLessonVisuals[courseModule.moduleNumber];

  if (moduleVisual) {
    return moduleVisual;
  }

  const subject = `${courseModule.title} ${topic}`.toLowerCase();

  if (
    /\b(sid|kim|sai|nav|aum|nfo|scheme document|factsheet|fund structure|fund house|amc|rta|custodian|registrar)\b/.test(
      subject,
    )
  ) {
    return lessonVisuals.fundMechanics;
  }

  if (
    /\b(risk|return|alpha|beta|sharpe|sortino|standard deviation|drawdown|benchmark|expense ratio|tracking error|portfolio analysis|fund selection|performance|valuation)\b/.test(
      subject,
    ) || courseModule.category === "Analysis"
  ) {
    return lessonVisuals.analysis;
  }

  if (
    /\b(goal|retirement|tax|sip|lump sum|allocation|psychology|planning|withdrawal|swp|stp|estate|succession|capstone)\b|rebalanc|behavio/.test(
      subject,
    ) ||
    courseModule.category === "Strategy" ||
    courseModule.category === "Taxation & Compliance" ||
    courseModule.category === "Portfolio Management"
  ) {
    return lessonVisuals.planning;
  }

  if (courseModule.moduleNumber <= 4) {
    return lessonVisuals.foundations;
  }

  if (courseModule.moduleNumber <= 9) {
    return lessonVisuals.fundMechanics;
  }

  return lessonVisuals.planning;
}

function estimateReadingTime(parts: string[]) {
  const wordCount = parts.join(" ").trim().split(/\s+/).length;
  return Math.max(6, Math.ceil(wordCount / 180));
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
    lesson.watchOutFor,
    lesson.workedExample,
    storyData.story.title,
    storyData.story.context,
    storyData.story.dilemma,
    storyData.story.choiceMade,
    storyData.story.outcome,
    storyData.story.moral,
    storyData.analogy.explanation,
    ...lesson.detailedExplanation,
    ...lesson.conceptBreakdown.flatMap((item) => [item.title, item.description]),
    ...lesson.learningObjectives,
    ...lesson.evaluationSteps,
    ...lesson.commonMistakes,
    ...lesson.keyTakeaways,
  ]);
  const progress = ((topicIndex + 1) / courseModule.topics.length) * 100;
  const moduleTopics = courseModule.topics;
  const lessonVisual = getLessonVisual(courseModule, topic);

  return (
    <div className="min-h-screen bg-white text-wealth-primary">
      <header className="border-b border-wealth-border/80 bg-[#fffdf8] px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-semibold text-wealth-muted"
          >
            <Link className="transition hover:text-wealth-accent" href="/research">
              Investment Education
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              className="transition hover:text-wealth-accent"
              href={`/research/${level.id}`}
            >
              Level {level.levelNumber}
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              className="transition hover:text-wealth-accent"
              href={`/research/${level.id}#${courseModule.id}`}
            >
              Module {courseModule.moduleNumber}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-wealth-secondary">
              {topic}
            </span>
          </nav>

          <div className="mt-7 max-w-4xl">
            <h1 className="break-words font-display text-[34px] font-extrabold leading-[1.12] tracking-[-0.035em] text-wealth-primary sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
              {topic}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-wealth-secondary sm:text-lg sm:leading-8">
              A detailed lesson from {courseModule.title}, including the decision
              framework, evidence to review, common errors, and a practical exercise
              you can complete.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-wealth-muted">
              <span className="inline-flex items-center gap-2">
                <GraduationCap aria-hidden="true" className="size-4" />
                Module {courseModule.moduleNumber}: {courseModule.title}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 aria-hidden="true" className="size-4" />
                {readingTime} min read
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen aria-hidden="true" className="size-4" />
                Topic {topicIndex + 1} of {courseModule.topics.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,820px)_320px] lg:items-start lg:gap-12 xl:gap-16">
          <details className="group rounded-2xl border border-wealth-border/90 bg-white p-4 shadow-wealth-sm lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-wealth-accent">
                In this lesson
              </span>
              <ChevronDown
                aria-hidden="true"
                className="size-4 text-wealth-muted transition-transform group-open:rotate-180"
              />
            </summary>
            <ResearchArticleToc items={tableOfContents} />
          </details>

          <article className="min-w-0">
            <section
              className="scroll-mt-28 border-b border-wealth-border/80 pb-10"
              id="overview"
            >
              <figure className="overflow-hidden rounded-3xl border border-wealth-border/80 bg-[#fff9ec] shadow-[0_12px_36px_rgba(15,26,44,0.08)]">
                <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[2/1]">
                  <Image
                    alt={`Educational illustration for ${topic}, showing ${lessonVisual.description}.`}
                    className="object-cover"
                    fill
                    sizes="(max-width: 1023px) calc(100vw - 32px), 820px"
                    src={lessonVisual.src}
                  />
                </div>
                <figcaption className="flex flex-col gap-1 border-t border-wealth-border/70 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-wealth-accent">
                    Topic visual guide
                  </span>
                  <span className="text-xs font-semibold leading-5 text-wealth-secondary sm:text-right">
                    {topic}
                  </span>
                </figcaption>
              </figure>

              <p className="mt-8 text-lg leading-8 text-wealth-secondary sm:text-xl sm:leading-9">
                {lesson.explanation}
              </p>

              <div className="mt-7 rounded-2xl border border-wealth-accent/25 bg-[#fff9ec] p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-wealth-accent text-white">
                    <Lightbulb aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-wealth-primary">
                      The short version
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-wealth-secondary">
                      Learn the meaning first, verify how the concept works in the
                      relevant product or portfolio, then connect it to a stated
                      goal. A useful conclusion always records its assumptions and
                      limitations.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="py-10 border-b border-wealth-border/80">
              <InteractiveLessonStory
                storyData={storyData}
                topicName={topic}
              />
            </div>

            <section
              className="scroll-mt-28 border-b border-wealth-border/80 py-10"
              id="deep-dive"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-wealth-accent">
                Detailed explanation
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Understanding the concept in context
              </h2>
              <div className="mt-6 space-y-5">
                {lesson.detailedExplanation.map((paragraph) => (
                  <p
                    className="text-base leading-8 text-wealth-secondary"
                    key={paragraph}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {lesson.conceptBreakdown.map((item, index) => (
                  <div
                    className="rounded-2xl border border-wealth-border/80 bg-[#fffdf8] p-5"
                    key={item.title}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-white text-[10px] font-extrabold text-wealth-accent shadow-wealth-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-sm font-bold text-wealth-primary">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-wealth-secondary">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="scroll-mt-28 py-10" id="learning-objectives">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-wealth-accent">
                Learning objectives
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                What you will understand
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {lesson.learningObjectives.map((objective, index) => (
                  <div
                    className="rounded-2xl border border-wealth-border/80 bg-[#fffdf8] p-5"
                    key={objective}
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-wealth-accent-light text-xs font-extrabold text-wealth-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-4 text-sm font-semibold leading-6 text-wealth-secondary">
                      {objective}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="scroll-mt-28 border-y border-wealth-border/80 py-10"
              id="why-it-matters"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-wealth-accent">
                Investor relevance
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Why this topic matters
              </h2>
              <p className="mt-5 text-base leading-8 text-wealth-secondary">
                {lesson.whyItMatters}
              </p>
              <p className="mt-4 text-base leading-8 text-wealth-secondary">
                The concept should never be viewed in isolation. Its practical
                meaning depends on the investor&apos;s goal, time horizon, liquidity
                needs, ability to absorb loss, other holdings, costs, and the
                quality and date of the evidence being used.
              </p>
            </section>

            <section className="scroll-mt-28 py-10" id="evaluation-framework">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-wealth-accent">
                Step-by-step method
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                How to evaluate and apply it
              </h2>
              <ol className="mt-7 space-y-5">
                {lesson.evaluationSteps.map((step, index) => (
                  <li className="flex gap-4" key={step}>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-wealth-accent/25 bg-wealth-accent-light text-xs font-extrabold tabular-nums text-wealth-accent">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-base leading-7 text-wealth-secondary">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section
              className="scroll-mt-28 rounded-3xl bg-wealth-primary p-6 text-white sm:p-8"
              id="worked-example"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-wealth-accent">
                <Layers3 aria-hidden="true" className="size-5" />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-wealth-accent">
                Worked learning example
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Turning the concept into evidence
              </h2>
              <p className="mt-5 text-base leading-8 text-white/70">
                {lesson.workedExample}
              </p>
              <div className="mt-6 border-l-2 border-wealth-accent pl-4">
                <p className="text-sm font-semibold leading-6 text-white/85">
                  The output is a documented conclusion—not an automatic buy,
                  sell, or switch instruction.
                </p>
              </div>
            </section>

            <section className="scroll-mt-28 py-10" id="review-table">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-wealth-accent">
                Learning worksheet
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Questions and evidence to record
              </h2>
              <div className="mt-7 overflow-x-auto rounded-2xl border border-wealth-border/90">
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  <thead className="bg-[#fff9ec] text-wealth-primary">
                    <tr>
                      <th className="border-b border-wealth-border px-5 py-4 font-bold">
                        Dimension
                      </th>
                      <th className="border-b border-l border-wealth-border px-5 py-4 font-bold">
                        Question to answer
                      </th>
                      <th className="border-b border-l border-wealth-border px-5 py-4 font-bold">
                        Evidence to retain
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lesson.reviewTable.map((row) => (
                      <tr className="align-top even:bg-[#fffdf8]" key={row.dimension}>
                        <th className="border-b border-wealth-border/70 px-5 py-4 font-bold text-wealth-primary">
                          {row.dimension}
                        </th>
                        <td className="border-b border-l border-wealth-border/70 px-5 py-4 leading-6 text-wealth-secondary">
                          {row.question}
                        </td>
                        <td className="border-b border-l border-wealth-border/70 px-5 py-4 leading-6 text-wealth-secondary">
                          {row.evidence}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section
              className="scroll-mt-28 border-y border-wealth-border/80 py-10"
              id="common-mistakes"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <AlertTriangle aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                    Watch-outs
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    Common mistakes
                  </h2>
                </div>
              </div>
              <ul className="mt-7 space-y-4">
                {lesson.commonMistakes.map((mistake) => (
                  <li className="flex items-start gap-3" key={mistake}>
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
                    <p className="text-base leading-7 text-wealth-secondary">{mistake}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
                {lesson.watchOutFor}
              </p>
            </section>

            <section className="scroll-mt-28 py-10" id="practical-exercise">
              <div className="rounded-3xl border border-wealth-border bg-[#fffdf8] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Target aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                      Practical exercise
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                      Put the concept into practice
                    </h2>
                  </div>
                </div>
                <p className="mt-6 text-base leading-8 text-wealth-secondary">
                  {lesson.practicalApplication}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {["Source and date", "Assumptions used", "Conclusion and limitation"].map(
                    (item) => (
                      <div
                        className="rounded-xl border border-wealth-border/80 bg-white p-4 text-sm font-bold text-wealth-primary"
                        key={item}
                      >
                        <ListChecks
                          aria-hidden="true"
                          className="mb-3 size-4 text-wealth-accent"
                        />
                        {item}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>

            <section
              className="scroll-mt-28 rounded-3xl border border-wealth-accent/25 bg-[#fff9ec] p-6 sm:p-8"
              id="key-takeaways"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-wealth-accent">
                Lesson summary
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Key takeaways
              </h2>
              <ul className="mt-6 space-y-4">
                {lesson.keyTakeaways.map((takeaway) => (
                  <li className="flex items-start gap-3" key={takeaway}>
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 size-5 shrink-0 text-wealth-accent"
                    />
                    <p className="text-sm leading-7 text-wealth-secondary sm:text-base">
                      {takeaway}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10" id="sources">
              <div className="flex items-start gap-4 rounded-2xl border border-wealth-border/80 p-5 sm:p-6">
                <ShieldCheck
                  aria-hidden="true"
                  className="size-6 shrink-0 text-emerald-700"
                />
                <div>
                  <h2 className="font-bold text-wealth-primary">
                    Educational content—not a personal recommendation
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-wealth-secondary">
                    Mutual-fund investments involve risk. Scheme, tax, and regulatory
                    rules can change, and suitability depends on personal facts. Check
                    current official documents and obtain qualified advice when needed.
                  </p>
                </div>
              </div>
            </section>

            <nav
              aria-label="Topic pagination"
              className="mt-10 grid gap-3 sm:grid-cols-2"
            >
              {previousTopic ? (
                <Link
                  className="group rounded-2xl border border-wealth-border p-5 transition hover:border-wealth-accent/50 hover:bg-[#fffdf8]"
                  href={getTopicHref(previousTopic.courseModule, previousTopic.topic)}
                >
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-wealth-muted">
                    <ArrowLeft
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:-translate-x-1"
                    />
                    Previous topic
                  </span>
                  <span className="mt-3 block text-sm font-bold leading-6 text-wealth-primary">
                    {previousTopic.topic}
                  </span>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              {nextTopic ? (
                <Link
                  className="group rounded-2xl border border-wealth-border p-5 text-right transition hover:border-wealth-accent/50 hover:bg-[#fffdf8]"
                  href={getTopicHref(nextTopic.courseModule, nextTopic.topic)}
                >
                  <span className="flex items-center justify-end gap-2 text-xs font-bold uppercase tracking-[0.12em] text-wealth-muted">
                    Next topic
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                  <span className="mt-3 block text-sm font-bold leading-6 text-wealth-primary">
                    {nextTopic.topic}
                  </span>
                </Link>
              ) : (
                <Link
                  className="group rounded-2xl bg-wealth-accent p-5 text-right text-white transition hover:-translate-y-0.5 hover:shadow-wealth-md"
                  href="/research"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/75">
                    Course complete
                  </span>
                  <span className="mt-3 block text-sm font-bold">
                    Return to Investment Education overview
                  </span>
                </Link>
              )}
            </nav>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-28">
            <section className="hidden rounded-2xl border border-wealth-border/90 bg-white p-5 shadow-wealth-sm lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-wealth-accent">
                In this lesson
              </p>
              <ResearchArticleToc items={tableOfContents} />
            </section>

            <section className="rounded-2xl border border-wealth-border/90 bg-[#fffdf8] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-wealth-accent">
                    Module {courseModule.moduleNumber}
                  </p>
                  <h2 className="mt-1 text-sm font-bold leading-5 text-wealth-primary">
                    {courseModule.title}
                  </h2>
                </div>
                <span className="text-xs font-extrabold tabular-nums text-wealth-muted">
                  {topicIndex + 1}/{courseModule.topics.length}
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-wealth-border/70">
                <div
                  className="h-full rounded-full bg-wealth-accent"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Link
                className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-wealth-primary transition hover:text-wealth-accent"
                href={`/research/${level.id}#${courseModule.id}`}
              >
                <ArrowLeft aria-hidden="true" className="size-3.5" />
                Back to module
              </Link>
            </section>

            <section className="rounded-2xl border border-wealth-border/90 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-wealth-accent">
                Related topics
              </p>
              <p className="mt-1 text-[11px] text-wealth-muted">
                All {moduleTopics.length} topics in this module
              </p>
              <ul className="mt-4 max-h-[420px] divide-y divide-wealth-border/70 overflow-y-auto overscroll-contain pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {moduleTopics.map((moduleTopic) => {
                  const isCurrentTopic = moduleTopic === topic;
                  const moduleTopicVisual = getLessonVisual(
                    courseModule,
                    moduleTopic,
                  );

                  return (
                    <li key={moduleTopic}>
                      {isCurrentTopic ? (
                        <span
                          aria-current="page"
                          className="flex items-center justify-between gap-3 py-3 text-xs font-bold leading-5 text-wealth-accent"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-wealth-accent/25 bg-wealth-accent-light">
                              <Image
                                alt=""
                                aria-hidden="true"
                                className="object-cover"
                                fill
                                sizes="44px"
                                src={moduleTopicVisual.src}
                              />
                            </span>
                            <span>{moduleTopic}</span>
                          </span>
                          <span className="shrink-0 rounded-full bg-wealth-accent-light px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em]">
                            Current
                          </span>
                        </span>
                      ) : (
                        <Link
                          className="group flex items-center justify-between gap-3 py-3 text-xs font-semibold leading-5 text-wealth-secondary transition hover:text-wealth-accent"
                          href={getTopicHref(courseModule, moduleTopic)}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-wealth-border/80 bg-[#fff9ec] transition group-hover:border-wealth-accent/40">
                              <Image
                                alt=""
                                aria-hidden="true"
                                className="object-cover transition duration-300 group-hover:scale-105"
                                fill
                                sizes="44px"
                                src={moduleTopicVisual.src}
                              />
                            </span>
                            <span>{moduleTopic}</span>
                          </span>
                          <ArrowRight
                            aria-hidden="true"
                            className="size-3.5 shrink-0 transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="rounded-2xl border border-wealth-border/90 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-wealth-accent">
                Official references
              </p>
              <ul className="mt-4 space-y-4">
                {courseReferenceSources.map((source) => (
                  <li key={source.title}>
                    <a
                      className="group block"
                      href={source.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="flex items-start justify-between gap-3 text-xs font-bold leading-5 text-wealth-primary transition group-hover:text-wealth-accent">
                        <span className="flex items-start gap-2">
                          <FileText
                            aria-hidden="true"
                            className="mt-0.5 size-3.5 shrink-0 text-wealth-accent"
                          />
                          {source.title}
                        </span>
                        <ExternalLink
                          aria-hidden="true"
                          className="mt-0.5 size-3 shrink-0"
                        />
                      </span>
                      <span className="mt-1 block pl-5.5 text-[11px] leading-4 text-wealth-muted">
                        {source.description}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
