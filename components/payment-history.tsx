"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDateTime } from "@/lib/database"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface PaymentHistoryProps {
  loanId: string
}

interface PaymentRecord {
  id: number
  payment_date: string
  amount_paid: number
  principal_amount: number
  interest_amount: number
  penalty_amount: number
  payment_method: string
  status: "verified" | "pending" | "rejected"
  late_days: number
}

export function PaymentHistory({ loanId }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPaymentHistory()
  }, [loanId])

  const fetchPaymentHistory = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockPayments: PaymentRecord[] = [
        {
          id: 1,
          payment_date: "2024-01-15T10:30:00Z",
          amount_paid: 55000,
          principal_amount: 50000,
          interest_amount: 5000,
          penalty_amount: 0,
          payment_method: "gcash",
          status: "verified",
          late_days: 0,
        },
        {
          id: 2,
          payment_date: "2024-02-15T14:20:00Z",
          amount_paid: 55000,
          principal_amount: 50000,
          interest_amount: 5000,
          penalty_amount: 0,
          payment_method: "maya",
          status: "verified",
          late_days: 0,
        },
        {
          id: 3,
          payment_date: "2024-03-20T09:15:00Z",
          amount_paid: 57750, // 55000 + 2750 penalty (5% of 55000)
          principal_amount: 50000,
          interest_amount: 5000,
          penalty_amount: 2750,
          payment_method: "gcash",
          status: "pending",
          late_days: 5,
        },
      ]

      setPayments(mockPayments)
    } catch (error) {
      console.error("Failed to fetch payment history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 border-green-200">VERIFIED</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">REJECTED</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">PENDING</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount_paid, 0)
  const totalPenalties = payments.reduce((sum, payment) => sum + payment.penalty_amount, 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground">Total Payments</p>
          <p className="font-semibold text-lg">{formatCurrency(totalPaid)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Penalties</p>
          <p className="font-semibold text-lg text-red-600">{formatCurrency(totalPenalties)}</p>
        </div>
      </div>

      {/* Payment Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Breakdown</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{formatDateTime(payment.payment_date)}</p>
                  {payment.late_days > 0 && <p className="text-xs text-red-600">{payment.late_days} days late</p>}
                </div>
              </TableCell>
              <TableCell>
                <p className="font-semibold">{formatCurrency(payment.amount_paid)}</p>
              </TableCell>
              <TableCell>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Principal:</span>
                    <span>{formatCurrency(payment.principal_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest:</span>
                    <span>{formatCurrency(payment.interest_amount)}</span>
                  </div>
                  {payment.penalty_amount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Penalty:</span>
                      <span>{formatCurrency(payment.penalty_amount)}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="capitalize">{payment.payment_method}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(payment.status)}
                  {getStatusBadge(payment.status)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
