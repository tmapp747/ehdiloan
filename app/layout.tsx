import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "EhdiLoan - Professional Loan Management Platform",
  description:
    "Streamline your lending business with EhdiLoan. Manage loan requests, approvals, payments, and track borrower history with our comprehensive financial platform.",
  keywords: "loan management, lending platform, financial services, loan tracking, payment processing, EhdiLoan",
  authors: [{ name: "EhdiLoan Team" }],
  creator: "EhdiLoan",
  publisher: "EhdiLoan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ehdiloan.vercel.app"),
  openGraph: {
    title: "EhdiLoan - Professional Loan Management Platform",
    description:
      "Streamline your lending business with EhdiLoan. Manage loan requests, approvals, payments, and track borrower history.",
    type: "website",
    locale: "en_US",
    siteName: "EhdiLoan",
  },
  twitter: {
    card: "summary_large_image",
    title: "EhdiLoan - Professional Loan Management Platform",
    description:
      "Streamline your lending business with EhdiLoan. Manage loan requests, approvals, payments, and track borrower history.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>{children}</body>
    </html>
  )
}
