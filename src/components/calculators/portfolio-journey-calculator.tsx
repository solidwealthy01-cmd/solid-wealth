"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sliders,
  PlayCircle,
  BarChart2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Currency formatter
const formatINR = (val: number, maxDecimals = 0) => {
  if (isNaN(val) || val === null || val === undefined) return "0";
  return Number(val).toLocaleString("en-IN", {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
  });
};

export type LegType = "sip" | "step_up_sip" | "lumpsum" | "swp";

export interface PortfolioStream {
  id: string;
  name: string;
  type: LegType;
  startYear: number; // 1 = Year 1 (from starting), 3 = from Year 3, etc.
  durationYears: number; // Active for N years
  monthlyAmount?: number;
  lumpsumAmount?: number;
  expectedReturn: number;
  stepUpPercent?: number;
  color: string;
}

const STREAM_TYPE_INFO: Record<
  LegType,
  {
    label: string;
    badgeBg: string;
    icon: any;
    desc: string;
  }
> = {
  sip: {
    label: "Monthly SIP",
    badgeBg: "bg-blue-50 text-[#0B63E5] border-blue-200",
    icon: TrendingUp,
    desc: "Fixed monthly deposit during the specified years.",
  },
  step_up_sip: {
    label: "Step-Up SIP",
    badgeBg: "bg-amber-50 text-[#b45309] border-amber-200",
    icon: ArrowUpRight,
    desc: "Monthly SIP that increases by a fixed percentage each year.",
  },
  lumpsum: {
    label: "Lumpsum Deposit",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Wallet,
    desc: "One-time lump sum added at the start of specified year.",
  },
  swp: {
    label: "Monthly SWP (Withdrawal)",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
    icon: ArrowDownRight,
    desc: "Monthly cash withdrawal during the specified years.",
  },
};

const COLOR_PALETTE = [
  "#0B63E5",
  "#fe9800",
  "#8B5CF6",
  "#10B981",
  "#EC4899",
  "#F59E0B",
  "#06B6D4",
];

const PRESET_PORTFOLIOS: {
  id: string;
  title: string;
  description: string;
  initialCorpus: number;
  streams: PortfolioStream[];
}[] = [
  {
    id: "multi_fund_lifecycle",
    title: "2 Funds for 2 Yrs → Lumpsum (Yr 3) → SWP (Yr 5)",
    description: "Invest in 2 SIP mutual funds simultaneously for 2 years, add a lump sum in Year 3, and draw SWP pension in Year 5.",
    initialCorpus: 0,
    streams: [
      {
        id: "s1",
        name: "Fund 1: Large Cap SIP",
        type: "sip",
        startYear: 1,
        durationYears: 2,
        monthlyAmount: 10000,
        expectedReturn: 12,
        color: "#0B63E5",
      },
      {
        id: "s2",
        name: "Fund 2: Mid/Small Cap SIP",
        type: "sip",
        startYear: 1,
        durationYears: 2,
        monthlyAmount: 5000,
        expectedReturn: 15,
        color: "#fe9800",
      },
      {
        id: "s3",
        name: "Lumpsum Bonus Top-up",
        type: "lumpsum",
        startYear: 3,
        durationYears: 1,
        lumpsumAmount: 200000,
        expectedReturn: 12,
        color: "#8B5CF6",
      },
      {
        id: "s4",
        name: "Monthly SWP Pension",
        type: "swp",
        startYear: 5,
        durationYears: 2,
        monthlyAmount: 25000,
        expectedReturn: 9,
        color: "#E11D48",
      },
    ],
  },
  {
    id: "parallel_sip_stepup",
    title: "Core Fund SIP + Satellite Step-Up Fund",
    description: "Run a steady core SIP from Year 1 to 5, alongside an aggressive Step-up growth fund.",
    initialCorpus: 50000,
    streams: [
      {
        id: "s1",
        name: "Core Flexi Cap SIP (5 Yrs)",
        type: "sip",
        startYear: 1,
        durationYears: 5,
        monthlyAmount: 10000,
        expectedReturn: 12,
        color: "#0B63E5",
      },
      {
        id: "s2",
        name: "Satellite Step-Up SIP (Yr 2 to 5)",
        type: "step_up_sip",
        startYear: 2,
        durationYears: 4,
        monthlyAmount: 8000,
        stepUpPercent: 10,
        expectedReturn: 14,
        color: "#fe9800",
      },
    ],
  },
];

export function PortfolioJourneyCalculator() {
  const [initialCorpus, setInitialCorpus] = useState<number>(0);
  const [streams, setStreams] = useState<PortfolioStream[]>(PRESET_PORTFOLIOS[0].streams);
  const [horizonYears, setHorizonYears] = useState<number>(6);

  // Maximum timeline duration
  const autoCalculatedMaxYear = useMemo(() => {
    let maxEnd = 0;
    streams.forEach((s) => {
      const end = s.startYear + s.durationYears - 1;
      if (end > maxEnd) maxEnd = end;
    });
    return Math.max(maxEnd, 1);
  }, [streams]);

  const totalTimelineYears = Math.max(horizonYears, autoCalculatedMaxYear);

  // Add new stream/fund
  const addStream = (type: LegType = "sip") => {
    if (streams.length >= 6) return;
    const newId = `s_${Date.now()}`;
    const nextStartYear = streams.length > 0 ? streams[streams.length - 1].startYear : 1;
    const color = COLOR_PALETTE[streams.length % COLOR_PALETTE.length];

    const newStream: PortfolioStream = {
      id: newId,
      name: `Mutual Fund #${streams.length + 1}`,
      type,
      startYear: nextStartYear,
      durationYears: 2,
      monthlyAmount: type === "swp" ? 20000 : 10000,
      lumpsumAmount: type === "lumpsum" ? 100000 : 0,
      stepUpPercent: type === "step_up_sip" ? 10 : 0,
      expectedReturn: 12,
      color,
    };
    setStreams([...streams, newStream]);
  };

  // Remove stream
  const removeStream = (id: string) => {
    if (streams.length <= 1) return;
    setStreams(streams.filter((s) => s.id !== id));
  };

  // Update a stream
  const updateStream = (id: string, updates: Partial<PortfolioStream>) => {
    setStreams((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  // Apply preset
  const applyPreset = (presetId: string) => {
    const p = PRESET_PORTFOLIOS.find((preset) => preset.id === presetId);
    if (p) {
      setInitialCorpus(p.initialCorpus);
      setStreams(p.streams);
    }
  };

  // Simulation Engine: Month-by-month multi-stream cash flows & compounding
  const simulation = useMemo(() => {
    let runningPortfolioBalance = initialCorpus;
    let totalInvested = initialCorpus;
    let totalWithdrawn = 0;

    const yearlyBreakdown: {
      year: number;
      label: string;
      startBalance: number;
      inflows: number;
      outflows: number;
      gains: number;
      endBalance: number;
      activeStreamNames: string[];
    }[] = [];

    const chartTrajectory: {
      year: number;
      label: string;
      portfolioValue: number;
      cumulativeInvested: number;
      cumulativeWithdrawn: number;
    }[] = [
      {
        year: 0,
        label: "Start",
        portfolioValue: Math.round(initialCorpus),
        cumulativeInvested: Math.round(initialCorpus),
        cumulativeWithdrawn: 0,
      },
    ];

    for (let y = 1; y <= totalTimelineYears; y++) {
      const yearStartBalance = runningPortfolioBalance;
      let yearInflows = 0;
      let yearOutflows = 0;
      const activeStreamNames: string[] = [];

      // Find active streams during this year
      const activeStreams = streams.filter(
        (s) => y >= s.startYear && y < s.startYear + s.durationYears
      );

      activeStreams.forEach((s) => {
        if (!activeStreamNames.includes(s.name)) activeStreamNames.push(s.name);
      });

      // Calculate weighted monthly rate for the active portfolio
      let totalMonthlyDeposit = 0;
      let totalMonthlyWithdrawal = 0;
      let weightedReturnSum = 0;
      let weightCount = 0;

      activeStreams.forEach((s) => {
        weightedReturnSum += s.expectedReturn;
        weightCount += 1;

        if (s.type === "lumpsum") {
          // Lumpsum deposited at beginning of its startYear
          if (y === s.startYear && s.lumpsumAmount) {
            runningPortfolioBalance += s.lumpsumAmount;
            totalInvested += s.lumpsumAmount;
            yearInflows += s.lumpsumAmount;
          }
        } else if (s.type === "sip" && s.monthlyAmount) {
          totalMonthlyDeposit += s.monthlyAmount;
        } else if (s.type === "step_up_sip" && s.monthlyAmount) {
          const stepUpYears = y - s.startYear;
          const currentMonthly =
            s.monthlyAmount * Math.pow(1 + (s.stepUpPercent || 0) / 100, stepUpYears);
          totalMonthlyDeposit += currentMonthly;
        } else if (s.type === "swp" && s.monthlyAmount) {
          totalMonthlyWithdrawal += s.monthlyAmount;
        }
      });

      const avgReturnRate = weightCount > 0 ? weightedReturnSum / weightCount : 12;
      const monthlyRate = avgReturnRate / 100 / 12;

      // Simulate 12 months for this year
      for (let m = 1; m <= 12; m++) {
        // Inflows (SIPs)
        if (totalMonthlyDeposit > 0) {
          runningPortfolioBalance += totalMonthlyDeposit;
          totalInvested += totalMonthlyDeposit;
          yearInflows += totalMonthlyDeposit;
        }

        // Outflows (SWPs)
        if (totalMonthlyWithdrawal > 0) {
          const actualWithdrawal = Math.min(totalMonthlyWithdrawal, runningPortfolioBalance);
          runningPortfolioBalance = Math.max(0, runningPortfolioBalance - actualWithdrawal);
          totalWithdrawn += actualWithdrawal;
          yearOutflows += actualWithdrawal;
        }

        // Monthly Compounding Interest
        runningPortfolioBalance = runningPortfolioBalance * (1 + monthlyRate);
      }

      const yearEndBalance = runningPortfolioBalance;
      const yearGains = yearEndBalance - yearStartBalance - yearInflows + yearOutflows;

      yearlyBreakdown.push({
        year: y,
        label: `Year ${y}`,
        startBalance: Math.round(yearStartBalance),
        inflows: Math.round(yearInflows),
        outflows: Math.round(yearOutflows),
        gains: Math.round(yearGains),
        endBalance: Math.round(yearEndBalance),
        activeStreamNames,
      });

      chartTrajectory.push({
        year: y,
        label: `Year ${y}`,
        portfolioValue: Math.round(runningPortfolioBalance),
        cumulativeInvested: Math.round(totalInvested),
        cumulativeWithdrawn: Math.round(totalWithdrawn),
      });
    }

    const netGains = runningPortfolioBalance + totalWithdrawn - totalInvested;

    return {
      finalCorpus: Math.round(runningPortfolioBalance),
      totalInvested: Math.round(totalInvested),
      totalWithdrawn: Math.round(totalWithdrawn),
      netGains: Math.round(netGains),
      chartTrajectory,
      yearlyBreakdown,
    };
  }, [initialCorpus, streams, totalTimelineYears]);

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Top Banner & Presets */}
      <div className="rounded-2xl border border-emerald-100 bg-[#F0FDF4]/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="size-3.5" /> Multi-Fund Timeline & Lifecycle Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1a2332]">
              Multi-Fund & Multi-Phase Timeline Calculator
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Declare multiple mutual funds running <strong>simultaneously</strong> or <strong>staggered in sequence</strong> with flexible start and end years.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Presets:</span>
            {PRESET_PORTFOLIOS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 text-xs font-bold text-emerald-900 shadow-2xs transition-all cursor-pointer"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500">Total Capital Invested</p>
          <p className="text-2xl font-black text-[#1a2332] mt-1">
            ₹{formatINR(simulation.totalInvested)}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Across all active funds</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500">Total SWP Withdrawn</p>
          <p className="text-2xl font-black text-rose-600 mt-1">
            ₹{formatINR(simulation.totalWithdrawn)}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Monthly income drawn</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500">Net Compounding Gains</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            +₹{formatINR(simulation.netGains)}
          </p>
          <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
            +{((simulation.netGains / Math.max(simulation.totalInvested, 1)) * 100).toFixed(1)}% Return
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-[#F0FDF4] p-5 shadow-xs">
          <p className="text-xs font-bold text-emerald-800">Final Portfolio Value</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            ₹{formatINR(simulation.finalCorpus)}
          </p>
          <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
            At Year {totalTimelineYears} Completion
          </p>
        </div>
      </div>

      {/* Main Grid: Fund Stream Configuration + Visual Timeline & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Configurable Mutual Fund Streams */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#1a2332] flex items-center gap-2">
              <Sliders className="size-4 text-[#10B981]" />
              <span>Configured Funds & Phases ({streams.length})</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Total Horizon:</span>
              <select
                value={totalTimelineYears}
                onChange={(e) => setHorizonYears(Number(e.target.value))}
                className="text-xs font-bold text-gray-800 bg-white border border-gray-200 rounded-md px-2 py-1 outline-none cursor-pointer focus:border-[#10B981]"
              >
                {[2, 3, 5, 7, 10, 15, 20, 25, 30].map((y) => (
                  <option key={y} value={y}>
                    {y} Years
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {streams.map((stream, idx) => {
              const info = STREAM_TYPE_INFO[stream.type];
              const endYear = stream.startYear + stream.durationYears - 1;

              return (
                <div
                  key={stream.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs space-y-3.5 relative"
                >
                  {/* Stream Top Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 rounded-full shrink-0"
                        style={{ backgroundColor: stream.color }}
                      />
                      <select
                        value={stream.type}
                        onChange={(e) => {
                          const newType = e.target.value as LegType;
                          updateStream(stream.id, {
                            type: newType,
                            name: `Fund #${idx + 1} (${STREAM_TYPE_INFO[newType].label})`,
                            monthlyAmount: newType === "swp" ? 20000 : 10000,
                            lumpsumAmount: newType === "lumpsum" ? 100000 : 0,
                            stepUpPercent: newType === "step_up_sip" ? 10 : 0,
                          });
                        }}
                        className="text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none cursor-pointer focus:border-[#10B981]"
                      >
                        {Object.entries(STREAM_TYPE_INFO).map(([k, d]) => (
                          <option key={k} value={k}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Active tenure pill */}
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
                        Active: Year {stream.startYear} to Year {endYear} ({stream.durationYears} Yrs)
                      </span>

                      {streams.length > 1 && (
                        <button
                          onClick={() => removeStream(stream.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                          title="Remove stream"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Fund Name Input */}
                  <input
                    type="text"
                    value={stream.name}
                    onChange={(e) => updateStream(stream.id, { name: e.target.value })}
                    className="w-full text-xs sm:text-sm font-extrabold text-[#1a2332] bg-transparent border-b border-dashed border-gray-200 pb-1 outline-none focus:border-[#10B981]"
                    placeholder="Fund / Stream label"
                  />

                  {/* Flexible Timeline Controls: Starts At & Duration */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    {/* Starts At Year */}
                    <div>
                      <span className="text-gray-500 font-medium block mb-1">Starts At:</span>
                      <select
                        value={stream.startYear}
                        onChange={(e) =>
                          updateStream(stream.id, { startYear: Number(e.target.value) })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 font-bold text-gray-800 outline-none cursor-pointer focus:border-[#10B981]"
                      >
                        {Array.from({ length: 15 }, (_, i) => i + 1).map((yr) => (
                          <option key={yr} value={yr}>
                            {yr === 1 ? "Year 1 (From Start)" : `Year ${yr} (After ${yr - 1} Yrs)`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Active Duration */}
                    <div>
                      <span className="text-gray-500 font-medium block mb-1">Tenure:</span>
                      <select
                        value={stream.durationYears}
                        onChange={(e) =>
                          updateStream(stream.id, { durationYears: Number(e.target.value) })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 font-bold text-gray-800 outline-none cursor-pointer focus:border-[#10B981]"
                      >
                        {Array.from({ length: 15 }, (_, i) => i + 1).map((dur) => (
                          <option key={dur} value={dur}>
                            {dur} {dur === 1 ? "Year" : "Years"}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Expected Return Rate */}
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-gray-500 font-medium block mb-1">Return (% p.a.):</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          min="3"
                          max="25"
                          value={stream.expectedReturn}
                          onChange={(e) =>
                            updateStream(stream.id, { expectedReturn: Number(e.target.value) })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 font-bold text-emerald-600 outline-none text-right focus:border-[#10B981]"
                        />
                        <span className="text-gray-400 font-bold">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Amount Controls (SIP, Lumpsum, SWP, Step-up) */}
                  {(stream.type === "sip" ||
                    stream.type === "step_up_sip" ||
                    stream.type === "swp") && (
                    <div className="text-xs pt-1">
                      <div className="flex justify-between text-gray-500 font-medium mb-1">
                        <span>
                          {stream.type === "swp" ? "Monthly SWP Withdrawal:" : "Monthly SIP Amount:"}
                        </span>
                        <span
                          className={cn(
                            "font-bold",
                            stream.type === "swp" ? "text-rose-600" : "text-gray-800"
                          )}
                        >
                          ₹{formatINR(stream.monthlyAmount || 0)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1000}
                        max={150000}
                        step={1000}
                        value={stream.monthlyAmount || 10000}
                        onChange={(e) =>
                          updateStream(stream.id, { monthlyAmount: Number(e.target.value) })
                        }
                        className={cn(
                          "w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer",
                          stream.type === "swp" ? "accent-rose-500" : "accent-[#10B981]"
                        )}
                      />
                    </div>
                  )}

                  {stream.type === "step_up_sip" && (
                    <div className="text-xs pt-1">
                      <div className="flex justify-between text-gray-500 font-medium mb-1">
                        <span>Annual Step-Up (%):</span>
                        <span className="font-bold text-[#fe9800]">
                          +{stream.stepUpPercent}% p.a.
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={25}
                        step={1}
                        value={stream.stepUpPercent || 10}
                        onChange={(e) =>
                          updateStream(stream.id, { stepUpPercent: Number(e.target.value) })
                        }
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#fe9800]"
                      />
                    </div>
                  )}

                  {stream.type === "lumpsum" && (
                    <div className="text-xs pt-1">
                      <div className="flex justify-between text-gray-500 font-medium mb-1">
                        <span>Lumpsum Added in Year {stream.startYear}:</span>
                        <span className="font-bold text-purple-700">
                          +₹{formatINR(stream.lumpsumAmount || 0)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10000}
                        max={2000000}
                        step={10000}
                        value={stream.lumpsumAmount || 100000}
                        onChange={(e) =>
                          updateStream(stream.id, { lumpsumAmount: Number(e.target.value) })
                        }
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Fund Stream Button */}
          {streams.length < 6 && (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => addStream("sip")}
                className="flex-1 py-2.5 rounded-xl border border-dashed border-gray-300 hover:border-[#10B981] bg-white hover:bg-emerald-50 text-xs font-bold text-gray-700 hover:text-emerald-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="size-4" />
                <span>Add Another Mutual Fund or Phase ({streams.length}/6)</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Visual Timeline Gantt + Cumulative Growth Curve + Table */}
        <div className="lg:col-span-6 space-y-6">
          {/* Visual Timeline Gantt Map */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
            <h4 className="font-extrabold text-[#1a2332] text-sm flex items-center gap-1.5">
              <Calendar className="size-4 text-[#10B981]" />
              <span>Active Timeline Map (Year 1 to {totalTimelineYears})</span>
            </h4>

            {/* Timeline Year Headers */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-1">
                <span className="w-32 shrink-0">Fund / Stream</span>
                <div className="flex-1 grid grid-cols-6 sm:grid-cols-10 gap-1 text-center">
                  {Array.from({ length: Math.min(totalTimelineYears, 10) }, (_, i) => (
                    <span key={i}>Y{i + 1}</span>
                  ))}
                </div>
              </div>

              {/* Visual Bars for each stream */}
              {streams.map((s) => {
                const startOffset = ((s.startYear - 1) / totalTimelineYears) * 100;
                const widthPercent = (s.durationYears / totalTimelineYears) * 100;

                return (
                  <div key={s.id} className="flex items-center text-xs">
                    <span className="w-32 shrink-0 truncate font-semibold text-gray-800 pr-2">
                      {s.name}
                    </span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-md relative overflow-hidden">
                      <div
                        className="h-full rounded-md flex items-center justify-center text-[10px] font-extrabold text-white transition-all"
                        style={{
                          marginLeft: `${startOffset}%`,
                          width: `${Math.min(widthPercent, 100 - startOffset)}%`,
                          backgroundColor: s.color,
                        }}
                      >
                        Y{s.startYear}-Y{s.startYear + s.durationYears - 1}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continuous Cumulative Growth Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-[#1a2332] text-base">
                  Combined Portfolio Wealth Trajectory
                </h3>
                <p className="text-xs text-gray-500">
                  Total corpus growth incorporating all active deposits, returns, and SWP withdrawals.
                </p>
              </div>
            </div>

            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={simulation.chartTrajectory}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPortfolioG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
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
                      if (name === "portfolioValue") return [`₹${formatINR(Number(value))}`, "Portfolio Value"];
                      if (name === "cumulativeInvested") return [`₹${formatINR(Number(value))}`, "Total Invested"];
                      if (name === "cumulativeWithdrawn") return [`₹${formatINR(Number(value))}`, "Total Withdrawn"];
                      return [`₹${formatINR(Number(value))}`, name];
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
                      if (value === "portfolioValue") return <span className="text-xs font-bold text-gray-800">Portfolio Value</span>;
                      if (value === "cumulativeInvested") return <span className="text-xs font-medium text-gray-500">Total Invested</span>;
                      if (value === "cumulativeWithdrawn") return <span className="text-xs font-medium text-rose-500">Total Withdrawn</span>;
                      return value;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="portfolioValue"
                    name="portfolioValue"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPortfolioG)"
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeInvested"
                    name="cumulativeInvested"
                    stroke="#0B63E5"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Year-by-Year Cash Flow Breakdown Table */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
            <h4 className="font-extrabold text-[#1a2332] text-sm flex items-center gap-1.5">
              <Clock className="size-4 text-[#10B981]" />
              <span>Year-by-Year Cashflow Progression</span>
            </h4>

            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 font-bold sticky top-0 bg-gray-50">
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3 text-right">Start Value</th>
                    <th className="py-2.5 px-3 text-right">Inflows</th>
                    <th className="py-2.5 px-3 text-right">SWP Outflow</th>
                    <th className="py-2.5 px-3 text-right">Gains</th>
                    <th className="py-2.5 px-3 text-right">End Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {simulation.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-gray-800">
                        {row.label}
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-600">
                        ₹{formatINR(row.startBalance)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {row.inflows > 0 ? (
                          <span className="text-blue-600 font-semibold">+₹{formatINR(row.inflows)}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {row.outflows > 0 ? (
                          <span className="text-rose-600 font-semibold">-₹{formatINR(row.outflows)}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                        +₹{formatINR(row.gains)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-[#1a2332]">
                        ₹{formatINR(row.endBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
