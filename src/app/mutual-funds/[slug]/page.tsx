import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { MUTUAL_FUNDS_DATA, getFundBySlugOrName } from "@/lib/mutual-funds-data";
import { FundCardDetail } from "@/components/mutual-funds/fund-card-detail";

interface SlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return MUTUAL_FUNDS_DATA.map((fund) => ({
    slug: fund.slug,
  }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const fund = getFundBySlugOrName(resolvedParams.slug);

  return pageMetadata({
    title: `${fund.fullName} — NAV, Returns & Fund Card`,
    description: `Factsheet for ${fund.fullName}: latest NAV, asset allocation, year-by-year performance, risk-o-meter rating and SIP return history.`,
    path: `/mutual-funds/${resolvedParams.slug}`,
    keywords: [fund.fullName, `${fund.fullName} nav`, `${fund.fullName} returns`, "mutual fund factsheet", "fund card"],
  });
}

export default async function FundSlugPage({ params }: SlugPageProps) {
  const resolvedParams = await params;

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-28 pb-20 sm:pt-36 sm:pb-24 lg:pt-40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <FundCardDetail initialScheme={resolvedParams.slug} />
      </div>
    </div>
  );
}
