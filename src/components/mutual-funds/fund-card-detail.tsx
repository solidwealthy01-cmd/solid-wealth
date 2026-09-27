"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Search,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Download,
  Building2,
  UserCheck,
  Award,
  Layers,
  ShieldAlert,
  Info,
} from "lucide-react";
import {
  MUTUAL_FUNDS_DATA,
  FundScheme,
  getFundBySlugOrName,
} from "@/lib/mutual-funds-data";
import { RiskOMeter } from "./risk-o-meter";
import { MarketCapDonut } from "./market-cap-donut";
import { YearlyPerformanceChart } from "./yearly-performance-chart";
import { cn } from "@/lib/utils";

interface FundCardDetailProps {
  initialScheme: string;
}

export function FundCardDetail({ initialScheme }: FundCardDetailProps) {
  const router = useRouter();
  const fund = getFundBySlugOrName(initialScheme);
  const [selectedSchemeName, setSelectedSchemeName] = useState(fund.fullName);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleSchemeChange = (e: React.FormEvent) => {
    e.preventDefault();
    const target = getFundBySlugOrName(selectedSchemeName);
    router.push(
      `/mutual-funds/fund-card?scheme=${encodeURIComponent(target.fullName)}`
    );
  };

  const handleDownloadPDF = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 200);
  };

  return (
    <div className="w-full space-y-8 print:space-y-6">
      {/* Breadcrumb matching Screenshot 2 */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs font-semibold text-gray-500 print:hidden"
      >
        <Link href="/" className="hover:text-[#fe9800] transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3 text-gray-400" />
        <Link href="/mutual-funds" className="hover:text-[#fe9800] transition-colors">
          MF Research
        </Link>
        <ChevronRight className="size-3 text-gray-400" />
        <span className="text-gray-900 font-bold">Fund Card</span>
      </nav>

      {/* Top Scheme Selector & Download PDF Bar matching Screenshot 2 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs print:hidden">
        <form
          onSubmit={handleSchemeChange}
          className="flex flex-col sm:flex-row items-center gap-3 flex-1"
        >
          <label className="text-xs font-bold text-gray-700 whitespace-nowrap">
            Scheme Name:
          </label>
          <div className="relative flex-1 w-full">
            <select
              value={selectedSchemeName}
              onChange={(e) => {
                setSelectedSchemeName(e.target.value);
                const target = getFundBySlugOrName(e.target.value);
                router.push(
                  `/mutual-funds/fund-card?scheme=${encodeURIComponent(
                    target.fullName
                  )}`
                );
              }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#0B63E5]"
            >
              {MUTUAL_FUNDS_DATA.map((f) => (
                <option key={f.id} value={f.fullName}>
                  {f.fullName}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#0B63E5] hover:bg-[#0952be] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <Download className="size-4 text-rose-600" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Main Title matching Screenshot 2 */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a2332] tracking-tight">
          {fund.fullName}
        </h1>
      </div>

      {/* SECTION 1: Top Overview Cards (Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Management & Details (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-blue-100 bg-[#F0F6FF]/70 p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-[#64748b]">Fund Manager</p>
              <p className="text-sm font-bold text-[#0f172a] mt-0.5">{fund.fundManager}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748b]">Benchmark</p>
              <p className="text-sm font-bold text-[#0f172a] mt-0.5">{fund.benchmark}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748b]">Category</p>
              <p className="text-sm font-bold text-[#0f172a] mt-0.5">{fund.category}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748b]">Fund House</p>
              <p className="text-sm font-bold text-[#0f172a] mt-0.5">{fund.fundHouse}</p>
            </div>
          </div>
        </div>

        {/* Right Cards: NAV & AUM (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* NAV Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-center items-center text-center">
            <p className="text-xs font-semibold text-gray-500">
              NAV (as on {fund.navDate})
            </p>
            <p className="text-3xl font-black text-[#1a2332] mt-1">
              ₹ {fund.nav.toFixed(2)}
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-2">
              <TrendingUp className="size-3.5" />
              <span>
                {fund.navChange > 0 ? "+" : ""}
                {fund.navChange.toFixed(2)} ({fund.navChangePct.toFixed(2)} %)
              </span>
            </div>
          </div>

          {/* AUM Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-center items-center text-center">
            <p className="text-xs font-semibold text-gray-500">
              AUM (as on {fund.aumDate})
            </p>
            <p className="text-2xl sm:text-3xl font-black text-[#0B63E5] mt-1">
              ₹ {fund.aumCrore.toLocaleString("en-IN")} Cr
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Key Parameters Ribbon (Grid of 8 stats from Screenshot 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 rounded-2xl border border-[#FFF3DC] bg-[#FFFBF0] p-4 text-center">
        {/* Return Since Inception */}
        <div className="p-2 border-r border-[#faeed6] last:border-none">
          <p className="text-[11px] font-semibold text-[#8a5b15]">Return (Since Inception)</p>
          <p className="text-sm font-extrabold text-emerald-600 mt-1">
            ▲ {fund.returnSinceInception.toFixed(2)}%
          </p>
        </div>

        {/* Inception Date */}
        <div className="p-2 border-r border-[#faeed6] last:border-none">
          <p className="text-[11px] font-semibold text-[#8a5b15]">Inception Date</p>
          <p className="text-sm font-bold text-gray-900 mt-1">{fund.inceptionDate}</p>
        </div>

        {/* Expense Ratio */}
        <div className="p-2 border-r border-[#faeed6] last:border-none">
          <p className="text-[11px] font-semibold text-[#8a5b15]">Expense Ratio</p>
          <p className="text-xs font-bold text-[#8a5b15] mt-1">
            BER: {fund.ber.toFixed(2)}% | TER: {fund.ter}%
          </p>
        </div>

        {/* Fund Status */}
        <div className="p-2 border-r border-[#faeed6] last:border-none">
          <p className="text-[11px] font-semibold text-[#8a5b15]">Fund Status</p>
          <p className="text-xs font-bold text-gray-900 mt-1">{fund.fundStatus}</p>
        </div>

        {/* Min. Investment */}
        <div className="p-2 border-r border-[#faeed6] last:border-none">
          <p className="text-[11px] font-semibold text-[#8a5b15]">Min. Investment</p>
          <p className="text-sm font-bold text-gray-900 mt-1">₹ {fund.minInvestment}</p>
        </div>

        {/* Min. Topup */}
        <div className="p-2 border-r border-[#faeed6] last:border-none">
          <p className="text-[11px] font-semibold text-[#8a5b15]">Min. Topup</p>
          <p className="text-sm font-bold text-gray-900 mt-1">₹ {fund.minTopup}</p>
        </div>

        {/* Min. SIP Amount */}
        <div className="p-2 border-r border-[#faeed6] last:border-none">
          <p className="text-[11px] font-semibold text-[#8a5b15]">Min. SIP Amount</p>
          <p className="text-sm font-bold text-gray-900 mt-1">₹ {fund.minSip}</p>
        </div>

        {/* Risk Status */}
        <div className="p-2">
          <p className="text-[11px] font-semibold text-[#8a5b15]">Risk Status</p>
          <p className="text-sm font-black text-rose-600 mt-1">{fund.riskStatus}</p>
        </div>
      </div>

      {/* SECTION 3: Exit Load & Investment Objective Callouts (Screenshot 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exit Load */}
        <div className="rounded-xl border border-blue-100 bg-[#f8faff] p-4 text-xs leading-relaxed">
          <span className="font-extrabold text-[#0B63E5]">Exit Load: </span>
          <span className="text-gray-700">{fund.exitLoad}</span>
        </div>

        {/* Investment Objective */}
        <div className="rounded-xl border border-blue-100 bg-[#f8faff] p-4 text-xs leading-relaxed">
          <span className="font-extrabold text-[#0B63E5]">Investment Objective: </span>
          <span className="text-gray-700">{fund.investmentObjective}</span>
        </div>
      </div>

      {/* SECTION 4: Returns (%) Comparison Table (Screenshot 2) */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-gray-50/70 px-6 py-3 border-b border-gray-200 text-center">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            Returns (%)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-gray-700 text-left border-collapse">
            <thead>
              <tr className="border-b border-[#faeed6] bg-[#FFF8EA] text-[#8a5b15] font-bold text-[11px]">
                <th className="px-4 py-2.5 min-w-[180px]">Metric / Fund</th>
                {fund.returnsComparison.map((r) => (
                  <th key={r.period} className="px-3 py-2.5 text-right whitespace-nowrap">
                    {r.period}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Row 1: Category */}
              <tr className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-semibold text-gray-600">
                  {fund.category}
                </td>
                {fund.returnsComparison.map((r) => (
                  <td key={r.period} className="px-3 py-3 text-right font-medium">
                    {r.category !== null ? r.category.toFixed(2) : "-"}
                  </td>
                ))}
              </tr>

              {/* Row 2: Fund */}
              <tr className="bg-emerald-50/30 hover:bg-emerald-50/60 font-bold text-emerald-700">
                <td className="px-4 py-3 font-extrabold text-gray-900">Fund</td>
                {fund.returnsComparison.map((r) => (
                  <td key={r.period} className="px-3 py-3 text-right text-emerald-600 font-bold">
                    {r.fund !== null ? r.fund.toFixed(2) : "-"}
                  </td>
                ))}
              </tr>

              {/* Row 3: Benchmark */}
              <tr className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-semibold text-gray-600">
                  {fund.benchmark}
                </td>
                {fund.returnsComparison.map((r) => (
                  <td
                    key={r.period}
                    className={cn(
                      "px-3 py-3 text-right font-medium",
                      r.benchmark !== null && r.benchmark < 0
                        ? "text-rose-600"
                        : "text-gray-700"
                    )}
                  >
                    {r.benchmark !== null ? r.benchmark.toFixed(2) : "-"}
                  </td>
                ))}
              </tr>

              {/* Row 4: Funds Count */}
              <tr className="hover:bg-gray-50/50 text-gray-500">
                <td className="px-4 py-2.5 font-medium">
                  Number of Funds within Category
                </td>
                {fund.returnsComparison.map((r) => (
                  <td key={r.period} className="px-3 py-2.5 text-right font-medium">
                    {r.fundsCount ?? "-"}
                  </td>
                ))}
              </tr>

              {/* Row 5: Rank */}
              <tr className="hover:bg-gray-50/50 font-bold text-gray-800">
                <td className="px-4 py-2.5 font-bold">Rank within Category</td>
                {fund.returnsComparison.map((r) => (
                  <td key={r.period} className="px-3 py-2.5 text-right font-extrabold text-[#0B63E5]">
                    {r.rank ?? "-"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: Asset Allocation, Portfolio Behavior, Market Cap Donut (Screenshot 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Asset Allocation */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-center text-[#1f2937] tracking-tight mb-4">
            Asset Allocation
          </h3>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#faeed6] bg-[#FFF8EA] text-[#8a5b15] font-bold">
                <th className="px-3 py-2">Asset Class</th>
                <th className="px-3 py-2 text-right">Allocation (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-3 py-2.5 text-gray-600">Equity</td>
                <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                  {fund.assetAllocation.equity.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-gray-600">Debt</td>
                <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                  {fund.assetAllocation.debt.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-gray-600">Cash & Cash Equivalents</td>
                <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                  {fund.assetAllocation.cash.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-gray-600">International</td>
                <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                  {fund.assetAllocation.international.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Card 2: Portfolio Behavior */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-center text-[#1f2937] tracking-tight mb-4">
            Portfolio Behavior
          </h3>
          <table className="w-full text-xs text-left border-collapse">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-3 py-2.5 font-semibold text-gray-600">Mean</td>
                <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                  {fund.portfolioBehavior.mean.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-semibold text-gray-600">Sharpe Ratio</td>
                <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                  {fund.portfolioBehavior.sharpeRatio.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-semibold text-gray-600">Alpha</td>
                <td className="px-3 py-2.5 text-right font-bold text-emerald-600">
                  {fund.portfolioBehavior.alpha.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-semibold text-gray-600">Beta</td>
                <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                  {fund.portfolioBehavior.beta.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-semibold text-gray-600">Standard Deviation</td>
                <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                  {fund.portfolioBehavior.standardDeviation.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-semibold text-gray-600">Sortino</td>
                <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                  {fund.portfolioBehavior.sortino.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Card 3: Market Cap Distribution Donut Chart */}
        <div>
          <MarketCapDonut distribution={fund.marketCapDistribution} />
        </div>
      </div>

      {/* SECTION 6: Yearly Performance (%) Multi-Bar Chart (Screenshot 3) */}
      <div>
        <YearlyPerformanceChart
          data={fund.yearlyPerformance}
          schemeName={fund.fullName}
          benchmarkName={fund.benchmark}
          categoryName={fund.category}
        />
      </div>

      {/* SECTION 7: Standard Performance & Risk-o-meter Gauge (Screenshot 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Standard Performance Table (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
          <div className="bg-gray-50/70 px-6 py-3 border-b border-gray-200 text-center">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Standard Performance
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-gray-700 text-left border-collapse">
              <thead>
                {/* Subheaders matching Screenshot 4 */}
                <tr className="border-b border-[#faeed6] bg-[#FFF8EA] text-[#8a5b15] font-bold text-[11px]">
                  <th className="px-3 py-2" />
                  <th colSpan={2} className="px-3 py-2 text-center border-l border-[#faeed6]">
                    Scheme
                    <div className="text-[9px] font-medium text-gray-500 normal-case">
                      {fund.name}
                    </div>
                  </th>
                  <th colSpan={2} className="px-3 py-2 text-center border-l border-[#faeed6]">
                    Benchmark
                    <div className="text-[9px] font-medium text-gray-500 normal-case">
                      {fund.benchmark}
                    </div>
                  </th>
                  <th colSpan={2} className="px-3 py-2 text-center border-l border-[#faeed6]">
                    Additional Benchmark
                    <div className="text-[9px] font-medium text-gray-500 normal-case">
                      {fund.additionalBenchmark}
                    </div>
                  </th>
                  <th colSpan={2} className="px-3 py-2 text-center border-l border-[#faeed6]">
                    Category Average
                  </th>
                </tr>

                {/* Sub-columns */}
                <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-600 uppercase">
                  <th className="px-3 py-2">Period</th>
                  <th className="px-2 py-2 text-right border-l border-gray-200">Returns</th>
                  <th className="px-2 py-2 text-right">Value of ₹10,000</th>
                  <th className="px-2 py-2 text-right border-l border-gray-200">Returns</th>
                  <th className="px-2 py-2 text-right">Value of ₹10,000</th>
                  <th className="px-2 py-2 text-right border-l border-gray-200">Returns</th>
                  <th className="px-2 py-2 text-right">Value of ₹10,000</th>
                  <th className="px-2 py-2 text-right border-l border-gray-200">Returns</th>
                  <th className="px-2 py-2 text-right">Value of ₹10,000</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fund.standardPerformance.map((row) => (
                  <tr key={row.period} className="hover:bg-gray-50/60">
                    <td className="px-3 py-2.5 font-bold text-gray-900 whitespace-nowrap">
                      {row.period}
                    </td>

                    {/* Scheme */}
                    <td className="px-2 py-2.5 text-right font-bold text-emerald-600 border-l border-gray-100 whitespace-nowrap">
                      {row.schemeReturn.toFixed(2)} %
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium text-gray-900 whitespace-nowrap">
                      ₹{row.schemeValue.toLocaleString("en-IN")}
                    </td>

                    {/* Benchmark */}
                    <td className="px-2 py-2.5 text-right font-semibold text-gray-700 border-l border-gray-100 whitespace-nowrap">
                      {row.benchmarkReturn.toFixed(2)} %
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium text-gray-600 whitespace-nowrap">
                      ₹{row.benchmarkValue.toLocaleString("en-IN")}
                    </td>

                    {/* Addl Benchmark */}
                    <td className="px-2 py-2.5 text-right font-semibold text-gray-700 border-l border-gray-100 whitespace-nowrap">
                      {row.addlBenchmarkReturn.toFixed(2)} %
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium text-gray-600 whitespace-nowrap">
                      ₹{row.addlBenchmarkValue.toLocaleString("en-IN")}
                    </td>

                    {/* Category Avg */}
                    <td className="px-2 py-2.5 text-right font-semibold text-gray-700 border-l border-gray-100 whitespace-nowrap">
                      {row.categoryReturn.toFixed(2)} %
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium text-gray-600 whitespace-nowrap">
                      ₹{row.categoryValue.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Risk-o-meter Gauge (4 cols) */}
        <div className="lg:col-span-4">
          <RiskOMeter
            risk={fund.riskStatus}
            benchmarkName={fund.benchmark}
            benchmarkRisk="Very High"
            beta={fund.portfolioBehavior.beta}
            volatilityFund={fund.portfolioBehavior.standardDeviation}
            fundName={fund.name}
            showBenchmarkComparison={true}
          />
        </div>
      </div>

      {/* SECTION 8: SIP Returns (Monthly SIP of Rs. 10,000) Table (Screenshot 4) */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-gray-50/70 px-6 py-3 border-b border-gray-200 text-center">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            SIP Returns (Monthly SIP of Rs. 10,000)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-gray-700 text-left border-collapse">
            <thead>
              {/* Main Period Headers */}
              <tr className="border-b border-[#faeed6] bg-[#FFF8EA] text-[#8a5b15] font-bold text-[11px]">
                <th className="px-4 py-2 min-w-[200px]" />
                <th colSpan={3} className="px-3 py-2 text-center border-l border-[#faeed6]">
                  3 Year
                </th>
                <th colSpan={3} className="px-3 py-2 text-center border-l border-[#faeed6]">
                  5 Year
                </th>
                <th colSpan={3} className="px-3 py-2 text-center border-l border-[#faeed6]">
                  10 Year
                </th>
                <th colSpan={3} className="px-3 py-2 text-center border-l border-[#faeed6]">
                  15 Year
                </th>
              </tr>

              {/* Sub-column Headers */}
              <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-600 uppercase">
                <th className="px-4 py-2">Scheme Name</th>
                <th className="px-2 py-2 text-right border-l border-gray-200">Invested Amt</th>
                <th className="px-2 py-2 text-right">Current Value</th>
                <th className="px-2 py-2 text-right">XIRR (%)</th>

                <th className="px-2 py-2 text-right border-l border-gray-200">Invested Amt</th>
                <th className="px-2 py-2 text-right">Current Value</th>
                <th className="px-2 py-2 text-right">XIRR (%)</th>

                <th className="px-2 py-2 text-right border-l border-gray-200">Invested Amt</th>
                <th className="px-2 py-2 text-right">Current Value</th>
                <th className="px-2 py-2 text-right">XIRR (%)</th>

                <th className="px-2 py-2 text-right border-l border-gray-200">Invested Amt</th>
                <th className="px-2 py-2 text-right">Current Value</th>
                <th className="px-2 py-2 text-right">XIRR (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fund.sipReturns.map((row) => (
                <tr key={row.schemeName} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                    {row.schemeName}
                  </td>

                  {/* 3 Year */}
                  <td className="px-2 py-3 text-right font-medium text-gray-600 border-l border-gray-100 whitespace-nowrap">
                    {row.y3 ? `₹${row.y3.invested.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="px-2 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                    {row.y3 ? `₹${row.y3.value.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="px-2 py-3 text-right font-extrabold text-emerald-600 whitespace-nowrap">
                    {row.y3 ? `${row.y3.xirr.toFixed(2)}` : "-"}
                  </td>

                  {/* 5 Year */}
                  <td className="px-2 py-3 text-right font-medium text-gray-600 border-l border-gray-100 whitespace-nowrap">
                    {row.y5 ? `₹${row.y5.invested.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="px-2 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                    {row.y5 ? `₹${row.y5.value.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="px-2 py-3 text-right font-extrabold text-emerald-600 whitespace-nowrap">
                    {row.y5 ? `${row.y5.xirr.toFixed(2)}` : "-"}
                  </td>

                  {/* 10 Year */}
                  <td className="px-2 py-3 text-right font-medium text-gray-600 border-l border-gray-100 whitespace-nowrap">
                    {row.y10 ? `₹${row.y10.invested.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="px-2 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                    {row.y10 ? `₹${row.y10.value.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="px-2 py-3 text-right font-extrabold text-emerald-600 whitespace-nowrap">
                    {row.y10 ? `${row.y10.xirr.toFixed(2)}` : "-"}
                  </td>

                  {/* 15 Year */}
                  <td className="px-2 py-3 text-right font-medium text-gray-600 border-l border-gray-100 whitespace-nowrap">
                    {row.y15 ? `₹${row.y15.invested.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="px-2 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                    {row.y15 ? `₹${row.y15.value.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="px-2 py-3 text-right font-extrabold text-emerald-600 whitespace-nowrap">
                    {row.y15 ? `${row.y15.xirr.toFixed(2)}` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Footer Disclaimer */}
      <div className="text-center pt-4 pb-12 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic max-w-3xl mx-auto">
          Mutual fund investments are subject to market risks, read all scheme
          related documents carefully before investing. Past performance is not an
          indicator of future returns.
        </p>
        <p className="text-xs font-bold text-[#0B63E5] mt-2">
          SOLID WEALTH SERVICES | support@solidwealthindia.com
        </p>
      </div>
    </div>
  );
}
