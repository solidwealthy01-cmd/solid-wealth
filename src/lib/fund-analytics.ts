// Fund analytics computed from free NAV data: AMFI's daily NAV file supplies the
// scheme list and SEBI categories, and mfapi.in supplies each scheme's full NAV
// history by AMFI scheme code. Server-side only (AMFI does not allow browser
// requests), called from app/api/fund-analytics/route.ts.
//
// Checked against the vendor fund card for ABSL Multi-Cap Regular Growth as of
// 11-Sep-2026: trailing returns within 0.02, growth of 10,000 within 0.1%, SIP
// XIRR within ~0.1. Category averages and ranks use AMFI's category list, which
// differs slightly from the vendor's fund universe.

// Also read by lib/nav-company-summary.ts, which needs the category headings.
export const AMFI_NAV_URL = "https://portal.amfiindia.com/spages/NAVAll.txt";
const MFAPI_URL = "https://api.mfapi.in/mf";
const REVALIDATE_SECONDS = 6 * 60 * 60;
const FETCH_CONCURRENCY = 8;
// The uploaded performance sheet is dated a day or so after its NAV date.
const MATCH_WINDOW_DAYS = 10;
// A scheme whose latest NAV is older than this is left out of category figures.
const STALE_NAV_DAYS = 7;
const SIP_INSTALMENT = 10_000;
const LUMPSUM = 10_000;
const DAY_MS = 86_400_000;

interface NavPoint {
  date: string; // YYYY-MM-DD
  nav: number;
}

interface AmfiScheme {
  code: string;
  name: string;
  isin: string | null;
  fundHouse: string;
  category: string;
  subcategory: string;
}

interface SchemeHistory {
  scheme: AmfiScheme;
  history: NavPoint[];
}

interface PeriodSpec {
  key: string;
  label: string;
  days?: number;
  months?: number;
  ytd?: boolean;
  annualise: boolean;
}

const PERIODS: PeriodSpec[] = [
  { key: "1w", label: "1 Week", days: 7, annualise: false },
  { key: "1m", label: "1 Month", months: 1, annualise: false },
  { key: "3m", label: "3 Months", months: 3, annualise: false },
  { key: "6m", label: "6 Months", months: 6, annualise: false },
  { key: "ytd", label: "YTD", ytd: true, annualise: false },
  { key: "1y", label: "1 Year", months: 12, annualise: true },
  { key: "2y", label: "2 Years", months: 24, annualise: true },
  { key: "3y", label: "3 Years", months: 36, annualise: true },
  { key: "5y", label: "5 Years", months: 60, annualise: true },
  { key: "10y", label: "10 Years", months: 120, annualise: true },
];

export interface PeriodReturn {
  key: string;
  label: string;
  fund: number | null;
  categoryAverage: number | null;
  rank: number | null;
  fundsInCategory: number;
}

export interface GrowthRow {
  label: string;
  startDate: string;
  returnPct: number;
  value: number;
}

export interface SipRow {
  label: string;
  instalments: number;
  invested: number;
  value: number | null;
  xirr: number | null;
}

export type FundAnalytics =
  | {
      matched: true;
      scheme: { code: string; name: string; isin: string | null; fundHouse: string; category: string };
      nav: { date: string; value: number; change: number | null; changePct: number | null };
      history: { firstDate: string; firstNav: number; cagrSinceFirstNav: number | null };
      chart: { date: string; growthPct: number }[];
      returns: PeriodReturn[];
      growthOf10k: GrowthRow[];
      sip: SipRow[];
      volatility3y: number | null;
      categorySchemes: number;
    }
  | {
      matched: false;
      reason: "category-not-found" | "no-match" | "ambiguous";
      categorySchemes: number;
    };

// ---------- dates ----------

function toDayNumber(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / DAY_MS;
}

function fromDayNumber(day: number) {
  return new Date(day * DAY_MS).toISOString().slice(0, 10);
}

function addDays(iso: string, days: number) {
  return fromDayNumber(toDayNumber(iso) + days);
}

// Same calendar day `months` earlier, clamped to the end of shorter months.
function monthsBack(iso: string, months: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const total = y * 12 + (m - 1) - months;
  const year = Math.floor(total / 12);
  const month = total - year * 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return fromDayNumber(Date.UTC(year, month, Math.min(d, lastDay)) / DAY_MS);
}

// mfapi dates are dd-mm-yyyy.
function mfapiDateToIso(value: string) {
  const [d, m, y] = value.split("-");
  return y && m && d ? `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}` : "";
}

function navOnOrBefore(history: NavPoint[], iso: string): NavPoint | null {
  let lo = 0;
  let hi = history.length - 1;
  let found: NavPoint | null = null;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (history[mid].date <= iso) {
      found = history[mid];
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return found;
}

// ---------- data sources ----------

function parseAmfiFeed(text: string): AmfiScheme[] {
  const schemes: AmfiScheme[] = [];
  let heading = "";
  let fundHouse = "";
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (!line.includes(";")) {
      if (/^(open ended|close ended|interval fund) schemes/i.test(line)) heading = line;
      else if (/mutual fund/i.test(line)) fundHouse = line;
      continue;
    }
    const parts = line.split(";").map((part) => part.trim());
    if (parts.length < 8) continue;
    const [code, isin, , name, plan, option] = parts;
    // Category figures compare like with like: Regular plan, Growth option.
    if (!/^regular/i.test(plan) || !/growth/i.test(option) || /idcw/i.test(option)) continue;
    const category = heading.match(/\((.*)\)\s*$/)?.[1]?.trim() ?? "";
    const subcategory = category.split(" - ").slice(1).join(" - ") || category;
    schemes.push({ code, name, isin: isin && isin !== "-" ? isin : null, fundHouse, category, subcategory });
  }
  return schemes;
}

// "Childrens Fund", "Childrens' Fund" and "Children’s Fund" all become "childrens".
function categoryKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[’'`]/g, "")
    .replace(/\bfunds?\b/g, " ")
    .replace(/[^a-z]+/g, " ")
    .trim();
}

async function fetchHistory(code: string): Promise<NavPoint[] | null> {
  try {
    const res = await fetch(`${MFAPI_URL}/${code}`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: { date: string; nav: string }[] };
    return (body.data ?? [])
      .map((point) => ({ date: mfapiDateToIso(point.date), nav: Number(point.nav) }))
      .filter((point) => point.date && Number.isFinite(point.nav) && point.nav > 0)
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  } catch {
    return null;
  }
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

// ---------- matching ----------

const ABBREVIATIONS: Record<string, string> = {
  absl: "aditya birla sun life",
  pru: "prudential",
  reg: "regular",
  gr: "growth",
};

function nameTokens(name: string) {
  return new Set(
    name
      .toLowerCase()
      .replace(/[’'"]/g, "")
      .split(/[^a-z0-9]+/)
      .flatMap((token) => (ABBREVIATIONS[token] ?? token).split(" "))
      .filter((t) => t.length > 1 && !["fund", "regular", "growth", "reg", "gr", "plan", "option"].includes(t))
  );
}

// Fallback search directly on api.mfapi.in if AMFI feed does not contain the scheme
async function searchMfApi(name: string): Promise<AmfiScheme | null> {
  const words = [...nameTokens(name)];
  const queries = [
    words.length >= 2 ? words.slice(-2).join(" ") : null,
    words.slice(0, 3).join(" "),
    words.join(" "),
  ].filter(Boolean) as string[];

  for (const q of queries) {
    try {
      const res = await fetch(`${MFAPI_URL}/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) continue;
      const items = (await res.json()) as { schemeCode: number; schemeName: string }[];
      if (items && items.length > 0) {
        const regGr =
          items.find((r) => /regular/i.test(r.schemeName) && /growth/i.test(r.schemeName)) ||
          items.find((r) => /growth/i.test(r.schemeName) && !/direct/i.test(r.schemeName)) ||
          items[0];
        if (regGr) {
          const detRes = await fetch(`${MFAPI_URL}/${regGr.schemeCode}`);
          if (!detRes.ok) continue;
          const det = (await detRes.json()) as {
            meta?: {
              scheme_name?: string;
              isin_growth?: string;
              fund_house?: string;
              scheme_type?: string;
              scheme_category?: string;
            };
          };
          return {
            code: String(regGr.schemeCode),
            name: det.meta?.scheme_name || regGr.schemeName,
            isin: det.meta?.isin_growth || null,
            fundHouse: det.meta?.fund_house || "",
            category: det.meta?.scheme_type || "",
            subcategory: det.meta?.scheme_category || "",
          };
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

// Matches scheme by exact NAV if available, or falls back to name token overlap
function matchScheme(
  vendorName: string,
  vendorNav: number | undefined,
  uploadedOn: string | undefined,
  candidates: SchemeHistory[]
) {
  if (vendorNav && Number.isFinite(vendorNav) && vendorNav > 0 && uploadedOn) {
    const target = Math.round(vendorNav * 100);
    const windowStart = addDays(uploadedOn, -MATCH_WINDOW_DAYS);
    let hits = candidates.filter(({ history }) =>
      history.some(
        (point) => point.date >= windowStart && point.date <= uploadedOn && Math.round(point.nav * 100) === target
      )
    );
    if (hits.length > 1) {
      const wanted = nameTokens(vendorName);
      const scored = hits.map((hit) => ({
        hit,
        score: [...nameTokens(hit.scheme.name + " " + hit.scheme.fundHouse)].filter((token) => wanted.has(token)).length,
      }));
      const best = Math.max(...scored.map((entry) => entry.score));
      hits = scored.filter((entry) => entry.score === best).map((entry) => entry.hit);
    }
    if (hits.length === 1) return { match: hits[0] };
  }

  // Fallback to token matching
  const wanted = nameTokens(vendorName);
  const scored = candidates.map((hit) => {
    const sTokens = nameTokens(hit.scheme.name + " " + hit.scheme.fundHouse);
    const score = [...wanted].filter((token) => sTokens.has(token)).length;
    return { hit, score };
  });

  scored.sort((a, b) => b.score - a.score);
  if (scored.length > 0 && scored[0].score >= 2) {
    return { match: scored[0].hit };
  }
  return { reason: "no-match" as const };
}

// ---------- calculations ----------

function periodReturn(history: NavPoint[], asOf: string, spec: PeriodSpec): number | null {
  const base = navOnOrBefore(history, asOf);
  if (!base || base.date < addDays(asOf, -STALE_NAV_DAYS)) return null;
  const anchorDate = spec.days
    ? addDays(asOf, -spec.days)
    : spec.ytd
      ? `${Number(asOf.slice(0, 4)) - 1}-12-31`
      : monthsBack(asOf, spec.months ?? 0);
  if (anchorDate < history[0].date) return null;
  const anchor = navOnOrBefore(history, anchorDate);
  if (!anchor) return null;
  const ratio = base.nav / anchor.nav;
  return spec.annualise && spec.months ? (ratio ** (12 / spec.months) - 1) * 100 : (ratio - 1) * 100;
}

function xirr(flows: { date: string; amount: number }[]): number | null {
  const start = toDayNumber(flows[0].date);
  const npv = (rate: number) =>
    flows.reduce((sum, flow) => sum + flow.amount / (1 + rate) ** ((toDayNumber(flow.date) - start) / 365), 0);
  let lo = -0.99;
  let hi = 10;
  if (Math.sign(npv(lo)) === Math.sign(npv(hi))) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (Math.sign(npv(mid)) === Math.sign(npv(lo))) lo = mid;
    else hi = mid;
  }
  return ((lo + hi) / 2) * 100;
}

function sipRow(history: NavPoint[], asOf: string, years: number): SipRow {
  const instalments = years * 12;
  const row: SipRow = {
    label: `${years} Years`,
    instalments,
    invested: instalments * SIP_INSTALMENT,
    value: null,
    xirr: null,
  };
  const base = navOnOrBefore(history, asOf);
  if (!base || monthsBack(asOf, instalments) < history[0].date) return row;
  let units = 0;
  const flows: { date: string; amount: number }[] = [];
  for (let i = instalments; i >= 1; i--) {
    const date = monthsBack(asOf, i);
    const nav = navOnOrBefore(history, date);
    if (!nav) return row;
    units += SIP_INSTALMENT / nav.nav;
    flows.push({ date, amount: -SIP_INSTALMENT });
  }
  row.value = units * base.nav;
  flows.push({ date: asOf, amount: row.value });
  row.xirr = xirr(flows);
  return row;
}

// Annualised standard deviation of the last 36 monthly returns.
function volatility3y(history: NavPoint[], asOf: string): number | null {
  if (monthsBack(asOf, 36) < history[0].date) return null;
  const monthly: number[] = [];
  for (let i = 36; i >= 1; i--) {
    const start = navOnOrBefore(history, monthsBack(asOf, i));
    const end = navOnOrBefore(history, monthsBack(asOf, i - 1));
    if (!start || !end) return null;
    monthly.push(end.nav / start.nav - 1);
  }
  const mean = monthly.reduce((sum, value) => sum + value, 0) / monthly.length;
  const variance = monthly.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (monthly.length - 1);
  return Math.sqrt(variance) * Math.sqrt(12) * 100;
}

export async function getFundAnalytics(input: {
  category?: string;
  scheme: string;
  nav?: number;
  uploadedOn?: string;
  code?: string;
}): Promise<FundAnalytics> {
  const res = await fetch(AMFI_NAV_URL, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`AMFI NAV file request failed with ${res.status}`);
  const allSchemes = parseAmfiFeed(await res.text());

  // 1. Direct code lookup if code is provided
  let matchedAmfiScheme: AmfiScheme | null = input.code
    ? allSchemes.find((s) => s.code === input.code) ?? null
    : null;

  // 2. Identify candidate schemes from AMFI feed
  const key = input.category ? categoryKey(input.category) : "";
  const inCategory = key ? allSchemes.filter((scheme) => categoryKey(scheme.subcategory) === key) : [];

  if (!matchedAmfiScheme) {
    const pool = inCategory.length > 0 ? inCategory : allSchemes;
    const wanted = nameTokens(input.scheme);
    const scored = pool.map((s) => {
      const sTokens = nameTokens(s.name + " " + s.fundHouse);
      const score = [...wanted].filter((t) => sTokens.has(t)).length;
      return { scheme: s, score };
    });
    scored.sort((a, b) => b.score - a.score);

    if (scored.length > 0 && scored[0].score >= 2) {
      matchedAmfiScheme = scored[0].scheme;
    } else if (inCategory.length > 0) {
      // Try searching all schemes if category was too restrictive
      const scoredAll = allSchemes.map((s) => {
        const sTokens = nameTokens(s.name + " " + s.fundHouse);
        const score = [...wanted].filter((t) => sTokens.has(t)).length;
        return { scheme: s, score };
      });
      scoredAll.sort((a, b) => b.score - a.score);
      if (scoredAll.length > 0 && scoredAll[0].score >= 2) {
        matchedAmfiScheme = scoredAll[0].scheme;
      }
    }
  }

  // 3. Fallback to mfapi search if still not found
  if (!matchedAmfiScheme) {
    matchedAmfiScheme = await searchMfApi(input.scheme);
  }

  if (!matchedAmfiScheme) {
    return { matched: false, reason: "no-match", categorySchemes: 0 };
  }

  // Gather schemes in the matched scheme's subcategory for category averages and ranks
  const catKey = categoryKey(matchedAmfiScheme.subcategory || matchedAmfiScheme.category || input.category || "");
  const categorySchemes = catKey
    ? allSchemes.filter((s) => categoryKey(s.subcategory) === catKey || categoryKey(s.category) === catKey)
    : [matchedAmfiScheme];

  // Prioritize fetching the matched scheme first, plus up to 25 other category schemes
  const schemesToFetch = [
    matchedAmfiScheme,
    ...categorySchemes.filter((s) => s.code !== matchedAmfiScheme!.code).slice(0, 25),
  ];

  const histories = (
    await mapWithConcurrency(schemesToFetch, FETCH_CONCURRENCY, async (scheme) => ({
      scheme,
      history: await fetchHistory(scheme.code),
    }))
  ).filter((entry): entry is SchemeHistory => entry.history !== null && entry.history.length > 1);

  const matchedHistory = histories.find((h) => h.scheme.code === matchedAmfiScheme!.code);
  if (!matchedHistory) {
    return { matched: false, reason: "no-match", categorySchemes: 0 };
  }

  const { scheme, history } = matchedHistory;
  const latest = history[history.length - 1];
  const previous = history.length > 1 ? history[history.length - 2] : null;
  const asOf = latest.date;

  const returns: PeriodReturn[] = PERIODS.map((spec) => {
    const values = histories
      .map((entry) => ({ code: entry.scheme.code, value: periodReturn(entry.history, asOf, spec) }))
      .filter((entry): entry is { code: string; value: number } => entry.value !== null);
    const fund = periodReturn(history, asOf, spec);
    return {
      key: spec.key,
      label: spec.label,
      fund,
      categoryAverage: values.length ? values.reduce((sum, entry) => sum + entry.value, 0) / values.length : null,
      rank: fund === null ? null : 1 + values.filter((entry) => entry.value > fund).length,
      fundsInCategory: values.length,
    };
  });

  const growthOf10k: GrowthRow[] = [];
  for (const years of [1, 3, 5, 10]) {
    const startDate = monthsBack(asOf, years * 12);
    const start = startDate >= history[0].date ? navOnOrBefore(history, startDate) : null;
    if (!start) continue;
    const ratio = latest.nav / start.nav;
    growthOf10k.push({
      label: years === 1 ? "1 Year" : `${years} Years`,
      startDate: start.date,
      returnPct: (ratio ** (1 / years) - 1) * 100,
      value: LUMPSUM * ratio,
    });
  }
  const first = history[0];
  const yearsSinceFirst = (toDayNumber(asOf) - toDayNumber(first.date)) / 365;
  const cagrSinceFirstNav = yearsSinceFirst >= 1 ? ((latest.nav / first.nav) ** (1 / yearsSinceFirst) - 1) * 100 : null;
  if (cagrSinceFirstNav !== null) {
    growthOf10k.push({
      label: "Since first NAV",
      startDate: first.date,
      returnPct: cagrSinceFirstNav,
      value: (LUMPSUM * latest.nav) / first.nav,
    });
  }

  const chartStart = monthsBack(asOf, 12);
  const chartBase = navOnOrBefore(history, chartStart) ?? first;
  const chart = history
    .filter((point) => point.date >= chartBase.date)
    .map((point) => ({ date: point.date, growthPct: (point.nav / chartBase.nav - 1) * 100 }));

  return {
    matched: true,
    scheme: {
      code: scheme.code,
      name: scheme.name,
      isin: scheme.isin,
      fundHouse: scheme.fundHouse,
      category: scheme.category,
    },
    nav: {
      date: latest.date,
      value: latest.nav,
      change: previous ? latest.nav - previous.nav : null,
      changePct: previous ? (latest.nav / previous.nav - 1) * 100 : null,
    },
    history: { firstDate: first.date, firstNav: first.nav, cagrSinceFirstNav },
    chart,
    returns,
    growthOf10k,
    sip: [3, 5, 10, 15].map((years) => sipRow(history, asOf, years)),
    volatility3y: volatility3y(history, asOf),
    categorySchemes: histories.length,
  };
}
