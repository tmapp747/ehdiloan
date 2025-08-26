import { type NextRequest, NextResponse } from "next/server"
import {
  calculateTotalAmountDue,
  calculateLoanSummary,
  generatePaymentSchedule,
  calculateNextPayment,
} from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...params } = body

    let result

    switch (type) {
      case "penalty":
        result = calculateTotalAmountDue(params.originalAmount, params.dueDate, params.interestRate, params.penaltyRate)
        break

      case "loan_summary":
        result = calculateLoanSummary(params.loanAmount, params.interestRate, params.termMonths, params.payments || [])
        break

      case "payment_schedule":
        result = generatePaymentSchedule(
          params.loanAmount,
          params.interestRate,
          params.termMonths,
          new Date(params.startDate),
        )
        break

      case "next_payment":
        result = calculateNextPayment(
          params.monthlyPayment,
          params.lastPaymentDate,
          params.interestRate,
          params.penaltyRate,
        )
        break

      default:
        return NextResponse.json({ error: "Invalid calculation type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error in calculations:", error)
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 })
  }
}
