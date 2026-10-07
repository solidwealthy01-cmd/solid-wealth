"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, FileSpreadsheet, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  API_BASE_URL,
  formatAum,
  formatDate,
  formatFixed,
  returnTone,
  toNumber,
  type CategoryOption,
  type FundPerformance,
} from "@/lib/mutual-fund-performance";

type SortKey =
  | "scheme_name"
  | "launch_date"
  | "aum_crore"
  | "ter_percent"
  | "rating"
  | "return_1yr"
  | "return_3yr"
  | "return_5yr"
  | "return_10yr"
  | "mean"
  | "sharpe_ratio"
  | "alpha"
  | "beta"
  | "std_deviation";

type LoadStatus = "loading" | "ready" | "error";

const FALLBACK_CATEGORIES: CategoryOption[] = [
  { category: "Equity: ELSS" },
];

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) {
    return <ArrowUpDown className="size-3 text-orange-400/70 inline-block ml-1" />;
  }
  return dir === "asc" ? (
    <ArrowUp className="size-3 text-orange-600 inline-block ml-1 font-bold" />
  ) : (
    <ArrowDown className="size-3 text-orange-600 inline-block ml-1 font-bold" />
  );
}

export function TrailingReturnsTable() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoriesStatus, setCategoriesStatus] = useState<LoadStatus>("loading");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [allFundsCache, setAllFundsCache] = useState<FundPerformance[] | null>(null);
  const [funds, setFunds] = useState<FundPerformance[]>([]);
  const [fundsStatus, setFundsStatus] = useState<LoadStatus>("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("scheme_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Load categories
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/mutual-fund-performance/categories/`, {
          signal: controller.signal,
        });
        let payload: CategoryOption[];
        if (res.status === 404) {
          payload = FALLBACK_CATEGORIES;
        } else {
          if (!res.ok) throw new Error(`Categories request failed with ${res.status}`);
          payload = await res.json();
        }
        if (controller.signal.aborted) return;
        setCategories(payload);
        setCategoriesStatus("ready");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to load mutual fund categories:", err);
        setCategoriesStatus("error");
      }
    };
    load();
    return () => controller.abort();
  }, []);

  // Load funds: loads all funds once and filters in-memory for instant response
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setFundsStatus("loading");
      try {
        let fullList = allFundsCache;
        if (!fullList) {
          const res = await fetch(`${API_BASE_URL}/api/mutual-fund-performance/`, {
            signal: controller.signal,
          });
          if (!res.ok) throw new Error(`Fund performance request failed with ${res.status}`);
          fullList = await res.json();
          if (controller.signal.aborted) return;
          setAllFundsCache(fullList);
        }

        if (controller.signal.aborted) return;

        let filtered: FundPerformance[] = fullList || [];

        if (selectedCategory === "ALL" || !selectedCategory) {
          filtered = fullList || [];
        } else if (selectedCategory === "ALL_EQUITY") {
          filtered = (fullList || []).filter((f) =>
            f.category?.toLowerCase().startsWith("equity")
          );
        } else if (selectedCategory === "ALL_DEBT") {
          filtered = (fullList || []).filter((f) =>
            f.category?.toLowerCase().startsWith("debt")
          );
        } else if (selectedCategory === "ALL_HYBRID") {
          filtered = (fullList || []).filter((f) =>
            f.category?.toLowerCase().startsWith("hybrid")
          );
        } else if (selectedCategory === "ALL_OTHER") {
          filtered = (fullList || []).filter((f) => {
            const cat = f.category?.toLowerCase() || "";
            return (
              !cat.startsWith("equity") &&
              !cat.startsWith("debt") &&
              !cat.startsWith("hybrid")
            );
          });
        } else {
          filtered = (fullList || []).filter((f) => f.category === selectedCategory);
        }

        setFunds(filtered);
        setFundsStatus("ready");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to load mutual fund performance:", err);
        setFundsStatus("error");
      }
    };
    load();
    return () => controller.abort();
  }, [selectedCategory, reloadKey, allFundsCache]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const visibleFunds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = funds.filter(
      (fund) =>
        query === "" ||
        fund.scheme_name.toLowerCase().includes(query) ||
        (fund.rating ?? "").toLowerCase().includes(query) ||
        (fund.fund_manager ?? "").toLowerCase().includes(query)
    );

    list.sort((a, b) => {
      if (sortKey === "scheme_name" || sortKey === "rating" || sortKey === "launch_date") {
        const valA = (a[sortKey] ?? "").toString().toLowerCase();
        const valB = (b[sortKey] ?? "").toString().toLowerCase();
        const cmp = valA.localeCompare(valB);
        return sortDir === "asc" ? cmp : -cmp;
      }
      const valA = toNumber(a[sortKey]);
      const valB = toNumber(b[sortKey]);
      if (valA === null) return valB === null ? 0 : 1;
      if (valB === null) return -1;
      return sortDir === "asc" ? valA - valB : valB - valA;
    });

    return pageSize === "All" ? list : list.slice(0, pageSize);
  }, [funds, searchQuery, sortKey, sortDir, pageSize]);

  const retry = () => {
    setFundsStatus("loading");
    setReloadKey((key) => key + 1);
  };

  const exportToExcel = () => {
    const headers = [
      "Scheme Name",
      "Launch Date",
      "AUM (Crore)",
      "TER (%)",
      "Rating",
      "1 Yr Rtn (%)",
      "3 Yrs Rtn (%)",
      "5 Yrs Rtn (%)",
      "10 Yrs Rtn (%)",
      "Mean",
      "Sharp Ratio",
      "Alpha",
      "Beta",
      "Std. Deviation",
    ];

    const csvCell = (value: string | number | null | undefined) =>
      `"${(value ?? "").toString().replace(/"/g, '""')}"`;

    const rows = visibleFunds.map((fund) =>
      [
        fund.scheme_name,
        formatDate(fund.launch_date),
        fund.aum_crore,
        fund.ter_percent,
        fund.rating,
        fund.return_1yr,
        fund.return_3yr,
        fund.return_5yr,
        fund.return_10yr,
        fund.mean,
        fund.sharpe_ratio,
        fund.alpha,
        fund.beta,
        fund.std_deviation,
      ]
        .map(csvCell)
        .join(",")
    );

    const csv = [headers.map(csvCell).join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
    link.setAttribute(
      "download",
      `Mutual_Fund_Returns_${selectedCategory.replace(/[^a-z0-9]/gi, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let tableMessage: React.ReactNode = null;
  if (categoriesStatus === "error") {
    tableMessage = "Couldn't load fund categories. Please try again later.";
  } else if (categoriesStatus === "ready" && categories.length === 0) {
    tableMessage = "No mutual fund performance data has been uploaded yet.";
  } else if (fundsStatus === "loading") {
    tableMessage = "Loading schemes...";
  } else if (fundsStatus === "error") {
    tableMessage = (
      <span>
        Couldn&apos;t load schemes for this category.{" "}
        <button
          type="button"
          onClick={retry}
          className="font-bold text-[#fe9800] hover:underline cursor-pointer"
        >
          Retry
        </button>
      </span>
    );
  } else if (visibleFunds.length === 0) {
    tableMessage = funds.length === 0 ? "No schemes in this category." : "No schemes match your search.";
  }

  const categoryGroups = useMemo(() => {
    const groups: Record<string, CategoryOption[]> = {
      All: categories,
      Equity: [],
      Debt: [],
      Hybrid: [],
      Other: [],
    };

    for (const cat of categories) {
      const name = cat.category.toLowerCase();
      if (name.startsWith("equity")) {
        groups.Equity.push(cat);
      } else if (name.startsWith("debt")) {
        groups.Debt.push(cat);
      } else if (name.startsWith("hybrid")) {
        groups.Hybrid.push(cat);
      } else {
        groups.Other.push(cat);
      }
    }
    return groups;
  }, [categories]);

  const displayedCategories = useMemo(() => {
    if (selectedGroup === "All") return categories;
    return categoryGroups[selectedGroup] || categories;
  }, [categories, selectedGroup, categoryGroups]);

  const handleGroupSelect = (grp: string) => {
    setSelectedGroup(grp);
    if (grp === "All") {
      setSelectedCategory("ALL");
    } else if (grp === "Equity") {
      setSelectedCategory("ALL_EQUITY");
    } else if (grp === "Debt") {
      setSelectedCategory("ALL_DEBT");
    } else if (grp === "Hybrid") {
      setSelectedCategory("ALL_HYBRID");
    } else if (grp === "Other") {
      setSelectedCategory("ALL_OTHER");
    }
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    if (val === "ALL") {
      setSelectedGroup("All");
    } else if (val === "ALL_EQUITY") {
      setSelectedGroup("Equity");
    } else if (val === "ALL_DEBT") {
      setSelectedGroup("Debt");
    } else if (val === "ALL_HYBRID") {
      setSelectedGroup("Hybrid");
    } else if (val === "ALL_OTHER") {
      setSelectedGroup("Other");
    } else {
      const lower = val.toLowerCase();
      if (lower.startsWith("equity")) {
        setSelectedGroup("Equity");
      } else if (lower.startsWith("debt")) {
        setSelectedGroup("Debt");
      } else if (lower.startsWith("hybrid")) {
        setSelectedGroup("Hybrid");
      } else {
        setSelectedGroup("Other");
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Category selector strip */}
      {categories.length > 1 && (
        <div className="rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Asset Class Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {["All", "Equity", "Debt", "Hybrid", "Other"].map((grp) => {
                const count = grp === "All" ? categories.length : (categoryGroups[grp]?.length || 0);
                if (count === 0 && grp !== "All") return null;
                return (
                  <button
                    key={grp}
                    onClick={() => handleGroupSelect(grp)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap",
                      selectedGroup === grp
                        ? "bg-[#fe9800] text-white shadow-xs"
                        : "bg-orange-50/70 text-gray-700 border border-orange-100/80 hover:border-orange-200 hover:bg-orange-100/60 hover:text-[#e65100]"
                    )}
                  >
                    {grp} <span className="opacity-80 text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Quick dropdown for all categories */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Select:</span>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-800 outline-none focus:border-[#fe9800] cursor-pointer min-w-[200px] sm:min-w-[260px]"
              >
                {selectedGroup === "All" ? (
                  <>
                    <option value="ALL">All Categories ({categories.length})</option>
                    {categories.map((cat) => (
                      <option key={cat.category} value={cat.category}>
                        {cat.category}
                      </option>
                    ))}
                  </>
                ) : (
                  <>
                    {selectedGroup === "Equity" && (
                      <option value="ALL_EQUITY">
                        All Equity ({categoryGroups.Equity?.length || 0} Categories)
                      </option>
                    )}
                    {selectedGroup === "Debt" && (
                      <option value="ALL_DEBT">
                        All Debt ({categoryGroups.Debt?.length || 0} Categories)
                      </option>
                    )}
                    {selectedGroup === "Hybrid" && (
                      <option value="ALL_HYBRID">
                        All Hybrid ({categoryGroups.Hybrid?.length || 0} Categories)
                      </option>
                    )}
                    {selectedGroup === "Other" && (
                      <option value="ALL_OTHER">
                        All Other ({categoryGroups.Other?.length || 0} Categories)
                      </option>
                    )}
                    {displayedCategories.map((cat) => (
                      <option key={cat.category} value={cat.category}>
                        {cat.category}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Top Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search input with Brand Icon Button */}
        <div className="flex items-center w-full sm:w-80 rounded-md border border-gray-300 bg-white overflow-hidden shadow-2xs">
          <div className="flex items-center justify-center bg-[#fe9800] px-3.5 py-2.5 text-white">
            <Search className="size-4" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 outline-none"
          />
        </div>

        {/* Right side controls: Show Entries & Excel Export */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) =>
                setPageSize(e.target.value === "All" ? "All" : Number(e.target.value))
              }
              className="rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-800 outline-none cursor-pointer focus:border-[#fe9800]"
            >
              <option value="All">All</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <button
            onClick={exportToExcel}
            disabled={visibleFunds.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="size-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Main Table Matching Screenshot 2-Tier Header */}
      <div className="overflow-x-auto rounded-lg border border-[#f0dfc8] bg-white shadow-xs">
        <table className="w-full text-left text-xs text-gray-700 border-collapse">
          <thead>
            {/* Top Tier Header */}
            <tr className="bg-[#FFF8EA] text-[#C2671A] font-bold text-[11px] border-b border-[#f3e5d0]">
              <th colSpan={9} className="px-3 py-2 border-r border-[#faeedd]" />
              <th
                colSpan={5}
                className="px-3 py-2 text-center border-l border-t border-r border-[#faeedd] bg-[#FFF3DC] text-[#B85C0A] tracking-wider uppercase text-[11px] font-extrabold"
              >
                Risk Ratios
              </th>
            </tr>

            {/* Bottom Tier Header */}
            <tr className="bg-[#FFF8EA] text-[#C2671A] font-bold text-[11px] border-b border-[#eddac2]">
              <th
                onClick={() => toggleSort("scheme_name")}
                className="px-3 py-3 cursor-pointer hover:bg-orange-100/50 whitespace-nowrap min-w-[200px]"
              >
                <div className="flex items-center gap-1">
                  <span>Scheme Name</span>
                  <SortIcon active={sortKey === "scheme_name"} dir={sortDir} />
                </div>
              </th>

              <th
                onClick={() => toggleSort("launch_date")}
                className="px-2.5 py-3 text-center cursor-pointer hover:bg-orange-100/50 whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Launch Date</span>
                  <SortIcon active={sortKey === "launch_date"} dir={sortDir} />
                </div>
              </th>

              <th
                onClick={() => toggleSort("aum_crore")}
                className="px-2.5 py-3 text-right cursor-pointer hover:bg-orange-100/50 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>AUM (Crore)</span>
                  <SortIcon active={sortKey === "aum_crore"} dir={sortDir} />
                </div>
              </th>

              <th
                onClick={() => toggleSort("ter_percent")}
                className="px-2 py-3 text-right cursor-pointer hover:bg-orange-100/50 whitespace-nowrap border-r border-[#faeedd]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>TER (%)</span>
                  <SortIcon active={sortKey === "ter_percent"} dir={sortDir} />
                </div>
              </th>

              <th
                onClick={() => toggleSort("rating")}
                className="px-3 py-3 cursor-pointer hover:bg-orange-100/50 whitespace-nowrap border-r border-[#faeedd]"
              >
                <div className="flex items-center gap-1">
                  <span>Rating</span>
                  <SortIcon active={sortKey === "rating"} dir={sortDir} />
                </div>
              </th>

              <th
                onClick={() => toggleSort("return_1yr")}
                className="px-2.5 py-3 text-right cursor-pointer hover:bg-orange-100/50 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>1 Yr Rtn (%)</span>
                  <SortIcon active={sortKey === "return_1yr"} dir={sortDir} />
                </div>
              </th>

              <th
                onClick={() => toggleSort("return_3yr")}
                className="px-2.5 py-3 text-right cursor-pointer hover:bg-orange-100/50 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>3 Yrs Rtn (%)</span>
                  <SortIcon active={sortKey === "return_3yr"} dir={sortDir} />
                </div>
              </th>

              <th
                onClick={() => toggleSort("return_5yr")}
                className="px-2.5 py-3 text-right cursor-pointer hover:bg-orange-100/50 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>5 Yrs Rtn (%)</span>
                  <SortIcon active={sortKey === "return_5yr"} dir={sortDir} />
                </div>
              </th>

              <th
                onClick={() => toggleSort("return_10yr")}
                className="px-2.5 py-3 text-right cursor-pointer hover:bg-orange-100/50 whitespace-nowrap border-r border-[#faeedd]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>10 Yrs Rtn (%)</span>
                  <SortIcon active={sortKey === "return_10yr"} dir={sortDir} />
                </div>
              </th>

              {/* Risk Ratios Columns */}
              <th
                onClick={() => toggleSort("mean")}
                className="px-2.5 py-3 text-right cursor-pointer hover:bg-orange-100/50 whitespace-nowrap bg-[#FFF3DC]/60"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Mean</span>
                  <SortIcon active={sortKey === "mean"} dir={sortDir} />
                </div>
              </th>

              <th
                onClick={() => toggleSort("sharpe_ratio")}
                className="px-2.5 py-3 text-right cursor-pointer hover:bg-orange-100/50 whitespace-nowrap bg-[#FFF3DC]/60"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Sharp Ratio</span>
                  <SortIcon active={sortKey === "sharpe_ratio"} dir={sortDir} />
                </div>
              </th>

              <th
                onClick={() => toggleSort("alpha")}
                className="px-2 py-3 text-right cursor-pointer hover:bg-orange-100/50 whitespace-nowrap bg-[#FFF3DC]/60"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Alpha</span>
                  <SortIcon active={sortKey === "alpha"} dir={sortDir} />
                </div>
              </th>

              <th
                onClick={() => toggleSort("beta")}
                className="px-2 py-3 text-right cursor-pointer hover:bg-orange-100/50 whitespace-nowrap bg-[#FFF3DC]/60"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Beta</span>
                  <SortIcon active={sortKey === "beta"} dir={sortDir} />
                </div>
              </th>

              <th
                onClick={() => toggleSort("std_deviation")}
                className="px-2.5 py-3 text-right cursor-pointer hover:bg-orange-100/50 whitespace-nowrap bg-[#FFF3DC]/60"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Std. Deviation</span>
                  <SortIcon active={sortKey === "std_deviation"} dir={sortDir} />
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {tableMessage ? (
              <tr>
                <td colSpan={14} className="px-4 py-12 text-center text-sm font-medium text-gray-500">
                  {tableMessage}
                </td>
              </tr>
            ) : (
              visibleFunds.map((fund, idx) => (
                <tr
                  key={fund.id}
                  className={cn(
                    "transition-colors hover:bg-orange-50/30",
                    idx % 2 === 1 ? "bg-[#fcfdfd]" : "bg-white"
                  )}
                >
                  <td className="px-3 py-3 font-medium whitespace-nowrap">
                    <Link
                      href={`/mutual-funds/fund-card?${new URLSearchParams({
                        category: fund.category,
                        scheme: fund.scheme_name,
                      })}`}
                      className="text-[#0B63E5] hover:text-[#084bb3] hover:underline font-bold transition-colors"
                    >
                      {fund.scheme_name}
                    </Link>
                    {fund.category && (
                      <span className="block text-[10px] text-gray-400 font-normal mt-0.5">
                        {fund.category}
                      </span>
                    )}
                  </td>

                  <td className="px-2.5 py-3 text-center text-gray-600 whitespace-nowrap">
                    {formatDate(fund.launch_date)}
                  </td>

                  <td className="px-2.5 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                    {formatAum(fund.aum_crore)}
                  </td>

                  <td className="px-2 py-3 text-right text-gray-700 whitespace-nowrap border-r border-gray-100">
                    {formatFixed(fund.ter_percent)}
                  </td>

                  <td className="px-3 py-3 text-gray-800 whitespace-nowrap border-r border-gray-100 text-[11px] font-medium leading-tight">
                    {fund.rating || "-"}
                  </td>

                  <td className={cn("px-2.5 py-3 text-right font-semibold whitespace-nowrap", returnTone(toNumber(fund.return_1yr)))}>
                    {formatFixed(fund.return_1yr)}
                  </td>

                  <td className={cn("px-2.5 py-3 text-right font-semibold whitespace-nowrap", returnTone(toNumber(fund.return_3yr)))}>
                    {formatFixed(fund.return_3yr)}
                  </td>

                  <td className={cn("px-2.5 py-3 text-right font-semibold whitespace-nowrap", returnTone(toNumber(fund.return_5yr)))}>
                    {formatFixed(fund.return_5yr)}
                  </td>

                  <td className={cn("px-2.5 py-3 text-right font-semibold whitespace-nowrap border-r border-gray-100", returnTone(toNumber(fund.return_10yr)))}>
                    {formatFixed(fund.return_10yr)}
                  </td>

                  {/* Risk Ratios Values */}
                  <td className="px-2.5 py-3 text-right text-gray-800 whitespace-nowrap">
                    {formatFixed(fund.mean)}
                  </td>

                  <td className="px-2.5 py-3 text-right text-gray-800 whitespace-nowrap">
                    {formatFixed(fund.sharpe_ratio)}
                  </td>

                  <td className="px-2 py-3 text-right text-gray-800 whitespace-nowrap">
                    {formatFixed(fund.alpha)}
                  </td>

                  <td className="px-2 py-3 text-right text-gray-800 whitespace-nowrap">
                    {formatFixed(fund.beta)}
                  </td>

                  <td className="px-2.5 py-3 text-right text-gray-800 whitespace-nowrap">
                    {formatFixed(fund.std_deviation)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
