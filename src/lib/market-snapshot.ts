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

export async function fetchRawMarketSnapshot(): Promise<RawMarketSnapshot | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/market-snapshot/`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    if (!res.ok) {
      console.error(`Failed to fetch backend market snapshot: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching market snapshot from backend:", err);
    return null;
  }
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
