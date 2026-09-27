import type { Metadata } from "next";
import { ResearchOverviewArticle } from "@/components/research/research-overview-article";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Learn Investment — Free Mutual Fund Course for Beginners",
  description:
    "A structured 26-module mutual fund course, free to read: investing foundations, fund selection, portfolio construction, taxation and practical case studies.",
  path: "/research",
  keywords: [
    "learn mutual fund investing",
    "mutual fund course india",
    "investment course for beginners",
    "how to invest in mutual funds",
    "sip learning guide",
  ],
});

export default function ResearchPage() {
  return <ResearchOverviewArticle />;
}
