import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoanHistoryTable } from "@/components/loan-history-table"
import { PaymentCalendar } from "@/components/payment-calendar"
import { HistoryStats } from "@/components/history-stats"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

export default function LoanHistoryPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/lender">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Loan History</h1>
              <p className="text-muted-foreground">Complete history of all loans and payments</p>
            </div>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Statistics Overview */}
        <HistoryStats />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Loan History Table - Takes up 3 columns */}
          <div className="xl:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">All Loans</CardTitle>
                <CardDescription>Complete history with payment details and penalties</CardDescription>
              </CardHeader>
              <CardContent>
                <LoanHistoryTable />
              </CardContent>
            </Card>
          </div>

          {/* Payment Calendar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Calendar</CardTitle>
                <CardDescription>Upcoming due dates</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentCalendar />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
