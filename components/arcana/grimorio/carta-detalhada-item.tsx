"use client"

import { useState, useEffect } from "react"
import type { TarotCardData } from "@/lib/tarot-data"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CartaDetalhadaEsqueleto } from "./carta-detalhada-esqueleto"
import { Play, Pause, Volume2 } from "lucide-react"

interface CartaDetalhadaItemProps {
  carta: TarotCardData
  index: number
}

export function CartaDetalhadaItem({ carta, index }: CartaDetalhadaItemProps) {
  const [isContentLoaded, setIsContentLoaded] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const baseDelay = 500
  const staggerDelay = 300

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsContentLoaded(true)
      },
      baseDelay + index * staggerDelay,
    )

    return () => clearTimeout(timer)
  }, [index])

  // Simular reprodução de áudio
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false)
            return 0
          }
          return prev + 2 // Simula progresso de 2% a cada 100ms (5 segundos total)
        })
      }, 100)
    } else {
      setAudioProgress(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlayingAudio])

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false)
      setAudioProgress(0)
    } else {
      setIsPlayingAudio(true)
      setAudioProgress(0)
    }
  }

  if (!isContentLoaded) {
    return <CartaDetalhadaEsqueleto />
  }

  const animationDelay = `${index * 100}ms`

  return (
    <Card
      className="bg-deep-black/50 border border-aged-bone/20 shadow-md text-aged-bone overflow-hidden opacity-0 animate-fadeInUp"
      style={{ animationDelay: animationDelay }}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 p-4 flex justify-center items-center">
          <div className="relative aspect-[2/3.5] w-40 sm:w-48 md:w-full max-w-xs mx-auto border-2 border-aged-bone/40 rounded-lg overflow-hidden shadow-bone-dust">
            <Image
              src={carta.imagemUrl || "/placeholder.svg"}
              alt={`Carta de Tarô: ${carta.nome}`}
              fill
              sizes="(max-width: 767px) 160px, (max-width: 1023px) 192px, 33vw"
              style={{ objectFit: "cover" }}
              priority={index < 2}
            />
          </div>
        </div>
        <div className="md:w-2/3">
          <CardHeader className="pt-4 md:pt-6 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-cinzel text-2xl md:text-3xl text-aged-bone/95">{carta.nome}</CardTitle>
                {carta.tipo === "Menor" && carta.naipe && (
                  <p className="text-sm text-bone-dust-gray font-serifRegular -mt-1">Arcano Menor - {carta.naipe}</p>
                )}
                {carta.tipo === "Maior" && (
                  <p className="text-sm text-bone-dust-gray font-serifRegular -mt-1">Arcano Maior</p>
                )}
              </div>
              <Button
                onClick={handleToggleAudio}
                variant="outline"
                size="sm"
                className={`border-blood-red/50 text-aged-bone hover:bg-blood-red/20 font-cinzel text-xs px-3 py-1 ${
                  isPlayingAudio ? "bg-blood-red/10" : ""
                }`}
              >
                {isPlayingAudio ? <Pause size={14} className="mr-1.5" /> : <Play size={14} className="mr-1.5" />}
                {isPlayingAudio ? "Pausar" : "Escutar"}
              </Button>
            </div>
            {isPlayingAudio && (
              <div className="mt-2">
                <div className="flex items-center text-xs text-aged-bone/70 mb-1">
                  <Volume2 size={12} className="mr-1" />
                  Reproduzindo conselho...
                </div>
                <div className="w-full bg-aged-bone/20 rounded-full h-1">
                  <div
                    className="bg-blood-red h-1 rounded-full transition-all duration-100"
                    style={{ width: `${audioProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-0 pb-4 md:pb-6">
            <p className="font-serifRegular text-base text-aged-bone/90 leading-relaxed whitespace-pre-line">
              {carta.interpretacaoCompleta || "Nenhuma interpretação detalhada disponível para esta carta."}
            </p>
            {carta.falaImpactante && (
              <blockquote className="mt-4 p-3 bg-aged-bone/5 border-l-4 border-blood-red/70 rounded-r-md">
                <p className="font-cinzel text-sm italic text-aged-bone">
                  O Oráculo sussurrou: "{carta.falaImpactante}"
                </p>
              </blockquote>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
