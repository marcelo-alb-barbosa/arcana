"use client"

import { ArrowLeft } from "lucide-react"
import { SmoothButton } from "./smooth-button"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  href?: string
  onClick?: () => void
  label?: string
  showLabel?: boolean
  className?: string
}

export function BackButton({ href = "/", onClick, label = "Voltar", showLabel = false, className = "" }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <SmoothButton
      onClick={handleClick}
      variant="ghost"
      className={`text-aged-bone hover:bg-aged-bone/10 font-cinzel ${!showLabel ? 'p-2 rounded-full' : ''} ${className}`}
      aria-label={label}
    >
      <ArrowLeft className={`${showLabel ? 'w-4 h-4 mr-2' : 'w-5 h-5'}`} />
      {showLabel && label}
    </SmoothButton>
  )
}
