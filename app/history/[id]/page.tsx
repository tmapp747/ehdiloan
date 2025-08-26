import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoanDetailView } from "@/components/loan-detail-view"
import { PaymentHistory } from "@/components/payment-history"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: {
    id: string
  }
}

export default async function LoanDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/history">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to History
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Loan Details</h1>
            <p className="text-muted-foreground">Complete history for Loan #{params.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Information</CardTitle>
              <CardDescription>Complete loan details and calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <LoanDetailView loanId={params.id} />
            </CardContent>
          </Card>

          {/* Payment History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment History</CardTitle>
                <CardDescription>All payments, penalties, and interest calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentHistory loanId={params.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
