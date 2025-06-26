"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { TarotCardData } from "@/lib/tarot-data"
import Image from "next/image"
import { XSquare, Volume2, Pause } from "lucide-react"

interface FalaCartaModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  carta: TarotCardData | null
}

export function FalaCartaModal({ isOpen, onOpenChange, carta }: FalaCartaModalProps) {
  const [reproduzindo, setReproduzindo] = useState(false)
  const [audioSuportado, setAudioSuportado] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Verificar se Speech Synthesis API está disponível
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setAudioSuportado(true)
    }

    // Cleanup ao desmontar componente
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const reproduzirAudio = () => {
    if (!audioSuportado || !carta) return

    if (reproduzindo) {
      // Pausar áudio
      window.speechSynthesis.cancel()
      setReproduzindo(false)
      return
    }

    // Texto para falar
    const textoParaFalar = `${carta.nome} sussurra: ${carta.falaImpactante || carta.significado || "Observe além do véu da realidade comum"}`

    // Iniciar reprodução
    const utterance = new SpeechSynthesisUtterance(textoParaFalar)

    // Configurações de voz
    utterance.rate = 0.8 // Velocidade mais lenta para narrativa mística
    utterance.pitch = 0.9 // Tom ligeiramente mais grave
    utterance.volume = 0.9

    // Tentar usar uma voz em português se disponível
    const voices = window.speechSynthesis.getVoices()
    const portugueseVoice = voices.find((voice) => voice.lang.includes("pt") || voice.lang.includes("br"))
    if (portugueseVoice) {
      utterance.voice = portugueseVoice
    }

    // Event listeners
    utterance.onstart = () => {
      setReproduzindo(true)
    }

    utterance.onend = () => {
      setReproduzindo(false)
    }

    utterance.onerror = () => {
      setReproduzindo(false)
      console.error("Erro na reprodução de áudio")
    }

    speechSynthesisRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const fecharModal = () => {
    // Parar áudio se estiver reproduzindo
    if (reproduzindo) {
      window.speechSynthesis.cancel()
      setReproduzindo(false)
    }
    onOpenChange(false)
  }

  if (!carta) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-deep-black/90 border-2 border-blood-red text-aged-bone shadow-bone-dust sm:max-w-2xl backdrop-blur-md p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="font-cinzel text-2xl md:text-3xl text-aged-bone text-center">
            {carta.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Layout horizontal: Carta + Conteúdo */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Imagem da Carta */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative w-32 h-56 md:w-40 md:h-70 border-2 border-aged-bone/50 rounded-md overflow-hidden">
                <Image
                  src={carta.imagemUrl || "/placeholder.svg"}
                  alt={carta.nome}
                  fill
                  sizes="(max-width: 767px) 128px, 160px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Conteúdo da Carta */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-cinzel text-lg text-aged-bone mb-2">A Lição dos Arcanos:</h3>
                <DialogDescription className="font-serifRegular text-base text-aged-bone/90 leading-relaxed">
                  "
                  {carta.falaImpactante ||
                    carta.significado ||
                    "Observe além do véu da realidade comum e permita que a sabedoria ancestral guie seus passos."}
                  "
                </DialogDescription>
              </div>

              {/* Informações adicionais */}
              {carta.resumo && (
                <div>
                  <h4 className="font-cinzel text-sm text-aged-bone/80 mb-1">Essência:</h4>
                  <p className="font-serifRegular text-sm text-aged-bone/70">{carta.resumo}</p>
                </div>
              )}

              {/* Botão de Áudio */}
              {audioSuportado && (
                <div className="pt-2">
                  <Button
                    onClick={reproduzirAudio}
                    className={`${
                      reproduzindo ? "bg-blood-red/80 hover:bg-blood-red" : "bg-blood-red hover:bg-blood-red/80"
                    } text-aged-bone font-cinzel transition-all duration-300`}
                    size="sm"
                  >
                    {reproduzindo ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        Escutar
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 sm:justify-center">
          <DialogClose asChild>
            <Button
              type="button"
              className="bg-aged-bone text-deep-black hover:bg-aged-bone/80 font-cinzel w-full sm:w-auto"
              onClick={fecharModal}
            >
              <XSquare size={18} className="mr-2" />
              Continuar Jornada
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
