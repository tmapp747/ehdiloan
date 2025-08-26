"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock } from "lucide-react"

interface LoanCompletionTrackerProps {
  loanId: string
  principalAmount: number
  totalPaid: number
  interestPaid: number
  onStatusUpdate?: (status: "active" | "completed") => void
}

export function LoanCompletionTracker({
  loanId,
  principalAmount,
  totalPaid,
  interestPaid,
  onStatusUpdate,
}: LoanCompletionTrackerProps) {
  const [completionStatus, setCompletionStatus] = useState<"active" | "completed">("active")

  // Calculate total amount due (principal + 10% interest)
  const totalInterestDue = principalAmount * 0.1
  const totalAmountDue = principalAmount + totalInterestDue
  const remainingBalance = Math.max(0, totalAmountDue - totalPaid)
  const completionPercentage = Math.min(100, (totalPaid / totalAmountDue) * 100)

  useEffect(() => {
    const isFullyPaid = totalPaid >= totalAmountDue
    const newStatus = isFullyPaid ? "completed" : "active"

    if (newStatus !== completionStatus) {
      setCompletionStatus(newStatus)
      onStatusUpdate?.(newStatus)
    }
  }, [totalPaid, totalAmountDue, completionStatus, onStatusUpdate])

  const handleMarkComplete = () => {
    setCompletionStatus("completed")
    onStatusUpdate?.("completed")
  }

  return (
    <Card className="gradient-card radiant-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Loan Completion Status</CardTitle>
          <Badge
            variant={completionStatus === "completed" ? "default" : "secondary"}
            className={completionStatus === "completed" ? "bg-green-500" : ""}
          >
            {completionStatus === "completed" ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" /> Fully Paid
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 mr-1" /> Active
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Payment Progress</span>
            <span>{completionPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Principal Amount</p>
            <p className="font-semibold">₱{principalAmount.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Interest Due (10%)</p>
            <p className="font-semibold">₱{totalInterestDue.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Total Paid</p>
            <p className="font-semibold text-green-600">₱{totalPaid.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Remaining Balance</p>
            <p className={`font-semibold ${remainingBalance === 0 ? "text-green-600" : "text-orange-600"}`}>
              ₱{remainingBalance.toLocaleString()}
            </p>
          </div>
        </div>

        {completionStatus === "active" && remainingBalance === 0 && (
          <div className="pt-2">
            <Button onClick={handleMarkComplete} className="w-full gradient-primary">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Fully Paid
            </Button>
          </div>
        )}

        {completionStatus === "completed" && (
          <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">Loan Fully Paid - No longer active</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
