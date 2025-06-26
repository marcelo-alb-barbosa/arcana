"use client"

import { useState, useEffect, useCallback } from "react"
import type { TarotCardData } from "@/lib/tarot-data"
import { simularTiragemEspecifica } from "@/lib/tarot-data"
import { CartaTarot } from "./carta-tarot"
import { FalaCartaModal } from "./fala-carta-modal"
import { Button } from "@/components/ui/button"
import { Wand2, Loader2 } from "lucide-react"
import { SinteseNarrativa } from "./sintese-narrativa"

interface LancamentoCartasProps {
  modo: "audio" | "texto"
  pergunta: string
  onLeituraCompleta: (cartas: TarotCardData[], interpretacaoDialogo: string) => void
}

const TOTAL_CARTAS = 5
const DELAY_ENTRE_REVELACOES_AUDIO = 2500

// Sequência de revelação em ordem: 0, 1, 2, 3, 4
const SEQUENCIA_REVELACAO = [0, 1, 2, 3, 4]

export function LancamentoCartas({ modo, pergunta, onLeituraCompleta }: LancamentoCartasProps) {
  const [cartasTiradas, setCartasTiradas] = useState<(TarotCardData | null)[]>(Array(TOTAL_CARTAS).fill(null))
  const [cartasReveladasStatus, setCartasReveladasStatus] = useState<boolean[]>(Array(TOTAL_CARTAS).fill(false))
  const [indiceSequenciaAtual, setIndiceSequenciaAtual] = useState(-1) // Começar em -1 para não revelar automaticamente
  const [dialogoArcanos, setDialogoArcanos] = useState<string>("")
  const [baralhoDaSessao] = useState<TarotCardData[]>(() => simularTiragemEspecifica())
  const [ritualIniciado, setRitualIniciado] = useState(false)
  const [isModalFalaAberto, setIsModalFalaAberto] = useState(false)
  const [cartaModalAtual, setCartaModalAtual] = useState<TarotCardData | null>(null)
  const [aguardandoFecharModal, setAguardandoFecharModal] = useState(false)
  const [processandoLeitura, setProcessandoLeitura] = useState(false)
  const [mostrarSintese, setMostrarSintese] = useState(false)

  // Colocar todas as cartas na posição inicial quando o ritual começar
  useEffect(() => {
    if (ritualIniciado && cartasTiradas.every((carta) => carta === null)) {
      console.log("🎴 Colocando todas as cartas na mesa...")
      setCartasTiradas([...baralhoDaSessao])
    }
  }, [ritualIniciado, cartasTiradas, baralhoDaSessao])

  const atualizarDialogo = useCallback((cartasReveladasAteAgora: TarotCardData[]) => {
    const nomes = cartasReveladasAteAgora.map((c) => c.nome).join(" ⇾ ")
    setDialogoArcanos(nomes)
  }, [])

  const abrirModalComCarta = useCallback((carta: TarotCardData) => {
    setCartaModalAtual(carta)
    setIsModalFalaAberto(true)
    setAguardandoFecharModal(true)
  }, [])

  const revelarCartaAtual = useCallback(() => {
    const proximoIndice = indiceSequenciaAtual + 1

    console.log(`🎴 Tentando revelar carta ${proximoIndice + 1}/5 (índice atual: ${indiceSequenciaAtual})`)

    if (proximoIndice < TOTAL_CARTAS) {
      const posicaoCartaParaRevelar = SEQUENCIA_REVELACAO[proximoIndice]
      const cartaAtual = baralhoDaSessao[posicaoCartaParaRevelar]

      console.log(`🎴 Revelando carta ${proximoIndice + 1}/5 na posição ${posicaoCartaParaRevelar}:`, cartaAtual?.nome)

      if (cartaAtual) {
        // Atualizar o índice ANTES de revelar
        setIndiceSequenciaAtual(proximoIndice)

        // Revelar a carta com animação
        setTimeout(() => {
          setCartasReveladasStatus((prevStatus) => {
            const novoStatus = [...prevStatus]
            novoStatus[posicaoCartaParaRevelar] = true
            return novoStatus
          })

          // Atualizar diálogo com cartas reveladas até agora
          const cartasReveladas = SEQUENCIA_REVELACAO.slice(0, proximoIndice + 1)
            .map((pos) => baralhoDaSessao[pos])
            .filter(Boolean)

          atualizarDialogo(cartasReveladas)

          // Abrir modal após a carta ser revelada
          setTimeout(() => {
            abrirModalComCarta(cartaAtual)
          }, 500)
        }, 200)
      }
    }
  }, [indiceSequenciaAtual, baralhoDaSessao, atualizarDialogo, abrirModalComCarta])

  const proximaEtapaRevelacao = useCallback(() => {
    setAguardandoFecharModal(false)

    if (indiceSequenciaAtual < TOTAL_CARTAS - 1) {
      // Não incrementar aqui, será incrementado no revelarCartaAtual
      console.log(`🎴 Preparando próxima etapa. Índice atual: ${indiceSequenciaAtual}`)
    } else {
      // Todas as cartas foram reveladas
      console.log("🎴 Todas as cartas reveladas, processando leitura...")
      setProcessandoLeitura(true)
      const cartasFinais = baralhoDaSessao
      setTimeout(() => {
        setMostrarSintese(true)
        setProcessandoLeitura(false)
      }, 1500)
    }
  }, [indiceSequenciaAtual, baralhoDaSessao])

  // Auto-revelação para modo áudio
  useEffect(() => {
    if (ritualIniciado && !aguardandoFecharModal && indiceSequenciaAtual < TOTAL_CARTAS - 1 && modo === "audio") {
      const timer = setTimeout(revelarCartaAtual, DELAY_ENTRE_REVELACOES_AUDIO)
      return () => clearTimeout(timer)
    }
  }, [ritualIniciado, aguardandoFecharModal, indiceSequenciaAtual, modo, revelarCartaAtual])

  const handleIniciarRitualOuProxima = () => {
    if (!ritualIniciado) {
      console.log("🎭 Iniciando ritual...")
      setRitualIniciado(true)

      // Para modo texto, revelar a primeira carta após um delay
      if (modo === "texto") {
        setTimeout(revelarCartaAtual, 1000)
      }
    } else if (!aguardandoFecharModal && modo === "texto") {
      revelarCartaAtual()
    }
  }

  const handleFecharModalFala = () => {
    setIsModalFalaAberto(false)
    setTimeout(() => {
      proximaEtapaRevelacao()
    }, 100)
  }

  const mostrarBotaoProxima =
    ritualIniciado && modo === "texto" && indiceSequenciaAtual < TOTAL_CARTAS - 1 && !aguardandoFecharModal

  const todasCartasReveladas = cartasReveladasStatus.every((status) => status)

  return (
    <>
      <div className="fixed inset-0 bg-deep-black bg-noise-pattern overflow-hidden">
        {/* Container principal com altura fixa */}
        <div className="h-full flex flex-col">
          {/* Área do pentagrama - ocupa toda a tela disponível */}
          <div className="flex-1 flex items-center justify-center p-4 relative">
            {!ritualIniciado ? (
              /* Botão inicial centralizado */
              <div className="flex justify-center">
                <Button
                  onClick={handleIniciarRitualOuProxima}
                  className="bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel text-xl py-6 px-12 shadow-bone-dust transform hover:scale-105 transition-all duration-300"
                >
                  <Wand2 className="mr-3 h-8 w-8" />
                  Iniciar Revelação
                </Button>
              </div>
            ) : (
              /* Layout do Pentagrama */
              <div className="relative w-full h-full max-w-4xl max-h-[650px]">
                {/* SVG do Pentagrama de fundo */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 400 400"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="pentagramGlow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="pentagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B1E24" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#8B1E24" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8B1E24" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>

                  {/* Círculo externo */}
                  <circle
                    cx="200"
                    cy="200"
                    r="180"
                    fill="none"
                    stroke="url(#pentagramGradient)"
                    strokeWidth="2"
                    opacity={todasCartasReveladas ? "1" : "0.3"}
                    className="transition-opacity duration-1000"
                    filter="url(#pentagramGlow)"
                  />

                  {/* Pentagrama - estrela de 5 pontas */}
                  <path
                    d="M 200 50 L 238 162 L 350 162 L 269 238 L 307 350 L 200 274 L 93 350 L 131 238 L 50 162 L 162 162 Z"
                    fill="none"
                    stroke="url(#pentagramGradient)"
                    strokeWidth="2"
                    opacity={todasCartasReveladas ? "0.8" : "0.2"}
                    className="transition-opacity duration-2000 delay-500"
                    filter="url(#pentagramGlow)"
                  />

                  {/* Círculo interno */}
                  <circle
                    cx="200"
                    cy="200"
                    r="90"
                    fill="none"
                    stroke="url(#pentagramGradient)"
                    strokeWidth="1"
                    opacity={todasCartasReveladas ? "0.6" : "0.1"}
                    className="transition-opacity duration-1500 delay-1000"
                    filter="url(#pentagramGlow)"
                  />
                </svg>

                {/* Cartas posicionadas nos pontos do pentagrama */}
                <div className="relative w-full h-full">
                  {/* Carta 0 - Topo (12h) */}
                  <div className="absolute top-[8%] left-1/2 transform -translate-x-1/2">
                    <CartaTarot
                      carta={cartasTiradas[0]}
                      revelada={cartasReveladasStatus[0]}
                      modo={modo}
                      posicao="topo"
                    />
                  </div>

                  {/* Carta 1 - Superior Direita (2h) */}
                  <div className="absolute top-[25%] right-[12%] transform -translate-x-1/2">
                    <CartaTarot
                      carta={cartasTiradas[1]}
                      revelada={cartasReveladasStatus[1]}
                      modo={modo}
                      posicao="superior-direita"
                    />
                  </div>

                  {/* Carta 2 - Inferior Direita (4h) */}
                  <div className="absolute bottom-[20%] right-[28%] transform -translate-x-1/2">
                    <CartaTarot
                      carta={cartasTiradas[2]}
                      revelada={cartasReveladasStatus[2]}
                      modo={modo}
                      posicao="inferior-direita"
                    />
                  </div>

                  {/* Carta 3 - Inferior Esquerda (8h) */}
                  <div className="absolute bottom-[20%] left-[28%] transform translate-x-1/2">
                    <CartaTarot
                      carta={cartasTiradas[3]}
                      revelada={cartasReveladasStatus[3]}
                      modo={modo}
                      posicao="inferior-esquerda"
                    />
                  </div>

                  {/* Carta 4 - Superior Esquerda (10h) */}
                  <div className="absolute top-[25%] left-[12%] transform translate-x-1/2">
                    <CartaTarot
                      carta={cartasTiradas[4]}
                      revelada={cartasReveladasStatus[4]}
                      modo={modo}
                      posicao="superior-esquerda"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Indicador de progresso - fixo no centro inferior */}
            {ritualIniciado && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                {SEQUENCIA_REVELACAO.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      index <= indiceSequenciaAtual
                        ? "bg-blood-red shadow-lg"
                        : index === indiceSequenciaAtual + 1 && !aguardandoFecharModal
                          ? "bg-aged-bone animate-pulse"
                          : "bg-aged-bone/30"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Loading de processamento */}
            {processandoLeitura && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-aged-bone font-cinzel">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Consolidando a visão...
              </div>
            )}
          </div>

          {/* Área do diálogo - altura fixa */}
          {dialogoArcanos && (
            <div className="h-24 flex items-center justify-center px-4 border-t border-aged-bone/20 bg-deep-black/80 backdrop-blur-sm">
              <div className="text-center max-w-2xl">
                <p className="font-cinzel text-xs text-aged-bone/60 mb-1">Sequência dos Arcanos:</p>
                <p className="font-serifRegular text-aged-bone text-sm md:text-base leading-relaxed">
                  {dialogoArcanos}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botão flutuante para desktop (modo texto) */}
        {mostrarBotaoProxima && (
          <div className="hidden md:block fixed bottom-8 right-8 z-50">
            <Button
              onClick={handleIniciarRitualOuProxima}
              className="w-16 h-16 rounded-full bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel shadow-2xl transform hover:scale-110 transition-all duration-300"
              size="icon"
            >
              <div className="flex flex-col items-center">
                <Wand2 size={20} />
                <span className="text-xs mt-1">{indiceSequenciaAtual + 2}/5</span>
              </div>
            </Button>
          </div>
        )}

        {/* CTA fixo em mobile (modo texto) */}
        {mostrarBotaoProxima && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-deep-black/95 backdrop-blur-sm border-t border-blood-red/30 z-50">
            <Button
              onClick={handleIniciarRitualOuProxima}
              className="w-full bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel text-lg py-4 h-14 shadow-bone-dust"
            >
              <Wand2 className="mr-3 h-6 w-6" />
              Revelar Próxima Carta ({indiceSequenciaAtual + 2}/{TOTAL_CARTAS})
            </Button>
          </div>
        )}

        <FalaCartaModal isOpen={isModalFalaAberto} onOpenChange={handleFecharModalFala} carta={cartaModalAtual} />
      </div>

      {/* Síntese Narrativa Overlay */}
      {mostrarSintese && (
        <div className="fixed inset-0 bg-deep-black/95 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <SinteseNarrativa
              cartas={baralhoDaSessao}
              pergunta={pergunta}
              modo={modo}
              onFechar={() => setMostrarSintese(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}
