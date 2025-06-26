"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Skull } from "lucide-react"
import type { TarotCardData } from "@/lib/tarot-data"

interface CartaTarotProps {
  carta: TarotCardData | null
  revelada: boolean
  modo: "audio" | "texto"
  posicao: string
}

export function CartaTarot({ carta, revelada, modo, posicao }: CartaTarotProps) {
  const [imagemCarregada, setImagemCarregada] = useState(false)

  if (!carta) {
    return (
      <div className="w-20 h-[140px] sm:w-24 sm:h-[168px] md:w-28 md:h-[196px] lg:w-32 lg:h-[224px] bg-aged-bone/10 border border-aged-bone/30 rounded-lg animate-pulse" />
    )
  }

  return (
    <div className="relative group">
      <Card
        className={`
          w-20 h-[140px] sm:w-24 sm:h-[168px] md:w-28 md:h-[196px] lg:w-32 lg:h-[224px]
          bg-deep-black border-2 border-aged-bone/30 
          shadow-2xl shadow-black/50 
          transform-gpu transition-all duration-700 ease-in-out
          ${revelada ? "rotate-y-180" : ""}
          preserve-3d cursor-pointer hover:scale-105
        `}
        style={{
          transformStyle: "preserve-3d",
          transform: revelada ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Verso da carta (caveira) */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-blood-red via-blood-red/90 to-blood-red/70 rounded-lg border-2 border-aged-bone/40 flex flex-col items-center justify-center p-2">
            {/* Borda interna decorativa */}
            <div className="absolute inset-2 border border-aged-bone/20 rounded-md" />

            {/* Caveira central */}
            <Skull className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-aged-bone mb-2 drop-shadow-lg" />

            {/* Texto ARCANA */}
            <div className="text-aged-bone font-cinzel text-xs sm:text-sm font-bold tracking-wider drop-shadow-md">
              ARCANA
            </div>

            {/* Padrão decorativo sutil */}
            <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-aged-bone/30" />
            <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-aged-bone/30" />
            <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-aged-bone/30" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-aged-bone/30" />
          </div>
        </div>

        {/* Frente da carta (revelada) */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-full h-full bg-aged-bone rounded-lg overflow-hidden border-2 border-blood-red/30">
            {/* Imagem da carta */}
            <div className="relative w-full h-3/4 overflow-hidden">
              <img
                src={carta.imagem || "/placeholder.svg?height=200&width=140&query=tarot card"}
                alt={carta.nome}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imagemCarregada ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImagemCarregada(true)}
              />
              {!imagemCarregada && <div className="absolute inset-0 bg-aged-bone/20 animate-pulse" />}
            </div>

            {/* Área de texto expandida */}
            <div className="h-1/4 p-1.5 sm:p-2 bg-deep-black/90 flex flex-col justify-center">
              <h3 className="font-cinzel text-aged-bone text-xs sm:text-sm font-bold text-center leading-tight mb-1">
                {carta.nome}
              </h3>
              <p className="font-serifRegular text-aged-bone/80 text-[10px] sm:text-xs text-center leading-tight line-clamp-2">
                {carta.resumo}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
