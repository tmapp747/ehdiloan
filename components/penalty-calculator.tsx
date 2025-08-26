"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { calculateTotalAmountDue, formatCurrency, type PaymentCalculation } from "@/lib/database"
import { AlertTriangle, Calculator } from "lucide-react"

export function PenaltyCalculator() {
  const [originalAmount, setOriginalAmount] = useState("55000")
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 15) // 15 days ago
    return date.toISOString().split("T")[0]
  })
  const [calculation, setCalculation] = useState<PaymentCalculation | null>(null)

  const calculatePenalty = () => {
    const amount = Number.parseFloat(originalAmount)
    if (amount > 0 && dueDate) {
      const result = calculateTotalAmountDue(amount, dueDate)
      setCalculation(result)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Penalty Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="original">Original Payment Amount (₱)</Label>
            <Input
              id="original"
              value={originalAmount}
              onChange={(e) => setOriginalAmount(e.target.value)}
              placeholder="55000"
            />
          </div>
          <div>
            <Label htmlFor="due">Original Due Date</Label>
            <Input id="due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>

        <Button onClick={calculatePenalty} className="w-full">
          Calculate Penalty
        </Button>

        {calculation && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {calculation.isOverdue && <AlertTriangle className="h-4 w-4 text-red-600" />}
              <Badge
                className={
                  calculation.isOverdue
                    ? "bg-red-100 text-red-800 border-red-200"
                    : "bg-green-100 text-green-800 border-green-200"
                }
              >
                {calculation.isOverdue ? `${calculation.daysLate} DAYS OVERDUE` : "ON TIME"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Original Amount</p>
                <p className="text-lg font-semibold">{formatCurrency(calculation.originalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Penalty Amount</p>
                <p className="text-lg font-semibold text-red-600">{formatCurrency(calculation.penaltyAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount Due</p>
                <p className="text-xl font-bold text-accent">{formatCurrency(calculation.totalAmountDue)}</p>
              </div>
            </div>

            {calculation.isOverdue && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Penalty Calculation:</strong> {calculation.penaltyRate}% penalty applied to overdue amount.
                  Penalties accumulate monthly and compound on the total overdue balance.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
