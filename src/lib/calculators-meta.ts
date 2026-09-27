// SEO copy for each calculator, keyed by the id used in the calculator UI.
//
// Each calculator gets its own URL because each is a separate search intent:
// someone typing "sip calculator" and someone typing "gratuity calculator" will
// not both be served well by one page. One page can rank for one primary query;
// eight pages can rank for eight.
//
// This registry is the single source for the routes, their metadata, the
// server-rendered copy on each page and the sitemap.

export interface CalculatorSeo {
    /** Matches the id in the calculator UI's own list. */
    id: string;
    slug: string;
    name: string;
    /** Kept near 60 characters so Google shows it whole. */
    title: string;
    /** Kept near 155 characters for the same reason. */
    description: string;
    keywords: string[];
    /** Server-rendered lead paragraph — crawlable text the client UI cannot provide. */
    intro: string;
    howItWorks: string[];
    faqs: { question: string; answer: string }[];
}

export const CALCULATORS: CalculatorSeo[] = [
    {
        id: "sip",
        slug: "sip-calculator",
        name: "SIP Calculator",
        title: "SIP Calculator — Calculate Mutual Fund SIP Returns Online",
        description: "Free SIP calculator to estimate the maturity value of your monthly mutual fund investment. See invested amount, estimated returns and total corpus instantly.",
        keywords: ["sip calculator", "mutual fund sip calculator", "sip return calculator", "monthly sip calculator", "sip investment calculator", "calculate sip returns online"],
        intro: "A Systematic Investment Plan (SIP) lets you invest a fixed amount in a mutual fund every month. This SIP calculator shows what those monthly instalments could grow to, splitting the result into the amount you invested and the returns compounding on top of it.",
        howItWorks: [
            "Enter your monthly investment amount, the return you expect each year, and how long you plan to stay invested.",
            "The calculator applies the standard SIP future value formula, compounding each instalment monthly for the time it stays invested.",
            "You get the total invested amount, the estimated returns and the final corpus, along with a year-by-year growth chart.",
        ],
        faqs: [
            { question: "How is SIP return calculated?", answer: "A SIP is a series of monthly investments, each compounding for a different length of time. The future value formula used is M = P × ({[1 + i]^n - 1} / i) × (1 + i), where P is the monthly instalment, i is the monthly rate of return (annual rate divided by 12) and n is the total number of instalments." },
            { question: "What return should I assume for a SIP?", answer: "Returns are not guaranteed and depend entirely on the fund you choose. Many investors model equity funds at 10-12% per year and debt funds at 6-7% as a planning assumption, but actual returns will vary year to year and can be negative over short periods." },
            { question: "Is a SIP better than a lumpsum investment?", answer: "Neither is universally better. A SIP spreads your entry across market levels, which reduces the risk of investing everything at a peak and suits money you earn monthly. A lumpsum puts the full amount to work immediately, which helps when markets rise steadily afterwards." },
        ],
    },
    {
        id: "lumpsum",
        slug: "lumpsum-calculator",
        name: "Lumpsum Calculator",
        title: "Lumpsum Calculator — One-Time Mutual Fund Investment Returns",
        description: "Free lumpsum calculator for one-time mutual fund investments. Enter the amount, expected return and tenure to see your maturity value instantly.",
        keywords: ["lumpsum calculator", "lump sum calculator", "one time investment calculator", "mutual fund lumpsum calculator", "lumpsum return calculator", "calculate lumpsum returns"],
        intro: "A lumpsum investment puts a single amount into a mutual fund and leaves it to compound. This lumpsum calculator shows what one-time investment could be worth at the end of your chosen horizon, and how much of that growth came from returns rather than your own capital.",
        howItWorks: [
            "Enter the one-time amount you plan to invest, your expected annual return and the number of years you will stay invested.",
            "The calculator compounds the amount annually using the standard future value formula.",
            "You see the maturity value, the absolute gain over your investment, and how the corpus builds year by year.",
        ],
        faqs: [
            { question: "How is lumpsum return calculated?", answer: "The future value of a lumpsum uses compound interest: FV = P × (1 + r)^n, where P is the amount invested, r is the annual rate of return and n is the number of years. All returns are assumed to stay invested and compound." },
            { question: "How long should I stay invested in a lumpsum?", answer: "Equity lumpsum investments generally need a horizon of at least five to seven years, because a single entry point carries more timing risk than a SIP and needs time to ride out market cycles." },
            { question: "What is an STP and when should I use one instead?", answer: "A Systematic Transfer Plan parks your lumpsum in a liquid or debt fund and moves a fixed sum into equity each month. It is often used when you have a large amount to deploy but are uncomfortable investing all of it at current market levels." },
        ],
    },
    {
        id: "emi",
        slug: "emi-calculator",
        name: "EMI Calculator",
        title: "EMI Calculator — Home, Car & Personal Loan EMI Online",
        description: "Free EMI calculator for home, car and personal loans. Enter the amount, rate and tenure to get your monthly EMI, total interest and repayment schedule.",
        keywords: ["emi calculator", "loan emi calculator", "home loan emi calculator", "car loan emi calculator", "personal loan emi calculator", "calculate emi online"],
        intro: "An EMI is the fixed monthly payment that clears a loan's principal and interest over its tenure. This EMI calculator shows your monthly instalment, how much of the loan cost is interest, and how the balance falls over time.",
        howItWorks: [
            "Enter the loan amount, the annual interest rate your lender is offering and the tenure in years.",
            "The calculator uses the standard reducing-balance EMI formula to work out a level monthly payment.",
            "You get the monthly EMI, total interest payable, total repayment and an amortisation schedule showing the principal and interest split.",
        ],
        faqs: [
            { question: "How is EMI calculated?", answer: "EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is the principal, r is the monthly interest rate (annual rate divided by 12) and n is the number of monthly instalments. This is the reducing-balance method used by Indian banks." },
            { question: "Does a longer tenure reduce my loan cost?", answer: "No. A longer tenure lowers the monthly EMI but increases the total interest you pay, because the principal is outstanding for longer. A shorter tenure costs more each month but far less overall." },
            { question: "How does prepayment reduce interest?", answer: "A prepayment is applied directly to the outstanding principal. Since interest is charged on the reducing balance, every rupee prepaid removes all the future interest that rupee would have attracted — which is why early prepayments save the most." },
        ],
    },
    {
        id: "swp",
        slug: "swp-calculator",
        name: "SWP Calculator",
        title: "SWP Calculator — Systematic Withdrawal Plan Returns",
        description: "Free SWP calculator to plan monthly withdrawals from your mutual fund corpus. See how long your money lasts and what balance remains at the end of the period.",
        keywords: ["swp calculator", "systematic withdrawal plan calculator", "mutual fund swp calculator", "monthly withdrawal calculator", "retirement withdrawal calculator"],
        intro: "A Systematic Withdrawal Plan takes a fixed amount out of your mutual fund investment every month while the remaining balance stays invested. This SWP calculator shows how long a corpus can sustain your withdrawals and what is left at the end.",
        howItWorks: [
            "Enter your total corpus, the monthly amount you want to withdraw, the return you expect on the balance and the period.",
            "Each month the calculator subtracts your withdrawal and grows the remaining balance at the expected rate.",
            "You see the total withdrawn, the closing balance, and whether the corpus outlasts the period you chose.",
        ],
        faqs: [
            { question: "How does an SWP work?", answer: "You invest a corpus in a mutual fund and instruct the fund house to redeem a fixed rupee amount on a set date each month. Units are sold to fund each withdrawal while the remaining units stay invested and continue to earn returns." },
            { question: "Is SWP income taxable?", answer: "Each withdrawal is a redemption, so only the capital gains portion is taxed, not the full amount withdrawn. This usually makes an SWP more tax-efficient than interest income from a fixed deposit, which is taxed in full at your slab rate." },
            { question: "What withdrawal rate is sustainable?", answer: "If your withdrawal rate is below your net return, the corpus keeps growing. Withdrawing more than the corpus earns will steadily deplete it — the calculator shows exactly when that happens for your inputs." },
        ],
    },
    {
        id: "step_up_sip",
        slug: "step-up-sip-calculator",
        name: "Step-Up SIP Calculator",
        title: "Step-Up SIP Calculator — Increase Your SIP Every Year",
        description: "Free step-up SIP calculator showing how raising your monthly investment each year grows your corpus. Compare a top-up SIP against a flat SIP instantly.",
        keywords: ["step up sip calculator", "top up sip calculator", "increasing sip calculator", "annual step up sip", "sip with annual increase calculator"],
        intro: "A step-up SIP raises your monthly instalment by a set percentage every year, usually in line with your salary. This calculator shows how much more you accumulate by stepping up compared with keeping the same instalment for the whole period.",
        howItWorks: [
            "Enter your starting monthly investment, the annual step-up percentage, your expected return and the investment period.",
            "The calculator compounds each year's instalments and then increases the instalment before the next year begins.",
            "You see the final corpus, the total invested, and how much the step-up added over a flat SIP.",
        ],
        faqs: [
            { question: "What is a step-up or top-up SIP?", answer: "A step-up SIP automatically increases your monthly contribution by a fixed percentage or amount each year, so your investing keeps pace with your income instead of staying frozen at the amount you could afford when you started." },
            { question: "How much should I step up each year?", answer: "Many investors match the step-up to their expected annual increment, commonly 5-10%. The point is to capture part of each raise before it is absorbed into everyday spending." },
            { question: "Does a step-up SIP really make a large difference?", answer: "Yes, because the increases compound along with the returns. Over a 15-20 year horizon even a modest annual step-up can substantially increase the final corpus compared with a flat SIP." },
        ],
    },
    {
        id: "gratuity",
        slug: "gratuity-calculator",
        name: "Gratuity Calculator",
        title: "Gratuity Calculator — Calculate Your Gratuity Amount Online",
        description: "Free gratuity calculator using last drawn basic salary and years of service. Find the amount payable under the Payment of Gratuity Act 15/26 formula.",
        keywords: ["gratuity calculator", "gratuity calculation formula", "calculate gratuity online", "gratuity amount calculator", "employee gratuity calculator india"],
        intro: "Gratuity is a lump sum an employer pays for continuous service. This gratuity calculator applies the formula set out in the Payment of Gratuity Act, using your last drawn basic salary plus dearness allowance and your years of service.",
        howItWorks: [
            "Enter your last drawn monthly basic salary including dearness allowance, and your total completed years of service.",
            "The calculator applies the statutory formula: 15 days of salary for each completed year, based on a 26-day month.",
            "You get the gratuity payable, with service of six months or more in the final year counted as a full year.",
        ],
        faqs: [
            { question: "What is the gratuity calculation formula?", answer: "For employees covered by the Payment of Gratuity Act, gratuity = (last drawn basic salary + dearness allowance) × 15 / 26 × number of completed years of service. The 15/26 represents 15 days of wages out of a 26-working-day month." },
            { question: "How many years of service are needed for gratuity?", answer: "Five years of continuous service are required, except where employment ends due to death or disablement, in which case the five-year condition does not apply." },
            { question: "Is gratuity taxable in India?", answer: "Gratuity received by government employees is fully exempt from tax. For other employees covered by the Act, it is exempt up to a ceiling of ₹20 lakh across your career, with any excess taxable as salary income." },
        ],
    },
    {
        id: "inflation",
        slug: "inflation-calculator",
        name: "Inflation Calculator",
        title: "Inflation Calculator — Future Value of Money in India",
        description: "Free inflation calculator showing what today's money will be worth in future years. See how rising prices erode purchasing power and what you need to keep pace.",
        keywords: ["inflation calculator", "inflation calculator india", "future value of money calculator", "purchasing power calculator", "cost of living calculator"],
        intro: "Inflation steadily reduces what a rupee buys. This inflation calculator shows what an amount today will cost in future years at your assumed inflation rate, which is the number your investments have to beat simply to stand still.",
        howItWorks: [
            "Enter the current cost of what you are planning for, the inflation rate you expect and the number of years ahead.",
            "The calculator compounds the amount forward at the inflation rate.",
            "You see the future cost and the loss in purchasing power, so you can size your investment target realistically.",
        ],
        faqs: [
            { question: "How do you calculate the effect of inflation?", answer: "Future cost = current cost × (1 + inflation rate)^number of years. The same compounding that grows investments also grows the price of what you are saving for." },
            { question: "What inflation rate should I assume for India?", answer: "General CPI inflation is often planned at around 6%, but category inflation differs sharply — healthcare and education costs in India have historically risen faster, frequently in the 10-12% range." },
            { question: "What is real return versus nominal return?", answer: "Real return is approximately the nominal return minus inflation. A fixed deposit paying 7% in a 6% inflation environment delivers only about 1% of real growth in purchasing power, before tax." },
        ],
    },
    {
        id: "cagr",
        slug: "cagr-calculator",
        name: "CAGR Calculator",
        title: "CAGR Calculator — Compound Annual Growth Rate Online",
        description: "Free CAGR calculator to find the compound annual growth rate between a starting and ending value. Compare investments held over different periods on equal terms.",
        keywords: ["cagr calculator", "compound annual growth rate calculator", "calculate cagr online", "annualised return calculator", "investment growth rate calculator"],
        intro: "CAGR is the single annual growth rate that would take an investment from its starting value to its ending value. This CAGR calculator smooths out volatile years into one comparable annualised number.",
        howItWorks: [
            "Enter the initial value, the final value and the number of years the investment was held.",
            "The calculator applies the compound annual growth rate formula.",
            "You get the annualised return, which you can compare directly against other investments held for different lengths of time.",
        ],
        faqs: [
            { question: "What is the CAGR formula?", answer: "CAGR = (ending value / beginning value)^(1 / number of years) - 1, expressed as a percentage. It gives the constant annual rate that would produce the same end result." },
            { question: "Why use CAGR instead of total return?", answer: "Total return does not account for time, so a 60% gain over three years and a 60% gain over eight years look identical. CAGR annualises both, letting you compare investments held over different periods fairly." },
            { question: "What are the limitations of CAGR?", answer: "CAGR hides volatility. It reports a smooth annual rate even when the path involved large gains and losses, and it assumes no money was added or withdrawn along the way. For investments with cash flows, XIRR is the better measure." },
        ],
    },
];

export function calculatorBySlug(slug: string): CalculatorSeo | undefined {
    return CALCULATORS.find((calculator) => calculator.slug === slug);
}
