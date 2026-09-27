"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  ChevronRight,
  ChevronDown,
  BookOpen,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResearchDocsSidebar } from "./research-docs-sidebar";
import { ResearchArticleToc, type ResearchArticleTocItem } from "./research-article-toc";
import { ResearchSearchModal } from "./research-search-modal";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type ResearchDocsLayoutProps = {
  children: React.ReactNode;
  tocItems?: ResearchArticleTocItem[];
  currentLevelId?: string;
  currentModuleId?: string;
  currentTopicSlug?: string;
  breadcrumbs?: BreadcrumbItem[];
};

export function ResearchDocsLayout({
  children,
  tocItems = [],
  currentLevelId,
  currentModuleId,
  currentTopicSlug,
  breadcrumbs = [],
}: ResearchDocsLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!isMobileSidebarOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileSidebarOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isMobileSidebarOpen]);

  const lastCrumb = breadcrumbs[breadcrumbs.length - 1];

  return (
    <div className="min-h-screen bg-white text-slate-800 pt-[88px] sm:pt-[96px] lg:pt-[104px]">
      {/* Docs Sub-Header / Top Navigation Bar */}
      <div className="sticky top-[70px] sm:top-[78px] lg:top-[84px] z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-3 py-2 sm:px-6 lg:px-8">
          {/* Mobile menu toggle & Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open curriculum navigation menu"
              className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden shrink-0 transition-colors"
            >
              <Menu className="size-4" />
            </button>

            {/* Desktop & Tablet Breadcrumb trail */}
            <nav
              aria-label="Breadcrumbs"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
            >
              <Link
                href="/research"
                className="font-medium text-slate-700 hover:text-[#fe9800] transition-colors shrink-0"
              >
                Learn Investment
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <div
                  key={`${crumb.label}-${idx}`}
                  className="flex items-center gap-1.5 min-w-0"
                >
                  <ChevronRight className="size-3 text-slate-400 shrink-0" />
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="truncate hover:text-[#fe9800] transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="truncate font-semibold text-slate-900">
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Compact Breadcrumb */}
            <div className="flex sm:hidden items-center gap-1.5 text-xs min-w-0">
              <Link
                href="/research"
                className="text-slate-500 hover:text-[#fe9800] shrink-0 font-medium"
              >
                Docs
              </Link>
              {lastCrumb && (
                <>
                  <ChevronRight className="size-3 text-slate-400 shrink-0" />
                  <span className="truncate font-semibold text-slate-900">
                    {lastCrumb.label}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions (Search Trigger & Capstone CTA) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              aria-label="Search documentation"
              className="flex items-center gap-2 rounded-lg border border-slate-200/90 bg-slate-50/80 px-2.5 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Search className="size-3.5 text-slate-400" />
              <span className="hidden md:inline">Search docs...</span>
              <kbd className="hidden md:inline-block rounded border border-slate-200 bg-white px-1.5 py-0.2 font-mono text-[10px] text-slate-400">
                Ctrl K
              </kbd>
            </button>

            <Link
              href="/research/capstone/module-26/capstone-project"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50/70 px-3 py-1.5 text-xs font-semibold text-[#fe9800] hover:bg-orange-100/70 transition-colors"
            >
              <GraduationCap className="size-3.5 text-[#fe9800]" />
              <span>Capstone Plan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main 3-Column Documentation Container */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-center gap-6 xl:gap-8">
          {/* Left Column: Sticky Collapsible Tree Sidebar (Desktop) */}
          <div className="hidden lg:block w-64 shrink-0 py-6 pr-4 border-r border-slate-200/80 sticky top-[138px] h-[calc(100vh-160px)] overflow-y-auto overscroll-contain no-scrollbar">
            <ResearchDocsSidebar
              currentLevelId={currentLevelId}
              currentModuleId={currentModuleId}
              currentTopicSlug={currentTopicSlug}
              onOpenSearch={() => setIsSearchModalOpen(true)}
            />
          </div>

          {/* Middle Column: Main Documentation Content */}
          <main className="flex-1 min-w-0 max-w-[740px] 2xl:max-w-3xl py-6 sm:py-8 lg:px-2">
            {/* Mobile / Tablet "On this page" Dropdown Bar (screens < 1280px) */}
            {tocItems.length > 0 && (
              <div className="mb-6 xl:hidden">
                <details className="group rounded-xl border border-slate-200/90 bg-slate-50/70 p-3 text-xs transition-colors open:bg-white open:shadow-xs">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-700 marker:hidden [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-[#fe9800]" />
                      <span className="uppercase tracking-wider text-[11px] text-slate-600">
                        On this page
                      </span>
                    </span>
                    <ChevronDown className="size-4 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 pt-3 border-t border-slate-200/60">
                    <ResearchArticleToc items={tocItems} />
                  </div>
                </details>
              </div>
            )}

            {children}
          </main>

          {/* Right Column: Sticky "ON THIS PAGE" TOC (Desktop XL) */}
          {tocItems.length > 0 ? (
            <div className="hidden xl:block w-56 shrink-0 py-6 sm:py-8 pl-4 pr-2 sticky top-[138px] max-h-[calc(100vh-160px)] overflow-y-auto overscroll-contain no-scrollbar">
              <ResearchArticleToc items={tocItems} />
            </div>
          ) : (
            <div className="hidden xl:block w-56 shrink-0" />
          )}
        </div>
      </div>

      {/* Mobile Sidebar Slide-Over Drawer */}
      {isMobileSidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-[#fe9800]" />
                <span className="font-bold text-slate-900 text-sm">
                  Investment Curriculum
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto pr-1 no-scrollbar">
              <ResearchDocsSidebar
                currentLevelId={currentLevelId}
                currentModuleId={currentModuleId}
                currentTopicSlug={currentTopicSlug}
                onLinkClick={() => setIsMobileSidebarOpen(false)}
                onOpenSearch={() => {
                  setIsMobileSidebarOpen(false);
                  setIsSearchModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <ResearchSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
}
