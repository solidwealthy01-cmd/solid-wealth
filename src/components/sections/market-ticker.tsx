"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api-config";
// Shape of /api/market-snapshot/. DRF serialises decimals as strings.
interface MarketSnapshot {
    snapshot_date: string;
    gold_price: string | null;
    silver_price: string | null;
    crude_oil_price: string | null;
    bitcoin_price: string | null;
    nifty_50_value: string | null;
    sensex_value: string | null;
    usd_inr_rate: string | null;
}
interface TickerItem {
    name: string;
    value: string;
}
function toNumber(value: string | null) {
    if (value === null || value === "")
        return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}
function buildTickerItems(snapshot: MarketSnapshot): TickerItem[] {
    const usdInr = toNumber(snapshot.usd_inr_rate);
    // Gold and silver are stored in USD per gram. Convert them with the same
    // snapshot's rate so a dollar figure is never shown with a rupee sign.
    const inrPerGram = (usdPerGram: number | null) => usdPerGram === null || usdInr === null ? null : usdPerGram * usdInr;
    const metrics: Array<[string, number | null, "INR" | "USD" | "points"]> = [
        ["Gold (per g)", inrPerGram(toNumber(snapshot.gold_price)), "INR"],
        ["Silver (per g)", inrPerGram(toNumber(snapshot.silver_price)), "INR"],
        ["NIFTY 50", toNumber(snapshot.nifty_50_value), "points"],
        ["SENSEX", toNumber(snapshot.sensex_value), "points"],
        ["USD/INR", usdInr, "INR"],
        ["Crude Oil", toNumber(snapshot.crude_oil_price), "USD"],
        ["Bitcoin", toNumber(snapshot.bitcoin_price), "USD"],
    ];
    return metrics.flatMap(([name, value, unit]) => value === null
        ? []
        : [{
                name,
                value: (unit === "INR" ? "₹" : unit === "USD" ? "$" : "") + value.toLocaleString(unit === "USD" ? "en-US" : "en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
            }]);
}
export function MarketTicker() {
    const [items, setItems] = useState<TickerItem[]>([]);
    useEffect(() => {
        const controller = new AbortController();
        const fetchMarketSnapshot = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/market-snapshot/`, { signal: controller.signal });
                // 404 means no snapshot has been stored yet, which is a normal
                // state (e.g. a fresh local database), not a failure.
                if (res.status === 404)
                    return;
                if (!res.ok)
                    throw new Error(`Market snapshot request failed with ${res.status}`);
                const data: MarketSnapshot = await res.json();
                if (controller.signal.aborted)
                    return;
                setItems(buildTickerItems(data));
            }
            catch (err) {
                if ((err as Error).name === "AbortError")
                    return;
                console.error("Failed to load ticker data from API:", err);
            }
        };
        fetchMarketSnapshot();
        return () => controller.abort();
    }, []);
    // With no live figures the ticker renders nothing. It previously fell back
    // to placeholder US equity prices, which read as real market data.
    if (items.length === 0)
        return null;
    const doubledItems = [...items, ...items];
    return (<div aria-label="Market price ticker" className="overflow-hidden border-y border-wealth-dark-border bg-wealth-dark-bg py-3.5">
      <div className="flex w-max animate-ticker">
        {doubledItems.map((item, index) => (<div className="flex items-center gap-2.5 border-r border-wealth-dark-border px-10 font-mono text-xs text-wealth-muted" key={`${item.name}-${index}`}>
            <span className="font-medium text-[#cbd5e1]">{item.name}</span>
            <span className="text-[#cbd5e1]">{item.value}</span>
          </div>))}
      </div>
    </div>);
}
