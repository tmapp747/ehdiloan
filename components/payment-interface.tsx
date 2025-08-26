"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { FileUpload } from "@/components/file-upload"
import { formatCurrency } from "@/lib/database"
import { CreditCard, Smartphone } from "lucide-react"

interface PaymentInterfaceProps {
  loan: {
    id: number
    monthly_payment: number
    outstanding_balance: number
    borrower_name: string
    [key: string]: any
  }
  recipient?: "Ehdiwin" | "Bossmarc"
}

export function PaymentInterface({ loan, recipient = "Ehdiwin" }: PaymentInterfaceProps) {
  const [paymentMethod, setPaymentMethod] = useState<"gcash" | "maya" | "">("")
  const [paymentAmount, setPaymentAmount] = useState(loan.monthly_payment.toString())
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const { toast } = useToast()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, "")
    setPaymentAmount(value)
  }

  const handlePaymentMethodSelect = (method: "gcash" | "maya") => {
    setPaymentMethod(method)
    setShowQR(true)
  }

  const availableMethods =
    recipient === "Bossmarc"
      ? [
          { key: "gcash", name: "GCash", icon: Smartphone, color: "blue" },
          { key: "maya", name: "Maya", icon: CreditCard, color: "green" },
        ]
      : [{ key: "gcash", name: "GCash", icon: Smartphone, color: "blue" }]

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentMethod || !paymentAmount || !paymentProof) {
      toast({
        title: "Missing Information",
        description: "Please select payment method, enter amount, and upload proof of payment.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("loanId", loan.id.toString())
      formData.append("paymentMethod", paymentMethod)
      formData.append("amount", paymentAmount)
      formData.append("paymentProof", paymentProof)

      const response = await fetch("/api/payments", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Payment Submitted",
          description: "Your payment has been submitted for verification.",
        })

        // Reset form
        setPaymentAmount(loan.monthly_payment.toString())
        setPaymentProof(null)
        setShowQR(false)
      } else {
        throw new Error("Failed to submit payment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmitPayment} className="space-y-6">
      {/* Payment Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Payment Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₱</span>
          <Input
            id="amount"
            value={paymentAmount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="pl-8 radiant-shadow"
            required
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="radiant-shadow bg-transparent"
            onClick={() => setPaymentAmount(loan.monthly_payment.toString())}
          >
            Monthly Payment ({formatCurrency(loan.monthly_payment)})
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="radiant-shadow bg-transparent"
            onClick={() => setPaymentAmount(loan.outstanding_balance.toString())}
          >
            Full Payment ({formatCurrency(loan.outstanding_balance)})
          </Button>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        <Label>Select Payment Method</Label>
        <div className={`grid gap-4 ${availableMethods.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {availableMethods.map((method) => {
            const IconComponent = method.icon
            return (
              <Button
                key={method.key}
                type="button"
                variant={paymentMethod === method.key ? "default" : "outline"}
                className="h-20 flex-col gap-2 gradient-card radiant-shadow hover:radiant-shadow-lg"
                onClick={() => handlePaymentMethodSelect(method.key as "gcash" | "maya")}
              >
                <div className={`w-8 h-8 bg-${method.color}-100 rounded-full flex items-center justify-center`}>
                  <IconComponent className={`h-4 w-4 text-${method.color}-600`} />
                </div>
                <span>{method.name}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* QR Code Display */}
      {showQR && paymentMethod && (
        <div className="space-y-3">
          <Label>Payment QR Code</Label>
          <QRCodeGenerator
            method={paymentMethod}
            amount={Number.parseFloat(paymentAmount) || 0}
            recipient={recipient}
            loanId={loan.id}
          />
        </div>
      )}

      {/* Payment Proof Upload */}
      {showQR && (
        <div className="space-y-2">
          <Label>Upload Payment Proof</Label>
          <p className="text-sm text-muted-foreground">
            After making the payment, upload a screenshot as proof of transaction.
          </p>
          <FileUpload onFileSelect={setPaymentProof} />
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!paymentMethod || !paymentAmount || !paymentProof || isSubmitting}
        className="w-full gradient-primary radiant-shadow-lg"
        size="lg"
      >
        {isSubmitting ? "Submitting Payment..." : "Submit Payment"}
      </Button>
    </form>
  )
}
