// Financial News & Market Sentiment Aggregator
// Integrates Marketaux API, NewsAPI, and live Indian financial RSS feeds.

export interface MarketStory {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  image?: string;
  author?: string;
  publishedAt: string;
  category: "mutual_funds" | "bonds" | "markets" | "ipo" | "nri_tax";
  sentiment: "bullish" | "neutral" | "bearish" | "educational";
  sentimentLabel: string;
  tag: string;
}

const FALLBACK_STORIES: MarketStory[] = [
  {
    id: "story-1",
    title: "India Mutual Fund Industry AUM Crosses Milestone Amid Record SIP Inflows",
    summary: "Systematic Investment Plan contributions touched an all-time peak of ₹23,500 crore as retail domestic investors continue disciplined wealth creation.",
    source: "Moneycontrol",
    url: "https://www.moneycontrol.com/mutual-funds",
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    category: "mutual_funds",
    sentiment: "bullish",
    sentimentLabel: "Strong Inflow Trend",
    tag: "SIP WEALTH",
  },
  {
    id: "story-2",
    title: "Corporate Bonds Offer Attractive 8.8% to 10.5% Yields for Retail Investors",
    summary: "High-grade AAA and AA corporate debentures see increased investor interest as fixed income yields remain competitive against traditional bank deposits.",
    source: "The Economic Times",
    url: "https://economictimes.indiatimes.com/markets/bonds",
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    category: "bonds",
    sentiment: "bullish",
    sentimentLabel: "Yield Opportunity",
    tag: "CORPORATE BONDS",
  },
  {
    id: "story-3",
    title: "Nifty 50 Extends Winning Streak Driven by FII Capital and Domestic Institutional Buying",
    summary: "Benchmark indices trade near historic high zones supported by robust corporate earnings growth and healthy macroeconomic indicators.",
    source: "Livemint",
    url: "https://www.livemint.com/market",
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    category: "markets",
    sentiment: "bullish",
    sentimentLabel: "Bullish Momentum",
    tag: "EQUITY MARKETS",
  },
  {
    id: "story-4",
    title: "RBI Monetary Policy Stance Keeps Sovereign and Corporate Bond Spreads Stable",
    summary: "The MPC unanimously maintained benchmark policy repo rates, creating a stable operating environment for short and medium duration debt funds.",
    source: "Business Standard",
    url: "https://www.business-standard.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    category: "bonds",
    sentiment: "neutral",
    sentimentLabel: "Policy Stability",
    tag: "MONETARY POLICY",
  },
  {
    id: "story-5",
    title: "New FEMA Guidelines Simplify Repatriation Rules for NRI and Seafarer Bank Accounts",
    summary: "Reserve Bank of India streamlines documentation for NRE and NRO remittance corridors, benefiting global Indian professionals and maritime crew.",
    source: "Financial Express",
    url: "https://www.financialexpress.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    category: "nri_tax",
    sentiment: "educational",
    sentimentLabel: "Advisory Update",
    tag: "NRI & SEAFARERS",
  },
  {
    id: "story-6",
    title: "Primary Market Boom: Tech and Infrastructure IPOs Witness Robust Retail Bidding",
    summary: "Strong liquidity conditions in domestic capital markets drive heavy oversubscription for quality small and medium enterprise offerings.",
    source: "CNBC TV18",
    url: "https://www.cnbctv18.com/market",
    publishedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    category: "ipo",
    sentiment: "bullish",
    sentimentLabel: "High Subscription",
    tag: "IPO WATCH",
  },
];

function analyzeSentiment(text: string): { sentiment: MarketStory["sentiment"]; label: string } {
  const lower = text.toLowerCase();

  const bullishWords = ["rally", "record", "jump", "surge", "gain", "high", "growth", "inflow", "beat", "positive", "strong"];
  const bearishWords = ["fall", "drop", "slump", "loss", "crash", "concern", "outflow", "weak", "decline", "warning", "risk"];

  let score = 0;
  bullishWords.forEach((w) => {
    if (lower.includes(w)) score += 1;
  });
  bearishWords.forEach((w) => {
    if (lower.includes(w)) score -= 1;
  });

  if (score > 0) return { sentiment: "bullish", label: "Bullish Trend" };
  if (score < 0) return { sentiment: "bearish", label: "Risk Watch" };
  if (lower.includes("how") || lower.includes("guide") || lower.includes("rule") || lower.includes("what")) {
    return { sentiment: "educational", label: "Financial Guide" };
  }
  return { sentiment: "neutral", label: "Market Update" };
}

function determineCategory(text: string): { category: MarketStory["category"]; tag: string } {
  const lower = text.toLowerCase();

  if (lower.includes("bond") || lower.includes("debenture") || lower.includes("yield") || lower.includes("debt")) {
    return { category: "bonds", tag: "CORPORATE BONDS" };
  }
  if (lower.includes("sip") || lower.includes("mutual fund") || lower.includes("amc") || lower.includes("nav")) {
    return { category: "mutual_funds", tag: "MUTUAL FUNDS" };
  }
  if (lower.includes("ipo") || lower.includes("subscription") || lower.includes("issue size")) {
    return { category: "ipo", tag: "IPO WATCH" };
  }
  if (lower.includes("nri") || lower.includes("nre") || lower.includes("nro") || lower.includes("seafarer") || lower.includes("fema")) {
    return { category: "nri_tax", tag: "NRI & SEAFARERS" };
  }
  return { category: "markets", tag: "MARKET NEWS" };
}

/**
 * Fetch live stories from Google News Finance RSS
 */
async function fetchGoogleNewsFinance(): Promise<MarketStory[]> {
  try {
    const res = await fetch("https://news.google.com/rss/search?q=Mutual+Funds+India+OR+Corporate+Bonds+India&hl=en-IN&gl=IN&ceid=IN:en", {
      next: { revalidate: 1800 }, // 30 min cache
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

    const stories: MarketStory[] = [];
    itemMatches.slice(0, 10).forEach((itemXml, idx) => {
      const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      const sourceMatch = itemXml.match(/<source[^>]*>(.*?)<\/source>/);

      if (titleMatch && linkMatch) {
        let title = titleMatch[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        const source = sourceMatch ? sourceMatch[1] : "Financial Wire";
        // Strip trailing source from title (e.g. "... - Moneycontrol")
        if (title.includes(" - ")) {
          title = title.split(" - ")[0];
        }

        const { sentiment, label } = analyzeSentiment(title);
        const { category, tag } = determineCategory(title);

        stories.push({
          id: `news-${idx + 1}`,
          title: title.trim(),
          summary: `Latest financial market updates and strategic sector commentary reported by ${source}.`,
          source,
          url: linkMatch[1],
          publishedAt: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
          category,
          sentiment,
          sentimentLabel: label,
          tag,
        });
      }
    });

    return stories;
  } catch (err) {
    console.error("Error fetching live financial RSS:", err);
    return [];
  }
}

export interface NewsApiOptions {
  query?: string;
  category?: string;
  sortBy?: "relevancy" | "popularity" | "publishedAt";
  pageSize?: number;
  page?: number;
  domains?: string;
  from?: string;
  to?: string;
}

const NEWS_API_KEY = process.env.NEWS_API_KEY || "b374c8285a9e4eb29b16f642ce34fa9f";

/**
 * Fetch articles from NewsAPI /v2/everything endpoint
 * Search through millions of articles from over 150,000 sources
 */
export async function fetchNewsApiEverything(options: NewsApiOptions = {}): Promise<{
  status: string;
  totalResults: number;
  stories: MarketStory[];
}> {
  const apiKey = NEWS_API_KEY;
  const sortBy = options.sortBy || "publishedAt";
  const pageSize = Math.min(100, options.pageSize || 20);
  const page = options.page || 1;

  // Build tailored Indian finance & investment search query
  let q = options.query;
  if (!q) {
    if (options.category === "bonds") {
      q = '("corporate bonds" OR "debentures" OR "bond yield" OR "RBI bonds" OR "fixed income India")';
    } else if (options.category === "mutual_funds") {
      q = '("mutual funds" OR "SIP investment" OR "equity mutual fund" OR "index fund" OR "AMFI")';
    } else if (options.category === "nri_tax") {
      q = '("NRI investment" OR "NRE NRO" OR "FEMA" OR "repatriation" OR "NRI taxation India")';
    } else if (options.category === "ipo") {
      q = '("IPO" OR "listing gains" OR "SEBI IPO" OR "initial public offering India")';
    } else {
      q = '("mutual funds" OR "corporate bonds" OR "SIP investment" OR "Nifty" OR "Sensex" OR "Indian stock market")';
    }
  }

  const params = new URLSearchParams({
    apiKey,
    q,
    language: "en",
    sortBy,
    pageSize: pageSize.toString(),
    page: page.toString(),
  });

  if (options.domains) {
    params.set("domains", options.domains);
  }
  if (options.from) {
    params.set("from", options.from);
  }
  if (options.to) {
    params.set("to", options.to);
  }

  try {
    const res = await fetch(`https://newsapi.org/v2/everything?${params.toString()}`, {
      headers: {
        "User-Agent": "SolidWealthBlog/1.0",
      },
      next: { revalidate: 900 }, // 15 min cache
    });

    if (!res.ok) {
      console.warn(`NewsAPI /v2/everything returned HTTP ${res.status}`);
      return { status: "error", totalResults: 0, stories: [] };
    }

    const data = await res.json();
    if (data.status !== "ok" || !Array.isArray(data.articles)) {
      return { status: "error", totalResults: 0, stories: [] };
    }

    const stories: MarketStory[] = data.articles
      .filter((art: any) => art.title && art.title !== "[Removed]")
      .map((art: any, idx: number) => {
        let title = art.title.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        if (title.includes(" - ")) {
          title = title.split(" - ")[0];
        }
        const description = (art.description || art.content || "Latest financial market updates and strategic sector commentary.")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        const { sentiment, label } = analyzeSentiment(title + " " + description);
        const { category, tag } = determineCategory(title + " " + description);

        return {
          id: `newsapi-${page}-${idx}`,
          title: title.trim(),
          summary: description.trim(),
          source: art.source?.name || "Financial Wire",
          url: art.url,
          image: art.urlToImage || undefined,
          author: art.author || undefined,
          publishedAt: art.publishedAt || new Date().toISOString(),
          category,
          sentiment,
          sentimentLabel: label,
          tag,
        };
      });

    return {
      status: "ok",
      totalResults: data.totalResults || stories.length,
      stories,
    };
  } catch (err) {
    console.error("NewsAPI /v2/everything fetch failed:", err);
    return { status: "error", totalResults: 0, stories: [] };
  }
}

/**
 * Fetch market stories (combines NewsAPI /v2/everything, Marketaux, RSS, and curated fallbacks)
 */
export async function getLiveMarketNews(options: NewsApiOptions = {}): Promise<MarketStory[]> {
  // 1. Primary Source: NewsAPI /v2/everything (150,000+ sources)
  try {
    const newsApiResult = await fetchNewsApiEverything(options);
    if (newsApiResult.stories && newsApiResult.stories.length > 0) {
      return newsApiResult.stories;
    }
  } catch (err) {
    console.error("NewsAPI integration error:", err);
  }

  // 2. Secondary Source: Marketaux API if configured
  const marketauxKey = process.env.MARKETAUX_API_KEY;
  if (marketauxKey) {
    try {
      const res = await fetch(`https://api.marketaux.com/v1/news/all?api_token=${marketauxKey}&countries=in&filter_entities=true&limit=10`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.data) && json.data.length > 0) {
          return json.data.map((item: any, idx: number) => {
            const { sentiment, label } = analyzeSentiment(item.title || "");
            const { category, tag } = determineCategory(item.title || "");
            return {
              id: `marketaux-${idx}`,
              title: item.title,
              summary: item.description || item.snippet || "Financial commentary and market update.",
              source: item.source || "Marketaux",
              url: item.url || "#",
              publishedAt: item.published_at || new Date().toISOString(),
              category,
              sentiment,
              sentimentLabel: label,
              tag,
            };
          });
        }
      }
    } catch (err) {
      console.error("Marketaux API fetch failed:", err);
    }
  }

  // 3. Tertiary Source: Live Google News Finance RSS
  const rssStories = await fetchGoogleNewsFinance();
  if (rssStories.length >= 4) {
    return rssStories;
  }

  // 4. Curated fallbacks combined with any fetched stories
  return [...rssStories, ...FALLBACK_STORIES.slice(rssStories.length)];
}
