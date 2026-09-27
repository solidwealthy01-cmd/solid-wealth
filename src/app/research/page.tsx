import type { Metadata } from "next";
import { ResearchOverviewArticle } from "@/components/research/research-overview-article";

export const metadata: Metadata = {
  title: "Learn Investment | Solid Wealth Documentation & Education",
  description:
    "Explore Solid Wealth's structured 26-module mutual fund education curriculum, from investing foundations to portfolio construction and practical case studies.",
};

export default function ResearchPage() {
  return <ResearchOverviewArticle />;
}
