import type React from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface LayoutLeituraProps {
  children: React.ReactNode
  stageTitle?: string
}

export function LayoutLeitura({ children, stageTitle }: LayoutLeituraProps) {
  return (
    <div className="bg-deep-black text-aged-bone relative bg-noise-pattern">
      {/* Título da etapa */}
      {stageTitle && (
        <div className="text-center py-4 sm:py-6">
          <h1 className="font-cinzel text-lg sm:text-2xl md:text-3xl lg:text-4xl text-aged-bone animate-fadeIn leading-tight">
            {stageTitle}
          </h1>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="min-h-screen">{children}</div>
    </div>
  )
}
