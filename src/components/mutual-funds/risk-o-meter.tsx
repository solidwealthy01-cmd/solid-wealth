"use client";

import React from "react";
import { RiskLevel } from "@/lib/mutual-funds-data";
import { cn } from "@/lib/utils";
import { ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";

export interface RiskOMeterProps {
  risk?: string | RiskLevel;
  benchmarkRisk?: string | RiskLevel;
  benchmarkName?: string;
  beta?: number | string | null;
  volatilityFund?: number | string | null;
  volatilityBenchmark?: number | string | null;
  fundName?: string;
  className?: string;
  showBenchmarkComparison?: boolean;
}

const RISK_LEVELS: {
  level: RiskLevel;
  label: string;
  color: string;
  bgLight: string;
  textDark: string;
  angle: number; // Angle from -90 (far left) to +90 (far right)
  description: string;
}[] = [
  {
    level: "Low",
    label: "Low",
    color: "#00C853",
    bgLight: "bg-emerald-50 text-emerald-800 border-emerald-200",
    textDark: "text-emerald-700",
    angle: -75,
    description: "Principal will be at low risk",
  },
  {
    level: "Moderately Low",
    label: "Moderately Low",
    color: "#22c55e",
    bgLight: "bg-green-50 text-green-800 border-green-200",
    textDark: "text-green-700",
    angle: -45,
    description: "Principal will be at moderately low risk",
  },
  {
    level: "Moderate",
    label: "Moderate",
    color: "#FFD600",
    bgLight: "bg-amber-50 text-amber-800 border-amber-200",
    textDark: "text-amber-700",
    angle: -15,
    description: "Principal will be at moderate risk",
  },
  {
    level: "Moderately High",
    label: "Moderately High",
    color: "#FF9100",
    bgLight: "bg-orange-50 text-orange-800 border-orange-200",
    textDark: "text-orange-700",
    angle: 15,
    description: "Principal will be at moderately high risk",
  },
  {
    level: "High",
    label: "High",
    color: "#FF3D00",
    bgLight: "bg-orange-100 text-orange-900 border-orange-300",
    textDark: "text-orange-800",
    angle: 45,
    description: "Principal will be at high risk",
  },
  {
    level: "Very High",
    label: "Very High",
    color: "#D50000",
    bgLight: "bg-rose-50 text-rose-800 border-rose-200",
    textDark: "text-rose-700",
    angle: 75,
    description: "Principal will be at very high risk",
  },
];

function findRiskConfig(val?: string) {
  if (!val) return RISK_LEVELS[5]; // Default Very High for equity
  const clean = val.toLowerCase().replace(/[^a-z]/g, "");
  if (clean.includes("veryhigh")) return RISK_LEVELS[5];
  if (clean.includes("moderatlyhigh") || clean.includes("moderatelyhigh")) return RISK_LEVELS[3];
  if (clean.includes("high")) return RISK_LEVELS[4];
  if (clean.includes("moderatelylow") || clean.includes("moderatlylow") || clean.includes("lowtomoderate")) return RISK_LEVELS[1];
  if (clean.includes("moderate")) return RISK_LEVELS[2];
  if (clean.includes("low")) return RISK_LEVELS[0];
  return RISK_LEVELS[5];
}

export function RiskOMeter({
  risk = "Very High",
  benchmarkRisk = "Very High",
  benchmarkName = "NIFTY 500 TRI",
  beta = null,
  volatilityFund = null,
  volatilityBenchmark = null,
  fundName,
  className,
  showBenchmarkComparison = true,
}: RiskOMeterProps) {
  const fundRiskConfig = findRiskConfig(typeof risk === "string" ? risk : undefined);
  const benchRiskConfig = findRiskConfig(typeof benchmarkRisk === "string" ? benchmarkRisk : undefined);

  const betaNum = beta !== null && beta !== undefined ? Number(beta) : null;
  const validBeta = betaNum !== null && Number.isFinite(betaNum) && betaNum > 0 ? betaNum : 1.0;

  // Aggression assessment vs benchmark (Benchmark is Beta = 1.0)
  let aggressionVerdict = "Balanced with Benchmark";
  let aggressionBadgeColor = "bg-amber-100 text-amber-900 border-amber-300";
  let aggressionDesc = `Moves in tandem with ${benchmarkName} (Beta ≈ 1.00).`;
  let AggressionIcon = TrendingUp;

  if (validBeta < 0.85) {
    const diff = Math.round((1 - validBeta) * 100);
    aggressionVerdict = "Defensive / Lower Aggression";
    aggressionBadgeColor = "bg-emerald-100 text-emerald-900 border-emerald-300";
    aggressionDesc = `Exhibits ~${diff}% lower market volatility than ${benchmarkName}. Provides downside protection during corrections.`;
    AggressionIcon = ShieldCheck;
  } else if (validBeta > 1.10) {
    const diff = Math.round((validBeta - 1) * 100);
    aggressionVerdict = "Aggressive / High Sensitivity";
    aggressionBadgeColor = "bg-rose-100 text-rose-900 border-rose-300";
    aggressionDesc = `Exhibits ~${diff}% higher market amplitude than ${benchmarkName}. Seeks higher upside with deeper drawdowns.`;
    AggressionIcon = AlertTriangle;
  }

  // Beta percentage on scale from 0.5 (0%) to 1.5 (100%) clamped
  const betaClamp = Math.min(Math.max(validBeta, 0.5), 1.5);
  const betaPercent = ((betaClamp - 0.5) / 1.0) * 100;

  // Benchmark angle on the dial (typically 75 for NIFTY 500 TRI or 45/15 for hybrid)
  const benchAngle = benchRiskConfig.angle;
  // If both Fund and Benchmark are in the exact same risk level, give a slight visual offset to keep both visible
  const isSameLevel = fundRiskConfig.level === benchRiskConfig.level;
  const displayedBenchAngle = isSameLevel ? benchAngle - 10 : benchAngle;
  const displayedFundAngle = isSameLevel ? fundRiskConfig.angle + 8 : fundRiskConfig.angle;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#e5e7eb] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-[#1a2332] tracking-tight">
              Aggression & Risk-o-meter
            </h3>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
              vs Benchmark
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">
            Measures fund risk and relative volatility against {benchmarkName} (Green to Red scale).
          </p>
        </div>

        {/* Aggression Verdict Pill */}
        {showBenchmarkComparison && (
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto",
              aggressionBadgeColor
            )}
          >
            <AggressionIcon className="size-3.5" />
            <span>{aggressionVerdict}</span>
          </div>
        )}
      </div>

      {/* Main Meter & Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Semi-Circle Gauge Dial (Green to Red) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-[280px] h-[150px] overflow-hidden">
            <svg viewBox="0 0 200 115" className="w-full h-full overflow-visible">
              <defs>
                <filter id="needle-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.28" />
                </filter>
                <filter id="bench-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#1e3a8a" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* 6 Arc Segments from Green (180°) to Red (0°) */}
              {/* 1: Low (Green) */}
              <path
                d="M 15 100 A 85 85 0 0 1 24.8 62.4 L 46.2 73.5 A 60 60 0 0 0 39.2 100 Z"
                fill="#00C853"
              />
              {/* 2: Moderately Low (Light Green) */}
              <path
                d="M 27.9 57.2 A 85 85 0 0 1 55.4 29.8 L 68.5 50.4 A 60 60 0 0 0 49.1 69.8 Z"
                fill="#22c55e"
              />
              {/* 3: Moderate (Yellow) */}
              <path
                d="M 60.1 26.2 A 85 85 0 0 1 97 15.1 L 97.9 40.1 A 60 60 0 0 0 71.8 47.9 Z"
                fill="#FFD600"
              />
              {/* 4: Moderately High (Orange) */}
              <path
                d="M 103 15.1 A 85 85 0 0 1 139.9 26.2 L 128.2 47.9 A 60 60 0 0 0 102.1 40.1 Z"
                fill="#FF9100"
              />
              {/* 5: High (Deep Orange) */}
              <path
                d="M 144.6 29.8 A 85 85 0 0 1 172.1 57.2 L 150.9 69.8 A 60 60 0 0 0 131.5 50.4 Z"
                fill="#FF3D00"
              />
              {/* 6: Very High (Red) */}
              <path
                d="M 175.2 62.4 A 85 85 0 0 1 185 100 L 160.8 100 A 60 60 0 0 0 153.8 73.5 Z"
                fill="#D50000"
              />

              {/* Benchmark Pin / Pointer on Outer Arc */}
              {showBenchmarkComparison && (
                <g
                  transform={`translate(100, 100) rotate(${displayedBenchAngle})`}
                  filter="url(#bench-shadow)"
                  className="transition-transform duration-700 ease-out"
                >
                  {/* Benchmark Marker Line & Diamond */}
                  <line x1="0" y1="-86" x2="0" y2="-64" stroke="#1e40af" strokeWidth="3" strokeDasharray="3 2" />
                  <polygon points="0,-88 -5,-96 0,-104 5,-96" fill="#1e40af" />
                  <circle cx="0" cy="-96" r="2" fill="#ffffff" />
                </g>
              )}

              {/* Fund Primary Needle */}
              <g
                transform={`translate(100, 100) rotate(${displayedFundAngle})`}
                filter="url(#needle-shadow)"
                className="transition-transform duration-700 ease-out"
              >
                <polygon points="-3.5,0 0,-82 3.5,0" fill="#0f172a" />
                <circle cx="0" cy="0" r="9" fill="#0f172a" />
                <circle cx="0" cy="0" r="4.5" fill="#f8fafc" />
              </g>

              {/* Center baseline ring */}
              <circle cx="100" cy="100" r="2" fill="#0f172a" />
            </svg>
          </div>

          {/* Meter Legend & Labels */}
          <div className="mt-2 flex items-center justify-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-[#0f172a] inline-block shadow-xs" />
              <span className="text-gray-900 font-bold">Fund: {fundRiskConfig.label}</span>
            </div>
            {showBenchmarkComparison && (
              <div className="flex items-center gap-1.5">
                <span className="size-3 rotate-45 bg-[#1e40af] inline-block shadow-xs" />
                <span className="text-blue-900 font-bold">Benchmark: {benchRiskConfig.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Relative Aggression & Volatility Breakdown (Beta Scale) */}
        <div className="md:col-span-6 space-y-4">
          {/* Relative Beta Scale (0.5 to 1.5) */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-700">Market Sensitivity (Beta vs Benchmark)</span>
              <span className="font-black text-sm text-[#0f172a]">
                β = {validBeta.toFixed(2)}
              </span>
            </div>

            {/* Gradient Spectrum Bar from Green to Red */}
            <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-600 shadow-inner">
              {/* Benchmark Reference Marker at 1.0 (50% position) */}
              <div
                className="absolute top-[-3px] bottom-[-3px] w-0.5 bg-blue-900 z-10"
                style={{ left: "50%" }}
                title="Benchmark Baseline (1.00)"
              />

              {/* Fund Needle Pin */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 rounded-full bg-white border-2 border-gray-900 shadow-md transition-all duration-700"
                style={{ left: `${betaPercent}%` }}
              />
            </div>

            {/* Scale Axis Labels */}
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
              <span className="text-emerald-700 font-bold">0.5 (Defensive)</span>
              <span className="text-blue-900 font-extrabold">1.0 (Benchmark Index)</span>
              <span className="text-rose-700 font-bold">1.5+ (Aggressive)</span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed pt-1">
              {aggressionDesc}
            </p>
          </div>

          {/* Side-by-side Comparative Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-1">
              <span className="text-[11px] font-semibold text-gray-500">Fund Risk Status</span>
              <div className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full inline-block"
                  style={{ backgroundColor: fundRiskConfig.color }}
                />
                <span className="font-extrabold text-gray-900">{fundRiskConfig.label}</span>
              </div>
              {volatilityFund && (
                <p className="text-[11px] text-gray-500 pt-0.5">
                  Volatility: <span className="font-bold text-gray-800">{Number(volatilityFund).toFixed(2)}%</span>
                </p>
              )}
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 space-y-1">
              <span className="text-[11px] font-semibold text-blue-700">Benchmark Index</span>
              <div className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full inline-block"
                  style={{ backgroundColor: benchRiskConfig.color }}
                />
                <span className="font-extrabold text-blue-950 truncate max-w-[120px]" title={benchmarkName}>
                  {benchmarkName}
                </span>
              </div>
              <p className="text-[11px] text-blue-800 pt-0.5">
                Risk: <span className="font-bold">{benchRiskConfig.label}</span> (β: 1.00)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Regulatory caption */}
      <div className="border-t border-gray-100 pt-3 text-center">
        <p className="text-[11px] text-[#6b7280] leading-relaxed max-w-2xl mx-auto">
          {fundRiskConfig.description}. Evaluated in accordance with SEBI risk-o-meter guidelines and compared against{" "}
          <span className="font-semibold text-gray-700">{benchmarkName}</span> to assess portfolio aggression.
        </p>
      </div>
    </div>
  );
}
