"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Download,
  FileText,
  X,
} from "lucide-react";
import { exportElementsToPdf } from "@/lib/pdf-export";
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const wasPreviewOpen = showPreview;
    if (!wasPreviewOpen) setShowPreview(true);

    setTimeout(async () => {
      try {
        await exportElementsToPdf({
          pageIds: ["journey-pdf-report-page-1", "journey-pdf-report-page-2"],
          filename: `solid_wealth_portfolio_journey_${totalTimelineYears}yr.pdf`,
        });
        setIsDownloading(false);
        if (!wasPreviewOpen) setShowPreview(false);
      } catch (err) {
        console.error("Error generating portfolio journey PDF", err);
        setIsDownloading(false);
      }
    }, 500);
  };

  const capitalMultiplier =
    simulation.totalInvested > 0
      ? (
          (simulation.finalCorpus + simulation.totalWithdrawn) /
          simulation.totalInvested
        ).toFixed(2)
      : "1.00";
  const totalWealthGenerated = simulation.finalCorpus + simulation.totalWithdrawn;

  const milestoneYears = useMemo(
    () =>
      Array.from(
        new Set(
          [1, 2, 3, 5, 7, 10, 15, 20, 25, 30]
            .filter((y) => y <= totalTimelineYears)
            .concat(totalTimelineYears)
        )
      ).sort((a, b) => a - b),
    [totalTimelineYears]
  );

  const displayedSchedule = useMemo(() => {
    if (simulation.yearlyBreakdown.length <= 10) {
      return simulation.yearlyBreakdown;
    }
    return simulation.yearlyBreakdown.filter((r) => milestoneYears.includes(r.year));
  }, [simulation.yearlyBreakdown, milestoneYears]);

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

          {/* Controls: Quick Presets & PDF Report Export */}
          <div className="flex flex-wrap items-center gap-3">
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

            {/* PDF Report Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-gray-700 text-xs font-bold hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
              >
                <FileText size={15} className="text-emerald-700" />
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

            <div className="w-full min-w-0 h-[280px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
              ) : (
                <div className="w-full h-full bg-gray-50/50 rounded-xl animate-pulse" />
              )}
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
                <h3 className="font-bold text-xl text-[#1a2332]">
                  Multi-Phase Portfolio Journey Report Preview (2 Pages)
                </h3>
                <p className="text-xs text-gray-500">
                  Page 1: Executive Summary & Fund Architecture • Page 2: Mathematical Engine, Lifecycle KPIs & Trajectory Schedule
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
                  Page 1 of 2: Executive Summary & Fund Architecture
                </span>
                <div
                  id="journey-pdf-report-page-1"
                  className="w-[794px] min-w-[794px] h-[1123px] bg-white shadow-xl print:shadow-none relative overflow-hidden flex-shrink-0"
                >
                  <img
                    src="/Printable.svg"
                    alt="Template Header"
                    className="w-full h-auto object-cover opacity-80 pointer-events-none absolute top-0 left-0"
                  />

                  <div className="relative z-10 w-full h-full pt-[220px] px-14 flex flex-col pb-20 justify-between">
                    <div>
                      {/* Title Header */}
                      <div className="flex justify-between items-end border-b-2 border-gray-100 pb-4 mb-4">
                        <div>
                          <span className="text-xs font-bold tracking-widest text-[#fe9800] uppercase">
                            Solid Wealth Financial Report
                          </span>
                          <h1 className="text-2xl font-black text-[#1a2332]">
                            Multi-Phase Portfolio Journey & Cashflow Report
                          </h1>
                        </div>
                        <span className="text-xs font-bold text-gray-400">Page 1 of 2</span>
                      </div>

                      {/* Horizon & Phase Status Banner */}
                      <div className="bg-[#F0FDF4] border border-emerald-200 rounded-xl px-4 py-2.5 mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                            Evaluation Horizon:
                          </span>
                          <span className="text-xs text-gray-800 font-bold">{totalTimelineYears} Years</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-500 font-semibold">Configured Streams:</span>
                          <span className="text-xs font-bold text-gray-800">{streams.length} Allocation Legs</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                          <span>Total Wealth Created:</span>
                          <span className="text-emerald-700">₹{formatINR(totalWealthGenerated)} ({capitalMultiplier}x)</span>
                        </div>
                      </div>

                      {/* 4 Executive Summary KPI Cards */}
                      <div className="grid grid-cols-4 gap-3 mb-5">
                        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-2xs">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Invested Outlay</p>
                          <p className="text-base font-black text-[#1a2332] mt-0.5">₹{formatINR(simulation.totalInvested)}</p>
                          <p className="text-[9px] text-gray-500 mt-0.5">Across all deposits</p>
                        </div>

                        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-center shadow-2xs">
                          <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Total SWP Withdrawn</p>
                          <p className="text-base font-black text-rose-600 mt-0.5">₹{formatINR(simulation.totalWithdrawn)}</p>
                          <p className="text-[9px] text-rose-700 mt-0.5">Monthly passive income</p>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-center shadow-2xs">
                          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Net Compounding Gains</p>
                          <p className="text-base font-black text-emerald-700 mt-0.5">+₹{formatINR(simulation.netGains)}</p>
                          <p className="text-[9px] text-emerald-800 mt-0.5">
                            +{((simulation.netGains / Math.max(simulation.totalInvested, 1)) * 100).toFixed(1)}% Gain on Capital
                          </p>
                        </div>

                        <div className="rounded-xl border border-blue-200 bg-[#F0F6FF] p-3 text-center shadow-2xs">
                          <p className="text-[10px] font-bold text-[#0B63E5] uppercase tracking-wider">Ending Portfolio Value</p>
                          <p className="text-base font-black text-[#0B63E5] mt-0.5">₹{formatINR(simulation.finalCorpus)}</p>
                          <p className="text-[9px] text-blue-700 mt-0.5">Terminal wealth remaining</p>
                        </div>
                      </div>

                      {/* Stream Breakdown Table */}
                      <div className="border border-gray-200 rounded-xl overflow-hidden mb-5 shadow-2xs">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                            Configured Multi-Phase Streams & Capital Allocation
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">Over {totalTimelineYears} Year Timeline</span>
                        </div>
                        <table className="w-full text-xs text-left">
                          <thead className="bg-gray-50/60 text-gray-500 font-bold border-b border-gray-100 text-[10px] uppercase">
                            <tr>
                              <th className="py-2.5 px-3">Stream / Fund Name</th>
                              <th className="py-2.5 px-3">Leg Type</th>
                              <th className="py-2.5 px-3 text-center">Active Timeline</th>
                              <th className="py-2.5 px-3 text-right">Contribution / Cashflow</th>
                              <th className="py-2.5 px-3 text-center">Expected CAGR</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-800">
                            {streams.map((s) => {
                              const typeInfo = STREAM_TYPE_INFO[s.type];
                              const Icon = typeInfo.icon;
                              const endYear = s.startYear + s.durationYears - 1;
                              let amountLabel = "";
                              if (s.type === "sip") amountLabel = `₹${formatINR(s.monthlyAmount || 0)}/mo`;
                              else if (s.type === "step_up_sip") amountLabel = `₹${formatINR(s.monthlyAmount || 0)}/mo (+${s.stepUpPercent || 0}%)`;
                              else if (s.type === "lumpsum") amountLabel = `₹${formatINR(s.lumpsumAmount || 0)} (One-time)`;
                              else if (s.type === "swp") amountLabel = `₹${formatINR(s.monthlyAmount || 0)}/mo (Outflow)`;

                              return (
                                <tr key={s.id} className="bg-white">
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-2">
                                      <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                      <span className="font-bold text-[#1a2332]">{s.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border inline-flex items-center gap-1", typeInfo.badgeBg)}>
                                      <Icon className="size-3" />
                                      {typeInfo.label}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-center text-gray-700 font-semibold">
                                    Year {s.startYear} - Year {endYear} ({s.durationYears} {s.durationYears === 1 ? "Yr" : "Yrs"})
                                  </td>
                                  <td className="py-2.5 px-3 text-right font-bold text-gray-800">
                                    {amountLabel}
                                  </td>
                                  <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                                    {s.expectedReturn}% p.a.
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Visual Lifecycle Progression / Phase Breakdown */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="rounded-xl border border-blue-200 bg-[#F0F6FF]/70 p-3 shadow-2xs">
                          <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-blue-200/60">
                            <span className="text-[10px] font-bold text-[#0B63E5] uppercase tracking-wider">
                              Phase 1: Systematic Wealth Accumulation
                            </span>
                            <span className="text-[9px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                              Inflows & Capital Outlay
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-gray-600 font-medium">Cumulative Capital Invested:</span>
                            <span className="font-extrabold text-[#1a2332]">₹{formatINR(simulation.totalInvested)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-gray-600 font-medium">Active Inflow Streams:</span>
                            <span className="font-bold text-blue-700">{streams.filter((s) => s.type !== "swp").length} Funding Legs</span>
                          </div>
                          <p className="text-[9px] text-gray-500 mt-1">
                            Disciplined capital is injected regularly or lump-sum, capturing compound returns before distribution.
                          </p>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-[#F0FDF4]/70 p-3 shadow-2xs">
                          <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-emerald-200/60">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                              Phase 2: Distribution & Wealth Preservation
                            </span>
                            <span className="text-[9px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                              Outflows & Terminal Corpus
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-gray-600 font-medium">Cumulative SWP Pension Paid:</span>
                            <span className="font-extrabold text-rose-600">₹{formatINR(simulation.totalWithdrawn)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-gray-600 font-medium">Terminal Corpus Remaining:</span>
                            <span className="font-extrabold text-emerald-700">₹{formatINR(simulation.finalCorpus)}</span>
                          </div>
                          <p className="text-[9px] text-gray-500 mt-1">
                            Provides regular liquid cashflow while remaining assets continue generating geometric compound returns.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Executive Takeaway */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-[10px] text-gray-600 flex items-start gap-2">
                      <span className="font-bold text-[#1a2332] uppercase shrink-0">Strategic Takeaway:</span>
                      <span>
                        Over the {totalTimelineYears}-year financial plan, investing ₹{formatINR(simulation.totalInvested)} generates ₹{formatINR(simulation.totalWithdrawn)} in cumulative passive income while preserving ₹{formatINR(simulation.finalCorpus)} in terminal capital (total wealth multiple of {capitalMultiplier}x). Transitioning from disciplined systematic accumulation to structured systematic withdrawal maximizes compounding while ensuring liquid cashflow.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAGE 2: ALGORITHM & TRAJECTORY SCHEDULE */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 print:hidden">
                  Page 2 of 2: Algorithm, Calculation Details & Schedule
                </span>
                <div
                  id="journey-pdf-report-page-2"
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
                            Calculation Methodology & Progression Details
                          </span>
                          <h2 className="text-2xl font-black text-[#1a2332]">Portfolio Dynamics & Cashflow Progression Schedule</h2>
                        </div>
                        <span className="text-xs font-bold text-gray-400">Page 2 of 2</span>
                      </div>

                      {/* ALGORITHM DEFINITIONS & FORMULAS CARD */}
                      <div className="bg-[#FFFDF4] border border-orange-100 rounded-xl p-3.5 mb-3 shadow-2xs">
                        <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-orange-100/70">
                          <span className="text-[11px] font-bold text-[#1a2332] uppercase tracking-wider">
                            Mathematical Formulation & Dynamic Compounding Engine
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#fe9800] bg-white px-2 py-0.5 rounded border border-orange-200">
                            Discrete Multi-Stream Dynamic Cashflow Engine
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-700 mb-2">
                          <div className="bg-white/80 p-2 rounded border border-orange-100">
                            <span className="font-bold text-[#0B63E5] block mb-0.5">Accumulation Phase (Inflows):</span>
                            <code className="font-mono text-[9.5px] text-gray-800">
                              Balance_m = Balance_(m-1) × (1 + r/12) + Inflows_m
                            </code>
                            <p className="text-[8.5px] text-gray-500 mt-1">
                              SIPs deposit monthly; Step-Up deposits scale annually by rate g% (P_y = P_0 × (1+g)^(y-1)); lump sums inject at year start.
                            </p>
                          </div>

                          <div className="bg-white/80 p-2 rounded border border-orange-100">
                            <span className="font-bold text-rose-600 block mb-0.5">Distribution Phase (SWP Outflows):</span>
                            <code className="font-mono text-[9.5px] text-gray-800">
                              Balance_m = Balance_(m-1) × (1 + r/12) - Outflows_m
                            </code>
                            <p className="text-[8.5px] text-gray-500 mt-1">
                              Liquid cashflow is withdrawn at month start; remaining balance continues compounding. Solvency is guarded by min(SWP, Balance).
                            </p>
                          </div>
                        </div>

                        <div className="text-[9.5px] text-gray-600 space-y-0.5">
                          <span className="font-bold text-gray-700 uppercase tracking-wider text-[9px] block">
                            Calculation Mechanics:
                          </span>
                          <p>1. Geometric compounding calculated month-by-month at weighted average annualized expected return.</p>
                          <p>2. Cash flows execute at the start of each month (annuity due) maximizing continuous market compounding.</p>
                          <p>3. Solvency guard preserves non-negative capital balance across all simulated durations.</p>
                        </div>
                      </div>

                      {/* 4 Analytical KPI Cards */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="border border-gray-200 bg-gray-50 rounded-xl p-2 text-center">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Capital Productivity</p>
                          <p className="text-sm font-black text-[#1a2332]">{capitalMultiplier}x Outlay</p>
                          <p className="text-[8.5px] text-gray-500 mt-0.5">Payout + terminal wealth</p>
                        </div>

                        <div className="border border-emerald-200 bg-[#F0FDF4] rounded-xl p-2 text-center">
                          <p className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">Capital Preservation</p>
                          <p className="text-sm font-black text-emerald-700">
                            {simulation.finalCorpus >= simulation.totalInvested ? "Intact & Growing" : "Amortizing Balance"}
                          </p>
                          <p className="text-[8.5px] text-gray-500 mt-0.5">Corpus vs invested capital</p>
                        </div>

                        <div className="border border-rose-200 bg-rose-50/60 rounded-xl p-2 text-center">
                          <p className="text-[9px] font-bold text-rose-700 uppercase tracking-wider mb-0.5">Passive Extraction</p>
                          <p className="text-sm font-black text-rose-600">₹{formatINR(simulation.totalWithdrawn)}</p>
                          <p className="text-[8.5px] text-gray-500 mt-0.5">SWP liquidity realized</p>
                        </div>

                        <div className="border border-gray-200 bg-gray-50 rounded-xl p-2 text-center">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Real Value (6% Infl.)</p>
                          <p className="text-sm font-black text-[#0B63E5]">
                            ₹{formatINR(Math.round(simulation.finalCorpus / Math.pow(1.06, totalTimelineYears)))}
                          </p>
                          <p className="text-[8.5px] text-gray-500 mt-0.5">Inflation-adjusted corpus</p>
                        </div>
                      </div>

                      {/* Cashflow Progression Schedule Table */}
                      <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
                        <div className="bg-gray-50 px-3.5 py-1.5 border-b border-gray-200 flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                            Year-by-Year Cashflow Progression Schedule
                          </span>
                          <span className="text-[9.5px] text-gray-500">All Figures in INR (₹)</span>
                        </div>
                        <table className="w-full text-[10.5px] text-left">
                          <thead className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100 text-[9.5px] uppercase">
                            <tr>
                              <th className="py-2 px-3">Timeline</th>
                              <th className="py-2 px-3 text-right">Start Value</th>
                              <th className="py-2 px-3 text-right">Inflows</th>
                              <th className="py-2 px-3 text-right">SWP Outflow</th>
                              <th className="py-2 px-3 text-right">Gains</th>
                              <th className="py-2 px-3 text-right font-black">End Balance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-800">
                            {displayedSchedule.map((row) => (
                              <tr
                                key={row.year}
                                className={row.year === totalTimelineYears ? "bg-amber-50/50 font-bold" : "hover:bg-gray-50/50"}
                              >
                                <td className="py-2 px-3 font-semibold text-gray-800">{row.label}</td>
                                <td className="py-2 px-3 text-right text-gray-600">₹{formatINR(row.startBalance)}</td>
                                <td className="py-2 px-3 text-right">
                                  {row.inflows > 0 ? (
                                    <span className="text-blue-600 font-semibold">+₹{formatINR(row.inflows)}</span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="py-2 px-3 text-right">
                                  {row.outflows > 0 ? (
                                    <span className="text-rose-600 font-semibold">-₹{formatINR(row.outflows)}</span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="py-2 px-3 text-right font-bold text-emerald-600">
                                  +₹{formatINR(row.gains)}
                                </td>
                                <td className="py-2 px-3 text-right font-extrabold text-[#1a2332]">
                                  ₹{formatINR(row.endBalance)}
                                </td>
                              </tr>
                            ))}
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
