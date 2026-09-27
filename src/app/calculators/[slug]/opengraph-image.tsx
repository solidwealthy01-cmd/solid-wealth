import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";
import { CALCULATORS, calculatorBySlug } from "@/lib/calculators-meta";

export const alt = "Solid Wealth financial calculator";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// One card per calculator, prerendered alongside the pages themselves.
export function generateStaticParams() {
    return CALCULATORS.map((calculator) => ({ slug: calculator.slug }));
}

function sentence(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const calculator = calculatorBySlug((await params).slug);
    return renderOgImage({
        eyebrow: "Free Calculator",
        title: calculator?.name ?? "Financial Calculator",
        // The title already names the tool, so the lead-in is trimmed and the
        // remaining sentence re-capitalised rather than starting mid-sentence.
        subtitle: calculator ? sentence(calculator.description.replace(/^Free [a-z-]+ calculator (to |for |using )?/i, "")) : undefined,
    });
}
