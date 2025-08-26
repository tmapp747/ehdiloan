"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDateTime, type LoanRequest } from "@/lib/database"

export function RecentRequests() {
  const [requests, setRequests] = useState<LoanRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/loan-requests?brokerId=2") // Boss Marc's ID
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No loan requests submitted yet.</p>
        <p className="text-sm">Submit your first request using the form.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.slice(0, 5).map((request) => (
        <div key={request.id} className="border rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{request.borrower_name}</h4>
            <Badge className={getStatusColor(request.status)}>{request.status.toUpperCase()}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(request.loan_amount)}</span>
            <span>{formatDateTime(request.requested_at)}</span>
          </div>
          {request.purpose && <p className="text-xs text-muted-foreground line-clamp-2">{request.purpose}</p>}
        </div>
      ))}
    </div>
  )
}
