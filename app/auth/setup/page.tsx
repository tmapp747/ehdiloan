"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function AuthSetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const createInitialUsers = async () => {
    setIsLoading(true)

    try {
      // Create Edwin (Lender)
      const { data: edwinAuth, error: edwinAuthError } = await supabase.auth.signUp({
        email: "edwin@ehdiloan.com",
        password: "Loan@2025",
        options: {
          data: {
            username: "Ehdiwin",
            role: "lender",
            full_name: "Boss Edwin",
          },
        },
      })

      if (edwinAuthError) throw edwinAuthError

      // Create Marc (Broker)
      const { data: marcAuth, error: marcAuthError } = await supabase.auth.signUp({
        email: "marc@ehdiloan.com",
        password: "Loan@2025",
        options: {
          data: {
            username: "Bossmarc",
            role: "broker",
            full_name: "Boss Marc",
          },
        },
      })

      if (marcAuthError) throw marcAuthError

      toast.success("Initial users created successfully!")
      toast.info("Edwin: edwin@ehdiloan.com | Marc: marc@ehdiloan.com | Password: Loan@2025")
    } catch (error: any) {
      toast.error("Error creating users: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Setup Initial Users</CardTitle>
          <CardDescription>Create the initial user accounts for Edwin (Lender) and Marc (Broker)</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={createInitialUsers} disabled={isLoading} className="w-full">
            {isLoading ? "Creating Users..." : "Create Initial Users"}
          </Button>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              <strong>Edwin (Lender):</strong> edwin@ehdiloan.com
            </p>
            <p>
              <strong>Marc (Broker):</strong> marc@ehdiloan.com
            </p>
            <p>
              <strong>Password:</strong> Loan@2025
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
