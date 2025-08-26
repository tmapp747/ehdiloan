"use client"

import { useState, useEffect } from "react"

export function DigitalClock() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-PH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="bg-card border rounded-lg p-4 text-center">
      <div className="text-2xl font-mono font-bold text-primary mb-2">{formatTime(currentTime)}</div>
      <div className="text-sm text-muted-foreground">{formatDate(currentTime)}</div>
    </div>
  )
}
