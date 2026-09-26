export interface TopicStory {
  title: string;
  character: string;
  context: string;
  dilemma: string;
  choiceMade: string;
  outcome: string;
  moral: string;
}

export interface TopicAnalogy {
  headline: string;
  metaphor: string;
  explanation: string;
  iconType: "rocket" | "shield" | "tree" | "snowball" | "anchor" | "compass" | "scale" | "magnet" | "factory" | "traffic";
}

export interface TopicFunFact {
  tag: string;
  fact: string;
  sourceOrStat?: string;
}

export interface TopicDilemmaOption {
  text: string;
  outcome: string;
  isOptimal: boolean;
}

export interface TopicInteractiveDilemma {
  question: string;
  scenario: string;
  options: TopicDilemmaOption[];
  explanation: string;
}

export interface TopicStoryData {
  story: TopicStory;
  analogy: TopicAnalogy;
  funFact: TopicFunFact;
  interactiveDilemma: TopicInteractiveDilemma;
}

export const TOPIC_STORIES: Record<string, TopicStoryData> = {
  "What is investing?": {
    story: {
      title: "The Tale of the Two Mango Farmers",
      character: "Rohan and Kabir (28-year-old college batchmates)",
      context: "In 2014, both Rohan and Kabir received a ₹5 Lakh annual bonus from their tech jobs.",
      dilemma: "Kabir kept his ₹5 Lakh safely locked in a fixed savings account earning 3.5%, feeling 100% secure. Rohan bought shares of growing, productive Indian businesses and diversified mutual funds.",
      choiceMade: "Kabir avoided all volatility. Rohan committed his capital into productive commercial enterprises producing goods, services, and corporate profits.",
      outcome: "10 years later (2024), Kabir had ₹7.1 Lakhs, but inflation had doubled living costs—his money bought far less than in 2014. Rohan's productive portfolio grew to over ₹19.8 Lakhs (14.7% CAGR), quadrupling his true purchasing power.",
      moral: "Money sitting idle is like seeds kept in a glass jar. Investing is planting those seeds in fertile soil so they grow into an orchard that feeds you forever."
    },
    analogy: {
      headline: "The Fuel in the Engine",
      metaphor: "Putting money to work vs keeping it in a dormant state",
      explanation: "Holding cash is like keeping a sports car parked in the garage where the battery slowly dies. Investing is putting fuel in the tank and driving toward your destination.",
      iconType: "rocket"
    },
    funFact: {
      tag: "Historical Power",
      fact: "If an investor invested ₹10,000 in the Indian equity benchmark Sensex in 1979 at base 100, that ₹10,000 grew to over ₹75,00,000 (₹75 Lakhs) by 2024!",
      sourceOrStat: "BSE Sensex 45-Year Historical Performance"
    },
    interactiveDilemma: {
      question: "You receive an unexpected ₹50,000 bonus today. What is the most financially productive move?",
      scenario: "You have an emergency reserve already saved and your next major financial goal is 8 years away.",
      options: [
        {
          text: "Keep it in your primary bank savings account so you can see the balance daily.",
          outcome: "At 3% savings interest vs 6% inflation, you lose 3% real wealth every single year silently.",
          isOptimal: false
        },
        {
          text: "Invest in a diversified equity mutual fund suited for an 8-year horizon.",
          outcome: "Excellent! Over 8 years, Indian equity funds have historically compounded wealth well ahead of inflation.",
          isOptimal: true
        },
        {
          text: "Spend it all immediately because tomorrow is never promised.",
          outcome: "Fun in the moment, but sacrifices future freedom and compounding momentum.",
          isOptimal: false
        }
      ],
      explanation: "Investing productive surplus into long-term wealth vehicles ensures your future self has choices and financial freedom."
    }
  },

  "Compounding (The 8th Wonder)": {
    story: {
      title: "Priya vs. Kunal: The 10-Year Head Start",
      character: "Priya (age 22) and Kunal (age 32)",
      context: "Priya started investing ₹10,000 every month at age 22. She stopped completely at age 32 (invested only for 10 years = ₹12 Lakhs total) and let it grow untouched until age 60.",
      dilemma: "Kunal waited until age 32 to start, then invested ₹10,000 every month for 28 straight years until age 60 (invested ₹33.6 Lakhs total, almost 3x Priya's money!).",
      choiceMade: "Priya used early time; Kunal tried to compensate with later cash volume.",
      outcome: "At 12% annual return, by age 60, Kunal accumulated ₹2.71 Crores. But Priya—who invested for only 10 early years—amassed a staggering ₹3.42 Crores! Priya ended with ₹71 Lakhs MORE despite investing ₹21 Lakhs LESS.",
      moral: "Time in the market beats timing the market. In compounding, the earliest rupees you invest do the heaviest lifting in your lifetime."
    },
    analogy: {
      headline: "The Himalayan Snowball",
      metaphor: "A snowball rolling down a very long slope",
      explanation: "At the top of the mountain, the snowball grows by tiny pinches. But as it rolls down a 30-year slope, each single turn picks up massive boulders of snow without any extra effort.",
      iconType: "snowball"
    },
    funFact: {
      tag: "Buffett's Secret",
      fact: "Over 99% of Warren Buffett's multi-billion dollar net worth was created after his 50th birthday. His true superpower was simply not interrupting compounding for 75+ continuous years!",
      sourceOrStat: "Berkshire Hathaway Shareholder Data"
    },
    interactiveDilemma: {
      question: "Which option would you rather choose today?",
      scenario: "A generous billionaire offers you two payment choices:",
      options: [
        {
          text: "₹1 Crore in cash right now in your hands.",
          outcome: "Instant gratification! But ₹1 Crore stays ₹1 Crore unless compounded.",
          isOptimal: false
        },
        {
          text: "A 1 Rupee coin that doubles in value every day for 31 days.",
          outcome: "Mind-blowing math! On day 31, that 1 Rupee becomes over ₹107 Crores (₹1,073,741,824)! That is pure compounding.",
          isOptimal: true
        }
      ],
      explanation: "Exponential compounding starts invisibly slow, but in later phases, the curve turns into an unstoppable vertical rocket."
    }
  },

  "Inflation and purchasing power": {
    story: {
      title: "The Mystery of Grandfather's ₹100 Note",
      character: "Vikram and his grandfather Ramesh",
      context: "In 1975, Ramesh tucked a crisp ₹100 note inside a holy book in his cupboard for 'safe keeping'. In 1975, ₹100 could buy 50 liters of milk or a whole family's groceries for a month.",
      dilemma: "In 2025, Vikram discovered that exact ₹100 note in pristine condition. The nominal value was still exactly ₹100.",
      choiceMade: "The money was kept 100% safe from market risk, theft, and loss of principal.",
      outcome: "When Vikram took it to the grocery store in 2025, that ₹100 could barely buy one and a half liters of milk. The note lost over 95% of its real purchasing power without a single rupee ever being stolen.",
      moral: "The biggest hidden risk in finance is not market volatility; it is the silent termite called Inflation that eats the meat inside your coconut while leaving the shell intact."
    },
    analogy: {
      headline: "The Upward Moving Escalator",
      metaphor: "Walking down an escalator that is running up",
      explanation: "If you stand still (cash under the bed), you move backwards. If you walk slowly (low interest savings), you stay in place. You must jog forward (investing in productive equity/assets) just to make real ground.",
      iconType: "scale"
    },
    funFact: {
      tag: "The Rule of 72",
      fact: "At an average retail inflation rate of 6% per year, the price of everything you buy doubles every 12 years (72 ÷ 6 = 12). A ₹1 Lakh monthly lifestyle today will cost ₹4 Lakhs/month in 24 years!",
      sourceOrStat: "RBI Inflation Analytics"
    },
    interactiveDilemma: {
      question: "If your bank savings account pays 4% interest, but annual inflation is 6.5%, what is your real annual return?",
      scenario: "You have ₹10 Lakhs parked for 5 years.",
      options: [
        {
          text: "+4.0% gain (since the bank account balance increases).",
          outcome: "Incorrect! Nominal gain ignores the increased cost of living.",
          isOptimal: false
        },
        {
          text: "-2.5% real loss in actual purchasing power every year.",
          outcome: "Spot on! You are losing 2.5% of your true buying power annually despite your bank balance increasing.",
          isOptimal: true
        },
        {
          text: "+2.5% net profit.",
          outcome: "Incorrect. Inflation is higher than the interest rate.",
          isOptimal: false
        }
      ],
      explanation: "Always evaluate returns in REAL terms (Nominal Return minus Inflation minus Taxes)."
    }
  },

  "SIP during Market Crash": {
    story: {
      title: "March 2020: The Panic vs. The Fortunate Fortitude",
      character: "Arjun (The Reactor) vs. Maya (The Automator)",
      context: "In March 2020, the COVID-19 pandemic struck. The Nifty crashed by 38% in less than 30 days, causing widespread global panic.",
      dilemma: "Arjun panicked as his portfolio turned deep red. He paused his ₹25,000 monthly SIP and withdrew his money, waiting for 'markets to settle'. Maya kept her automated SIP running without checking the daily news.",
      choiceMade: "Arjun tried to time the bottom. Maya allowed her fixed monthly SIP to automatically buy units at rock-bottom NAVs.",
      outcome: "When markets rebounded violently over the next 18 months, Arjun missed the sharpest recovery days and bought back near peak levels. Maya's March, April, and May 2020 SIP instalments generated explosive 180%+ returns, elevating her net worth permanently.",
      moral: "Market crashes are not disasters for an ongoing SIP investor; they are the Black Friday discount sales where you accumulate maximum wealth units at 40% off."
    },
    analogy: {
      headline: "The Grocery Store Flash Sale",
      metaphor: "Buying top-grade apples when the market drops prices by half",
      explanation: "When your favorite brand announces a 50% discount sale, you celebrate and buy extra. In mutual funds, a market crash is just high-quality corporate assets on a clearance discount.",
      iconType: "anchor"
    },
    funFact: {
      tag: "Crash Math",
      fact: "During the 2008 Global Financial Crisis, Nifty fell ~60%. An investor who continued an equity SIP throughout 2008–2010 was generating a massive 16.5% CAGR over the next 7-year cycle!",
      sourceOrStat: "NSE Historic Rolling SIP Analysis"
    },
    interactiveDilemma: {
      question: "The stock market just crashed 25% this month due to geopolitical tensions. Your ₹15,000 monthly SIP is due in 3 days. What should you do?",
      scenario: "You have your job, stable salary, and 6 months of emergency cash in bank.",
      options: [
        {
          text: "Stop the SIP and sell all funds before it drops another 10%.",
          outcome: "Panic selling locks in a paper loss and guarantees you will miss the recovery.",
          isOptimal: false
        },
        {
          text: "Continue the SIP as scheduled (or even top-up if you have spare surplus).",
          outcome: "Brilliant! You will acquire significantly more mutual fund units at deeply discounted NAVs.",
          isOptimal: true
        },
        {
          text: "Pause for 6 months and restart once headlines say 'all clear'.",
          outcome: "By the time headlines turn optimistic, markets are already back at new all-time highs.",
          isOptimal: false
        }
      ],
      explanation: "SIP discipline works precisely because it takes emotional timing out of your hands when fear is highest."
    }
  },

  "Large Cap": {
    story: {
      title: "The Ocean Liner in Choppy Waters",
      character: "Deepak (35, father of two)",
      context: "Deepak wanted to invest ₹5 Lakhs for his family's medium-term milestone 5 years away, but couldn't stomach the stomach-churning 50% drops of speculative stocks.",
      dilemma: "His friend suggested penny stocks promising 10x returns. Deepak chose an established Large-Cap Index fund holding India's top 100 industrial giants (TCS, HDFC Bank, Reliance, Infosys).",
      choiceMade: "He chose stability, governance excellence, and proven market dominance over hype.",
      outcome: "During the market turbulence of 2022, small speculative stocks plunged 40-70%. Deepak's large-cap portfolio dipped only 8% and quickly rebounded, comfortably compounding at 12.8% per year with peaceful nights of sleep.",
      moral: "Large caps are the blue-chip backbone of India's economy. They may not double overnight, but they rarely sink in heavy weather."
    },
    analogy: {
      headline: "The Titanic vs The Speedboat",
      metaphor: "An ocean liner with thick hulls vs a nimble speedboat",
      explanation: "In calm waters, a speedboat zooms faster. But when a storm hits the high seas, you want the massive, unsinkable ocean liner with world-class stabilizers and deep reserves.",
      iconType: "shield"
    },
    funFact: {
      tag: "SEBI Rule",
      fact: "Under SEBI categorization, Large Cap schemes MUST invest at least 80% of their total assets in the Top 100 companies by market capitalization on Indian exchanges.",
      sourceOrStat: "SEBI Mutual Fund Categorization Circular"
    },
    interactiveDilemma: {
      question: "Which investor profile is best suited for a Large-Cap fund as their core holding?",
      scenario: "Choosing the right fund category for a specific risk-return goal.",
      options: [
        {
          text: "An investor seeking 100% risk-free guaranteed fixed returns like a post office scheme.",
          outcome: "Large caps are still market-linked equity and can fluctuate in the short term.",
          isOptimal: false
        },
        {
          text: "An investor wanting steady equity growth (5+ years horizon) with lower volatility than small caps.",
          outcome: "Correct! Large caps offer the sweet spot of market leadership, liquidity, and resilience.",
          isOptimal: true
        },
        {
          text: "Someone looking to double their money in 6 months.",
          outcome: "Unrealistic expectation that usually leads to high-risk gambling.",
          isOptimal: false
        }
      ],
      explanation: "Large cap funds form the resilient foundational anchor of almost every disciplined investor's portfolio."
    }
  },

  "Direct vs Regular Plans": {
    story: {
      title: "The Silent 1% Commission Leak",
      character: "Suresh and Naresh (Brothers investing ₹25,000/month for 25 years)",
      context: "In 2000, both brothers picked the exact same Flexi-Cap fund. Suresh chose the 'Regular Plan' through a local broker. Naresh chose the 'Direct Plan' directly on the AMC portal.",
      dilemma: "Both had the identical portfolio manager, bought the same stocks on the same dates, and held for 25 years.",
      choiceMade: "The only difference: Regular Plan had a 1.8% expense ratio; Direct Plan had a 0.8% expense ratio (a 1% distributor commission difference).",
      outcome: "After 25 years, Suresh's Regular portfolio reached ₹4.20 Crores. Naresh's Direct portfolio reached ₹5.15 Crores! That tiny 1% annual difference cost Suresh nearly ₹95 LAKHS in lost compounding wealth!",
      moral: "In compounding, a 1% annual fee difference is not a 1% difference in final wealth; over decades, it can eat 20% to 30% of your total lifetime retirement corpus."
    },
    analogy: {
      headline: "The Slow Drip in the Water Tank",
      metaphor: "A 1 millimeter pinhole leak at the bottom of a massive rooftop tank",
      explanation: "On day one, a few drops look harmless. Over 20 years, that tiny pinhole drains thousands of liters of clean water while the tank owner wonders why the level never reached the top.",
      iconType: "magnet"
    },
    funFact: {
      tag: "SEBI Reform",
      fact: "SEBI introduced Direct Plans on January 1, 2013, mandating AMCs to offer commission-free plans with separate lower expense ratios and separate NAVs for self-directed investors.",
      sourceOrStat: "SEBI Directive Jan 2013"
    },
    interactiveDilemma: {
      question: "You are selecting between 'HDFC Top 100 - Regular Plan' (Expense Ratio 1.75%) and 'HDFC Top 100 - Direct Plan' (Expense Ratio 0.85%). Which one delivers higher returns over time?",
      scenario: "You do your own research and manage your own portfolio without distributor advisory.",
      options: [
        {
          text: "Regular Plan because the higher fee means the manager works harder.",
          outcome: "False! The fund manager is identical; the extra fee goes to broker commissions.",
          isOptimal: false
        },
        {
          text: "Direct Plan because lower expenses stay in your NAV and compound directly for you.",
          outcome: "Correct! The lower expense ratio translates directly into higher NAV growth year after year.",
          isOptimal: true
        }
      ],
      explanation: "For independent investors, Direct plans offer pure, unburdened compounding with zero intermediary commission drag."
    }
  },

  "Emergency fund": {
    story: {
      title: "When the Unexpected Knocked at the Door",
      character: "Neha (31, Marketing Director)",
      context: "In 2023, Neha suddenly faced an emergency medical surgery for her mother costing ₹4.5 Lakhs while the stock market was in a sharp 12% correction.",
      dilemma: "Her colleague Ankit had all his money locked in high-risk equity funds and was forced to sell stocks at a 15% loss to pay medical bills. Neha had kept 6 months of living expenses in an Ultra-Short / Liquid Fund.",
      choiceMade: "Neha tapped her dedicated Emergency Liquid Fund within 24 hours with zero exit load and zero equity loss.",
      outcome: "Her long-term equity mutual funds continued compounding uninterrupted through the recovery, while Ankit permanently lost capital and interrupted his retirement goal.",
      moral: "An emergency fund is not an investment to make you rich; it is the financial shock absorber that protects your real wealth-generating engines from being cannibalized."
    },
    analogy: {
      headline: "The Spare Tire in the Trunk",
      metaphor: "Driving across a highway with a reliable spare wheel",
      explanation: "You hope you never get a flat tire on a rainy highway at night. But having the spare tire means a blowout is a 20-minute inconvenience rather than a trip-ending catastrophe.",
      iconType: "shield"
    },
    funFact: {
      tag: "Golden Rule",
      fact: "Financial planners recommend keeping 3 to 6 months of mandatory household expenses (rent, EMIs, food, insurance, utilities) in a safe, instantly redeemable Liquid Mutual Fund or high-yield sweep account.",
      sourceOrStat: "Solid Wealth Financial Advisory Standard"
    },
    interactiveDilemma: {
      question: "Where should your 6-month emergency reserve be stored?",
      scenario: "You need safe, quick access with near-zero principal loss risk within 24 to 48 hours.",
      options: [
        {
          text: "In a Small-Cap equity fund for maximum growth potential.",
          outcome: "Dangerous! If an emergency hits during a 30% market crash, you are forced to sell at the worst possible time.",
          isOptimal: false
        },
        {
          text: "In a combination of a high-interest savings account and a high-quality Liquid / Overnight Mutual Fund.",
          outcome: "Spot on! High liquidity, rock-solid capital safety, and zero equity market volatility.",
          isOptimal: true
        },
        {
          text: "In physical gold jewelry stored in a bank locker.",
          outcome: "Illiquid and carries making charges and emotional friction when selling.",
          isOptimal: false
        }
      ],
      explanation: "Emergency funds prioritize liquidity and absolute safety over return."
    }
  },
  "Saving vs Investing": {
    story: {
      title: "The Shield vs The Sword",
      character: "Ananya and Varun (Siblings entering the workforce)",
      context: "Ananya believed keeping all her money in savings accounts was the safest strategy. Varun realized that without growth, savings get dissolved by inflation.",
      dilemma: "Should you keep 100% of your earnings in savings, or take measured market risk to build real wealth?",
      choiceMade: "They learned to assign different roles: Ananya's savings became the 'Shield' (protecting immediate 6-month emergencies), while Varun built the 'Sword' (long-term equity mutual funds fighting inflation).",
      outcome: "Together, their balanced strategy gave them instant liquidity for life surprises and massive 14% compounding growth on their 10-year home-buying fund.",
      moral: "Saving defends your present; Investing conquers your future. A master wealth builder needs both the shield and the sword."
    },
    analogy: {
      headline: "The Oxygen Tank vs The Glider",
      metaphor: "Safety equipment vs vehicle for flight",
      explanation: "Saving is your oxygen tank—essential for survival when underwater. Investing is your glider—designed to lift you high into the sky above the clouds.",
      iconType: "shield"
    },
    funFact: {
      tag: "Hidden Cost",
      fact: "If you save ₹10,000 every month in a bank account at 3% interest for 20 years, you accumulate ₹32.8 Lakhs. If you invest the same ₹10,000/month in equity funds at 12%, you accumulate ₹99.9 LAKHS—over 3x more wealth!",
      sourceOrStat: "Compound Growth Differential Analysis"
    },
    interactiveDilemma: {
      question: "You have a goal to buy a car in 10 months and retire in 20 years. How should your money be split?",
      scenario: "Allocating funds between Saving and Investing.",
      options: [
        {
          text: "Put all money for both goals in high-risk small cap equity funds.",
          outcome: "Too risky! Your 10-month car fund could drop 20% right when you need to pay the dealer.",
          isOptimal: false
        },
        {
          text: "Save the 10-month car fund in safe Liquid/FDs; invest the 20-year retirement fund in equity mutual funds.",
          outcome: "Perfect! Short-term money stays safe; long-term money compounds aggressively.",
          isOptimal: true
        },
        {
          text: "Keep both goals in cash under your mattress.",
          outcome: "Guaranteed to lose purchasing power to inflation over 20 years.",
          isOptimal: false
        }
      ],
      explanation: "Time horizon determines whether money belongs in savings or investments."
    }
  },

  "Risk vs Reward": {
    story: {
      title: "The Golden Mango at the Top of the Tree",
      character: "Tanmay (24-year-old aspiring entrepreneur)",
      context: "Tanmay wanted the highest possible returns on his ₹2 Lakhs savings and was tempted by an unregulated crypto scheme promising 'guaranteed 50% monthly returns'.",
      dilemma: "A senior mentor showed him the immutable law of finance: Extraordinary returns cannot exist without extraordinary risk of total loss.",
      choiceMade: "Tanmay avoided the get-rich-quick trap and allocated into regulated, transparent mutual funds offering realistic 12-14% CAGR.",
      outcome: "The shady crypto scheme collapsed within 4 months, wiping out all investors. Tanmay's regulated funds steadily compounded, doubling his capital safely every 5.5 years.",
      moral: "In investing, if an opportunity offers high returns with 'zero risk', the hidden risk is 100% loss of your principal."
    },
    analogy: {
      headline: "The Speed Limit on a Curved Mountain Road",
      metaphor: "Driving fast on an open highway vs a dangerous cliff road",
      explanation: "Higher speed gets you there faster, but driving 150 km/h in thick fog around sharp hairpin bends guarantees a crash. Calibrated speed with seatbelts (diversification) gets you to your destination in one piece.",
      iconType: "traffic"
    },
    funFact: {
      tag: "Iron Law of Finance",
      fact: "No regulated asset in human history has ever delivered sustained 30%+ annual returns without massive volatility or catastrophic drawdown risk.",
      sourceOrStat: "Global Capital Markets History"
    },
    interactiveDilemma: {
      question: "An advertisement online promises 'Guaranteed 25% returns in 30 days with Zero Risk'. What should you do?",
      scenario: "Recognizing high-risk scams vs genuine investment vehicles.",
      options: [
        {
          text: "Invest your entire life savings immediately before the offer closes.",
          outcome: "Extremely dangerous. This is a classic Ponzi scheme red flag.",
          isOptimal: false
        },
        {
          text: "Stay away! High returns without risk do not exist in genuine financial markets.",
          outcome: "Smart move! Protecting your principal from scams is rule #1 of wealth creation.",
          isOptimal: true
        }
      ],
      explanation: "Risk and return are two sides of the exact same coin."
    }
  },

  "Small Cap": {
    story: {
      title: "The Rocket Booster with Wild Turbulence",
      character: "Karan (29, high-risk tolerance, 15-year wealth goal)",
      context: "Karan wanted aggressive growth for his long-term financial independence target 15 years away.",
      dilemma: "Small-cap funds can plunge 40% to 50% during bear markets, testing an investor's courage and patience.",
      choiceMade: "Karan allocated 25% of his portfolio to Small-Cap funds via monthly SIP, committing to never look at daily NAVs for at least 7 years.",
      outcome: "Despite deep drawdowns in 2018 and 2020, his small-cap holdings generated a phenomenal 18.4% CAGR over 10 years, dramatically accelerating his retirement milestone.",
      moral: "Small caps are the cheetahs of the mutual fund jungle—explosive in speed, but they require a long runway (7+ years) and iron stomachs to ride the bumps."
    },
    analogy: {
      headline: "The High-Powered Sports Car",
      metaphor: "A twin-turbo sports car on a winding race track",
      explanation: "Small caps can accelerate faster than any vehicle on the road, but you must wear a 5-point harness (long time horizon) and never panic when taking sharp turns.",
      iconType: "rocket"
    },
    funFact: {
      tag: "SEBI Universe",
      fact: "Under SEBI classification, Small Cap funds invest in companies ranked 251st and beyond by market capitalization—giving investors early access to tomorrow's mid-cap and large-cap giants!",
      sourceOrStat: "SEBI Master Circular"
    },
    interactiveDilemma: {
      question: "When is a Small-Cap fund suitable for an investor?",
      scenario: "Evaluating suitability for small cap allocation.",
      options: [
        {
          text: "When you need money for a wedding in 18 months.",
          outcome: "High risk! A cyclical downturn could erase a third of your wedding budget right on time.",
          isOptimal: false
        },
        {
          text: "When you have a 7+ year horizon and can calmly tolerate 30-40% temporary paper fluctuations.",
          outcome: "Spot on! The long horizon gives small caps time to recover and compound explosively.",
          isOptimal: true
        }
      ],
      explanation: "Small caps reward patience and long horizons with superior wealth multipliers."
    }
  },

  "Asset Allocation": {
    story: {
      title: "The 3-Legged Stool of Unshakable Balance",
      character: "Dr. Alok (50, chief surgeon)",
      context: "In 2007, Dr. Alok put 100% of his wealth into high-beta infrastructure stocks. When the 2008 crash hit, his portfolio dropped 65%, delaying his clinic expansion.",
      dilemma: "He realized that putting all eggs in one asset class is an unforced error.",
      choiceMade: "He restructured into a disciplined 60% Equity, 30% Debt, and 10% Gold asset allocation with annual rebalancing.",
      outcome: "During the 2020 crash, when equity dropped, his debt portion stayed rock-solid and gold surged +30%, keeping his total portfolio down by only 10% and allowing him to rebalance into cheap equities.",
      moral: "Asset allocation is the only free lunch in investing. It cushions your falls and ensures you never get wiped out by a single bad storm."
    },
    analogy: {
      headline: "The Weatherproof Wardrobe",
      metaphor: "Carrying both sunglasses and an umbrella when traveling",
      explanation: "If you only pack t-shirts and it rains, you freeze. If you only pack raincoats and it's sunny, you sweat. Having the right mix keeps you comfortable in every season.",
      iconType: "scale"
    },
    funFact: {
      tag: "Nobel Prize Insight",
      fact: "Studies by Brinson, Hood & Beebower showed that over 90% of a portfolio's return variability is determined by Asset Allocation, while individual stock picking accounts for less than 5%!",
      sourceOrStat: "Financial Analysts Journal"
    },
    interactiveDilemma: {
      question: "Why should a balanced portfolio include debt and gold alongside equity?",
      scenario: "Understanding asset class diversification benefits.",
      options: [
        {
          text: "Because debt and gold will always beat equity in the long run.",
          outcome: "False. Equity is historically the primary driver of long-term real growth.",
          isOptimal: false
        },
        {
          text: "Because they act as shock absorbers when equity markets undergo temporary severe corrections.",
          outcome: "Correct! When equities tumble, debt provides liquidity and stability, while gold acts as a safe haven.",
          isOptimal: true
        }
      ],
      explanation: "Diversifying across uncorrelated asset classes creates a resilient, all-weather portfolio."
    }
  }
};

export function getStoryForTopic(topic: string, courseModuleTitle: string, moduleNumber: number): TopicStoryData {
  if (TOPIC_STORIES[topic]) {
    return TOPIC_STORIES[topic];
  }

  // Dynamic contextual story generator for any topic across the 26 modules
  const characterNames = [
    "Rajesh (a 32-year-old software engineer from Bengaluru)",
    "Sneha & Amit (a young couple planning their 10-year life milestones)",
    "Meera (a 45-year-old doctor building her retirement independence)",
    "Kavita (a first-time investor starting her wealth creation journey)",
    "Sanjay (a seasoned business owner organizing his family portfolio)"
  ];
  const chosenCharacter = characterNames[(topic.length + moduleNumber) % characterNames.length];

  return {
    story: {
      title: `Real-World Case: Applying ${topic} in Practice`,
      character: chosenCharacter,
      context: `When setting up their financial roadmap for ${courseModuleTitle.toLowerCase()}, they encountered ${topic} as a pivotal decision point.`,
      dilemma: `Without a clear framework for ${topic}, they risked making emotional, ad-hoc guesses influenced by market noise, social media tips, and short-term panic.`,
      choiceMade: `They adopted a disciplined, evidence-based approach: evaluating historical data, checking risk-return trade-offs, and matching the strategy to a named time horizon.`,
      outcome: `By grounding their decisions in sound principles rather than guesswork, their portfolio navigated market swings smoothly, saving lakhs in avoidable errors and staying on target for their long-term goal.`,
      moral: `Mastering ${topic} replaces financial anxiety with mathematical clarity and structural confidence.`
    },
    analogy: {
      headline: `The Core Metaphor for ${topic}`,
      metaphor: `A structured architectural component in a well-built home`,
      explanation: `Just as an architect doesn't pick roof tiles before laying a reinforced foundation, understanding ${topic} ensures every pillar of your wealth plan supports your family's future safely.`,
      iconType: "compass"
    },
    funFact: {
      tag: "Market Wisdom",
      fact: `Successful wealth creators spend 90% of their time on asset allocation, disciplined process, and emotional control—not chasing hot tips or trying to outsmart tomorrow's headlines.`,
      sourceOrStat: `Journal of Portfolio Management & AMFI Research`
    },
    interactiveDilemma: {
      question: `How should an intelligent investor approach ${topic} in their personal portfolio?`,
      scenario: `You are reviewing your investment plan and deciding how to handle ${topic}.`,
      options: [
        {
          text: `Base your decision strictly on what has gone up the most in the last 6 months.`,
          outcome: `Recency bias trap! Chasing recent winners often leads to buying near cyclical peaks.`,
          isOptimal: false
        },
        {
          text: `Align the decision with your defined goal horizon, risk capacity, and total portfolio asset allocation.`,
          outcome: `Exactly right! Consistency with your personal financial blueprint is the true driver of long-term success.`,
          isOptimal: true
        },
        {
          text: `Change your approach every week whenever you see a new sensational YouTube financial video.`,
          outcome: `Excessive churn and strategy hopping erodes wealth through taxes, exit loads, and bad timing.`,
          isOptimal: false
        }
      ],
      explanation: `Systematic process beats emotional reaction every single time in financial markets.`
    }
  };
}
