"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  GraduationCap,
  ShieldCheck,
  Layers,
} from "lucide-react";
import {
  getTopicHref,
  type CourseLevel,
  type CourseModule,
} from "@/lib/course-curriculum";
import {
  courseReferenceSources,
  getTopicExplanation,
} from "@/lib/course-topic-explanations";
import { ResearchDocsLayout } from "@/components/research/research-docs-layout";
import { type ResearchArticleTocItem } from "@/components/research/research-article-toc";

type ResearchLevelPageProps = {
  level: CourseLevel;
  modules: CourseModule[];
  nextLevel?: CourseLevel;
  previousLevel?: CourseLevel;
};

export function ResearchLevelPage({
  level,
  modules,
  nextLevel,
  previousLevel,
}: ResearchLevelPageProps) {
  const topicCount = modules.reduce(
    (total, courseModule) => total + courseModule.topics.length,
    0
  );

  const tocItems: ResearchArticleTocItem[] = [
    { id: "overview", label: `Level ${level.levelNumber} Overview` },
    ...modules.map((m) => ({
      id: m.id,
      label: `M${m.moduleNumber}: ${m.title}`,
    })),
  ];

  const breadcrumbs = [
    { label: `Level ${level.levelNumber}: ${level.shortTitle}` },
  ];

  return (
    <ResearchDocsLayout
      tocItems={tocItems}
      currentLevelId={level.id}
      breadcrumbs={breadcrumbs}
    >
      <article className="min-w-0 pb-16">
        {/* Level Header */}
        <header id="overview" className="scroll-mt-24 pb-6 border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#fe9800] mb-3">
            <GraduationCap className="size-4" />
            <span>Tier {level.levelNumber} of 8</span>
            <span>·</span>
            <span>{modules.length} Modules</span>
            <span>·</span>
            <span>{topicCount} Explained Lessons</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-[42px] lg:leading-[1.18] break-words">
            {level.title}
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
            {level.focus}. Work through each module below or use the left navigation sidebar to jump directly to any topic explanation.
          </p>
        </header>

        {/* Level Modules and Topics */}
        <div className="mt-8 space-y-10">
          {modules.map((courseModule) => (
            <section
              key={courseModule.id}
              id={courseModule.id}
              className="scroll-mt-24 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-orange-100 px-2 py-0.5 font-mono text-[11px] font-bold text-[#fe9800]">
                      Module {courseModule.moduleNumber}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {courseModule.category}
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {courseModule.title}
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                    {courseModule.description}
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-400 shrink-0">
                  {courseModule.topics.length} topics
                </span>
              </div>

              {/* Topics Grid */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {courseModule.topics.map((topic, topicIndex) => (
                  <Link
                    key={topic}
                    href={getTopicHref(courseModule, topic)}
                    className="group rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition-all hover:border-[#fe9800]/50 hover:bg-orange-50/30 hover:shadow-2xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white border border-slate-200 text-xs font-bold text-[#fe9800]">
                        {topicIndex + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#fe9800] truncate">
                          {topic}
                        </h3>
                        <p className="mt-1 text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {getTopicExplanation(courseModule, topic)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Previous / Next Level Navigation */}
        <nav
          aria-label="Course Level Navigation"
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          {previousLevel ? (
            <Link
              href={`/research/${previousLevel.id}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 p-4 transition-all hover:border-[#fe9800]/50 hover:bg-slate-50"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-[#fe9800]">
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                Previous Level
              </span>
              <span className="mt-2 text-sm font-bold text-slate-900 group-hover:text-[#fe9800]">
                Level {previousLevel.levelNumber}: {previousLevel.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextLevel ? (
            <Link
              href={`/research/${nextLevel.id}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 p-4 text-right transition-all hover:border-[#fe9800]/50 hover:bg-slate-50 sm:col-start-2"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-[#fe9800]">
                Next Level
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="mt-2 text-sm font-bold text-slate-900 group-hover:text-[#fe9800]">
                Level {nextLevel.levelNumber}: {nextLevel.title}
              </span>
            </Link>
          ) : (
            <Link
              href="/research"
              className="group flex flex-col justify-between rounded-xl border border-[#fe9800]/40 bg-orange-50/60 p-4 text-right transition-all sm:col-start-2"
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
