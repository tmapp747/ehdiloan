import { type NextRequest, NextResponse } from "next/server"

// Mock database operations - replace with actual database calls
const mockRequests: any[] = [
  {
    id: 1,
    broker_id: 2,
    borrower_name: "Jericho",
    borrower_contact: "09182156660",
    loan_amount: 50000,
    purpose: "Business capital for small enterprise",
    status: "pending",
    requested_at: new Date("2025-08-26T10:00:00Z").toISOString(),
  },
]

// Mock running loans data
const mockRunningLoans: any[] = [
  {
    id: 101,
    broker_id: 2,
    borrower_name: "Boyong",
    borrower_contact: "09182156660",
    loan_amount: 100000,
    status: "approved",
    approved_at: new Date("2025-08-15T10:00:00Z").toISOString(),
    due_date: new Date("2025-09-15T10:00:00Z").toISOString(),
    payment_proof: "/images/payment-proof-sample.png",
    principal_paid: 0,
    interest_paid: 0,
    total_due: 110000, // 100k + 10% interest
  },
  {
    id: 102,
    broker_id: 2,
    borrower_name: "Boyong",
    borrower_contact: "09182156660",
    loan_amount: 50000,
    status: "approved",
    approved_at: new Date("2025-08-15T10:00:00Z").toISOString(),
    due_date: new Date("2025-09-15T10:00:00Z").toISOString(),
    payment_proof: "/images/payment-proof-sample.png",
    principal_paid: 0,
    interest_paid: 0,
    total_due: 55000, // 50k + 10% interest
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { borrowerName, borrowerContact, loanAmount, purpose, brokerId } = body

    // Validate required fields
    if (!borrowerName || !borrowerContact || !loanAmount || !purpose || !brokerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new loan request
    const newRequest = {
      id: mockRequests.length + 1,
      broker_id: brokerId,
      borrower_name: borrowerName,
      borrower_contact: borrowerContact,
      loan_amount: loanAmount,
      purpose,
      status: "pending",
      requested_at: new Date().toISOString(),
    }

    mockRequests.push(newRequest)

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    console.error("Error creating loan request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brokerId = searchParams.get("brokerId")
    const status = searchParams.get("status")
    const type = searchParams.get("type") // 'pending' or 'running'

    if (type === "running") {
      let filteredLoans = mockRunningLoans

      if (brokerId) {
        filteredLoans = filteredLoans.filter((loan) => loan.broker_id === Number.parseInt(brokerId))
      }

      return NextResponse.json(filteredLoans)
    }

    let filteredRequests = mockRequests

    if (brokerId) {
      filteredRequests = filteredRequests.filter((req) => req.broker_id === Number.parseInt(brokerId))
    }

    if (status) {
      filteredRequests = filteredRequests.filter((req) => req.status === status)
    }

    // Sort by most recent first
    filteredRequests.sort((a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime())

    return NextResponse.json(filteredRequests)
  } catch (error) {
    console.error("Error fetching loan requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
