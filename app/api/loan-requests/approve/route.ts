import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const requestId = formData.get("requestId") as string
    const decision = formData.get("decision") as string
    const notes = formData.get("notes") as string
    const reviewedBy = formData.get("reviewedBy") as string
    const paymentProof = formData.get("paymentProof") as File | null

    // Validate required fields
    if (!requestId || !decision || !reviewedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Update the loan request status in the database
    // 2. If approved, create a new loan record
    // 3. Save the payment proof file
    // 4. Send notifications to the broker

    const approvalData = {
      requestId: Number.parseInt(requestId),
      decision,
      notes,
      reviewedBy: Number.parseInt(reviewedBy),
      reviewedAt: new Date().toISOString(),
      paymentProofUploaded: !!paymentProof,
    }

    console.log("Loan approval processed:", approvalData)

    return NextResponse.json({
      success: true,
      message: `Loan request ${decision}d successfully`,
      data: approvalData,
    })
  } catch (error) {
    console.error("Error processing loan approval:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
