// Actuarial SIP & Financial Compounding Engine conforming to FinCalculator public API standards
// Provides instant client/server calculation without latency or rate limiting.

export interface SipCalculationParams {
  monthlyInvestment: number;
  expectedReturnRate: number; // e.g. 12 for 12%
  tenureYears: number;
  stepUpPercent?: number; // e.g. 10 for 10% annual increase
}

export interface SipCalculationResult {
  monthlyInvestment: number;
  expectedReturnRate: number;
  tenureYears: number;
  totalInvested: number;
  compoundingGains: number;
  futureValue: number;
  wealthMultiplier: number;
  realPurchasingPower: number; // at 6% inflation
  yearlyProgression: {
    year: number;
    invested: number;
    value: number;
    gains: number;
  }[];
}

export interface LoanVsSipParams {
  loanPrincipal: number;
  loanInterestRate: number;
  loanTenureYears: number;
  extraPrepaymentPerMonth: number;
  sipReturnRate: number;
}

export interface LoanVsSipResult {
  loanEmi: number;
  loanTotalInterest: number;
  prepaymentInterestSaved: number;
  prepaymentTenureReducedMonths: number;
  sipCorpusCreated: number;
  recommendedOption: "invest_sip" | "prepay_loan";
  summaryText: string;
}

/**
 * Calculate standard or Step-Up Systematic Investment Plan (SIP)
 */
export function calculateSip(params: SipCalculationParams): SipCalculationResult {
  const { monthlyInvestment, expectedReturnRate, tenureYears, stepUpPercent = 0 } = params;
  const monthlyRate = expectedReturnRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  let totalInvested = 0;
  let futureValue = 0;
  let currentMonthly = monthlyInvestment;
  const yearlyProgression: { year: number; invested: number; value: number; gains: number }[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    totalInvested += currentMonthly;
    futureValue = (futureValue + currentMonthly) * (1 + monthlyRate);

    // End of year check
    if (m % 12 === 0) {
      const year = m / 12;
      yearlyProgression.push({
        year,
        invested: Math.round(totalInvested),
        value: Math.round(futureValue),
        gains: Math.round(futureValue - totalInvested),
      });

      // Annual step up
      if (stepUpPercent > 0) {
        currentMonthly = currentMonthly * (1 + stepUpPercent / 100);
      }
    }
  }

  const compoundingGains = Math.max(0, futureValue - totalInvested);
  const wealthMultiplier = totalInvested > 0 ? futureValue / totalInvested : 1;
  const realPurchasingPower = futureValue / Math.pow(1.06, tenureYears);

  return {
    monthlyInvestment,
    expectedReturnRate,
    tenureYears,
    totalInvested: Math.round(totalInvested),
    compoundingGains: Math.round(compoundingGains),
    futureValue: Math.round(futureValue),
    wealthMultiplier: Math.round(wealthMultiplier * 100) / 100,
    realPurchasingPower: Math.round(realPurchasingPower),
    yearlyProgression,
  };
}

/**
 * Calculate Home Loan Prepayment vs. Equity SIP Comparison
 */
export function calculateLoanVsSip(params: LoanVsSipParams): LoanVsSipResult {
  const { loanPrincipal, loanInterestRate, loanTenureYears, extraPrepaymentPerMonth, sipReturnRate } = params;

  const monthlyLoanRate = loanInterestRate / 100 / 12;
  const totalMonths = loanTenureYears * 12;

  // Standard EMI: P * r * (1+r)^n / ((1+r)^n - 1)
  const factor = Math.pow(1 + monthlyLoanRate, totalMonths);
  const emi = (loanPrincipal * monthlyLoanRate * factor) / (factor - 1);
  const totalLoanPaid = emi * totalMonths;
  const totalLoanInterest = totalLoanPaid - loanPrincipal;

  // Prepayment simulation
  let balance = loanPrincipal;
  let monthsWithPrepay = 0;
  let totalInterestWithPrepay = 0;

  while (balance > 0 && monthsWithPrepay < totalMonths) {
    monthsWithPrepay++;
    const interest = balance * monthlyLoanRate;
    totalInterestWithPrepay += interest;
    const principalPaid = Math.min(balance, emi - interest + extraPrepaymentPerMonth);
    balance -= principalPaid;
  }

  const interestSaved = Math.max(0, totalLoanInterest - totalInterestWithPrepay);
  const tenureReducedMonths = Math.max(0, totalMonths - monthsWithPrepay);

  // SIP simulation with extra amount
  const sipRes = calculateSip({
    monthlyInvestment: extraPrepaymentPerMonth,
    expectedReturnRate: sipReturnRate,
    tenureYears: loanTenureYears,
  });

  const recommendedOption = sipRes.futureValue > interestSaved ? "invest_sip" : "prepay_loan";
  const netAdvantage = Math.abs(sipRes.futureValue - interestSaved);

  const summaryText =
    recommendedOption === "invest_sip"
      ? `Investing ₹${extraPrepaymentPerMonth.toLocaleString("en-IN")}/month in an equity SIP creates ₹${Math.round(sipRes.futureValue).toLocaleString("en-IN")}, outperforming loan prepayment interest savings by ₹${Math.round(netAdvantage).toLocaleString("en-IN")}.`
      : `Prepaying your loan saves ₹${Math.round(interestSaved).toLocaleString("en-IN")} in guaranteed interest costs and cuts your loan tenure by ${Math.floor(tenureReducedMonths / 12)} years.`;

  return {
    loanEmi: Math.round(emi),
    loanTotalInterest: Math.round(totalLoanInterest),
    prepaymentInterestSaved: Math.round(interestSaved),
    prepaymentTenureReducedMonths: tenureReducedMonths,
    sipCorpusCreated: sipRes.futureValue,
    recommendedOption,
    summaryText,
  };
}
