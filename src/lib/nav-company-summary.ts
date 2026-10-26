// Server-side loader for the AMFI company NAV summary. The upstream response is
// a few MB of every scheme's NAV and only changes once a day, so it is held in
// the Next data cache and refreshed at midnight IST, after AMFI publishes.
// Read through app/api/nav/company-summary/route.ts, never from the browser.
//
// The backend drops AMFI's category headings, so every scheme arrives without a
// sebi_category and the Equity/Debt/Hybrid filters have nothing to match on.
// We read the headings back out of AMFI's own NAV file and stitch them in here.

import { createHash } from "node:crypto";

import { AMFI_NAV_URL } from "@/lib/fund-analytics";
import { istDateKey, secondsUntilIstMidnight } from "@/lib/ist-day";
import { API_BASE_URL } from "@/lib/mutual-fund-performance";

export const NAV_SUMMARY_TAG = "nav-company-summary";

interface Scheme {
    scheme_code: string;
    isin_div_payout_growth?: string | null;
    isin_div_reinvestment?: string | null;
    scheme_name?: string;
    net_asset_value?: string | null;
    sebi_category?: string;
    plan?: string;
    option?: string;
    nav_date?: string;
    raw_line?: string;
}

// The columns of an AMFI row the backend drops, plus the heading it sat under.
interface AmfiRow {
    heading: string;
    plan: string;
    option: string;
    navDate: string | null;
}

const MONTHS: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

// "15-Sep-2026" -> "2026-09-15"
function amfiDateToIso(value: string): string | null {
    const match = value.trim().match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
    const month = match ? MONTHS[match[2].toLowerCase()] : undefined;
    return match && month ? `${match[3]}-${month}-${match[1].padStart(2, "0")}` : null;
}

interface CompanySummary {
    count: number;
    results: { company_name: string; nav_date: string; nav: Scheme[] }[];
}

const FALLBACK_SCHEMES_PER_HOUSE = 8;

interface AmfiData {
    rows: Map<string, AmfiRow>;
    // The same file regrouped by fund house in the backend's shape, served
    // whole when the backend is down or returns nothing.
    summary: CompanySummary;
}

// Scheme code -> its "Open Ended Schemes(Equity Scheme - Large Cap Fund)" heading
// and plan/option columns. fund-analytics.ts parses the same file but keeps only
// Regular/Growth rows; the cards show every plan and option, so this takes all.
// A line with no ";" is either a category heading or the fund house the rows
// below it belong to.
function parseAmfi(text: string): AmfiData {
    const rows = new Map<string, AmfiRow>();
    const companies = new Map<string, { company_name: string; nav_date: string; nav: Scheme[] }>();
    let heading = "";
    let house = "";
    for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line) continue;
        if (!line.includes(";")) {
            if (/^(open ended|close ended|interval fund) schemes/i.test(line)) heading = line;
            else house = line;
            continue;
        }
        const parts = line.split(";").map((part) => part.trim());
        if (parts.length < 8 || !heading || !/^\d+$/.test(parts[0])) continue;
        const row = { heading, plan: parts[4], option: parts[5], navDate: amfiDateToIso(parts[7]) };
        rows.set(parts[0], row);
        if (!house) continue;
        let company = companies.get(house);
        if (!company) companies.set(house, (company = { company_name: house, nav_date: "", nav: [] }));
        company.nav.push({
            scheme_code: parts[0],
            isin_div_payout_growth: parts[1],
            isin_div_reinvestment: parts[2],
            scheme_name: parts[3],
            net_asset_value: /^\d/.test(parts[6]) ? parts[6] : null,
            sebi_category: row.heading,
            plan: row.plan,
            option: row.option,
            ...(row.navDate ? { nav_date: row.navDate } : {}),
        });
        if (row.navDate && row.navDate > company.nav_date) company.nav_date = row.navDate;
    }
    // The file keeps matured and wound-up schemes with their last NAV, some of
    // them years old, so only schemes priced within 30 days of the newest NAV
    // are kept. The homepage pages through every scheme it is sent, so each
    // fund house is capped near what the backend returns (~8), Growth first,
    // instead of shipping all ~9,000.
    const newest = [...companies.values()].reduce((max, c) => (c.nav_date > max ? c.nav_date : max), "");
    const cutoff = newest ? new Date(Date.parse(newest) - 30 * 86_400_000).toISOString().slice(0, 10) : "";
    const isGrowth = (scheme: Scheme) => /growth/i.test(scheme.option ?? "");
    const results = [...companies.values()]
        .map((company) => {
            const live = company.nav.filter((scheme) => !scheme.nav_date || scheme.nav_date >= cutoff);
            return { ...company, nav: [...live.filter(isGrowth), ...live.filter((scheme) => !isGrowth(scheme))].slice(0, FALLBACK_SCHEMES_PER_HOUSE) };
        })
        .filter((company) => company.nav.length > 0);
    return { rows, summary: { count: results.length, results } };
}

async function fetchJson(url: string, label: string): Promise<CompanySummary> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
        const res = await fetch(url, {
            cache: "force-cache",
            next: { revalidate: secondsUntilIstMidnight(), tags: [NAV_SUMMARY_TAG] },
            signal: controller.signal,
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`${label} request failed with ${res.status}`);
        return await res.json();
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}

async function fetchAmfi(): Promise<AmfiData> {
    const res = await fetch(AMFI_NAV_URL, {
        cache: "force-cache",
        next: { revalidate: secondsUntilIstMidnight(), tags: [NAV_SUMMARY_TAG] },
    });
    if (!res.ok) throw new Error(`AMFI NAV file request failed with ${res.status}`);
    return parseAmfi(await res.text());
}

// Stitching walks 4,000+ schemes and re-serialises them, so the finished body is
// held for the rest of the IST day rather than rebuilt per request. The upstream
// fetches are cached too; this only saves the parse. The ETag is hashed here for
// the same reason: once a day, not once a request.
let stitched: { key: string; payload: NavSummaryPayload } | null = null;

export interface NavSummaryPayload {
    body: string;
    etag: string;
}

export async function fetchNavCompanySummary(): Promise<NavSummaryPayload> {
    const key = istDateKey();
    if (stitched?.key === key) return stitched.payload;

    const [backendSummary, amfi] = await Promise.all([
        fetchJson(`${API_BASE_URL}/api/nav/company-summary/`, "Company NAV summary").catch((error) => {
            console.warn("Company NAV summary backend unavailable, serving fallback:", (error as Error).message);
            return { count: 0, next: null, previous: null, results: [] } as CompanySummary;
        }),
        // A missing or malformed AMFI file must not take the NAV cards down with
        // it: the funds still render, only the category filters go quiet.
        fetchAmfi().catch((error) => {
            console.error("AMFI categories unavailable, serving NAVs without them:", error);
            return null;
        }),
    ]);
    const rows = amfi?.rows ?? new Map<string, AmfiRow>();

    // Backend down or empty: AMFI's own file already carries every field the
    // cards read, so serve it as the summary instead of an empty list.
    const useAmfi = !backendSummary.results?.length && !!amfi?.summary.results.length;
    if (useAmfi) console.warn("Company NAV summary served from the AMFI NAV file");
    const summary = useAmfi ? amfi!.summary : backendSummary;

    for (const company of summary.results ?? []) {
        for (const scheme of company.nav ?? []) {
            const row = rows.get(scheme.scheme_code);
            if (!row) continue;
            scheme.sebi_category = row.heading;
            scheme.plan = row.plan;
            scheme.option = row.option;
            if (row.navDate) scheme.nav_date = row.navDate;
            // raw_line existed only so the client could recover plan, option and
            // date by hand. Now that they are named fields it is pure duplication,
            // and dropping it pays for the category text several times over.
            delete scheme.raw_line;
        }
    }

    const body = JSON.stringify(summary);
    const payload = { body, etag: `"${createHash("sha1").update(body).digest("base64url")}"` };
    // An empty result is not held for the day, so the next request tries again.
    if (summary.results?.length) stitched = { key, payload };
    return payload;
}
