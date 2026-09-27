"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X, BookOpen, Layers, ArrowRight, CornerDownLeft } from "lucide-react";
import {
  courseCurriculum,
  courseLevels,
  getTopicHref,
  getCourseLevelForModule,
} from "@/lib/course-curriculum";
import { cn } from "@/lib/utils";

type SearchResult = {
  type: "topic" | "module";
  title: string;
  subtitle: string;
  badge: string;
  href: string;
};

type ResearchSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ResearchSearchModal({ isOpen, onClose }: ResearchSearchModalProps) {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-index all searchable topics and modules
  const allSearchItems: SearchResult[] = useMemo(() => {
    const items: SearchResult[] = [
      {
        type: "topic",
        title: "Course Overview & Learning Roadmap",
        subtitle: "Mutual Fund Investment Mastery - Complete Curriculum",
        badge: "Overview",
        href: "/research",
      },
    ];

    courseCurriculum.forEach((mod) => {
      const level = getCourseLevelForModule(mod.moduleNumber);
      items.push({
        type: "module",
        title: `Module ${mod.moduleNumber}: ${mod.title}`,
        subtitle: `${level ? `Level ${level.levelNumber} · ` : ""}${mod.category} · ${mod.topics.length} topics`,
        badge: mod.category,
        href: `/research/${level?.id ?? "foundation"}#${mod.id}`,
      });

      mod.topics.forEach((topic) => {
        items.push({
          type: "topic",
          title: topic,
          subtitle: `Module ${mod.moduleNumber}: ${mod.title}`,
          badge: level?.shortTitle || "Topic",
          href: getTopicHref(mod, topic),
        });
      });
    });

    return items;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSearchItems.slice(0, 8); // show initial recommendations

    return allSearchItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q)
      )
      .slice(0, 15);
  }, [allSearchItems, query]);

  // Handle keyboard shortcuts (Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
      className="fixed inset-0 z-[99999] flex items-start justify-center p-3 pt-16 sm:p-6 sm:pt-24 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar (Visible at the very top of the modal) */}
        <div className="relative flex items-center border-b border-slate-200 bg-white px-4 py-3.5">
          <Search className="size-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, modules, investment concepts..."
            autoFocus
            className="w-full bg-transparent text-base text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="size-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No matching lessons or modules found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, idx) => (
                <Link
                  key={`${item.href}-${idx}`}
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-colors hover:bg-slate-100/80"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 group-hover:border-[#fe9800]/40 group-hover:bg-orange-50 group-hover:text-[#fe9800]">
                      {item.type === "module" ? (
                        <Layers className="size-4" />
                      ) : (
                        <BookOpen className="size-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 truncate group-hover:text-[#fe9800]">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {item.badge}
                    </span>
                    <ArrowRight className="size-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#fe9800]" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
              ↑↓
            </kbd>
            <span>Select:</span>
            <kbd className="inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
              <CornerDownLeft className="size-2.5" /> Enter
            </kbd>
          </div>
          <div>{results.length} topics & modules</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
