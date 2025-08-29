import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total requests count
    const { count: totalRequests } = await supabase.from("loan_requests").select("*", { count: "exact", head: true })

    // Get pending requests count
    const { count: pendingRequests } = await supabase
      .from("loan_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    // Get approved loans count
    const { count: approvedLoans } = await supabase
      .from("loans")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    // Get total loan amount
    const { data: loanAmounts } = await supabase.from("loans").select("principal_amount").eq("status", "active")

    const totalLoanAmount = loanAmounts?.reduce((sum, loan) => sum + loan.principal_amount, 0) || 0

    const stats = {
      totalRequests: totalRequests || 0,
      pendingRequests: pendingRequests || 0,
      approvedLoans: approvedLoans || 0,
      totalLoanAmount,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching lender stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
