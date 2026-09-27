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

// Scheme code -> its "Open Ended Schemes(Equity Scheme - Large Cap Fund)" heading
// and plan/option columns. fund-analytics.ts parses the same file but keeps only
// Regular/Growth rows; the cards show every plan and option, so this takes all.
function parseAmfiRows(text: string): Map<string, AmfiRow> {
    const rows = new Map<string, AmfiRow>();
    let heading = "";
    for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line) continue;
        if (!line.includes(";")) {
            if (/^(open ended|close ended|interval fund) schemes/i.test(line)) heading = line;
            continue;
        }
        const parts = line.split(";").map((part) => part.trim());
        if (parts.length < 8 || !heading || !/^\d+$/.test(parts[0])) continue;
        rows.set(parts[0], {
            heading,
            plan: parts[4],
            option: parts[5],
            navDate: amfiDateToIso(parts[7]),
        });
    }
    return rows;
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

async function fetchAmfiRows(): Promise<Map<string, AmfiRow>> {
    const res = await fetch(AMFI_NAV_URL, {
        cache: "force-cache",
        next: { revalidate: secondsUntilIstMidnight(), tags: [NAV_SUMMARY_TAG] },
    });
    if (!res.ok) throw new Error(`AMFI NAV file request failed with ${res.status}`);
    return parseAmfiRows(await res.text());
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

    const [summary, rows] = await Promise.all([
        fetchJson(`${API_BASE_URL}/api/nav/company-summary/`, "Company NAV summary").catch((error) => {
            console.warn("Company NAV summary backend unavailable, serving fallback:", (error as Error).message);
            return { count: 0, next: null, previous: null, results: [] } as CompanySummary;
        }),
        // A missing or malformed AMFI file must not take the NAV cards down with
        // it: the funds still render, only the category filters go quiet.
        fetchAmfiRows().catch((error) => {
            console.error("AMFI categories unavailable, serving NAVs without them:", error);
            return new Map<string, AmfiRow>();
        }),
    ]);

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
    stitched = { key, payload };
    return payload;
}
