import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoanRequestForm } from "@/components/loan-request-form"
import { RecentRequests } from "@/components/recent-requests"
import { BrokerRunningLoans } from "@/components/broker-running-loans"
import { LogoutButton } from "@/components/logout-button"
import Image from "next/image"

export default function BrokerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/images/747-mascot-happy.png"
              alt="747 Mascot"
              width={60}
              height={60}
              className="object-contain mascot-bounce"
            />
            <div>
              <h1 className="text-3xl font-bold text-747-blue">EhdiLoan</h1>
              <p className="text-muted-foreground">Broker Dashboard - Boss Marc</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-semibold text-747-green">Boss Marc</p>
            </div>
            <LogoutButton variant="outline" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Loan Request Form */}
          <Card className="gradient-747-light border-747-blue/20 radiant-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-747-blue flex items-center space-x-2">
                <Image
                  src="/images/747-mascot-banner.png"
                  alt="747 Mascot"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <span>Submit New Loan Request</span>
              </CardTitle>
              <CardDescription>Fill out the form below to submit a loan request to Boss Edwin</CardDescription>
            </CardHeader>
            <CardContent>
              <LoanRequestForm />
            </CardContent>
          </Card>

          <Card className="gradient-747-light border-747-green/20 radiant-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-747-green flex items-center space-x-2">
                <Image
                  src="/images/747-mascot-love.png"
                  alt="747 Mascot"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <span>Loan Management</span>
              </CardTitle>
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
