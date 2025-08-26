"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Get user profile to determine role
      const { data: profile } = await supabase.from("users").select("role, username").eq("id", data.user.id).single()

      if (profile) {
        toast.success(`Welcome back, ${profile.username}!`)

        // Redirect based on role
        if (profile.role === "lender") {
          router.push("/lender")
        } else {
          router.push("/broker")
        }
      } else {
        toast.error("User profile not found. Please contact support.")
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Image
              src="/images/ehdiloan-logo.png"
              alt="EhdiLoan Logo"
              width={200}
              height={120}
              className="object-contain"
            />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Smart Lending Solutions</h2>
            <p className="text-muted-foreground">Streamline your loan management with our professional platform</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Fast</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Reliable</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="gradient-card radiant-shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Access Your Dashboard</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="radiant-shadow"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="radiant-shadow"
                />
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary radiant-shadow hover:radiant-shadow-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="gradient-card radiant-shadow border-0 hover:radiant-shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Lender Portal</span>
              </CardTitle>
              <CardDescription>Review loan requests, approve funding, and track payments</CardDescription>
            </CardHeader>
          </Card>

          <Card className="gradient-card radiant-shadow border-0 hover:radiant-shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Broker Portal</span>
              </CardTitle>
              <CardDescription>Submit loan applications and manage client requests</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>© 2025 EhdiLoan. Professional loan management platform.</p>
        </div>
      </div>
    </div>
  )
}
