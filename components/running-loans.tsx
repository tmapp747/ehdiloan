"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Phone, User, DollarSign, Clock, ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

interface RunningLoan {
  id: number
  borrower_name: string
  borrower_contact: string
  loan_amount: number
  status: string
  approved_at: string
  due_date: string
  payment_proof?: string
  principal_paid: number
  interest_paid: number
  total_due: number
}

export function RunningLoans() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [loans, setLoans] = useState<RunningLoan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRunningLoans()
  }, [])

  const fetchRunningLoans = async () => {
    try {
      const response = await fetch("/api/loan-requests?type=running")
      if (response.ok) {
        const data = await response.json()
        setLoans(data)
      }
    } catch (error) {
      console.error("Failed to fetch running loans:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      case "paid":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (loans.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Running Loans</h3>
        <p className="text-muted-foreground">All loans have been completed or there are no active loans.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <Card key={loan.id} className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                {loan.borrower_name}
              </CardTitle>
              <Badge className={getStatusColor(loan.status)}>
                {loan.status === "approved" ? "ACTIVE" : loan.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span>{loan.borrower_contact}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Principal:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(loan.loan_amount)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Total Due:</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(loan.total_due)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Interest Rate:</span>
                  <span className="text-orange-600 font-semibold">10%</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Loan Date:</span>
                  <span>{new Date(loan.approved_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Due Date:</span>
                  <span className="font-semibold text-red-600">{new Date(loan.due_date).toLocaleDateString()}</span>
                </div>

                {loan.payment_proof && (
                  <div className="flex items-center gap-2 text-sm">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Payment Proof:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedImage(loan.payment_proof!)}
                      className="h-8 px-3"
                    >
                      View Screenshot
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Send Payment Reminder
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Mark as Paid
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Payment Proof</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedImage(null)}>
                ✕
              </Button>
            </div>
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Payment proof screenshot"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
