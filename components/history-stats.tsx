"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/database"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

interface HistoryStatsData {
  totalLoansIssued: number
  totalAmountLent: number
  totalCollected: number
  totalPenalties: number
  activeLoans: number
  completedLoans: number
  overdueLoans: number
  collectionRate: number
}

export function HistoryStats() {
  const [stats, setStats] = useState<HistoryStatsData>({
    totalLoansIssued: 0,
    totalAmountLent: 0,
    totalCollected: 0,
    totalPenalties: 0,
    activeLoans: 0,
    completedLoans: 0,
    overdueLoans: 0,
    collectionRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHistoryStats()
  }, [])

  const fetchHistoryStats = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockStats: HistoryStatsData = {
        totalLoansIssued: 25,
        totalAmountLent: 12500000, // ₱12.5M
        totalCollected: 8750000, // ₱8.75M
        totalPenalties: 125000, // ₱125K
        activeLoans: 15,
        completedLoans: 8,
        overdueLoans: 2,
        collectionRate: 87.5, // 87.5%
      }

      setStats(mockStats)
    } catch (error) {
      console.error("Failed to fetch history stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Total Loans Issued
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.totalLoansIssued}</div>
          <p className="text-sm text-muted-foreground">{formatCurrency(stats.totalAmountLent)} total value</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Collection Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.collectionRate}%</div>
          <p className="text-sm text-muted-foreground">{formatCurrency(stats.totalCollected)} collected</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Overdue Loans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.overdueLoans}</div>
          <p className="text-sm text-muted-foreground">{formatCurrency(stats.totalPenalties)} in penalties</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Loan Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Active:</span>
              <span className="font-medium">{stats.activeLoans}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Completed:</span>
              <span className="font-medium text-green-600">{stats.completedLoans}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
