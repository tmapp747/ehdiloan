import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PendingRequests } from "@/components/pending-requests"
import { RunningLoans } from "@/components/running-loans"
import { LenderStats } from "@/components/lender-stats"
import { LogoutButton } from "@/components/logout-button"
import Image from "next/image"

export default function LenderDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/images/747-mascot-love.png"
              alt="747 Mascot"
              width={60}
              height={60}
              className="object-contain mascot-bounce"
            />
            <div>
              <h1 className="text-3xl font-bold text-747-blue">EhdiLoan</h1>
              <p className="text-muted-foreground">Lender Dashboard - Boss Edwin</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-semibold text-747-blue">Boss Edwin</p>
            </div>
            <LogoutButton variant="outline" />
          </div>
        </div>

        {/* Stats Overview */}
        <LenderStats />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Pending Requests - Takes up 2 columns */}
          <div className="xl:col-span-2">
            <Card className="gradient-747-light border-747-blue/20 radiant-shadow">
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
            <Card className="gradient-747-light border-747-green/20 radiant-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-747-blue flex items-center space-x-2">
                  <Image
                    src="/images/747-mascot-banner.png"
                    alt="747 Mascot"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-747-blue/10 rounded-lg border border-747-blue/20">
                  <h4 className="font-medium text-sm mb-1 text-747-blue">Today's Tasks</h4>
                  <p className="text-xs text-muted-foreground">Review pending requests</p>
                </div>
                <div className="p-3 bg-747-green/10 rounded-lg border border-747-green/20">
                  <h4 className="font-medium text-sm mb-1 text-747-green">Payment Tracking</h4>
                  <p className="text-xs text-muted-foreground">Monitor loan payments</p>
                </div>
                <div className="p-3 bg-747-blue/10 rounded-lg border border-747-blue/20">
                  <h4 className="font-medium text-sm mb-1 text-747-blue">Reports</h4>
                  <p className="text-xs text-muted-foreground">Generate loan reports</p>
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-747-light border-747-green/20 radiant-shadow">
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Database</span>
                    <span className="text-747-green font-medium">Online</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Payment Gateway</span>
                    <span className="text-747-green font-medium">Active</span>
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
