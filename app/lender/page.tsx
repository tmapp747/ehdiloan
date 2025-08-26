import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PendingRequests } from "@/components/pending-requests"
import { RunningLoans } from "@/components/running-loans"
import { LenderStats } from "@/components/lender-stats"

export default function LenderDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">EhdiLoan</h1>
            <p className="text-muted-foreground">Lender Dashboard - Boss Edwin</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="font-semibold text-foreground">Boss Edwin</p>
          </div>
        </div>

        {/* Stats Overview */}
        <LenderStats />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Pending Requests - Takes up 2 columns */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Loan Management</CardTitle>
                <CardDescription>Manage loan requests and active loans</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                    <TabsTrigger value="running">Running Loans</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pending" className="mt-6">
                    <PendingRequests />
                  </TabsContent>
                  <TabsContent value="running" className="mt-6">
                    <RunningLoans />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Today's Tasks</h4>
                  <p className="text-xs text-muted-foreground">Review pending requests</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Payment Tracking</h4>
                  <p className="text-xs text-muted-foreground">Monitor loan payments</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Reports</h4>
                  <p className="text-xs text-muted-foreground">Generate loan reports</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Database</span>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Payment Gateway</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Last Backup</span>
                    <span className="text-muted-foreground">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
