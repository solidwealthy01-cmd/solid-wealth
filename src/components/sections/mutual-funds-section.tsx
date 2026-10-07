"use client";
import React, { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { appLinks } from "@/lib/app-links";
import { cn } from "@/lib/utils";
// Shape of /api/nav/company-summary. Backends from before the AMFI column
// change omit nav_date, sebi_category, plan and option, and send a null NAV.
interface Scheme {
    scheme_code: string;
    isin_div_payout_growth: string | null;
    isin_div_reinvestment: string | null;
    scheme_name: string;
    net_asset_value: string | null;
    raw_line: string;
    nav_date?: string;
    sebi_category?: string;
    plan?: string;
    option?: string;
}
interface Company {
    company_name: string;
    nav_date: string;
    nav: Scheme[];
}
interface ApiResponse {
    count: number;
    results: Company[];
}
interface Fund {
    name: string;
    company: string;
    group: string;
    category: string;
    plan: string;
    option: string;
    nav: number | null;
    navDate: string | null;
    schemeCode: string;
    isinGrowth: string | null;
    isinReinvestment: string | null;
}
const PAGE_SIZE = 6;
const MONTHS: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};
// "11-Sep-2026" -> "2026-09-11"
function amfiDateToIso(value: string | null | undefined): string | null {
    if (!value) return null;
    const match = String(value).trim().match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
    const month = match ? MONTHS[match[2].toLowerCase()] : undefined;
    return match && month ? `${match[3]}-${month}-${match[1].padStart(2, "0")}` : null;
}
function toNumber(value: string | number | null | undefined): number | null {
    if (value == null) return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    const str = String(value).trim();
    if (str === "" || str === "-") return null;
    const num = Number(str.replace(/,/g, ""));
    return Number.isFinite(num) ? num : null;
}
function cleanIsin(value: string | null | undefined): string | null {
    if (value == null) return null;
    const v = String(value).trim();
    return v === "" || v === "-" ? null : v;
}
// "Open Ended Schemes(Equity Scheme - Large Cap Fund)" -> Equity, "Large Cap Fund".
// AMFI still uses its pre-2018 names for some schemes (Growth, Income, Gilt).
function parseCategory(heading: string | undefined) {
    const inner = heading?.match(/\((.*)\)\s*$/)?.[1]?.trim() ?? "";
    if (!inner)
        return { group: "", category: "" };
    const [kind, ...rest] = inner.split(" - ");
    const k = kind.trim().toLowerCase();
    let group = "Other";
    if (k.startsWith("equity") || k.startsWith("elss") || k.startsWith("growth"))
        group = "Equity";
    else if (k.startsWith("debt") || k.startsWith("income") || k.startsWith("money market") || k.startsWith("gilt"))
        group = "Debt";
    else if (k.startsWith("hybrid"))
        group = "Hybrid";
    return { group, category: rest.join(" - ").trim() || kind.trim() };
}
function toFund(company: Company, scheme: Scheme): Fund {
    // raw_line is the untouched AMFI row. Its last two columns are always NAV
    // and date, and 8-column rows carry Plan and Option at positions 4 and 5.
    const parts = (scheme.raw_line ?? "").split(";").map((part) => part.trim());
    const hasPlanColumns = parts.length >= 8;
    const { group, category } = parseCategory(scheme.sebi_category);
    return {
        name: scheme.scheme_name,
        company: company.company_name,
        group,
        category,
        plan: scheme.plan ?? (hasPlanColumns ? parts[4] : ""),
        option: scheme.option ?? (hasPlanColumns ? parts[5] : ""),
        nav: toNumber(scheme.net_asset_value) ?? toNumber(parts[parts.length - 2]),
        navDate: scheme.nav_date ?? amfiDateToIso(parts[parts.length - 1]) ?? company.nav_date ?? null,
        schemeCode: scheme.scheme_code,
        isinGrowth: cleanIsin(scheme.isin_div_payout_growth),
        isinReinvestment: cleanIsin(scheme.isin_div_reinvestment),
    };
}
function formatNav(nav: number | null) {
    return nav === null
        ? "—"
        : `₹${nav.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
}
function formatDate(iso: string | null) {
    if (!iso)
        return "—";
    return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}
function shortOption(option: string) {
    return option.replace(/\s*option$/i, "").trim();
}
export function MutualFundsSection() {
    const [allFunds, setAllFunds] = useState<Fund[]>([]);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [reloadKey, setReloadKey] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedFund, setSelectedFund] = useState<Fund | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
            try {
                // Same payload as the backend's /api/nav/company-summary/, but proxied
                // through our route handler, which caches it until midnight IST.
                const res = await fetch("/api/nav/company-summary", { signal: controller.signal });
                if (!res.ok)
                    throw new Error(`Company NAV summary request failed with ${res.status}`);
                const data: ApiResponse = await res.json();
                if (controller.signal.aborted)
                    return;
                setAllFunds(data.results.flatMap((company) => company.nav.map((scheme) => toFund(company, scheme))));
                setStatus("ready");
            }
            catch (err) {
                if ((err as Error).name === "AbortError")
                    return;
                console.error("Failed to load mutual fund NAVs:", err);
                setStatus("error");
            }
        };
        load();
        return () => controller.abort();
    }, [reloadKey]);

    const retry = () => {
        setStatus("loading");
        setReloadKey((key) => key + 1);
    };

    const pagesData = React.useMemo(() => {
        const pages: Fund[][] = [];
        for (let i = 0; i < allFunds.length; i += PAGE_SIZE) {
            pages.push(allFunds.slice(i, i + PAGE_SIZE));
        }
        return pages;
    }, [allFunds]);

    const latestNavDate = React.useMemo(() => allFunds.reduce<string | null>((latest, fund) => (fund.navDate && (!latest || fund.navDate > latest) ? fund.navDate : latest), null), [allFunds]);
    const totalPages = pagesData.length;
    const paginationItems = React.useMemo(() => {
        if (totalPages <= 7)
            return Array.from({ length: totalPages }, (_, i) => i);
        if (activeIndex <= 3)
            return [0, 1, 2, 3, 4, '...', totalPages - 1];
        if (activeIndex >= totalPages - 4)
            return [0, '...', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
        return [0, '...', activeIndex - 1, activeIndex, activeIndex + 1, '...', totalPages - 1];
    }, [activeIndex, totalPages]);

    return (<section id="mutual-funds" className="w-full bg-[#FFFDF4] pt-20 md:pt-28 pb-10 md:pb-15 px-4 md:px-8 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center">


        <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
          <span className="inline-flex items-center justify-center px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-full bg-[#FFEFC2] text-[#fe9800] mb-6 shadow-sm">
            Mutual Funds
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#1a2332]">
            Invest <span className="text-[#fe9800]">Smart</span>, Solid Wealth
          </h2>
        </div>

        {status === "loading" ? (<div className="relative w-full px-2 md:px-16 flex items-center mb-6">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (<div key={i} className="bg-white border border-[#EBEFF5] rounded-[32px] p-8 flex flex-col justify-between h-[340px] animate-pulse shadow-sm">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="h-7 bg-slate-100 rounded-md w-3/4"></div>
                      <div className="h-6 bg-slate-100 rounded-full w-16"></div>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-md w-1/3 mb-8"></div>
                    <div className="h-5 bg-slate-100 rounded-md w-1/2"></div>
                  </div>
                  <div>
                    <div className="border-t border-[#F0F4FA] my-6"/>
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-4 bg-slate-100 rounded-md w-1/3"></div>
                      <div className="h-6 bg-slate-100 rounded-md w-1/4"></div>
                    </div>
                    <div className="w-full h-12 bg-slate-100 rounded-full"></div>
                  </div>
                </div>))}
            </div>
          </div>) : status === "error" ? (<div className="w-full text-center text-gray-500 py-16 bg-slate-50 rounded-[32px] border border-slate-100/80 mb-12 flex flex-col items-center justify-center p-8">
            <p className="text-lg font-bold text-[#0B1F3A] mb-1">Couldn&apos;t load mutual fund NAVs</p>
            <p className="text-sm text-gray-400 mb-5">Please try again in a moment.</p>
            <button onClick={retry} className="px-6 py-2.5 rounded-full bg-[#0B1F3A] hover:bg-[#152e52] text-white text-sm font-bold transition-colors cursor-pointer">
              Retry
            </button>
          </div>) : pagesData.length > 0 ? (<>

            <div className="relative w-full md:px-4 flex items-center mb-6">

              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
                {pagesData[activeIndex]?.map((fund) => (<div key={fund.schemeCode} className="bg-white border border-[#EBEFF5] rounded-[32px] p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div>

                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="text-xl font-extrabold text-[#0B1F3A] leading-snug tracking-tight line-clamp-2" title={fund.name}>
                          {fund.name}
                        </h3>
                        {fund.option && (<span className="px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 bg-[#FFF8EB] text-[#B86E00] max-w-[45%] truncate" title={fund.option}>
                            {shortOption(fund.option)}
                          </span>)}
                      </div>


                      <p className="text-sm font-medium text-gray-400">
                        {fund.category || fund.plan || "Mutual fund scheme"}
                      </p>


                      <p className="mt-6 text-sm font-semibold text-[#475467]">
                        {fund.company}
                      </p>
                    </div>

                    <div>

                      <div className="border-t border-[#F0F4FA] my-6"/>


                      <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-medium text-gray-400">
                          NAV
                          {fund.navDate && <span className="block text-xs">as of {formatDate(fund.navDate)}</span>}
                        </span>
                        <span className="text-lg font-bold text-[#0B1F3A]">
                          {formatNav(fund.nav)}
                        </span>
                      </div>


                      <button onClick={() => setSelectedFund(fund)} className="w-full bg-[#0B1F3A] hover:bg-[#152e52] text-white py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-200 group cursor-pointer">
                        View Details
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                        </svg>
                      </button>
                    </div>
                  </div>))}
              </div>

            </div>


            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 px-4">

              <button onClick={() => setActiveIndex((activeIndex - 1 + pagesData.length) % pagesData.length)} className="flex items-center justify-center gap-1 h-10 px-3 text-slate-500 hover:text-[#0B1F3A] hover:bg-slate-50 rounded-md transition-colors cursor-pointer disabled:opacity-50" aria-label="Previous page">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
                <span className="hidden sm:inline font-semibold text-sm">Previous</span>
              </button>


              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {paginationItems.map((item, i) => (item === '...' ? (<span key={`ellipsis-${i}`} className="flex items-center justify-center w-8 h-8 text-slate-400">...</span>) : (<button key={item as number} onClick={() => setActiveIndex(item as number)} className={cn("flex items-center justify-center min-w-[32px] h-8 px-2 rounded-md text-sm font-semibold transition-all cursor-pointer", activeIndex === item
                    ? "bg-[#fe9800] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#1a2332]")}>
                      {(item as number) + 1}
                    </button>)))}
              </div>


              <button onClick={() => setActiveIndex((activeIndex + 1) % pagesData.length)} className="flex items-center justify-center gap-1 h-10 px-3 text-slate-500 hover:text-[#0B1F3A] hover:bg-slate-50 rounded-md transition-colors cursor-pointer disabled:opacity-50" aria-label="Next page">
                <span className="hidden sm:inline font-semibold text-sm">Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-400 text-center">
              Regular plan NAVs published by AMFI{latestNavDate ? `, latest ${formatDate(latestNavDate)}` : ""}.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/mutual-funds"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a2332] text-white hover:bg-[#fe9800] text-sm font-bold shadow-md transition-all hover:scale-105"
              >
                <span>Explore Trailing Returns</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </>) : (<div className="w-full text-center text-gray-500 py-16 bg-slate-50 rounded-[32px] border border-slate-100/80 mb-12 flex flex-col items-center justify-center p-8">
            <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <p className="text-lg font-bold text-[#0B1F3A] mb-1">No mutual funds available</p>
            <p className="text-sm text-gray-400">
              No schemes in today&apos;s AMFI list.
            </p>
          </div>)}
      </div>


      {selectedFund && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedFund(null)}>
          <div role="dialog" aria-modal="true" aria-label={selectedFund.name} className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div className="pr-4">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full mb-3">
                  {selectedFund.company}
                </span>
                <h3 className="text-2xl font-bold text-[#0B1F3A] leading-tight">
                  {selectedFund.name}
                </h3>
              </div>
              <button onClick={() => setSelectedFund(null)} className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 cursor-pointer" aria-label="Close details">
                <X className="size-5"/>
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 mb-8">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Net Asset Value (NAV)
              </p>
              <p className="text-3xl font-bold text-[#0B1F3A]">
                {formatNav(selectedFund.nav)}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                As of {formatDate(selectedFund.navDate)}
              </p>
            </div>

            <dl className="mb-8 text-sm">
              {[
                ["Fund House", selectedFund.company],
                ["Category", [selectedFund.group, selectedFund.category].filter(Boolean).join(" · ")],
                ["Plan", selectedFund.plan],
                ["Option", selectedFund.option],
                ["Scheme Code", selectedFund.schemeCode],
                ["ISIN (Payout/Growth)", selectedFund.isinGrowth],
                ["ISIN (Reinvestment)", selectedFund.isinReinvestment],
            ].map(([label, value]) => (<div key={label} className="flex justify-between items-center gap-4 py-3 border-b border-gray-100">
                  <dt className="text-gray-500 font-medium">{label}</dt>
                  <dd className="text-[#0B1F3A] font-semibold text-right">{value || "—"}</dd>
                </div>))}
            </dl>

            <div className="flex gap-3">
              <button className="flex-1 bg-white border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer" onClick={() => setSelectedFund(null)}>
                Close
              </button>
              <Link href={appLinks.android} target="_blank" rel="noopener noreferrer" className="flex-[2] bg-[#fe9800] text-white font-bold py-3.5 rounded-xl hover:bg-orange-500 transition-colors flex items-center justify-center">
                Invest Now
                <svg className="ml-2 size-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>)}
    </section>);
}
