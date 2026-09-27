"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Search,
  BookOpen,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  courseCurriculum,
  courseLevels,
  getModulesForLevel,
  getTopicHref,
  createTopicSlug,
  type CourseLevel,
  type CourseModule,
} from "@/lib/course-curriculum";
import { cn } from "@/lib/utils";
import { ResearchSearchModal } from "./research-search-modal";

type ResearchDocsSidebarProps = {
  currentLevelId?: string;
  currentModuleId?: string;
  currentTopicSlug?: string;
  onLinkClick?: () => void;
  onOpenSearch?: () => void;
};

export function ResearchDocsSidebar({
  currentLevelId,
  currentModuleId,
  currentTopicSlug,
  onLinkClick,
  onOpenSearch,
}: ResearchDocsSidebarProps) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K (fallback if not provided by layout)
  useEffect(() => {
    if (onOpenSearch) return; // handled by layout
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenSearch]);

  // Set up expanded levels state. Default open the active level or Level 1.
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      start: true, // Getting Started
    };
    courseLevels.forEach((lvl) => {
      // Open active level or Level 1 by default
      initial[lvl.id] = currentLevelId ? lvl.id === currentLevelId : lvl.id === "foundation";
    });
    return initial;
  });

  // Set up expanded modules state. Default open the active module or Module 1.
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    courseCurriculum.forEach((mod) => {
      initial[mod.id] = currentModuleId ? mod.id === currentModuleId : mod.id === "module-1";
    });
    return initial;
  });

  // Auto-expand when route changes
  useEffect(() => {
    if (currentLevelId) {
      setExpandedLevels((prev) => ({ ...prev, [currentLevelId]: true }));
    }
    if (currentModuleId) {
      setExpandedModules((prev) => ({ ...prev, [currentModuleId]: true }));
    }
  }, [currentLevelId, currentModuleId]);

  const toggleLevel = (levelId: string) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [levelId]: !prev[levelId],
    }));
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const isOverviewActive = pathname === "/research";

  return (
    <>
      <aside className="w-full text-slate-700">
        {/* Search trigger button matching SwiftyAI docs */}
        <div className="mb-4 pr-1">
          <button
            type="button"
            onClick={() => onOpenSearch ? onOpenSearch() : setIsSearchOpen(true)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-200/90 bg-slate-50/70 px-3 py-2 text-xs font-normal text-slate-500 shadow-xs transition-colors hover:border-slate-300 hover:bg-slate-100/70 hover:text-slate-700"
          >
            <div className="flex items-center gap-2">
              <Search className="size-3.5 text-slate-400" />
              <span>Search docs...</span>
            </div>
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              Ctrl K
            </kbd>
          </button>
        </div>

        <nav aria-label="Curriculum Navigation" className="space-y-3 text-[13px]">
          {/* Start / Overview Section */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleLevel("start")}
              className="flex w-full items-center justify-between py-1 text-left font-semibold text-slate-900 transition-colors hover:text-[#fe9800]"
            >
              <span className="text-[13px] tracking-tight">Start</span>
              {expandedLevels["start"] ? (
                <ChevronDown className="size-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="size-3.5 text-slate-400" />
              )}
            </button>

            {expandedLevels["start"] && (
              <div className="ml-1 space-y-0.5 border-l border-slate-200/80 pl-3">
                <Link
                  href="/research"
                  onClick={onLinkClick}
                  className={cn(
                    "block rounded-md py-1.5 px-2 text-xs transition-colors",
                    isOverviewActive
                      ? "font-semibold text-[#fe9800] bg-orange-50/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                  )}
                >
                  Overview
                </Link>
                <Link
                  href="/research#roadmap"
                  onClick={onLinkClick}
                  className="block rounded-md py-1.5 px-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors"
                >
                  Course Roadmap
                </Link>
                <Link
                  href="/research#how-to-study"
                  onClick={onLinkClick}
                  className="block rounded-md py-1.5 px-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors"
                >
                  How to Study
                </Link>
                <Link
                  href="/research/foundation/module-1/what-is-investing"
                  onClick={onLinkClick}
                  className="block rounded-md py-1.5 px-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors"
                >
                  Quickstart Lesson
                </Link>
              </div>
            )}
          </div>

          {/* 8 Course Levels */}
          {courseLevels.map((level) => {
            const isLevelExpanded = !!expandedLevels[level.id];
            const modules = getModulesForLevel(level);

            return (
              <div key={level.id} className="space-y-1">
                {/* Level Header with chevron */}
                <button
                  type="button"
                  onClick={() => toggleLevel(level.id)}
                  className="flex w-full items-center justify-between py-1 text-left font-semibold text-slate-900 transition-colors hover:text-[#fe9800]"
                >
                  <span className="text-[13px] tracking-tight">
                    {level.shortTitle}
                  </span>
                  {isLevelExpanded ? (
                    <ChevronDown className="size-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="size-3.5 text-slate-400" />
                  )}
                </button>

                {/* Level Modules and Topics */}
                {isLevelExpanded && (
                  <div className="ml-1 space-y-1.5 border-l border-slate-200/80 pl-2.5 pt-0.5">
                    {modules.map((mod) => {
                      const isModuleExpanded = !!expandedModules[mod.id];

                      return (
                        <div key={mod.id} className="space-y-0.5">
                          {/* Module sub-header */}
                          <button
                            type="button"
                            onClick={() => toggleModule(mod.id)}
                            className="flex w-full items-center justify-between py-1 px-1.5 text-left text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded"
                          >
                            <span className="truncate pr-1">
                              M{mod.moduleNumber}: {mod.title}
                            </span>
                            {isModuleExpanded ? (
                              <ChevronDown className="size-3 text-slate-400 shrink-0" />
                            ) : (
                              <ChevronRight className="size-3 text-slate-400 shrink-0" />
                            )}
                          </button>

                          {/* Topics List under this Module */}
                          {isModuleExpanded && (
                            <div className="ml-1.5 space-y-0.5 border-l border-slate-200/60 pl-2">
                              {mod.topics.map((topic) => {
                                const topicSlug = createTopicSlug(topic);
                                const isCurrentTopic =
                                  currentLevelId === level.id &&
                                  currentModuleId === mod.id &&
                                  currentTopicSlug === topicSlug;

                                return (
                                  <Link
                                    key={topic}
                                    href={getTopicHref(mod, topic)}
                                    onClick={onLinkClick}
                                    className={cn(
                                      "block rounded-md py-1 px-2 text-[12px] leading-snug transition-all duration-150",
                                      isCurrentTopic
                                        ? "font-semibold text-[#fe9800] bg-orange-50/80 shadow-2xs"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60"
                                    )}
                                  >
                                    <span className="truncate block">{topic}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Global Search Dialog Modal (only if not provided by layout) */}
      {!onOpenSearch && (
        <ResearchSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </>
  );
}
