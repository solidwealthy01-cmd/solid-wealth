"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface MarketCapProps {
  distribution: {
    largeCap: number;
    midCap: number;
    smallCap: number;
    others: number;
  };
}

const COLORS = [
  { name: "Large Cap", key: "largeCap", color: "#2563eb" },
  { name: "Mid Cap", key: "midCap", color: "#16a34a" },
  { name: "Small Cap", key: "smallCap", color: "#eab308" },
  { name: "Others", key: "others", color: "#7c3aed" },
];

export function MarketCapDonut({ distribution }: MarketCapProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const data = [
    { name: "Large Cap", value: distribution.largeCap, color: "#2563eb" },
    { name: "Mid Cap", value: distribution.midCap, color: "#16a34a" },
    { name: "Small Cap", value: distribution.smallCap, color: "#eab308" },
    { name: "Others", value: distribution.others, color: "#7c3aed" },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm h-full">
      <h3 className="text-sm font-bold text-center text-[#1f2937] tracking-tight mb-4">
        Market Cap Distribution
      </h3>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-1">
        {/* Donut Chart */}
        <div className="relative w-[180px] h-[180px] min-w-0">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toFixed(2)}%`, "Allocation"]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-[180px] h-[180px] rounded-full bg-gray-50/50 animate-pulse" />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 text-xs">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="size-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-semibold text-[#4b5563]">{item.name}:</span>
              <span className="font-bold text-[#1f2937]">{item.value.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
