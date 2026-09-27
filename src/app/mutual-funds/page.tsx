import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, TrendingUp } from "lucide-react";
import { TrailingReturnsTable } from "@/components/mutual-funds/trailing-returns-table";

export const metadata: Metadata = {
  title: "Mutual Fund Trailing Returns & Performance Research | Solid Wealth",
  description:
    "Explore mutual fund trailing returns, AUM, expense ratios, rankings, and performance across all equity and debt categories.",
};

export default function MutualFundsResearchPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-28 pb-20 sm:pt-36 sm:pb-24 lg:pt-40">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb matching Screenshot 1 */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-semibold text-gray-500"
        >
          <Link href="/" className="hover:text-[#fe9800] transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3 text-gray-400" />
          <span className="text-gray-500">MF Research</span>
          <ChevronRight className="size-3 text-gray-400" />
          <span className="text-gray-900 font-bold">Mutual Fund Trailing Returns</span>
        </nav>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200/80">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-[#1a2332] sm:text-4xl tracking-tight">
              Mutual Fund Trailing Returns
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Analyze trailing returns, expense ratios, and category ranks for each scheme.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-2xs">
            <TrendingUp className="size-4 text-[#fe9800]" />
            <span className="text-xs font-bold text-gray-700">Real-time NAV & Ranks</span>
          </div>
        </div>

        {/* Trailing Returns Table Component */}
        <TrailingReturnsTable />
      </div>
    </div>
  );
}
