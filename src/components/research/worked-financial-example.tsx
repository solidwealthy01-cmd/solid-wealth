"use client";

import {
  TrendingUp,
  Calculator,
  IndianRupee,
  Layers,
  CheckCircle2,
  Calendar,
  Percent,
  PiggyBank,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type WorkedFinancialExampleProps = {
  topic: string;
  moduleTitle: string;
  moduleNumber: number;
  workedExample: string;
  practicalApplication: string;
};

type MetricCard = {
  label: string;
  value: string;
  detail: string;
  highlight?: boolean;
};

function getFinancialScenarioData(topic: string, workedExample: string): {
  headline: string;
  metrics: MetricCard[];
  takeaway: string;
} {
  const t = topic.toLowerCase();

  if (t.includes("compound") || t.includes("8th wonder")) {
    return {
      headline: "20-Year Systematic Wealth Accumulation (SIP)",
      metrics: [
        { label: "Monthly Investment", value: "₹10,000 / mo", detail: "Disciplined monthly SIP" },
        { label: "Investment Horizon", value: "20 Years", detail: "Uninterrupted participation" },
        { label: "Total Capital Invested", value: "₹24,00,000", detail: "240 monthly contributions" },
        { label: "Estimated Corpus (12% CAGR)", value: "₹99,91,479", detail: "₹75.91L Wealth Gained (4.16x)", highlight: true },
      ],
      takeaway: "Notice that in 20 years, your actual contributions are only ₹24 Lakhs, but compounding creates ₹75.9 Lakhs of wealth—over 3 times what you saved out of pocket.",
    };
  }

  if (t.includes("inflation") || t.includes("purchasing power")) {
    return {
      headline: "The Cost of Inaction: Inflation vs Productive Investing",
      metrics: [
        { label: "Initial Reserve", value: "₹10,00,000", detail: "Lump-sum capital today" },
        { label: "Inflation Rate", value: "6.0% p.a.", detail: "Average consumer price rise" },
        { label: "Cash Value in 15 Years", value: "₹4,17,265", detail: "58% purchasing power lost in bank" },
        { label: "Equity Value in 15 Years (12%)", value: "₹54,73,566", detail: "₹22.8L Inflation-adjusted real wealth", highlight: true },
      ],
      takeaway: "Leaving cash idle in a regular account guarantees a loss of purchasing power. A sound investment portfolio doesn't just aim for profit—it defends your hard-earned money from inflation.",
    };
  }

  if (t.includes("saving vs investing") || t.includes("why investing is important") || t.includes("what is investing")) {
    return {
      headline: "The Twin-Engine Wealth Strategy: Safety + Growth",
      metrics: [
        { label: "Emergency Safety Tank", value: "₹6,00,000", detail: "6 months expenses in Liquid/FD" },
        { label: "Monthly Growth Engine", value: "₹25,000 / mo", detail: "Diversified mutual fund SIP" },
        { label: "10-Year Growth Projection", value: "₹58,08,477", detail: "At 12% CAGR (Invested: ₹30L)", highlight: true },
        { label: "Financial Security Status", value: "Protected", detail: "No need to break SIP during emergencies" },
      ],
      takeaway: "Saving and investing work together: your emergency savings buffer protects you from unexpected life shocks, ensuring you never have to sell your long-term equity funds at a loss during a market dip.",
    };
  }

  if (t.includes("risk vs reward") || t.includes("time value of money")) {
    return {
      headline: "Risk-Adjusted Return Comparison Across Asset Classes",
      metrics: [
        { label: "Fixed Deposit (FD)", value: "6.8% CAGR", detail: "Low volatility · Post-tax return ~4.8%" },
        { label: "Corporate Bond Fund", value: "7.8% CAGR", detail: "Moderate volatility · Higher stability" },
        { label: "NIFTY 50 Index Fund", value: "13.2% CAGR", detail: "Higher 1Y volatility · High 10Y stability", highlight: true },
        { label: "Rule of 72 Doubling Time", value: "5.5 Years", detail: "At 13% CAGR vs 10.6 yrs in FD" },
      ],
      takeaway: "Risk in mutual funds is not permanent loss—it is short-term market volatility. Over 7 to 10 year holding periods, equity volatility diminishes while delivering substantially higher inflation-beating returns.",
    };
  }

  if (t.includes("emergency fund")) {
    return {
      headline: "Emergency Fund Sizing & Allocation Blueprint",
      metrics: [
        { label: "Monthly Living Expenses", value: "₹75,000", detail: "Rent, EMIs, groceries, utilities" },
        { label: "Recommended Buffer", value: "6 Months", detail: "Safe cushion for income shocks" },
        { label: "Target Reserve Amount", value: "₹4,50,000", detail: "Instant liquidity priority" },
        { label: "Recommended Vehicles", value: "Liquid Fund + FD", detail: "T+1 redemption · Zero exit load", highlight: true },
      ],
      takeaway: "Your emergency reserve should never be invested in equity funds. Keep 30% in a savings bank account and 70% in high-quality overnight or liquid mutual funds for swift, penalty-free access.",
    };
  }

  // Default institutional scenario for any other topic
  return {
    headline: `Practical Financial Analysis: ${topic}`,
    metrics: [
      { label: "Recommended Horizon", value: "5+ Years", detail: "Adequate market cycle duration" },
      { label: "Benchmark Comparison", value: "NIFTY 500 TRI", detail: "Broad-market reference standard" },
      { label: "Historical 5Y Rolling", value: "100% Positive", detail: "Zero negative returns across historical 5Y windows" },
      { label: "Portfolio Action", value: "Systematic SIP", detail: "Rupee-cost averaging disciplined execution", highlight: true },
    ],
    takeaway: workedExample,
  };
}

export function WorkedFinancialExample({
  topic,
  moduleTitle,
  moduleNumber,
  workedExample,
  practicalApplication,
}: WorkedFinancialExampleProps) {
  const scenario = getFinancialScenarioData(topic, workedExample);

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-[#fe9800]">
              <Calculator className="size-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#fe9800]">
                Practical Financial Example
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {scenario.headline}
              </h3>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            <IndianRupee className="size-3" />
            Real Indian Market Scenario
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-[#fbfcfd]">
        {scenario.metrics.map((metric, idx) => (
          <div
            key={idx}
            className={cn(
              "p-4 transition-colors",
              metric.highlight ? "bg-orange-50/40" : ""
            )}
          >
            <div className="text-xs font-medium text-slate-500">
              {metric.label}
            </div>
            <div
              className={cn(
                "mt-1.5 text-lg sm:text-xl font-extrabold tracking-tight",
                metric.highlight ? "text-[#fe9800]" : "text-slate-900"
              )}
            >
              {metric.value}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              {metric.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Financial Reasoning & Explanation */}
      <div className="border-t border-slate-100 p-5 space-y-4 bg-white">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            How This Applies to Your Investment Decision:
          </h4>
          <p className="text-sm leading-relaxed text-slate-700">
            {practicalApplication || workedExample}
          </p>
        </div>

        {/* Financial Rule of Thumb */}
        <div className="flex items-start gap-3 rounded-xl bg-orange-50/60 border border-orange-200/60 p-3.5">
          <ShieldCheck className="size-4 shrink-0 text-[#fe9800] mt-0.5" />
          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
            <span className="text-[#fe9800] font-bold">Key Financial Insight: </span>
            {scenario.takeaway}
          </p>
        </div>
      </div>
    </div>
  );
}
