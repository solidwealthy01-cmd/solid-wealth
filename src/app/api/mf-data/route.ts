import { NextRequest, NextResponse } from "next/server";
import { getCuratedMutualFunds, searchMutualFunds, fetchSchemeDetails } from "@/lib/mf-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const code = searchParams.get("code");

    if (code) {
      const scheme = await fetchSchemeDetails(Number(code));
      return NextResponse.json({ success: true, scheme });
    }

    if (search) {
      const results = await searchMutualFunds(search);
      return NextResponse.json({ success: true, results });
    }

    const schemes = await getCuratedMutualFunds();
    return NextResponse.json({
      success: true,
      schemes,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("MF Data API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch mutual fund data" }, { status: 500 });
  }
}
