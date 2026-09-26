// Shared types and formatting for /api/mutual-fund-performance/ data, used by
// the trailing returns table and the scheme detail page.

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://solidwealthindia.com";

export type ReturnKey =
  | "return_1w"
  | "return_1m"
  | "return_3m"
  | "return_6m"
  | "ytd_return"
  | "return_1yr"
  | "return_2yr"
  | "return_3yr"
  | "return_5yr"
  | "return_10yr";

export type RankKey = "rank_1yr" | "rank_2yr" | "rank_3yr" | "rank_5yr" | "rank_10yr";

export type RiskRatioKey = "mean" | "sharpe_ratio" | "alpha" | "beta" | "std_deviation";

// A row from /api/mutual-fund-performance/. DRF serialises decimals as strings.
export type FundPerformance = {
  id: number;
  category: string;
  period?: string;
  scheme_name: string;
  nav: string | null;
  launch_date: string | null;
  aum_crore: string | null;
  ber_percent: string | null;
  ter_percent: string | null;
  rating: string | null;
  mean: string | null;
  sharpe_ratio: string | null;
  alpha: string | null;
  beta: string | null;
  std_deviation: string | null;
  fund_manager: string | null;
  created_at: string;
} & Partial<Record<ReturnKey, string | null>> &
  Partial<Record<RankKey, string | null>>;

export interface CategoryOption {
  category: string;
  periods?: string[];
}

export interface ReturnColumn {
  label: string;
  returnKey: ReturnKey;
  rankKey?: RankKey;
}

export const SHORT_TERM_COLUMNS: ReturnColumn[] = [
  { label: "1 Week", returnKey: "return_1w" },
  { label: "1 Month", returnKey: "return_1m" },
  { label: "3 Months", returnKey: "return_3m" },
  { label: "6 Months", returnKey: "return_6m" },
  { label: "YTD", returnKey: "ytd_return" },
];

export const LONG_TERM_COLUMNS: ReturnColumn[] = [
  { label: "1 Yr Rtn (%)", returnKey: "return_1yr", rankKey: "rank_1yr" },
  { label: "3 Yrs Rtn (%)", returnKey: "return_3yr", rankKey: "rank_3yr" },
  { label: "5 Yrs Rtn (%)", returnKey: "return_5yr", rankKey: "rank_5yr" },
  { label: "10 Yrs Rtn (%)", returnKey: "return_10yr", rankKey: "rank_10yr" },
];

export function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function formatFixed(value: string | number | null | undefined, decimals = 2) {
  const n = toNumber(value);
  return n === null ? "-" : n.toFixed(decimals);
}

export function formatAum(value: string | number | null | undefined) {
  const n = toNumber(value);
  if (n === null) return "-";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const str = value.slice(0, 10);
  const parts = str.split("-");
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD -> DD-MM-YYYY
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    // DD-MM-YYYY
    return str;
  }
  return str;
}

export function returnTone(value: number | null) {
  if (value === null) return "text-gray-400";
  return value >= 0 ? "text-emerald-600" : "text-rose-600";
}
