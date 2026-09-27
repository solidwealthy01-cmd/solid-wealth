import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorsApp } from "@/components/calculators/calculators-app";
import { JsonLd } from "@/components/seo/json-ld";
import { CALCULATORS } from "@/lib/calculators-meta";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Financial Calculators — SIP, Lumpsum, EMI & SWP Online",
    description:
        "Free financial calculators for Indian investors: SIP, lumpsum, EMI, SWP, step-up SIP, gratuity, inflation and CAGR, with instant results and a PDF report.",
    path: "/calculators",
    keywords: [
        "financial calculator",
        "investment calculator",
        "mutual fund calculator",
        "sip calculator",
        "lumpsum calculator",
        "emi calculator",
        "online calculators india",
    ],
});

// The hub page. It ranks for the broad "financial calculators" style queries and
// links out to a dedicated page per calculator, each of which targets its own
// query on its own URL.
export default function CalculatorsHubPage() {
    return (
        <>
            <JsonLd
                data={[
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "Calculators", path: "/calculators" },
                    ]),
                    {
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        name: "Solid Wealth financial calculators",
                        itemListElement: CALCULATORS.map((calculator, index) => ({
                            "@type": "ListItem",
                            position: index + 1,
                            name: calculator.name,
                            url: absoluteUrl(`/calculators/${calculator.slug}`),
                        })),
                    },
                ]}
            />
            <CalculatorsApp />
            <section className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 pb-16 print:hidden">
                <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 lg:p-10">
                    <h2 className="text-2xl font-black text-[#1a2332]">All financial calculators</h2>
                    <p className="mt-3 max-w-4xl text-[15px] leading-relaxed text-gray-600">
                        Each calculator has its own page with the formula it uses, worked explanations
                        and answers to the questions investors ask most often.
                    </p>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {CALCULATORS.map((calculator) => (
                            <li key={calculator.slug}>
                                <Link
                                    href={`/calculators/${calculator.slug}`}
                                    className="block h-full rounded-2xl border border-gray-200 bg-[#FFFDF4] p-4 transition-colors hover:border-[#fe9800]"
                                >
                                    <span className="block text-sm font-bold text-[#1a2332]">{calculator.name}</span>
                                    <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                                        {calculator.intro.split(". ")[0]}.
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
}
