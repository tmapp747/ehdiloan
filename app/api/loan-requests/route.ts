import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase || typeof supabase.from !== "function") {
      console.log("[v0] Supabase not available, returning mock response for POST")
      const body = await request.json()
      return NextResponse.json(
        {
          id: Math.random().toString(36).substr(2, 9),
          broker_id: body.brokerId,
          borrower_name: body.borrowerName,
          borrower_contact: body.borrowerContact,
          loan_amount: body.loanAmount,
          purpose: body.purpose,
          status: "pending",
          requested_at: new Date().toISOString(),
        },
        { status: 201 },
      )
    }

    const body = await request.json()
    const { borrowerName, borrowerContact, loanAmount, purpose, brokerId } = body

    // Validate required fields
    if (!borrowerName || !borrowerContact || !loanAmount || !purpose || !brokerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: newRequest, error } = await supabase
      .from("loan_requests")
      .insert({
        broker_id: brokerId,
        borrower_name: borrowerName,
        borrower_contact: borrowerContact,
        loan_amount: loanAmount,
        purpose,
        status: "pending",
        requested_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create loan request" }, { status: 500 })
    }

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    console.error("Error creating loan request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase || typeof supabase.from !== "function") {
      console.log("[v0] Supabase not available, returning mock data for GET")
      const { searchParams } = new URL(request.url)
      const type = searchParams.get("type")

      if (type === "running") {
        return NextResponse.json([
          {
            id: "mock-1",
            broker_id: "mock-broker",
            borrower_name: "Boss Pogi",
            borrower_contact: "09182156660",
            loan_amount: 150000,
            status: "active",
            approved_at: "2025-08-15T00:00:00Z",
            due_date: "2025-09-15T00:00:00Z",
            payment_proof: "/images/payment-proof-100k.png",
            principal_paid: 0,
            interest_paid: 0,
            total_due: 165000,
          },
        ])
      }

      return NextResponse.json([
        {
          id: "mock-pending-1",
          broker_id: "mock-broker",
          borrower_name: "Jericho",
          borrower_contact: "09182156660",
          loan_amount: 50000,
          purpose: "Business expansion",
          status: "pending",
          requested_at: "2025-08-29T00:00:00Z",
        },
      ])
    }

    const { searchParams } = new URL(request.url)
    const brokerId = searchParams.get("brokerId")
    const status = searchParams.get("status")
    const type = searchParams.get("type") // 'pending' or 'running'

    if (type === "running") {
      let query = supabase
        .from("loans")
        .select(`
          *,
          payment_schedules (
            due_date,
            principal_due,
            interest_due,
            status
          ),
          payments (
            amount,
            proof_image_url,
            payment_date,
            status
          )
        `)
        .eq("status", "active")

      if (brokerId) {
        query = query.eq("broker_id", brokerId)
      }

      const { data: loans, error } = await query.order("approved_at", { ascending: false })

      if (error) {
        console.error("Database error:", error)
        return NextResponse.json({ error: "Failed to fetch running loans" }, { status: 500 })
      }

      // Transform data to match expected format
      const transformedLoans =
        loans?.map((loan) => ({
          id: loan.id,
          broker_id: loan.broker_id,
          borrower_name: loan.borrower_name,
          borrower_contact: loan.borrower_contact,
          loan_amount: loan.principal_amount,
          status: loan.status,
          approved_at: loan.approved_at,
          due_date: loan.payment_schedules?.[0]?.due_date,
          payment_proof: loan.payments?.[0]?.proof_image_url || "/images/payment-proof-sample.png",
          principal_paid: 0, // Calculate from payments if needed
          interest_paid: 0,
          total_due: loan.principal_amount + (loan.principal_amount * loan.interest_rate) / 100,
        })) || []

      return NextResponse.json(transformedLoans)
    }

    let query = supabase.from("loan_requests").select("*")

    if (brokerId) {
      query = query.eq("broker_id", brokerId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data: requests, error } = await query.order("requested_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch loan requests" }, { status: 500 })
    }

    return NextResponse.json(requests || [])
  } catch (error) {
    console.error("Error fetching loan requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
