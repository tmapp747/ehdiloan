"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/database"

interface LoanDetailViewProps {
  loanId: string
}

interface LoanDetail {
  id: number
  borrower_name: string
  loan_amount: number
  interest_rate: number
  penalty_rate: number
  monthly_payment: number
  start_date: string
  status: string
  total_paid: number
  remaining_balance: number
  total_interest: number
  total_penalties: number
  payments_made: number
  payments_remaining: number
}

export function LoanDetailView({ loanId }: LoanDetailViewProps) {
  const [loan, setLoan] = useState<LoanDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLoanDetail()
  }, [loanId])

  const fetchLoanDetail = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockLoan: LoanDetail = {
        id: Number.parseInt(loanId),
        borrower_name: "Juan Dela Cruz",
        loan_amount: 500000,
        interest_rate: 10,
        penalty_rate: 5,
        monthly_payment: 55000,
        start_date: "2024-01-15",
        status: "active",
        total_paid: 110000,
        remaining_balance: 390000,
        total_interest: 60000,
        total_penalties: 0,
        payments_made: 2,
        payments_remaining: 10,
      }

      setLoan(mockLoan)
    } catch (error) {
      console.error("Failed to fetch loan detail:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!loan) {
    return <div className="text-center text-muted-foreground">Loan not found</div>
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Borrower</p>
        <p className="font-semibold text-lg">{loan.borrower_name}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Status</p>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">{loan.status.toUpperCase()}</Badge>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Original Amount</p>
        <p className="font-semibold text-lg">{formatCurrency(loan.loan_amount)}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Remaining Balance</p>
        <p className="font-semibold text-lg text-accent">{formatCurrency(loan.remaining_balance)}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Total Paid</p>
        <p className="font-semibold text-green-600">{formatCurrency(loan.total_paid)}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Interest Earned</p>
        <p className="font-semibold">{formatCurrency(loan.total_interest)}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Penalties Collected</p>
        <p className="font-semibold text-red-600">{formatCurrency(loan.total_penalties)}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Payment Progress</p>
        <p className="font-semibold">
          {loan.payments_made} of {loan.payments_made + loan.payments_remaining} payments
        </p>
        <div className="w-full bg-muted rounded-full h-2 mt-1">
          <div
            className="bg-primary h-2 rounded-full"
            style={{
              width: `${(loan.payments_made / (loan.payments_made + loan.payments_remaining)) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Start Date</p>
        <p className="font-semibold">{formatDate(loan.start_date)}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Monthly Payment</p>
        <p className="font-semibold">{formatCurrency(loan.monthly_payment)}</p>
        <p className="text-xs text-muted-foreground">{loan.interest_rate}% monthly interest</p>
      </div>
    </div>
  )
}
