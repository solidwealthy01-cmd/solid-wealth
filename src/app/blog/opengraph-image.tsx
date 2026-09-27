import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Solid Wealth investment blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
    return renderOgImage({
        eyebrow: "Insights",
        title: "Investment Blog",
        subtitle: "Mutual fund analysis, SIP strategy, bonds, commodities and NRI tax — written for Indian investors.",
    });
}
