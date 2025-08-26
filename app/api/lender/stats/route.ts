import { NextResponse } from "next/server"

// Mock data - replace with actual database queries
export async function GET() {
  try {
    // In a real app, these would be database queries
    const stats = {
      totalRequests: 15,
      pendingRequests: 3,
      approvedLoans: 8,
      totalLoanAmount: 2500000, // ₱2.5M
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching lender stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
