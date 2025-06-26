"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function PageTransition({ children, className = "", delay = 0 }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Pequeno delay para garantir que a página foi montada
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    // Backup timeout to ensure transition happens even if something goes wrong
    const maxTransitionTime = setTimeout(() => {
      if (!isVisible) {
        console.log("🔄 Forcing page transition after max time")
        setIsVisible(true)
      }
    }, 2000) // 2 seconds maximum

    return () => {
      clearTimeout(timer)
      clearTimeout(maxTransitionTime)
    }
  }, [delay, isClient, isVisible])

  // If we're not on the client yet, render without animation to prevent hydration mismatch
  if (!isClient) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      className={`transition-opacity duration-300 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  )
}
