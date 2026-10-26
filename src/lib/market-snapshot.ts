import { API_BASE_URL } from "@/lib/mutual-fund-performance";
import { secondsUntilIstMidnight } from "@/lib/ist-day";

export interface RawMarketSnapshot {
  id?: number;
  snapshot_date: string;
  gold_price: string | null;
  silver_price: string | null;
  crude_oil_price: string | null;
  bitcoin_price: string | null;
  nifty_50_value: string | null;
  sensex_value: string | null;
  usd_inr_rate: string | null;
  created_at?: string;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  category: "indices" | "metals" | "macro" | "crypto";
  value: number | null;
  unit: "INR" | "USD" | "points";
  formatted: string;
  details?: Record<string, any>;
}

export interface FilteredMarketResponse {
  snapshot_date: string;
  indices: {
    nifty_50: MarketAsset;
    sensex: MarketAsset;
  };
  metals: {
    gold: MarketAsset;
    silver: MarketAsset;
  };
  macro: {
    crude_oil: MarketAsset;
    usd_inr: MarketAsset;
  };
  crypto: {
    bitcoin: MarketAsset;
  };
}

function toNumber(val: string | null | undefined): number | null {
  if (val === null || val === undefined || val === "") return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

function formatCurrency(val: number | null, unit: "INR" | "USD" | "points", decimals: number = 2): string {
  if (val === null) return "-";
  const symbol = unit === "INR" ? "₹" : unit === "USD" ? "$" : "";
  const locale = unit === "USD" ? "en-US" : "en-IN";
  return `${symbol}${val.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

async function fetchBackendSnapshot(): Promise<RawMarketSnapshot | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/market-snapshot/`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      // A hung backend would otherwise hold the request until the platform times it out.
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) {
      console.error(`Failed to fetch backend market snapshot: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching market snapshot from backend:", (err as Error).message);
    return null;
  }
}

// ---------- fallback: public market data, used only when the backend fails ----------
// Yahoo Finance's chart endpoint (free, no key) for indices, metals, crude and
// USD/INR, and CoinGecko for Bitcoin. Each value is fetched on its own, so one
// missing figure drops just that item from the ticker.

const TROY_OUNCE_GRAMS = 31.1034768;

async function fetchYahooPrice(symbol: string): Promise<{ price: number; time: number } | null> {
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const meta = (await res.json())?.chart?.result?.[0]?.meta;
    const price = Number(meta?.regularMarketPrice);
    return Number.isFinite(price) ? { price, time: Number(meta?.regularMarketTime) || 0 } : null;
  } catch {
    return null;
  }
}

async function fetchCoinGeckoBitcoinUsd(): Promise<number | null> {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd", {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const price = Number((await res.json())?.bitcoin?.usd);
    return Number.isFinite(price) ? price : null;
  } catch {
    return null;
  }
}

async function fetchPublicSnapshot(): Promise<RawMarketSnapshot | null> {
  const [nifty, sensex, gold, silver, crude, usdInr, btcYahoo, btcGecko] = await Promise.all([
    fetchYahooPrice("^NSEI"),
    fetchYahooPrice("^BSESN"),
    fetchYahooPrice("GC=F"),
    fetchYahooPrice("SI=F"),
    fetchYahooPrice("CL=F"),
    fetchYahooPrice("USDINR=X"),
    fetchYahooPrice("BTC-USD"),
    fetchCoinGeckoBitcoinUsd(),
  ]);
  const quotes = [nifty, sensex, gold, silver, crude, usdInr, btcYahoo];
  const bitcoin = btcGecko ?? btcYahoo?.price ?? null;
  if (quotes.every((q) => q === null) && bitcoin === null) return null;

  const str = (n: number | null | undefined) => (n === null || n === undefined ? null : String(n));
  // The backend stores metals in USD per gram; Yahoo quotes USD per troy ounce.
  const perGram = (q: { price: number } | null) => (q ? q.price / TROY_OUNCE_GRAMS : null);
  const latest = Math.max(0, ...quotes.map((q) => q?.time ?? 0));
  return {
    snapshot_date: (latest ? new Date(latest * 1000) : new Date()).toISOString().slice(0, 10),
    gold_price: str(perGram(gold)),
    silver_price: str(perGram(silver)),
    crude_oil_price: str(crude?.price),
    bitcoin_price: str(bitcoin),
    nifty_50_value: str(nifty?.price),
    sensex_value: str(sensex?.price),
    usd_inr_rate: str(usdInr?.price),
  };
}

export async function fetchRawMarketSnapshot(): Promise<RawMarketSnapshot | null> {
  const backend = await fetchBackendSnapshot();
  if (backend) return backend;
  const fallback = await fetchPublicSnapshot();
  if (fallback) console.warn("Market snapshot served from public market data");
  return fallback;
}

export async function getFilteredMarketSnapshot(): Promise<FilteredMarketResponse | null> {
  const raw = await fetchRawMarketSnapshot();
  if (!raw) return null;

  const usdInr = toNumber(raw.usd_inr_rate);
  const goldUsdPerGram = toNumber(raw.gold_price);
  const silverUsdPerGram = toNumber(raw.silver_price);
  const crudePrice = toNumber(raw.crude_oil_price);
  const btcPrice = toNumber(raw.bitcoin_price);
  const niftyVal = toNumber(raw.nifty_50_value);
  const sensexVal = toNumber(raw.sensex_value);

  // Gold & Silver conversions
  const goldInrPerGram = goldUsdPerGram !== null && usdInr !== null ? goldUsdPerGram * usdInr : null;
  const goldInrPer10g = goldInrPerGram !== null ? goldInrPerGram * 10 : null;

  const silverInrPerGram = silverUsdPerGram !== null && usdInr !== null ? silverUsdPerGram * usdInr : null;
  const silverInrPerKg = silverInrPerGram !== null ? silverInrPerGram * 1000 : null;

  const btcInr = btcPrice !== null && usdInr !== null ? btcPrice * usdInr : null;

  return {
    snapshot_date: raw.snapshot_date,
    indices: {
      nifty_50: {
        symbol: "^NSEI",
        name: "NIFTY 50",
        category: "indices",
        value: niftyVal,
        unit: "points",
        formatted: formatCurrency(niftyVal, "points", 2),
      },
      sensex: {
        symbol: "^BSESN",
        name: "SENSEX",
        category: "indices",
        value: sensexVal,
        unit: "points",
        formatted: formatCurrency(sensexVal, "points", 2),
      },
    },
    metals: {
      gold: {
        symbol: "GC=F",
        name: "Gold (MCX / 24K)",
        category: "metals",
        value: goldInrPer10g ?? goldInrPerGram,
        unit: "INR",
        formatted: formatCurrency(goldInrPer10g ?? goldInrPerGram, "INR", 2) + (goldInrPer10g ? " / 10g" : " / g"),
        details: {
          usd_per_gram: goldUsdPerGram,
          inr_per_gram: goldInrPerGram,
          inr_per_10g: goldInrPer10g,
        },
      },
      silver: {
        symbol: "SI=F",
        name: "Silver",
        category: "metals",
        value: silverInrPerKg ?? silverInrPerGram,
        unit: "INR",
        formatted: formatCurrency(silverInrPerKg ?? silverInrPerGram, "INR", 2) + (silverInrPerKg ? " / kg" : " / g"),
        details: {
          usd_per_gram: silverUsdPerGram,
          inr_per_gram: silverInrPerGram,
          inr_per_kg: silverInrPerKg,
        },
      },
    },
    macro: {
      crude_oil: {
        symbol: "CL=F",
        name: "Crude Oil (WTI)",
        category: "macro",
        value: crudePrice,
        unit: "USD",
        formatted: formatCurrency(crudePrice, "USD", 2) + " / bbl",
      },
      usd_inr: {
        symbol: "USDINR=X",
        name: "USD / INR",
        category: "macro",
        value: usdInr,
        unit: "INR",
        formatted: formatCurrency(usdInr, "INR", 2),
      },
    },
    crypto: {
      bitcoin: {
        symbol: "BTC-USD",
        name: "Bitcoin",
        category: "crypto",
        value: btcPrice,
        unit: "USD",
        formatted: formatCurrency(btcPrice, "USD", 2),
        details: {
          inr_equivalent: btcInr,
          formatted_inr: formatCurrency(btcInr, "INR", 2),
        },
      },
    },
  };
}
