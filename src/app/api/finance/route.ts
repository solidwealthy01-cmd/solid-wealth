import { NextRequest, NextResponse } from "next/server";
import { fetchMarketQuote } from "@/lib/market-quote";
import { getFilteredMarketSnapshot } from "@/lib/market-snapshot";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    if (!symbol) {
        return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    const symUpper = symbol.toUpperCase().trim();

    // 1. Check backend market snapshot for indices, metals, macro, and crypto
    const snapshot = await getFilteredMarketSnapshot();
    if (snapshot) {
        if (symUpper === "^NSEI" || symUpper === "NIFTY") {
            const nifty = snapshot.indices.nifty_50;
            if (nifty.value) {
                return NextResponse.json({
                    symbol: "^NSEI",
                    name: nifty.name,
                    price: nifty.value,
                    change: 0,
                    changePercent: 0,
                    currency: "INR",
                    high: nifty.value * 1.005,
                    low: nifty.value * 0.995,
                    volume: 250000000,
                    marketCap: 0,
                    timestamp: Date.now(),
                    source: "backend_snapshot",
                });
            }
        }

        if (symUpper === "^BSESN" || symUpper === "SENSEX") {
            const sensex = snapshot.indices.sensex;
            if (sensex.value) {
                return NextResponse.json({
                    symbol: "^BSESN",
                    name: sensex.name,
                    price: sensex.value,
                    change: 0,
                    changePercent: 0,
                    currency: "INR",
                    high: sensex.value * 1.005,
                    low: sensex.value * 0.995,
                    volume: 180000000,
                    marketCap: 0,
                    timestamp: Date.now(),
                    source: "backend_snapshot",
                });
            }
        }

        if (symUpper === "GC=F" || symUpper === "GOLD") {
            const gold = snapshot.metals.gold;
            if (gold.value) {
                return NextResponse.json({
                    symbol: "GC=F",
                    name: "Gold Price - MCX (24K)",
                    price: gold.value,
                    change: 0,
                    changePercent: 0,
                    currency: "INR",
                    high: gold.value * 1.003,
                    low: gold.value * 0.997,
                    volume: 12400,
                    marketCap: 0,
                    timestamp: Date.now(),
                    source: "backend_snapshot",
                });
            }
        }

        if (symUpper === "SI=F" || symUpper === "SILVER") {
            const silver = snapshot.metals.silver;
            if (silver.value) {
                return NextResponse.json({
                    symbol: "SI=F",
                    name: "Silver Price - MCX",
                    price: silver.value,
                    change: 0,
                    changePercent: 0,
                    currency: "INR",
                    high: silver.value * 1.005,
                    low: silver.value * 0.995,
                    volume: 8500,
                    marketCap: 0,
                    timestamp: Date.now(),
                    source: "backend_snapshot",
                });
            }
        }

        if (symUpper === "CL=F" || symUpper === "CRUDE") {
            const crude = snapshot.macro.crude_oil;
            if (crude.value) {
                return NextResponse.json({
                    symbol: "CL=F",
                    name: crude.name,
                    price: crude.value,
                    change: 0,
                    changePercent: 0,
                    currency: "USD",
                    high: crude.value * 1.01,
                    low: crude.value * 0.99,
                    volume: 450000,
                    marketCap: 0,
                    timestamp: Date.now(),
                    source: "backend_snapshot",
                });
            }
        }

        if (symUpper === "BTC-USD" || symUpper === "BTC" || symUpper === "BITCOIN") {
            const btc = snapshot.crypto.bitcoin;
            if (btc.value) {
                return NextResponse.json({
                    symbol: "BTC-USD",
                    name: "Bitcoin USD",
                    price: btc.value,
                    change: 0,
                    changePercent: 0,
                    currency: "USD",
                    high: btc.value * 1.02,
                    low: btc.value * 0.98,
                    volume: 24000000000,
                    marketCap: btc.value * 19700000,
                    timestamp: Date.now(),
                    source: "backend_snapshot",
                });
            }
        }
    }

    // 2. Fetch live quote for US Equities or other assets
    try {
        const result = await fetchMarketQuote(symbol, 2);
        if (result && result.price) {
            return NextResponse.json({
                symbol: result.symbol,
                name: result.name,
                price: result.price,
                change: result.change,
                changePercent: result.changePercent,
                currency: result.currency || "USD",
                high: result.high ?? result.price * 1.02,
                low: result.low ?? result.price * 0.98,
                volume: result.volume ?? 0,
                marketCap: result.marketCap ?? 0,
                timestamp: Date.now(),
            });
        }
    } catch (err) {
        console.error(`Error fetching live quote for ${symbol}:`, err);
    }

    return NextResponse.json(
        { error: `Live market data currently unavailable for ${symbol}` },
        { status: 503 }
    );
}
