// Central Blog Content Store for Solid Wealth
// Formatted in Groww style: Clean, layman-friendly, and packed with real financial knowledge.

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface ComparisonTable {
  title: string;
  headers: string[];
  rows: {
    parameter: string;
    corporate: string;
    government: string;
  }[];
}

export interface BlogArticle {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  category: string;
  categorySlug: "all" | "mutual-funds" | "bonds" | "sip-wealth" | "markets" | "commodities" | "nri-tax" | "news";
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  content: {
    heading: string;
    body: string[];
    bullets?: string[];
  }[];
  comparisonTable?: ComparisonTable;
  faqs?: BlogFAQ[];
  relatedPostIds: string[];
}

export const ALL_TOPIC_TAGS = [
  "FnO",
  "Gold",
  "IPO",
  "Journal",
  "Learn",
  "Markets",
  "Mutual Funds",
  "News",
  "NFO",
  "Personal Finance",
  "Stocks",
  "Tax",
  "Trust and Safety",
  "Commodity Trading",
  "Algo Trading",
  "Corporate Bonds",
  "Demat",
  "HUF",
  "ETF",
  "PMS",
  "915",
  "MTF",
  "SIF",
  "Wealth",
  "US Stocks",
  "Unlisted Shares",
  "Bonds",
  "SIP",
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "how-corporate-bonds-work",
    title: "How Corporate Bonds Work: A Beginner’s Guide",
    summary:
      "Corporate bonds offer investors an opportunity to earn a fixed income regularly while preserving capital at the same time. Understanding how they work is crucial, whether you are seeking stability or potentially higher returns.",
    date: "25 September 2026",
    readTime: "7 min read",
    category: "Bonds",
    categorySlug: "bonds",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Solid Wealth Editorial Desk",
      role: "Fixed Income Research",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["Bonds", "Corporate Bonds", "Fixed Income", "Wealth", "Tax"],
    content: [
      {
        heading: "Introduction",
        body: [
          "Corporate bonds offer investors an opportunity to earn a fixed income regularly while preserving capital at the same time. Understanding how they work is crucial, whether you are seeking stability or potentially higher returns. The blog covers corporate bonds, their types, benefits and risks involved and how you can consider them to diversify your portfolio and generate a steady income.",
        ],
      },
      {
        heading: "What Are Corporate Bonds?",
        body: [
          "Corporate bonds are debt securities issued by companies to raise capital from investors. Investors lend money to the company, which agrees to pay interest over a specified duration and to repay the principal amount at the time of maturity. These bonds may be classified into high-yield or investment-grade, depending on their creditworthiness.",
          "This is assessed by credit rating agencies, which assign a particular rating to the bond, indicating potential default risks. Bonds with high credit ratings (AAA, BBB, AA) are usually considered to be investment-grade, while those with lower ratings, like BB and below, are considered high-yield or junk bonds.",
        ],
      },
      {
        heading: "How Do Corporate Bonds Work?",
        body: [
          "This is how corporate bonds work in modern financial markets:",
        ],
        bullets: [
          "Companies issue bonds to raise capital for various reasons, such as funding new projects, refinancing debt, and expansion, among others. Investors become creditors of the company and not owners (like shareholders).",
          "Key issue terms include the face value (the principal amount promised to be repaid at maturity), maturity date, coupon rate (the fixed interest rate paid to bondholders, usually semi-annually or annually), and yield to maturity (the total return investors may expect if they hold the bond till maturity).",
          "You should account for credit risks (company defaulting on its debt obligations) and interest rate risks (changes in market interest rates impacting the bond price). Higher-rated bonds offer superior credit quality but lower yields, while lower-rated bonds carry higher default risk alongside elevated yields.",
          "Corporate bonds can be traded on organised exchanges, and prices fluctuate depending on market interest rates, company performance, and credit ratings. When interest rates increase, bond prices usually decline and vice versa.",
          "You can invest in these bonds to diversify your portfolio while earning fixed income via interest payments. However, it is wise to keep your risk appetite in mind, since corporate debt carries more risk than sovereign Government securities.",
        ],
      },
      {
        heading: "Key Components of a Corporate Bond",
        body: [
          "Taking all the vital components of corporate debt instruments into account:",
        ],
        bullets: [
          "Face Value: The principal amount that you will receive at maturity. It is usually a fixed amount (e.g. ₹1,000, ₹10,000, or ₹1 Lakh per debenture).",
          "Coupon Rate: The fixed annual or semi-annual interest rate paid on the face value of the bond.",
          "Maturity Date: The date on which the issuer will repay the face value of the bond. Maturity dates can vary anywhere from less than 3 years to more than 10 years.",
          "Yield: The overall return you can expect on the bond. Several aspects, such as time to maturity, purchase price, coupon rate, and issuer credit rating influence the yield. Varieties include Yield to Maturity (YTM), Current Yield, and Yield to Call (YTC).",
          "Credit Rating: Assigned by independent agencies (CRISIL, ICRA, CARE) evaluating default probability. Higher ratings like AAA or AA indicate strong solvency, while C or D indicate severe default vulnerability.",
        ],
      },
      {
        heading: "Types of Corporate Bonds",
        body: [
          "There are several distinct categories of corporate bonds available to investors in India:",
        ],
        bullets: [
          "Investment-Grade Bonds: Safer issues with high credit ratings (AAA to BBB-), indicating very low default likelihood. Typically issued by blue-chip conglomerates with resilient cashflows.",
          "High-Yield / Non-Investment Grade Bonds: Debentures carrying lower credit ratings (BB and below). They offer higher interest rates to compensate investors for the elevated credit risk.",
          "Convertible Bonds: Hybrid debt securities that can be converted into shares of the issuing company's equity stock at the bondholder's option, providing both regular yield and capital growth potential.",
          "Callable Bonds: The issuing corporation retains the right to redeem the bonds before scheduled maturity, usually exercised if benchmark interest rates fall and debt can be refinanced more cheaply.",
          "Secured Bonds: Backed by specific tangible corporate assets (manufacturing plants, real estate, equipment) functioning as collateral for bondholders.",
          "Unsecured Bonds (Debentures): Backed solely by the general creditworthiness and future earnings capacity of the issuer, with no specific collateral lien.",
          "Zero-Coupon Bonds: Pay no periodic interest. Instead, they are issued at a deep discount to face value and redeemed at 100% of par value on maturity.",
          "Floating-Rate Bonds: Feature coupon rates that adjust periodically based on a benchmark financial rate (e.g. RBI Repo rate or MIBOR).",
          "Income Bonds: Pay interest only if the issuing corporation generates sufficient net profits during the fiscal period.",
        ],
      },
      {
        heading: "How to Invest in Corporate Bonds",
        body: [
          "To invest prudently in corporate bonds, keep these strategic steps in mind:",
        ],
        bullets: [
          "Understand Your Investment Objective: Clarify whether you seek predictable regular monthly/quarterly income or lump sum capital preservation.",
          "Analyze Risk Tolerance: High-yield debentures come with default vulnerabilities, whereas AAA-rated investment grade issues prioritize capital security over aggressive yield.",
          "Compare Fund & Issue Metrics: Evaluate yield to maturity (YTM), modified duration, credit ratings, expense ratios, and issuer track records.",
          "Diversify Thoroughly: Never concentrate your fixed income allocation into a single corporate issuer. Spread holdings across corporate debt, Government securities (G-Secs), and liquid funds.",
          "Monitor Credit Ratings: Track issuer quarterly reports and agency rating revisions. Be prepared to rebalance if credit quality deteriorates.",
        ],
      },
      {
        heading: "Benefits of Investing in Corporate Bonds",
        body: [
          "Key benefits that make corporate bonds attractive for balanced portfolios:",
        ],
        bullets: [
          "Higher Returns Than Sovereign Debt: Corporate bonds typically offer 1.5% to 3.5% higher annual yields compared to traditional Government securities or bank fixed deposits.",
          "Predictable Fixed Cash Flows: Contractual coupon payments provide steady income suitable for retirees, HNIs, and conservative savers.",
          "Flexible Investment Horizons: With maturities ranging from short-term (1-3 years) to long-term (10+ years), you can align bond maturities with upcoming financial life milestones.",
          "Professional Portfolio Management: Investing through Corporate Bond Mutual Funds gives you active fund manager credit research, daily liquidity, and institutional diversification.",
        ],
      },
      {
        heading: "Risks Associated with Corporate Bonds",
        body: [
          "Essential risk factors every bond investor must evaluate:",
        ],
        bullets: [
          "Credit / Default Risk: The risk that the issuer may suffer financial distress and fail to pay coupon interest or return principal at maturity.",
          "Interest Rate Risk: When market interest rates rise, existing fixed-rate bond prices drop on secondary exchanges.",
          "Liquidity Risk: Lower-rated debentures can be difficult to sell quickly at fair value prior to maturity.",
          "Call Risk: The risk that an issuer redeems high-yielding bonds early after a market interest rate drop, forcing reinvestment at lower rates.",
        ],
      },
    ],
    comparisonTable: {
      title: "Corporate Bonds vs. Government Bonds",
      headers: ["Parameter", "Corporate Bonds", "Government Bonds (G-Secs)"],
      rows: [
        {
          parameter: "Issuer",
          corporate: "Issued by private & public corporations for expansion and capital expenditure",
          government: "Issued by the Central Government / RBI for managing national debt and public works",
        },
        {
          parameter: "Returns / Yield",
          corporate: "Higher coupon interest rates (typically 8.0% - 11.0%)",
          government: "Comparatively lower interest rates (typically 6.8% - 7.3%)",
        },
        {
          parameter: "Credit Risk",
          corporate: "Relatively higher (dependent on corporate solvency)",
          government: "Practically zero sovereign default risk (backed by Government of India)",
        },
        {
          parameter: "Liquidity",
          corporate: "Varies by rating and issue size; high for top AAA corporate bonds",
          government: "Extremely high institutional and secondary market liquidity",
        },
        {
          parameter: "Security / Backing",
          corporate: "Backed by corporate assets (secured) or general credit (unsecured)",
          government: "Sovereign guarantee of the Union Government",
        },
        {
          parameter: "Ideal Investor Profile",
          corporate: "Investors seeking higher yield with moderate credit risk tolerance",
          government: "Conservative investors prioritizing maximum safety and capital preservation",
        },
      ],
    },
    faqs: [
      {
        question: "Who can invest in corporate bonds in India?",
        answer:
          "Individual retail investors, High Net Worth Individuals (HNIs), Non-Resident Indians (NRIs), mutual funds, banks, and foreign institutional investors can all invest in corporate bonds via primary public issues (IPOs), secondary exchange markets, or Corporate Bond Mutual Funds.",
      },
      {
        question: "Are corporate bonds safe?",
        answer:
          "Corporate bonds carry credit risk, market risk, and interest rate risk. AAA-rated bonds from top-tier institutions have historically demonstrated extremely low default rates, whereas sub-investment grade (high-yield) debentures carry greater default risks.",
      },
      {
        question: "Do corporate bonds pay monthly interest?",
        answer:
          "Some corporate bond issues provide monthly payout options, though the vast majority distribute interest coupons semi-annually or annually. Corporate bond mutual funds offering SWP allow you to create customized monthly cash flows.",
      },
      {
        question: "What happens when a bond reaches maturity?",
        answer:
          "On the maturity date, the issuing corporation repays the entire principal face value back to the bondholder, along with the final accrued interest payment, closing the debenture contract.",
      },
      {
        question: "How are corporate bonds taxed in India?",
        answer:
          "Interest received from corporate bonds is taxed as per your applicable income tax slab rate. For debt mutual funds purchased after April 1, 2023, capital gains are also taxed at the investor's marginal income tax slab. Listed bonds held directly for more than 12 months are subject to 12.5% Long-Term Capital Gains (LTCG) tax without indexation.",
      },
    ],
    relatedPostIds: [
      "top-equity-mutual-funds-2026",
      "sip-vs-lumpsum-wealth-guide",
      "nifty-50-rallies-fii-inflows",
      "nri-taxation-fema-rules-guide",
    ],
  },
  {
    id: "top-equity-mutual-funds-2026",
    title: "Top Equity Mutual Funds to Invest in India 2026: Wealth Creation Playbook",
    summary:
      "A comprehensive review of India's leading large-cap, flexi-cap, and balanced advantage mutual funds. Compare historical alpha, expense ratios, and portfolio resilience across market cycles.",
    date: "25 September 2026",
    readTime: "8 min read",
    category: "Mutual Funds",
    categorySlug: "mutual-funds",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Arjun Nair",
      role: "Mutual Fund Research Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["Mutual Funds", "Equity", "SIP", "Large Cap", "Flexi Cap"],
    content: [
      {
        heading: "The Indian Equity Growth Trajectory",
        body: [
          "India's mutual fund industry has crossed unprecedented assets under management (AUM) benchmarks, powered by over ₹23,000 crore in disciplined monthly SIP inflows. Selecting the right equity funds requires analyzing fund manager alpha consistency, portfolio downside protection, and expense efficiency rather than simply chasing past 1-year returns.",
        ],
      },
      {
        heading: "Core Portfolio Recommendations: Large & Flexi Cap Leaders",
        body: [
          "For long-term investors aiming to build substantial retirement or child education corpuses, keeping 60-70% of equity exposure in well-diversified large-cap and flexi-cap funds provides stable compounding with controlled volatility.",
        ],
        bullets: [
          "Parag Parikh Flexi Cap Fund: Renowned for value-oriented stock picking and prudent cash holding during market euphoria.",
          "ICICI Prudential Bluechip Fund: Consistent market-leading large cap vehicle with disciplined sector exposure.",
          "HDFC Mid-Cap Opportunities Fund: Quality mid-sized business exposure with strong operating cashflows.",
        ],
      },
    ],
    relatedPostIds: ["how-corporate-bonds-work", "sip-vs-lumpsum-wealth-guide"],
  },
  {
    id: "sip-vs-lumpsum-wealth-guide",
    title: "SIP vs Lumpsum: Which Strategy Delivers Maximum Compounding Wealth?",
    summary:
      "Rupee cost averaging versus full upfront capital compounding. Discover the exact market conditions where SIP outperforms, and how hybrid STP strategies protect your investments.",
    date: "24 September 2026",
    readTime: "6 min read",
    category: "SIP & Wealth",
    categorySlug: "sip-wealth",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Priya Sharma",
      role: "Senior Wealth Strategist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["SIP", "Lumpsum", "Compounding", "Calculators", "Personal Finance"],
    content: [
      {
        heading: "The Great Investment Dilemma",
        body: [
          "Should you invest a lump sum all at once or deploy capital systematically each month through a Systematic Investment Plan (SIP)? Both strategies carry powerful compounding advantages depending on your cash flow profile and current market valuations.",
        ],
      },
      {
        heading: "The Mathematical Advantage of Rupee Cost Averaging",
        body: [
          "A monthly SIP automatically buys more mutual fund units when markets drop and fewer units when markets rise, systematically lowering your average acquisition cost without requiring market timing.",
        ],
      },
    ],
    relatedPostIds: ["how-corporate-bonds-work", "top-equity-mutual-funds-2026"],
  },
  {
    id: "nifty-50-rallies-fii-inflows",
    title: "Nifty 50 Rallies on Strong FII Inflows: What It Means for Your SIP",
    summary:
      "Foreign institutional investors inject fresh liquidity into Indian blue-chips. Why staying invested through all-time highs yields superior multi-decade returns.",
    date: "25 September 2026",
    readTime: "3 min read",
    category: "Markets",
    categorySlug: "markets",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Michael Roberts",
      role: "Macro Market Analyst",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["Markets", "Nifty 50", "Sensex", "FII Inflows", "Economy"],
    content: [
      {
        heading: "Institutional Liquidity Surge",
        body: [
          "Indian benchmark indices reached record territory supported by sustained foreign portfolio investor purchases and steady domestic institutional buying. Economic indicators continue to reflect resilient corporate earnings and strong capital expenditure.",
        ],
      },
    ],
    relatedPostIds: ["top-equity-mutual-funds-2026", "how-corporate-bonds-work"],
  },
  {
    id: "nri-taxation-fema-rules-guide",
    title: "FEMA Rules for NRIs: NRE vs NRO Accounts & Repatriation Demystified",
    summary:
      "Crucial regulations every Non-Resident Indian and maritime seafarer must understand before investing in Indian mutual funds, equities, and property.",
    date: "23 September 2026",
    readTime: "5 min read",
    category: "NRI & Seafarers",
    categorySlug: "nri-tax",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Amit Verma",
      role: "NRI Tax & Wealth Consultant",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["NRI", "NRE", "NRO", "FEMA", "Tax", "Seafarers"],
    content: [
      {
        heading: "Essential FEMA Account Distinctions",
        body: [
          "Under the Foreign Exchange Management Act (FEMA), Non-Resident Indians cannot hold regular resident savings accounts. Transferring funds between NRE (repatriable, tax-free interest) and NRO (local income, subject to withholding tax) requires structured planning.",
        ],
      },
    ],
    relatedPostIds: ["how-corporate-bonds-work", "sip-vs-lumpsum-wealth-guide"],
  },
  {
    id: "gold-mcx-historic-rally-hedge",
    title: "Gold MCX Hits Historic Highs: Central Bank Accumulation and Your Asset Allocation",
    summary:
      "Physical gold benchmarks surge as global central banks diversify foreign exchange reserves. How to hold sovereign gold bonds and gold ETFs in a modern portfolio.",
    date: "22 September 2026",
    readTime: "4 min read",
    category: "Commodities",
    categorySlug: "commodities",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Sanjay Gupta",
      role: "Precious Metals Specialist",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["Gold", "Commodities", "SGB", "Inflation Hedge", "Precious Metals"],
    content: [
      {
        heading: "Global Safe-Haven Demand",
        body: [
          "Central bank gold purchases have maintained historic intensity as institutions seek to hedge geopolitical uncertainty. Wealth managers continue to recommend holding 5% to 10% of portfolio value in sovereign gold bonds or gold ETFs for purchasing power preservation.",
        ],
      },
    ],
    relatedPostIds: ["how-corporate-bonds-work", "top-equity-mutual-funds-2026"],
  },
  {
    id: "nityas-gems-jewellery-ipo-details",
    title: "Nityas Gems & Jewellery IPO to Open on September 30, 2026: Check Price Band, Issue Size & Key Details",
    summary:
      "Key issue parameters, price band, valuation multiples, and business prospects of the upcoming retail gems and jewellery public issue.",
    date: "25 September 2026",
    readTime: "3 min read",
    category: "News",
    categorySlug: "news",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Sneha Desai",
      role: "IPO & Capital Markets Desk",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["IPO", "News", "Gems", "Primary Market", "Stocks"],
    content: [
      {
        heading: "Issue Overview",
        body: [
          "The upcoming initial public offering aims to raise growth capital to expand modern retail showrooms and bolster working capital inventory across tier-1 and tier-2 cities.",
        ],
      },
    ],
    relatedPostIds: ["how-corporate-bonds-work", "nifty-50-rallies-fii-inflows"],
  },
  {
    id: "elevate-campuses-ipo-day-3",
    title: "Elevate Campuses IPO Day 3: Subscription Status, Timeline & Key Issue Details",
    summary:
      "Final day bidding numbers for the education infrastructure specialist. Institutional and retail quota oversubscription metrics analyzed.",
    date: "25 September 2026",
    readTime: "2 min read",
    category: "News",
    categorySlug: "news",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Sneha Desai",
      role: "IPO & Capital Markets Desk",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["IPO", "News", "Education", "Primary Market"],
    content: [
      {
        heading: "Subscription Momentum",
        body: [
          "Elevate Campuses witnessed substantial interest from Non-Institutional Investors (NII) and Qualified Institutional Buyers (QIB), pushing total book subscription past 18 times on Day 3.",
        ],
      },
    ],
    relatedPostIds: ["nityas-gems-jewellery-ipo-details", "how-corporate-bonds-work"],
  },
  {
    id: "swastika-infra-ipo-day-3",
    title: "Swastika Infra IPO Day 3: Subscription Status, Timeline & Key Issue Details",
    summary:
      "Infrastructure development player sees strong institutional participation as order book expansion underscores domestic capex momentum.",
    date: "25 September 2026",
    readTime: "2 min read",
    category: "News",
    categorySlug: "news",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Rajesh Menon",
      role: "Infrastructure Research",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["IPO", "Infrastructure", "News", "Capex"],
    content: [
      {
        heading: "Final Subscription Figures",
        body: [
          "Bidding closed strongly across retail and institutional categories, backed by government highways and civil infrastructure contract visibility.",
        ],
      },
    ],
    relatedPostIds: ["elevate-campuses-ipo-day-3", "how-corporate-bonds-work"],
  },
  {
    id: "armee-infotech-ipo-day-3",
    title: "ArMee Infotech IPO Day 3: Subscription Status, Timeline & Key Issue Details",
    summary:
      "Enterprise systems integrator concludes its public issue with heavy demand from technology sector investors and tech family offices.",
    date: "25 September 2026",
    readTime: "2 min read",
    category: "News",
    categorySlug: "news",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Deepak Mishra",
      role: "Tech Equity Analyst",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["IPO", "Technology", "News", "IT Services"],
    content: [
      {
        heading: "Final Day Bidding Performance",
        body: [
          "The enterprise technology solutions provider closed its book successfully, with QIB participation driving strong oversubscription in the closing hours.",
        ],
      },
    ],
    relatedPostIds: ["swastika-infra-ipo-day-3", "how-corporate-bonds-work"],
  },
];
