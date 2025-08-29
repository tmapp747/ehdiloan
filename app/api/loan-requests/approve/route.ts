import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
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

    // Get the loan request details
    const { data: loanRequest, error: fetchError } = await supabase
      .from("loan_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (fetchError || !loanRequest) {
      return NextResponse.json({ error: "Loan request not found" }, { status: 404 })
    }

    // Update the loan request status
    const { error: updateError } = await supabase
      .from("loan_requests")
      .update({
        status: decision === "approve" ? "approved" : "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewedBy,
        notes,
      })
      .eq("id", requestId)

    if (updateError) {
      console.error("Error updating loan request:", updateError)
      return NextResponse.json({ error: "Failed to update loan request" }, { status: 500 })
    }

    // If approved, create a new loan record
    if (decision === "approve") {
      const { data: newLoan, error: loanError } = await supabase
        .from("loans")
        .insert({
          request_id: requestId,
          lender_id: reviewedBy,
          broker_id: loanRequest.broker_id,
          borrower_name: loanRequest.borrower_name,
          borrower_contact: loanRequest.borrower_contact,
          principal_amount: loanRequest.loan_amount,
          interest_rate: 10.0, // 10% monthly interest
          status: "active",
          approved_at: new Date().toISOString(),
          loan_term_months: 12,
        })
        .select()
        .single()

      if (loanError) {
        console.error("Error creating loan:", loanError)
        return NextResponse.json({ error: "Failed to create loan record" }, { status: 500 })
      }

      // Create payment schedule
      const dueDate = new Date()
      dueDate.setMonth(dueDate.getMonth() + 1) // Due next month

      const { error: scheduleError } = await supabase.from("payment_schedules").insert({
        loan_id: newLoan.id,
        due_date: dueDate.toISOString(),
        principal_due: loanRequest.loan_amount,
        interest_due: (loanRequest.loan_amount * 10) / 100,
        status: "pending",
      })

      if (scheduleError) {
        console.error("Error creating payment schedule:", scheduleError)
      }

      // Save payment proof if provided
      if (paymentProof) {
        // In a real app, you would upload the file to storage
        // For now, we'll just record that proof was provided
        const { error: paymentError } = await supabase.from("payments").insert({
          loan_id: newLoan.id,
          amount: 0, // Initial record
          payment_type: "initial",
          proof_image_url: "/images/payment-proof-sample.png", // Would be actual uploaded file URL
          status: "pending",
          payment_date: new Date().toISOString(),
        })

        if (paymentError) {
          console.error("Error recording payment proof:", paymentError)
        }
      }
    }

    const approvalData = {
      requestId: Number.parseInt(requestId),
      decision,
      notes,
      reviewedBy: Number.parseInt(reviewedBy),
      reviewedAt: new Date().toISOString(),
      paymentProofUploaded: !!paymentProof,
    }

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
