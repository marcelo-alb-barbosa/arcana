"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SmoothButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function SmoothButton({
  children,
  onClick,
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
  type = "button",
}: SmoothButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = () => {
    if (disabled) return

    setIsPressed(true)

    // Call onClick immediately
    if (onClick) {
      onClick()
    }

    // Just reset the pressed state after a short delay
    setTimeout(() => {
      setIsPressed(false)
    }, 100)
  }

  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={handleClick}
      className={`btn-press transition-all duration-200 ${isPressed ? "scale-95" : ""} ${className}`}
    >
      {children}
    </Button>
  )
}
