import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoanRequestForm } from "@/components/loan-request-form"
import { RecentRequests } from "@/components/recent-requests"
import { BrokerRunningLoans } from "@/components/broker-running-loans"

export default function BrokerDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">EhdiLoan</h1>
            <p className="text-muted-foreground">Broker Dashboard - Boss Marc</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="font-semibold text-foreground">Boss Marc</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Loan Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Submit New Loan Request</CardTitle>
              <CardDescription>Fill out the form below to submit a loan request to Boss Edwin</CardDescription>
            </CardHeader>
            <CardContent>
              <LoanRequestForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Loan Management</CardTitle>
              <CardDescription>Track your loan requests and active loans</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="recent">Recent Requests</TabsTrigger>
                  <TabsTrigger value="running">Running Loans</TabsTrigger>
                </TabsList>
                <TabsContent value="recent" className="mt-4">
                  <RecentRequests />
                </TabsContent>
                <TabsContent value="running" className="mt-4">
                  <BrokerRunningLoans />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
