import type { Metadata } from "next";
import { FundCardView } from "@/components/mutual-funds/fund-card-view";

// This page renders whatever scheme the query string names, so every
// ?category=&period=&scheme= combination would look like a separate thin page to
// a crawler. It is kept out of the index (and out of the sitemap) while still
// letting crawlers follow its links. The indexable fund pages are
// /mutual-funds/[slug].
export const metadata: Metadata = {
    title: "Fund Card Analytics",
    description: "Detailed performance analytics for an individual mutual fund scheme.",
    robots: { index: false, follow: true },
};

export default function FundCardPage() {
    return <FundCardView />;
}
