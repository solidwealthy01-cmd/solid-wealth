// Real financial headlines from public RSS feeds, used to ground the daily blog
// batch in something that actually happened rather than in the model's memory.
// No key or account needed, which is why these feeds were picked over the
// commercial news APIs.

import { secondsUntilIstMidnight } from "@/lib/ist-day";

export type BlogCategory = "news" | "funds" | "commodities" | "nri_naval";

export interface NewsItem {
    title: string;
    link: string;
    summary: string;
    publishedAt: string | null;
    source: string;
    category: BlogCategory;
    tag: string;
}

interface FeedSpec {
    url: string;
    source: string;
    category: BlogCategory;
}

const FEEDS: FeedSpec[] = [
    { url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", source: "The Economic Times", category: "news" },
    { url: "https://www.livemint.com/rss/markets", source: "Mint", category: "news" },
    { url: "https://economictimes.indiatimes.com/mf/rssfeeds/359241701.cms", source: "The Economic Times", category: "funds" },
    { url: "https://economictimes.indiatimes.com/wealth/rssfeeds/837555174.cms", source: "The Economic Times", category: "nri_naval" },
    { url: "https://www.livemint.com/rss/money", source: "Mint", category: "nri_naval" },
    { url: "https://feeds.content.dowjones.io/public/rss/mw_topstories", source: "MarketWatch", category: "news" },
];

// No feed of the ones above carries commodities on its own, so items that are
// plainly about metals or energy are moved across by subject. Matched on the
// headline only: a markets story that merely mentions commodities in passing is
// not a commodities story.
const COMMODITY_PATTERN = /\b(gold|silver|bullion|crude|brent|opec|copper|zinc|aluminium|natural gas)\b/i;
// Feeds carry the odd non-story; these never make a useful analysis piece.
const SKIP_PATTERN = /\b(quote of the day|photos?|watch:|video:|in pics|live updates|webinar|horoscope|recipe)\b/i;
// These feeds are general-interest in places — the ET wealth and NRI desks run
// visa and lifestyle pieces alongside the money ones. A post for a wealth
// manager has to be about money, so anything that is not is dropped.
const FINANCE_PATTERN = /\b(market|stock|share|equit(?:y|ies)|investor|invest(?:ment|ing)?|mutual fund|sip|nav|amc|portfolio|sensex|nifty|rupee|rbi|sebi|bond|yield|debt|fund|tax(?:ation)?|itr|gst|pension|retirement|epf|nps|insurance|loan|emi|repo|inflation|gdp|ipo|dividend|gold|silver|crude|commodit(?:y|ies)|currency|forex|bank(?:ing|s)?|deposit|nri|nro|nre|fema|remittance|wealth|savings|earnings|valuation|crore|lakh)\b/i;

// Tags label the card, so they follow the story rather than the feed it came
// from — a bond-yield piece should not be filed under GOLD.
const TAG_RULES: { pattern: RegExp; tag: string }[] = [
    { pattern: /\b(gold|bullion)\b/i, tag: "GOLD" },
    { pattern: /\bsilver\b/i, tag: "SILVER" },
    { pattern: /\b(crude|brent|opec|oil)\b/i, tag: "CRUDE OIL" },
    { pattern: /\b(nri|nro|nre|fema|remittance|diaspora)\b/i, tag: "NRI TAX" },
    { pattern: /\b(tax|itr|capital gains|gst)\b/i, tag: "NRI TAX" },
    { pattern: /\b(rbi|repo|monetary policy|sebi|regulat)/i, tag: "POLICY" },
    { pattern: /\b(bank|lender|npa|deposit)/i, tag: "BANKING" },
    { pattern: /\b(bond|yield|debt|gilt)\b/i, tag: "DEBT" },
    { pattern: /\b(mutual fund|sip|amc|scheme|nav)\b/i, tag: "MID CAP" },
    { pattern: /\b(ipo|earnings|profit|revenue)\b/i, tag: "EARNINGS" },
];

function tagFor(text: string, fallback: string): string {
    return TAG_RULES.find((rule) => rule.pattern.test(text))?.tag ?? fallback;
}

const DEFAULT_TAGS: Record<BlogCategory, string> = {
    news: "MARKET UPDATE",
    funds: "MID CAP",
    commodities: "GOLD",
    nri_naval: "NRI TAX",
};

const MIN_SUMMARY_CHARS = 80;
const MAX_ITEMS_PER_FEED = 12;

function decodeEntities(text: string): string {
    return text
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;|&apos;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&");
}

// Feed descriptions carry markup and tracking pixels; posts only want the prose.
function cleanText(raw: string): string {
    return decodeEntities(decodeEntities(raw).replace(/<[^>]*>/g, " "))
        .replace(/\s+/g, " ")
        .trim();
}

function field(block: string, tag: string): string {
    const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
    if (!match) return "";
    const cdata = match[1].match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    return cleanText(cdata ? cdata[1] : match[1]);
}

function parseFeed(xml: string, spec: FeedSpec): NewsItem[] {
    const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
    const items: NewsItem[] = [];
    for (const block of blocks.slice(0, MAX_ITEMS_PER_FEED)) {
        const title = field(block, "title");
        const link = field(block, "link");
        const summary = field(block, "description");
        if (!title || !link) continue;
        if (SKIP_PATTERN.test(title)) continue;
        // A headline with no standfirst gives the model nothing to work from.
        if (summary.length < MIN_SUMMARY_CHARS) continue;
        const subject = `${title} ${summary}`;
        if (!FINANCE_PATTERN.test(subject)) continue;
        const published = field(block, "pubDate");
        const parsed = published ? new Date(published) : null;
        const category = COMMODITY_PATTERN.test(title) ? "commodities" : spec.category;
        items.push({
            title,
            link,
            summary,
            publishedAt: parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : null,
            source: spec.source,
            category,
            tag: tagFor(subject, DEFAULT_TAGS[category]),
        });
    }
    return items;
}

async function fetchFeed(spec: FeedSpec): Promise<NewsItem[]> {
    try {
        const res = await fetch(spec.url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; SolidWealthBot/1.0)" },
            next: { revalidate: secondsUntilIstMidnight() },
        });
        if (!res.ok) {
            console.error(`Feed ${spec.url} returned ${res.status}`);
            return [];
        }
        return parseFeed(await res.text(), spec);
    }
    catch (error) {
        console.error(`Feed ${spec.url} failed:`, error);
        return [];
    }
}

const NEWS_API_KEY = process.env.NEWS_API_KEY || "b374c8285a9e4eb29b16f642ce34fa9f";

async function fetchNewsApiItems(): Promise<NewsItem[]> {
    try {
        const res = await fetch(
            `https://newsapi.org/v2/everything?q=%28%22mutual+funds%22+OR+%22corporate+bonds%22+OR+%22nifty%22+OR+%22sensex%22+OR+%22SIP+investment%22%29&apiKey=${NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=15`,
            {
                headers: { "User-Agent": "SolidWealthBlog/1.0" },
                next: { revalidate: 3600 },
            }
        );
        if (!res.ok) return [];
        const data = await res.json();
        if (data.status !== "ok" || !Array.isArray(data.articles)) return [];

        return data.articles
            .filter((art: any) => art.title && art.title !== "[Removed]")
            .map((art: any) => {
                let cat: BlogCategory = "news";
                const lower = (art.title + " " + (art.description || "")).toLowerCase();
                if (lower.includes("bond") || lower.includes("debt") || lower.includes("yield")) cat = "funds";
                else if (lower.includes("mutual fund") || lower.includes("sip")) cat = "funds";
                else if (lower.includes("gold") || lower.includes("silver") || lower.includes("crude")) cat = "commodities";
                else if (lower.includes("nri") || lower.includes("fema") || lower.includes("tax")) cat = "nri_naval";

                const cleanTitle = art.title.split(" - ")[0].trim();
                return {
                    title: cleanTitle,
                    link: art.url,
                    summary: (art.description || art.content || "").trim(),
                    publishedAt: art.publishedAt || null,
                    source: art.source?.name || "NewsAPI Wire",
                    category: cat,
                    tag: tagFor(cleanTitle, DEFAULT_TAGS[cat]),
                };
            });
    } catch (err) {
        console.error("fetchNewsApiItems failed:", err);
        return [];
    }
}

// Combines NewsAPI /v2/everything and Indian financial RSS feeds
export async function fetchNewsItems(): Promise<NewsItem[]> {
    const [perFeed, newsApiItems] = await Promise.all([
        Promise.all(FEEDS.map(fetchFeed)),
        fetchNewsApiItems(),
    ]);
    const seen = new Set<string>();
    const items: NewsItem[] = [];
    for (const item of [...newsApiItems, ...perFeed.flat()]) {
        const key = item.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        if (seen.has(key)) continue;
        seen.add(key);
        items.push(item);
    }
    return items;
}
