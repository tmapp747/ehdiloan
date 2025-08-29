"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function LogoutButton({ variant = "outline", size = "sm", className }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast.success("Logged out successfully")
      router.push("/")
    } catch (error: any) {
      console.error("[v0] Logout error:", error)
      toast.error("Error logging out: " + error.message)
      if (error.message.includes("Supabase configuration")) {
        localStorage.clear()
        sessionStorage.clear()
        router.push("/")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout} className={className} disabled={isLoading}>
      <LogOut className="w-4 h-4 mr-2" />
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  )
}
