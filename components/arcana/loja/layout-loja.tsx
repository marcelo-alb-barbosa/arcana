import type React from "react"
import { ArrowLeft, Coins } from "lucide-react"
import Link from "next/link"

interface LayoutLojaProps {
  children: React.ReactNode
  pageTitle?: string
  userCredits?: number
}

export function LayoutLoja({ children, pageTitle = "O Cofre Arcano", userCredits = 0 }: LayoutLojaProps) {
  return (
    <div className="min-h-screen bg-deep-black text-aged-bone flex flex-col items-center pt-16 sm:pt-20 pb-8 px-4 relative bg-noise-pattern">
      <div className="absolute top-6 left-6 flex items-center space-x-4">
        <Link href="/" className="text-aged-bone hover:text-blood-red transition-colors z-10">
          <ArrowLeft size={32} strokeWidth={1.5} />
          <span className="sr-only">Voltar para Home</span>
        </Link>
      </div>
      <div className="absolute top-6 right-6 flex items-center text-aged-bone/80">
        <Coins size={20} className="mr-1.5 text-yellow-400" />
        <span className="text-sm font-serifRegular">{userCredits} Créditos</span>
      </div>

      <h1 className="font-cinzel text-3xl md:text-4xl text-aged-bone mb-8 md:mb-12 text-center animate-fadeIn">
        {pageTitle}
      </h1>
      <div className="w-full max-w-3xl animate-fadeInUp space-y-6 md:space-y-8">{children}</div>
    </div>
  )
}
