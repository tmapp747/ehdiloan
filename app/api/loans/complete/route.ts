import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { loanId, totalPaid, principalAmount } = await request.json()

    // Calculate if loan is fully paid (principal + 10% interest)
    const totalInterestDue = principalAmount * 0.1
    const totalAmountDue = principalAmount + totalInterestDue
    const isFullyPaid = totalPaid >= totalAmountDue

    // In a real app, this would update the database
    // For now, we'll simulate the response
    const updatedLoan = {
      id: loanId,
      status: isFullyPaid ? "completed" : "active",
      totalPaid,
      remainingBalance: Math.max(0, totalAmountDue - totalPaid),
      completionDate: isFullyPaid ? new Date().toISOString() : null,
    }

    return NextResponse.json({
      success: true,
      loan: updatedLoan,
      message: isFullyPaid ? "Loan marked as fully paid" : "Loan status updated",
    })
  } catch (error) {
    console.error("Error updating loan completion:", error)
    return NextResponse.json({ success: false, error: "Failed to update loan status" }, { status: 500 })
  }
}
