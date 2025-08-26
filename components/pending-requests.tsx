"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock, User, Phone } from "lucide-react"
import { formatCurrency, formatDateTime, type LoanRequest } from "@/lib/database"
import Link from "next/link"

export function PendingRequests() {
  const [requests, setRequests] = useState<LoanRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPendingRequests()
  }, [])

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch("/api/loan-requests?status=pending")
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Failed to fetch pending requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 bg-muted rounded w-1/3"></div>
              <div className="h-6 bg-muted rounded w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Pending Requests</h3>
        <p className="text-muted-foreground">All loan requests have been reviewed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">{request.borrower_name}</h3>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                PENDING
              </Badge>
            </div>
            <Link href={`/lender/approve/${request.id}`}>
              <Button size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                View
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Loan Amount</p>
              <p className="font-semibold text-lg text-foreground">{formatCurrency(request.loan_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact</p>
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <p className="text-sm text-foreground">{request.borrower_contact}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requested</p>
              <p className="text-sm text-foreground">{formatDateTime(request.requested_at)}</p>
            </div>
          </div>

          {request.purpose && (
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-1">Purpose</p>
              <p className="text-sm text-foreground bg-muted/50 p-2 rounded">{request.purpose}</p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Broker: Boss Marc</span>
            <span>Request ID: #{request.id}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
