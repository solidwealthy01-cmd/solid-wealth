"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface YearlyPerformanceChartProps {
  data: Array<{
    year: string;
    fund: number | null;
    benchmark: number;
    category?: number;
  }>;
  schemeName: string;
  benchmarkName: string;
  categoryName: string;
}

export function YearlyPerformanceChart({
  data,
  schemeName,
  benchmarkName,
  categoryName,
}: YearlyPerformanceChartProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <h3 className="text-sm font-bold text-center text-[#1f2937] tracking-tight mb-6">
        Yearly Performance (%)
      </h3>

      <div className="w-full min-w-0 h-[320px] sm:h-[360px]">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 12, fill: "#64748b" }}
              domain={[-50, 60]}
              ticks={[-50, -25, 0, 25, 50]}
            />
            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} />
            <Tooltip
              formatter={(val: any, name: any) => {
                if (val === null || val === undefined) return ["-", String(name ?? "")];
                return [`${Number(val) > 0 ? "+" : ""}${Number(val).toFixed(2)}%`, String(name ?? "")];
              }}
              labelFormatter={(label) => `Year: ${label}`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            />
            <Bar
              dataKey="fund"
              name={schemeName}
              fill="#00C853"
              radius={[3, 3, 0, 0]}
              maxBarSize={18}
            />
            <Bar
              dataKey="benchmark"
              name={benchmarkName}
              fill="#2563eb"
              radius={[3, 3, 0, 0]}
              maxBarSize={18}
            />
            {data[0]?.category !== undefined && (
              <Bar
                dataKey="category"
                name={categoryName}
                fill="#f59e0b"
                radius={[3, 3, 0, 0]}
                maxBarSize={18}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-gray-50/50 rounded-xl animate-pulse" />
        )}
      </div>

      {/* Legend matching Screenshot 3 */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-[#4b5563]">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#00C853] shrink-0" />
          <span>{schemeName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#2563eb] shrink-0" />
          <span>{benchmarkName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#f59e0b] shrink-0" />
          <span>{categoryName}</span>
        </div>
      </div>
    </div>
  );
}
