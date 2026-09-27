import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Solid Wealth — mutual fund investing and financial calculators";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
    return renderOgImage({
        eyebrow: "Wealth Management",
        title: "Reimagine money, simple solutions",
        subtitle: "Mutual fund investing, live NAV research and free financial calculators for Indian investors.",
    });
}
