"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Receipt, Clock } from "lucide-react"
import { formatCurrency, formatDateTime } from "@/lib/database"
import Image from "next/image"

interface RunningLoan {
  id: number
  borrower_name: string
  borrower_contact: string
  loan_amount: number
  status: string
  approved_at: string
  due_date: string
  payment_proof?: string
  principal_paid: number
  interest_paid: number
  total_due: number
}

export function BrokerRunningLoans() {
  const [loans, setLoans] = useState<RunningLoan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRunningLoans()
  }, [])

  const fetchRunningLoans = async () => {
    try {
      const response = await fetch("/api/loan-requests?type=running&brokerId=2")
      if (response.ok) {
        const data = await response.json()
        setLoans(data)
      }
    } catch (error) {
      console.error("Failed to fetch running loans:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 bg-muted rounded w-1/3"></div>
              <div className="h-6 bg-muted rounded w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loans.length === 0) {
    return (
      <div className="text-center py-8">
        <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Running Loans</h3>
        <p className="text-muted-foreground">No active loans at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <div key={loan.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">{loan.borrower_name}</h3>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                ACTIVE
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Due: {new Date(loan.due_date).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Loan Amount</p>
              <p className="font-semibold text-lg text-foreground">{formatCurrency(loan.loan_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Due</p>
              <p className="font-semibold text-lg text-foreground">{formatCurrency(loan.total_due)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact</p>
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <p className="text-sm text-foreground">{loan.borrower_contact}</p>
              </div>
            </div>
          </div>

          {loan.payment_proof && (
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Payment Proof</p>
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                <Image
                  src={loan.payment_proof || "/placeholder.svg"}
                  alt="Payment proof"
                  fill
                  className="object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => window.open(loan.payment_proof, "_blank")}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Approved: {formatDateTime(loan.approved_at)}</span>
            <span>Loan ID: #{loan.id}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
