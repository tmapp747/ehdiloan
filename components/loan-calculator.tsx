"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  calculateMonthlyPayment,
  generatePaymentSchedule,
  formatCurrency,
  type PaymentScheduleItem,
} from "@/lib/database"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("500000")
  const [interestRate, setInterestRate] = useState("10")
  const [termMonths, setTermMonths] = useState("12")
  const [schedule, setSchedule] = useState<PaymentScheduleItem[]>([])
  const [showSchedule, setShowSchedule] = useState(false)

  const calculateSchedule = () => {
    const amount = Number.parseFloat(loanAmount)
    const rate = Number.parseFloat(interestRate)
    const term = Number.parseInt(termMonths)

    if (amount > 0 && rate > 0 && term > 0) {
      const startDate = new Date()
      const paymentSchedule = generatePaymentSchedule(amount, rate, term, startDate)
      setSchedule(paymentSchedule)
      setShowSchedule(true)
    }
  }

  const monthlyPayment = calculateMonthlyPayment(
    Number.parseFloat(loanAmount) || 0,
    (Number.parseFloat(interestRate) || 0) * 12,
    Number.parseInt(termMonths) || 1,
  )

  const totalInterest = monthlyPayment * (Number.parseInt(termMonths) || 1) - (Number.parseFloat(loanAmount) || 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loan Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">Loan Amount (₱)</Label>
              <Input
                id="amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="500000"
              />
            </div>
            <div>
              <Label htmlFor="rate">Monthly Interest Rate (%)</Label>
              <Input
                id="rate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="10"
              />
            </div>
            <div>
              <Label htmlFor="term">Term (Months)</Label>
              <Input id="term" value={termMonths} onChange={(e) => setTermMonths(e.target.value)} placeholder="12" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Payment</p>
              <p className="text-lg font-semibold">{formatCurrency(monthlyPayment)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Interest</p>
              <p className="text-lg font-semibold text-accent">{formatCurrency(totalInterest)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-lg font-semibold">
                {formatCurrency(monthlyPayment * (Number.parseInt(termMonths) || 1))}
              </p>
            </div>
          </div>

          <Button onClick={calculateSchedule} className="w-full">
            Generate Payment Schedule
          </Button>
        </CardContent>
      </Card>

      {showSchedule && schedule.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((payment) => (
                  <TableRow key={payment.month}>
                    <TableCell>{payment.month}</TableCell>
                    <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(payment.totalPayment)}</TableCell>
                    <TableCell>{formatCurrency(payment.principalAmount)}</TableCell>
                    <TableCell className="text-accent">{formatCurrency(payment.interestAmount)}</TableCell>
                    <TableCell>{formatCurrency(payment.remainingBalance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
