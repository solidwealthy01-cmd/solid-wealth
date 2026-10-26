"use client";
import { useEffect, useState } from "react";
import type { FilteredMarketResponse } from "@/lib/market-snapshot";
interface TickerItem {
    name: string;
    value: string;
}
function buildTickerItems(snapshot: FilteredMarketResponse): TickerItem[] {
    // Gold and silver per gram in rupees, converted server-side with the same
    // snapshot's USD/INR rate so a dollar figure is never shown with a rupee sign.
    const num = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : null;
    const metrics: Array<[string, number | null, "INR" | "USD" | "points"]> = [
        ["Gold (per g)", num(snapshot.metals.gold.details?.inr_per_gram), "INR"],
        ["Silver (per g)", num(snapshot.metals.silver.details?.inr_per_gram), "INR"],
        ["NIFTY 50", num(snapshot.indices.nifty_50.value), "points"],
        ["SENSEX", num(snapshot.indices.sensex.value), "points"],
        ["USD/INR", num(snapshot.macro.usd_inr.value), "INR"],
        ["Crude Oil", num(snapshot.macro.crude_oil.value), "USD"],
        ["Bitcoin", num(snapshot.crypto.bitcoin.value), "USD"],
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
                // The app's own route: it reads the backend and falls back to
                // public market data when the backend is down.
                const res = await fetch("/api/market-snapshot", { signal: controller.signal });
                if (!res.ok)
                    throw new Error(`Market snapshot request failed with ${res.status}`);
                const data: FilteredMarketResponse = await res.json();
                if (controller.signal.aborted)
                    return;
                setItems(buildTickerItems(data));
            }
            catch (err) {
                if ((err as Error).name === "AbortError")
                    return;
                console.warn("Ticker data currently unavailable from API:", (err as Error).message);
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
