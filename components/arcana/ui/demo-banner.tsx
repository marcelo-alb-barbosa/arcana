"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"

export function DemoBanner() {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const demoMode = localStorage.getItem("arcana-demo-mode") === "true"
    setIsDemoMode(demoMode)
  }, [])

  if (!mounted || !isDemoMode) return null

  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-600/90 text-black z-50 py-1 px-4 text-center text-sm font-medium flex items-center justify-center">
      <AlertCircle className="h-4 w-4 mr-2" />
      <span>Para demonstração - Ambiente de testes</span>
    </div>
  )
}
