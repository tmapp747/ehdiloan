"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { DigitalClock } from "@/components/digital-clock"
import { PaymentMethods } from "@/components/payment-methods"
import { FileUpload } from "@/components/file-upload"
import { CheckCircle, XCircle } from "lucide-react"

interface LoanApprovalFormProps {
  loanRequest: {
    id: number
    borrower_name: string
    loan_amount: number
    [key: string]: any
  }
}

export function LoanApprovalForm({ loanRequest }: LoanApprovalFormProps) {
  const [decision, setDecision] = useState<"approve" | "reject" | "">("")
  const [notes, setNotes] = useState("")
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!decision) {
      toast({
        title: "Decision Required",
        description: "Please select approve or reject before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("requestId", loanRequest.id.toString())
      formData.append("decision", decision)
      formData.append("notes", notes)
      formData.append("reviewedBy", "1") // Boss Edwin's ID

      if (paymentProof) {
        formData.append("paymentProof", paymentProof)
      }

      const response = await fetch("/api/loan-requests/approve", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Decision Submitted",
          description: `Loan request has been ${decision}d successfully.`,
        })

        // Redirect back to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "/lender"
        }, 2000)
      } else {
        throw new Error("Failed to submit decision")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit decision. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Digital Clock */}
      <div>
        <Label className="text-sm font-medium">Processing Time</Label>
        <DigitalClock />
      </div>

      {/* Approval Decision */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Decision</Label>
        <RadioGroup value={decision} onValueChange={(value) => setDecision(value as "approve" | "reject")}>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="approve" id="approve" />
            <Label htmlFor="approve" className="flex items-center gap-2 cursor-pointer">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium">Approve Loan</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="reject" id="reject" />
            <Label htmlFor="reject" className="flex items-center gap-2 cursor-pointer">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="font-medium">Reject Loan</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Payment Methods */}
      {decision === "approve" && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Payment Methods</Label>
          <PaymentMethods loanAmount={loanRequest.loan_amount} />
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes or comments..."
          rows={3}
        />
      </div>

      {/* File Upload for Payment Proof */}
      {decision === "approve" && (
        <div className="space-y-2">
          <Label>Proof of Payment</Label>
          <FileUpload onFileSelect={setPaymentProof} />
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={!decision || isSubmitting} className="w-full" size="lg">
        {isSubmitting ? "Processing..." : `${decision === "approve" ? "Approve" : "Reject"} Loan Request`}
      </Button>
    </form>
  )
}
