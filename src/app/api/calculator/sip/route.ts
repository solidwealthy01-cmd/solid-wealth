import { NextRequest, NextResponse } from "next/server";
import { calculateSip, calculateLoanVsSip } from "@/lib/sip-calculator-engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "sip";

    if (mode === "loan_vs_sip") {
      const loanPrincipal = parseFloat(searchParams.get("loanPrincipal") || "5000000");
      const loanInterestRate = parseFloat(searchParams.get("loanInterestRate") || "8.5");
      const loanTenureYears = parseInt(searchParams.get("loanTenureYears") || "20");
      const extraPrepaymentPerMonth = parseFloat(searchParams.get("extraPrepayment") || "10000");
      const sipReturnRate = parseFloat(searchParams.get("sipReturnRate") || "12");

      const result = calculateLoanVsSip({
        loanPrincipal,
        loanInterestRate,
        loanTenureYears,
        extraPrepaymentPerMonth,
        sipReturnRate,
      });

      return NextResponse.json({ success: true, result });
    }

    // Standard SIP
    const monthlyInvestment = parseFloat(searchParams.get("monthly") || "10000");
    const expectedReturnRate = parseFloat(searchParams.get("rate") || "12");
    const tenureYears = parseInt(searchParams.get("years") || "10");
    const stepUpPercent = parseFloat(searchParams.get("stepUp") || "0");

    const result = calculateSip({
      monthlyInvestment,
      expectedReturnRate,
      tenureYears,
      stepUpPercent,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("SIP Calculator API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to calculate SIP data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, monthly, rate, years, stepUp } = body;

    const result = calculateSip({
      monthlyInvestment: Number(monthly || 10000),
      expectedReturnRate: Number(rate || 12),
      tenureYears: Number(years || 10),
      stepUpPercent: Number(stepUp || 0),
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("SIP Calculator POST Error:", error);
    return NextResponse.json({ success: false, error: "Invalid calculation request" }, { status: 400 });
  }
}
