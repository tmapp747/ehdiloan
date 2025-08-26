import { PaymentInterface } from "@/components/payment-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/database"

interface PageProps {
  params: {
    loanId: string
  }
}

// Mock function to get loan details
async function getLoanDetails(loanId: string) {
  return {
    id: Number.parseInt(loanId),
    borrower_name: "Juan Dela Cruz",
    loan_amount: 500000,
    monthly_payment: 55000,
    interest_rate: 10,
    penalty_rate: 5,
    next_due_date: "2024-02-15",
    outstanding_balance: 450000,
    payment_status: "current",
    loan_term_months: 12,
    payments_made: 1,
  }
}

export default async function PaymentPage({ params }: PageProps) {
  const loan = await getLoanDetails(params.loanId)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/lender">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Loan Payment</h1>
            <p className="text-muted-foreground">Make payment for Loan #{loan.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Loan Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Summary</CardTitle>
              <CardDescription>Current loan status and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Borrower</p>
                <p className="font-semibold">{loan.borrower_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Original Amount</p>
                <p className="font-semibold">{formatCurrency(loan.loan_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                <p className="font-semibold text-lg text-accent">{formatCurrency(loan.outstanding_balance)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="font-semibold">{formatCurrency(loan.monthly_payment)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Due Date</p>
                <p className="font-semibold">{new Date(loan.next_due_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interest Rate</p>
                <p className="font-semibold">{loan.interest_rate}% monthly</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Interface */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Make Payment</CardTitle>
                <CardDescription>Choose your payment method and complete the transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentInterface loan={loan} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
