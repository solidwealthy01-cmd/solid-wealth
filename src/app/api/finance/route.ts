import { NextRequest, NextResponse } from "next/server";
import { fetchMarketQuote } from "@/lib/market-quote";
import { getFilteredMarketSnapshot } from "@/lib/market-snapshot";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    if (!symbol) {
        return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    try {
        // Fast 1-attempt check for live quote so UI never hangs
        const result = await fetchMarketQuote(symbol, 1);
        if (!result) {
            throw new Error(`No direct quote available for ${symbol}`);
        }
        let name = result.name;
        let price = result.price;
        let change = result.change;
        const changePercent = result.changePercent;
        let currency = result.currency || "USD";
        let high = result.high;
        let low = result.low;
        let volume = result.volume;
        let marketCap = result.marketCap;

        if (symbol === "GC=F") {
            name = "Gold Price - MCX";
            currency = "INR";
            const snapshot = await getFilteredMarketSnapshot();
            const liveGoldPrice = snapshot?.metals.gold.value;
            if (liveGoldPrice) {
                price = liveGoldPrice;
            } else {
                const globalChangePct = changePercent || 0.36;
                price = 78240 * (1 + globalChangePct / 100);
            }
            change = price * ((changePercent || 0.36) / 100);
            high = price * 1.003;
            low = price * 0.997;
            volume = 12400;
            marketCap = 0;
        }
        else if (symbol === "SI=F") {
            name = "Silver Price - MCX";
            currency = "INR";
            const snapshot = await getFilteredMarketSnapshot();
            const liveSilverPrice = snapshot?.metals.silver.value;
            if (liveSilverPrice) {
                price = liveSilverPrice;
            } else {
                const globalChangePct = changePercent || 1.17;
                price = 94150 * (1 + globalChangePct / 100);
            }
            change = price * ((changePercent || 1.17) / 100);
            high = price * 1.005;
            low = price * 0.995;
            volume = 8500;
            marketCap = 0;
        }
        return NextResponse.json({
            symbol: result.symbol,
            name,
            price,
            change,
            changePercent,
            currency,
            high,
            low,
            volume,
            marketCap,
            timestamp: Date.now(),
        });
    }
    catch (error) {
        // Fallback to Solid Wealth Backend Market Snapshot before static fallbacks
        const snapshot = await getFilteredMarketSnapshot();
        if (snapshot) {
            if (symbol === "^NSEI" && snapshot.indices.nifty_50.value) {
                const price = snapshot.indices.nifty_50.value;
                return NextResponse.json({
                    symbol,
                    name: "NIFTY 50",
                    price,
                    change: 0,
                    changePercent: 0,
                    currency: "INR",
                    high: price * 1.005,
                    low: price * 0.995,
                    volume: 250000000,
                    marketCap: 0,
                    timestamp: Date.now(),
                    source: "backend_snapshot",
                });
            }
            if (symbol === "^BSESN" && snapshot.indices.sensex.value) {
                const price = snapshot.indices.sensex.value;
                return NextResponse.json({
                    symbol,
                    name: "SENSEX",
                    price,
                    change: 0,
                    changePercent: 0,
                    currency: "INR",
                    high: price * 1.005,
                    low: price * 0.995,
                    volume: 180000000,
                    marketCap: 0,
                    timestamp: Date.now(),
                    source: "backend_snapshot",
                });
            }
            if (symbol === "GC=F" && snapshot.metals.gold.value) {
                const price = snapshot.metals.gold.value;
                return NextResponse.json({
                    symbol,
                    name: "Gold Price - MCX",
                    price,
                    change: 0,
                    changePercent: 0,
                    currency: "INR",
                    high: price * 1.003,
                    low: price * 0.997,
                    volume: 12400,
                    marketCap: 0,
                    timestamp: Date.now(),
                    source: "backend_snapshot",
                });
            }
            if (symbol === "SI=F" && snapshot.metals.silver.value) {
                const price = snapshot.metals.silver.value;
                return NextResponse.json({
                    symbol,
                    name: "Silver Price - MCX",
                    price,
                    change: 0,
                    changePercent: 0,
                    currency: "INR",
                    high: price * 1.005,
                    low: price * 0.995,
                    volume: 8500,
                    marketCap: 0,
                    timestamp: Date.now(),
                    source: "backend_snapshot",
                });
            }
            if ((symbol === "BTC-USD" || symbol === "BTC") && snapshot.crypto.bitcoin.value) {
                const price = snapshot.crypto.bitcoin.value;
                return NextResponse.json({
                    symbol: "BTC-USD",
                    name: "Bitcoin USD",
                    price,
                    change: 0,
                    changePercent: 0,
                    currency: "USD",
                    high: price * 1.02,
                    low: price * 0.98,
                    volume: 24000000000,
                    marketCap: price * 19700000,
                    timestamp: Date.now(),
                    source: "backend_snapshot",
                });
            }
        }

        const mockDataMap: Record<string, {
            price: number;
            changePercent: number;
            currency: string;
            name: string;
        }> = {
            AAPL: { price: 228.50, changePercent: 1.24, currency: "USD", name: "Apple Inc." },
            TSLA: { price: 254.30, changePercent: -0.83, currency: "USD", name: "Tesla, Inc." },
            "BTC-USD": { price: 84172.0, changePercent: 1.50, currency: "USD", name: "Bitcoin USD" },
            "ETH-USD": { price: 3450.0, changePercent: 2.10, currency: "USD", name: "Ethereum USD" },
            MSFT: { price: 428.15, changePercent: 0.95, currency: "USD", name: "Microsoft Corporation" },
            NVDA: { price: 125.40, changePercent: 3.12, currency: "USD", name: "NVIDIA Corporation" },
            "^NSEI": { price: 25810.85, changePercent: 0.45, currency: "INR", name: "NIFTY 50" },
            "^BSESN": { price: 84544.31, changePercent: 0.42, currency: "INR", name: "SENSEX" },
        };
        const mock = mockDataMap[symbol] || {
            price: Math.random() * 500 + 10,
            changePercent: Math.random() * 6 - 3,
            currency: "USD",
            name: `${symbol} (Simulation)`,
        };
        return NextResponse.json({
            symbol,
            name: mock.name,
            price: mock.price,
            change: mock.price * (mock.changePercent / 100),
            changePercent: mock.changePercent,
            currency: mock.currency,
            high: mock.price * 1.02,
            low: mock.price * 0.98,
            volume: Math.floor(Math.random() * 10000000),
            marketCap: Math.floor(Math.random() * 100000000000),
            timestamp: Date.now(),
            isMock: true,
        });
    }
}
