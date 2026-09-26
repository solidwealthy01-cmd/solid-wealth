"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// #b45309 keeps the brand's orange family but clears 3:1 against the white
// card, which the brighter brand orange (#fe9800, 2.16:1) does not.
const LINE_COLOR = "#b45309";
const GRID_COLOR = "#eef0f3";
const AXIS_TEXT = "#64748b";
const INK = "#1a2332";

interface NavGrowthChartProps {
  data: { date: string; growthPct: number }[];
}

function formatPct(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatDay(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMonth(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
}

// One tick at the first trading day of each month, thinned to at most seven.
function monthTicks(data: NavGrowthChartProps["data"]) {
  const starts = data.filter((point, i) => i === 0 || point.date.slice(0, 7) !== data[i - 1].date.slice(0, 7));
  const step = Math.ceil(starts.length / 7);
  return starts.filter((_, i) => i % step === 0).map((point) => point.date);
}

// Last point of each month, for the table view.
function monthEnds(data: NavGrowthChartProps["data"]) {
  return data.filter((point, i) => i === data.length - 1 || point.date.slice(0, 7) !== data[i + 1].date.slice(0, 7));
}

export function NavGrowthChart({ data }: NavGrowthChartProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || data.length < 2) {
    return <div className="h-[300px] w-full min-w-0 rounded-2xl bg-gray-50/50 animate-pulse" />;
  }

  const last = data[data.length - 1];

  return (
    <div className="space-y-3">
      <div className="h-[300px] w-full min-w-0">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
          initialDimension={{ width: 800, height: 300 }}
        >
          <AreaChart data={data} margin={{ top: 16, right: 64, left: 0, bottom: 4 }} baseValue={0}>
            <CartesianGrid vertical={false} stroke={GRID_COLOR} />
            <XAxis
              dataKey="date"
              ticks={monthTicks(data)}
              tickFormatter={formatMonth}
              tickLine={false}
              axisLine={{ stroke: GRID_COLOR }}
              tick={{ fontSize: 12, fill: AXIS_TEXT }}
              dy={6}
            />
            <YAxis
              tickFormatter={(value: number) => `${value}%`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: AXIS_TEXT }}
              width={52}
            />
            <ReferenceLine y={0} stroke="#cbd5e1" />
            <Tooltip
              cursor={{ stroke: "#94a3b8", strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                const value = payload?.[0]?.value;
                if (!active || typeof value !== "number") return null;
                return (
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md">
                    <p className="text-sm font-bold" style={{ color: INK }}>
                      {formatPct(value)}
                    </p>
                    <p className="text-xs text-gray-500">{formatDay(String(label))}</p>
                  </div>
                );
              }}
            />
            <Area
              type="linear"
              dataKey="growthPct"
              stroke={LINE_COLOR}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              fill={LINE_COLOR}
              fillOpacity={0.1}
              dot={false}
              activeDot={{ r: 5, fill: LINE_COLOR, stroke: "#ffffff", strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={last.date}
              y={last.growthPct}
              r={4}
              fill={LINE_COLOR}
              stroke="#ffffff"
              strokeWidth={2}
              label={{ value: formatPct(last.growthPct), position: "right", fill: INK, fontSize: 12, fontWeight: 700 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <details className="text-xs text-gray-600">
        <summary className="cursor-pointer font-semibold text-gray-700">Show chart data (month-end)</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full max-w-md text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-1.5 pr-4 font-semibold">Date</th>
                <th className="py-1.5 text-right font-semibold">Growth since start</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {monthEnds(data).map((point) => (
                <tr key={point.date} className="border-b border-gray-100">
                  <td className="py-1.5 pr-4">{formatDay(point.date)}</td>
                  <td className="py-1.5 text-right">{formatPct(point.growthPct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
