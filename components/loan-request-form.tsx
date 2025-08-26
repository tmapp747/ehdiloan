"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/database"

export function LoanRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    borrowerName: "",
    borrowerContact: "",
    loanAmount: "",
    purpose: "",
  })
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "")
    setFormData((prev) => ({
      ...prev,
      loanAmount: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/loan-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          borrowerName: formData.borrowerName,
          borrowerContact: formData.borrowerContact,
          loanAmount: Number.parseFloat(formData.loanAmount),
          purpose: formData.purpose,
          brokerId: 2, // Boss Marc's ID
        }),
      })

      if (response.ok) {
        toast({
          title: "Request Submitted",
          description: "Your loan request has been sent to Boss Edwin for review.",
        })
        setFormData({
          borrowerName: "",
          borrowerContact: "",
          loanAmount: "",
          purpose: "",
        })
      } else {
        throw new Error("Failed to submit request")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit loan request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.borrowerName && formData.borrowerContact && formData.loanAmount && formData.purpose

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="borrowerName">Borrower Name</Label>
        <Input
          id="borrowerName"
          name="borrowerName"
          value={formData.borrowerName}
          onChange={handleInputChange}
          placeholder="Enter borrower's full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="borrowerContact">Contact Information</Label>
        <Input
          id="borrowerContact"
          name="borrowerContact"
          value={formData.borrowerContact}
          onChange={handleInputChange}
          placeholder="Phone number or email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="loanAmount">Loan Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₱</span>
          <Input
            id="loanAmount"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleAmountChange}
            placeholder="0"
            className="pl-8"
            required
          />
        </div>
        {formData.loanAmount && (
          <p className="text-sm text-muted-foreground">
            Amount: {formatCurrency(Number.parseFloat(formData.loanAmount) || 0)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose of Loan</Label>
        <Textarea
          id="purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleInputChange}
          placeholder="Describe the purpose of this loan..."
          rows={3}
          required
        />
      </div>

      <Button type="submit" disabled={!isFormValid || isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Loan Request"}
      </Button>
    </form>
  )
}
