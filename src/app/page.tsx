import type { Metadata } from "next";
import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";
import { MarketTicker } from "@/components/sections/market-ticker";
import { MutualFundsSection } from "@/components/sections/mutual-funds-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { DownloadAppSection } from "@/components/sections/download-app-section";
import { ContactUsSection } from "@/components/sections/contact-us-section";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Solid Wealth | Mutual Fund Investing & Financial Calculators",
    description: "Invest in mutual funds with Solid Wealth. Free SIP, lumpsum and EMI calculators, live NAV data, fund research and advisory built for Indian investors.",
    path: "/",
    keywords: ["mutual fund investment india", "sip investment", "invest in mutual funds online", "financial calculators india", "wealth management india", "mutual fund nav"],
});

export default function Home() {
    return (<>
      <HeroSection />
      <MarketTicker />
      <FeaturesSection />
      <MutualFundsSection />
      <ReviewsSection />
      <ContactUsSection />
      <DownloadAppSection />
    </>);
}
