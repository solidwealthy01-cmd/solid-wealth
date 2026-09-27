"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Wallet,
  Scale,
  Plus,
  Trash2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  HelpCircle,
  Download,
  FileText,
  X,
  Award,
} from "lucide-react";
import { exportElementsToPdf } from "@/lib/pdf-export";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Format currency in Indian numbering system
const formatINR = (val: number, maxDecimals = 0) => {
  if (isNaN(val) || val === null || val === undefined) return "0";
  return Number(val).toLocaleString("en-IN", {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
  });
};

export type CalculatorType =
  | "sip"
  | "step_up_sip"
  | "lumpsum"
  | "fd"
  | "ppf"
  | "rd";

export interface StrategyConfig {
  id: string;
  type: CalculatorType;
  title: string;
  color: string;
  monthlyAmount?: number;
  initialInvestment?: number;
  expectedReturn: number;
  years: number;
  stepUpPercent?: number; // for step up sip
}

const STRATEGY_DEFINITIONS: Record<
  CalculatorType,
  {
    name: string;
    description: string;
    defaultReturn: number;
    riskTag: string;
    taxTag: string;
    color: string;
    hasMonthly: boolean;
    hasLumpsum: boolean;
    hasStepUp: boolean;
  }
> = {
  sip: {
    name: "Mutual Fund SIP",
    description: "Disciplined monthly equity mutual fund investment with power of compounding.",
    defaultReturn: 12,
    riskTag: "Moderate - High",
    taxTag: "12.5% LTCG (>₹1.25L)",
    color: "#0B63E5",
    hasMonthly: true,
    hasLumpsum: false,
    hasStepUp: false,
  },
  step_up_sip: {
    name: "Step-Up SIP",
    description: "Monthly SIP that increases by a fixed percentage each year as your income grows.",
    defaultReturn: 12,
    riskTag: "Moderate - High",
    taxTag: "12.5% LTCG (>₹1.25L)",
    color: "#fe9800",
    hasMonthly: true,
    hasLumpsum: false,
    hasStepUp: true,
  },
  lumpsum: {
    name: "Lumpsum Investment",
    description: "One-time upfront investment growing uninterrupted over the full horizon.",
    defaultReturn: 12,
    riskTag: "Moderate - High",
    taxTag: "12.5% LTCG (>₹1.25L)",
    color: "#8B5CF6",
    hasMonthly: false,
    hasLumpsum: true,
    hasStepUp: false,
  },
  fd: {
    name: "Fixed Deposit (FD)",
    description: "Guaranteed fixed interest returns backed by bank deposits.",
    defaultReturn: 7.0,
    riskTag: "Low / Guaranteed",
    taxTag: "Taxed as per Income Slab",
    color: "#10B981",
    hasMonthly: false,
    hasLumpsum: true,
    hasStepUp: false,
  },
  ppf: {
    name: "Public Provident Fund (PPF)",
    description: "Govt-backed 15-year tax-free compounding retirement savings scheme.",
    defaultReturn: 7.1,
    riskTag: "Sovereign / Safe",
    taxTag: "Exempt-Exempt-Exempt (EEE)",
    color: "#EC4899",
    hasMonthly: true,
    hasLumpsum: false,
    hasStepUp: false,
  },
  rd: {
    name: "Recurring Deposit (RD)",
    description: "Bank monthly savings scheme with locked-in guaranteed interest.",
    defaultReturn: 6.8,
    riskTag: "Low / Guaranteed",
    taxTag: "Taxed as per Income Slab",
    color: "#F59E0B",
    hasMonthly: true,
    hasLumpsum: false,
    hasStepUp: false,
  },
};

// Preset comparison recipes
const PRESET_RECIPES: {
  id: string;
  name: string;
  description: string;
  strategies: StrategyConfig[];
}[] = [
  {
    id: "sip_vs_stepup",
    name: "Regular SIP vs Step-Up SIP (+10%)",
    description: "See how increasing your SIP by 10% each year supercharges your wealth accumulation.",
    strategies: [
      {
        id: "1",
        type: "sip",
        title: "Regular SIP (₹10,000/mo)",
        color: "#0B63E5",
        monthlyAmount: 10000,
        expectedReturn: 12,
        years: 15,
      },
      {
        id: "2",
        type: "step_up_sip",
        title: "Step-Up SIP (+10% p.a.)",
        color: "#fe9800",
        monthlyAmount: 10000,
        expectedReturn: 12,
        years: 15,
        stepUpPercent: 10,
      },
    ],
  },
  {
    id: "mf_vs_fd_ppf",
    name: "Mutual Fund SIP vs PPF vs FD",
    description: "Compare equity growth against guaranteed safe debt options like PPF and Fixed Deposits.",
    strategies: [
      {
        id: "1",
        type: "sip",
        title: "Equity Mutual Fund (12%)",
        color: "#0B63E5",
        monthlyAmount: 12500,
        expectedReturn: 12,
        years: 15,
      },
      {
        id: "2",
        type: "ppf",
        title: "PPF Scheme (7.1% EEE)",
        color: "#EC4899",
        monthlyAmount: 12500,
        expectedReturn: 7.1,
        years: 15,
      },
      {
        id: "3",
        type: "fd",
        title: "Fixed Deposit Lumpsum (7%)",
        color: "#10B981",
        initialInvestment: 500000,
        expectedReturn: 7.0,
        years: 15,
      },
    ],
  },
  {
    id: "sip_vs_lumpsum",
    name: "SIP vs Lumpsum (Same Invested Capital)",
    description: "Compare investing ₹50,000/year over 10 years via SIP vs investing ₹5 Lakhs upfront.",
    strategies: [
      {
        id: "1",
        type: "sip",
        title: "Monthly SIP (₹10,000/mo)",
        color: "#0B63E5",
        monthlyAmount: 10000,
        expectedReturn: 12,
        years: 10,
      },
      {
        id: "2",
        type: "lumpsum",
        title: "Upfront Lumpsum (₹5 Lakhs)",
        color: "#8B5CF6",
        initialInvestment: 500000,
        expectedReturn: 12,
        years: 10,
      },
    ],
  },
];

// Calculation helper for each strategy type over time
function calculateStrategyTrajectory(strategy: StrategyConfig) {
  const { type, monthlyAmount = 0, initialInvestment = 0, expectedReturn, years, stepUpPercent = 0 } = strategy;
  const yearlyData: { year: number; invested: number; value: number; gains: number }[] = [];

  const r = expectedReturn / 100;
  const monthlyRate = r / 12;

  let currentInvested = 0;
  let currentValue = 0;

  if (type === "lumpsum" || type === "fd") {
    currentInvested = initialInvestment;
    for (let y = 1; y <= years; y++) {
      // Annual or quarterly compounding
      const val = initialInvestment * Math.pow(1 + r, y);
      yearlyData.push({
        year: y,
        invested: Math.round(initialInvestment),
        value: Math.round(val),
        gains: Math.round(val - initialInvestment),
      });
    }
  } else if (type === "sip" || type === "ppf" || type === "rd") {
    let accumulatedValue = 0;
    let totalInvested = 0;

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        totalInvested += monthlyAmount;
        accumulatedValue = (accumulatedValue + monthlyAmount) * (1 + monthlyRate);
      }
      yearlyData.push({
        year: y,
        invested: Math.round(totalInvested),
        value: Math.round(accumulatedValue),
        gains: Math.round(accumulatedValue - totalInvested),
      });
    }
  } else if (type === "step_up_sip") {
    let accumulatedValue = 0;
    let totalInvested = 0;
    let currentMonthly = monthlyAmount;

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        totalInvested += currentMonthly;
        accumulatedValue = (accumulatedValue + currentMonthly) * (1 + monthlyRate);
      }
      yearlyData.push({
        year: y,
        invested: Math.round(totalInvested),
        value: Math.round(accumulatedValue),
        gains: Math.round(accumulatedValue - totalInvested),
      });
      // Step up monthly installment for next year
      currentMonthly = currentMonthly * (1 + stepUpPercent / 100);
    }
  }

  const final = yearlyData[yearlyData.length - 1] || { invested: 0, value: 0, gains: 0 };
  return {
    yearlyData,
    finalInvested: final.invested,
    finalValue: final.value,
    finalGains: final.gains,
    growthMultiplier: final.invested > 0 ? (final.value / final.invested).toFixed(2) : "1.00",
  };
}

export function CalculatorComparisonView() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [viewMode, setViewMode] = useState<"compare" | "combined">("combined");
  const [strategies, setStrategies] = useState<StrategyConfig[]>([
    {
      id: "1",
      type: "sip",
      title: "Mutual Fund A (e.g. Large Cap)",
      color: "#0B63E5",
      monthlyAmount: 5000,
      expectedReturn: 12,
      years: 2,
    },
    {
      id: "2",
      type: "sip",
      title: "Mutual Fund B (e.g. Mid/Small Cap)",
      color: "#fe9800",
      monthlyAmount: 5000,
      expectedReturn: 15,
      years: 2,
    },
  ]);
  const [syncedYears, setSyncedYears] = useState<number>(2);
  const [isYearsSynced, setIsYearsSynced] = useState<boolean>(true);
  const [chartView, setChartView] = useState<"line" | "bar">("line");

  // Load a preset recipe
  const applyPreset = (presetId: string) => {
    const p = PRESET_RECIPES.find((r) => r.id === presetId);
    if (p) {
      setStrategies(p.strategies);
      if (p.strategies[0]) {
        setSyncedYears(p.strategies[0].years);
      }
    }
  };

  // Update a strategy parameter
  const updateStrategy = (id: string, updates: Partial<StrategyConfig>) => {
    setStrategies((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, ...updates };
        if (isYearsSynced && updates.years !== undefined) {
          setSyncedYears(updates.years);
        }
        return updated;
      })
    );
  };

  // Sync years across all strategies when toggle is on
  const handleSyncYearsChange = (val: number) => {
    setSyncedYears(val);
    setStrategies((prev) => prev.map((s) => ({ ...s, years: val })));
  };

  // Add new strategy (max 4)
  const addStrategy = (type: CalculatorType = "sip") => {
    if (strategies.length >= 4) return;
    const def = STRATEGY_DEFINITIONS[type];
    const newId = String(Date.now());
    const colors = ["#0B63E5", "#fe9800", "#10B981", "#8B5CF6", "#EC4899", "#F59E0B"];
    const color = colors[strategies.length % colors.length];

    const newStrat: StrategyConfig = {
      id: newId,
      type,
      title: `${def.name} #${strategies.length + 1}`,
      color,
      monthlyAmount: def.hasMonthly ? 10000 : undefined,
      initialInvestment: def.hasLumpsum ? 500000 : undefined,
      expectedReturn: def.defaultReturn,
      years: isYearsSynced ? syncedYears : 15,
      stepUpPercent: def.hasStepUp ? 10 : undefined,
    };
    setStrategies([...strategies, newStrat]);
  };

  // Remove strategy (minimum 2)
  const removeStrategy = (id: string) => {
    if (strategies.length <= 2) return;
    setStrategies(strategies.filter((s) => s.id !== id));
  };

  // Compute trajectories and results for each strategy
  const computedStrategies = useMemo(() => {
    return strategies.map((s) => ({
      ...s,
      ...calculateStrategyTrajectory(s),
      definition: STRATEGY_DEFINITIONS[s.type],
    }));
  }, [strategies]);

  // Combined totals across all selected funds/strategies
  const combinedTotals = useMemo(() => {
    let totalInvested = 0;
    let totalValue = 0;
    let totalMonthly = 0;
    let totalInitial = 0;

    computedStrategies.forEach((s) => {
      totalInvested += s.finalInvested;
      totalValue += s.finalValue;
      if (s.monthlyAmount) totalMonthly += s.monthlyAmount;
      if (s.initialInvestment) totalInitial += s.initialInvestment;
    });

    const totalGains = totalValue - totalInvested;
    const overallMultiplier = totalInvested > 0 ? (totalValue / totalInvested).toFixed(2) : "1.00";

    return {
      totalInvested,
      totalValue,
      totalGains,
      totalMonthly,
      totalInitial,
      overallMultiplier,
    };
  }, [computedStrategies]);

  // Combined chart data across all years
  const maxYears = Math.max(...strategies.map((s) => s.years), 1);
  const chartData = useMemo(() => {
    const data: any[] = [];
    for (let y = 1; y <= maxYears; y++) {
      let cumulativeCombinedValue = 0;
      let cumulativeCombinedInvested = 0;
      const row: any = { year: `Year ${y}` };

      computedStrategies.forEach((s) => {
        const point = s.yearlyData.find((d) => d.year === y);
        const val = point ? point.value : 0;
        const inv = point ? point.invested : 0;
        row[`val_${s.id}`] = point ? point.value : null;
        row[`inv_${s.id}`] = point ? point.invested : null;
        cumulativeCombinedValue += val;
        cumulativeCombinedInvested += inv;
      });

      row.combinedValue = cumulativeCombinedValue;
      row.combinedInvested = cumulativeCombinedInvested;
      data.push(row);
    }
    return data;
  }, [maxYears, computedStrategies]);

  // Find winner and comparative insights
  const winner = useMemo(() => {
    if (computedStrategies.length === 0) return null;
    return [...computedStrategies].sort((a, b) => b.finalValue - a.finalValue)[0];
  }, [computedStrategies]);

  const runnerUp = useMemo(() => {
    if (computedStrategies.length < 2) return null;
    return [...computedStrategies].sort((a, b) => b.finalValue - a.finalValue)[1];
  }, [computedStrategies]);

  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const wasPreviewOpen = showPreview;
    if (!wasPreviewOpen) setShowPreview(true);

    setTimeout(async () => {
      try {
        await exportElementsToPdf({
          pageIds: ["compare-pdf-report-page-1", "compare-pdf-report-page-2"],
          filename: `solid_wealth_strategy_comparison_${syncedYears}yr.pdf`,
        });
        setIsDownloading(false);
        if (!wasPreviewOpen) setShowPreview(false);
      } catch (err) {
        console.error("Error generating comparison PDF", err);
        setIsDownloading(false);
      }
    }, 500);
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Top Banner & View Switcher */}
      <div className="rounded-2xl border border-blue-100 bg-[#F0F6FF]/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0B63E5] text-xs font-bold uppercase tracking-wider mb-2">
              <Scale className="size-3.5" /> Multi-Fund & Strategy Calculator
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1a2332]">
              Multi-Fund Portfolio & Strategy Comparison
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Calculate your combined wealth across 2+ mutual funds or compare multiple strategies side-by-side.
            </p>
          </div>

          {/* Controls: View Mode Switcher + PDF Export */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {/* View Mode Switcher */}
            <div className="flex bg-white p-1 rounded-xl border border-blue-200 shadow-2xs">
              <button
                onClick={() => setViewMode("combined")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  viewMode === "combined"
                    ? "bg-[#0B63E5] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Combined Total
              </button>
              <button
                onClick={() => setViewMode("compare")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  viewMode === "compare"
                    ? "bg-[#0B63E5] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Compare Side-by-Side
              </button>
            </div>

            {/* PDF Report Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-white text-gray-700 text-xs font-bold hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
              >
                <FileText size={15} className="text-[#0B63E5]" />
                <span className="hidden sm:inline">View in</span> PDF
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#fe9800] text-white text-xs font-bold hover:bg-[#e58900] transition-colors shadow-2xs disabled:opacity-70 cursor-pointer"
              >
                <Download size={15} />
                <span>{isDownloading ? "Generating..." : "Download PDF"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Portfolio Overview KPI Cards (Shown when in Combined Mode) */}
      {viewMode === "combined" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold text-gray-500">Combined Monthly Investment</p>
            <p className="text-2xl font-black text-[#1a2332] mt-1">
              ₹{formatINR(combinedTotals.totalMonthly)}
              <span className="text-xs text-gray-400 font-normal ml-1">/mo</span>
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Across all {strategies.length} funds</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold text-gray-500">Total Capital Invested</p>
            <p className="text-2xl font-black text-[#1a2332] mt-1">
              ₹{formatINR(combinedTotals.totalInvested)}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Over {syncedYears} Years</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold text-gray-500">Total Compounding Gains</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              +₹{formatINR(combinedTotals.totalGains)}
            </p>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
              +{((combinedTotals.totalGains / Math.max(combinedTotals.totalInvested, 1)) * 100).toFixed(1)}% Total Profit
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-[#F0F6FF] p-5 shadow-xs">
            <p className="text-xs font-bold text-[#0B63E5]">Combined Maturity Corpus</p>
            <p className="text-2xl font-black text-[#0B63E5] mt-1">
              ₹{formatINR(combinedTotals.totalValue)}
            </p>
            <p className="text-[11px] text-blue-800 font-semibold mt-0.5">
              {combinedTotals.overallMultiplier}x Wealth Multiplier
            </p>
          </div>
        </div>
      )}

      {/* Synchronized Timeline Control Strip */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isYearsSynced}
              onChange={(e) => {
                setIsYearsSynced(e.target.checked);
                if (e.target.checked) {
                  handleSyncYearsChange(syncedYears);
                }
              }}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0B63E5]"></div>
          </label>
          <span className="text-xs sm:text-sm font-bold text-gray-800">
            Synchronize Time Horizon for all strategies ({syncedYears} Years)
          </span>
        </div>

        {isYearsSynced && (
          <div className="flex items-center gap-3 w-full sm:w-72">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">1 Yr</span>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={syncedYears}
              onChange={(e) => handleSyncYearsChange(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B63E5]"
            />
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">30 Yrs</span>
            <span className="text-xs font-extrabold text-[#0B63E5] px-2 py-0.5 bg-blue-50 rounded-md border border-blue-100 whitespace-nowrap">
              {syncedYears} Yrs
            </span>
          </div>
        )}

        {strategies.length < 4 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => addStrategy("sip")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0B63E5] hover:bg-[#0952be] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Calculator ({strategies.length}/4)</span>
            </button>
          </div>
        )}
      </div>

      {/* Side-by-Side Strategy Cards */}
      <div
        className={cn(
          "grid gap-4",
          strategies.length === 2 && "grid-cols-1 md:grid-cols-2",
          strategies.length === 3 && "grid-cols-1 md:grid-cols-3",
          strategies.length === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {computedStrategies.map((strat, idx) => {
          const isTopWinner = winner?.id === strat.id && computedStrategies.length > 1;

          return (
            <div
              key={strat.id}
              className={cn(
                "rounded-2xl border bg-white p-5 shadow-xs flex flex-col justify-between relative transition-all",
                isTopWinner ? "border-[#fe9800] ring-2 ring-[#fe9800]/20 shadow-md" : "border-gray-200"
              )}
            >
              {/* Header Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-full shrink-0"
                      style={{ backgroundColor: strat.color }}
                    />
                    <select
                      value={strat.type}
                      onChange={(e) => {
                        const newType = e.target.value as CalculatorType;
                        const def = STRATEGY_DEFINITIONS[newType];
                        updateStrategy(strat.id, {
                          type: newType,
                          title: def.name,
                          expectedReturn: def.defaultReturn,
                          monthlyAmount: def.hasMonthly ? (strat.monthlyAmount || 10000) : undefined,
                          initialInvestment: def.hasLumpsum ? (strat.initialInvestment || 500000) : undefined,
                          stepUpPercent: def.hasStepUp ? 10 : undefined,
                        });
                      }}
                      className="text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none cursor-pointer focus:border-[#0B63E5]"
                    >
                      {Object.entries(STRATEGY_DEFINITIONS).map(([k, def]) => (
                        <option key={k} value={k}>
                          {def.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {strategies.length > 2 && (
                    <button
                      onClick={() => removeStrategy(strat.id)}
                      className="p-1 text-gray-400 hover:text-rose-500 rounded-md transition-colors cursor-pointer"
                      title="Remove calculator"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Strategy Custom Name */}
                <input
                  type="text"
                  value={strat.title}
                  onChange={(e) => updateStrategy(strat.id, { title: e.target.value })}
                  className="w-full text-sm font-extrabold text-[#1a2332] bg-transparent border-b border-dashed border-gray-200 pb-1 mb-4 outline-none focus:border-[#0B63E5]"
                  placeholder="Strategy name"
                />

                {/* Input Fields */}
                <div className="space-y-3.5 pb-4 border-b border-gray-100 text-xs">
                  {/* Monthly Investment */}
                  {strat.definition.hasMonthly && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-500 font-medium">Monthly Outflow:</span>
                        <span className="font-bold text-gray-800">
                          ₹{formatINR(strat.monthlyAmount || 0)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={500}
                        max={200000}
                        step={500}
                        value={strat.monthlyAmount || 10000}
                        onChange={(e) =>
                          updateStrategy(strat.id, { monthlyAmount: Number(e.target.value) })
                        }
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B63E5]"
                      />
                    </div>
                  )}

                  {/* Lumpsum Investment */}
                  {strat.definition.hasLumpsum && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-500 font-medium">Initial Deposit:</span>
                        <span className="font-bold text-gray-800">
                          ₹{formatINR(strat.initialInvestment || 0)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10000}
                        max={10000000}
                        step={10000}
                        value={strat.initialInvestment || 500000}
                        onChange={(e) =>
                          updateStrategy(strat.id, { initialInvestment: Number(e.target.value) })
                        }
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B63E5]"
                      />
                    </div>
                  )}

                  {/* Step-Up Rate */}
                  {strat.definition.hasStepUp && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-500 font-medium">Annual Step-Up (%):</span>
                        <span className="font-bold text-[#fe9800]">
                          +{strat.stepUpPercent || 10}% p.a.
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={25}
                        step={1}
                        value={strat.stepUpPercent || 10}
                        onChange={(e) =>
                          updateStrategy(strat.id, { stepUpPercent: Number(e.target.value) })
                        }
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#fe9800]"
                      />
                    </div>
                  )}

                  {/* Expected Return Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-500 font-medium">Expected Return Rate:</span>
                      <span className="font-bold text-emerald-600">
                        {strat.expectedReturn}% p.a.
                      </span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={25}
                      step={0.1}
                      value={strat.expectedReturn}
                      onChange={(e) =>
                        updateStrategy(strat.id, { expectedReturn: Number(e.target.value) })
                      }
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  {/* Duration (if not synced) */}
                  {!isYearsSynced && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-500 font-medium">Tenure:</span>
                        <span className="font-bold text-gray-800">{strat.years} Years</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={30}
                        step={1}
                        value={strat.years}
                        onChange={(e) =>
                          updateStrategy(strat.id, { years: Number(e.target.value) })
                        }
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B63E5]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* KPI Results Box */}
              <div className="mt-4 space-y-3">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Total Invested:</span>
                    <span className="font-bold text-gray-800">
                      ₹{formatINR(strat.finalInvested)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Wealth Gained:</span>
                    <span className="font-bold text-emerald-600">
                      +₹{formatINR(strat.finalGains)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200/60 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-700">Maturity Corpus:</span>
                    <span className="text-sm sm:text-base font-black text-[#1a2332]">
                      ₹{formatINR(strat.finalValue)}
                    </span>
                  </div>
                </div>

                {/* Multiplier & Tags */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium pt-1">
                  <span className="inline-flex items-center gap-1 font-bold text-[#0B63E5]">
                    <Sparkles className="size-3" /> {strat.growthMultiplier}x Return
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-semibold">
                    {strat.definition.riskTag}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparative Multi-Series Chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-[#1a2332] text-lg">
              Wealth Accumulation Growth Trajectory
            </h3>
            <p className="text-xs text-gray-500">
              Comparative year-by-year corpus value across all selected strategies.
            </p>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setChartView("line")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer",
                chartView === "line"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              Growth Curve (Line)
            </button>
            <button
              onClick={() => setChartView("bar")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer",
                chartView === "bar"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              Milestone Bars
            </button>
          </div>
        </div>

        <div className="w-full min-w-0 h-[320px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              {chartView === "line" ? (
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickFormatter={(val) => {
                      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
                      if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
                      if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
                      return `₹${val}`;
                    }}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => {
                      const strat = computedStrategies.find((s) => s.id === name.replace("val_", ""));
                      return [`₹${formatINR(Number(value))}`, strat?.title || name];
                    }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    formatter={(value) => {
                      const strat = computedStrategies.find((s) => s.id === value.replace("val_", ""));
                      return <span className="text-xs font-semibold text-gray-700">{strat?.title}</span>;
                    }}
                  />
                  {computedStrategies.map((strat) => (
                    <Line
                      key={strat.id}
                      type="monotone"
                      dataKey={`val_${strat.id}`}
                      name={`val_${strat.id}`}
                      stroke={strat.color}
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickFormatter={(val) => {
                      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
                      if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
                      if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
                      return `₹${val}`;
                    }}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => {
                      const strat = computedStrategies.find((s) => s.id === name.replace("val_", ""));
                      return [`₹${formatINR(Number(value))}`, strat?.title || name];
                    }}
                  />
                  <Legend
                    formatter={(value) => {
                      const strat = computedStrategies.find((s) => s.id === value.replace("val_", ""));
                      return <span className="text-xs font-semibold text-gray-700">{strat?.title}</span>;
                    }}
                  />
                  {computedStrategies.map((strat) => (
                    <Bar
                      key={strat.id}
                      dataKey={`val_${strat.id}`}
                      name={`val_${strat.id}`}
                      fill={strat.color}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-gray-50/50 rounded-xl animate-pulse" />
          )}
        </div>
      </div>

      {/* Comparative Summary & Decision Matrix */}
      {winner && runnerUp && (
        <div className="rounded-2xl border border-emerald-100 bg-[#F0FDF4] p-5 sm:p-6 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="size-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-[#1a2332] text-base">
                Strategy Insight & Wealth Leader: <span className="text-emerald-700">{winner.title}</span>
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Over your {winner.years}-year timeframe, <strong>{winner.title}</strong> produces the largest wealth corpus of{" "}
                <span className="font-bold text-emerald-800">₹{formatINR(winner.finalValue)}</span>, which is{" "}
                <span className="font-bold text-emerald-800">
                  ₹{formatINR(Math.abs(winner.finalValue - runnerUp.finalValue))} (+
                  {(
                    ((winner.finalValue - runnerUp.finalValue) / Math.max(runnerUp.finalValue, 1)) *
                    100
                  ).toFixed(1)}
                  %)
                </span>{" "}
                more than {runnerUp.title}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-PAGE PDF PREVIEW MODAL */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 print:p-0 print:bg-white print:relative print:block print:inset-auto"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-5xl w-full h-[95vh] sm:h-[88vh] overflow-hidden flex flex-col print:h-auto print:overflow-visible print:w-full print:max-w-none print:shadow-none print:rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border-b print:hidden">
              <div>
                <h3 className="font-bold text-xl text-[#1a2332]">Strategy Comparison Report Preview (2 Pages)</h3>
                <p className="text-xs text-gray-500">
                  Page 1: Executive Summary & Strategy Rankings • Page 2: Mathematical Algorithms, Tax Insights & Trajectory Schedule
                </p>
              </div>
              <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#fe9800] text-white text-sm font-bold hover:bg-[#e58900] transition-colors shadow-md shadow-orange-500/20 disabled:opacity-70 cursor-pointer"
                >
                  <Download size={16} /> {isDownloading ? "Generating..." : "Save 2-Page PDF"}
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-10 sm:w-9 h-10 sm:h-9 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-500 font-bold border border-gray-200 sm:border-transparent cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Preview Area for Both Pages */}
            <div className="flex-1 overflow-auto bg-gray-100/80 p-4 sm:p-8 flex flex-col items-center gap-8 print:bg-white print:p-0">
              {/* PAGE 1: EXECUTIVE SUMMARY */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 print:hidden">
                  Page 1 of 2: Executive Summary & Comparison
                </span>
                <div
                  id="compare-pdf-report-page-1"
                  className="w-[794px] min-w-[794px] h-[1123px] bg-white shadow-xl print:shadow-none relative overflow-hidden flex-shrink-0"
                >
                  <img src="/Printable.svg" alt="Template Header" className="w-full h-auto object-cover opacity-80" />

                  <div className="absolute top-0 left-0 w-full h-full pt-[220px] px-14 flex flex-col pb-20 justify-between">
                    <div>
                      {/* Title Header */}
                      <div className="flex justify-between items-end border-b-2 border-gray-100 pb-4 mb-4">
                        <div>
                          <span className="text-xs font-bold tracking-widest text-[#fe9800] uppercase">
                            Solid Wealth Financial Report
                          </span>
                          <h1 className="text-2xl font-black text-[#1a2332]">
                            Strategy Comparison & Portfolio Analysis
                          </h1>
                        </div>
                        <span className="text-xs font-bold text-gray-400">Page 1 of 2</span>
                      </div>

                      {/* Horizon & Mode Banner */}
                      <div className="bg-[#F0F6FF] border border-blue-200 rounded-xl px-4 py-2.5 mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#0B63E5] uppercase tracking-wider">Evaluation Horizon:</span>
                          <span className="text-xs text-gray-800 font-bold">{syncedYears} Years</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-500 font-semibold">Strategies Analyzed:</span>
                          <span className="text-xs font-bold text-gray-800">{strategies.length} Distinct Portfolios</span>
                        </div>
                        {winner && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            <span>Top Performer:</span>
                            <span>{winner.title}</span>
                          </div>
                        )}
                      </div>

                      {/* 4 Executive Summary KPI Cards */}
                      <div className="grid grid-cols-4 gap-3 mb-6">
                        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-2xs">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Combined Outlay</p>
                          <p className="text-base font-black text-[#1a2332] mt-0.5">₹{formatINR(combinedTotals.totalInvested)}</p>
                          <p className="text-[9px] text-gray-500 mt-0.5">Total capital invested</p>
                        </div>

                        <div className="rounded-xl border border-blue-200 bg-[#F0F6FF] p-3 text-center shadow-2xs">
                          <p className="text-[10px] font-bold text-[#0B63E5] uppercase tracking-wider">Top Strategy Corpus</p>
                          <p className="text-base font-black text-[#0B63E5] mt-0.5">₹{formatINR(winner?.finalValue || 0)}</p>
                          <p className="text-[9px] text-blue-700 mt-0.5">{winner?.growthMultiplier}x Capital Multiplier</p>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-center shadow-2xs">
                          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Top Strategy Gains</p>
                          <p className="text-base font-black text-emerald-700 mt-0.5">+₹{formatINR(winner?.finalGains || 0)}</p>
                          <p className="text-[9px] text-emerald-800 mt-0.5">
                            +{(((winner?.finalGains || 0) / Math.max(winner?.finalInvested || 1, 1)) * 100).toFixed(1)}% Gain on Capital
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-2xs">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Wealth Spread Gap</p>
                          <p className="text-base font-black text-orange-600 mt-0.5">
                            {runnerUp ? `₹${formatINR(Math.abs((winner?.finalValue || 0) - runnerUp.finalValue))}` : "N/A"}
                          </p>
                          <p className="text-[9px] text-gray-500 mt-0.5">Winner vs Runner-Up</p>
                        </div>
                      </div>

                      {/* Side-by-Side Detailed Strategy Comparison Table */}
                      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-2xs">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                            Comparative Strategy Performance Breakdown
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">Over {syncedYears} Year Horizon</span>
                        </div>
                        <table className="w-full text-xs text-left">
                          <thead className="bg-gray-50/60 text-gray-500 font-bold border-b border-gray-100 text-[10px] uppercase">
                            <tr>
                              <th className="py-2.5 px-3">Strategy Name</th>
                              <th className="py-2.5 px-3 text-right">Contribution Input</th>
                              <th className="py-2.5 px-3 text-center">CAGR %</th>
                              <th className="py-2.5 px-3 text-right">Total Invested</th>
                              <th className="py-2.5 px-3 text-right">Compounding Gains</th>
                              <th className="py-2.5 px-3 text-right font-black">Final Corpus</th>
                              <th className="py-2.5 px-3 text-center">Multiple</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-800">
                            {computedStrategies.map((s) => {
                              const isTop = winner && s.id === winner.id;
                              return (
                                <tr key={s.id} className={isTop ? "bg-amber-50/40 font-semibold" : "bg-white"}>
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-2">
                                      <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                      <span className="font-bold text-[#1a2332]">{s.title}</span>
                                      {isTop && (
                                        <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-extrabold rounded">
                                          LEADER
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 text-right text-gray-600">
                                    {s.monthlyAmount ? `₹${formatINR(s.monthlyAmount)}/mo` : `₹${formatINR(s.initialInvestment || 0)}`}
                                    {s.stepUpPercent ? ` (+${s.stepUpPercent}%)` : ""}
                                  </td>
                                  <td className="py-2.5 px-3 text-center font-bold text-gray-700">{s.expectedReturn}%</td>
                                  <td className="py-2.5 px-3 text-right text-gray-600">₹{formatINR(s.finalInvested)}</td>
                                  <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">+₹{formatINR(s.finalGains)}</td>
                                  <td className="py-2.5 px-3 text-right font-black text-[#1a2332]">₹{formatINR(s.finalValue)}</td>
                                  <td className="py-2.5 px-3 text-center font-bold text-[#0B63E5]">{s.growthMultiplier}x</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Visual Relative Wealth Growth Bar Cards */}
                      <div className="bg-[#FFFDF7] border border-orange-200/80 rounded-xl p-4 shadow-2xs">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block mb-3">
                          Relative Wealth Creation Comparison
                        </span>
                        <div className="space-y-3">
                          {computedStrategies.map((s) => {
                            const maxVal = Math.max(...computedStrategies.map((cs) => cs.finalValue), 1);
                            const widthPercent = Math.max(15, (s.finalValue / maxVal) * 100);
                            return (
                              <div key={s.id} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="font-bold text-gray-800">{s.title}</span>
                                  <span className="font-extrabold text-[#1a2332]">
                                    ₹{formatINR(s.finalValue)} ({s.growthMultiplier}x)
                                  </span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                      width: `${widthPercent}%`,
                                      backgroundColor: s.color,
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Executive Decision Takeaway */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-[10px] text-gray-600 flex items-start gap-2">
                      <span className="font-bold text-[#1a2332] uppercase shrink-0">Strategic Takeaway:</span>
                      <span>
                        {winner
                          ? `${winner.title} achieves the greatest terminal corpus of ₹${formatINR(winner.finalValue)} over ${syncedYears} years. Disciplined regular investing combined with annual compounding provides superior risk-adjusted wealth creation.`
                          : "Review comparative metrics above to determine optimal asset allocation for your goal horizon."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAGE 2: ALGORITHM & GROWTH TRAJECTORY */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 print:hidden">
                  Page 2 of 2: Algorithm, Calculation Details & Schedule
                </span>
                <div
                  id="compare-pdf-report-page-2"
                  className="w-[794px] min-w-[794px] h-[1123px] bg-white shadow-xl print:shadow-none relative overflow-hidden flex-shrink-0"
                >
                  <img
                    src="/Printable.svg"
                    alt="Template Background"
                    className="w-full h-auto object-cover opacity-80 absolute top-0 left-0 pointer-events-none"
                  />

                  <div className="relative z-10 w-full h-full pt-[220px] px-14 flex flex-col pb-20 justify-between">
                    <div>
                      {/* Header */}
                      <div className="flex justify-between items-end border-b-2 border-gray-100 pb-3 mb-3">
                        <div>
                          <span className="text-[10px] font-bold tracking-widest text-[#fe9800] uppercase">
                            Calculation Methodology & Details
                          </span>
                          <h2 className="text-2xl font-black text-[#1a2332]">Strategy Algorithm & Growth Trajectory</h2>
                        </div>
                        <span className="text-xs font-bold text-gray-400">Page 2 of 2</span>
                      </div>

                      {/* ALGORITHM DEFINITIONS & FORMULAS CARD */}
                      <div className="bg-[#FFFDF4] border border-orange-100 rounded-xl p-3.5 mb-3 shadow-2xs">
                        <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-orange-100/70">
                          <span className="text-[11px] font-bold text-[#1a2332] uppercase tracking-wider">
                            Mathematical Formulation & Compounding Engine
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#fe9800] bg-white px-2 py-0.5 rounded border border-orange-200">
                            Monthly Compounding Annuity Models
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-700 mb-2">
                          <div className="bg-white/80 p-2 rounded border border-orange-100">
                            <span className="font-bold text-[#0B63E5] block mb-0.5">Mutual Fund SIP Formula:</span>
                            <code className="font-mono text-[9.5px] text-gray-800">
                              M = P × [((1 + i)^n - 1) / i] × (1 + i)
                            </code>
                            <p className="text-[8.5px] text-gray-500 mt-1">
                              Where P = monthly SIP, i = monthly return rate (r/12), n = total months.
                            </p>
                          </div>

                          <div className="bg-white/80 p-2 rounded border border-orange-100">
                            <span className="font-bold text-[#fe9800] block mb-0.5">Step-Up SIP Formula:</span>
                            <code className="font-mono text-[9.5px] text-gray-800">
                              M_total = Σ P_y × [((1 + i)^12 - 1) / i] × (1+r)^(N-y)
                            </code>
                            <p className="text-[8.5px] text-gray-500 mt-1">
                              Where P_y increases annually by step-up rate g% (P_y = P_0 × (1+g)^(y-1)).
                            </p>
                          </div>
                        </div>

                        <div className="text-[9.5px] text-gray-600 space-y-0.5">
                          <span className="font-bold text-gray-700 uppercase tracking-wider text-[9px] block">
                            Calculation Mechanics:
                          </span>
                          <p>1. Geometric compounding calculated month-by-month at constant annualized expected CAGR.</p>
                          <p>2. Cash flows assumed at the start of each periodic cycle (annuity due) maximizing compounding.</p>
                          <p>3. Nominal returns reflect pre-tax values; see taxation KPI for net realization guidance.</p>
                        </div>
                      </div>

                      {/* 4 Analytical KPI Cards */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="border border-gray-200 bg-gray-50 rounded-xl p-2 text-center">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Disciplined Growth</p>
                          <p className="text-sm font-black text-[#1a2332]">
                            {winner ? `₹${formatINR(winner.finalValue / Math.max(syncedYears * 12, 1))}/mo` : "-"}
                          </p>
                          <p className="text-[8.5px] text-gray-500 mt-0.5">Avg corpus growth rate</p>
                        </div>

                        <div className="border border-orange-200 bg-[#FFFDF4] rounded-xl p-2 text-center">
                          <p className="text-[9px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">Opportunity Cost</p>
                          <p className="text-sm font-black text-orange-600">
                            {runnerUp ? `₹${formatINR(Math.abs((winner?.finalValue || 0) - runnerUp.finalValue))}` : "₹0"}
                          </p>
                          <p className="text-[8.5px] text-gray-500 mt-0.5">Gained by picking top fund</p>
                        </div>

                        <div className="border border-gray-200 bg-gray-50 rounded-xl p-2 text-center">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Tax Efficiency</p>
                          <p className="text-sm font-black text-emerald-700">12.5% LTCG</p>
                          <p className="text-[8.5px] text-gray-500 mt-0.5">On equity gains &gt; ₹1.25L</p>
                        </div>

                        <div className="border border-gray-200 bg-gray-50 rounded-xl p-2 text-center">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Inflation Factor (6%)</p>
                          <p className="text-sm font-black text-[#0B63E5]">
                            {winner ? `₹${formatINR(winner.finalValue / Math.pow(1.06, syncedYears))}` : "-"}
                          </p>
                          <p className="text-[8.5px] text-gray-500 mt-0.5">Real purchasing power</p>
                        </div>
                      </div>

                      {/* Growth Trajectory Schedule Table */}
                      <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
                        <div className="bg-gray-50 px-3.5 py-1.5 border-b border-gray-200 flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                            Year-by-Year Growth Trajectory Comparison
                          </span>
                          <span className="text-[9.5px] text-gray-500">Corpus Balance (₹)</span>
                        </div>
                        <table className="w-full text-[10.5px] text-left">
                          <thead className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100 text-[9.5px] uppercase">
                            <tr>
                              <th className="py-2 px-3">Timeline</th>
                              {computedStrategies.map((s) => (
                                <th key={s.id} className="py-2 px-3 text-right">
                                  {s.title}
                                </th>
                              ))}
                              {computedStrategies.length >= 2 && (
                                <th className="py-2 px-3 text-right font-black text-[#fe9800]">Outperformance</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-800">
                            {/* Sample milestone years up to syncedYears */}
                            {Array.from(new Set([1, 2, 3, 5, 7, 10, 15, 20, 25, 30].filter((y) => y <= syncedYears).concat(syncedYears)))
                              .sort((a, b) => a - b)
                              .map((yr) => {
                                const vals = computedStrategies.map((s) => {
                                  const pt = s.yearlyData.find((d) => d.year === yr);
                                  return pt ? pt.value : 0;
                                });
                                const maxVal = Math.max(...vals);
                                const minVal = Math.min(...vals);
                                const diff = maxVal - minVal;

                                return (
                                  <tr key={yr} className={yr === syncedYears ? "bg-amber-50/50 font-bold" : "hover:bg-gray-50/50"}>
                                    <td className="py-2 px-3 font-semibold text-gray-800">Year {yr}</td>
                                    {computedStrategies.map((s) => {
                                      const pt = s.yearlyData.find((d) => d.year === yr);
                                      return (
                                        <td key={s.id} className="py-2 px-3 text-right font-medium">
                                          ₹{formatINR(pt ? pt.value : 0)}
                                        </td>
                                      );
                                    })}
                                    {computedStrategies.length >= 2 && (
                                      <td className="py-2 px-3 text-right font-bold text-emerald-600">
                                        +₹{formatINR(diff)}
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Disclaimer Note */}
                    <div className="border-t border-gray-200 pt-2 text-[8.5px] text-gray-400 text-center">
                      Mutual Fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future returns. Solid Wealth Services.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
