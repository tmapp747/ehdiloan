import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoanCalculator } from "@/components/loan-calculator"
import { PenaltyCalculator } from "@/components/penalty-calculator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/lender">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Loan Calculator</h1>
            <p className="text-muted-foreground">Calculate loan payments, interest, and penalties</p>
          </div>
        </div>

        {/* Calculation Tools */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <LoanCalculator />
          </div>
          <div>
            <PenaltyCalculator />
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interest Calculation</CardTitle>
              <CardDescription>How monthly interest is calculated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Monthly Interest Rate:</strong> 10% of remaining principal balance
                </p>
              </div>
              <div className="text-sm space-y-2">
                <p>
                  <strong>Example:</strong>
                </p>
                <p>Loan Amount: ₱500,000</p>
                <p>Monthly Interest: ₱500,000 × 10% = ₱50,000</p>
                <p>Principal Payment: Monthly Payment - Interest</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Penalty System</CardTitle>
              <CardDescription>How penalties are calculated and accumulated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Penalty Rate:</strong> 5% of overdue amount per month
                </p>
              </div>
              <div className="text-sm space-y-2">
                <p>
                  <strong>Accumulation:</strong>
                </p>
                <p>Month 1: 5% of original overdue amount</p>
                <p>Month 2: 5% of (original + previous penalty)</p>
                <p>Penalties compound monthly until paid</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
