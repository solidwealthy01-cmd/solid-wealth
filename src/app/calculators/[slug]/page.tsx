import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorSeoContent } from "@/components/calculators/calculator-seo-content";
import { CalculatorsApp } from "@/components/calculators/calculators-app";
import { JsonLd } from "@/components/seo/json-ld";
import { CALCULATORS, calculatorBySlug } from "@/lib/calculators-meta";
import { breadcrumbJsonLd, calculatorJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

interface CalculatorPageProps {
    params: Promise<{ slug: string }>;
}

// Prerendered, so each calculator is a static HTML document a crawler can read
// without running the tool's JavaScript.
export function generateStaticParams() {
    return CALCULATORS.map((calculator) => ({ slug: calculator.slug }));
}

export async function generateMetadata({ params }: CalculatorPageProps): Promise<Metadata> {
    const calculator = calculatorBySlug((await params).slug);
    if (!calculator) return {};
    return pageMetadata({
        title: calculator.title,
        description: calculator.description,
        path: `/calculators/${calculator.slug}`,
        keywords: calculator.keywords,
    });
}

export default async function CalculatorPage({ params }: CalculatorPageProps) {
    const calculator = calculatorBySlug((await params).slug);
    if (!calculator) notFound();

    return (
        <>
            <JsonLd
                data={[
                    calculatorJsonLd({
                        name: calculator.name,
                        description: calculator.description,
                        path: `/calculators/${calculator.slug}`,
                    }),
                    faqJsonLd(calculator.faqs),
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "Calculators", path: "/calculators" },
                        { name: calculator.name, path: `/calculators/${calculator.slug}` },
                    ]),
                ]}
            />
            <CalculatorsApp initialCalcId={calculator.id} heading={calculator.name} />
            <CalculatorSeoContent calculator={calculator} />
        </>
    );
}
