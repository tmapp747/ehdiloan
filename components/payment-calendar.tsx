"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/database"
import { Calendar, Clock, AlertTriangle } from "lucide-react"

interface UpcomingPayment {
  id: number
  borrowerName: string
  amount: number
  dueDate: string
  status: "upcoming" | "overdue" | "due_today"
  daysUntilDue: number
}

export function PaymentCalendar() {
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingPayments()
  }, [])

  const fetchUpcomingPayments = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockPayments: UpcomingPayment[] = [
        {
          id: 1,
          borrowerName: "Juan Dela Cruz",
          amount: 55000,
          dueDate: "2024-02-15",
          status: "due_today",
          daysUntilDue: 0,
        },
        {
          id: 2,
          borrowerName: "Maria Santos",
          amount: 86625, // 82500 + 4125 penalty
          dueDate: "2024-02-01",
          status: "overdue",
          daysUntilDue: -15,
        },
        {
          id: 3,
          borrowerName: "Ana Rodriguez",
          amount: 45000,
          dueDate: "2024-02-20",
          status: "upcoming",
          daysUntilDue: 5,
        },
        {
          id: 4,
          borrowerName: "Carlos Mendoza",
          amount: 62000,
          dueDate: "2024-02-25",
          status: "upcoming",
          daysUntilDue: 10,
        },
      ]

      setUpcomingPayments(mockPayments)
    } catch (error) {
      console.error("Failed to fetch upcoming payments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string, daysUntilDue: number) => {
    switch (status) {
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 border-red-200">OVERDUE</Badge>
      case "due_today":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">DUE TODAY</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{daysUntilDue} DAYS</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "due_today":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <Calendar className="h-4 w-4 text-blue-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {upcomingPayments.map((payment) => (
        <Card key={payment.id} className="hover:bg-muted/50 transition-colors">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(payment.status)}
                <span className="font-medium text-sm">{payment.borrowerName}</span>
              </div>
              {getStatusBadge(payment.status, payment.daysUntilDue)}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{formatCurrency(payment.amount)}</span>
              <span className="text-xs text-muted-foreground">{new Date(payment.dueDate).toLocaleDateString()}</span>
            </div>
            {payment.status === "overdue" && (
              <p className="text-xs text-red-600 mt-1">
                {Math.abs(payment.daysUntilDue)} days overdue - includes penalty
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
