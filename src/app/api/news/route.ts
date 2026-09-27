import { NextRequest, NextResponse } from "next/server";
import { getLiveMarketNews } from "@/lib/live-news";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;
    const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;
    const domains = searchParams.get("domains") || undefined;

    const stories = await getLiveMarketNews({
      query,
      category,
      sortBy,
      pageSize,
      page,
      domains,
    });

    return NextResponse.json({
      success: true,
      totalResults: stories.length,
      stories,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch live market news" }, { status: 500 });
  }
}
