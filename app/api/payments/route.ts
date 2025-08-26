import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const loanId = formData.get("loanId") as string
    const paymentMethod = formData.get("paymentMethod") as string
    const amount = formData.get("amount") as string
    const paymentProof = formData.get("paymentProof") as File | null

    // Validate required fields
    if (!loanId || !paymentMethod || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Save payment record to database
    // 2. Store payment proof file
    // 3. Update loan balance
    // 4. Send notifications
    // 5. Generate payment receipt

    const paymentData = {
      id: Date.now(), // Mock ID
      loanId: Number.parseInt(loanId),
      amount: Number.parseFloat(amount),
      paymentMethod,
      status: "pending", // pending verification
      paymentDate: new Date().toISOString(),
      reference: `PAY-${loanId}-${Date.now()}`,
      proofUploaded: !!paymentProof,
    }

    console.log("Payment submitted:", paymentData)

    return NextResponse.json({
      success: true,
      message: "Payment submitted successfully",
      data: paymentData,
    })
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const loanId = searchParams.get("loanId")

    // Mock payment history
    const payments = [
      {
        id: 1,
        loanId: Number.parseInt(loanId || "1"),
        amount: 55000,
        paymentMethod: "gcash",
        status: "verified",
        paymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        reference: "PAY-1-1234567890",
      },
      {
        id: 2,
        loanId: Number.parseInt(loanId || "1"),
        amount: 55000,
        paymentMethod: "maya",
        status: "pending",
        paymentDate: new Date().toISOString(),
        reference: "PAY-1-1234567891",
      },
    ]

    const filteredPayments = loanId ? payments.filter((p) => p.loanId === Number.parseInt(loanId)) : payments

    return NextResponse.json(filteredPayments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
