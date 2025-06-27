import type React from "react"
import { ArrowLeft, Coins } from "lucide-react"
import Link from "next/link"

interface LayoutLojaProps {
  children: React.ReactNode
  pageTitle?: string
  userCredits?: number
}

export function LayoutLoja({ children, pageTitle = "O Cofre Arcano" }: LayoutLojaProps) {
  return (
    <div className="bg-deep-black text-aged-bone flex flex-col items-center pt-6 sm:pt-8 pb-8 px-4 relative bg-noise-pattern">

      <h1 className="font-cinzel text-3xl md:text-4xl text-aged-bone mb-8 md:mb-12 text-center animate-fadeIn">
        {pageTitle}
      </h1>
      <div className="w-full max-w-3xl animate-fadeInUp space-y-6 md:space-y-8">{children}</div>
    </div>
  )
}
