import Link from "next/link";
import { CALCULATORS, CalculatorSeo } from "@/lib/calculators-meta";

// Server-rendered copy that sits under the interactive tool. The calculator
// itself is a client component, so without this a crawler sees a page with no
// text to rank — this is the part Google actually reads.
export function CalculatorSeoContent({ calculator }: { calculator: CalculatorSeo }) {
    const others = CALCULATORS.filter((entry) => entry.id !== calculator.id);
    return (
        <section className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 pb-4">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 lg:p-10">
                <h2 className="text-2xl font-black text-[#1a2332]">
                    About the {calculator.name}
                </h2>
                <p className="mt-3 max-w-4xl text-[15px] leading-relaxed text-gray-600">
                    {calculator.intro}
                </p>

                <h3 className="mt-8 text-lg font-bold text-[#1a2332]">
                    How this {calculator.name.toLowerCase()} works
                </h3>
                <ol className="mt-3 max-w-4xl list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-gray-600">
                    {calculator.howItWorks.map((step) => (
                        <li key={step}>{step}</li>
                    ))}
                </ol>

                <h3 className="mt-8 text-lg font-bold text-[#1a2332]">
                    Frequently asked questions
                </h3>
                <dl className="mt-3 max-w-4xl space-y-5">
                    {calculator.faqs.map((faq) => (
                        <div key={faq.question}>
                            <dt className="text-[15px] font-bold text-[#1a2332]">{faq.question}</dt>
                            <dd className="mt-1.5 text-[15px] leading-relaxed text-gray-600">{faq.answer}</dd>
                        </div>
                    ))}
                </dl>

                {/* Internal links: they help a crawler find every calculator and
                    tell it what each destination is about. */}
                <h3 className="mt-8 text-lg font-bold text-[#1a2332]">Other financial calculators</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                    {others.map((entry) => (
                        <li key={entry.slug}>
                            <Link
                                href={`/calculators/${entry.slug}`}
                                className="inline-flex rounded-full border border-gray-200 bg-[#FFFDF4] px-4 py-2 text-sm font-semibold text-[#1a2332] transition-colors hover:border-[#fe9800] hover:text-[#fe9800]"
                            >
                                {entry.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <p className="mt-8 text-xs leading-relaxed text-gray-400">
                    These calculators are for illustration only. Returns shown are estimates based on
                    the inputs you provide and are not a guarantee of future performance. Mutual fund
                    investments are subject to market risks; read all scheme related documents carefully.
                </p>
            </div>
        </section>
    );
}
