"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { appLinks } from "@/lib/app-links";
import { cn } from "@/lib/utils";
import type { FundAnalytics } from "@/lib/fund-analytics";
import {
  API_BASE_URL,
  LONG_TERM_COLUMNS,
  SHORT_TERM_COLUMNS,
  formatAum,
  formatDate,
  formatFixed,
  returnTone,
  toNumber,
  type FundPerformance,
  type ReturnKey,
} from "@/lib/mutual-fund-performance";
import { FundAnalyticsSections } from "./fund-analytics-sections";

interface SchemePerformanceDetailProps {
  category: string;
  scheme: string;
  period?: string;
}

type Status = "loading" | "ready" | "not-found" | "error";

const RETURN_COLUMNS = [...SHORT_TERM_COLUMNS, ...LONG_TERM_COLUMNS];

// "4/13" -> "4 of 13"
function formatRank(rank: string | null | undefined) {
  if (!rank) return "-";
  const [position, total] = rank.split("/");
  return total ? `${position.trim()} of ${total.trim()}` : rank;
}

function withRupee(value: string) {
  return value === "-" ? value : `₹ ${value}`;
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#64748b]">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-[#0f172a] break-words">{value}</p>
    </div>
  );
}

function StripItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2 text-center">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#b45309]">{value}</p>
    </div>
  );
}

export function SchemePerformanceDetail({ category, scheme, period }: SchemePerformanceDetailProps) {
  const hasParams = Boolean(category && scheme);
  const [rows, setRows] = useState<FundPerformance[]>([]);
  const [status, setStatus] = useState<Status>(hasParams ? "loading" : "not-found");
  const [reloadKey, setReloadKey] = useState(0);
  const [analytics, setAnalytics] = useState<FundAnalytics | null>(null);
  const [analyticsStatus, setAnalyticsStatus] = useState<"loading" | "ready" | "error">("loading");
  const [analyticsReloadKey, setAnalyticsReloadKey] = useState(0);

  useEffect(() => {
    if (!category || !scheme) return;
    const controller = new AbortController();
    const load = async () => {
      const params = new URLSearchParams({ category });
      if (period) {
        params.set("period", period);
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/mutual-fund-performance/?${params}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Fund performance request failed with ${res.status}`);
        const payload: FundPerformance[] = await res.json();
        if (controller.signal.aborted) return;
        setRows(payload);
        setStatus(payload.some((row) => row.scheme_name === scheme) ? "ready" : "not-found");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to load scheme performance:", err);
        setStatus("error");
      }
    };
    load();
    return () => controller.abort();
  }, [category, period, scheme, reloadKey]);

  const backendFund = rows.find((row) => row.scheme_name === scheme);
  const fundNav = backendFund?.nav ?? null;
  const uploadedOn = backendFund?.created_at ? backendFund.created_at.slice(0, 10) : null;

  const fund: FundPerformance | null =
    backendFund ||
    (analyticsStatus === "ready" && analytics?.matched
      ? {
          id: 0,
          category: analytics.scheme.category || category,
          scheme_name: scheme,
          nav: String(analytics.nav.value),
          launch_date: analytics.history.firstDate,
          aum_crore: null,
          ber_percent: null,
          ter_percent: null,
          rating: null,
          mean: null,
          sharpe_ratio: null,
          alpha: null,
          beta: null,
          std_deviation: analytics.volatility3y != null ? String(analytics.volatility3y.toFixed(2)) : null,
          fund_manager: null,
          created_at: analytics.nav.date,
        }
      : null);

  // NAV history, category comparison and SIP figures come from our own route
  // handler, which links the uploaded row to its AMFI scheme.
  useEffect(() => {
    if (!scheme) return;
    const controller = new AbortController();
    const load = async () => {
      const params = new URLSearchParams({ scheme });
      if (category) params.set("category", category);
      if (fundNav && Number(fundNav) > 0) params.set("nav", fundNav);
      if (uploadedOn) params.set("uploadedOn", uploadedOn);
      try {
        const res = await fetch(`/api/fund-analytics?${params}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Fund analytics request failed with ${res.status}`);
        const payload: FundAnalytics = await res.json();
        if (controller.signal.aborted) return;
        setAnalytics(payload);
        setAnalyticsStatus("ready");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to load fund analytics:", err);
        setAnalyticsStatus("error");
      }
    };
    load();
    return () => controller.abort();
  }, [category, scheme, fundNav, uploadedOn, analyticsReloadKey]);

  // Mean across the schemes in the uploaded category, matching the average row
  // on the trailing returns table. Used when the scheme can't be linked to AMFI.
  const listedAverage = useMemo(() => {
    const averages: Partial<Record<ReturnKey, number | null>> = {};
    for (const { returnKey } of RETURN_COLUMNS) {
      const values = rows
        .map((row) => toNumber(row[returnKey]))
        .filter((value): value is number => value !== null);
      averages[returnKey] = values.length
        ? values.reduce((sum, value) => sum + value, 0) / values.length
        : null;
    }
    return averages;
  }, [rows]);

  const retry = () => {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  };

  const retryAnalytics = () => {
    setAnalyticsStatus("loading");
    setAnalyticsReloadKey((key) => key + 1);
  };

  const messageBox = (content: React.ReactNode) => (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center text-sm font-medium text-gray-500 shadow-xs">
      {content}
    </div>
  );

  const linked = analyticsStatus === "ready" && analytics?.matched ? analytics : null;
  const isReady = (status === "ready" && Boolean(fund)) || (analyticsStatus === "ready" && Boolean(analytics?.matched) && Boolean(fund));
  const isLoading = status === "loading" && analyticsStatus === "loading";
  const isNotFound = !isReady && !isLoading && (status === "not-found" || status === "error") && analyticsStatus === "ready" && !analytics?.matched;
  const isError = !isReady && !isLoading && status === "error" && analyticsStatus === "error";

  return (
    <div className="w-full space-y-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link href="/" className="hover:text-[#fe9800] transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3 text-gray-400" />
        <Link href="/mutual-funds" className="hover:text-[#fe9800] transition-colors">
          MF Research
        </Link>
        <ChevronRight className="size-3 text-gray-400" />
        <span className="text-gray-900 font-bold">Fund Card</span>
      </nav>

      {isLoading && messageBox("Loading scheme details...")}

      {isError &&
        messageBox(
          <span>
            Couldn&apos;t load this scheme.{" "}
            <button
              type="button"
              onClick={retry}
              className="font-bold text-[#0B63E5] hover:underline cursor-pointer"
            >
              Retry
            </button>
          </span>
        )}

      {isNotFound &&
        messageBox(
          <span>
            {hasParams ? "This scheme isn't in the latest uploaded data or AMFI registry." : "No scheme selected."}{" "}
            <Link href="/mutual-funds" className="font-bold text-[#0B63E5] hover:underline">
              Browse trailing returns
            </Link>
          </span>
        )}

      {isReady && fund && (
        <>
          <div className="text-center space-y-2">
            <span className="inline-block rounded-full bg-[#FFEFC2] px-4 py-1 text-xs font-bold text-[#b86e00]">
              {fund.category}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a2332] tracking-tight">
              {fund.scheme_name}
            </h1>
            {linked && (
              <p className="text-sm text-gray-500">
                {linked.scheme.name} · Regular Plan · Growth
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 rounded-2xl border border-blue-100 bg-[#F0F6FF]/70 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Fund Manager" value={fund.fund_manager || "-"} />
              <InfoItem label="Category" value={linked?.scheme.category ?? fund.category} />
              <InfoItem label="Fund House" value={linked?.scheme.fundHouse ?? "-"} />
              <InfoItem
                label="AMFI Code / ISIN"
                value={linked ? `${linked.scheme.code}${linked.scheme.isin ? ` / ${linked.scheme.isin}` : ""}` : "-"}
              />
            </div>

            <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs flex flex-col items-center justify-center text-center">
              {linked ? (
                <>
                  <p className="text-xs font-semibold text-gray-500">NAV (as on {formatDate(linked.nav.date)})</p>
                  <p className="mt-1 text-3xl font-black text-[#1a2332]">
                    ₹ {linked.nav.value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </p>
                  {linked.nav.change !== null && linked.nav.changePct !== null && (
                    <p
                      className={cn(
                        "mt-1.5 inline-flex items-center gap-1 text-xs font-bold",
                        linked.nav.change >= 0 ? "text-emerald-600" : "text-rose-600"
                      )}
                    >
                      {linked.nav.change >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                      {linked.nav.change >= 0 ? "+" : ""}
                      {linked.nav.change.toFixed(4)} ({linked.nav.changePct >= 0 ? "+" : ""}
                      {linked.nav.changePct.toFixed(2)}%)
                    </p>
                  )}
                </>
              ) : fund.nav ? (
                <>
                  <p className="text-xs font-semibold text-gray-500">
                    NAV {fund.created_at ? `(as per upload, ${formatDate(fund.created_at)})` : ""}
                  </p>
                  <p className="mt-1 text-3xl font-black text-[#1a2332]">{withRupee(formatFixed(fund.nav))}</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-gray-500">NAV</p>
                  <p className="mt-1 text-3xl font-black text-gray-300">—</p>
                </>
              )}
            </div>

            <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-gray-500">
                AUM {fund.created_at ? `(as per upload, ${formatDate(fund.created_at)})` : ""}
              </p>
              <p className="mt-1 text-3xl font-black text-[#1a2332]">
                {fund.aum_crore === null ? "-" : `${withRupee(formatAum(fund.aum_crore))} Cr`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-amber-200/70 rounded-2xl border border-amber-100 bg-[#FFFBEA] py-3">
            <StripItem
              label="Return since first NAV (p.a.)"
              value={linked?.history.cagrSinceFirstNav != null ? `${linked.history.cagrSinceFirstNav.toFixed(2)}%` : "-"}
            />
            <StripItem label="NAV history from" value={linked ? formatDate(linked.history.firstDate) : "-"} />
            <StripItem label="Launch Date" value={formatDate(fund.launch_date || linked?.history.firstDate)} />
            <StripItem
              label="Expense Ratio"
              value={fund.ber_percent || fund.ter_percent ? `BER ${formatFixed(fund.ber_percent)}% | TER ${formatFixed(fund.ter_percent)}%` : "-"}
            />
            <StripItem
              label="Volatility (3Y, annualised)"
              value={linked?.volatility3y != null ? `${linked.volatility3y.toFixed(2)}%` : "-"}
            />
          </div>

          {analyticsStatus === "loading" &&
            messageBox("Loading NAV history and category comparison...")}

          {analyticsStatus === "error" &&
            messageBox(
              <span>
                Couldn&apos;t load NAV history right now.{" "}
                <button
                  type="button"
                  onClick={retryAnalytics}
                  className="font-bold text-[#0B63E5] hover:underline cursor-pointer"
                >
                  Retry
                </button>
              </span>
            )}

          {linked && <FundAnalyticsSections analytics={linked} />}

          {analyticsStatus === "ready" && analytics && !analytics.matched && (
            <div className="space-y-3">
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {analytics.reason === "ambiguous"
                  ? "This scheme shares its NAV with another scheme in AMFI's list, so we can't safely link its NAV history. Showing uploaded figures only."
                  : "We couldn't link this scheme to AMFI's NAV history, so only the uploaded figures are shown."}
              </p>
              <h2 className="text-lg font-extrabold text-[#1a2332]">Returns (as per upload, {formatDate(fund.created_at)})</h2>
              <div className="overflow-x-auto rounded-2xl border border-[#e5e7eb] bg-white shadow-xs">
                <table className="w-full text-left text-sm text-gray-700 border-collapse tabular-nums">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] bg-[#FFF8EA] text-[#8a5b15] font-bold text-xs uppercase tracking-wider">
                      <th className="px-4 py-3 whitespace-nowrap">Period</th>
                      <th className="px-4 py-3 text-right whitespace-nowrap">Return (%)</th>
                      <th className="px-4 py-3 text-right whitespace-nowrap">Avg. of listed schemes (%)</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Rank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {RETURN_COLUMNS.map((col) => {
                      const average = listedAverage[col.returnKey];
                      return (
                        <tr key={col.returnKey}>
                          <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{col.label}</td>
                          <td className={cn("px-4 py-3 text-right font-bold whitespace-nowrap", returnTone(toNumber(fund[col.returnKey])))}>
                            {formatFixed(fund[col.returnKey])}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                            {average === null || average === undefined ? "-" : average.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">
                            {col.rankKey ? formatRank(fund[col.rankKey]) : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <p className="text-xs leading-relaxed text-gray-500">
            {linked
              ? `NAV, returns, growth and SIP figures are calculated from AMFI NAV history (via mfapi.in) as of ${formatDate(linked.nav.date)}. Category averages and ranks compare the ${linked.categorySchemes} Regular plan Growth schemes in AMFI's "${linked.scheme.category}" category, so they can differ slightly from other research platforms. Volatility is the annualised standard deviation of the last 36 monthly returns. `
              : ""}
            AUM, expense ratios, launch date and fund manager are from the uploaded performance data dated {formatDate(fund.created_at)}. Past performance does not guarantee future returns.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            <Link
              href="/mutual-funds"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>Back to trailing returns</span>
            </Link>
            <Link
              href={appLinks.android}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#fe9800] text-sm font-bold text-white hover:bg-orange-500 transition-colors"
            >
              <span>Invest Now</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
