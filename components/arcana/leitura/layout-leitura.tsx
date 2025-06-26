import type React from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface LayoutLeituraProps {
  children: React.ReactNode
  stageTitle?: string
}

export function LayoutLeitura({ children, stageTitle }: LayoutLeituraProps) {
  return (
    <div className="min-h-screen bg-deep-black text-aged-bone relative bg-noise-pattern overflow-hidden">
      {/* Header fixo no topo */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 sm:p-6 bg-deep-black/80 backdrop-blur-sm border-b border-blood-red/20">
        <Link href="/" className="text-aged-bone hover:text-blood-red transition-colors">
          <ArrowLeft size={28} strokeWidth={1.5} className="sm:w-8 sm:h-8" />
          <span className="sr-only">Voltar para Home</span>
        </Link>

        {/* Título responsivo */}
        {stageTitle && (
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center max-w-[60%] sm:max-w-none">
            <h1 className="font-cinzel text-lg sm:text-2xl md:text-3xl lg:text-4xl text-aged-bone animate-fadeIn leading-tight">
              {stageTitle}
            </h1>
          </div>
        )}

        {/* Espaço para balanceamento */}
        <div className="w-7 sm:w-8"></div>
      </div>

      {/* Conteúdo principal - com padding-top para compensar o header fixo */}
      <div className="pt-20 sm:pt-24 h-screen">{children}</div>
    </div>
  )
}
