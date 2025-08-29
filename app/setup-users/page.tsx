"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SetupUsersPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const setupUsers = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    try {
      console.log("[v0] Starting user setup process")

      // Create Edwin (Lender)
      const { data: edwinData, error: edwinError } = await supabase.auth.signUp({
        email: "ehdiwin@747ph.live",
        password: "Loan@2025",
        options: {
          emailRedirectTo: `${window.location.origin}/lender`,
        },
      })

      if (edwinError) {
        console.log("[v0] Edwin creation error:", edwinError)
        if (edwinError.message !== "User already registered") {
          throw edwinError
        }
      } else {
        console.log("[v0] Edwin created successfully:", edwinData)
      }

      // Create Marc (Broker)
      const { data: marcData, error: marcError } = await supabase.auth.signUp({
        email: "bossmarc@747ph.live",
        password: "Loan@2025",
        options: {
          emailRedirectTo: `${window.location.origin}/broker`,
        },
      })

      if (marcError) {
        console.log("[v0] Marc creation error:", marcError)
        if (marcError.message !== "User already registered") {
          throw marcError
        }
      } else {
        console.log("[v0] Marc created successfully:", marcData)
      }

      if (edwinData?.user) {
        const { error: profileError } = await supabase.from("users").upsert({
          id: edwinData.user.id,
          full_name: "Boss Edwin",
          role: "lender",
          username: "ehdiwin",
          phone: "09123456789",
        })

        if (profileError) console.log("[v0] Edwin profile error:", profileError)
      }

      if (marcData?.user) {
        const { error: profileError } = await supabase.from("users").upsert({
          id: marcData.user.id,
          full_name: "Boss Marc",
          role: "broker",
          username: "bossmarc",
          phone: "09182156660",
        })

        if (profileError) console.log("[v0] Marc profile error:", profileError)
      }

      setMessage("Users created successfully! You can now log in with the credentials.")

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error: any) {
      console.log("[v0] Setup error:", error)
      setError(error.message || "Failed to create users")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Setup EhdiLoan Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>This will create the following users:</p>
            <ul className="mt-2 space-y-1">
              <li>• ehdiwin@747ph.live (Lender)</li>
              <li>• bossmarc@747ph.live (Broker)</li>
            </ul>
            <p className="mt-2">Password for both: Loan@2025</p>
          </div>

          {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</div>}

          {message && <div className="text-sm text-green-500 bg-green-50 p-3 rounded">{message}</div>}

          <Button onClick={setupUsers} disabled={isLoading} className="w-full">
            {isLoading ? "Creating Users..." : "Create Users"}
          </Button>

          <Button variant="outline" onClick={() => router.push("/")} className="w-full">
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
