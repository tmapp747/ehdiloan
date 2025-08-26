"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { formatCurrency, formatDate, type Loan } from "@/lib/database"
import Link from "next/link"

interface LoanWithHistory extends Loan {
  total_paid: number
  overdue_amount: number
  penalty_amount: number
  next_due_date: string
  payment_status: "current" | "overdue" | "completed"
  days_overdue: number
}

export function LoanHistoryTable() {
  const [loans, setLoans] = useState<LoanWithHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLoanHistory()
  }, [])

  const fetchLoanHistory = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockLoans: LoanWithHistory[] = [
        {
          id: 1,
          request_id: 1,
          loan_amount: 500000,
          interest_rate: 10,
          penalty_rate: 5,
          loan_term_months: 12,
          monthly_payment: 55000,
          start_date: "2024-01-15",
          status: "active",
          created_at: "2024-01-15T00:00:00Z",
          borrower_name: "Juan Dela Cruz",
          total_paid: 110000,
          overdue_amount: 0,
          penalty_amount: 0,
          next_due_date: "2024-03-15",
          payment_status: "current",
          days_overdue: 0,
        },
        {
          id: 2,
          request_id: 2,
          loan_amount: 750000,
          interest_rate: 10,
          penalty_rate: 5,
          loan_term_months: 12,
          monthly_payment: 82500,
          start_date: "2023-12-01",
          status: "active",
          created_at: "2023-12-01T00:00:00Z",
          borrower_name: "Maria Santos",
          total_paid: 247500,
          overdue_amount: 82500,
          penalty_amount: 4125, // 5% penalty on overdue amount
          next_due_date: "2024-02-01",
          payment_status: "overdue",
          days_overdue: 15,
        },
        {
          id: 3,
          request_id: 3,
          loan_amount: 300000,
          interest_rate: 10,
          penalty_rate: 5,
          loan_term_months: 6,
          monthly_payment: 55000,
          start_date: "2023-08-01",
          status: "completed",
          created_at: "2023-08-01T00:00:00Z",
          borrower_name: "Roberto Garcia",
          total_paid: 330000,
          overdue_amount: 0,
          penalty_amount: 0,
          next_due_date: "",
          payment_status: "completed",
          days_overdue: 0,
        },
      ]

      setLoans(mockLoans)
    } catch (error) {
      console.error("Failed to fetch loan history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (status === "completed") {
      return <Badge className="bg-green-100 text-green-800 border-green-200">COMPLETED</Badge>
    }
    if (paymentStatus === "overdue") {
      return <Badge className="bg-red-100 text-red-800 border-red-200">OVERDUE</Badge>
    }
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">ACTIVE</Badge>
  }

  const getStatusIcon = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
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

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Borrower</TableHead>
            <TableHead>Loan Amount</TableHead>
            <TableHead>Monthly Payment</TableHead>
            <TableHead>Total Paid</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Penalty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Due</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(loan.payment_status)}
                  <div>
                    <p className="font-medium">{loan.borrower_name}</p>
                    <p className="text-xs text-muted-foreground">Loan #{loan.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold">{formatCurrency(loan.loan_amount)}</p>
                  <p className="text-xs text-muted-foreground">{loan.interest_rate}% interest</p>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-medium">{formatCurrency(loan.monthly_payment)}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium text-green-600">{formatCurrency(loan.total_paid)}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium">{formatCurrency(loan.loan_amount - loan.total_paid)}</p>
              </TableCell>
              <TableCell>
                {loan.penalty_amount > 0 ? (
                  <div>
                    <p className="font-medium text-red-600">{formatCurrency(loan.penalty_amount)}</p>
                    <p className="text-xs text-muted-foreground">{loan.days_overdue} days overdue</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">None</p>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(loan.status, loan.payment_status)}</TableCell>
              <TableCell>
                {loan.next_due_date ? (
                  <div>
                    <p className="text-sm">{formatDate(loan.next_due_date)}</p>
                    {loan.payment_status === "overdue" && <p className="text-xs text-red-600">Overdue</p>}
                  </div>
                ) : (
                  <p className="text-muted-foreground">N/A</p>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/history/${loan.id}`}>
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                  </Link>
                  {loan.status === "active" && (
                    <Link href={`/payment/${loan.id}`}>
                      <Button size="sm" className="gap-1">
                        Pay
                      </Button>
                    </Link>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
