import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Learn investing with Solid Wealth";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
    return renderOgImage({
        eyebrow: "Learn Investment",
        title: "Free Mutual Fund Course",
        subtitle: "26 structured modules from investing foundations to portfolio construction, taxation and case studies.",
    });
}
