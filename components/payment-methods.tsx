"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { QrCode, Smartphone } from "lucide-react"

interface PaymentMethodsProps {
  loanAmount: number
  recipient?: "Ehdiwin" | "Bossmarc"
}

export function PaymentMethods({ loanAmount, recipient = "Ehdiwin" }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<"gcash" | "maya" | null>(null)
  const [showQR, setShowQR] = useState(false)

  const handleMethodClick = (method: "gcash" | "maya") => {
    setSelectedMethod(method)
    setShowQR(true)
  }

  const availableMethods =
    recipient === "Bossmarc"
      ? [
          { key: "gcash", name: "GCash", color: "blue" },
          { key: "maya", name: "Maya", color: "green" },
        ]
      : [{ key: "gcash", name: "GCash", color: "blue" }]

  return (
    <>
      <div className={`grid gap-4 ${availableMethods.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
        {availableMethods.map((method) => (
          <Card
            key={method.key}
            className="cursor-pointer hover:bg-muted/50 transition-colors gradient-card radiant-shadow hover:radiant-shadow-lg"
            onClick={() => handleMethodClick(method.key as "gcash" | "maya")}
          >
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 bg-${method.color}-100 rounded-full flex items-center justify-center`}>
                  <Smartphone className={`h-6 w-6 text-${method.color}-600`} />
                </div>
                <h3 className="font-medium">{method.name}</h3>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent radiant-shadow">
                  <QrCode className="h-4 w-4" />
                  Show QR
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced QR Code Modal */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">{selectedMethod === "gcash" ? "GCash" : "Maya"} Payment</DialogTitle>
          </DialogHeader>
          {selectedMethod && (
            <QRCodeGenerator
              method={selectedMethod}
              amount={loanAmount}
              recipient={recipient}
              loanId={1} // This would be dynamic in a real app
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
