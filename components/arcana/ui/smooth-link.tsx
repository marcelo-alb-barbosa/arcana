"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SmoothLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function SmoothLink({ href, children, className = "", onClick }: SmoothLinkProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (onClick) {
      onClick()
    }

    setIsNavigating(true)

    // Pequeno delay para mostrar o feedback visual
    setTimeout(() => {
      router.push(href)
    }, 150)
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`smooth-link btn-press ${isNavigating ? "nav-loading" : ""} ${className}`}
    >
      {children}
    </Link>
  )
}
