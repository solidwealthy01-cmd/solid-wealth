"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type ResearchArticleTocItem = {
  id: string;
  label: string;
};

type ResearchArticleTocProps = {
  items: ResearchArticleTocItem[];
  title?: string;
};

export function ResearchArticleToc({
  items,
  title = "ON THIS PAGE",
}: ResearchArticleTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [indicatorStyle, setIndicatorStyle] = useState<{
    top: number;
    height: number;
    opacity: number;
  }>({
    top: 0,
    height: 0,
    opacity: 0,
  });

  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // Update active section based on scroll
  useEffect(() => {
    let animationFrame: number | null = null;

    const updateActiveSection = () => {
      animationFrame = null;
      const readingLine = 160;
      let nextActiveId = items[0]?.id ?? "";

      for (const item of items) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= readingLine) {
          nextActiveId = item.id;
        }
      }

      const isAtPageEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 20;

      if (isAtPageEnd && items.length > 0) {
        nextActiveId = items[items.length - 1].id;
      }

      setActiveId((currentId) =>
        currentId === nextActiveId ? currentId : nextActiveId
      );
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [items]);

  // Update sliding indicator position whenever activeId or items change
  useEffect(() => {
    const updateIndicator = () => {
      const activeEl = itemRefs.current.get(activeId);
      if (activeEl) {
        setIndicatorStyle({
          top: activeEl.offsetTop,
          height: activeEl.offsetHeight,
          opacity: 1,
        });
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();
    const timer = setTimeout(updateIndicator, 50);
    window.addEventListener("resize", updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeId, items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="w-full">
      <div className="mb-3 text-[11px] font-bold tracking-wider text-slate-900 uppercase">
        {title}
      </div>

      <div className="relative">
        {/* Subtle continuous vertical rail track */}
        <div className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-slate-200" />

        {/* Animated Sliding Orange Indicator Bar */}
        <div
          aria-hidden="true"
          className="absolute left-0 -ml-[0.5px] w-[2.5px] rounded-full bg-[#fe9800] transition-all duration-250 ease-out pointer-events-none"
          style={{
            transform: `translateY(${indicatorStyle.top}px)`,
            height: `${indicatorStyle.height || 20}px`,
            opacity: indicatorStyle.opacity,
          }}
        />

        <ul className="space-y-1 pl-3 text-[13px] leading-snug">
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <li key={item.id}>
                <a
                  ref={(el) => {
                    if (el) itemRefs.current.set(item.id, el);
                    else itemRefs.current.delete(item.id);
                  }}
                  href={`#${item.id}`}
                  onClick={() => setActiveId(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "block py-1 text-xs transition-colors duration-150",
                    isActive
                      ? "font-semibold text-[#fe9800]"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
