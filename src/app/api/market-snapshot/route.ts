import { NextRequest, NextResponse } from "next/server";
import { getFilteredMarketSnapshot } from "@/lib/market-snapshot";

export async function GET(request: NextRequest) {
  try {
    const data = await getFilteredMarketSnapshot();
    if (!data) {
      return NextResponse.json(
        { error: "Could not retrieve market snapshot data from backend" },
        { status: 502 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.toLowerCase()?.trim();
    const symbol = searchParams.get("symbol")?.toLowerCase()?.trim();

    // Specific category filter
    if (category) {
      if (category === "indices" || category === "index") {
        return NextResponse.json({
          snapshot_date: data.snapshot_date,
          category: "indices",
          data: data.indices,
        });
      }
      if (category === "metals" || category === "commodities" || category === "gold_silver") {
        return NextResponse.json({
          snapshot_date: data.snapshot_date,
          category: "metals",
          data: data.metals,
        });
      }
      if (category === "macro" || category === "energy_forex" || category === "oil_forex") {
        return NextResponse.json({
          snapshot_date: data.snapshot_date,
          category: "macro",
          data: data.macro,
        });
      }
      if (category === "crypto" || category === "bitcoin") {
        return NextResponse.json({
          snapshot_date: data.snapshot_date,
          category: "crypto",
          data: data.crypto,
        });
      }

      return NextResponse.json(
        {
          error: `Unknown category '${category}'. Valid categories are: indices, metals, macro, crypto`,
        },
        { status: 400 }
      );
    }

    // Specific asset/symbol filter
    if (symbol) {
      const aliasMap: Record<string, any> = {
        nifty: data.indices.nifty_50,
        nifty50: data.indices.nifty_50,
        "^nsei": data.indices.nifty_50,
        sensex: data.indices.sensex,
        "^bsesn": data.indices.sensex,
        gold: data.metals.gold,
        "gc=f": data.metals.gold,
        silver: data.metals.silver,
        "si=f": data.metals.silver,
        crude: data.macro.crude_oil,
        oil: data.macro.crude_oil,
        "cl=f": data.macro.crude_oil,
        usdinr: data.macro.usd_inr,
        "usdinr=x": data.macro.usd_inr,
        bitcoin: data.crypto.bitcoin,
        btc: data.crypto.bitcoin,
        "btc-usd": data.crypto.bitcoin,
      };

      const matched = aliasMap[symbol];
      if (matched) {
        return NextResponse.json({
          snapshot_date: data.snapshot_date,
          asset: matched,
        });
      }

      return NextResponse.json(
        {
          error: `Asset symbol '${symbol}' not found in market snapshot`,
        },
        { status: 404 }
      );
    }

    // Default: return all 4 filtered groups
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in market snapshot route:", error);
    return NextResponse.json(
      { error: "Internal server error fetching market snapshot" },
      { status: 500 }
    );
  }
}
