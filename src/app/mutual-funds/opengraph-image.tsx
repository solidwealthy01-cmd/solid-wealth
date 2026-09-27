import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Mutual fund research on Solid Wealth";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
    return renderOgImage({
        eyebrow: "Fund Research",
        title: "Mutual Fund Trailing Returns",
        subtitle: "Compare returns, AUM, expense ratios and category rankings across every equity, debt and hybrid category.",
    });
}
