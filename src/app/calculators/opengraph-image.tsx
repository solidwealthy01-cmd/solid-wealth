import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Solid Wealth financial calculators";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
    return renderOgImage({
        eyebrow: "Free Tools",
        title: "Financial Calculators",
        subtitle: "SIP, lumpsum, EMI, SWP, step-up SIP, gratuity, inflation and CAGR — instant results with a PDF report.",
    });
}
