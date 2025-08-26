import { LoanApprovalForm } from "@/components/loan-approval-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

interface PageProps {
  params: {
    id: string
  }
}

function getLoanRequest(id: string) {
  // In a real app, this would fetch from database
  return {
    id: Number.parseInt(id),
    borrower_name: "Juan Dela Cruz",
    borrower_contact: "+63 912 345 6789",
    loan_amount: 500000,
    purpose: "Business expansion for sari-sari store",
    status: "pending",
    requested_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    broker_name: "Boss Marc",
  }
}

export default function LoanApprovalPage({ params }: PageProps) {
  const loanRequest = getLoanRequest(params.id)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/lender">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Loan Approval</h1>
            <p className="text-muted-foreground">Review and process loan request #{loanRequest.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request Details</CardTitle>
              <CardDescription>Information submitted by broker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Borrower Name</p>
                <p className="font-semibold">{loanRequest.borrower_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-semibold">{loanRequest.borrower_contact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Loan Amount</p>
                <p className="font-semibold text-lg">₱{loanRequest.loan_amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Purpose</p>
                <p className="text-sm bg-muted p-2 rounded">{loanRequest.purpose}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted by</p>
                <p className="font-semibold">{loanRequest.broker_name}</p>
              </div>
            </CardContent>
          </Card>

          {/* Approval Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loan Processing</CardTitle>
                <CardDescription>Review and approve or reject this loan request</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="flex items-center justify-center py-8">Loading form...</div>}>
                  <LoanApprovalForm loanRequest={loanRequest} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
