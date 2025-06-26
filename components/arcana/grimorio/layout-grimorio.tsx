import type React from "react"
import { ArrowLeft, BookHeart, Coins } from "lucide-react"
import Link from "next/link"

interface LayoutGrimorioProps {
  children: React.ReactNode
  userCredits?: number // Opcional, para consistência
}

export function LayoutGrimorio({ children, userCredits }: LayoutGrimorioProps) {
  return (
    <div className="min-h-screen bg-deep-black text-aged-bone flex flex-col items-center pt-16 sm:pt-20 pb-8 px-4 relative bg-noise-pattern">
      <div className="absolute top-6 left-6 flex items-center space-x-4 z-10">
        <Link href="/" className="text-aged-bone hover:text-blood-red transition-colors">
          <ArrowLeft size={32} strokeWidth={1.5} />
          <span className="sr-only">Voltar para Home</span>
        </Link>
      </div>
      {userCredits !== undefined && (
        <div className="absolute top-6 right-6 flex items-center text-aged-bone/80 z-10">
          <Coins size={20} className="mr-1.5 text-yellow-400" />
          <span className="text-sm font-serifRegular">{userCredits} Créditos</span>
        </div>
      )}

      <div className="flex flex-col items-center mb-8 md:mb-12 text-center animate-fadeIn">
        <BookHeart className="w-16 h-16 md:w-20 md:h-20 text-blood-red/70 mb-3" strokeWidth={1.5} />
        <h1 className="font-cinzel text-3xl md:text-4xl text-aged-bone">Meu Grimório Pessoal</h1>
        <p className="font-serifRegular text-sm text-bone-dust-gray mt-2 max-w-xl">
          Aqui repousam as memórias de suas jornadas pelos véus do ARCANA. Cada leitura, uma página de sabedoria.
        </p>
      </div>
      <div className="w-full max-w-3xl animate-fadeInUp space-y-6 md:space-y-8">{children}</div>
    </div>
  )
}
