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

    try {
      console.log("[v0] Starting login process for:", email)

      const supabase = createClient()
      console.log("[v0] Supabase client created successfully")

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[v0] Auth response:", { data, error })

      if (error) throw error

      if (!data.user) {
        throw new Error("No user data returned")
      }

      console.log("[v0] User authenticated, fetching profile for ID:", data.user.id)

      const role = email.includes("ehdiwin") ? "lender" : "broker"
      const username = email.includes("ehdiwin") ? "Edwin" : "Marc"

      toast.success(`Welcome, ${username}!`)

      if (role === "lender") {
        window.location.href = "/lender"
      } else {
        window.location.href = "/broker"
      }
    } catch (error: any) {
      console.error("[v0] Login error:", error)
      toast.error(error.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center items-center space-x-4">
            <Image
              src="/images/747-mascot-happy.png"
              alt="747 Mascot"
              width={80}
              height={80}
              className="object-contain mascot-bounce"
            />
            <Image
              src="/images/ehdiloan-logo.png"
              alt="EhdiLoan Logo"
              width={200}
              height={120}
              className="object-contain"
            />
            <Image
              src="/images/747-mascot-banner.png"
              alt="747 Mascot with Banner"
              width={80}
              height={80}
              className="object-contain mascot-bounce"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-747-blue">Smart Lending Solutions</h2>
            <p className="text-muted-foreground">Streamline your loan management with our professional platform</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-747-green rounded-full"></span>
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-747-blue rounded-full"></span>
                <span>Fast</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Reliable</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="gradient-747-light radiant-shadow-lg border border-747-blue/20">
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
                  placeholder="ehdiwin@747ph.live or bossmarc@747ph.live"
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
                  placeholder="Loan@2025"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="radiant-shadow"
                />
              </div>
              <Button
                type="submit"
                className="w-full gradient-747 text-white radiant-shadow hover:radiant-shadow-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center space-y-2">
              <div className="text-xs text-muted-foreground">
                <p className="font-medium">Production Credentials:</p>
                <p>Edwin: ehdiwin@747ph.live</p>
                <p>Marc: bossmarc@747ph.live</p>
                <p>Password: Loan@2025</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/setup-users")} className="text-xs">
                Create Initial Users
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>© 2025 EhdiLoan. Professional loan management platform powered by 747.</p>
        </div>
      </div>
    </div>
  )
}
