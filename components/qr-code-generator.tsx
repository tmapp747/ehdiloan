"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/database"
import Image from "next/image"

interface QRCodeGeneratorProps {
  method: "gcash" | "maya"
  amount: number
  recipient: "Ehdiwin" | "Bossmarc"
  loanId: number
}

export function QRCodeGenerator({ method, amount, recipient, loanId }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const { toast } = useToast()

  const getQRCodeImage = () => {
    if (recipient === "Bossmarc") {
      return method === "gcash" ? "/images/gcash-ma.png" : "/images/maya-ma.png"
    } else {
      return "/images/gcash-ju.png" // Edwin only has GCash
    }
  }

  const paymentDetails = {
    gcash: {
      name: recipient === "Bossmarc" ? "MA*C RO***D A." : "JU*E V.",
      number: recipient === "Bossmarc" ? "0918 215 ****" : "+63 956 996 ****",
      color: "blue",
    },
    maya: {
      name: "MARC ROLAND AGBAY",
      number: "+63 *** *** 6660",
      color: "green",
    },
  }

  useEffect(() => {
    setQrCodeUrl(getQRCodeImage())
  }, [method, recipient])

  const copyPaymentDetails = () => {
    const details = `
Payment Details:
Method: ${method.toUpperCase()}
Recipient: ${paymentDetails[method].name}
Number: ${paymentDetails[method].number}
Amount: ${formatCurrency(amount)}
Reference: LOAN-${loanId}
    `.trim()

    navigator.clipboard.writeText(details)
    toast({
      title: "Copied!",
      description: "Payment details copied to clipboard.",
    })
  }

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a")
      link.href = qrCodeUrl
      link.download = `${method}-payment-qr-${recipient.toLowerCase()}.png`
      link.click()
    }
  }

  return (
    <Card className="gradient-card radiant-shadow">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-48 h-48 border-2 border-muted rounded-lg flex items-center justify-center bg-white overflow-hidden">
            {qrCodeUrl ? (
              <Image
                src={qrCodeUrl || "/placeholder.svg"}
                alt={`${method} QR Code for ${recipient}`}
                width={192}
                height={192}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center">
                <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Loading QR Code...</p>
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method:</span>
              <span className="font-medium">{method.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient:</span>
              <span className="font-medium">{paymentDetails[method].name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number:</span>
              <span className="font-medium">{paymentDetails[method].number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold text-lg">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference:</span>
              <span className="font-medium">LOAN-{loanId}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={copyPaymentDetails}
              className="gap-2 bg-transparent radiant-shadow"
            >
              <Copy className="h-4 w-4" />
              Copy Details
            </Button>
            <Button variant="outline" size="sm" onClick={downloadQR} className="gap-2 bg-transparent radiant-shadow">
              <Download className="h-4 w-4" />
              Download QR
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Scan this QR code with your {method.toUpperCase()} app or use the payment details above
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
