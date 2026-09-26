"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Calculator,
  ChevronRight,
  TrendingUp,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Target,
  CalendarClock,
  Info,
  PieChart,
  BarChart2,
  LineChart,
  Eye,
  Download,
  CheckCircle2,
  Percent,
  Sparkles,
  BookOpen,
  Layers,
  Clock,
  ArrowUpRight,
  FileText,
  Cpu,
  Scale
} from "lucide-react";
import { CalculatorComparisonView } from "@/components/calculators/calculator-comparison";
import { PortfolioJourneyCalculator } from "@/components/calculators/portfolio-journey-calculator";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Helper for Indian currency formatting
const formatINR = (val: number, maxDecimals = 0) => {
  if (isNaN(val) || val === null || val === undefined) return "0";
  return Number(val).toLocaleString("en-IN", {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0
  });
};

function getMilestones(totalYears: number): number[] {
  const set = new Set<number>();
  set.add(1);
  if (totalYears >= 2) set.add(2);
  if (totalYears >= 3) set.add(3);
  if (totalYears >= 5) set.add(5);
  if (totalYears >= 10) set.add(10);
  if (totalYears >= 15) set.add(15);
  if (totalYears >= 20) set.add(20);
  if (totalYears >= 25) set.add(25);
  if (totalYears >= 30) set.add(30);
  set.add(Math.round(totalYears));
  return Array.from(set).filter(y => y <= totalYears && y > 0).sort((a, b) => a - b);
}

interface AnalysisData {
  algorithmName: string;
  algorithmDefinition: string;
  calculationAssumptions: string[];
  formulaTitle: string;
  formulaTex: string;
  formulaDesc: string;
  variables: { symbol: string; label: string; value: string }[];
  calculationSteps: string[];
  kpis: { label: string; value: string; subtext: string; highlight?: boolean }[];
  scheduleTitle: string;
  scheduleHeaders: string[];
  scheduleRows: (string | number)[][];
  insights: string[];
  aboutContent: {
    heading: string;
    description: string;
    keyPoints: { title: string; desc: string }[];
  };
}

const InputSlider = ({ label, value, min, max, step = 1, onChange, prefix = "", suffix = "" }: any) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === "" ? "" : Number(e.target.value);
    onChange(val);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (isNaN(val)) val = min;
    if (val < min) val = min;
    if (val > max) val = max;
    onChange(val);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="bg-[#fff9eb] px-3 py-1.5 rounded-lg flex items-center justify-between sm:justify-end border border-orange-100 sm:min-w-[120px]">
          {prefix && <span className="text-[#fe9800] font-bold text-sm mr-1">{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="bg-transparent border-none outline-none font-bold text-[#fe9800] text-sm w-full text-right sm:text-right p-0 m-0 focus:ring-0"
            style={{ appearance: "textfield", MozAppearance: "textfield" }}
          />
          {suffix && <span className="text-[#fe9800] font-bold text-sm ml-1">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#fe9800] hover:accent-[#e58900] transition-all"
      />
      <div className="flex justify-between mt-1.5 text-[11px] font-medium text-gray-400">
        <span>{prefix}{min.toLocaleString('en-IN')}{suffix}</span>
        <span>{prefix}{max.toLocaleString('en-IN')}{suffix}</span>
      </div>
    </div>
  );
};

const ChartRenderer = ({ type, val1, val2, label1, label2, totalLabel, totalValue, subtext }: any) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const steps = 15;
  const chartData = Array.from({ length: steps }).map((_, i) => {
    const progress = (i + 1) / steps;
    const v1 = val1 * progress;
    const v2 = val2 * Math.pow(progress, 1.2);
    return {
      year: `Y${i + 1}`,
      [label1]: Math.round(v1),
      [label2]: Math.round(v2),
      total: Math.round(v1 + v2)
    };
  });

  const formatYAxis = (tickItem: any) => {
    if (tickItem === 0) return "0";
    if (tickItem >= 10000000) return `₹${(tickItem / 10000000).toFixed(1)}Cr`;
    if (tickItem >= 100000) return `₹${(tickItem / 100000).toFixed(1)}L`;
    if (tickItem >= 1000) return `₹${(tickItem / 1000).toFixed(1)}K`;
    return `₹${tickItem}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 text-sm min-w-[200px]">
          <p className="font-bold text-[#1a2332] mb-3 border-b border-gray-100 pb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center gap-6 mb-2">
              <span style={{ color: entry.color }} className="font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}
              </span>
              <span className="font-bold text-[#1a2332]">₹{entry.value.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (type === 'bar') {
    return (
      <div className="w-full min-w-0 h-full flex flex-col">
        <h4 className="font-bold text-[#1a2332] mb-1">Year-wise Breakdown</h4>
        <p className="text-xs text-gray-500 mb-6">{label1} and {label2} over time</p>
        <div className="w-full min-w-0 h-[250px] min-h-[250px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatYAxis} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey={label1} stackId="a" fill="#fde68a" radius={[0, 0, 4, 4]} />
                <Bar dataKey={label2} stackId="a" fill="#fe9800" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-gray-50/50 rounded-xl animate-pulse" />
          )}
        </div>
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className="w-full min-w-0 h-full flex flex-col">
        <h4 className="font-bold text-[#1a2332] mb-1">Growth Trend</h4>
        <p className="text-xs text-gray-500 mb-6">Track your wealth accumulation</p>
        <div className="w-full min-w-0 h-[250px] min-h-[250px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fe9800" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#fe9800" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatYAxis} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Area type="monotone" dataKey="total" name="Total Value" stroke="#fe9800" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-gray-50/50 rounded-xl animate-pulse" />
          )}
        </div>
      </div>
    );
  }

  const total = val1 + val2;
  const p1 = total === 0 ? 50 : (val1 / total) * 100;
  const p2 = total === 0 ? 50 : (val2 / total) * 100;

  return (
    <div className="w-full flex flex-col">
      <h4 className="font-bold text-[#1a2332] mb-1">{label1} vs {label2}</h4>
      <p className="text-xs text-gray-500 mb-8">Breakdown of your {totalLabel.toLowerCase()}</p>

      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full">
        <div className="relative w-56 h-56 flex-shrink-0">
          <svg width="100%" height="100%" viewBox="0 0 42 42" className="-rotate-90 drop-shadow-md">
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              stroke="#fde68a"
              strokeWidth="6"
              strokeDasharray={`${p1} ${100 - p1}`}
              className="transition-all hover:opacity-80 cursor-pointer"
            >
              <title>{`${label1}: ${p1.toFixed(1)}%`}</title>
            </circle>
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              stroke="#fe9800"
              strokeWidth="6"
              strokeDasharray={`${p2} ${100 - p2}`}
              strokeDashoffset={`-${p1}`}
              className="transition-all hover:opacity-80 cursor-pointer"
            >
              <title>{`${label2}: ${p2.toFixed(1)}%`}</title>
            </circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-3xl font-black text-[#1a2332] leading-none mb-1">
              {p2 > p1 ? p2.toFixed(0) : p1.toFixed(0)}%
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none max-w-[80px]">
              {p2 > p1 ? label2 : label1}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-6">
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2.5 h-2.5 rounded-full bg-[#fde68a]"></div>
                {label1}
              </div>
              <div className="font-bold">
                ₹{Number(val1).toLocaleString('en-IN', { maximumFractionDigits: 0 })}{" "}
                <span className="text-xs text-gray-400 font-normal ml-1">{p1.toFixed(0)}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#fde68a]" style={{ width: `${p1}%` }}></div>
            </div>

            <div className="flex justify-between items-center text-sm mt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2.5 h-2.5 rounded-full bg-[#fe9800]"></div>
                {label2}
              </div>
              <div className="font-bold">
                ₹{Number(val2).toLocaleString('en-IN', { maximumFractionDigits: 0 })}{" "}
                <span className="text-xs text-gray-400 font-normal ml-1">{p2.toFixed(0)}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#fe9800]" style={{ width: `${p2}%` }}></div>
            </div>
          </div>

          <div className="bg-[#fff9eb] p-5 rounded-xl border border-orange-100 mt-6">
            <p className="text-xs text-gray-500 mb-1">{totalLabel}</p>
            <p className="text-2xl font-bold text-[#fe9800]">
              ₹{Number(totalValue).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            {subtext && <p className="text-[11px] text-gray-400 mt-1">{subtext}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const CalculatorLayout = ({
  inputs,
  reportInputs,
  val1,
  val2,
  label1,
  label2,
  totalLabel,
  totalValue,
  subtext,
  results,
  activeCalc,
  calculatorsList,
  setActiveCalcId,
  analysisData
}: any) => {
  const [chartType, setChartType] = useState("pie");
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const wasPreviewOpen = showPreview;
    if (!wasPreviewOpen) setShowPreview(true);

    setTimeout(async () => {
      try {
        const page1 = document.getElementById("pdf-report-page-1");
        const page2 = document.getElementById("pdf-report-page-2");
        if (!page1) {
          setIsDownloading(false);
          return;
        }

        const loadScript = (src: string) => {
          return new Promise((resolve, reject) => {
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
              const isLoaded =
                (src.includes("html-to-image") && (window as any).htmlToImage) ||
                (src.includes("jspdf") && (window as any).jspdf);
              if (isLoaded) return resolve(true);
              existingScript.addEventListener("load", resolve);
              existingScript.addEventListener("error", reject);
              return;
            }
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        };

        await Promise.all([
          !(window as any).htmlToImage
            ? loadScript("https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js")
            : Promise.resolve(),
          !(window as any).jspdf
            ? loadScript("https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js")
            : Promise.resolve()
        ]);

        const { jsPDF } = (window as any).jspdf;
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [794, 1123]
        });

        // Capture Page 1 (Executive Summary)
        const img1 = await (window as any).htmlToImage.toPng(page1, { pixelRatio: 2 });
        pdf.addImage(img1, "PNG", 0, 0, 794, 1123);

        // Capture Page 2 (Detailed Calculation Analysis)
        if (page2) {
          const img2 = await (window as any).htmlToImage.toPng(page2, { pixelRatio: 2 });
          pdf.addPage([794, 1123], "portrait");
          pdf.addImage(img2, "PNG", 0, 0, 794, 1123);
        }

        pdf.save(`solid_wealth_${activeCalc.id}_report.pdf`);
        setIsDownloading(false);
        if (!wasPreviewOpen) setShowPreview(false);
      } catch (err) {
        console.error("Error generating multi-page PDF", err);
        setIsDownloading(false);
      }
    }, 500);
  };

  const pieTotal = val1 + val2;
  const p1 = pieTotal === 0 ? 50 : (val1 / pieTotal) * 100;
  const p2 = pieTotal === 0 ? 50 : (val2 / pieTotal) * 100;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Upper Grid: Inputs + Charts */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Sliders + Result Summary Cards */}
        <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-6 print:hidden">
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-[#1a2332] text-lg">Calculation Details</h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-orange-50 text-[#fe9800] rounded-full">
                Interactive
              </span>
            </div>

            <div className="space-y-6">{inputs}</div>

            <div className="mt-8 space-y-3">
              {results.map((r: any, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "flex justify-between items-center rounded-xl px-4 py-3 border border-gray-100 transition-all",
                    r.highlight ? "bg-[#fff9eb] border-orange-200 shadow-sm" : "bg-gray-50/50"
                  )}
                >
                  <span className={cn("text-sm font-medium", r.highlight ? "text-gray-800 font-semibold" : "text-gray-500")}>
                    {r.label}
                  </span>
                  <span className={cn("font-bold", r.highlight ? "text-[#fe9800] text-lg" : "text-[#1a2332]")}>
                    {r.isCurrency !== false ? "₹" : ""}
                    {Number(r.value).toLocaleString("en-IN", { maximumFractionDigits: 1 })}
                    {r.suffix ? r.suffix : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Download Reports Box */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-[#1a2332] text-lg mb-2">Download Reports</h3>
            <p className="text-xs text-gray-500 mb-6">
              Includes 2-page detailed calculation analysis, algorithm definition, formula breakdown, and milestone schedule.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 hover:border-orange-200 transition-colors text-sm"
              >
                <Eye size={18} /> Preview Report (2 Pages)
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#fe9800] text-white font-bold hover:bg-[#e58900] transition-colors text-sm shadow-md shadow-orange-500/20 disabled:opacity-70"
              >
                <Download size={18} /> {isDownloading ? "Generating PDF..." : "Download Full PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Chart + Other Calculators */}
        <div className="flex-1 w-full flex flex-col gap-6 print:hidden">
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col min-h-[450px]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex bg-gray-100/80 p-1 rounded-full overflow-x-auto w-full sm:w-auto hide-scrollbar">
                <button
                  onClick={() => setChartType("pie")}
                  className={cn(
                    "flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2 text-sm font-semibold rounded-full flex items-center gap-2 transition-all whitespace-nowrap",
                    chartType === "pie" ? "bg-[#fe9800] text-white shadow" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <PieChart size={16} /> <span className="hidden sm:inline">Pie Chart</span><span className="sm:hidden">Pie</span>
                </button>
                <button
                  onClick={() => setChartType("bar")}
                  className={cn(
                    "flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2 text-sm font-semibold rounded-full flex items-center gap-2 transition-all whitespace-nowrap",
                    chartType === "bar" ? "bg-[#fe9800] text-white shadow" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <BarChart2 size={16} /> <span className="hidden sm:inline">Bar Chart</span><span className="sm:hidden">Bar</span>
                </button>
                <button
                  onClick={() => setChartType("line")}
                  className={cn(
                    "flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2 text-sm font-semibold rounded-full flex items-center gap-2 transition-all whitespace-nowrap",
                    chartType === "line" ? "bg-[#fe9800] text-white shadow" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <LineChart size={16} /> <span className="hidden sm:inline">Line Chart</span><span className="sm:hidden">Line</span>
                </button>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 w-full sm:w-auto rounded-full bg-[#fe9800] text-white text-sm font-bold hover:bg-[#e58900] transition-colors shadow-md shadow-orange-500/20 disabled:opacity-70"
              >
                <Download size={16} /> {isDownloading ? "Generating..." : "Download PDF"}
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <ChartRenderer
                type={chartType}
                val1={val1}
                val2={val2}
                label1={label1}
                label2={label2}
                totalLabel={totalLabel}
                totalValue={totalValue}
                subtext={subtext}
              />
            </div>
          </div>

          {/* Other Calculators Picker */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-[#1a2332] text-lg mb-6">Explore Other Financial Calculators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {calculatorsList
                .filter((c: any) => c.id !== activeCalc.id)
                .map((calc: any) => (
                  <button
                    key={calc.id}
                    onClick={() => setActiveCalcId(calc.id)}
                    className="flex items-center justify-between px-5 py-4 rounded-xl border border-gray-100 hover:border-[#fe9800]/30 hover:bg-orange-50/30 transition-colors text-left group bg-gray-50/50"
                  >
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">
                      {calc.label}
                    </span>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-[#fe9800]" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED CALCULATION ANALYSIS & INSIGHTS SECTION (ON-PAGE) */}
      {analysisData && (
        <div className="w-full bg-white rounded-[24px] border border-gray-100 p-6 sm:p-8 md:p-10 shadow-sm print:hidden">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 text-[#fe9800] text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={14} /> Calculation Deep-Dive
                </span>
                <span className="text-xs text-gray-400 font-medium">Live Dynamic Analysis</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1a2332]">
                Detailed Calculation Analysis & Breakdown
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Transparency into how your {activeCalc.label} numbers are derived, step-by-step mathematical formulation, and key milestone projections.
              </p>
            </div>
            <button
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-orange-200 text-[#fe9800] hover:bg-orange-50 font-bold text-sm transition-colors whitespace-nowrap self-start md:self-auto"
            >
              <FileText size={16} /> View in PDF Report
            </button>
          </div>

          {/* Algorithm Definition & Assumptions Card (On-Page) */}
          <div className="mb-10 bg-gray-50/80 border border-gray-200/80 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-[#fe9800] flex-shrink-0">
                  <Cpu size={20} />
                </span>
                <div>
                  <span className="text-xs font-bold text-[#fe9800] uppercase tracking-widest">Algorithm Used</span>
                  <h3 className="text-lg font-bold text-[#1a2332]">{analysisData.algorithmName}</h3>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-white rounded-full border border-gray-200 text-gray-600">
                Mathematical Convention
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-5">{analysisData.algorithmDefinition}</p>
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Key Algorithmic Conventions & Assumptions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {analysisData.calculationAssumptions.map((assump: string, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle2 size={14} className="text-[#fe9800] flex-shrink-0 mt-0.5" />
                    <span>{assump}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Financial Indicators / KPIs Grid */}
          <div className="mb-10">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers size={14} className="text-[#fe9800]" /> Key Analytical Metrics & Ratios
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysisData.kpis.map((kpi: any, idx: number) => (
                <div
                  key={idx}
                  className={cn(
                    "p-5 rounded-2xl border transition-all",
                    kpi.highlight
                      ? "bg-[#fff9eb] border-orange-200 shadow-sm"
                      : "bg-gray-50/70 border-gray-100 hover:border-orange-100"
                  )}
                >
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{kpi.label}</p>
                  <p className={cn("text-2xl font-black mb-1", kpi.highlight ? "text-[#fe9800]" : "text-[#1a2332]")}>
                    {kpi.value}
                  </p>
                  <p className="text-xs text-gray-500">{kpi.subtext}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical Formula & Substitution Engine */}
          <div className="mb-10 bg-[#FFFDF4] border border-orange-100 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-bold text-[#fe9800] uppercase tracking-widest">Mathematical Formula</span>
                <h3 className="text-lg font-bold text-[#1a2332]">{analysisData.formulaTitle}</h3>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border border-orange-200/80 shadow-xs">
                <code className="text-sm font-bold text-[#fe9800] font-mono">{analysisData.formulaTex}</code>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{analysisData.formulaDesc}</p>

            {/* Variable Substitutions */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Parameters & Substituted Values</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {analysisData.variables.map((v: any, idx: number) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-orange-100 flex flex-col justify-between">
                    <span className="text-xs text-gray-400 font-medium">{v.label}</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono font-bold text-[#fe9800] text-sm">{v.symbol}</span>
                      <span className="text-sm font-black text-[#1a2332]">{v.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Numerical Walkthrough */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Step-by-Step Calculation Walkthrough</h4>
              <div className="space-y-2.5">
                {analysisData.calculationSteps.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/80 p-3 rounded-xl border border-orange-50 text-sm">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#fe9800] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 font-medium leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Milestone Schedule Table */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Growth & Amortization Timeline</h3>
                <h4 className="text-lg font-bold text-[#1a2332]">{analysisData.scheduleTitle}</h4>
              </div>
              <span className="text-xs text-gray-400 font-medium">Periodic milestone schedule</span>
            </div>

            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80">
                      {analysisData.scheduleHeaders.map((header: string, i: number) => (
                        <th key={i} className="py-3.5 px-4 font-bold text-gray-600 text-xs uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {analysisData.scheduleRows.map((row: any[], rIdx: number) => (
                      <tr
                        key={rIdx}
                        className={cn(
                          "hover:bg-orange-50/30 transition-colors",
                          rIdx === analysisData.scheduleRows.length - 1 ? "bg-orange-50/40 font-bold" : ""
                        )}
                      >
                        {row.map((cell: any, cIdx: number) => (
                          <td
                            key={cIdx}
                            className={cn(
                              "py-3.5 px-4",
                              cIdx === 0 ? "font-bold text-[#1a2332]" : "text-gray-600 font-medium",
                              rIdx === analysisData.scheduleRows.length - 1 && cIdx === row.length - 1
                                ? "text-[#fe9800] font-black"
                                : ""
                            )}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Actionable Strategic Insights & Optimization Tips */}
          <div className="bg-[#fff9eb] border border-orange-100 rounded-2xl p-6 sm:p-8">
            <h3 className="text-base font-bold text-[#1a2332] mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-[#fe9800]" /> Strategic Insights & Financial Takeaways
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisData.insights.map((insight: string, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-orange-200/60 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#fe9800] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      {analysisData?.aboutContent && (
        <div className="bg-white rounded-[24px] border border-gray-100 p-8 md:p-10 shadow-sm text-[#44475b] text-[16px] leading-relaxed mt-2 print:hidden">
          <div className="flex items-center gap-2.5 mb-4">
            <BookOpen size={20} className="text-[#fe9800]" />
            <h2 className="text-2xl font-bold text-[#1a2332]">{analysisData.aboutContent.heading}</h2>
          </div>
          <p className="mb-6 leading-relaxed text-gray-600">{analysisData.aboutContent.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
            {analysisData.aboutContent.keyPoints.map((pt: any, i: number) => (
              <div key={i} className="space-y-1.5">
                <h4 className="font-bold text-[#1a2332] text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe9800]"></span>
                  {pt.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">{pt.desc}</p>
              </div>
            ))}
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
                <h3 className="font-bold text-xl text-[#1a2332]">Report Preview (2 Pages)</h3>
                <p className="text-xs text-gray-500">
                  Page 1: Executive Summary & Visuals • Page 2: Algorithm, Calculation Details & Schedule
                </p>
              </div>
              <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#fe9800] text-white text-sm font-bold hover:bg-[#e58900] transition-colors shadow-md shadow-orange-500/20 disabled:opacity-70"
                >
                  <Download size={16} /> {isDownloading ? "Generating..." : "Save 2-Page PDF"}
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-10 sm:w-9 h-10 sm:h-9 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-500 font-bold border border-gray-200 sm:border-transparent"
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
                  Page 1 of 2: Executive Summary
                </span>
                <div
                  id="pdf-report-page-1"
                  className="w-[794px] min-w-[794px] h-[1123px] bg-white shadow-xl print:shadow-none relative overflow-hidden flex-shrink-0"
                >
                  <img src="/Printable.svg" alt="Template Header" className="w-full h-auto object-cover opacity-80" />

                  {/* pb-20 keeps content clear of the www.solidwealth.in mark the
                      Printable.svg template draws over the bottom ~68px of the page. */}
                  <div className="absolute top-0 left-0 w-full h-full pt-[250px] px-16 flex flex-col pb-20">
                    <div className="flex justify-between items-end border-b-2 border-gray-100 pb-5 mb-5">
                      <div>
                        <span className="text-xs font-bold tracking-widest text-[#fe9800] uppercase">
                          Solid Wealth Financial Report
                        </span>
                        <h1 className="text-3xl font-black text-[#1a2332]">{activeCalc.label} Summary</h1>
                      </div>
                      <span className="text-xs font-bold text-gray-400">Page 1 of 2</span>
                    </div>

                    {/* Algorithm & Formula Callout Banner on Page 1 */}
                    {analysisData && (
                      <div className="bg-[#FFFDF4] border border-orange-200/70 rounded-xl px-4 py-2.5 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#1a2332] uppercase tracking-wider">Algorithm:</span>
                          <span className="text-xs text-gray-700 font-semibold">{analysisData.algorithmName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-400 font-medium">Formula:</span>
                          <code className="text-xs font-mono font-bold text-[#fe9800] bg-white px-2.5 py-0.5 rounded border border-orange-200">
                            {analysisData.formulaTex}
                          </code>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-12 w-full">
                      {/* Inputs Column */}
                      <div className="flex-1">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Input Parameters</h3>
                        <div className="space-y-3">
                          {reportInputs &&
                            reportInputs.map((r: any, i: number) => (
                              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-600 font-medium text-sm">{r.label}</span>
                                <span className="font-bold text-[#1a2332] text-base">
                                  {r.isCurrency !== false ? "₹" : ""}
                                  {Number(r.value).toLocaleString("en-IN", { maximumFractionDigits: 1 })}
                                  {r.suffix ? ` ${r.suffix}` : ""}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Results Column */}
                      <div className="flex-1">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Calculation Results</h3>
                        <div className="space-y-3">
                          {results.map((r: any, i: number) => (
                            <div
                              key={i}
                              className={cn(
                                "flex justify-between items-center py-2 border-b",
                                r.highlight
                                  ? "border-orange-200 bg-orange-50/60 -mx-3 px-3 rounded-lg"
                                  : "border-gray-50"
                              )}
                            >
                              <span className={cn("font-medium text-sm", r.highlight ? "text-[#fe9800] font-bold" : "text-gray-600")}>
                                {r.label}
                              </span>
                              <span className={cn("font-bold text-base", r.highlight ? "text-[#fe9800]" : "text-[#1a2332]")}>
                                {r.isCurrency !== false ? "₹" : ""}
                                {Number(r.value).toLocaleString("en-IN", { maximumFractionDigits: 1 })}
                                {r.suffix ? ` ${r.suffix}` : ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Total Summary Box & Donut Chart */}
                    <div className="mt-8 flex gap-8">
                      <div className="flex-1 bg-[#fff9eb] rounded-2xl p-7 border border-orange-100 flex flex-col justify-center shadow-xs">
                        <p className="text-gray-500 font-medium mb-1.5 uppercase tracking-widest text-xs">{totalLabel}</p>
                        <p className="text-3xl font-black text-[#fe9800] mb-6">
                          ₹{Number(totalValue).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </p>

                        <div className="space-y-3 w-full">
                          <div className="flex justify-between items-center border-b border-orange-100 pb-2.5 gap-4">
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#fde68a]"></div>
                              <span className="text-gray-600 font-medium text-xs whitespace-nowrap">{label1}</span>
                            </div>
                            <div className="font-bold text-sm text-[#1a2332] text-right truncate">
                              ₹{Number(val1).toLocaleString("en-IN", { maximumFractionDigits: 0 })}{" "}
                              <span className="text-xs font-normal text-gray-400 ml-1">({p1.toFixed(0)}%)</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#fe9800]"></div>
                              <span className="text-gray-600 font-medium text-xs whitespace-nowrap">{label2}</span>
                            </div>
                            <div className="font-bold text-sm text-[#1a2332] text-right truncate">
                              ₹{Number(val2).toLocaleString("en-IN", { maximumFractionDigits: 0 })}{" "}
                              <span className="text-xs font-normal text-gray-400 ml-1">({p2.toFixed(0)}%)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-[280px] bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xs">
                        <div className="relative w-36 h-36">
                          <svg width="100%" height="100%" viewBox="0 0 42 42" className="-rotate-90 drop-shadow-sm">
                            <circle
                              cx="21"
                              cy="21"
                              r="15.91549430918954"
                              fill="transparent"
                              stroke="#fde68a"
                              strokeWidth="6"
                              strokeDasharray={`${p1} ${100 - p1}`}
                            />
                            <circle
                              cx="21"
                              cy="21"
                              r="15.91549430918954"
                              fill="transparent"
                              stroke="#fe9800"
                              strokeWidth="6"
                              strokeDasharray={`${p2} ${100 - p2}`}
                              strokeDashoffset={`-${p1}`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10">
                            <span className="text-2xl font-black text-[#1a2332] leading-none mb-1">
                              {p2 > p1 ? p2.toFixed(0) : p1.toFixed(0)}%
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none max-w-[80px]">
                              {p2 > p1 ? label2 : label1}
                            </span>
                          </div>
                        </div>
                        <p className="text-center text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">
                          Visual Proportion
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto text-center text-xs text-gray-400 pt-6 border-t border-gray-100">
                      Generated by Solid Wealth Financial Calculators. Detailed algorithm and calculation methodology on Page 2.
                    </div>
                  </div>
                </div>
              </div>

              {/* PAGE 2: DETAILED CALCULATION ANALYSIS */}
              {analysisData && (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 print:hidden">
                    Page 2 of 2: Algorithm, Calculation Details & Schedule
                  </span>
                  <div
                    id="pdf-report-page-2"
                    className="w-[794px] min-w-[794px] h-[1123px] bg-white shadow-xl print:shadow-none relative overflow-hidden flex-shrink-0"
                  >
                    <img
                      src="/Printable.svg"
                      alt="Template Background"
                      className="w-full h-auto object-cover opacity-80 absolute top-0 left-0 pointer-events-none"
                    />

                    {/* pb-20: same footer band reserved as page 1. */}
                    <div className="relative z-10 w-full h-full pt-[220px] px-14 flex flex-col pb-20">
                      {/* Page 2 Header */}
                      <div className="flex justify-between items-end border-b-2 border-gray-100 pb-3 mb-3">
                        <div>
                          <span className="text-[10px] font-bold tracking-widest text-[#fe9800] uppercase">
                            Calculation Methodology & Details
                          </span>
                          <h2 className="text-2xl font-black text-[#1a2332]">{activeCalc.label} Algorithm & Schedule</h2>
                        </div>
                        <span className="text-xs font-bold text-gray-400">Page 2 of 2</span>
                      </div>

                      {/* ALGORITHM DEFINITION & MATHEMATICAL FORMULA CARD (PAGE 2) */}
                      <div className="bg-[#FFFDF4] border border-orange-100 rounded-xl p-3 mb-2.5">
                        {/* Algorithm Name & Formula Bar */}
                        <div className="flex justify-between items-center mb-1.5 pb-1.5 border-b border-orange-100/70">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#fe9800]"></span>
                            <span className="text-[11px] font-bold text-[#1a2332] uppercase tracking-wider">
                              Algorithm: {analysisData.algorithmName}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-orange-200 text-[#fe9800] font-bold shadow-2xs">
                            {analysisData.formulaTex}
                          </span>
                        </div>

                        {/* Algorithm Definition */}
                        <div className="mb-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
                            Algorithm Definition:
                          </span>
                          <p className="text-[10px] text-gray-700 leading-relaxed">{analysisData.algorithmDefinition}</p>
                        </div>

                        {/* Variables Grid */}
                        <div className="grid grid-cols-3 gap-2 bg-white/80 p-2 rounded-lg border border-orange-50 text-[10px] mb-2">
                          {analysisData.variables.slice(0, 3).map((v: any, idx: number) => (
                            <div key={idx} className="truncate">
                              <span className="font-bold text-[#fe9800]">{v.symbol}</span> ={" "}
                              <span className="font-semibold text-gray-800">{v.value}</span>{" "}
                              <span className="text-gray-400 text-[9px]">({v.label})</span>
                            </div>
                          ))}
                        </div>

                        {/* Step-by-Step Numerical Walkthrough */}
                        <div className="pt-1.5 border-t border-orange-100">
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                            Mathematical Calculation Derivation & Substituted Steps:
                          </span>
                          <div className="space-y-0.5">
                            {analysisData.calculationSteps.slice(0, 4).map((step: string, sIdx: number) => (
                              <div key={sIdx} className="flex items-start gap-1.5 text-[9.5px] text-gray-700">
                                <span className="w-3.5 h-3.5 rounded-full bg-orange-100 text-[#fe9800] font-bold text-[8px] flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span className="leading-snug">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 4 Analytical KPI Cards */}
                      <div className="grid grid-cols-4 gap-2 mb-2.5">
                        {analysisData.kpis.slice(0, 4).map((kpi: any, idx: number) => (
                          <div
                            key={idx}
                            className={cn(
                              "border rounded-xl p-2 text-center",
                              kpi.highlight ? "bg-[#fff9eb] border-orange-200" : "bg-gray-50 border-gray-100"
                            )}
                          >
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 truncate">
                              {kpi.label}
                            </p>
                            <p
                              className={cn(
                                "text-sm font-black truncate",
                                kpi.highlight ? "text-[#fe9800]" : "text-[#1a2332]"
                              )}
                            >
                              {kpi.value}
                            </p>
                            <p className="text-[8.5px] text-gray-500 mt-0.5 truncate">{kpi.subtext}</p>
                          </div>
                        ))}
                      </div>

                      {/* Milestone Schedule Table */}
                      <div className="border border-gray-100 rounded-xl overflow-hidden mb-2.5 bg-white">
                        <div className="bg-gray-50 px-3 py-1 border-b border-gray-100 flex justify-between items-center">
                          <h4 className="text-[10px] font-bold text-[#1a2332] uppercase tracking-wider">
                            {analysisData.scheduleTitle}
                          </h4>
                          <span className="text-[9px] text-gray-400">Timeline Projection</span>
                        </div>
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                              {analysisData.scheduleHeaders.map((h: string, i: number) => (
                                <th key={i} className="py-1 px-3 text-[9px] font-bold text-gray-500 uppercase">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 text-[10px]">
                            {analysisData.scheduleRows.slice(0, 5).map((row: any[], rIdx: number) => (
                              <tr
                                key={rIdx}
                                className={cn(
                                  rIdx % 2 === 0 ? "bg-white" : "bg-orange-50/15",
                                  rIdx === analysisData.scheduleRows.slice(0, 5).length - 1 ? "font-bold text-gray-900" : ""
                                )}
                              >
                                {row.map((cell: any, cIdx: number) => (
                                  <td
                                    key={cIdx}
                                    className={cn(
                                      "py-1 px-3",
                                      cIdx === 0 ? "font-bold text-gray-700" : "text-gray-600 font-medium"
                                    )}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Strategic Financial Insights Box */}
                      <div className="bg-[#fff9eb] border border-orange-200/70 rounded-xl p-2.5 mb-2">
                        <h4 className="text-[10px] font-bold text-[#fe9800] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Sparkles size={11} /> Strategic Financial Insights & Takeaways
                        </h4>
                        <ul className="text-[10px] text-gray-700 space-y-0.5">
                          {analysisData.insights.slice(0, 3).map((ins: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-[#fe9800] font-bold">•</span>
                              <span className="leading-snug">{ins}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Footer Disclaimer */}
                      <div className="mt-auto text-center text-[9.5px] text-gray-400 pt-2 border-t border-gray-100">
                        Generated by Solid Wealth Financial Calculators. Calculation algorithms conform to standard quantitative finance and statutory accounting practices.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 1. EMI CALCULATOR
const EMICalculator = (props: any) => {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const r = rate / 12 / 100;
  const n = years * 12;
  const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - loanAmount;

  const interestPercentOfPrincipal = ((totalInterest / loanAmount) * 100).toFixed(1);
  const totalCostMultiplier = (totalPayment / loanAmount).toFixed(2);
  const dailyInterest = Math.round(totalInterest / (years * 365));

  const milestones = getMilestones(years);
  const scheduleRows = milestones.map((y) => {
    const m = y * 12;
    const balance = Math.max(0, loanAmount * Math.pow(1 + r, m) - (emi * (Math.pow(1 + r, m) - 1)) / r);
    const cumPrincipal = loanAmount - balance;
    const cumInterest = emi * m - cumPrincipal;
    return [
      `Year ${y}`,
      `₹${formatINR(cumPrincipal)}`,
      `₹${formatINR(cumInterest)}`,
      `₹${formatINR(balance)}`
    ];
  });

  const analysisData: AnalysisData = {
    algorithmName: "Reducing Balance Amortization Algorithm",
    algorithmDefinition:
      "Calculates equal monthly repayments where interest is computed strictly on the declining outstanding principal balance at each monthly rest. At each cycle, interest accrued is I = Balance × (Rate / 12), and principal paid is P = EMI - I, reducing the next month's principal basis.",
    calculationAssumptions: [
      "Monthly compounding rest convention (30/360 daycount)",
      "Fixed rate of interest throughout tenure",
      "Zero prepayments or penalty adjustments in baseline model"
    ],
    formulaTitle: "Reducing Balance Loan Amortization",
    formulaTex: "EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]",
    formulaDesc:
      "EMI (Equated Monthly Installment) is derived by equating the present value of all future monthly cashflows to the initial principal borrowed.",
    variables: [
      { symbol: "P", label: "Principal Loan", value: `₹${formatINR(loanAmount)}` },
      { symbol: "r", label: "Monthly Interest Rate", value: `${(rate / 12).toFixed(4)}%` },
      { symbol: "n", label: "Total Months", value: `${n} EMIs` }
    ],
    calculationSteps: [
      `Convert annual interest ${rate}% to monthly rate r = ${rate} / (12 × 100) = ${(r).toFixed(6)}.`,
      `Calculate total monthly installments n = ${years} years × 12 = ${n} months.`,
      `Compute compounding factor (1 + r)^n = (1 + ${(r).toFixed(6)})^${n} = ${Math.pow(1 + r, n).toFixed(4)}.`,
      `Evaluate numerator [P × r × (1+r)^n] = ₹${loanAmount.toLocaleString("en-IN")} × ${(r * Math.pow(1 + r, n)).toFixed(6)}.`,
      `Divide by denominator [(1+r)^n - 1] to arrive at monthly EMI: ₹${formatINR(emi)}.`
    ],
    kpis: [
      { label: "Monthly EMI", value: `₹${formatINR(emi)}`, subtext: `${n} monthly payments`, highlight: true },
      { label: "Interest to Principal", value: `${interestPercentOfPrincipal}%`, subtext: totalInterest > loanAmount ? "Interest exceeds loan amount" : "Of borrowed principal" },
      { label: "Repayment Multiplier", value: `${totalCostMultiplier}x`, subtext: "Total cash repayment vs loan" },
      { label: "Daily Interest Cost", value: `₹${formatINR(dailyInterest)}/day`, subtext: "Average interest burden per day" }
    ],
    scheduleTitle: "Loan Amortization Milestone Schedule",
    scheduleHeaders: ["Milestone", "Principal Paid", "Interest Paid", "Outstanding Balance"],
    scheduleRows,
    insights: [
      `Total interest amounts to ₹${formatINR(totalInterest)}, representing ${((totalInterest / totalPayment) * 100).toFixed(0)}% of your overall loan repayment.`,
      `In the initial years, your EMI is interest-heavy: approximately ${((loanAmount * r / emi) * 100).toFixed(0)}% of your first year payment goes toward interest rather than reducing the principal.`,
      `Prepayment Tip: Making just 1 extra EMI payment per year can shorten your tenure by ~${Math.max(1, Math.round(years * 0.18))} years and save substantial interest.`
    ],
    aboutContent: {
      heading: "About EMI Calculations",
      description:
        "An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs apply to home loans, car loans, and personal loans, paying off both principal and interest over the agreed tenure.",
      keyPoints: [
        { title: "Front-Loaded Interest", desc: "Earlier EMIs consist mostly of interest, while later payments pay down principal rapidly." },
        { title: "Tenure vs Total Interest", desc: "Longer tenures reduce monthly EMI but drastically inflate total interest paid over time." },
        { title: "Prepayment Strategy", desc: "Early partial prepayments directly reduce the principal balance, saving the most interest." }
      ]
    }
  };

  return (
    <CalculatorLayout
      {...props}
      inputs={
        <>
          <InputSlider label="Loan Amount" value={loanAmount} min={100000} max={10000000} step={10000} prefix="₹" onChange={setLoanAmount} />
          <InputSlider label="Interest Rate (p.a.)" value={rate} min={1} max={20} step={0.1} suffix="%" onChange={setRate} />
          <InputSlider label="Loan Tenure" value={years} min={1} max={30} step={1} suffix="Yr" onChange={setYears} />
        </>
      }
      reportInputs={[
        { label: "Loan Amount", value: loanAmount },
        { label: "Interest Rate (p.a.)", value: rate, suffix: "%", isCurrency: false },
        { label: "Loan Tenure", value: years, suffix: "Years", isCurrency: false }
      ]}
      results={[
        { label: "Monthly EMI", value: emi, highlight: true },
        { label: "Principal Amount", value: loanAmount },
        { label: "Total Interest", value: totalInterest },
        { label: "Total Amount", value: totalPayment }
      ]}
      val1={loanAmount}
      val2={totalInterest}
      label1="Principal"
      label2="Total Interest"
      totalLabel="Total Payment"
      totalValue={totalPayment}
      subtext={`over ${years} years (${n} EMIs)`}
      analysisData={analysisData}
    />
  );
};

// 2. SIP CALCULATOR
const SIPCalculator = (props: any) => {
  const [monthly, setMonthly] = useState(25000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const i = rate / 100 / 12;
  const n = years * 12;
  const futureValue = monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const invested = monthly * n;
  const wealthGained = futureValue - invested;

  const wealthMultiplier = (futureValue / invested).toFixed(2);
  const gainPercentage = ((wealthGained / invested) * 100).toFixed(1);
  const returnsShare = ((wealthGained / futureValue) * 100).toFixed(0);
  const inflationAdjusted = Math.round(futureValue / Math.pow(1.06, years));

  const milestones = getMilestones(years);
  const scheduleRows = milestones.map((y) => {
    const m = y * 12;
    const inv = monthly * m;
    const fv = monthly * ((Math.pow(1 + i, m) - 1) / i) * (1 + i);
    const ret = fv - inv;
    return [`Year ${y}`, `₹${formatINR(monthly)}/mo`, `₹${formatINR(inv)}`, `₹${formatINR(ret)}`, `₹${formatINR(fv)}`];
  });

  const analysisData: AnalysisData = {
    algorithmName: "Periodic Annuity Due Compounding Algorithm",
    algorithmDefinition:
      "A geometric progression compounding algorithm for recurrent cash inflows executed at the beginning of each calendar month (annuity due). Each monthly tranche compounds independently at periodic interest i = Rate / 12 over its individual residual holding period.",
    calculationAssumptions: [
      "Cash inflows deployed on the first day of each month (Annuity Due)",
      "Continuous geometric reinvestment of returns without dividend leakage",
      "Constant annualized return rate over the full compounding horizon"
    ],
    formulaTitle: "Compound Interest on Annuity (SIP)",
    formulaTex: "FV = P × [((1+i)^n - 1) / i] × (1+i)",
    formulaDesc:
      "The annuity due formula accounts for the immediate deployment of monthly contributions, multiplying by (1 + i) to reflect initial-day deposit timing.",
    variables: [
      { symbol: "P", label: "Monthly Deposit", value: `₹${formatINR(monthly)}` },
      { symbol: "i", label: "Monthly Periodic Return", value: `${(rate / 12).toFixed(4)}%` },
      { symbol: "n", label: "Total Contributions", value: `${n} months` }
    ],
    calculationSteps: [
      `Convert annual return ${rate}% to periodic monthly rate i = ${rate} / (12 × 100) = ${(i).toFixed(6)}.`,
      `Determine total monthly installments n = ${years} years × 12 = ${n} payments.`,
      `Calculate accumulated compound factor ((1 + i)^n - 1) / i = ${(((Math.pow(1 + i, n) - 1) / i)).toFixed(4)}.`,
      `Multiply by monthly deposit P and annuity multiplier (1 + i) to reach final wealth: ₹${formatINR(futureValue)}.`,
      `Total wealth gained from compounding returns: ₹${formatINR(wealthGained)}.`
    ],
    kpis: [
      { label: "Wealth Multiplier", value: `${wealthMultiplier}x`, subtext: "Capital multiplication factor", highlight: true },
      { label: "Net Gain", value: `+${gainPercentage}%`, subtext: "Total return over investment" },
      { label: "Compounding Share", value: `${returnsShare}%`, subtext: "Of total corpus came from returns" },
      { label: "Real Value (6% infl.)", value: `₹${formatINR(inflationAdjusted)}`, subtext: "Purchasing power in today's money" }
    ],
    scheduleTitle: "SIP Wealth Accumulation Milestones",
    scheduleHeaders: ["Milestone", "Monthly SIP", "Total Invested", "Est. Returns", "Total Corpus"],
    scheduleRows,
    insights: [
      `Power of Compounding: Your returns account for ${returnsShare}% of your final corpus, meaning returns surpass your actual out-of-pocket deposits.`,
      `Dollar-Cost Averaging: Investing monthly removes the need to time market peaks and valleys, steadily accumulating units at average prices.`,
      `Step-Up Advantage: Increasing your monthly SIP by just 10% each year can add up to 35-45% more wealth over the same duration.`
    ],
    aboutContent: {
      heading: "About Systematic Investment Plans (SIP)",
      description:
        "SIP allows you to invest a fixed amount regularly in mutual funds. It promotes financial discipline, automates savings, and harnesses the exponential power of compounding over long investment horizons.",
      keyPoints: [
        { title: "Rupee Cost Averaging", desc: "Automatically buy more fund units when prices are down and fewer when prices are high." },
        { title: "Compounding Effect", desc: "Reinvested returns generate returns of their own, creating exponential curve growth over 10+ years." },
        { title: "Inflation Hedge", desc: "Equities historically beat inflation by 4-6% p.a., safeguarding your future purchasing power." }
      ]
    }
  };

  return (
    <CalculatorLayout
      {...props}
      inputs={
        <>
          <InputSlider label="Monthly Investment" value={monthly} min={500} max={1000000} step={500} prefix="₹" onChange={setMonthly} />
          <InputSlider label="Expected Return (p.a.)" value={rate} min={1} max={30} step={0.1} suffix="%" onChange={setRate} />
          <InputSlider label="Time Period" value={years} min={1} max={40} step={1} suffix="Yr" onChange={setYears} />
        </>
      }
      reportInputs={[
        { label: "Monthly Investment", value: monthly },
        { label: "Expected Return (p.a.)", value: rate, suffix: "%", isCurrency: false },
        { label: "Time Period", value: years, suffix: "Years", isCurrency: false }
      ]}
      results={[
        { label: "Invested Amount", value: invested },
        { label: "Est. Returns", value: wealthGained },
        { label: "Total Value", value: futureValue, highlight: true }
      ]}
      val1={invested}
      val2={wealthGained}
      label1="Invested Amount"
      label2="Est. Returns"
      totalLabel="Total Value"
      totalValue={futureValue}
      subtext={`over ${years} years`}
      analysisData={analysisData}
    />
  );
};

// 3. LUMPSUM CALCULATOR
const LumpsumCalculator = (props: any) => {
  const [lumpsum, setLumpsum] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const futureValue = lumpsum * Math.pow(1 + rate / 100, years);
  const wealthGained = futureValue - lumpsum;

  const wealthMultiplier = (futureValue / lumpsum).toFixed(2);
  const doublingPeriod = (72 / rate).toFixed(1);
  const gainPercentage = ((wealthGained / lumpsum) * 100).toFixed(1);
  const inflationAdjusted = Math.round(futureValue / Math.pow(1.06, years));

  const milestones = getMilestones(years);
  const scheduleRows = milestones.map((y) => {
    const fv = lumpsum * Math.pow(1 + rate / 100, y);
    return [`Year ${y}`, `₹${formatINR(lumpsum)}`, `₹${formatINR(fv - lumpsum)}`, `₹${formatINR(fv)}`];
  });

  const analysisData: AnalysisData = {
    algorithmName: "Discrete Exponential Capital Compounding Algorithm",
    algorithmDefinition:
      "Applies Euler's compound growth formula FV = PV × (1 + r)^n to a single upfront capital deployment. 100% of the invested capital generates compound returns from Day 1, with returns reinvesting annually at constant rate r.",
    calculationAssumptions: [
      "Single upfront capital injection on Day 1 without subsequent additions",
      "Full annual compounding frequency with 100% capital gains reinvestment",
      "Zero intermediate withdrawals or tax deductions during holding tenure"
    ],
    formulaTitle: "Annual Compound Interest (Lumpsum)",
    formulaTex: "FV = P × (1 + r)^n",
    formulaDesc:
      "A lump sum investment earns interest on the entire principal balance from day one, compounding year after year.",
    variables: [
      { symbol: "P", label: "Initial Investment", value: `₹${formatINR(lumpsum)}` },
      { symbol: "r", label: "Annual Rate of Return", value: `${rate}%` },
      { symbol: "n", label: "Duration in Years", value: `${years} Years` }
    ],
    calculationSteps: [
      `Annual compounding factor is (1 + r/100) = (1 + ${rate}/100) = ${(1 + rate / 100).toFixed(4)}.`,
      `Raise compounding factor to the power of ${years} years: (${(1 + rate / 100).toFixed(4)})^${years} = ${Math.pow(1 + rate / 100, years).toFixed(4)}.`,
      `Multiply initial capital ₹${formatINR(lumpsum)} by the growth factor to obtain future value: ₹${formatINR(futureValue)}.`,
      `Total wealth generated purely from capital appreciation: ₹${formatINR(wealthGained)}.`
    ],
    kpis: [
      { label: "Wealth Multiplier", value: `${wealthMultiplier}x`, subtext: "Capital multiplication factor", highlight: true },
      { label: "Doubling Period", value: `~${doublingPeriod} Years`, subtext: "Rule of 72 doubling estimate" },
      { label: "Total Return", value: `+${gainPercentage}%`, subtext: "Net gain on initial capital" },
      { label: "Real Value (6% infl.)", value: `₹${formatINR(inflationAdjusted)}`, subtext: "Inflation-adjusted value today" }
    ],
    scheduleTitle: "Lumpsum Compounding Milestones",
    scheduleHeaders: ["Milestone", "Initial Capital", "Capital Growth", "Total Portfolio"],
    scheduleRows,
    insights: [
      `At ${rate}% expected annual return, your capital will double approximately every ${doublingPeriod} years.`,
      `Because 100% of your money is put to work on day one, a lump sum captures full-horizon compounding advantages.`,
      `Consider investing via STP (Systematic Transfer Plan) if current markets are near historic valuation highs to mitigate single-day entry risk.`
    ],
    aboutContent: {
      heading: "About Lumpsum Investments",
      description:
        "A lumpsum investment is a one-time deposit made into an asset class or mutual fund. It suits investors with surplus liquidity such as annual bonuses, property sales proceeds, or retirement gratuities.",
      keyPoints: [
        { title: "Immediate Market Exposure", desc: "The entire sum begins compounding immediately without cash drag." },
        { title: "Horizon Sensitivity", desc: "Lump sum investments need a minimum 5-7 year horizon to absorb short-term market cycles." },
        { title: "STP Alternative", desc: "Can be parked in liquid debt and transferred systematically into equity over 6-12 months." }
      ]
    }
  };

  return (
    <CalculatorLayout
      {...props}
      inputs={
        <>
          <InputSlider label="Total investment" value={lumpsum} min={10000} max={10000000} step={10000} prefix="₹" onChange={setLumpsum} />
          <InputSlider label="Expected return (p.a)" value={rate} min={1} max={30} step={0.1} suffix="%" onChange={setRate} />
          <InputSlider label="Time period" value={years} min={1} max={40} step={1} suffix="Yr" onChange={setYears} />
        </>
      }
      reportInputs={[
        { label: "Total Investment", value: lumpsum },
        { label: "Expected Return (p.a.)", value: rate, suffix: "%", isCurrency: false },
        { label: "Time Period", value: years, suffix: "Years", isCurrency: false }
      ]}
      results={[
        { label: "Invested Amount", value: lumpsum },
        { label: "Est. Returns", value: wealthGained },
        { label: "Total Value", value: futureValue, highlight: true }
      ]}
      val1={lumpsum}
      val2={wealthGained}
      label1="Invested"
      label2="Returns"
      totalLabel="Total Value"
      totalValue={futureValue}
      subtext={`over ${years} years`}
      analysisData={analysisData}
    />
  );
};

// 4. SWP CALCULATOR
const SWPCalculator = (props: any) => {
  const [corpus, setCorpus] = useState(5000000);
  const [withdrawal, setWithdrawal] = useState(25000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);

  const i = rate / 100 / 12;
  const n = years * 12;
  const totalWithdrawn = withdrawal * n;

  let balance = corpus;
  const milestones = getMilestones(years);
  const milestoneMap = new Map();

  for (let m = 1; m <= n; m++) {
    const interest = balance * i;
    balance = balance + interest - withdrawal;
    if (balance < 0) balance = 0;

    const curYear = Math.round(m / 12);
    if (m % 12 === 0 && milestones.includes(curYear)) {
      milestoneMap.set(curYear, {
        withdrawn: withdrawal * m,
        balance
      });
    }
  }

  const finalCorpus = balance;
  const annualWithdrawal = withdrawal * 12;
  const withdrawalRate = ((annualWithdrawal / corpus) * 100).toFixed(2);

  const scheduleRows = milestones.map((y) => {
    const data = milestoneMap.get(y) || { withdrawn: withdrawal * y * 12, balance: finalCorpus };
    return [
      `Year ${y}`,
      `₹${formatINR(withdrawal)}/mo`,
      `₹${formatINR(data.withdrawn)}`,
      `₹${formatINR(data.balance)}`
    ];
  });

  const analysisData: AnalysisData = {
    algorithmName: "Reverse Amortization & Portfolio Depletion Algorithm",
    algorithmDefinition:
      "A discrete depletion-growth recurrence algorithm modeling periodic monthly redemptions from an actively compounding capital base. Evaluates B_m = B_(m-1) × (1 + i) - W. If periodic yield exceeds withdrawals, corpus lasts perpetually; otherwise, models capital drawdown velocity.",
    calculationAssumptions: [
      "Fixed monthly withdrawal deducted at end of each period",
      "Residual portfolio continues to compound at periodic rate i = Rate / 12",
      "Capital gains tax liabilities not deducted at source in cashflow balance"
    ],
    formulaTitle: "Monthly Reducing Balance Systematic Withdrawal",
    formulaTex: "B_m = B_(m-1) × (1 + i) - W",
    formulaDesc:
      "A Systematic Withdrawal Plan (SWP) redeems a fixed amount monthly while the remaining balance continues to generate compounded returns.",
    variables: [
      { symbol: "P", label: "Initial Capital", value: `₹${formatINR(corpus)}` },
      { symbol: "W", label: "Monthly Withdrawal", value: `₹${formatINR(withdrawal)}` },
      { symbol: "r", label: "Expected Annual Return", value: `${rate}%` }
    ],
    calculationSteps: [
      `Calculate annual withdrawal amount = ₹${formatINR(withdrawal)} × 12 = ₹${formatINR(annualWithdrawal)}.`,
      `Withdrawal rate on initial corpus = (₹${formatINR(annualWithdrawal)} / ₹${formatINR(corpus)}) × 100 = ${withdrawalRate}%.`,
      `Compare withdrawal rate against expected portfolio return ${rate}%: ${Number(withdrawalRate) <= rate ? "Portfolio generates more return than withdrawn (capital growing/preserving)" : "Withdrawal exceeds returns (capital gradually depleting)"}.`,
      `After ${years} years, total cashflow extracted: ₹${formatINR(totalWithdrawn)}.`,
      `Final remaining corpus: ₹${formatINR(finalCorpus)}.`
    ],
    kpis: [
      { label: "Annual Withdrawal Rate", value: `${withdrawalRate}% p.a.`, subtext: "Of initial principal capital", highlight: true },
      { label: "Total Extracted", value: `₹${formatINR(totalWithdrawn)}`, subtext: `${((totalWithdrawn / corpus) * 100).toFixed(0)}% of starting corpus` },
      { label: "Ending Balance", value: `₹${formatINR(finalCorpus)}`, subtext: finalCorpus >= corpus ? "Capital Preserved & Grown" : "Principal Partially Consumed" },
      { label: "Sustainability", value: Number(withdrawalRate) <= rate ? "Sustainable" : "Depleting", subtext: `Compared to ${rate}% annual return` }
    ],
    scheduleTitle: "SWP Cashflow & Balance Schedule",
    scheduleHeaders: ["Milestone", "Monthly Payout", "Total Withdrawn", "Remaining Corpus"],
    scheduleRows,
    insights: [
      `Safe Withdrawal Rule: Keeping your withdrawal rate under 6-8% p.a. ensures your corpus lasts indefinitely while fighting inflation.`,
      `Tax Efficiency: Unlike Fixed Deposit interest which is taxed at your full slab rate, SWP redemptions only attract capital gains tax on the profit portion.`,
      `Longevity: Your initial corpus generated ₹${formatINR(totalWithdrawn)} in direct cashflow and still retains ₹${formatINR(finalCorpus)} in wealth.`
    ],
    aboutContent: {
      heading: "About Systematic Withdrawal Plans (SWP)",
      description:
        "SWP allows you to withdraw a specified amount from your mutual fund investments on a regular basis (monthly, quarterly, or annually). It serves as an ideal regular pension or monthly income tool for retirees.",
      keyPoints: [
        { title: "Predictable Income", desc: "Creates steady monthly cashflows directly into your bank account." },
        { title: "LTCG Benefits", desc: "Substantially lower tax drag compared to traditional annuities or fixed deposit interest." },
        { title: "Flexibility", desc: "You can stop, pause, increase, or decrease your withdrawal amount at any time without penalties." }
      ]
    }
  };

  return (
    <CalculatorLayout
      {...props}
      inputs={
        <>
          <InputSlider label="Total investment" value={corpus} min={100000} max={50000000} step={100000} prefix="₹" onChange={setCorpus} />
          <InputSlider label="Withdrawal per month" value={withdrawal} min={1000} max={500000} step={1000} prefix="₹" onChange={setWithdrawal} />
          <InputSlider label="Expected return (p.a)" value={rate} min={1} max={30} step={0.1} suffix="%" onChange={setRate} />
          <InputSlider label="Time period" value={years} min={1} max={40} step={1} suffix="Yr" onChange={setYears} />
        </>
      }
      reportInputs={[
        { label: "Total Investment", value: corpus },
        { label: "Withdrawal per month", value: withdrawal },
        { label: "Expected Return (p.a.)", value: rate, suffix: "%", isCurrency: false },
        { label: "Time Period", value: years, suffix: "Years", isCurrency: false }
      ]}
      results={[
        { label: "Total Investment", value: corpus },
        { label: "Total Withdrawal", value: totalWithdrawn },
        { label: "Final Value", value: finalCorpus > 0 ? finalCorpus : 0, highlight: true }
      ]}
      val1={finalCorpus > 0 ? finalCorpus : 0}
      val2={totalWithdrawn}
      label1="Final Value"
      label2="Total Withdrawn"
      totalLabel="Initial Corpus"
      totalValue={corpus}
      analysisData={analysisData}
    />
  );
};

// 5. STEP-UP SIP CALCULATOR
const StepUpSIPCalculator = (props: any) => {
  const [initialSip, setInitialSip] = useState(10000);
  const [stepUp, setStepUp] = useState(10);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  let fv = 0;
  let currentSip = initialSip;
  let invested = 0;

  const milestones = getMilestones(years);
  const milestoneMap = new Map();

  for (let m = 1; m <= years * 12; m++) {
    invested += currentSip;
    fv = (fv + currentSip) * (1 + rate / 100 / 12);

    const curYear = Math.round(m / 12);
    if (m % 12 === 0) {
      if (milestones.includes(curYear)) {
        milestoneMap.set(curYear, {
          sip: currentSip,
          invested,
          fv
        });
      }
      currentSip = currentSip * (1 + stepUp / 100);
    }
  }

  const i = rate / 100 / 12;
  const n = years * 12;
  const flatFv = initialSip * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const extraGained = fv - flatFv;
  const finalYearSip = Math.round(initialSip * Math.pow(1 + stepUp / 100, years - 1));

  const scheduleRows = milestones.map((y) => {
    const data = milestoneMap.get(y) || { sip: currentSip, invested, fv };
    return [
      `Year ${y}`,
      `₹${formatINR(data.sip)}/mo`,
      `₹${formatINR(data.invested)}`,
      `₹${formatINR(data.fv - data.invested)}`,
      `₹${formatINR(data.fv)}`
    ];
  });

  const analysisData: AnalysisData = {
    algorithmName: "Segmented Escalating Annuity Compounding Algorithm",
    algorithmDefinition:
      "Calculates escalating monthly contributions that increase by a fixed step-up percentage at 12-month intervals. Each annual tranche is computed as an independent annuity cohort, modeling accelerated terminal wealth accumulation that matches career income growth.",
    calculationAssumptions: [
      "SIP amount increases by chosen step-up % automatically at each 12-month mark",
      "Returns continuously reinvested monthly across all previous cohorts",
      "Constant expected return rate throughout duration"
    ],
    formulaTitle: "Annual Top-Up Systematic Investment Plan",
    formulaTex: "SIP_(y) = SIP_(y-1) × (1 + StepUp%)",
    formulaDesc:
      "Step-Up SIP automatically increments your monthly investment by a chosen percentage every 12 months, aligning with salary appraisals to build wealth much faster.",
    variables: [
      { symbol: "SIP_0", label: "Starting Monthly SIP", value: `₹${formatINR(initialSip)}` },
      { symbol: "StepUp", label: "Annual Increment", value: `${stepUp}%/year` },
      { symbol: "r", label: "Expected Annual Return", value: `${rate}%` }
    ],
    calculationSteps: [
      `Starting monthly SIP of ₹${formatINR(initialSip)} increases by ${stepUp}% at the start of each new year.`,
      `By Year ${years}, your monthly contribution escalates to ₹${formatINR(finalYearSip)}/month.`,
      `Total cumulative capital invested over ${years} years: ₹${formatINR(invested)}.`,
      `Total accumulated corpus reaches ₹${formatINR(fv)}.`,
      `Extra wealth created specifically by the annual step-up vs a flat SIP: +₹${formatINR(extraGained)}!`
    ],
    kpis: [
      { label: "Step-Up Bonus", value: `+₹${formatINR(extraGained)}`, subtext: "Extra wealth vs flat SIP", highlight: true },
      { label: "Wealth Multiplier", value: `${(fv / invested).toFixed(2)}x`, subtext: "Total return on capital" },
      { label: "Final Monthly SIP", value: `₹${formatINR(finalYearSip)}`, subtext: "In the final year of tenure" },
      { label: "Total Corpus", value: `₹${formatINR(fv)}`, subtext: `${years} year total maturity` }
    ],
    scheduleTitle: "Step-Up SIP Progression Milestones",
    scheduleHeaders: ["Milestone", "Monthly SIP", "Total Invested", "Est. Returns", "Total Value"],
    scheduleRows,
    insights: [
      `Stepping up by ${stepUp}% annually generates an extra ₹${formatINR(extraGained)} compared to keeping your initial SIP fixed at ₹${formatINR(initialSip)}.`,
      `Income Alignment: As career earnings and bonuses rise, stepping up your SIP ensures you counter lifestyle inflation by saving a fixed proportion of increments.`,
      `Compounding Accelerator: Larger contributions in middle and later years enter an already compounding portfolio, supercharging growth.`
    ],
    aboutContent: {
      heading: "About Step-Up SIP (Top-Up)",
      description:
        "Step-Up SIP allows you to automatically increase your monthly investment by a fixed percentage each year. This is the single most effective way to hit ambitious retirement or financial independence goals early.",
      keyPoints: [
        { title: "Beats Lifestyle Creep", desc: "Automatically captures annual pay hikes before they get absorbed into daily living costs." },
        { title: "Dramatic Difference", desc: "Even a modest 5-10% annual step-up can double your final corpus over a 15-20 year period." },
        { title: "Customizable", desc: "You can adjust or cap the maximum step-up amount as your family commitments evolve." }
      ]
    }
  };

  return (
    <CalculatorLayout
      {...props}
      inputs={
        <>
          <InputSlider label="Monthly investment" value={initialSip} min={500} max={100000} step={500} prefix="₹" onChange={setInitialSip} />
          <InputSlider label="Annual step-up" value={stepUp} min={1} max={50} step={1} suffix="%" onChange={setStepUp} />
          <InputSlider label="Expected return (p.a)" value={rate} min={1} max={30} step={0.1} suffix="%" onChange={setRate} />
          <InputSlider label="Time period" value={years} min={1} max={40} step={1} suffix="Yr" onChange={setYears} />
        </>
      }
      reportInputs={[
        { label: "Monthly Investment", value: initialSip },
        { label: "Annual Step-up", value: stepUp, suffix: "%", isCurrency: false },
        { label: "Expected Return (p.a.)", value: rate, suffix: "%", isCurrency: false },
        { label: "Time Period", value: years, suffix: "Years", isCurrency: false }
      ]}
      results={[
        { label: "Invested amount", value: invested },
        { label: "Est. returns", value: fv - invested },
        { label: "Total value", value: fv, highlight: true }
      ]}
      val1={invested}
      val2={fv - invested}
      label1="Invested"
      label2="Returns"
      totalLabel="Total Value"
      totalValue={fv}
      analysisData={analysisData}
    />
  );
};

// 6. GRATUITY CALCULATOR
const GratuityCalculator = (props: any) => {
  const [basicSalary, setBasicSalary] = useState(60000);
  const [tenureYears, setTenureYears] = useState(12);

  const gratuity = Math.round((15 * basicSalary * tenureYears) / 26);
  const taxExemptLimit = 2000000;
  const taxFreeGratuity = Math.min(gratuity, taxExemptLimit);
  const taxableGratuity = Math.max(0, gratuity - taxExemptLimit);
  const salaryMonthsEquivalent = ((15 * tenureYears) / 26).toFixed(1);

  const milestones = [5, 10, 15, 20, 25, 30].filter((y) => y <= Math.max(tenureYears, 10));
  if (!milestones.includes(tenureYears)) milestones.push(tenureYears);
  milestones.sort((a, b) => a - b);

  const scheduleRows = milestones.map((y) => {
    const g = Math.round((15 * basicSalary * y) / 26);
    const tf = Math.min(g, taxExemptLimit);
    const tax = Math.max(0, g - taxExemptLimit);
    return [`${y} Years`, `₹${formatINR(basicSalary)}`, `₹${formatINR(g)}`, `₹${formatINR(tf)}`, tax > 0 ? `₹${formatINR(tax)}` : "Nil (Tax-Free)"];
  });

  const analysisData: AnalysisData = {
    algorithmName: "Statutory Gratuity Act Amortization Algorithm (15/26 Rule)",
    algorithmDefinition:
      "Applies Section 4(2) of the Payment of Gratuity Act, 1972. Divides the monthly basic wage by 26 working days (excluding 4 Sundays) to compute a single working day's pay, multiplying by 15 days for each completed year of continuous service, capped at statutory exemption limits under Section 10(10).",
    calculationAssumptions: [
      "Standard 26 working days per month divisor convention",
      "Minimum 5 completed years of continuous service required",
      "Tax exemption capped at ₹20,00,000 under Section 10(10)"
    ],
    formulaTitle: "Payment of Gratuity Act, 1972",
    formulaTex: "Gratuity = (15 × Last Drawn Basic × Tenure) / 26",
    formulaDesc:
      "Under Indian labor law, gratuity is computed based on 15 days of wages for every completed year of service, using 26 working days in a month.",
    variables: [
      { symbol: "Basic + DA", label: "Monthly Basic Pay", value: `₹${formatINR(basicSalary)}` },
      { symbol: "Tenure", label: "Years of Service", value: `${tenureYears} Years` },
      { symbol: "Tax Exemption", label: "Sec 10(10) Limit", value: "₹20,00,000" }
    ],
    calculationSteps: [
      `Identify Last Drawn Monthly Basic Salary + Dearness Allowance = ₹${formatINR(basicSalary)}.`,
      `Determine completed service duration = ${tenureYears} years (minimum 5 years required).`,
      `Calculate daily wage equivalent using 26 working days = ₹${formatINR(basicSalary)} / 26 = ₹${(basicSalary / 26).toFixed(2)}.`,
      `Multiply by 15 days per year = 15 × ₹${(basicSalary / 26).toFixed(2)} = ₹${((15 * basicSalary) / 26).toFixed(2)}/year.`,
      `Multiply by ${tenureYears} years of service: Total Gratuity = ₹${formatINR(gratuity)}.`
    ],
    kpis: [
      { label: "Total Gratuity", value: `₹${formatINR(gratuity)}`, subtext: "Statutory entitlement", highlight: true },
      { label: "Tax-Exempt Portion", value: `₹${formatINR(taxFreeGratuity)}`, subtext: "Under Income Tax Sec 10(10)" },
      { label: "Taxable Portion", value: taxableGratuity > 0 ? `₹${formatINR(taxableGratuity)}` : "₹0 (Fully Exempt)", subtext: taxableGratuity > 0 ? "Subject to income tax slab" : "Completely tax-free" },
      { label: "Equivalent Months", value: `${salaryMonthsEquivalent} Months`, subtext: "Of monthly basic salary" }
    ],
    scheduleTitle: "Gratuity Entitlement Across Service Years",
    scheduleHeaders: ["Service Duration", "Basic Salary", "Total Gratuity", "Tax-Free Amount", "Taxable Amount"],
    scheduleRows,
    insights: [
      `Eligibility: An employee is entitled to gratuity after completing 5 continuous years of service in an establishment with 10+ employees.`,
      `Tax Exemption: Up to ₹20 Lakhs of gratuity is completely tax-exempt under Section 10(10) of the Indian Income Tax Act.`,
      `Rounding Rule: If the employee worked for 6 months or more in the final year (e.g. 12 years 7 months), it is rounded up to the next full year (13 years).`
    ],
    aboutContent: {
      heading: "About Gratuity in India",
      description:
        "Gratuity is a monetary retirement benefit paid by an employer to an employee in recognition of their long-term service. It is governed by the Payment of Gratuity Act, 1972.",
      keyPoints: [
        { title: "5-Year Minimum Rule", desc: "Mandatory 5 years of continuous service is required, except in the case of death or disablement." },
        { title: "Calculation Basis", desc: "Based strictly on the last drawn Basic Salary + Dearness Allowance, excluding variable allowances." },
        { title: "Tax Treatment", desc: "Government employees receive fully tax-free gratuity; private employees enjoy exemption up to ₹20 Lakhs." }
      ]
    }
  };

  return (
    <CalculatorLayout
      {...props}
      inputs={
        <>
          <InputSlider label="Monthly Basic Salary + DA" value={basicSalary} min={10000} max={500000} step={1000} prefix="₹" onChange={setBasicSalary} />
          <InputSlider label="Years of Service" value={tenureYears} min={5} max={40} step={1} suffix="Yr" onChange={setTenureYears} />
        </>
      }
      reportInputs={[
        { label: "Monthly Basic + DA", value: basicSalary },
        { label: "Years of Service", value: tenureYears, suffix: "Years", isCurrency: false }
      ]}
      results={[
        { label: "Total Gratuity", value: gratuity, highlight: true },
        { label: "Tax-Free Amount", value: taxFreeGratuity },
        { label: "Taxable Amount", value: taxableGratuity },
        { label: "Equivalent Salary", value: salaryMonthsEquivalent, isCurrency: false, suffix: " Months" }
      ]}
      val1={taxFreeGratuity}
      val2={taxableGratuity}
      label1="Tax-Free Gratuity"
      label2="Taxable Gratuity"
      totalLabel="Total Gratuity"
      totalValue={gratuity}
      subtext={`for ${tenureYears} years of service`}
      analysisData={analysisData}
    />
  );
};

// 7. INFLATION CALCULATOR
const InflationCalculator = (props: any) => {
  const [currentCost, setCurrentCost] = useState(50000);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(15);

  const futureCost = currentCost * Math.pow(1 + inflationRate / 100, years);
  const costIncrease = futureCost - currentCost;
  const purchasingPowerRetained = ((currentCost / futureCost) * 100).toFixed(1);
  const erosionPercent = (100 - Number(purchasingPowerRetained)).toFixed(1);
  const multiplier = (futureCost / currentCost).toFixed(2);

  const milestones = getMilestones(years);
  const scheduleRows = milestones.map((y) => {
    const fc = currentCost * Math.pow(1 + inflationRate / 100, y);
    const pwr = ((currentCost / fc) * 100).toFixed(1);
    return [`Year ${y}`, `₹${formatINR(currentCost)}`, `₹${formatINR(fc)}`, `₹${formatINR(fc - currentCost)}`, `${pwr}%`];
  });

  const analysisData: AnalysisData = {
    algorithmName: "Consumer Purchasing Power Erosion & Future Cost Algorithm",
    algorithmDefinition:
      "Projects price level escalation using exponential inflation indexation FC = PC × (1 + i)^n. Simultaneously evaluates the reciprocal decay of money's purchasing power, demonstrating the real devaluation of uninvested capital over time.",
    calculationAssumptions: [
      "Constant annual inflation rate compounding on baseline expenses",
      "Does not factor category hyperinflation (e.g. healthcare/education at 10-12%)",
      "Purchasing power evaluates base currency purchasing equivalence"
    ],
    formulaTitle: "Purchasing Power & Inflation Compounding",
    formulaTex: "Future Cost = Present Cost × (1 + i)^n",
    formulaDesc:
      "Inflation diminishes the purchasing power of money over time. This formula projects how much goods and services will cost in the future given an annual inflation rate.",
    variables: [
      { symbol: "Present Cost", label: "Current Expense", value: `₹${formatINR(currentCost)}` },
      { symbol: "i", label: "Annual Inflation Rate", value: `${inflationRate}%` },
      { symbol: "n", label: "Time Horizon", value: `${years} Years` }
    ],
    calculationSteps: [
      `Identify annual inflation compounding multiplier: 1 + ${inflationRate}/100 = ${(1 + inflationRate / 100).toFixed(4)}.`,
      `Compound over ${years} years: (${(1 + inflationRate / 100).toFixed(4)})^${years} = ${Math.pow(1 + inflationRate / 100, years).toFixed(4)}.`,
      `Multiply current cost of ₹${formatINR(currentCost)} by inflation factor = ₹${formatINR(futureCost)}.`,
      `Calculate purchasing power erosion: Today's ₹100 will only be worth ₹${purchasingPowerRetained} in ${years} years.`
    ],
    kpis: [
      { label: "Future Cost", value: `₹${formatINR(futureCost)}`, subtext: `In ${years} years time`, highlight: true },
      { label: "Cost Multiplier", value: `${multiplier}x`, subtext: "Expenses will multiply by this" },
      { label: "Purchasing Power Retained", value: `${purchasingPowerRetained}%`, subtext: "Value of today's rupee in future" },
      { label: "Wealth Erosion", value: `-${erosionPercent}%`, subtext: "Loss in real purchasing value" }
    ],
    scheduleTitle: "Inflation Cost Progression Over Time",
    scheduleHeaders: ["Milestone", "Today's Cost", "Future Cost", "Cost Increase", "Purchasing Power"],
    scheduleRows,
    insights: [
      `In ${years} years at ${inflationRate}% inflation, you will need ₹${formatINR(futureCost)} to purchase what ₹${formatINR(currentCost)} buys today.`,
      `Silent Wealth Tax: Cash parked in savings accounts or low-yield fixed deposits earning below inflation loses purchasing power every single day.`,
      `Investment Implication: To grow real wealth, your investment portfolio must target returns at least 3-5% above the prevailing inflation rate.`
    ],
    aboutContent: {
      heading: "About Inflation & Purchasing Power",
      description:
        "Inflation is the rate at which the general level of prices for goods and services rises, eroding currency purchasing power. Understanding inflation is critical for retirement and long-term goal planning.",
      keyPoints: [
        { title: "Lifestyle Cost Creep", desc: "Healthcare and education in India often inflate at 10-12% p.a., even higher than CPI." },
        { title: "Real vs Nominal Return", desc: "Real Return = Nominal Return - Inflation Rate. A 7% FD in a 6% inflation environment yields only 1% real return." },
        { title: "Equity as an Inflation Beat", desc: "Equities are prime inflation hedges as company earnings and revenues adjust upward with inflation." }
      ]
    }
  };

  return (
    <CalculatorLayout
      {...props}
      inputs={
        <>
          <InputSlider label="Current Expense / Cost" value={currentCost} min={5000} max={2000000} step={5000} prefix="₹" onChange={setCurrentCost} />
          <InputSlider label="Expected Inflation Rate (p.a.)" value={inflationRate} min={1} max={15} step={0.5} suffix="%" onChange={setInflationRate} />
          <InputSlider label="Time Horizon" value={years} min={1} max={40} step={1} suffix="Yr" onChange={setYears} />
        </>
      }
      reportInputs={[
        { label: "Current Cost", value: currentCost },
        { label: "Inflation Rate (p.a.)", value: inflationRate, suffix: "%", isCurrency: false },
        { label: "Time Horizon", value: years, suffix: "Years", isCurrency: false }
      ]}
      results={[
        { label: "Future Cost", value: futureCost, highlight: true },
        { label: "Cost Increase", value: costIncrease },
        { label: "Purchasing Power Retained", value: purchasingPowerRetained, isCurrency: false, suffix: "%" },
        { label: "Cost Multiplier", value: multiplier, isCurrency: false, suffix: "x" }
      ]}
      val1={currentCost}
      val2={costIncrease}
      label1="Current Cost"
      label2="Cost Increase"
      totalLabel="Future Cost"
      totalValue={futureCost}
      subtext={`in ${years} years`}
      analysisData={analysisData}
    />
  );
};

// 8. CAGR CALCULATOR
const CAGRCalculator = (props: any) => {
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(350000);
  const [years, setYears] = useState(5);

  const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
  const absoluteGain = finalValue - initialValue;
  const absoluteReturnPercent = ((absoluteGain / initialValue) * 100).toFixed(1);
  const simpleAverageReturn = (Number(absoluteReturnPercent) / years).toFixed(1);
  const growthMultiplier = (finalValue / initialValue).toFixed(2);

  const milestones = getMilestones(years);
  const scheduleRows = milestones.map((y) => {
    const projectedVal = initialValue * Math.pow(1 + cagr / 100, y);
    return [`Year ${y}`, `₹${formatINR(initialValue)}`, `₹${formatINR(projectedVal - initialValue)}`, `₹${formatINR(projectedVal)}`];
  });

  const analysisData: AnalysisData = {
    algorithmName: "Geometric Mean Annualized Compounding Algorithm",
    algorithmDefinition:
      "Computes the true geometric mean rate connecting initial and final capital over n years: ((V_n / V_0)^(1/n) - 1) × 100. Unlike arithmetic averages that distort volatile swings, the CAGR algorithm provides the accurate annualized smoothed trajectory of capital compounding.",
    calculationAssumptions: [
      "Assumes smoothed constant geometric compounding trajectory",
      "Full reinvestment of all dividends and capital appreciation",
      "Point-to-point calculation neutral to interim volatility fluctuations"
    ],
    formulaTitle: "Compound Annual Growth Rate (CAGR)",
    formulaTex: "CAGR = (Final / Initial)^(1 / n) - 1",
    formulaDesc:
      "CAGR represents the mean annual growth rate of an investment over a specified period longer than one year, assuming the investment compounded smoothly over that period.",
    variables: [
      { symbol: "V_0", label: "Initial Investment", value: `₹${formatINR(initialValue)}` },
      { symbol: "V_n", label: "Final Portfolio Value", value: `₹${formatINR(finalValue)}` },
      { symbol: "n", label: "Holding Period in Years", value: `${years} Years` }
    ],
    calculationSteps: [
      `Calculate absolute growth factor: Final Value / Initial Value = ₹${formatINR(finalValue)} / ₹${formatINR(initialValue)} = ${growthMultiplier}.`,
      `Determine annual exponent 1 / n = 1 / ${years} = ${(1 / years).toFixed(4)}.`,
      `Raise growth factor to exponent: (${growthMultiplier})^${(1 / years).toFixed(4)} = ${(Math.pow(finalValue / initialValue, 1 / years)).toFixed(4)}.`,
      `Subtract 1 and convert to percentage: CAGR = ${cagr.toFixed(2)}% per annum.`,
      `Notice that simple arithmetic average is ${simpleAverageReturn}% p.a., which overstates real compounding returns.`
    ],
    kpis: [
      { label: "Compounded Return (CAGR)", value: `${cagr.toFixed(2)}% p.a.`, subtext: "True geometric annual return", highlight: true },
      { label: "Absolute Return", value: `+${absoluteReturnPercent}%`, subtext: "Total percentage gain" },
      { label: "Total Capital Gain", value: `₹${formatINR(absoluteGain)}`, subtext: "Net profit generated" },
      { label: "Simple Average", value: `${simpleAverageReturn}% p.a.`, subtext: "Arithmetic annual return" }
    ],
    scheduleTitle: "Smoothed Compounding Curve Over Horizon",
    scheduleHeaders: ["Milestone", "Initial Capital", "Capital Growth", "Portfolio Value"],
    scheduleRows,
    insights: [
      `A CAGR of ${cagr.toFixed(2)}% means your investment performed as if it grew by exactly ${cagr.toFixed(2)}% every single year without interim volatility.`,
      `Geometric vs Arithmetic: Never judge long-term investments by simple average returns; CAGR is the gold standard for measuring mutual fund and equity performance.`,
      `Benchmark comparison: Indian Nifty 50 has historically delivered ~12-14% CAGR over 10-15 year horizons.`
    ],
    aboutContent: {
      heading: "About Compound Annual Growth Rate (CAGR)",
      description:
        "CAGR is one of the most accurate ways to calculate and determine returns for anything that can rise or fall in value over time. It dampens erratic market swings to give a single annualized rate.",
      keyPoints: [
        { title: "Volatility Neutral", desc: "Smooths out volatile years (e.g. +30% in year 1, -10% in year 2) into one unified geometric rate." },
        { title: "Apple-to-Apple Comparison", desc: "Allows comparing two investments held across differing time horizons on an equal annual footing." },
        { title: "Assumes Reinvestment", desc: "Assumes all dividends and gains were continuously reinvested back into the asset." }
      ]
    }
  };

  return (
    <CalculatorLayout
      {...props}
      inputs={
        <>
          <InputSlider label="Beginning Investment Value" value={initialValue} min={10000} max={10000000} step={10000} prefix="₹" onChange={setInitialValue} />
          <InputSlider label="Final Investment Value" value={finalValue} min={10000} max={50000000} step={10000} prefix="₹" onChange={setFinalValue} />
          <InputSlider label="Duration in Years" value={years} min={1} max={30} step={1} suffix="Yr" onChange={setYears} />
        </>
      }
      reportInputs={[
        { label: "Beginning Value", value: initialValue },
        { label: "Final Value", value: finalValue },
        { label: "Duration", value: years, suffix: "Years", isCurrency: false }
      ]}
      results={[
        { label: "Annualized CAGR", value: cagr.toFixed(2), isCurrency: false, suffix: "%", highlight: true },
        { label: "Total Capital Gain", value: absoluteGain },
        { label: "Absolute Return", value: absoluteReturnPercent, isCurrency: false, suffix: "%" },
        { label: "Growth Multiplier", value: growthMultiplier, isCurrency: false, suffix: "x" }
      ]}
      val1={initialValue}
      val2={absoluteGain}
      label1="Initial Capital"
      label2="Total Gain"
      totalLabel="Final Portfolio Value"
      totalValue={finalValue}
      subtext={`over ${years} years`}
      analysisData={analysisData}
    />
  );
};

const calculatorsList = [
  { id: "emi", label: "EMI Calculator", icon: Wallet, Component: EMICalculator },
  { id: "sip", label: "SIP Calculator", icon: TrendingUp, Component: SIPCalculator },
  { id: "lumpsum", label: "Lumpsum Calculator", icon: Wallet, Component: LumpsumCalculator },
  { id: "swp", label: "SWP Calculator", icon: ArrowRight, Component: SWPCalculator },
  { id: "step_up_sip", label: "Step-Up SIP", icon: TrendingUp, Component: StepUpSIPCalculator },
  { id: "gratuity", label: "Gratuity Calculator", icon: Target, Component: GratuityCalculator },
  { id: "inflation", label: "Inflation Calculator", icon: TrendingUp, Component: InflationCalculator },
  { id: "cagr", label: "CAGR Calculator", icon: Calculator, Component: CAGRCalculator }
];

export default function CalculatorsPage() {
  const [pageMode, setPageMode] = useState<"single" | "compare" | "journey">("single");
  const [activeCalcId, setActiveCalcId] = useState("emi");
  const activeCalc = calculatorsList.find((c) => c.id === activeCalcId) || calculatorsList[0];
  const ActiveComponent = activeCalc.Component;

  return (
    <div className="min-h-screen bg-[#FFFDF4] pt-28 sm:pt-32 pb-20 print:pt-0 print:pb-0 print:bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 print:hidden">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#fe9800]">Solid Wealth Tools</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1a2332]">Financial Calculators & Analytics</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mode Switcher Tabs */}
            <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-2xs overflow-x-auto max-w-full">
              <button
                onClick={() => setPageMode("single")}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                  pageMode === "single"
                    ? "bg-[#fe9800] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Calculator className="size-4" />
                <span>Single Calculator</span>
              </button>

              <button
                onClick={() => setPageMode("compare")}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                  pageMode === "compare"
                    ? "bg-[#0B63E5] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Scale className="size-4" />
                <span>Compare Strategies</span>
              </button>

              <button
                onClick={() => setPageMode("journey")}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                  pageMode === "journey"
                    ? "bg-[#10B981] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Layers className="size-4" />
                <span>Multi-Phase Journey</span>
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[10px] font-extrabold uppercase">
                  SIP → Lumpsum → SWP
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Content: Single Calculator, Comparison View, or Multi-Phase Journey */}
        {pageMode === "single" && (
          <ActiveComponent activeCalc={activeCalc} calculatorsList={calculatorsList} setActiveCalcId={setActiveCalcId} />
        )}
        {pageMode === "compare" && (
          <CalculatorComparisonView />
        )}
        {pageMode === "journey" && (
          <PortfolioJourneyCalculator />
        )}
      </div>
    </div>
  );
}
