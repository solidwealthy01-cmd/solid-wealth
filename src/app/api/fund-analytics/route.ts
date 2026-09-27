import { NextRequest, NextResponse } from "next/server";
import { getFundAnalytics } from "@/lib/fund-analytics";

// GET /api/fund-analytics?category=Childrens%20Fund&scheme=...&nav=21.26&uploadedOn=2026-08-22
// `scheme`, `nav` and `uploadedOn` come from the uploaded performance row and are
// used to find the matching AMFI scheme.
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.trim() || undefined;
    const scheme = searchParams.get("scheme")?.trim() || "";
    const code = searchParams.get("code")?.trim() || undefined;
    const navParam = searchParams.get("nav");
    const navNum = navParam ? Number(navParam) : undefined;
    const nav = navNum && Number.isFinite(navNum) && navNum > 0 ? navNum : undefined;
    const uploadedOn = searchParams.get("uploadedOn") || undefined;

    if (!scheme && !code) {
        return NextResponse.json({ error: "scheme or code is required" }, { status: 400 });
    }
    try {
        return NextResponse.json(await getFundAnalytics({ category, scheme, nav, uploadedOn, code }));
    }
    catch (error) {
        console.error("Fund analytics failed:", error);
        return NextResponse.json({ error: "Could not compute fund analytics right now" }, { status: 502 });
    }
}
